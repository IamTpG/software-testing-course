# FR-11 — Order History View (User), Mobile App: Domain Testing / BVA Test Case Suite

**Methodology:** Domain Testing via Equivalence Partitioning (EP) and Boundary Value Analysis (BVA), following a 6-step human-in-the-loop QA process. Combinatorial strategy: **Isolated Boundaries + Happy-Path Interactions** (Option C), with two deliberate targeted interactions (a combined status × order-count × cancel-button happy path, and a single representative auth state used to prove `/orders/:id` is wide open rather than crossing every auth state against every ownership/existence combination). 11 test cases total.

**Source spec (FR-11, Vietnamese, instructor-provided):**
> Người dùng chỉ xem được đơn hàng của chính mình.
> Hiển thị: Mã đơn, Ngày đặt, Tổng tiền, Trạng thái hiện tại.
> Trạng thái phải được dịch sang tiếng Việt rõ ràng và phân biệt màu sắc.

**Scope note:** View-only. Order cancellation and admin-side state transitions belong to FR-10/FR-18; the cancel button appearing on this screen is checked only as a single lightweight binary presence/absence oracle (V10), not a state-machine sweep.

**Code under test:**
- Frontend: `frontend-mobile/App.js` (`fetchOrders`, `statusLabel`, order-history render block, cancel button)
- Backend routes: `backend/server.js` (`GET /api/orders/my-orders`, `GET /api/orders/:id`, `PUT /api/admin/orders/:id/status`, `authenticateToken`)
- DB schema: `backend/database.js` (`orders` table)

**Preconditions (unless a case states otherwise):** Actor "User A" is logged in with a valid JWT. A second, distinct "User B" account exists for ownership-mismatch cases.

**Fixture 1 — existence/ownership boundary (used in Sections 3–4):** 3 orders created sequentially via checkout, relying on the `orders.id` `AUTOINCREMENT` column (table starts empty; no order seed data in `database.js`):

| id (creation order) | Owner |
|---|---|
| 1 | User A |
| 2 | User B (different user) |
| 3 | User A |

**Fixture 2 — status/count happy path (used in Section 2):** User A holds 5 orders, one per known status value, set via `PUT /api/admin/orders/:id/status`:

| Status (DB value) | Vietnamese label (expected) |
|---|---|
| pending | Chờ xác nhận |
| confirmed | Đã xác nhận |
| shipping | Đang giao |
| delivered | Đã giao |
| canceled | Đã hủy |

---

## Assumption Legend

| Tag | Assumption |
|---|---|
| A1 | Fixture 1 — 3 sequentially-created orders, ids 1/2/3, with id=2 belonging to a different user (User B) — used for both the existence boundary (V4) and ownership/IDOR (V3) test cases, since `id`s are globally auto-incremented (not per-user) — Step 3 sign-off |
| A2 | Fixture 2 — User A holds exactly 5 orders, one per known status value, reachable only via `PUT /api/admin/orders/:id/status`'s hardcoded transition table, traced in Step 0 to guarantee no out-of-enum value can ever be written — used for the combined V8×V9×V10 happy path (TC-03) — Step 4 dependency #3 |
| A3 | Out-of-enum status values are excluded entirely from this suite; no live write path (checkout hardcodes `"pending"`, cancel only writes `"canceled"`, admin update validates against a fixed transition table) can ever produce one — Step 0 decision #3 |
| A4 | "Mã đơn" is treated as the raw autoincrement `id`; no dedicated order-code field exists in the schema — Step 0 decision #4 |
| A5 | "Ngày đặt" (order date, locale/timezone formatting) is excluded from formal BVA as a display concern, verified only passively within happy-path cases — Step 0 decision #7 |
| A6 | "Tổng tiền" business-rule validity (the value itself) is out of scope for FR-11 and owned by FR-08's checkout logic; FR-11 only verifies correct display of whatever value is already persisted — Step 1, V7 |
| A7 | Number-of-orders (V9) receives EP-only treatment (0/1/many); no pagination exists anywhere in the code, so no upper BVA boundary applies — Step 2/3 sign-off |
| A8 | Cancel-button visibility (V10) is checked only as a single binary presence/absence oracle, bundled into TC-03, not swept against the full order-state-machine transition logic (owned by FR-10/FR-18) — Step 0 scope note |
| A9 | Expired and malformed/invalid JWTs are not tested as separate classes — `jwt.verify`'s error callback (`server.js:105-107`) handles both identically (403), with no distinguishing logic to split on — Step 2 partition rule (classes handled identically are not split) |
| A10 | A single representative unauthenticated caller state is used for the IDOR probe (TC-10), rather than crossing every auth state against V3/V4 on `/orders/:id`, since that endpoint has no auth middleware at all and every auth state is provably equivalent there — Step 4 dependency #4 |
| A11 | "Mã đơn" (id) and "Tổng tiền" (total_amount) display-correctness are verified as passive oracles bundled into the happy-path cases (TC-01–TC-03, TC-07, TC-08), not given dedicated sections of their own, since both are read-only fields with no independently testable invalid class for this FR — Step 1, V5/V7 |
| A12 | A non-numeric id (e.g. `/api/orders/abc`) does not get its own test case — it is predicted to collapse into the same does-not-exist / 404 class as TC-06/TC-09, via SQLite's type-affinity fallback when comparing a TEXT parameter against an INTEGER-affinity `id` column. This is a database-engine-behavior prediction, not a directly-observed code fact (the same reasoning class as FR-19's TC-10), and remains unconfirmed pending actual test execution — Step 3 |

---

## 1. GET /my-orders — Order-count boundary, isolated (V9)
Channel: Direct API / Mobile UI (identical call path — `fetchOrders`, `App.js:174`). Caller: User A, valid token.

| ID | Order count | Boundary | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-01 | 0 orders | LB | "Bạn chưa có đơn hàng nào." empty-state message, no crash | Executed: `GET /api/orders/my-orders` as User A on a fresh, order-free account → 200, `[]`. Matches — `orders.length === 0` branch renders the empty-state text (`App.js:947-948`) | A7 |
| TC-02 | 1 order | LB+1 | Single order card renders with Mã đơn/Ngày đặt/Tổng tiền/Trạng thái | Executed: after one checkout, `GET /api/orders/my-orders` as User A → 200, array of exactly 1 order (id, total_amount, status, shipping_address, created_at all present and correct). Matches — `orders.map` renders one `orderCard` with all four fields (`App.js:950-960`) | A7, A11 |

## 2. GET /my-orders — Status × count × cancel-button combined happy path (V8, V9=many, V10) [A2, A8]
Channel: Direct API / Mobile UI. Caller: User A, valid token. Fixture 2 (5 orders, one per status).

| ID | Scenario | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-03 | Single fetch/render of all 5 orders (`pending`, `confirmed`, `shipping`, `delivered`, `canceled`) | All 5 statuses render translated Vietnamese labels (per Fixture 2 table); cancel button visible only on `pending`/`confirmed` rows, absent on the other 3 | Executed (Direct API leg): built Fixture 2 by giving User A 5 orders (ids 1,3,4,5,6) and driving each through `PUT /api/admin/orders/:id/status` to a distinct terminal status. A single `GET /api/orders/my-orders` call returned all 5 orders in one response with `status` values exactly `pending` (id1), `confirmed` (id3), `shipping` (id4), `delivered` (id5), `canceled` (id6) — matches Fixture 2 exactly, confirming the backend data underlying this case is correct. The Vietnamese-label translation and cancel-button gating are frontend rendering logic (`App.js:331-339`, `App.js:961`) not exercisable via curl — those conclusions still stand as originally assessed by code reading, not independently re-verified in a browser this session. **No status row is visually differentiated by color** (see TC-11) — all 5 render in identical default text styling despite carrying different, correctly-translated labels | A2, A8, A11 |

## 3. GET /my-orders — Authentication isolated invalid classes (V2) [A9]
Channel: Direct API. Otherwise-honest request (User A's identity implied by token where valid).

| ID | Auth condition | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-04 | Missing `Authorization` header | 401; no data returned | Executed: `401 {"error":"Unauthorized"}`, no data. Matches — `authenticateToken` (`server.js:103`) returns 401 before the query runs | — |
| TC-05 | Invalid/malformed or expired token | Rejected; no data returned | Executed: malformed token (`Bearer invalid.token.value`) → `403 {"error":"Forbidden"}`, no data. Matches — `jwt.verify` err branch (`server.js:106`) returns 403; expired and malformed tokens are indistinguishable at this check and both correctly rejected | A9 |

## 4. GET /orders/:id — Existence boundary (V4), requester = owner or n/a [A1]
Channel: Direct API (endpoint is never called by the mobile UI itself, per Step 0 finding). Caller: User A, valid token (irrelevant to outcome — see Section 5).

| ID | id | Boundary | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-06 | 0 | LB−1 | Does not exist → 404 | Executed: `404 {"error":"Order not found"}`. Matches — `if (!order) return res.status(404)...` (`server.js:346`); id 0 was never assigned by `AUTOINCREMENT` | A1 |
| TC-07 | 1 | LB | Exists, User A's own order → 200 with correct fields | Executed: 200, order returned with all fields (`id`, `total_amount`, `status`, `shipping_address`, `created_at`) correct and matching Fixture 1. Matches | A1, A11 |
| TC-08 | 3 | UB | Exists, User A's own order → 200 with correct fields | Executed: 200, order returned with all fields correct and matching Fixture 1. Matches | A1, A11 |
| TC-09 | 4 | UB+1 | Does not exist → 404 | Executed (run before Fixture 2 created any further orders, preserving the boundary): `404 {"error":"Order not found"}`. Matches — first never-created id at that point, same 404 path as TC-06 | A1 |

**Note (no dedicated test case, per A12):** a non-numeric id (e.g. `id="abc"`) is predicted, not confirmed, to fall into this same does-not-exist / 404 class via SQLite's type-affinity fallback — see A12 for why this is treated as a prediction rather than a settled fact.

## 5. GET /orders/:id — Ownership / IDOR (V3), critical finding [A1, A10]
Channel: Direct API — **not reachable through mobile UI navigation** (the app only ever calls `/my-orders`, per Step 0), but directly reachable by any HTTP client regardless of UI usage.

| ID | id | Caller | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-10 | 2 (User B's order — same row as Fixture 1's LB+1/UB−1 boundary value) | No `Authorization` header at all (representative single auth state, A10) | Spec: "Người dùng chỉ xem được đơn hàng của chính mình" → rejected (401/403/404), not User B's data | Executed: `GET /api/orders/2` with **no** `Authorization` header at all → **200**, full JSON body of User B's order (`id:2, user_id:3, total_amount:5000000, status:"pending", shipping_address:"456 Le Loi, Q1, HCMC"`) returned to the completely unauthenticated caller. **Critical bug confirmed (IDOR):** `GET /api/orders/:id` (`server.js:344-349`) has no `authenticateToken` middleware and no `user_id` filter (`SELECT * FROM orders WHERE id = ?`). Confirms the spec's core ownership rule is entirely unenforced on this endpoint, in direct contrast to `/my-orders`'s correct `WHERE user_id = req.user.id` filter (`server.js:313`) | A1, A10 |

## 6. Color differentiation — single confirmed defect (V11)
Channel: Mobile UI (visual inspection of rendered screen; no API involved).

| ID | Scenario | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-11 | Rendered order-history screen, any/all of Fixture 2's 5 statuses (reuses TC-03's render) | Spec: "phân biệt màu sắc" — status text must be visually color-differentiated per status | **Confirmed bug:** full-file grep for `color`/`Color` across `App.js` shows no `statusColor`/`getStatusColor` helper and no conditional styling keyed by status anywhere; the status `<Text>` (`App.js:960`) carries no `style` prop at all. All 5 statuses render in identical, undifferentiated default text color. Absence is total, not partial — one case suffices, not a per-status sweep | — |

---

## Summary of Confirmed/Expected Defects

1. **Critical: no authentication or ownership check on `GET /api/orders/:id` (IDOR).** The endpoint (`server.js:344-349`) has no `authenticateToken` middleware and its query has no `user_id` filter — any caller, authenticated or not, can fetch any order by id and see another user's `total_amount`, `status`, and `shipping_address` (TC-10). This directly contradicts the spec's first line ("chỉ xem được đơn hàng của chính mình") and stands in stark contrast to `/my-orders`, which correctly scopes to the caller (TC-01–TC-05). Not reachable via the mobile UI's own navigation, but directly reachable by any HTTP client. **GitHub Issue:** [BUG-D-10 #44](https://github.com/dinosauce-285/Software-Testing-G02/issues/44)
2. **Confirmed: no color differentiation of order status anywhere in the mobile app.** No status-keyed styling exists in `frontend-mobile/App.js`; all 5 statuses render in identical default text color (TC-11), contradicting the spec's explicit "phân biệt màu sắc" requirement. Status *translation* to Vietnamese, by contrast, is fully correct (TC-03). **GitHub Issue:** [BUG-D-11 #45](https://github.com/dinosauce-285/Software-Testing-G02/issues/45)
3. **No defect:** `/my-orders` correctly requires a valid token and correctly scopes results to the caller's own orders across all order-count classes (0/1/many) (TC-01–TC-05).
4. **No defect:** all 5 known status values translate to the correct Vietnamese label, and the cancel button is correctly gated to appear only on `pending`/`confirmed` orders (TC-03).
5. **No defect:** `GET /orders/:id`'s existence-boundary handling itself is correct — ids 0 and 4 (never assigned) correctly 404, ids 1 and 3 (existing) correctly return data (TC-06–TC-09). The endpoint's failure is exclusively the missing ownership/auth check (defect #1), not its existence-check logic.
6. **Out of scope, confirmed non-issue for FR-11:** the `orders` table's lack of `order_items`/line-item persistence (flagged in FR-08's report) does not block FR-11 — none of the four required display fields (Mã đơn, Ngày đặt, Tổng tiền, Trạng thái) depend on itemized products.
