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

### API 1 — Pool A — `GET /api/products`
- [ ] Drive an AI tool step-by-step (not one mega-prompt) to generate ≥ 35 test cases covering: domain partitions on the `search` param, security (SEC-01–SEC-07, esp. SQL injection — a real vuln was found on this exact param during HW05), and schema validation of the product array response. No state-transition dimension applies to this endpoint.
- [ ] 🟡 DECISION-adjacent — Audit: label every AI-generated case VALID/INVALID/INCOMPLETE with reasoning, correct the bad ones. Claude drafts the audit; you sign off on ambiguous calls.
- [ ] Extend: add ≥ 5 original test cases the AI missed (security focus), with a written explanation of *why* the AI missed them.
- [ ] Execute via Postman + Newman, `X-Student-Id: {StudentID}` header on every request (pre-request script). Produce Newman/HTML report.
- [ ] Report genuine bugs found: in the Markdown report AND as GitHub Issues (with screenshot attached to each).
- [ ] Commit: separate commits for generation / audit / extension / execution (Section 12).

### API 2 — Pool B — `POST /api/cart`
- [ ] Generate ≥ 35 cases: domain partitions on `id`/`name`/`price`/`quantity` (positive/zero/negative/non-numeric/oversized), security (price tampering since client supplies `price` directly, IDOR on cart ownership, SQLi/XSS in `name`), schema validation of the cart response.
- [ ] 🟡 DECISION-adjacent — Audit, same process as API 1.
- [ ] Extend: ≥ 5 original cases the AI missed, with rationale.
- [ ] Execute via Postman + Newman with `X-Student-Id` header + auth token setup. Newman/HTML report.
- [ ] Report bugs (Markdown + GitHub Issues + screenshots).
- [ ] Commit per step.

### API 3 — Pool C — `POST /api/admin/coupons`
- [ ] Generate ≥ 35 cases: domain partitions on `code`/`type` (percent vs fixed)/`discount_value`/`min_order_amount`/`expired_at`/`max_uses_per_user`, security (SEC-01–SEC-07 — role escalation/access control since this is admin-only, SQLi in `code`), schema validation of the created-coupon response.
- [ ] 🟡 DECISION-adjacent — Audit, same process as API 1.
- [ ] Extend: ≥ 5 original cases the AI missed, with rationale.
- [ ] Execute via Postman + Newman with `X-Student-Id` header + admin auth token setup. Newman/HTML report.
- [ ] Report bugs (Markdown + GitHub Issues + screenshots).
- [ ] Commit per step.

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
