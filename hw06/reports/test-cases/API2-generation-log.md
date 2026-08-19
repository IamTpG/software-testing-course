# API 2 (`POST /api/cart`) — Generation step log

## Interaction 1 — 2026-08-19 — Read the SUT implementation before generating anything
**Prompt:** "Read the `POST /api/cart` and `GET /api/cart` handlers, and the
`authenticateToken` middleware, before designing any test cases."
**Output:** `server.js:290-295` — the handler does `userCarts[userId].push(req.body)`
with **zero validation of any field**: no type checks, no required-field checks, no
product-existence lookup. Storage is an in-memory JS object (`userCarts`), not the
database — resets on server restart, and rules out a SQL-injection angle here (unlike
API1). Auth is enforced via `authenticateToken` (JWT verified with the app's `SECRET_KEY`).

## Interaction 2 — 2026-08-19 — Generate domain-partition cases for id/name/price/quantity
**Prompt:** "Given zero server-side validation, enumerate equivalence classes and boundary
values per field (id, name, price, quantity): missing, wrong type, negative/zero/extreme
numeric boundaries, empty/very-long strings — plus whole-body structural cases (empty
object, array instead of object, null, malformed JSON, missing Content-Type, duplicate
adds, oversized payload)."
**Output:** 30 domain-partition cases (PB-01–PB-30).

## Interaction 3 — 2026-08-19 — Generate security cases referencing SEC-01–SEC-07
**Prompt:** "Generate auth/access-control cases against SEC-02 (JWT required) for this
endpoint: missing header, malformed token, tampered signature, missing 'Bearer' prefix,
and a cross-user isolation check. Also probe for SEC-04 (unescaped output) via an
XSS-style payload in the `name` field."
**Output:** 6 security cases (PB-31–PB-36).

## Interaction 4 — 2026-08-19 — Generate schema-validation cases
**Prompt:** "Generate schema cases for the POST response shape, the GET collection shape,
round-trip integrity between POST and GET, and the empty-cart state for a fresh user."
**Output:** 4 schema cases (PB-37–PB-40).

**Result of this generation pass: 40 test cases**, drafted BEFORE empirical verification —
see `API2-cart-cases.csv` at this commit for the raw, pre-audit expected values (3 are
wrong, based on plausible-but-unverified assumptions about how a "real" cart or a
strict JSON parser would behave; corrected in the audit commit).
