# HW06 — API Testing on EShop: Main Report

**Student:** 23127244
**SUT:** EShop (`ttbhanh/eshop-sut`, vendored fork `IamTpG/eshop-sut`)
**Selected APIs:** `GET /api/products` (Pool A), `POST /api/cart` (Pool B),
`POST /api/admin/coupons` (Pool C) — chosen to avoid overlap with groupmate selections
(`POST /api/login`, `POST /api/checkout`, `PUT /api/admin/orders/:id/status`) and for
comparatively low setup effort (no order-state-machine seeding needed).

## 1. Scope

Three APIs, one per pool, each carried through the full pipeline required by Section 6:
generate (AI, step-by-step) → audit (human review, labeled VALID/INVALID/INCOMPLETE) →
extend (≥5 original cases) → execute (Postman + Newman) → report bugs. All work is on
branch `homework/hw06`, one commit per pipeline step per API (12 commits for the 3×4
generate/audit/extend/execute cycle, plus setup/CI/CD/skill/report commits).

## 2. Methodology — the discipline used across all 3 APIs

Every API followed the same 4-step loop, and every step was driven interactively
(reading the actual handler code, then generating cases in 3 separate passes — domain
partition / security / schema — never one generic prompt):

1. **Ground first.** Read the target handler's source before writing a single test case.
   This is what surfaced API1's raw SQL string concatenation and API3's missing
   `role==='admin'` check *before* any test case existed — the spec text alone shows
   neither.
2. **Generate, then empirically verify every prediction against the live SUT before
   trusting it as an oracle.** Across the 3 APIs, **15 of 118 generated cases** had a
   wrong expected value, caught only by actually running the request — see each API's
   `audit-log.md` for the full reasoning per case. The pattern was consistent: the AI
   assumed *plausible* framework or business-logic behavior (whitespace trimming,
   duplicate-key rejection, DB column defaults, real cart merge semantics, admin-only
   access control) that turned out not to hold for this specific codebase.
3. **Extend with cases single-pass generation structurally can't reach**: combined-
   hostile-field probes, cross-endpoint chains, comparative/contrast findings, and
   cross-API pattern probes. 15 such cases were added (5 per API), each with an explicit
   "why the AI missed it" explanation — see each API's `extension-log.md`.
4. **Execute for real, and treat any failure as a second correction pass.** Even the
   audited set wasn't perfect: PA-34 (API1) and PC-33 (API3) were only caught at
   execution time, not during audit — documented honestly in each `execution-log.md`
   rather than silently fixed.

## 3. API 1 — `GET /api/products` (Pool A)

**Handler:** builds its SQL query via raw string concatenation
(`server.js:144`) — a direct SEC-05 violation, found by reading the code before
generating anything.

- **Generated:** 38 cases (13 domain-partition, 9 security, 16 schema — see
  `test-cases/API1-generation-log.md`).
- **Audited:** 34/38 correct; 4 corrected (whitespace/parsing assumptions that didn't
  hold empirically) — `test-cases/API1-audit-log.md`.
- **Extended:** 5 cases, headlined by a **UNION-based SQL injection that exfiltrates
  every seeded user's email and plaintext password** through this public, unauthenticated
  endpoint — `test-cases/API1-extension-log.md`.
- **Executed:** 43/43 pass, 181/181 assertions, via a data-driven Collection Runner run
  (40 cases) + 3 fixed-URL-shape edge-case requests — `test-cases/API1-execution-log.md`.
- **Bugs:** **Critical** — SQLi (SEC-05) chained with plaintext passwords (SEC-01);
  **Low** — verbose DB error disclosure on malformed input; **Low** — success/error
  Content-Type inconsistency (JSON vs. HTML).

## 4. API 2 — `POST /api/cart` (Pool B)

**Handler:** `userCarts[userId].push(req.body)` with **zero validation of any field** —
no SQL surface here (in-memory storage), unlike API1.

- **Generated:** 40 cases (30 domain-partition, 6 security, 4 schema — see
  `test-cases/API2-generation-log.md`).
- **Audited:** 36/40 correct; 4 corrected, all sharing one root cause — the AI assumed
  plausible framework/business-logic behavior (array-body rejection, null-body
  acceptance, Content-Type enforcement, duplicate-item merging) instead of this
  handler's actual zero-validation reality — `test-cases/API2-audit-log.md`.
- **Extended:** 5 cases — a combined-hostile-fields probe, a mass-assignment probe
  (trust-implying fake fields accepted verbatim), a Content-Type-triggered cart
  corruption chain, unbounded duplicate line items, and confirmation that JWTs are
  issued with no `exp` claim — `test-cases/API2-extension-log.md`.
- **Executed:** 45/45 pass, 78/78 assertions, via a 3-stage chained run (setup →
  31-case data-driven → verification/security) — `test-cases/API2-execution-log.md`.
- **Bugs:** **Medium** — zero input validation + mass assignment; **Low** — Content-Type-
  missing requests corrupt the cart with a `null` entry; **Low** — duplicate adds never
  merge/cap; **Informational** — no JWT expiry.
- **What held up well:** auth enforcement (missing/malformed/tampered token all correctly
  rejected) and cross-user cart isolation — both confirmed solid, documented as passing
  controls, not just failures.

## 5. API 3 — `POST /api/admin/coupons` (Pool C)

**Handler:** parameterized INSERT (safe from SQLi, unlike API1) — but **neither `POST`
nor `DELETE /api/admin/coupons/:id` checks `req.user.role`**, despite the spec's Section 6
preamble explicitly documenting the whole route group as admin-only.

- **Generated:** 40 cases (28 domain-partition, 8 security, 4 schema — see
  `test-cases/API3-generation-log.md`).
- **Audited:** 33/40 correct; **7 corrected** — the most of any API, all sharing one root
  cause: the AI over-trusted that an admin-labeled endpoint validates its inputs and
  enforces its documented access control, when in fact almost none of that exists —
  `test-cases/API3-audit-log.md`.
- **Extended:** 5 cases — the sharpest, **a single non-admin user creates AND deletes a
  coupon end-to-end with zero admin involvement**, plus a cross-endpoint chain (a
  NULL-`type` coupon silently breaks `apply-coupon`'s branching logic), a comparative
  finding on an inconsistent falsy-value fallback, a cross-API mass-assignment contrast,
  and a portfolio-level synthesis across all 3 APIs — `test-cases/API3-extension-log.md`.
- **Executed:** 45/45 pass, 76/76 assertions, via the same 3-stage chained pattern as
  API2. One real data-contamination bug caught and fixed mid-execution (a SQLi payload
  collided with earlier manual testing, documented as a genuine testing lesson, not just
  a fixed typo) — `test-cases/API3-execution-log.md`.
- **Bugs:** **Critical** — SEC-03 completely unenforced (the most severe finding across
  all 3 APIs — any authenticated user can create/delete coupons); **Medium** — several
  fields silently become `NULL` instead of their documented DB defaults, chaining into a
  downstream `apply-coupon` breakage; **Low** — no discount-range/expiry validation, and
  an inconsistent `max_uses_per_user` falsy-coercion.
- **What held up well:** auth presence/signature checks, genuinely parameterized queries,
  and — via the handler's destructuring pattern — an accidental but real mass-assignment
  defense (contrast with API2's cart, which has none).

## 6. Cross-API synthesis

The 3 APIs' most severe defects are **3 different classes of bug**, not one systemic root
cause — evidence that different endpoints in this codebase were likely written/reviewed
with different levels of care:

| | API1 (products) | API2 (cart) | API3 (coupons) |
|---|---|---|---|
| Worst finding | SQL injection (Critical) | No input validation (Medium) | No access control (Critical) |
| Query safety | ❌ raw concatenation | n/a (in-memory) | ✅ parameterized |
| Error format | ❌ HTML, leaks engine msg | n/a | ✅ JSON |
| Mass assignment | n/a | ❌ vulnerable | ✅ protected (accidental) |
| Auth mechanism | n/a (public) | ✅ solid | ✅ solid (role check missing) |

## 7. Postman features & CI/CD

Full feature list in `Postman-Features-Used.md`: collections split by statefulness
(setup/data-driven/verify), environments, collection+environment variables, pre/post
request scripts, self-identifying data-driven test titles, 3 CSV data files (102 rows),
chained runs via `--export-environment`, htmlextra HTML reporting, and GitHub Actions
CI/CD (documented with both required sample runs in `CICD-Report.md`).

## 8. Agent Skill (Create level, G9.5)

A 6-stage AI-driven test generator was designed (`AI-Test-Generator-Design.md`), grounded
explicitly in the mistakes this homework's own pipeline made, implemented as a reusable
skill (`.claude/skills/api-test-generator/`), and demonstrated end-to-end on a **new**
endpoint (`POST /api/register`) — 21 cases, 3 audit corrections, 5 extensions, surfacing 3
bonus findings (plaintext passwords confirmed at the source, a silent permanent-lockout
bug from a missing UNIQUE constraint, no format validation). See `skill-demo/README.md`.

## 9. Summary

| API | Generated | Audit-corrected | Extended | Total cases | Executed | Passed |
|---|---|---|---|---|---|---|
| 1 — `GET /api/products` | 38 | 4 | 5 | 43 | 43 | 43 |
| 2 — `POST /api/cart` | 40 | 4 | 5 | 45 | 45 | 45 |
| 3 — `POST /api/admin/coupons` | 40 | 7 | 5 | 45 | 45 | 45 |
| **Total** | **118** | **15** | **15** | **133** | **133** | **133** |

**7 bugs** identified across the 3 APIs (2 Critical, 2 Medium, 3 Low/informational) — see
`github-issues-draft.md` for full write-ups and `AI-Audit-Report.md` for the AI
interaction log.
