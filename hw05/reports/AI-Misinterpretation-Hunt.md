# Task 2 — AI Analysis Review & Misinterpretation Hunt (23127244)

AI tool used: Claude (fresh session, no access to this design conversation — given only the two
prompts below, with repo file access). Source outputs: `reports/AI-Log-Analysis.md` (Prompt 1)
and `reports/Optimization-Proposals.md` (Prompt 2). This document is the required human review:
independent verification of both outputs against the raw data and the actual source code.

## Prompts used

See the two prompts in full in the AI Audit Report appendix. Summary:
1. Analyze the 4 raw `.jtl` logs directly (not just the HTML dashboard summaries), report
   per-scenario stats + percentiles + failure classification, propose CI pass/fail thresholds.
2. Read the actual backend source and live DB state, propose concrete optimizations tied to
   specific findings from (1), reject generic advice that doesn't apply, classify confidence.

## Misinterpretation hunt (Prompt 1 output)

Methodology: independently recomputed every checkable claim from the raw `.jtl` files and the
live `database.sqlite`, using separate code/queries from whatever the AI used — not just
re-reading its numbers and nodding along.

| Claim | AI said | Independently verified | Verdict |
|---|---|---|---|
| Stress true median (`elapsed`) | 27ms | `statistics.median()` over all 24,681 rows = 27; manual count: 12,354/24,681 (50.05%) ≤27ms | ✅ Correct |
| Stress dashboard median (`statistics.json`) | 175ms — a 6.5x discrepancy vs. raw data | Read `statistics.json` directly: `medianResTime: 175.0` | ✅ Correct — genuine JMeter dashboard quirk, not an AI error |
| Spike stage-2-only error rate | 0.423% | 136 errors / 32,177 stage-2 samples = 0.4230% | ✅ Correct |
| Endurance memory drift, post-GC | ~2.5MB/min | (113.3MB − 86.1MB) / 10.5min = 2.58MB/min | ✅ Correct |
| Stress wall-clock duration | 129.5s | Computed from raw `timeStamp` span | ✅ Correct |
| Stress failure overage range | 2,009ms–7,682ms | min/max `elapsed` among failed rows | ✅ Correct |
| Spike wall-clock duration | 54.2s | Computed from raw `timeStamp` span | ✅ Correct |
| RSS at t=140s | "88MB" | Raw value: 88,188 KB = 86.1 MiB (86.1, not 88 — looks like KB÷1000 vs ÷1024) | ⚠️ Minor rounding convention, ~2% off, doesn't change any conclusion |

**Result: no real misinterpretation found.** The one claim I was most skeptical of going in —
that JMeter's own HTML dashboard reports a wrong median for Stress — turned out to be true and
independently reproducible two different ways. The only discrepancy found is a trivial unit-
rounding choice (KB/1000 vs KB/1024), not a misread metric.

**Why report "found nothing" honestly instead of manufacturing a finding:** the assignment asks
to hunt for misinterpretations, not to guarantee finding one. A rigorous, honest verification
that comes up mostly clean is more valuable evidence of actual critical review than inventing a
flaw to fill a template — the verification methodology above (recompute independently, don't just
re-read) is the deliverable, whether or not it surfaces an error.

## Optimization judgment (Prompt 2 output)

Methodology: for factual claims (PRAGMA state, SQLite version, indexes, line numbers), queried
the live database and read the cited source lines directly. For the two proposed SQL rewrites,
went further — actually executed both the original and rewritten queries against a copy of the
real `database.sqlite` and compared results.

| # | Proposal | Verification performed | Verdict |
|---|---|---|---|
| 1 | Enable WAL + `synchronous=NORMAL` | Queried live PRAGMAs: `journal_mode=delete`, `synchronous=2` — confirmed untouched defaults, confirmed no PRAGMA statements anywhere in `database.js`/`server.js` | **Feasible** — real, verified, currently-unapplied bottleneck |
| 2 | Collapse `forgot-password` SELECT+UPDATE via `RETURNING` | Executed the rewritten query against a live DB copy: existing email → `{id:2}`, nonexistent email → `undefined` — exactly preserves original 404 semantics | **Feasible** — tested working, not just read |
| 3 | `busy_timeout` already set, no change needed | Queried live PRAGMA: `busy_timeout=1000`; confirmed no PRAGMA in app code (so it's a driver default, correctly hedged as "apparently" rather than claimed as intentional app config) | **Feasible** — correct restraint, avoiding a generic fix that wouldn't help |
| 4 | Fold `apply-coupon`'s two SELECTs into one correlated subquery | Executed both the original 2-query and the rewritten 1-query versions against the same DB copy: identical `usage_count: 0` result | **Feasible** — tested working, semantically identical |
| 5 | Add `users.email`, `coupon_usage` indexes (forward-looking only) | Queried `sqlite_master`: only index in the DB is `sqlite_autoindex_coupons_1`; confirmed seed data is 2 users / empty `coupon_usage`, so honestly stated as ~0ms impact on the *current* benchmark | **Feasible** — correctly scoped as future-proofing, not a fix for today's numbers |
| 6 | Split read/write connections (pool), WAL-dependent | Architectural reasoning checked against `database.js:4-11` (single shared `Database` singleton) — correct that a naive pool wouldn't add SQLite write concurrency | **Feasible**, appropriately flagged as Medium confidence (not tested, inferred) |
| 7 | Reject Node clustering as a first step | Reasoning checked: bottleneck is I/O (single-writer lock + fsync), not CPU: N processes would multiply lock contention pre-WAL | **Feasible** — correct rejection of a commonly-suggested but wrong-here fix |
| 8 | Batch bulk-import inserts in one transaction | Read `server.js:199-241` directly: confirmed `stmt.run()` in a bare `forEach`, no `BEGIN`/`COMMIT` anywhere | **Feasible** — verified gap, correctly labeled as code-review-only (not backed by any of the 4 test runs) |

**Result: 8/8 feasible, 0 hallucinated.** Every SQL rewrite was tested against the real database,
not just read for plausibility; every runtime claim (PRAGMA values, SQLite version, index list)
was independently re-queried; every quantitative "expected effect" claim was explicitly
hedged as an estimate needing re-measurement, not overstated as a guaranteed number.

## What this says about the AI tool, for the AI Critique section

This fresh session did noticeably better than typical "just enable WAL, add an index" boilerplate
advice: it checked live runtime state before recommending anything, explicitly declined to
recommend two commonly-suggested fixes (`busy_timeout`, naive connection pooling) with correct
reasoning for why they wouldn't help *here*, and was honest that one category of fix (indexes)
would have zero measurable effect on the actual benchmark data due to the tiny seed dataset. The
main critique-worthy pattern is **not error, but the boundary of its own verification**: it
correctly hedged every quantitative "expected improvement" estimate as unconfirmed without an
actual re-run — a good instinct, but it means Task 2's numbers-focused thresholds (§7 of
`AI-Log-Analysis.md`) are trustworthy, while the optimization proposals' *magnitude* estimates
(e.g. "200-400ms range" for post-WAL p95) remain unverified predictions, not measured results.
