# HW06 — Tasks Checklist (23127244)

Legend: `[ ]` to do · `🔴 MANUAL` = cannot be delegated, must be done by hand · `🟡 DECISION` = needs your input/confirmation before Claude proceeds.

**Operating mode:** following the same delegation model as HW04/HW05 — Claude drives design, implementation,
execution, and reporting autonomously once the API selection is confirmed; you only handle physically-manual
actions (screenshots, video recording, PDF export, zipping, Moodle upload) plus the couple of genuine
decisions below. GitHub Issues/commits/pushes to the `IamTpG/eshop-sut` fork are done by Claude via `gh`/`git`,
consistent with how HW05 posted bug reports — flag here if you'd rather review pushes before they go out.

---

## Phase 0 — Setup & selection

- [x] 🟡 DECISION — **Selected 3 APIs**, confirmed distinct from groupmate's picks (`POST /api/login`,
      `POST /api/checkout`, `PUT /api/admin/orders/:id/status`):
  - Pool A (FR-05): `GET /api/products` (`?search=` keyword) — no auth, no body, single query param.
  - Pool B (FR-07): `POST /api/cart` — auth token + 4-field body (`id`, `name`, `price`, `quantity`); client-supplied `price` is a built-in tampering/security angle.
  - Pool C (FR-17): `POST /api/admin/coupons` — admin token + 6-field body (`code`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user`).
- [x] Re-synced fork `IamTpG/eshop-sut` with upstream `ttbhanh/eshop-sut`, vendored a fresh clone into `hw06/eshop-sut/` (nested `.git` removed, tracked as regular files like HW05). Backend installed + seeded, confirmed all 3 chosen endpoints respond (`GET /api/products?search=`, `POST /api/cart`, `POST /api/admin/coupons`).
- [x] SEC-01–SEC-07 located: they're in `eshop-sut/README.md` (not `api_specification.md`) — SEC-01 no plaintext passwords, SEC-02 JWT required, SEC-03 admin role check, SEC-04 output escaping/XSS, SEC-05 parameterized queries, SEC-06 no client-set `role`, SEC-07 OTP entropy/expiry. Relevant to our 3 APIs: SEC-05 (SQLi in `search`/`code`), SEC-03 (admin check on `/api/admin/coupons`), SEC-02 (JWT on `/api/cart`), SEC-04 (XSS via cart `name`).
- [x] Port 3000 was already occupied by another of your projects (`ai-erp-fe`, unrelated) — patched `server.js` to `PORT = process.env.PORT || 3000` (one-line, harmless default preserved) and run the SUT on `PORT=4000` instead. Postman environment's `baseUrl` will point to `http://localhost:4000`.
- [x] Newman 6.2.2 + `newman-reporter-htmlextra` installed locally under `hw06/postman/` (not global) via `npm init` + `npm install --save-dev`.
- [x] `hw06/` folder structure created: `postman/` (collection/env/data), `results/` (Newman/HTML reports), `reports/`, `.gitignore` added (node_modules, sqlite db, packaged export).
- [x] Confirmed on branch `homework/hw06`.
- [x] Two candidate bugs already spotted during smoke-testing (verify formally during test design): (1) `POST /api/login` echoes the plaintext `password` back inside the `user` object — SEC-01 concern; (2) `GET /api/products?search=ao` returned `[]` despite matching Vietnamese product names — search-matching behavior needs checking.

## Phase 1 — Per API: Generate → Audit → Extend → Execute → Report bugs

Repeat for **each of the 3 selected APIs**. Target ≥ 35 AI-generated cases per API.

### API 1 — Pool A — `GET /api/products` — ✅ pipeline complete
- [x] Generated 38 cases (domain-partition/security/schema), driven in 4 separate step-by-step prompts, grounded in reading `server.js` first (found raw SQL string concatenation — SEC-05 violation). `reports/test-cases/API1-generation-log.md` + `API1-products-search-cases.csv`.
- [x] Audited all 38 empirically against the live SUT: 34 correct, 4 corrected (2 invalid whitespace/parsing assumptions, 1 invalid parsing-model error, 1 incomplete/non-falsifiable). `reports/test-cases/API1-audit-log.md`.
- [x] Extended with 5 original cases the AI missed: UNION-based credential exfiltration, verbose error disclosure, stacked-query negative test, cross-path Content-Type inconsistency, plaintext-password confirmation. `reports/test-cases/API1-extension-log.md`.
- [x] Executed via Postman + Newman (data-driven Collection Runner, 40 cases via CSV + 3 fixed-shape edge-case requests), `X-Student-Id` set via collection-level pre-request script. **43/43 pass, 181/181 assertions.** Caught 1 more mistake (PA-34) only at execution time — documented. `reports/test-cases/API1-execution-log.md`, reports in `results/`.
- [x] Bugs drafted: Critical (SQLi + plaintext passwords, SEC-05+SEC-01), Low (Content-Type inconsistency). `reports/github-issues-draft.md` — 🟡 posted to [IamTpG/eshop-sut#1](https://github.com/IamTpG/eshop-sut/issues/1) and [#2](https://github.com/IamTpG/eshop-sut/issues/2).
- [x] 4 separate commits: generation / audit / extension / execution (Section 12).

### API 2 — Pool B — `POST /api/cart` — ✅ pipeline complete
- [x] Generated 40 cases (domain-partition/security/schema), grounded in reading the handler first: `userCarts[userId].push(req.body)` with **zero validation of any field** — no SQL surface here (in-memory storage, contrast with API1). `reports/test-cases/API2-generation-log.md` + `API2-cart-cases.csv`.
- [x] Audited all 40 empirically: 36 correct, 4 corrected (all shared one root cause — AI assumed plausible framework/business-logic behavior instead of this handler's actual unvalidated reality). `reports/test-cases/API2-audit-log.md`.
- [x] Extended with 5 original cases: combined-hostile-fields probe, mass-assignment (trust-implying fake fields), content-type-triggered cart corruption, unbounded duplicate line items, JWT-has-no-exp-claim. `reports/test-cases/API2-extension-log.md`.
- [x] Executed via Postman + Newman — 3-stage chained run (setup → 31-case data-driven → verification/security) since a single-folder run would replay setup on every CSV iteration. **45/45 pass, 78/78 assertions.** `reports/test-cases/API2-execution-log.md`, reports in `results/`.
- [x] Bugs drafted: Medium (zero input validation + mass assignment), Low (content-type corruption + unmerged duplicates), informational (JWT no expiry). Auth enforcement and cross-user cart isolation both confirmed solid (passing controls, documented not just failures). `reports/github-issues-draft.md` — 🟡 posted to [#3](https://github.com/IamTpG/eshop-sut/issues/3) and [#4](https://github.com/IamTpG/eshop-sut/issues/4).
- [x] 4 separate commits: generation / audit / extension / execution.

### API 3 — Pool C — `POST /api/admin/coupons` — ✅ pipeline complete
- [x] Generated 40 cases, grounded in reading the handler first: found the headline issue immediately — neither POST nor DELETE checks `role==='admin'`, despite the spec documenting the whole section as admin-only. Query IS parameterized (contrast with API1). `reports/test-cases/API3-generation-log.md` + `API3-coupons-cases.csv`.
- [x] Audited all 40 empirically: 33 correct, 7 corrected (all shared one root cause — AI over-trusted that an admin-labeled endpoint validates inputs/enforces access control it actually doesn't). `reports/test-cases/API3-audit-log.md`.
- [x] Extended with 5 original cases: full non-admin lifecycle proof, cross-endpoint NULL-type chain into apply-coupon, max_uses_per_user falsy-coercion inconsistency, cross-API mass-assignment contrast, portfolio-level synthesis across all 3 APIs. `reports/test-cases/API3-extension-log.md`.
- [x] Executed via Postman + Newman — 3-stage chained run. Caught a real data-contamination bug mid-execution (unique-coded SQLi payload collided with earlier manual testing, then with its own first run) — fixed with dynamic user registration + DB reseed, documented as a genuine testing lesson. **45/45 pass, 76/76 assertions.** `reports/test-cases/API3-execution-log.md`, reports in `results/`.
- [x] Bugs drafted: **Critical** (SEC-03 completely unenforced — any user can create/delete coupons), Medium (DB-default bypass → NULL fields, chains into apply-coupon breakage), Low (no discount-range/expiry validation, inconsistent max_uses_per_user coercion). Auth mechanism, parameterized queries, and mass-assignment protection all confirmed solid (passing controls). `reports/github-issues-draft.md` — all 7 issues posted to `IamTpG/eshop-sut` — [#5](https://github.com/IamTpG/eshop-sut/issues/5), [#6](https://github.com/IamTpG/eshop-sut/issues/6), [#7](https://github.com/IamTpG/eshop-sut/issues/7).
- [x] 4 separate commits: generation / audit / extension / execution.

**All 3 API pipelines complete.** 135/135 test cases pass (43+45+45), 7 bugs drafted (1 Critical SQLi+plaintext-passwords on API1, 1 Critical broken-access-control on API3, 2 Medium, 3 Low/informational).

## Phase 2 — Postman feature coverage & CI/CD — ✅ complete

- [x] Postman features used, documented explicitly: collections (per-API folders, further split into setup/data-driven/verify sub-folders), environments, collection + environment variables (including runtime-generated unique emails/tampered tokens), collection-level + request-level pre-request scripts, dynamic test-title assertions, data-driven Collection Runner (3 CSV files, 102 rows total), chained runs via `--export-environment`, htmlextra HTML reporting, GitHub Actions integration. Monitors/Mock Servers/Workspaces explicitly noted as not applicable, with reasoning. `reports/Postman-Features-Used.md`.
- [x] CI/CD: GitHub Actions workflow added directly in **this repo** (not the eshop-sut fork — the vendored SUT + Postman collection already live here, simpler than cross-repo checkout), triggered on `hw06/**` changes. `.github/workflows/hw06-api-tests.yml`.
- [x] Two sample commits + pipeline runs produced: all-passing (`3635afc`, [run 32222854961](https://github.com/IamTpG/software-testing-course/actions/runs/32222854961), 32s, 133/133 pass) and one-failing (`57db2f3`, [run 32222958305](https://github.com/IamTpG/software-testing-course/actions/runs/32222958305), 23s, PA-03 deliberately broken — exactly 1 assertion fails), then reverted (`96c2e41`, [run 32223059167](https://github.com/IamTpG/software-testing-course/actions/runs/32223059167), back to green).
- [x] `reports/CICD-Report.md` written: pipeline config + both runs with commit/run links.
- [x] Screenshots of both pipeline runs (green + red) added — `reports/screenshots/run1.png`, `run2.png` — wired into `CICD-Report.md`.

## Phase 3 — Agent Skill (Create level, G9.5) — ✅ complete except the 2 manual items

- [x] Designed a 6-stage AI-driven API test generator (Ground → Generate ×3 lenses → Verify/empirical gate → Extend → Emit → Execute & lock), every stage explicitly tied to a real mistake caught during this homework's own 3-API pipeline. `reports/AI-Test-Generator-Design.md`.
- [x] Diagram provided by you (`reports/diagram.png`), wired into the design doc and Main Report.
- [x] Pseudocode written to match the design (in the same doc, Section 4).
- [x] Implemented as a reusable Agent Skill: `.claude/skills/api-test-generator/SKILL.md`.
- [x] **Demonstrated end-to-end on a new endpoint** (`POST /api/register`, not one of the 3 graded APIs) — real output in `skill-demo/`. 21 cases (16 generated, 3 corrected in audit, 5 extended), 2 clean Newman runs. Surfaced 3 bonus findings: plaintext passwords confirmed at the source, no unique constraint on `users.email` (silent permanent account lockout), no email/password format validation.
- [ ] 🔴 MANUAL — Record demo video of the skill running end-to-end, upload to YouTube (unlisted). Encouraged per Section 7, not strictly required.

## Phase 4 — Mandatory appendices & reports — ✅ complete except PDF conversion

- [x] Main report (`reports/MainReport.md`): full pipeline documentation for all 3 APIs, cross-API comparison table, Postman features + CI/CD summary, Agent Skill summary, totals (133/133 pass, 7 bugs).
- [x] AI Audit Report (`reports/AI-Audit-Report.md`): chronological tool/date/prompt/output log, pulled from real commit timestamps, covering all 5 phases.
- [x] AI Critique (`reports/AI-Critique.md`, 263 words) — read and confirmed final by you.
- [x] Git commit log exported (`reports/Git-Commit-Log.txt`).
- [x] `README.md` written: self-assessment table (grade column blank for you) + full test summary table + repo layout.
- [ ] 🔴 MANUAL — Convert Main Report + AI Critique + AI Audit Report to PDF (your own workflow).

## Phase 5 — Packaging & submission

- [ ] Assemble Excel test cases + summary (from the Postman/Newman results and audit labels).
- [ ] Cross-check every item in `SUBMISSION-CHECKLIST.md` against the actual repo contents.
- [ ] 🟡 DECISION — Decide self-assessed grade (3-digit, 000–100) for the filename and README table.
- [ ] 🔴 MANUAL — Zip as `23127244_HW06_AI_API_<grade>.zip`, submit to Moodle before deadline (no late submissions).
- [ ] 🔴 MANUAL — If selected for oral defense (30% random), prepare a 5–7 min explanation of your process.
