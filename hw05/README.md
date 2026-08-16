# HW05 — AI-Driven Performance Testing on EShop (23127244)

Load/Stress/Spike/Endurance testing of the EShop backend API with JMeter, driven step-by-step by
AI (Claude Code) with self-verification against the live SUT and empirical calibration before
every parameter — never a guessed thread count. Full details in
[`reports/MainReport.md`](reports/MainReport.md).

## Test summary report

| Metric | Value |
|---|---|
| Endpoint groups covered | Read-heavy (`GET /api/products/:id`), Auth-heavy (`POST /api/forgot-password`), Transactional (`POST /api/apply-coupon`) |
| Scenarios run | Load, Stress, Spike (Section 5 requirement) + Endurance/soak (Section 6 requirement) |
| Total samples across all 4 runs | 271,393 (Load 4,265 · Stress 24,681 · Spike 32,699 · Endurance 209,748) |
| Load result | 0 errors, avg 1.22ms, max 32ms — no meaningful bottleneck in range |
| Stress result | 79 errors (0.32%) — real breaking point between 150→400 VU (p95 49ms→691ms) |
| Spike result | 136 errors (0.42%), all Duration Assertion breaches (HTTP 200 throughout), concentrated in the spike stage |
| **Endurance threshold** | **285.6 req/s sustained for 12 min, 0% errors**; peak memory 192.6MB (warm-up), steady-state 88-116MB (no leak) |
| Bugs found & reported | 4 total, all posted with screenshots — [#7](https://github.com/IamTpG/software-testing-course/issues/7), [#8](https://github.com/IamTpG/software-testing-course/issues/8), [#9](https://github.com/IamTpG/software-testing-course/issues/9), [#10](https://github.com/IamTpG/software-testing-course/issues/10) (SQL injection, Critical) |
| Task 2 — AI misinterpretation hunt | 0 real misinterpretations found (rigorously verified, not assumed) — see `reports/AI-Misinterpretation-Hunt.md` |
| Task 2 — Optimization judgment | 8/8 proposals classified feasible, 0 hallucinated (2 SQL rewrites tested against real data) |
| Task 3 | Tiered continuous performance-testing proposal — see `reports/Continuous-Performance-Testing-Proposal.md` |
| Agent Skill | `.claude/skills/jmeter-perf-testing/`, demonstrated end-to-end on a new endpoint (`products?search=`) in `skill-demo/` |
| Demo video (Load/Stress/Spike) | https://youtu.be/GmoYPY6HPyg |
| Demo video (Agent Skill) | 🔴 pending — see `TASKS-CHECKLIST.md` Phase 7 |

## Self-assessment

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---|---|
| 1 | Task 1 — Load testing | 20 | 20 |
| 2 | Task 1 — Stress testing | 20 | 20 |
| 3 | Task 1 — Spike testing | 20 | 20 |
| 4 | Task 2 — AI analysis + misinterpretation hunt | 10 | 10 |
| 5 | Task 3 — Continuous Performance Testing proposal | 10 | 10 |
| 6 | Agent Skills | 10 | 10 |
| | **Total** | **100** | **100** |

## Repository layout

- `test-plans/` — the 4 `.jmx` files (`23127244_{Load,Stress,Spike,Endurance}_20260815.jmx`)
- `data/` — one CSV per scenario, never shared across scenarios
- `results/` — raw `.jtl` logs + full HTML dashboard reports for all 4 runs
- `eshop-sut/` — the SUT, vendored fresh for this homework
- `tools/` — portable JDK 21 + JMeter 5.6.3 (gitignored binaries; `source tools/env.sh` to use)
- `skill-demo/` — end-to-end Agent Skill demonstration on a new endpoint
- `.claude/skills/jmeter-perf-testing/` — the reusable Agent Skill itself
- `reports/` — `MainReport.md`, `AI-Critique.md`, `AI-Audit-Report.md`, `Endurance-Threshold.md`,
  `AI-Log-Analysis.md`, `Optimization-Proposals.md`, `AI-Misinterpretation-Hunt.md`,
  `Continuous-Performance-Testing-Proposal.md`, `Hardware-Report.md`, `github-issues-draft.md`,
  `Git-Commit-Log.txt`, `Narration-Script.md`
- `TASKS-CHECKLIST.md` — the full step-by-step working log, timestamped, everything traceable

## Running the tests

```bash
cd eshop-sut/backend && node server.js &     # start the SUT
source ../../tools/env.sh                     # portable JDK + JMeter on PATH
cd ../../test-plans
jmeter -n -t 23127244_Load_20260815.jmx -l ../results/23127244_Load_20260815.jtl -e -o ../results/23127244_Load_20260815_report
```
See `RUN-COMMANDS.md` for the full copy-paste reference (all 4 scenarios + cleanup steps — JMeter
appends to an existing `.jtl` rather than overwriting it, verified the hard way).
