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
- [x] Bugs drafted: Critical (SQLi + plaintext passwords, SEC-05+SEC-01), Low (Content-Type inconsistency). `reports/github-issues-draft.md` — 🟡 posting to GitHub Issues held until all 3 APIs done (your call).
- [x] 4 separate commits: generation / audit / extension / execution (Section 12).

### API 2 — Pool B — `POST /api/cart` — ✅ pipeline complete
- [x] Generated 40 cases (domain-partition/security/schema), grounded in reading the handler first: `userCarts[userId].push(req.body)` with **zero validation of any field** — no SQL surface here (in-memory storage, contrast with API1). `reports/test-cases/API2-generation-log.md` + `API2-cart-cases.csv`.
- [x] Audited all 40 empirically: 36 correct, 4 corrected (all shared one root cause — AI assumed plausible framework/business-logic behavior instead of this handler's actual unvalidated reality). `reports/test-cases/API2-audit-log.md`.
- [x] Extended with 5 original cases: combined-hostile-fields probe, mass-assignment (trust-implying fake fields), content-type-triggered cart corruption, unbounded duplicate line items, JWT-has-no-exp-claim. `reports/test-cases/API2-extension-log.md`.
- [x] Executed via Postman + Newman — 3-stage chained run (setup → 31-case data-driven → verification/security) since a single-folder run would replay setup on every CSV iteration. **45/45 pass, 78/78 assertions.** `reports/test-cases/API2-execution-log.md`, reports in `results/`.
- [x] Bugs drafted: Medium (zero input validation + mass assignment), Low (content-type corruption + unmerged duplicates), informational (JWT no expiry). Auth enforcement and cross-user cart isolation both confirmed solid (passing controls, documented not just failures). `reports/github-issues-draft.md` — 🟡 posting held until all 3 APIs done.
- [x] 4 separate commits: generation / audit / extension / execution.

### API 3 — Pool C — `POST /api/admin/coupons` — ✅ pipeline complete
- [x] Generated 40 cases, grounded in reading the handler first: found the headline issue immediately — neither POST nor DELETE checks `role==='admin'`, despite the spec documenting the whole section as admin-only. Query IS parameterized (contrast with API1). `reports/test-cases/API3-generation-log.md` + `API3-coupons-cases.csv`.
- [x] Audited all 40 empirically: 33 correct, 7 corrected (all shared one root cause — AI over-trusted that an admin-labeled endpoint validates inputs/enforces access control it actually doesn't). `reports/test-cases/API3-audit-log.md`.
- [x] Extended with 5 original cases: full non-admin lifecycle proof, cross-endpoint NULL-type chain into apply-coupon, max_uses_per_user falsy-coercion inconsistency, cross-API mass-assignment contrast, portfolio-level synthesis across all 3 APIs. `reports/test-cases/API3-extension-log.md`.
- [x] Executed via Postman + Newman — 3-stage chained run. Caught a real data-contamination bug mid-execution (unique-coded SQLi payload collided with earlier manual testing, then with its own first run) — fixed with dynamic user registration + DB reseed, documented as a genuine testing lesson. **45/45 pass, 76/76 assertions.** `reports/test-cases/API3-execution-log.md`, reports in `results/`.
- [x] Bugs drafted: **Critical** (SEC-03 completely unenforced — any user can create/delete coupons), Medium (DB-default bypass → NULL fields, chains into apply-coupon breakage), Low (no discount-range/expiry validation, inconsistent max_uses_per_user coercion). Auth mechanism, parameterized queries, and mass-assignment protection all confirmed solid (passing controls). `reports/github-issues-draft.md` — all 7 issues across 3 APIs now drafted, 🟡 posting held for your review.
- [x] 4 separate commits: generation / audit / extension / execution.

**All 3 API pipelines complete.** 135/135 test cases pass (43+45+45), 7 bugs drafted (1 Critical SQLi+plaintext-passwords on API1, 1 Critical broken-access-control on API3, 2 Medium, 3 Low/informational).

## Phase 2 — Postman feature coverage & CI/CD

- [ ] Use as many Postman features as reasonably possible: workspaces, collections, variables, environments, data-driven runs (Collection Runner + data file), monitors, mock servers. List them explicitly in the report.
- [ ] Add API tests to CI/CD: GitHub Actions running Newman in the `IamTpG/eshop-sut` fork.
- [ ] Produce **two sample commits/pipeline runs**: one with all tests passing, one with exactly one test failing (deliberately, then documented) — both need screenshots + links in the CI/CD report.
- [ ] Write short CI/CD report: pipeline config + the two runs, screenshots, links.
- [ ] 🔴 MANUAL — Screenshot each pipeline run (or confirm Claude may fetch Actions UI screenshots via `gh`/browser automation if acceptable — otherwise you capture these).

## Phase 3 — Agent Skill (Create level, G9.5)

- [ ] Design an AI-driven API test generator for the SUT: given the spec, it produces test cases automatically.
- [ ] 🔴 MANUAL — **Self-drawn diagram** (you draw it — any tool is fine, but it must not be AI-generated; this is an anti-cheat requirement the TAs check).
- [ ] Claude writes the pseudocode to match your diagram.
- [ ] Optionally implement as a reusable Agent Skill (`.claude/skills/`) and demo it generating tests for one API.
- [ ] 🔴 MANUAL — Record demo video of the skill running end-to-end, upload to YouTube (unlisted).

## Phase 4 — Mandatory appendices & reports

- [ ] Main report (Markdown): full pipeline documentation for all 3 APIs + Postman features list + CI/CD summary.
- [ ] AI Audit Report: tool name, date/time, prompt, output — for every significant AI interaction.
- [ ] 🟡 DECISION-adjacent — AI Critique (200–300 words): Claude drafts, but this is your genuine reflection — needs your read-and-confirm before it's final, not just typing it out (same treatment as HW05 Phase 8).
- [ ] Export Git commit log to a text file.
- [ ] `README.md`: self-assessment table (grade column blank for you) + test summary (APIs, cases generated/added/executed/passed/failed, bug count).
- [ ] 🔴 MANUAL — Convert Main Report + AI Critique + AI Audit Report to PDF.

## Phase 5 — Packaging & submission

- [ ] Assemble Excel test cases + summary (from the Postman/Newman results and audit labels).
- [ ] Cross-check every item in `SUBMISSION-CHECKLIST.md` against the actual repo contents.
- [ ] 🟡 DECISION — Decide self-assessed grade (3-digit, 000–100) for the filename and README table.
- [ ] 🔴 MANUAL — Zip as `23127244_HW06_AI_API_<grade>.zip`, submit to Moodle before deadline (no late submissions).
- [ ] 🔴 MANUAL — If selected for oral defense (30% random), prepare a 5–7 min explanation of your process.
