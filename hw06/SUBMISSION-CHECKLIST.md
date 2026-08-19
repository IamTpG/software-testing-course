# HW06 — Submission Checklist (23127244)

**Self-assessed grade: 100** (`23127244_HW06_AI_API_100.zip`).
Packaged submission folder convention (matching HW04/HW05): build
`hw06/23127244_HW06_AI_API_100/` as a snapshot, then zip its *contents*.

## Required contents (Section 14)

- [x] **Main report** (Markdown done — `reports/MainReport.md`) — 🔴 MANUAL: PDF conversion still needed.
- [x] **Public GitHub repository link** — `GITHUB-REPO-LINK.txt` → https://github.com/IamTpG/software-testing-course/tree/homework/hw06/hw06 (pushed, live).
- [x] **Postman collection** (`postman/EShop-HW06.postman_collection.json`) + **Newman reports** (`results/*.html`, 8 HTML reports across the 3 APIs' stages), plus the Postman features list (`reports/Postman-Features-Used.md`).
- [x] **CI/CD report** (`reports/CICD-Report.md`) — pipeline config + both sample runs, links and screenshots (`screenshots/run1.png`, `run2.png`) both included.
- [x] **Excel test cases and test summary** — `reports/23127244_HW06_TestCases.xlsx` (Summary sheet + one sheet per API with VALID/INVALID/INCOMPLETE audit labels, plus the skill-demo sheet).
- [x] **AI test-generator diagram + pseudocode** (`reports/AI-Test-Generator-Design.md` + `reports/diagram.png`, wired into both the design doc and Main Report).
- [ ] *(Optional, not done)* API spec converted to OpenAPI — skipped, not required.
- [x] **Bug report** — **all 7 posted to `IamTpG/eshop-sut`** (2 Critical, 2 Medium, 3 Low/informational), each with a verified repro screenshot embedded — see `reports/github-issues-draft.md` for the link table.
- [x] **AI Critique** (Markdown, 263 words — `reports/AI-Critique.md`) — **read and confirmed final by you.** 🔴 MANUAL: PDF conversion still needed.
- [x] **AI Audit Report** (Markdown done — `reports/AI-Audit-Report.md`) — 🔴 MANUAL: PDF conversion still needed.
- [x] **Git commit log** (`reports/Git-Commit-Log.txt`) — will regenerate once more before final zip to catch remaining commits.
- [x] **`README.md`** — self-assessment table (100/100) + full test summary table done.
- [x] Supporting materials: `skill-demo/` (full Agent Skill demo trail), `.claude/skills/api-test-generator/`.
- [ ] *(Encouraged, not required)* Agent Skill demo video link — 🔴 MANUAL if you choose to record one.

## Anti-AI-Cheat verification (Section 11 — TAs check these specifically)

- [x] `X-Student-Id: {StudentID}` header present on every request — set via a collection-level pre-request script with a `console.log`. Evidenced two ways: Newman's CLI/HTML output (any `results/*.html` or CI run log) AND a Postman-app Console screenshot showing the header being set across many live requests:
  ![Postman Console showing X-Student-Id set on every request](screenshots/console.png)
- [x] Newman run output hostname: `localhost:4000` throughout (documented reason for the non-default port in `TASKS-CHECKLIST.md` Phase 0 — accepted per Section 11).
- [x] AI test-generator diagram provided (`reports/diagram.png`).

## Self-assessment (filled into the packaged `README.md`)

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---|---|
| 1 | API 1 — full pipeline (generate + audit + extend + execute + bugs) | 30 | 30 |
| 2 | API 2 — full pipeline (same criteria) | 30 | 30 |
| 3 | API 3 — full pipeline (same criteria) | 30 | 30 |
| 4 | Agent Skills (AI-driven test generator) | 10 | 10 |
| | **Total** | **100** | **100** |

## Final checks before zipping

- [x] No two group members' API selections overlap — confirmed against your groupmate's list (login/checkout/admin-orders-status) at selection time.
- [x] Content-wise everything required is present or drafted, except the items marked 🔴 MANUAL / 🟡 above. Missing any required document results in **0 points** (Section 17) — don't zip until every 🔴/🟡 line above is resolved.
- [ ] Deadline confirmed on Moodle — late submission is **not permitted**.
- [ ] 🔴 MANUAL — Convert Main Report + AI Critique + AI Audit Report to PDF.
- [x] Self-assessed grade decided: **100**.
- [ ] 🔴 MANUAL — Build the `23127244_HW06_AI_API_100/` packaged snapshot folder, zip, and submit to Moodle before the deadline.
- [ ] 🔴 MANUAL — If selected for oral defense, prepare to explain your process in 5–7 minutes.
