# HW05 — Tasks Checklist (23127244)

Chosen endpoint groups (posted to groupmates to avoid duplication):

| Group | Endpoint | Scenario |
|---|---|---|
| Read-heavy | `GET /api/products/:id` (product detail) | Load |
| Auth-heavy | `POST /api/forgot-password` | Stress |
| Transactional | `POST /api/apply-coupon` | Spike |

Legend: `[ ]` to do · `🔴 MANUAL` = cannot be delegated to AI, must be done by hand.

---

## Phase 0 — Setup (endpoint-agnostic, safe to do immediately)

- [x] Clone `eshop-sut` into `hw05/eshop-sut/`, run backend locally (`node server.js`, port 3000), confirm all 3 target endpoints respond: `GET /api/products/:id` → 200, `POST /api/forgot-password` (seeded user `test@eshop.com`) → 200, `POST /api/apply-coupon` (code `SAVE10`) → 200. Note: `apply-coupon`'s `final_amount` looked wrong (10x the input `total_amount`) — flag as a candidate bug to verify/log later, not a setup blocker.
- [x] Install/verify JMeter (non-GUI mode) — no `sudo` available non-interactively, so installed a portable JDK 21 (Temurin, checksum-verified) + Apache JMeter 5.6.3 (checksum-verified) under `hw05/tools/` (gitignored, ~300MB). Run `source hw05/tools/env.sh` to get `java`/`jmeter` on PATH for this shell, then `jmeter -n -t <plan>.jmx -l <out>.jtl -e -o <report-dir>`.
- [x] Resource monitor: `htop` also needs `sudo` and isn't installed; `top` is already present system-wide and satisfies the "htop / Task Manager / Activity Monitor" requirement — use `top` for the resource-usage screenshots (or ask the user to run `! sudo apt install -y htop` if they'd rather have htop's UI).
- [~] Hardware report — spec table drafted at `reports/Hardware-Report.md` (CPU/RAM/disk/OS gathered). 🔴 MANUAL remaining: take the actual dxdiag/screenfetch/neofetch screenshot showing hostname `tpg-inspiron` and drop it into `reports/screenshots/`; not blocking, do it whenever convenient.
- [x] Already on `homework/05` — committing as you go, one commit per procedure step (Section 12); 7 commits so far.
- [x] Folders set up: `test-plans/`, `data/`, `results/`, `reports/` all exist and populated. `reports/screenshots/` not created yet — will be created naturally when the first screenshot lands in Phase 2.
- [ ] Draft skeleton for AI Audit Report (tool, date/time, prompt, output columns) — still pending; queued for Phase 8 (this conversation's design-phase dialogue is the raw material to transcribe in).

## Phase 1 — Task 1: AI-assisted design (per scenario)

For **each** of the 3 scenarios (Load / Stress / Spike):

- [x] Drive an AI tool step-by-step (not one generic prompt) to design the test plan: thread/VU counts, ramp-up, think-time — ask it to justify choices against the endpoint's expected behavior. Done for all 3 scenarios (see sub-sections below) — each involved live self-verification against the SUT and empirical calibration, not guessed numbers.
- [x] Build the matching CSV data file. Done — 3 distinct CSVs, no sharing.
- [x] Assign a distinct report/listener type per scenario, no repeats. Done — Load=Aggregate Report, Stress=Summary Report, Spike=View Results Tree.
- [x] Name the file `23127244_{ScenarioType}_{YYYYMMDD}`. Done — all 3 dated `20260815`.
- [x] 🔴 MANUAL — Human review: done for all 3 (you signed off on each design in conversation before building). What was wrong/found during review is logged per-scenario below and doubles as the AI-audit-worthy record.
- [x] Commit the reviewed plan + CSV. Done — one commit per scenario (3 commits).

### Load / read-heavy — `GET /api/products/:id` — done building, pending your review sign-off

- [x] Designed: 30 threads, 30s ramp-up, 300s hold, Gaussian think-time 2000ms±1000ms, Aggregate Report listener. Reasoning logged in conversation (this is the AI-audit-worthy content — copy into `reports/AI-Audit-Report.md` later).
- [x] Self-verified against the live SUT before building (not just assumed): confirmed seeded product IDs are only 1-5 (documented as a known dataset-size limitation), read `server.js:159-165` and found two real bugs — (a) even-ID products return `price` as a string instead of a number, (b) a nonexistent product ID returns HTTP 200 `{}` instead of 404. Neither affects this plan's assertions, but both are candidates for the GitHub Issues bug log.
- [x] Built `test-plans/23127244_Load_20260815.jmx` + `data/23127244_Load_products.csv`.
- [x] Smoke-tested the actual `.jmx` logic (temp reduced-scale copy, not committed): positive run → 0% errors, correct CSV substitution per request; negative-control run (assertion deliberately broken) → 100% errors with the expected failure message — proves the assertion is live, not a silent no-op.
- [x] 🔴 MANUAL — Reviewed and signed off by you.

### Stress / auth-heavy — `POST /api/forgot-password` — done building, pending your review sign-off

- [x] Designed: staged/staircase stress (4 sequential Thread Groups via `TestPlan.serialize_threadgroups=true`, no plugins needed) — Stage1 30VU/5s ramp/30s hold, Stage2 80VU/10s/30s, Stage3 150VU/15s/30s, Stage4 400VU/20s/40s (bumped from an initial 300VU after burst-test data showed 300 might be a borderline/inconclusive breaking point). Think-time Uniform 200-800ms (shorter than Load's — models an anxious/retrying user, and needed to actually generate stress). Summary Report listener.
- [x] Self-verified against the live SUT before building: read `server.js:68-85` — every call is a `SELECT` + `UPDATE` (a write, not read-only), no lockout on this endpoint (confirmed), only 2 seeded users (documented limitation, but realistic as a "many users hit few hot rows" stress pattern). Confirmed Content-Type: application/json is required or Express won't parse the body (would silently 404 "User not found").
- [x] Calibrated thread counts empirically, not guessed: burst-tested concurrency 20→700 directly against the live endpoint. Found latency scales ~linearly with concurrency (SQLite single-writer serialization) but **no hard errors even at 700** (avg 1.04s, max 1.58s) — meaning a response-code-only assertion would never trip. Added a **Duration Assertion (>2000ms = fail)** as the real stress signal alongside response-code 200.
- [x] Built `test-plans/23127244_Stress_20260815.jmx` + `data/23127244_Stress_emails.csv`.
- [x] Smoke-tested the actual `.jmx` at reduced scale: positive run → 0% errors across all 4 stages, confirmed stages ran strictly sequentially (no interleaving, verified via timestamp+threadName ordering) and CSV/header/body substitution worked; negative-control (duration threshold forced to 1ms) → 100% errors with the expected "operation lasted too long" message, proving the Duration Assertion is live.
- [x] 🔴 MANUAL — Reviewed and signed off by you.

### Spike / transactional — `POST /api/apply-coupon` — done building, pending your review sign-off

- [x] Designed: 3 sequential stages (baseline 15VU/10s ramp/20s hold → spike 500VU/2s ramp/15s hold → recovery 15VU/10s ramp/20s hold), modeling resilience/recovery rather than hunting a breaking point (this is the correct distinction from Stress: Stress finds the ceiling, Spike checks how the system handles and recovers from a sudden surge). Think-time Uniform 500-1200ms baseline/recovery, 50-150ms during the spike (near-back-to-back burst pacing). View Results Tree listener.
- [x] Self-verified against the live SUT before designing: read `server.js:362-437` and found a real bug — for `type:"percent"` coupons, `discount_amount = total_amount * (1 - coupon.discount_value)` treats `discount_value` as a whole number (10) instead of a fraction (0.10), so `SAVE10` produces a large *negative* discount (confirmed live earlier: total_amount 500000 -> discount_amount -4500000). Deliberately kept the CSV to only valid/successful combos and designed assertions around `success:true` + HTTP 200, not the discount math itself — so this known bug doesn't corrupt the spike test's pass/fail signal; it's logged separately as a bug-report candidate instead.
- [x] Calibrated spike magnitude empirically before locking it in: burst-tested 100/400/800 concurrent (0% errors, latency stayed low), then on your call went further to 1500/2000 concurrent — still 0% errors, no meaningful degradation (latency was noisy/non-monotonic, consistent with OS scheduling noise rather than a real SUT limit). Conclusion: **no breaking point found for this endpoint in the tested range**, a legitimate finding (cheap indexed read on a 4-row table, no write-lock bottleneck) worth contrasting against `forgot-password`'s write-bound behavior in the report. Locked in 500 VU for the actual spike stage — comfortably dramatic (33x the baseline) and fully bracketed by real data, without inflating the design to an untested extreme just to manufacture drama.
- [x] Built `test-plans/23127244_Spike_20260815.jmx` + `data/23127244_Spike_coupons.csv` (5 rows across the 3 real, non-expired coupons).
- [x] Smoke-tested the actual `.jmx` at reduced scale: positive run → 0% errors across all 3 stages in correct sequential order, multi-field CSV substitution (`code`/`total_amount`/`user_id`) confirmed working via valid JSON bodies; two separate negative controls — forcing the `success:true` check to fail (100% errors, correct message) and forcing the duration threshold to 1ms (81% errors, proportional to real elapsed time, not a hardcoded flag) — both confirm the assertions are genuinely live.
- [x] 🔴 MANUAL — Reviewed and signed off by you. **All 3 test plans are now final.**

## Phase 2 — Task 1: Execution & evidence

For **each** scenario:

- [x] Dry run done first (Load), confirmed the command works end-to-end before the real take.
- [x] ⚠️ Verified: JMeter **appends** to an existing `.jtl` filename rather than overwriting it. Cleanup step applied before the real recorded run.
- [x] 🔴 MANUAL — Ran all 3 `.jmx` files via JMeter non-GUI with OBS screen recording (tool + `top` in the same frame). Screenshots taken mid-run for all 3, confirmed by content: `23127244_Load_run.png`, `23127244_Stress_run.png`, `23127244_Spike_run.png` (Machine ID redacted before committing, hostname kept visible).
- [x] Confirmed: no account-lockout handling needed (only `/login` has it, not targeted). `forgot-password` under Stress didn't hit any undocumented rate limit — its errors were the intended Duration Assertion (SLA), not rate-limiting.
- [x] Real `.jtl` logs + HTML report folders committed for all 3: Load 4265 samples/0 errors, Stress 24681/79 errors (0.32%, max 7.68s), Spike 32699/136 errors (0.42%, all HTTP 200 / Duration Assertion breaches — verified root cause, not a real failure).
- [~] Logged 3 genuine bugs found during test design to GitHub Issues (posted, text-only for now): [#7](https://github.com/IamTpG/software-testing-course/issues/7) price type flip, [#8](https://github.com/IamTpG/software-testing-course/issues/8) 404-as-200, [#9](https://github.com/IamTpG/software-testing-course/issues/9) coupon negative discount. 🔴 MANUAL remaining: attach a screenshot to each (not blocking — can edit the issue later).

**Phase 2 complete.**

## Phase 3 — Endurance / soak test

- [x] Designed: flat 150 VU sustained for 12 min (735s = 15s ramp + 720s hold, verified empirically that JMeter's `duration` field is measured from thread-group start and includes ramp-up, not additive — confirmed against the real Load run's wall-clock time) against `POST /api/forgot-password`, the endpoint with a demonstrated real bottleneck (Load/Spike showed no meaningful limits in testing, so less informative to soak-test). Calibrated from the Stress run's own data: Stage 3 (150 VU) ran clean at 222.6 RPS but only for ~30s — this endurance run checks whether that holds for a genuinely sustained window, which a short staged test can't reveal (e.g. slow memory growth, gradual queue buildup).
- [x] Built `test-plans/23127244_Endurance_20260815.jmx` (reuses the Stress CSV — same endpoint/group, not a new one requiring its own data file). Smoke-tested at reduced scale (5 VU/5s), 0% errors, confirmed working before committing to the real run.
- [x] Section 6 doesn't require a screenshot/video-in-frame for this step (unlike the 3 main scenarios) — running the real 12-min soak myself in the background, with a parallel backend memory sampler (`ps` every 10s → `results/23127244_Endurance_20260815_memory.csv`) to get real RSS/CPU-over-time numbers, not just the JMeter-side throughput/error stats.
- [ ] 🔴 MANUAL — none expected for this step; results to be reported once the background run finishes (~12 min).

## Phase 4 — Demo video (Task 1 requirement)

- [ ] 🔴 MANUAL — Record ≥6 min total, unlisted YouTube upload, tool + resource monitor in the same frame, **your own Vietnamese narration**. May be split into one clip per scenario as long as total ≥ 6 min.

## Phase 5 — Task 2: AI analysis & misinterpretation hunt

- [ ] Prompt an AI tool to analyze the collected `.jtl` logs and propose thresholds.
- [ ] 🔴 MANUAL — Cross-check every AI claim against the raw `.jtl` values; for each misinterpretation found, cite the correct number and explain the AI's error.
- [ ] Have the AI propose optimizations (DB index, connection pool, SQLite WAL, etc.); 🔴 MANUAL judge each as feasible or hallucinated with your own reasoning.

## Phase 6 — Task 3: Continuous Performance Testing proposal

- [ ] Draft (AI-assisted OK) a model that watches SUT commits, decides whether to run perf tests, flags p95 regressions.
- [ ] Produce a flow chart.
- [ ] 🔴 MANUAL — Write the trade-off discussion (cost vs. false alarms) in your own words for the conclusion.

## Phase 7 — Agent Skill

- [ ] Build a reusable Agent Skill that automates this perf-testing + log-analysis workflow for future endpoints.
- [ ] 🔴 MANUAL — Record a second demo video (YouTube link) showing the skill run end-to-end on a complete endpoint group.

## Phase 8 — Reports & mandatory appendices

- [ ] Write Main Report (Markdown), covering Tasks 1–3, all evidence references.
- [ ] Compile AI Audit Report appendix (every AI interaction logged: tool, timestamp, prompt, output).
- [ ] 🔴 MANUAL — Write the AI Critique paragraph (200–300 words, your own reflection: where AI was wrong/biased/incomplete, why it missed it, what you learned).
- [ ] Convert Main Report + AI Audit Report to PDF (you do this yourself — no AI/tooling hunt needed here, per your own workflow).
- [ ] Export Git commit log to a text file (Section 12).
- [ ] Write `README.md`: self-assessment table + test summary (scenarios run, endpoint groups covered, endurance threshold numbers, bug/perf-issue count, demo video link).

## Phase 9 — Packaging & submission

- [ ] Assemble zip contents per Section 14 (see `SUBMISSION-CHECKLIST.md`).
- [ ] 🔴 MANUAL — Decide self-assessed grade (3-digit, 000–100).
- [ ] 🔴 MANUAL — Submit `23127244_HW05_AI_Performance_<grade>.zip` to Moodle before deadline (no late submissions accepted).
- [ ] 🔴 MANUAL — If selected for oral defense (30% random), prepare to explain your process in 5–7 minutes.
