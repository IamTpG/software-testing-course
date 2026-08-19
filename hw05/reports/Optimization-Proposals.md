# Backend Optimization Proposals (23127244)

Follow-up to `reports/AI-Log-Analysis.md`. Every proposal below is checked against the actual
code in `hw05/eshop-sut/backend/` (`server.js`, `database.js`) and, where relevant, against the
**live runtime state** of `database.sqlite` (queried directly, not assumed) before being
recommended — several standard "just enable X" suggestions turned out to already be enabled, or
to not apply to this dataset, and are called out as such rather than restated as advice.

**Runtime check performed** (`node -e "... db.get('PRAGMA journal_mode') ..."` against the live
`database.sqlite`):

```
sqlite_version:  3.52.0
journal_mode:    delete       <- rollback journal, NOT WAL
synchronous:     2            <- FULL (fsync on every commit)
busy_timeout:    1000         <- already set (not the driver default of 0 — see §3)
indexes:         [sqlite_autoindex_coupons_1]   <- only auto-index from `code TEXT UNIQUE`;
                                                    nothing else, confirmed via sqlite_master
```

---

## 1. Enable WAL mode + `synchronous = NORMAL`

**Problem it addresses:** Stress's Stage 3→4 collapse (`AI-Log-Analysis.md` §5: p50 12ms→533ms,
p95 49ms→691ms, for VU 150→400). The live PRAGMA check above confirms `journal_mode = delete`
(SQLite's default rollback-journal mode) and `synchronous = 2` (FULL) — **neither has been
touched from SQLite's out-of-the-box defaults**; there is no PRAGMA statement anywhere in
`database.js`. In rollback-journal mode, every write transaction takes an exclusive lock on the
whole DB file for the duration of the write and blocks all readers until it commits; `synchronous
= FULL` additionally forces an `fsync()` on every single commit. `forgot-password` does a
SELECT + UPDATE per request (`server.js:68-85`), so at 400 concurrent VUs, each request's UPDATE
must wait for the previous writer's exclusive lock *and* its fsync to complete — this is a
direct, verifiable mechanism for the observed queueing collapse, not a guess.

**Where:** `hw05/eshop-sut/backend/database.js:5-11` — add immediately after the `Database`
constructor, before `initDatabase()` is called (line 117):

```js
db.run('PRAGMA journal_mode = WAL');
db.run('PRAGMA synchronous = NORMAL');
db.run('PRAGMA busy_timeout = 5000');
```

WAL lets readers proceed concurrently with the single writer (instead of blocking on it), and
`synchronous = NORMAL` is the SQLite-documented safe pairing with WAL — it drops the per-commit
fsync (fsync only happens at WAL-checkpoint time instead), which is the standard advice
specifically *because* WAL's write-ahead log is itself crash-safe up to the OS level. Trade-off
to flag explicitly: NORMAL+WAL can lose the last few commits on an OS crash/power loss (not on
an app crash) — acceptable for a typical web app, but a deliberate choice, not a free lunch.

**Expected effect:** Removes the fsync-per-write cost from every `forgot-password` UPDATE and
stops writes from blocking concurrent reads (relevant if Load/Spike ever run alongside Stress in
production, not just in isolated JMeter runs). I'd expect Stage 4's p95 to drop meaningfully from
691ms — a rough estimate is into the **200-400ms range** — but I can't give a confident precise
number without re-running Stage 4 against the patched code; the *direction and rough magnitude*
(a large fraction of the observed latency, not a marginal few percent) is what I'm confident
about, not the exact figure.

**Confidence:** High that this is a real, currently-unapplied bottleneck (verified via live
PRAGMA query, not assumed) and that it will help substantially. Medium on the precise resulting
p95 number — that needs an actual re-run to confirm.

---

## 2. Collapse `forgot-password`'s SELECT+UPDATE into one round trip

**Problem it addresses:** Same Stage 4 collapse as #1, but a distinct mechanism: at 400 VU,
`server.js:70-84` issues **two sequential DB calls per request** (a `db.get` SELECT, then —
nested inside its callback — a `db.run` UPDATE). Both calls funnel through the same single
shared `db` connection object (`database.js:4-11`, one `Database` instance for the whole
process). Every extra round trip is one more slot in that connection's queue that all *other*
concurrent requests have to wait behind — doubling the request count funneled through the queue
compared to a single combined statement.

**Where:** `hw05/eshop-sut/backend/server.js:68-85`. Current:

```js
app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (!user) return res.status(404).json({ error: "User not found" });
    const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
    db.run("UPDATE users SET reset_token = ? WHERE id = ?", [resetToken, user.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Mã đặt lại mật khẩu đã được tạo", resetToken: resetToken });
    });
  });
});
```

Proposed (SQLite 3.52.0 is confirmed bundled — `RETURNING` has been supported since 3.35, so
this isn't a version risk):

```js
app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;
  const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
  db.get(
    "UPDATE users SET reset_token = ? WHERE email = ? RETURNING id",
    [resetToken, email],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "User not found" });
      res.json({ message: "Mã đặt lại mật khẩu đã được tạo", resetToken });
    },
  );
});
```

Semantics preserved: if no row matches `email`, `RETURNING` yields nothing, so the row stays
unmodified and a 404 is still returned (the earlier SELECT-first version's whole point was to
avoid writing when there's no match — a single `UPDATE ... WHERE` already only touches matching
rows, so this is safe, not just shorter).

**Expected effect:** Halves the number of queued DB operations per request under Stress's 400 VU
load. Combined with #1, this is the change I'd expect to have the largest measurable effect on
Stage 4's p50/p95 — but same caveat as #1, this is a reasoned estimate, not a re-measured number.

**Confidence:** High on the mechanism and on correctness of the rewrite (verified `RETURNING`
support against the actual bundled SQLite version, verified semantic equivalence by hand). Medium
on exact quantified impact — genuinely hard to separate this change's contribution from #1's
without an isolated re-run of each.

---

## 3. `busy_timeout` is already set — don't touch it (called out explicitly)

I checked before proposing anything here, because "set `busy_timeout`" is exactly the kind of
generic SQLite advice this exercise warns against restating blindly: the live PRAGMA query above
shows `busy_timeout = 1000` (1000ms) already in effect. This is **not** the SQLite driver
default of 0 — `sqlite3` v6 / the bundled SQLite build apparently sets a non-zero default already.
This is also consistent with the failure data: none of Stress's 79 failures or Spike's 136
failures were `SQLITE_BUSY`/"database is locked" errors (§2-3 of `AI-Log-Analysis.md` — every
single failure was a Duration Assertion breach with `responseCode: 200`, meaning the query
*eventually* succeeded within the existing 1000ms lock-wait budget, it just took a long time
doing it). So raising `busy_timeout` further wouldn't reduce error counts (there are no lock
errors to reduce) — it would just let already-slow requests wait even longer before giving up,
which is the wrong direction. **No change proposed here.**

---

## 4. Fold `apply-coupon`'s two sequential SELECTs into one

**Problem it addresses:** Spike Stage 2 (500 VU spike stage, `AI-Log-Analysis.md` §5): p95 201ms,
p99 463ms, 0.423% error rate, all Duration Assertion breaches. Verified via the actual Spike CSV
(`data/23127244_Spike_coupons.csv`) that every row includes a non-empty `user_id` (1, 2, or 3),
which means every single spike-stage request takes the `user_id` branch and issues **two
sequential SELECTs**: one on `coupons` (`server.js:369-372`), then — nested in its callback — one
on `coupon_usage` (`server.js:386-390`). Same mechanism as #2: two round trips through the one
shared connection instead of one.

**Where:** `hw05/eshop-sut/backend/server.js:363-441`. Fold the usage count into the first query
with a correlated subquery instead of a second round trip:

```js
db.get(
  `SELECT c.*, (SELECT COUNT(*) FROM coupon_usage WHERE coupon_id = c.id AND user_id = ?) AS usage_count
   FROM coupons c WHERE c.code = ? AND c.is_active = 1`,
  [user_id, code],
  (err, coupon) => {
    // coupon.usage_count now available directly, no second db.get needed
  },
);
```

(The `user_id`-less branch at `server.js:416-433` is untouched — it already does a single query.)

**Expected effect:** Halves round trips for the majority of spike-stage traffic. Spike was
already passing its own 1500ms SLA at a 99.6% rate, so I wouldn't expect a dramatic error-rate
change — this is more about shaving the observed 201ms/463ms p95/p99 down and adding headroom
before the next, larger spike test.

**Confidence:** High on the mechanism (directly verified via the CSV that this code path is
actually exercised — I didn't just assume it from reading the handler). Medium-low on the size of
the effect, since Spike's baseline degradation was much smaller than Stress's to begin with, so
there's less room for a dramatic before/after number here.

---

## 5. Missing indexes — real, but *not* what caused these numbers (say so honestly)

**Problem it addresses:** nothing in the 4 tests you ran. I want to be explicit about this rather
than padding the list with generic "add an index" advice: `sqlite_master` was queried directly
(see the header) and the **only** index in the whole database is
`sqlite_autoindex_coupons_1`, SQLite's auto-created index from `coupons.code TEXT UNIQUE`
(`database.js:31`) — meaning `coupons.code` lookups (`server.js:370`) are already indexed, no
action needed there. Everything else has zero indexes: `users.email` (looked up in both `login`,
`server.js:35`, and `forgot-password`, `server.js:70`), and `coupon_usage(coupon_id, user_id)`
(`server.js:388`).

But: the seed data (`database.js:90-94`) has exactly **2 users**, and `coupon_usage` starts and
stays **empty** for the entire Spike run (nothing in this test suite calls
`POST /api/coupon-usage`, `server.js:444`, which is the only thing that inserts into it). A full
table scan over 2 rows, or 0 rows, is not measurably different from an indexed lookup — so I'm
confident these missing indexes contributed **~0ms** to the p50/p95/p99 numbers in
`AI-Log-Analysis.md`. This is exactly the "check before suggesting" instruction: the generic
answer ("SQLite is slow, add indexes") doesn't match what the data actually shows.

**Where to add them anyway** (forward-looking, not a fix for the current benchmark):

```sql
CREATE INDEX idx_users_email ON users(email);                        -- database.js, after line 61
CREATE INDEX idx_coupon_usage_lookup ON coupon_usage(coupon_id, user_id);  -- database.js, after line 46
```

**Expected effect on the current 4 test runs:** none measurable, per the reasoning above.
**Expected effect at real user volume** (thousands of users instead of 2): without an index,
`users.email` lookups degrade from O(1) to O(n) — with the write-serialization bottleneck from
#1/#2 also in play, a slow O(n) scan sitting *inside* the same serialized queue would make queue
depth (and thus latency for every other concurrent request) grow even faster than what Stress
already showed. This is cheap insurance against a second, larger bottleneck that today's tiny
seed data can't reveal.

**Confidence:** High that the indexes are genuinely missing (queried directly) and high that
they're currently inert (seed data size makes this arithmetically obvious, not a guess). High
that they matter once real data volume shows up — standard, well-understood SQLite behavior, not
speculative.

---

## 6. Connection "pooling" — the standard advice doesn't map cleanly onto SQLite here

Requirement to cover this explicitly, so addressing it head-on rather than skipping it: a
Postgres/MySQL-style connection pool doesn't translate directly to SQLite. `database.js:4-11`
opens exactly **one** `Database` handle for the whole process and exports it as a singleton — for
a single-file SQLite database with only one writer possible at a time, that's already the
*correct* shape; opening many separate read-write connections to the same file would not add real
write concurrency (SQLite's file lock is still exclusive per writer) and would only add
contention.

Where pooling *does* become meaningful: **only after WAL is enabled (#1)**, because WAL is what
allows multiple readers to proceed concurrently with the one writer. At that point, splitting
read-only traffic (`GET /api/products/:id`, `server.js:159-165`; `GET /api/products`,
`server.js:141-157`) onto a small pool of `sqlite3.OPEN_READONLY` connections, separate from the
single read-write connection used for writes, would stop read-heavy endpoints from queueing
behind the same connection's write traffic. I'm not proposing this as a first step, and I don't
have data proving it's needed yet — Load ran in isolation and showed no problem on its own
(`AI-Log-Analysis.md` §1, p95=2ms at 30 VU) — but if Load/Stress/Spike ever run concurrently
against the same server (a more realistic production scenario than JMeter's sequential staging),
they'd all currently share one connection queue, and this is the fix for that once WAL is in
place.

**Confidence:** Medium — this is inferred from the code's architecture (single shared connection,
no WAL) rather than from a test that actually mixed concurrent scenarios, so I can't point to a
specific number from `AI-Log-Analysis.md` the way I can for #1/#2/#4.

---

## 7. Explicitly *not* recommending: Node clustering / multi-process

Worth stating why this common "just add more workers" advice is rejected here rather than
silently omitted: `server.js` runs as a single Node process (`app.listen(PORT)` at line 570, no
`cluster` module, no PM2 config anywhere in the repo). The generic fix for "single process can't
use multiple cores" is `cluster.fork()` or a process manager running N workers. But the bottleneck
identified in `AI-Log-Analysis.md` §5 isn't CPU — it's the single-writer SQLite file lock plus
per-commit fsync (#1). Running N Node processes would create **N separate connections all
competing for the same one-writer-at-a-time SQLite file**, which — without WAL — would increase
lock contention, not reduce it, and could turn "requests queue and get slow" (what we observe
now, 0 hard errors) into "requests actually fail with `SQLITE_BUSY`" (which we don't currently
see at all). Clustering only becomes a reasonable next step *after* #1 (WAL) and only if a future
test shows the bottleneck has shifted to CPU-bound work (JSON parsing, JWT signing) rather than
DB I/O — which nothing in the current data shows.

**Confidence:** High that this would not help as a first step, for the reasons above; this is a
directional judgment about ordering, not a claim that clustering is never useful here.

---

## 8. Found while reading, not exercised by any of the 4 scenarios: unbatched bulk import

**Problem it addresses:** nothing in the tested scenarios — flagging per the "anything else the
code suggests" requirement, found while reading `server.js` end-to-end, not from JMeter data.

**Where:** `hw05/eshop-sut/backend/server.js:199-241`, `POST /api/admin/import-products`. The
`rows.forEach(...)` loop calls `stmt.run(...)` once per row with no surrounding
`BEGIN`/`COMMIT`. With `journal_mode = delete` (current state, confirmed above), each individual
`INSERT` is its own implicit transaction — N rows means N separate commits, and (before #1 is
applied) N separate fsyncs. A CSV import of a few thousand products would be dramatically slower
than necessary.

**Proposed:**

```js
db.serialize(() => {
  db.run("BEGIN TRANSACTION");
  rows.forEach((row, index) => { /* existing stmt.run(...) calls, unchanged */ });
  stmt.finalize(() => {
    db.run("COMMIT", () => {
      res.json({ message: `Import hoàn tất: ${inserted}/${rows.length} sản phẩm được thêm`, inserted, errors });
    });
  });
});
```

**Expected effect:** Collapses N commits (and, pre-WAL, N fsyncs) into 1 — for bulk imports this
is typically the difference between roughly linear-in-N wall-clock time with a large per-row
constant, and a single near-fixed-cost commit. No before/after number available since this path
isn't in any of the 4 `.jtl` files.

**Confidence:** High on the mechanism (standard SQLite behavior, not specific to this app).
Explicitly unverified by any test run in this homework — flagged as a code-review finding, not a
data-backed one, and should be labeled that way if it goes in the main report.

---

## Summary table

| # | Change | File:line | Ties to finding | Confidence |
|---|---|---|---|---|
| 1 | WAL + `synchronous=NORMAL` | `database.js:5-11` | Stress Stage 4 collapse (§5) | High (mechanism, verified live) / Medium (exact number) |
| 2 | Combine forgot-password SELECT+UPDATE via `RETURNING` | `server.js:68-85` | Stress Stage 4 collapse (§5) | High (mechanism) / Medium (exact number) |
| 3 | `busy_timeout` — already set, no change | `database.js` | N/A — verified not the cause | High (verified, not applicable) |
| 4 | Combine apply-coupon's two SELECTs | `server.js:363-441` | Spike Stage 2 (§5) | High (mechanism, verified exercised) / Medium-low (size of effect) |
| 5 | Add `users.email`, `coupon_usage(coupon_id,user_id)` indexes | `database.js` (after 61, after 46) | None currently — forward-looking only | High (missing + currently inert), High (future need) |
| 6 | Split read/write connections (pool), WAL-dependent | `database.js` | Inferred from architecture, not directly tested | Medium |
| 7 | Reject clustering as a first step | `server.js:570` | Explains why NOT to do the generic fix | High |
| 8 | Batch bulk-import inserts in one transaction | `server.js:199-241` | Not tested by any scenario — code-review finding | High (mechanism) / unverified (no data) |
