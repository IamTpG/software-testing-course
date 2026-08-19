# API 3 (`POST /api/admin/coupons`) — Generation step log

## Interaction 1 — 2026-08-19 — Read the SUT implementation before generating anything
**Prompt:** "Read the `POST /api/admin/coupons` and `DELETE /api/admin/coupons/:id`
handlers, and the `coupons` table schema in `database.js`, before designing any test
cases."
**Output:** `server.js:457-488` — both handlers only call `authenticateToken`, with **no
`role === 'admin'` check anywhere**, despite the spec explicitly documenting this whole
section as admin-only. The INSERT uses parameterized `?` placeholders (unlike API1's raw
string concatenation). The `coupons` table (`database.js:29-38`) declares `code TEXT
UNIQUE`, `type TEXT DEFAULT 'percent'`, `min_order_amount INTEGER DEFAULT 0` — but the
handler always sends all 6 fields explicitly via `?` binding, so an `undefined` field
value binds as `NULL`, not the column's `DEFAULT`. `max_uses_per_user` gets a JS-level
`|| 1` fallback instead, which behaves differently from the DB-level defaults.

## Interaction 2 — 2026-08-19 — Generate domain-partition cases per field
**Prompt:** "Enumerate equivalence classes and boundary values for each of the 6 fields
(code, type, discount_value, min_order_amount, expired_at, max_uses_per_user): missing,
wrong type, out-of-range/negative/zero, enum boundaries, and the UNIQUE constraint on
code."
**Output:** 28 domain-partition cases (PC-01–PC-28).

## Interaction 3 — 2026-08-19 — Generate security cases referencing SEC-01–SEC-07
**Prompt:** "The spec documents this whole endpoint group as admin-only. Generate access-
control cases verifying the role check (SEC-03), auth presence/validity (SEC-02), and
SQLi/XSS probes (SEC-05/SEC-04) given the parameterized query."
**Output:** 8 security cases (PC-29–PC-36).

## Interaction 4 — 2026-08-19 — Generate schema-validation cases
**Prompt:** "Generate schema cases for the POST response shape, the GET /api/coupons
collection shape, the error-path Content-Type, and the is_active field's default/
immutability."
**Output:** 4 schema cases (PC-37–PC-40).

**Result of this generation pass: 40 test cases**, drafted BEFORE empirical verification —
see `API3-coupons-cases.csv` at this commit for the raw, pre-audit expected values.
7 of them are wrong (more than API1's 4 or API2's 4) — this endpoint has substantially
more missing validation than either prior API, and a naive AI reasonably over-assumed
"an admin coupon-creation endpoint probably validates its inputs," which turned out false
in almost every dimension.
