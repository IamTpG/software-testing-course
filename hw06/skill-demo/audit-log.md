# Skill demo — `POST /api/register` — Audit log

| ID | Verdict | Why |
|---|---|---|
| RD-01 | VALID | Confirmed |
| **RD-02** | **INVALID → corrected** | Assumed email-format validation exists (the assignment's own example names this exact check). Wrong: none exists. Corrected 400/rejected → 200/created_no_format_check. |
| **RD-03** | **INVALID → corrected** | Same assumption, for password complexity — the assignment's OTHER named example. Wrong: none exists. Corrected 400/rejected → 200/created_no_complexity_check. |
| RD-04 – RD-08 | VALID | Confirmed |
| **RD-09** | **INVALID → corrected** | Assumed `email` has a UNIQUE constraint, standard for an auth system. Wrong: it doesn't. Duplicate registration succeeds (200), and the *consequence* — the duplicate account can never log in — is traced separately in EXT-D-01. Corrected 409/rejected → 200/created_duplicate_allowed. |
| RD-10 – RD-13 | VALID | Confirmed — RD-13 (plaintext password) verified statically (no hashing import in the whole file) rather than via a live request, since it's a source-code fact, not a response to assert on. |
| RD-14 – RD-16 | VALID | Confirmed |

**13/16 correct as generated.** All 3 corrections share the same pattern already seen
across all 3 graded APIs in the main homework: the AI assumed *reasonable, standard*
validation exists for an authentication endpoint, without checking whether this specific
handler actually implements it.
