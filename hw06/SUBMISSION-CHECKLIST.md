# HW06 — Submission Checklist (23127244)

Filename target: `23127244_HW06_AI_API_<SelfAssessedGrade>.zip` (3-digit grade, e.g. `090`).
Packaged submission folder convention (matching HW04/HW05): build
`hw06/23127244_HW06_AI_API_<grade>/` as a snapshot, then zip its *contents*.

## Required contents (Section 14)

- [x] **Main report** (Markdown done — `reports/MainReport.md`) — 🔴 MANUAL: PDF conversion still needed.
- [x] **Public GitHub repository link** — `GITHUB-REPO-LINK.txt` → https://github.com/IamTpG/software-testing-course/tree/homework/hw06/hw06 (pushed, live).
- [x] **Postman collection** (`postman/EShop-HW06.postman_collection.json`) + **Newman reports** (`results/*.html`, 8 HTML reports across the 3 APIs' stages), plus the Postman features list (`reports/Postman-Features-Used.md`).
- [x] **CI/CD report** (`reports/CICD-Report.md`) — pipeline config + both sample runs (links to both GitHub Actions runs included) — 🔴 MANUAL: screenshots of the two runs still needed.
- [x] **Excel test cases and test summary** — `reports/23127244_HW06_TestCases.xlsx` (Summary sheet + one sheet per API with VALID/INVALID/INCOMPLETE audit labels, plus the skill-demo sheet).
- [x] **AI test-generator pseudocode** (`reports/AI-Test-Generator-Design.md`, `.md` format) — 🔴 MANUAL: **self-drawn diagram** still needed, see that doc's Section 5 for exactly what to draw.
- [ ] *(Optional, not done)* API spec converted to OpenAPI — skipped, not required.
- [x] **Bug report** — `reports/github-issues-draft.md` (7 issues fully drafted: 2 Critical, 2 Medium, 3 Low/informational) — 🟡 **not yet posted to GitHub Issues**, held pending your review; screenshots also needed once posted.
- [x] **AI Critique** (Markdown done, 263 words — `reports/AI-Critique.md`) — 🟡 **flagged in the file itself for your read-through/sign-off** before it's final; 🔴 MANUAL: PDF conversion after that.
- [x] **AI Audit Report** (Markdown done — `reports/AI-Audit-Report.md`) — 🔴 MANUAL: PDF conversion still needed.
- [x] **Git commit log** (`reports/Git-Commit-Log.txt`) — will regenerate once more before final zip to catch remaining commits.
- [x] **`README.md`** — self-assessment table (grade blank for you) + full test summary table done.
- [x] Supporting materials: `skill-demo/` (full Agent Skill demo trail), `.claude/skills/api-test-generator/`.
- [ ] *(Encouraged, not required)* Agent Skill demo video link — 🔴 MANUAL if you choose to record one.

## Anti-AI-Cheat verification (Section 11 — TAs check these specifically)

- [x] `X-Student-Id: {StudentID}` header present on every request — set via a collection-level pre-request script with a `console.log`, confirmed printing in every Newman run's CLI output (see any `results/*.html` or CI run log). 🔴 MANUAL: a **Postman-app console screenshot** is still needed (Newman's own console output shown in the HTML reports may not satisfy "screenshot from your pre-request script" literally — check with your TA whether the CLI/HTML evidence suffices, or open the collection in the Postman app once to screenshot the Console panel).
- [x] Newman run output hostname: `localhost:4000` throughout (documented reason for the non-default port in `TASKS-CHECKLIST.md` Phase 0 — accepted per Section 11).
- [ ] AI test-generator diagram is genuinely **self-drawn** — not AI-generated. 🔴 MANUAL, non-negotiable, not yet done.

## Self-assessment (to be filled into the packaged `README.md`)

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---|---|
| 1 | API 1 — full pipeline (generate + audit + extend + execute + bugs) | 30 | |
| 2 | API 2 — full pipeline (same criteria) | 30 | |
| 3 | API 3 — full pipeline (same criteria) | 30 | |
| 4 | Agent Skills (AI-driven test generator) | 10 | |
| | **Total** | **100** | |

## Final checks before zipping

- [x] No two group members' API selections overlap — confirmed against your groupmate's list (login/checkout/admin-orders-status) at selection time.
- [x] Content-wise everything required is present or drafted, except the items marked 🔴 MANUAL / 🟡 above. Missing any required document results in **0 points** (Section 17) — don't zip until every 🔴/🟡 line above is resolved.
- [ ] Deadline confirmed on Moodle — late submission is **not permitted**.
- [ ] 🟡 DECISION — Post the 7 drafted bugs to GitHub Issues (with screenshots) — held pending your review.
- [ ] 🔴 MANUAL — Draw the AI test-generator diagram.
- [ ] 🔴 MANUAL — Screenshot: Postman Console (X-Student-Id header), the 2 CI/CD pipeline runs, and each bug once posted.
- [ ] 🔴 MANUAL — Convert Main Report + AI Critique + AI Audit Report to PDF.
- [ ] 🟡 DECISION-adjacent — Read and sign off on the AI Critique draft.
- [ ] 🟡 DECISION — Decide the self-assessed grade for the filename and README/checklist tables.
- [ ] 🔴 MANUAL — Build the `23127244_HW06_AI_API_<grade>/` packaged snapshot folder, zip, and submit to Moodle before the deadline.
- [ ] 🔴 MANUAL — If selected for oral defense, prepare to explain your process in 5–7 minutes.
