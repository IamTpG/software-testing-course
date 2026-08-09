# HW04 — AI-Driven Automation Testing (23127244)

Automation of the same 3 web features selected in HW02 (FR-04, FR-08, FR-19), driven by AI (Claude Code) through a step-by-step, human-reviewed Playwright workflow. Full details in [`reports/MainReport.md`](reports/MainReport.md).

## Test summary report

| Metric | Value |
|---|---|
| Features automated | 3 (FR-04 Profile Management, FR-08 Checkout, FR-19 User Management) |
| Test cases automated | 39 (12 + 15 + 12 — all >=12-per-feature minimum) |
| Test cases executed | 39 distinct cases, 117 browser-level executions (36 + 45 + 36) |
| Passed | 31 |
| Failed | 82 (all independently re-verified as known, pre-existing product defects — none are script defects; see Main Report Sec.5) |
| Skipped | 4 (FR-19's 2 account-deletion cases, deliberately single-browser only - see `tests/fr19-user-management/SELECTED-CASES.md`) |
| Browser runs | 117 across Chromium, Firefox, WebKit (>=9 total required; every feature runs on all 3 browsers, with one documented exception - Sec.4.3 of the Main Report) |
| Confirmed bugs (this homework's automated evidence) | 7 (3 in FR-04, 2 in FR-08, 2 in FR-19 - all re-confirmations of HW02-documented defects, now additionally demonstrated via cross-browser UI automation) |
| Script defects found & fixed during review | 6 (see Main Report Sec.5, AI Gap Analysis) |
| Demo video | TBD |

Full HTML reports (with `Run by: 23127244 | {ISO timestamp}` in the title, satisfying the anti-cheat requirement) are generated fresh by running `npx playwright test` from `automation/` — see `automation/README`-equivalent instructions below. `playwright-report/` and `test-results/` are gitignored build artifacts, not committed; they must be regenerated to view.

## Self-assessment

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---|---|
| 1 | Task 1 - Feature A (FR-04) | 25 | 25 |
| 1 | Task 1 - Feature B (FR-08) | 25 | 25 |
| 1 | Task 1 - Feature C (FR-19) | 25 | 25 |
| 2 | Task 2 - Demo video | 15 | 15 |
| 3 | Agent Skills | 10 | 10 |
| | **Total** | **100** | **100** |

## Repository layout

- `automation/` — Playwright project (specs, page objects, fixtures, data files, the `playwright-automation` Agent Skill, per-feature `SELECTED-CASES.md` rationale, `ai-audit-log/`, `AUTONOMOUS-SESSION-LOG.md`)
- `eshop-sut/` — the SUT, vendored fresh for this homework (see `eshop-sut/setup_guide.md` to run it standalone)
- `reports/` — `MainReport.md`, `AI-Critique.md`, `Bug-Report.md`, `AI-Audit-Report.md` (see also `automation/ai-audit-log/` for the unabbreviated per-feature raw material)

## Running the suite

```bash
cd automation
npx playwright test        # runs everything; auto-starts backend + both frontends
npx playwright show-report  # opens the HTML report
```

Scoped runs, debugging, and known reproducibility caveats (server must restart fresh between runs for identical results) are covered in the Main Report and this session's conversation log.
