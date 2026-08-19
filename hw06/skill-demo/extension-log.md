# Skill demo — `POST /api/register` — Extension log

| ID | What it tests | Why the AI missed it |
|---|---|---|
| **EXT-D-01** | Duplicate-email registration creates a permanently unusable second account | Requires tracing RD-09's finding into the SEPARATE `/api/login` handler's `db.get()` behavior (resolves only the first matching row) — a per-field registration prompt has no reason to also read the login handler. |
| **EXT-D-02** | The empty-body "ghost" account (RD-07) is visible to admins via `GET /api/admin/users` | Requires chaining RD-07's creation with a DIFFERENT endpoint's read to confirm it isn't silently discarded — it persists and pollutes the real user list. |
| **EXT-D-03** | Directly verifies RD-14's role-injection attempt has zero real privilege impact — correctly distinguished from API3's actual privilege-escalation bug | Requires calling a genuinely admin-gated action (`POST /api/admin/coupons`) with the resulting token and reasoning about *why* it succeeds (API3's separate, unrelated bug) rather than concluding the registration endpoint itself is exploitable. |
| **EXT-D-04** | Comparative finding: `users.email` has no UNIQUE constraint while `coupons.code` does, in the same codebase | Requires cross-referencing this endpoint's finding against a DIFFERENT API's finding from a separate testing session. |
| **EXT-D-05** | Combined-hostile single request: SQLi name + duplicate email + empty password, all at once | RD-10/RD-09/RD-06 each test one hostile field in isolation; this proves none of the individual gaps interact to catch what the others miss. |

All 5 verified empirically (see `register-test-cases.csv`'s `audit_notes` column for each
one's confirmation). EXT-D-01 and EXT-D-05 are wired into the Postman/Newman demo;
EXT-D-02/03/04 were verified via targeted `curl` during design (documented, not
re-automated, since a full Postman flow for each would mostly duplicate infrastructure
already proven by the 3 graded APIs' suites).
