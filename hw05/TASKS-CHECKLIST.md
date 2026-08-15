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
- [ ] Already on `homework/05` — just commit as you go, one commit per procedure step (Section 12), no new repo/branch needed.
- [ ] Set up folders: `test-plans/`, `data/` (CSVs), `results/` (`.jtl` + HTML reports), `reports/` (MainReport, AI-Audit, AI-Critique, Bug-Report), `screenshots/`.
- [ ] Draft skeleton for AI Audit Report (tool, date/time, prompt, output columns) so logging is easy during later steps.

## Phase 1 — Task 1: AI-assisted design (per scenario)

For **each** of the 3 scenarios (Load / Stress / Spike):

- [ ] Drive an AI tool step-by-step (not one generic prompt) to design the test plan: thread/VU counts, ramp-up, think-time — ask it to justify choices against the endpoint's expected behavior.
- [ ] Build the matching CSV data file (product IDs for read-heavy; emails for `forgot-password`; coupon codes/`total_amount`/`user_id` for `apply-coupon`). No sharing a CSV across scenarios.
- [ ] Assign a distinct report/listener type per scenario, no repeats (e.g. View Results Tree / Summary Report / Aggregate Report).
- [ ] Name the file `23127244_{ScenarioType}_{YYYYMMDD}` (use the actual date you finalize the plan, e.g. `23127244_Load_20260811.jmx`).
- [ ] 🔴 MANUAL — Human review: go through the AI-generated plan and correct it (unrealistic ramp-up/think-time, wrong thread counts, weak/missing assertions). Write down *what* was wrong and *why* the AI missed it (prompt quality / model limitation / endpoint quirk) — goes into the Main Report.
- [ ] Commit the reviewed plan + CSV (Section 12: one commit per scenario).

### Load / read-heavy — `GET /api/products/:id` — done building, pending your review sign-off

- [x] Designed: 30 threads, 30s ramp-up, 300s hold, Gaussian think-time 2000ms±1000ms, Aggregate Report listener. Reasoning logged in conversation (this is the AI-audit-worthy content — copy into `reports/AI-Audit-Report.md` later).
- [x] Self-verified against the live SUT before building (not just assumed): confirmed seeded product IDs are only 1-5 (documented as a known dataset-size limitation), read `server.js:159-165` and found two real bugs — (a) even-ID products return `price` as a string instead of a number, (b) a nonexistent product ID returns HTTP 200 `{}` instead of 404. Neither affects this plan's assertions, but both are candidates for the GitHub Issues bug log.
- [x] Built `test-plans/23127244_Load_20260815.jmx` + `data/23127244_Load_products.csv`.
- [x] Smoke-tested the actual `.jmx` logic (temp reduced-scale copy, not committed): positive run → 0% errors, correct CSV substitution per request; negative-control run (assertion deliberately broken) → 100% errors with the expected failure message — proves the assertion is live, not a silent no-op.
- [ ] 🔴 MANUAL — Your review/sign-off on the design before it's "final." Push back on anything before Phase 2 execution.

## Phase 2 — Task 1: Execution & evidence

For **each** scenario:

- [ ] 🔴 MANUAL — Run the `.jmx` via JMeter non-GUI while recording resource monitor in the same view; screenshot tool + htop together.
- [ ] Note: no account-lockout handling needed for this endpoint set (only `/login` has the 3-fail lockout, and we're not targeting it) — skip that step, but double-check `forgot-password` under Stress doesn't hit an undocumented rate limit; if it does, document the reset steps like the lockout case.
- [ ] Save raw `.jtl` log and the generated HTML report folder for each run.
- [ ] 🔴 MANUAL — Log any genuine bugs/errors hit during runs to GitHub Issues with screenshots (encouraged, not penalized if none for perf-only issues).

## Phase 3 — Endurance / soak test

- [ ] Design a 10–15 min sustained-load run (AI-assisted) against one or more of the 3 endpoints.
- [ ] 🔴 MANUAL — Execute it, monitor resources live, and record the empirical threshold (max stable RPS, memory ceiling) with concrete numbers.

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
