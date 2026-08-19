# HW06 — API Testing on EShop (23127244)

## Self-assessment

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---|---|
| 1 | API 1 — `GET /api/products` — full pipeline (generate + audit + extend + execute + bugs) | 30 | 30 |
| 2 | API 2 — `POST /api/cart` — full pipeline (same criteria) | 30 | 30 |
| 3 | API 3 — `POST /api/admin/coupons` — full pipeline (same criteria) | 30 | 30 |
| 4 | Agent Skills (AI-driven test generator) | 10 | 10 |
| | **Total** | **100** | **100** |

## Test summary

| Metric | API 1 | API 2 | API 3 | Total |
|---|---|---|---|---|
| Endpoint | `GET /api/products` | `POST /api/cart` | `POST /api/admin/coupons` | — |
| Cases AI-generated | 38 | 40 | 40 | 118 |
| Corrected during audit | 4 | 4 | 7 | 15 |
| Cases added (extension) | 5 | 5 | 5 | 15 |
| Total test cases | 43 | 45 | 45 | 133 |
| Executed (Newman) | 43 | 45 | 45 | 133 |
| Passed | 43 | 45 | 45 | 133 |
| Failed | 0 | 0 | 0 | 0 |

**Bugs found: 7** (2 Critical, 2 Medium, 3 Low/informational) — see
`reports/github-issues-draft.md` for full write-ups and `reports/MainReport.md` §5–6 for
the per-API and cross-API summary.

## Repository layout

- `eshop-sut/` — the SUT, vendored fresh for this homework (fork of `ttbhanh/eshop-sut`)
- `postman/` — the collection, environment, and 3 CSV data files (102 rows) for the 3 graded APIs
- `results/` — Newman HTML reports for all 3 APIs (setup/data-driven/verify stages)
- `reports/` — `MainReport.md`, `AI-Audit-Report.md`, `AI-Critique.md`,
  `AI-Test-Generator-Design.md`, `Postman-Features-Used.md`, `CICD-Report.md`,
  `github-issues-draft.md`, `Git-Commit-Log.txt`, plus `test-cases/` (per-API generation/
  audit/extension/execution logs and CSVs)
- `.claude/skills/api-test-generator/` — the reusable Agent Skill
- `skill-demo/` — end-to-end Agent Skill demonstration on `POST /api/register` (a new
  endpoint, not one of the 3 graded APIs)
- `.github/workflows/hw06-api-tests.yml` (repo root) — the CI/CD pipeline
- `TASKS-CHECKLIST.md` / `SUBMISSION-CHECKLIST.md` — working checklists for this homework
