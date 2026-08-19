# HW05 — Submission Checklist (23127244)

Packaged submission folder: **`hw05/23127244_HW05_AI_Performance_100/`** (built, not committed —
mirrors the HW04 convention of a `23127244_HW0X_..._<grade>/` snapshot folder inside the homework
directory). Zip that folder's *contents* (not the folder itself as a subfolder, unless that's what
Moodle expects — check) as `23127244_HW05_AI_Performance_100.zip` when ready.

## Contents verified present in the packaged folder

- [x] **Main report** (Markdown + PDF) — `reports/MainReport.md` + `MainReport.pdf` (5 pages, verified valid).
- [x] **Public GitHub repository link** — `GITHUB-REPO-LINK.txt` → https://github.com/IamTpG/software-testing-course/tree/homework/hw05/hw05 (verified resolves, HTTP 200).
- [x] **Test plans**, filenames matching `23127244_{ScenarioType}_{YYYYMMDD}`, in `test-plans/`:
  - [x] `23127244_Load_20260815.jmx` — read-heavy, `GET /api/products/:id`
  - [x] `23127244_Stress_20260815.jmx` — auth-heavy, `POST /api/forgot-password`
  - [x] `23127244_Spike_20260815.jmx` — transactional, `POST /api/apply-coupon`
  - [x] `23127244_Endurance_20260815.jmx` — bonus, Section 6's soak-test requirement
- [x] **Raw `.jtl` logs**, full files, in `results/` — all 4, verified clean earlier (no dry-run contamination, cross-checked against `statistics.json`).
- [x] **HTML report folders** — all 4, in `results/`.
- [x] **Resource-monitor screenshots** — `reports/screenshots/23127244_{Load,Stress,Spike}_run.png`, confirmed by content, Machine ID redacted.
- [x] **Hardware-spec screenshot** — `reports/screenshots/23127244_Hardware.png`, wired into `reports/Hardware-Report.md`.
- [x] **Bug-repro screenshots** — `23127244_Bug{7,8,9,10}_*.png`, all 4, attached to their GitHub issues too.
- [x] **Unlisted YouTube demo video link** — `DEMO-VIDEO-LINK.txt` → https://youtu.be/GmoYPY6HPyg.
- [x] **AI Critique** (Markdown + PDF, confirmed by you, 271 words) — `reports/AI-Critique.md` + `.pdf` (1 page, verified valid).
- [x] **AI Audit Report** (Markdown + PDF) — `reports/AI-Audit-Report.md` + `.pdf` (4 pages, verified valid).
- [x] **Git commit log** — `commit_log.txt` at the folder root.
- [x] **Bug report** — all 4 issues posted with screenshots, referenced in `reports/github-issues-draft.md` and `README.md`: [#7](https://github.com/IamTpG/software-testing-course/issues/7), [#8](https://github.com/IamTpG/software-testing-course/issues/8), [#9](https://github.com/IamTpG/software-testing-course/issues/9), [#10](https://github.com/IamTpG/software-testing-course/issues/10) (SQL injection, Critical).
- [x] **`README.md`** — self-assessment table filled (100/100), test summary complete.
- [x] **Agent Skill** — `.claude/skills/jmeter-perf-testing/SKILL.md` + full demo trail in `skill-demo/` + its own video link `SKILL-DEMO-VIDEO-LINK.txt` → https://youtu.be/Hnoe-5KldYE.
- [x] Supporting materials — `data/` (all 4 CSVs), `reports/Endurance-Threshold.md`, `AI-Log-Analysis.md`, `Optimization-Proposals.md`, `AI-Misinterpretation-Hunt.md`, `Continuous-Performance-Testing-Proposal.md`.

Stray local files (`jmeter.log` in `test-plans/` and `skill-demo/test-plans/`) were found and
removed from the packaged folder — not deliverables, just JMeter's own run log.

All 3 PDFs added and verified valid — no more content gaps.

## Anti-cheat verification (TAs will check these)

- [x] Test-plan filenames exactly match `23127244_{ScenarioType}_{YYYYMMDD}`.
- [x] `.jtl` logs are the full raw files, verified not trimmed/summarized.
- [x] Demo video confirmed by you as tool + resource monitor same frame, your own Vietnamese narration.
- [x] Hardware report hostname — `tpg-inspiron` confirmed visible in both the spec table and the screenshot.

## Self-assessment (already in the packaged `README.md`)

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---|---|
| 1 | Task 1 — Load testing | 20 | 20 |
| 2 | Task 1 — Stress testing | 20 | 20 |
| 3 | Task 1 — Spike testing | 20 | 20 |
| 4 | Task 2 — AI analysis + misinterpretation hunt | 10 | 10 |
| 5 | Task 3 — Continuous Performance Testing proposal | 10 | 10 |
| 6 | Agent Skills | 10 | 10 |
| | **Total** | **100** | **100** |

## Final checks before zipping

- [x] No two members' endpoint choices overlap (confirmed with groupmate earlier in this session).
- [x] Everything content-wise is done — folder is submission-ready.
- [ ] Deadline confirmed on Moodle — late submission is not accepted, missing any required document = 0.
- [ ] 🔴 MANUAL — Zip and submit to Moodle before the deadline.
