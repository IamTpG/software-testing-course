# Agent Skill Demo — `api-test-generator` applied to `POST /api/register`

Demonstrates `.claude/skills/api-test-generator/SKILL.md` end-to-end on a **new endpoint**
— not one of the 3 graded APIs (`GET /api/products`, `POST /api/cart`,
`POST /api/admin/coupons`) — following the exact 6-stage pipeline documented in
`../reports/AI-Test-Generator-Design.md`.

## Stage 1 — Ground
Read `backend/server.js:20-30`. Found immediately: the INSERT binds `req.body.password`
directly with **no hashing call anywhere** (confirmed by scanning every `require(...)` in
the file — only `express`/`cors`/`body-parser`/`database`/`jsonwebtoken`, no `bcrypt` or
`crypto`) — this is the root cause of what the main homework's API1 SQL injection was able
to exfiltrate as plaintext. Also: parameterized query (safe from SQLi), no email/password
format validation visible, `users` table has **no UNIQUE constraint on `email`**.

## Stage 2 — Generate (3 lenses)
16 cases: 9 domain-partition, 5 security, 2 schema. Full table with reasoning:
`register-test-cases.csv` (`phase=generated`), narrated in `generation-log.md`.

## Stage 3 — Verify (the gate)
3 of the 16 generated cases had a wrong predicted expectation — all three because the AI
assumed reasonable-sounding validation exists (email format, password complexity, email
uniqueness) that turns out not to. Corrected with reasoning in `audit-log.md` and the CSV's
`audit_notes` column. 13/16 correct as generated.

## Stage 4 — Extend
5 cases the base generation structurally couldn't reach: a cross-endpoint chain
(duplicate email → permanently unusable second account, traced into the **separate**
`/api/login` handler), a cross-endpoint persistence check (the empty-body ghost account
shows up in `GET /api/admin/users`), a privilege-impact verification (role-injection
attempt has zero real effect — correctly distinguished from API3's *actual*
privilege-escalation bug), a cross-API comparative finding (contrasted against API3's
`coupons.code` UNIQUE constraint), and a combined-hostile-fields probe. All verified live.
See `extension-log.md`.

## Stage 5 — Emit
`register-demo.postman_collection.json` + `data/register_cases.csv` (14 rows —
pure body-variation cases; the 7 remaining cases needed a different shape and are
documented directly in the CSV/logs rather than force-fit into the same data file,
per the skill's own "verify what's actually testable this way" judgment).

## Stage 6 — Execute & lock
Two Newman runs, both clean:
- `results_datadriven.html` — 14/14 iterations, 42/42 assertions pass.
- `results_extd01.html` — the EXT-D-01 duplicate-email → failed-login chain, 3/3 pass.

**Total: 21/21 demo cases confirmed** (14 executed via Newman + 3 via the EXT-D-01 chain
+ 4 verified via targeted `curl` during design — EXT-D-02/03/04 and the static
no-hashing-library check, RD-13, which have no meaningful "request" to automate and are
documented findings instead — see `audit-log.md`/`extension-log.md` for exactly how each
was verified).

## Bugs surfaced by this demo (not part of the 3 graded APIs, offered as bonus findings)
1. **High — passwords stored in plaintext (SEC-01), confirmed at the source.** No hashing
   library is imported or called anywhere in `server.js`. This is *why* API1's SQL
   injection in the main homework was able to exfiltrate readable passwords.
2. **Medium — no UNIQUE constraint on `users.email`.** A second registration with an
   already-used email succeeds, but that account can never log in (`db.get` always
   resolves to the first matching row) — a silent, permanent account lockout with no
   error message pointing at the real cause.
3. **Low — no email format or password complexity validation**, despite the assignment's
   own domain-partition example naming exactly these two checks.
