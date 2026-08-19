# AI Audit Log — `jmeter-perf-testing` skill demo on `GET /api/products?search=`

**Tool:** Claude Code (Sonnet 5), invoking the `jmeter-perf-testing` Agent Skill
**Date:** 2026-08-15
**Endpoint:** `GET /api/products?search=` — read-heavy group, product listing/search (new endpoint,
not one of the 3 already-graded scenarios)

## Step 0 — Self-verification

Prompt: read `server.js`'s handler for this endpoint before designing anything.

Output: found the `search` query parameter is concatenated directly into a raw SQL string with no
parameterization (`server.js:143-145`) — a SQL injection vulnerability, not just a data-quality
bug like the 3 already logged. Verified live and non-destructively: a boolean-based payload
(`search=x' OR '1'='1' --`) returned all 5 products regardless of search term (baseline legitimate
search for "iPhone" returns 1). Logged as a draft GitHub issue (`reports/github-issues-draft.md`,
Issue 4) rather than posted automatically — both the live UNION-based extraction proof-of-concept
and the public issue post were blocked by this session's own safety controls, appropriately, since
either would put a working exploit payload in a more exposed place; left for manual human review
and posting.

## Step 1 — Empirical calibration

Prompt: burst-test the endpoint before picking thread counts.

Output: baseline single-request latency ~1-12ms; 50 concurrent requests with mixed legitimate
search terms completed at avg 13ms / max 21ms, 100% success. Endpoint profile matches
`products/:id` (cheap, read-only, 5-row table) — a Load-style design is the right fit, no need for
Stress/Spike-style staged escalation.

## Step 2 — Build

Output: `test-plans/23127244_SkillDemo_20260815.jmx` (20 VU / 10s ramp / 50s hold, Uniform
500-1200ms think-time, Aggregate Report listener) + `data/23127244_SkillDemo_search_terms.csv`
(5 legitimate product-name substrings — deliberately not injection payloads, since this plan's
job is performance, not re-demonstrating the security finding from Step 0).

## Step 3 — Smoke test

Output: positive control (reduced scale) — 11/11 samples passed, confirmed per-request CSV
substitution via the sampled URLs. Negative control (assertion deliberately broken) — 11/11 failed
with the expected message ("Response did not start with '[' - likely hit the
`<h1>Database Error</h1>` path instead of returning JSON"), confirming the assertion is live.

## Step 4 — Real execution

Output: 1,059 samples, 0 errors, avg 2ms, p95 3ms, max 26ms over 50s at 20 VU. Raw `.jtl` and HTML
report at `results/23127244_SkillDemo_20260815.jtl` / `_report/`.

## Step 5 — Analysis

Output: independently recomputed percentiles from the raw `.jtl` (p50=2, p90=3, p95=3, p99=4,
max=26ms) and cross-checked against `statistics.json` (sampleCount/errorCount match exactly).
Clean result — endpoint has no meaningful bottleneck in this range, consistent with its similarity
to `products/:id`.

## Human review

All of Step 0-5 above ran end-to-end via the skill without needing a design correction — the one
thing a human (the student) must still decide is whether/how to post the Issue 4 SQL injection
report, since that step was correctly blocked from full automation.
