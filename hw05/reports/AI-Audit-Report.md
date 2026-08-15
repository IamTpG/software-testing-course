# AI Audit Report — HW05 (23127244)

*I use AI tools for the following tasks.* All work below used **Claude Code (Sonnet 5)** as the
primary AI tool, driving JMeter test-plan design, execution, log analysis, and report writing
throughout, plus one deliberately **independent fresh Claude session** (no access to this
session's context) for Task 2's analysis step, per Section 6's requirement that the analysis and
the review be genuinely separate. Date: 2026-08-15 (Asia/Ho_Chi_Minh, ICT). Full raw commit-level
detail: `reports/Git-Commit-Log.txt`.

---

## Part A — Main session (Claude Code, Sonnet 5)

### 18:24–18:42 — Environment setup (Phase 0)

**Prompt (paraphrased from a multi-turn conversation):** clone the SUT, install JMeter, verify the
3 target endpoints, without hunting for tooling I didn't already have.

**Output:** vendored `eshop-sut` into `hw05/eshop-sut/`; found no `java`/`jmeter`/`sudo`-without-
password available, so downloaded and checksum-verified a portable JDK 21 + Apache JMeter 5.6.3
into `hw05/tools/` (gitignored) rather than requesting a system install; confirmed all 3 target
endpoints respond correctly against the live backend.

### 18:42–19:13 — Task 1: AI-assisted design, all 3 scenarios (Phase 1)

**Prompt (per scenario, step-by-step, not a single generic prompt):** for each of Load
(`GET /api/products/:id`), Stress (`POST /api/forgot-password`), and Spike
(`POST /api/apply-coupon`), design realistic JMeter parameters (thread counts, ramp-up, think-
time, assertions, listener type), justifying every number against the endpoint's actual behavior.

**Output:**
- **Load** — read the handler first (`server.js:159-165`) and found two real bugs (price field
  type flips string/number by product-id parity; nonexistent id returns 200 instead of 404)
  before proposing 30 VU / 30s ramp / 300s hold, Gaussian think-time. Smoke-tested with a
  deliberately-broken negative control to prove the assertion was genuinely live, not inert XML.
- **Stress** — read the handler (write-heavy, SQLite single-writer), burst-tested the live
  endpoint at 20→700 concurrent *before* picking thread counts (no hard errors even at 700, only
  growing latency — meant response-code-only assertions would never trip, so added a Duration
  Assertion). On review feedback, recalibrated Stage 4 from 300→400 VU after the data suggested
  300 risked an inconclusive breaking point. Built as 4 sequential Thread Groups (no plugins
  needed). Smoke-tested positive + negative control.
- **Spike** — found a real coupon-discount calculation bug during design (`server.js:398-401`,
  percent-type coupons compute a large *negative* discount). Burst-tested up to 2000 concurrent
  (no breaking point found — a genuine finding, not a design gap) before locking in a 3-stage
  baseline→spike(500VU)→recovery design. Smoke-tested with two separate negative controls.

All 3 `.jmx` + CSVs reviewed and explicitly signed off by the student before being treated as
final (see `TASKS-CHECKLIST.md` Phase 1).

### 19:16–22:01 — Task 1: execution, evidence, bug reporting (Phase 2)

**Prompt:** instruct the student on exactly what commands to run for the real recorded execution
(backend + resource monitor + JMeter, in the right terminals), and warn about anything that could
silently corrupt the evidence.

**Output:** `RUN-COMMANDS.md` copy-paste reference; discovered and flagged that JMeter **appends**
to an existing `.jtl` filename rather than overwriting it (verified by running the same plan twice
into one file and inspecting the merged output) — added explicit cleanup steps before any final
recorded run. Drafted a Vietnamese narration script (content outline, not a script to recite
verbatim) and a plain-language JMeter-console-reading cheat sheet for the student to use live on
camera. After the student provided the real run's screenshots/video link, renamed/matched them to
scenarios by reading image content (not filenames), and redacted the `Machine ID` line (kept
hostname visible) across all 3 before committing, since they go into a public repo. Explained why
the real Spike run showed 136 errors that the design-time probes hadn't predicted (all HTTP 200,
all Duration Assertion breaches — sustained JMeter load plus JVM overhead on the same laptop
reveals latency a one-shot curl burst doesn't). Drafted and (with authorization) posted 3 bug
reports found during design to GitHub Issues (#7, #8, #9).

### 22:01–22:36 — Endurance/soak test (Phase 3)

**Prompt:** design and run a 10-15 min sustained-load test to empirically find the hardware's
threshold, with concrete numbers.

**Output:** calibrated 150 VU (the last clean stage from Stress's own data) sustained for 12
minutes against `forgot-password`, plus a parallel backend memory sampler (`ps` every 10s). Ran
the real 12-minute test in the background (no video/screenshot required by Section 6 for this
specific step) and reported: 285.6 req/s sustained, 0% errors across 209,748 samples, no
degradation trend in any of the 12 per-minute buckets; peak memory 192.6MB during warm-up, settling
to a healthy 88-116MB steady state (not a leak). Full writeup: `reports/Endurance-Threshold.md`.

### 22:36 — Demo video confirmation (Phase 4)

Student confirmed the previously-provided YouTube link (`https://youtu.be/GmoYPY6HPyg`) was
already the full narrated recording of all 3 scenarios, not a placeholder — no further AI
interaction needed for this deliverable beyond the earlier narration-script drafting.

### 23:12–23:17 — Task 2 review (Phase 5)

See **Part B** below for the actual analysis prompts (run in an independent fresh session). This
session's role was: design the 2 self-contained prompts, then independently re-verify the fresh
session's output against the raw data before accepting any of its claims — see
`reports/AI-Misinterpretation-Hunt.md` for the full verification table (recomputed medians via a
separate calculation, re-queried live database PRAGMA state, and literally executed both proposed
SQL rewrites against a copy of the real database rather than just reading them for plausibility).

### 23:19 — Task 3 (Phase 6)

**Prompt:** design a continuous performance-testing model (commit-triggered, decides whether to
run perf tests, flags p95 regressions), with a flow chart and a cost/false-alarm trade-off
discussion — grounded in this homework's own actual findings, not a generic template.

**Output:** `reports/Continuous-Performance-Testing-Proposal.md` — a tiered decision model
(Skip/Smoke/Regression/Full) driven by path filters and event type, justified by the real
asymmetry found in Tasks 1-2 (Load has no cliff, Stress/Spike do, Endurance's cost only justifies
nightly frequency). Includes a Mermaid flow chart and trade-off analysis citing real observed
variance from this homework's own Stress run as evidence for why a single-run threshold is noisy.

### 23:19–23:29 — Agent Skill (Phase 7)

**Prompt:** build a reusable Agent Skill encoding this homework's actual workflow discipline, then
demonstrate it end-to-end on a new endpoint, not one of the 3 already-graded scenarios.

**Output:** `.claude/skills/jmeter-perf-testing/SKILL.md`. Demonstrated on
`GET /api/products?search=`: Step 0 (self-verify) found a genuine SQL injection vulnerability
(unparameterized `search` param) — confirmed live and non-destructively via a boolean-based bypass
(5/5 products returned regardless of search term). Attempting to further prove the vulnerability's
severity via a `UNION SELECT`-based credential-extraction proof-of-concept was **blocked by this
session's own safety controls**, appropriately, even on a local intentionally-vulnerable practice
system; posting the write-up to the public repo was **also blocked** for the same reason (a live
exploit payload going public). Both left for the student's manual review/decision rather than
worked around. Steps 1-5 (calibrate/build/smoke-test/execute/analyze) completed cleanly: 1,059
samples, 0 errors, p95=3ms. Full trail: `skill-demo/README.md`,
`skill-demo/ai-audit-log/products-search.md`.

---

## Part B — Independent fresh session (Claude, no access to Part A's context)

Per the student's explicit design: only the 2 prompts below were given to a separate, fresh Claude
Code session in this same repo — no conversation history, no hints about what the "expected"
answer should be. Its raw output was then independently re-verified in Part A (23:12-23:17) rather
than trusted.

### Prompt 1 — Analysis & thresholds

Full prompt text and full output: `reports/AI-Log-Analysis.md` (the report itself documents the
prompt at the top). Summary of output: per-scenario stats computed directly from the raw `.jtl`
files (not the HTML dashboard), failure classification for all 4 scenarios, a per-stage breakdown
of Stress, a per-minute breakdown of Endurance, proposed CI thresholds, and — the most significant
finding — that the pre-generated `statistics.json` dashboard reports a **6.5x-wrong median**
for Stress (175ms vs. the true 27ms), attributed to JMeter's dashboard using an approximate
percentile estimator that loses accuracy on bimodal distributions.

### Prompt 2 — Optimization proposals

Full prompt text and full output: `reports/Optimization-Proposals.md`. Summary of output: 8
proposals (WAL mode, two query-collapsing rewrites, index additions explicitly scoped as
currently-inert-but-forward-looking, a reasoned rejection of naive connection pooling, a reasoned
rejection of Node clustering as a first step, and one code-review-only finding about unbatched
bulk-import transactions), each tied to a specific finding from Prompt 1 and checked against live
runtime state (queried `PRAGMA` values and `sqlite_master` directly) rather than generic advice.

---

## Verification methodology (applies to both parts)

Every design decision above that could be checked against reality, was — see inline citations to
file:line and to raw commands throughout. The one consistent pattern across this whole homework:
**read the real code, hit the real endpoint, and recompute the real numbers before trusting any
claim** — including claims produced by this same AI tool in an earlier step. Where that discipline
surfaced a security-sensitive action (the SQL injection proof-of-concept extensions), the session's
own safety controls correctly stopped automatic execution and left the decision to the student.
