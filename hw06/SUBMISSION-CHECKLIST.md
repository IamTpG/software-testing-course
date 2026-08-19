# HW06 — Submission Checklist (23127244)

Filename target: `23127244_HW06_AI_API_<SelfAssessedGrade>.zip` (3-digit grade, e.g. `090`).
Packaged submission folder convention (matching HW04/HW05): build
`hw06/23127244_HW06_AI_API_<grade>/` as a snapshot, then zip its *contents*.

## Required contents (Section 14)

- [ ] **Main report** (Markdown + PDF) — API-testing report covering all 3 APIs + AI audit summary.
- [ ] **Public GitHub repository link** — collections, scripts, and reports (this repo, `homework/hw06` branch/PR).
- [ ] **Postman collection** (`.json`) + **Newman report** (HTML), plus the list of Postman features used.
- [ ] **CI/CD report** — pipeline configuration + the two sample runs (one all-passing, one with one failing test), screenshots + links.
- [ ] **Excel test cases and test summary** (all 3 APIs, VALID/INVALID/INCOMPLETE audit labels included).
- [ ] **AI test-generator diagram + pseudocode** — diagram as PNG or Mermaid, self-drawn (anti-cheat, Section 11); pseudocode as `.md`/`.py`.
- [ ] *(Optional)* API spec converted to OpenAPI (`.yaml`/`.json`) — if AI-generated, must be audited too.
- [ ] **Bug report** — Markdown report + GitHub Issues with screenshots on each issue.
- [ ] **AI Critique** (Markdown + PDF, 200–300 words, your genuine reflection).
- [ ] **AI Audit Report** (Markdown + PDF, mandatory appendix).
- [ ] **Git commit log** (text file) — one commit per pipeline step per API (generation/audit/extension/execution).
- [ ] **`README.md`** — self-assessment table + test summary (APIs count; cases generated/added/executed/passed/failed; bug count).
- [ ] Any other supporting materials (skill demo, pseudocode, etc.).
- [ ] *(Encouraged, not required)* Agent Skill demo video link (YouTube, unlisted).

## Anti-AI-Cheat verification (Section 11 — TAs check these specifically)

- [ ] `X-Student-Id: {StudentID}` header present on every request — evidenced by a **console screenshot** from the pre-request script (must show real execution, not fabricated).
- [ ] Newman run output hostname matches your deployment (`localhost`/`127.0.0.1` accepted).
- [ ] AI test-generator diagram is genuinely **self-drawn** — not AI-generated. 🔴 MANUAL, non-negotiable.

## Self-assessment (to be filled into the packaged `README.md`)

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---|---|
| 1 | API 1 — full pipeline (generate + audit + extend + execute + bugs) | 30 | |
| 2 | API 2 — full pipeline (same criteria) | 30 | |
| 3 | API 3 — full pipeline (same criteria) | 30 | |
| 4 | Agent Skills (AI-driven test generator) | 10 | |
| | **Total** | **100** | |

## Final checks before zipping

- [ ] No two group members' API selections overlap (confirm with groupmates — your responsibility, not verifiable by Claude).
- [ ] Every required document present — Section 17: missing any required document results in **0 points**.
- [ ] Deadline confirmed on Moodle — late submission is **not permitted**.
- [ ] 🔴 MANUAL — Zip and submit `23127244_HW06_AI_API_<grade>.zip` to Moodle before the deadline.
- [ ] 🔴 MANUAL — If selected for oral defense, prepare to explain your process in 5–7 minutes.
