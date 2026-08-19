# Skill demo — `POST /api/register` — Generation log

## Interaction 1 — Ground
**Prompt:** "Read the `POST /api/register` handler and confirm: does it hash passwords?
Validate email/password format? Enforce email uniqueness?"
**Output:** No hashing (no bcrypt/crypto import anywhere in the file), no format
validation, no uniqueness constraint on `email` in the schema.

## Interaction 2 — Domain-partition cases
**Prompt:** "Enumerate equivalence classes for name/email/password: missing, empty,
malformed email, weak password, duplicate email, oversized name."
**Output:** RD-01 through RD-09 (9 cases).

## Interaction 3 — Security cases
**Prompt:** "Given the confirmed parameterized query and no-hashing finding, generate
SQLi probes (SEC-05 contrast), an XSS probe (SEC-04), a plaintext-password confirmation
(SEC-01), and a role-injection mass-assignment probe (SEC-06-adjacent)."
**Output:** RD-10 through RD-14 (5 cases).

## Interaction 4 — Schema cases
**Prompt:** "Generate response-shape and Content-Type checks for the success path."
**Output:** RD-15, RD-16 (2 cases).

**16 cases generated**, pre-audit. 3 turned out wrong — see `audit-log.md`.
