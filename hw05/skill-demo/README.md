# Agent Skill Demo — `jmeter-perf-testing` on `GET /api/products?search=`

Real, end-to-end output from `.claude/skills/jmeter-perf-testing/SKILL.md`, run against a new
endpoint not covered by the 3 graded scenarios (Load=`products/:id`, Stress=`forgot-password`,
Spike=`apply-coupon`). Demonstrates the skill is genuinely reusable, not just a document.

## What happened, in order (see `ai-audit-log/products-search.md` for full detail)

1. **Self-verification** — read the handler first. Found a real SQL injection bug
   (`server.js:143-145`, unparameterized `search` param), confirmed live and non-destructively.
   Logged as a draft bug report (`reports/github-issues-draft.md`, Issue 4) rather than posted —
   posting a working exploit payload publicly was correctly blocked, left for manual review.
2. **Empirical calibration** — burst-tested the endpoint (50 concurrent, mixed legitimate search
   terms) before picking any JMeter parameters: avg 13ms / max 21ms, cheap and fast.
3. **Build** — `test-plans/23127244_SkillDemo_20260815.jmx` (20 VU Load-style) +
   `data/23127244_SkillDemo_search_terms.csv`.
4. **Smoke test** — positive control (11/11 passed, CSV substitution confirmed) and negative
   control (11/11 failed with the expected message), proving the assertion is genuinely live.
5. **Real execution** — 1,059 samples, 0 errors, p95=3ms, max=26ms over 50s.
6. **Analysis** — recomputed percentiles independently from the raw `.jtl`, cross-checked against
   `statistics.json` — matched exactly.

## For the demo video

Walk through the 6 steps above in order, showing: the handler code + the SQL injection finding,
the calibration burst test, the generated `.jmx`/CSV, the smoke test's positive+negative runs, the
real execution with `top` in frame (same framing as the main 3 scenarios), and the final analysis
numbers. This folder is self-contained evidence for all of it — nothing here needs to be re-run
live during recording unless you want to show it happening in real time.
