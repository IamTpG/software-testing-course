# API 3 (`POST /api/admin/coupons`) — Execution step log

## Structure: same 3-stage chained pattern as API 2
1. **`API 3a - Setup`**: login as the seeded admin (`admin@eshop.com`), register + login a
   fresh, uniquely-timestamped regular user. Captures `{{adminToken}}` and `{{userToken}}`.
2. **`API 3b - Create coupon (data-driven, 31 cases)`**: reuses `{{adminToken}}`.
3. **`API 3c - Verification & security`**: reuses both tokens — schema checks, the
   privilege-escalation cases (PC-29/30/EXT3-01), and standard auth-boundary checks.

## A data-contamination mistake caught mid-execution
The first attempt at stage 3b failed one case: **PC-33**'s SQL-injection-in-`code` payload
(`x'; DROP TABLE coupons; --`) hit the `code` column's `UNIQUE` constraint and got a
`500` instead of the expected `200`, because the *exact same string* had already been
inserted earlier in this session during manual `curl` verification (before the Postman
suite existed). Re-running the CSV a second time then failed on nearly *every* row, for
the same reason — the first run's unique codes (`HW06_UNIQ_1`, etc.) were already in the
database. Fixed properly rather than patched around:
- `POST /api/admin/coupons` doesn't actually depend on this — the real fix was making
  `API 3a`'s regular-user setup **register a fresh, uniquely-timestamped user** (mirroring
  API 2's pattern) instead of relying on a hardcoded pre-existing account, and
- reseeding the database (`node database.js`) to a clean baseline before the final,
  authoritative run.

This is a genuinely useful testing lesson, not just a fixed typo: test data with a
`UNIQUE` DB constraint isn't safely re-runnable against a live, un-reset database — a
real CI pipeline needs either a reset-per-run fixture or fully dynamic (timestamped)
values for every uniquely-constrained field, not just the user accounts.

## Final clean run
```
node database.js   # reseed to a clean baseline

newman run ... --folder "API 3a - Pool C - Setup (login as admin + regular user)" \
  --export-environment env1.json --reporters cli,htmlextra \
  --reporter-htmlextra-export ../results/23127244_API3_coupons_setup.html
newman run ... -e env1.json -d data/api3_coupons_create.csv \
  --folder "API 3b - Pool C - Create coupon (data-driven, 31 cases via CSV)" \
  --export-environment env2.json --reporters cli,htmlextra \
  --reporter-htmlextra-export ../results/23127244_API3_coupons_datadriven.html
newman run ... -e env2.json \
  --folder "API 3c - Pool C - Verification & security (privilege escalation)" \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export ../results/23127244_API3_coupons_verify.html
```
Results: **3/3, 31/31, 9/9 requests — 3 + 63 + 10 = 76/76 assertions pass.**
**Total: 45/45 test cases pass.** Reports in `results/`.

## Bugs identified (see the GitHub Issues bug report for full write-ups)
1. **Critical — SEC-03 completely unenforced (broken access control / privilege
   escalation).** Both `POST /api/admin/coupons` and `DELETE /api/admin/coupons/:id` only
   call `authenticateToken` — neither checks `req.user.role === 'admin'`, despite the spec
   explicitly documenting this whole section as admin-only. Confirmed live: a regular,
   non-admin user can create AND delete coupons end-to-end with zero admin involvement
   (EXT3-01). This is the most severe finding across all 3 selected APIs.
2. **Medium — several fields silently bypass their documented DB defaults, becoming
   `NULL` instead.** `type` (should default to `'percent'`), `min_order_amount` (should
   default to `0`), and any other omitted field all end up `NULL` because the handler
   always explicitly binds all 6 values via `?` placeholders — DB-level `DEFAULT`s never
   apply to an explicit `NULL` bind. Chains into a separate downstream bug (EXT3-02): a
   NULL-`type` coupon silently breaks `apply-coupon`'s percent/fixed branching logic.
3. **Low — no validation on `discount_value`, `expired_at`, or the `max_uses_per_user`
   fallback's inconsistency.** A percent-type coupon can be created with `discount_value:
   500` (500% off, PC-15); an already-expired or garbage-format `expired_at` is accepted
   as-is (PC-19/20); `max_uses_per_user:0` is silently "fixed" to `1` while `-5` is
   silently accepted unchanged (EXT3-03 — the same validation gap manifests two different,
   unpredictable ways depending on the JS-falsy boundary).

## What held up well (worth documenting as passing controls)
- **Auth presence/validity checks work correctly** (PC-31/32/36): missing header → 401,
  malformed token → 403, tampered signature → 403 — the JWT mechanism itself is sound;
  only the *role* check is missing.
- **The INSERT is genuinely parameterized** (PC-33/34): SQLi payloads in `code` and
  `expired_at` are stored as inert literal strings, no injection — a real contrast with
  API1's raw string-concatenated query.
- **No mass assignment here** (PC-27/EXT3-04): an attempt to set `is_active:0` via the
  request body is silently ignored — the handler's destructuring pattern (`const {code,
  type, ...} = req.body`) accidentally acts as a field allowlist, unlike API2's
  `userCarts[userId].push(req.body)`.
- **Error responses are JSON, not HTML** (PC-04/39): the duplicate-`code` constraint
  violation returns `{"error": "SQLITE_CONSTRAINT: ..."}` with `Content-Type:
  application/json` — still an information-disclosure concern (raw DB error text), but at
  least a consistent API contract, unlike API1's HTML error page.
