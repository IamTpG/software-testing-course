# HW05 — Submission Checklist (23127244)

Zip filename: `23127244_HW05_AI_Performance_<SelfAssessedGrade>.zip` (grade = 3-digit, 000–100, e.g. `23127244_HW05_AI_Performance_090.zip`).

## Required contents

- [ ] **Main report** (Markdown **and** PDF) — performance-testing report + AI-analysis critique section.
- [ ] **Public GitHub repository link** — test plans and data files pushed and accessible.
- [ ] **Three test plans**, filenames matching `23127244_{ScenarioType}_{YYYYMMDD}`:
  - [ ] `23127244_Load_YYYYMMDD.jmx` — read-heavy, `GET /api/products/:id`
  - [ ] `23127244_Stress_YYYYMMDD.jmx` — auth-heavy, `POST /api/forgot-password`
  - [ ] `23127244_Spike_YYYYMMDD.jmx` — transactional, `POST /api/apply-coupon`
- [ ] **Three raw `.jtl` logs** (full files, not just summaries) — one per scenario.
- [ ] **Three HTML report folders** — one per scenario.
- [ ] **Resource-monitor screenshots** — tool + htop/Task Manager together, one set per scenario run.
- [ ] **Hardware-spec screenshots** — dxdiag/screenfetch + spec table; hostname matches prior HW deployments.
- [ ] **Unlisted YouTube demo video link** — ≥6 min total, tool + resource monitor same frame, your own Vietnamese narration.
- [ ] **AI Critique** (Markdown + PDF) — 200–300 words.
- [ ] **AI Audit Report** (Markdown + PDF) — every AI interaction: tool, date/time, prompt, output.
- [ ] **Git commit log** — text file, one commit per procedure step (each scenario's plan, AI analysis, continuous-testing proposal).
- [ ] **Bug report** — GitHub Issues screenshots, if any bugs/perf issues were found.
- [ ] **`README.md`** with:
  - [ ] Self-assessment table (Section 15 template, all 6 rows filled).
  - [ ] Test summary: scenarios run, endpoint groups covered.
  - [ ] Endurance threshold with concrete numbers (max stable RPS, memory ceiling).
  - [ ] Number of bugs / performance issues logged.
  - [ ] Demo video link.
- [ ] **Agent Skill** + its own end-to-end demo video link (Section 7).
- [ ] Any other supporting materials (CSV data files, etc.).

## Anti-cheat verification (TAs will check these)

- [ ] Test-plan filenames exactly match `23127244_{ScenarioType}_{YYYYMMDD}`.
- [ ] `.jtl` logs are the full raw files, not trimmed/summarized.
- [ ] Demo video shows tool + resource monitor in the same frame, with your own voice narration (not AI-generated narration, not silent/text-only).
- [ ] Hardware report hostname matches your hostname from previous homework deployments.

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
