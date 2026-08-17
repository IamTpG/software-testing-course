# HW05 — Submission Checklist (23127244)

Zip filename: `23127244_HW05_AI_Performance_<SelfAssessedGrade>.zip` (grade = 3-digit, 000–100, e.g. `23127244_HW05_AI_Performance_090.zip`).

## Required contents

- [~] **Main report** (Markdown **and** PDF) — `reports/MainReport.md` done. 🔴 PDF conversion still needed (your workflow).
- [x] **Public GitHub repository link** — `IamTpG/software-testing-course` (public), test plans/data pushed.
- [x] **Three test plans**, filenames matching `23127244_{ScenarioType}_{YYYYMMDD}`:
  - [x] `23127244_Load_20260815.jmx` — read-heavy, `GET /api/products/:id`
  - [x] `23127244_Stress_20260815.jmx` — auth-heavy, `POST /api/forgot-password`
  - [x] `23127244_Spike_20260815.jmx` — transactional, `POST /api/apply-coupon`
  - (bonus, not required: `23127244_Endurance_20260815.jmx`, Section 6's soak-test requirement)
- [x] **Three raw `.jtl` logs** (full files) — all 4 present in `results/`, verified clean (no dry-run contamination, cross-checked against `statistics.json`).
- [x] **Three HTML report folders** — all 4 present in `results/`.
- [~] **Resource-monitor screenshots** — `reports/screenshots/23127244_{Load,Stress,Spike}_run.png` present, confirmed by content, Machine ID redacted. 🔴 Bug-report screenshots for issues #7/#8/#9 still pending (text-only posted so far).
- [x] **Hardware-spec screenshot** — `reports/screenshots/23127244_Hardware.png` (GNOME Settings→About), wired into `reports/Hardware-Report.md`.
- [x] **Unlisted YouTube demo video link** — https://youtu.be/GmoYPY6HPyg, confirmed by you as the full narrated recording.
- [x] **AI Critique** (Markdown done and confirmed by you, `reports/AI-Critique.md`, 271 words) — 🔴 PDF conversion still needed.
- [x] **AI Audit Report** (Markdown done, `reports/AI-Audit-Report.md`) — 🔴 PDF conversion still needed.
- [x] **Git commit log** — `reports/Git-Commit-Log.txt` (will re-export once more before final zip).
- [x] **Bug report** — all 4 posted with screenshots: [#7](https://github.com/IamTpG/software-testing-course/issues/7), [#8](https://github.com/IamTpG/software-testing-course/issues/8), [#9](https://github.com/IamTpG/software-testing-course/issues/9), [#10](https://github.com/IamTpG/software-testing-course/issues/10) (SQL injection, Critical).
- [x] **`README.md`** — `README.md` done, all 4 bullets covered; self-assessment grade column intentionally left blank for you.
- [x] **Agent Skill** — `.claude/skills/jmeter-perf-testing/` done + demonstrated end-to-end in `skill-demo/`, its own demo video recorded: https://youtu.be/Hnoe-5KldYE
- [x] Any other supporting materials — CSVs, `RUN-COMMANDS.md`, `Narration-Script.md`/`.pdf`, `Endurance-Threshold.md`, `AI-Log-Analysis.md`, `Optimization-Proposals.md`, `AI-Misinterpretation-Hunt.md`, `Continuous-Performance-Testing-Proposal.md` all present and committed.

## Anti-cheat verification (TAs will check these)

- [x] Test-plan filenames exactly match `23127244_{ScenarioType}_{YYYYMMDD}`.
- [x] `.jtl` logs are the full raw files, verified not trimmed/summarized (row counts + `statistics.json` cross-checked).
- [x] Demo video confirmed by you as tool + resource monitor same frame, your own Vietnamese narration.
- [x] Hardware report hostname — `tpg-inspiron` confirmed visible in both the spec table and the screenshot.

## Self-assessment table to fill into README.md

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---|---|
| 1 | Task 1 — Load testing | 20 | |
| 2 | Task 1 — Stress testing | 20 | |
| 3 | Task 1 — Spike testing | 20 | |
| 4 | Task 2 — AI analysis + misinterpretation hunt | 10 | |
| 5 | Task 3 — Continuous Performance Testing proposal | 10 | |
| 6 | Agent Skills | 10 | |
| | **Total** | **100** | |

## Final checks before zipping

- [ ] No two members' endpoint choices overlap (confirmed with groupmates via chat).
- [ ] Deadline confirmed on Moodle — late submission is not accepted, missing any required document = 0.
- [ ] Zip opens cleanly and every path above resolves to an actual file (not a broken link/placeholder).
- [ ] Submitted to Moodle before the deadline.
