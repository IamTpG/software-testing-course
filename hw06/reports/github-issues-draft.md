# HW06 — Draft GitHub Issues (eshop-sut, `IamTpG/eshop-sut` fork)

Draft only — not yet posted. Review before posting, especially Issue 1 (contains a live
working exploit + real seeded credentials).

---

## Issue 1 — [Critical] SQL injection in `GET /api/products?search=` leaks all user credentials in plaintext

**Severity:** Critical
**Labels:** bug, security, sql-injection

### Summary
`GET /api/products?search=` builds its SQL query via raw string concatenation
(`backend/server.js:144`), with no input sanitization or parameterization — a direct
violation of **SEC-05** ("Truy vấn CSDL phải dùng Parameterized Query"). This is exploitable
by any anonymous caller (the endpoint requires no auth, violating no specific SEC item
itself since it's meant to be public, but makes the injection unauthenticated).

A UNION-based payload against this single endpoint dumps every seeded user's `email` and
**plaintext password** from the `users` table — which is itself a separate SEC-01
violation ("Mật khẩu không được lưu dưới dạng plaintext"): the passwords are not hashed at
all.

### Steps to reproduce
```
GET /api/products?search=zzz' UNION SELECT id,email,password,role,'leak',1 FROM users --
```

### Actual result
```json
[
  {"id":1,"name":"admin@eshop.com","price":"Admin123!","description":"admin","imageUrl":"leak","category_id":1},
  {"id":2,"name":"test@eshop.com","price":"Test1234!","description":"user","imageUrl":"leak","category_id":1},
  {"id":3,"name":"hw06test@eshop.com","price":"Password123!","description":"user","imageUrl":"leak","category_id":1}
]
```
(`name` column repurposed to carry `email`, `price` to carry the raw `password` — 6-column
UNION matching the `products` table's schema.)

### Expected result
`search` should never be interpolated directly into SQL; the query should use a
parameterized statement (e.g. `db.all("SELECT * FROM products WHERE name LIKE ?", [\`%${searchQuery}%\`])`
with the sqlite3 driver's placeholder binding). Passwords should be hashed (bcrypt/argon2)
before storage, independent of this injection vector.

### Related, lower-severity findings on the same endpoint (folded into this issue)
- A simple syntax-breaking payload (`search='`) triggers a 500 with the raw
  `SQLITE_ERROR: ...` engine message returned verbatim in the response body —
  information disclosure that aids further attack reconnaissance.
- Confirmed (as a negative/scoping result, not a further vulnerability) that stacked
  queries via `;` are **not** exploitable through this code path — `node-sqlite3`'s
  `db.all()` only prepares the first statement, so e.g. `search=x'; SELECT 1 --` executes
  only the first `SELECT`. A destructive payload (`DROP TABLE`) was deliberately never
  attempted against the shared local SUT instance.

### Evidence
🔴 MANUAL — screenshot of the reproduction (request + leaked response) to attach here.

---

## Issue 2 — [Low] Inconsistent Content-Type between success and error responses on `GET /api/products`

**Severity:** Low
**Labels:** bug, api-design

### Summary
`GET /api/products?search=` returns `application/json` on success (200) but
`text/html` on its error path (500, via `res.send()` with a template string starting
`<h1>...`). A JSON REST API should return a JSON error body on failure so API clients
don't have to special-case HTML parsing for one endpoint's failure mode.

### Steps to reproduce
```
GET /api/products?search='
```
→ 500, `Content-Type: text/html; charset=utf-8`, body `<h1>Database Error</h1><p>...</p>`

### Expected result
Error responses should be `application/json`, e.g.
`{"error": "Internal server error"}`, without leaking the raw engine message either way
(see Issue 1's related-findings note).

### Evidence
🔴 MANUAL — screenshot to attach.

---

## Issue 3 — [Medium] `POST /api/cart` has zero server-side input validation (+ mass assignment)

**Severity:** Medium
**Labels:** bug, input-validation, api-design

### Summary
`backend/server.js:290-295` does `userCarts[userId].push(req.body)` with **no validation
of any field**: no type checks, no required-field checks, no product-existence lookup, and
no allowlist of accepted fields. Any JSON-serializable body is accepted with `200`.

### Steps to reproduce
```
POST /api/cart
Authorization: Bearer <valid token>
Content-Type: application/json

{"id":-999,"name":"...3000 chars...","price":-999999999,"quantity":-99999}
```
→ `200 {"message":"Added to cart"}`, stored and echoed back verbatim by `GET /api/cart`.

Also reproducible with a completely empty body (`{}`), a JSON array (`[1,2,3]`), or
fabricated trust-implying fields that aren't in the documented schema:
```
{"id":1,"name":"iPhone","price":1,"quantity":1,"isAdminAddedFreeItem":true,"discount_override":100}
```
→ both extra fields stored and returned as-is (mass-assignment / OWASP API3-style gap).

### Expected result
Reject the request (400) when `id`/`price`/`quantity` aren't valid non-negative numbers,
`name` isn't a non-empty string within a reasonable length, or the body contains fields
outside an explicit allowlist. `id` should ideally be checked against the real
`products` table.

### Evidence
🔴 MANUAL — screenshot to attach.

---

## Issue 4 — [Low] `POST /api/cart` — Content-Type-missing requests silently corrupt the cart, and duplicate adds are never merged/capped

**Severity:** Low
**Labels:** bug, api-design

### Summary
Two related, lower-severity defects on the same endpoint:
1. A POST with no (or a mismatched) `Content-Type` header isn't rejected — `body-parser`
   silently skips parsing, `req.body` is `undefined`, and that still gets pushed into the
   cart array. `JSON.stringify` turns the `undefined` element into a literal `null` on the
   next `GET /api/cart` — any client iterating the cart has to defensively guard against a
   `null` entry it never explicitly added.
2. Adding the same product `id` more than once never merges into one line item with an
   incremented quantity — every repeat POST creates a new, separate entry, with no cap on
   how many times this can happen.

### Steps to reproduce
1. `POST /api/cart` with a form-encoded body and no `Content-Type` header → `200`, then
   `GET /api/cart` shows a `null` entry.
2. `POST /api/cart` 3× with the same `{"id":555,...}` body → `GET /api/cart` shows 3
   separate entries for `id:555` instead of 1 entry with `quantity` incremented.

### Expected result
Reject bodies that don't parse as valid JSON with a clear 4xx, and either merge repeat
adds of the same product into one line item (typical cart UX) or explicitly document that
duplicates are intentional.

### Evidence
🔴 MANUAL — screenshot to attach.

---

## Informational — JWTs are issued without an expiry claim

Not filed as a bug (no single SEC-01–07 item names it), but worth noting in the main
report: `jwt.sign({id, role}, SECRET_KEY)` at `server.js:51` is called with no
`expiresIn` option. Decoding a real login token's payload confirms it: `{id, role, iat}`
only, no `exp`. Every issued token remains valid indefinitely, and there's no
server-side revocation mechanism. In the spirit of SEC-02 (JWT-based auth), tokens should
have a bounded lifetime.

---

*A slot is reserved for API3 (`POST /api/admin/coupons`) findings once that pipeline runs.*
