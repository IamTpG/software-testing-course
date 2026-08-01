# FR-08 — Checkout: Domain Testing / BVA Test Case Suite

**Methodology:** Domain Testing via Equivalence Partitioning (EP) and Boundary Value Analysis (BVA), following a 6-step human-in-the-loop QA process. Combinatorial strategy: **Isolated Boundaries + Happy-Path Interactions** (Option C), with three deliberate targeted interactions (empty-cart × large-tampered-total stacking, a coupon smoke test, and a full happy-path combining product-list/address/cart-clear assertions). 20 test cases total.

**Source spec (FR-08, Vietnamese, instructor-provided):**
> Chỉ người dùng đã đăng nhập mới tiến hành thanh toán được.
> Tổng tiền thanh toán được tính tự động từ giỏ hàng và không cho phép người dùng chỉnh sửa trực tiếp.
> Giao diện hiển thị đầy đủ danh sách sản phẩm đặt mua.
> Backend phải tự tính lại tổng tiền; không chấp nhận giá trị total_amount do client gửi lên.
> Sau thanh toán thành công, giỏ hàng được xóa.

**Code under test:**
- Frontend: `frontend-web/src/pages/Checkout.jsx`, `frontend-web/src/pages/Cart.jsx`
- Cart state: `frontend-web/src/context/CartContext.jsx`
- Backend route: `backend/server.js` (`POST /api/checkout`, `authenticateToken`, `POST /api/apply-coupon`, `POST /api/coupon-usage`)
- DB schema: `backend/database.js` (`orders`, `products` tables)
- Routing: `frontend-web/src/App.jsx`

**Preconditions (unless a case states otherwise):** Actor is logged in as a standard `role='user'` account, holding a valid JWT, submitting via `POST /api/checkout`.

**Fixture cart (used throughout, drawn from actual `database.js` seed data):**

| Item | Unit Price (VND) | Qty | Subtotal |
|---|---|---|---|
| iPhone 15 Pro Max | 30,000,000 | 1 | 30,000,000 |
| Samsung Galaxy S24 Ultra | 28,000,000 | 1 | 28,000,000 |
| **True Cart Total (TT)** | | | **58,000,000** |

---

## Assumption Legend

| Tag | Assumption |
|---|---|
| A1 | Fixture cart = iPhone 15 Pro Max (30,000,000) ×1 + Samsung Galaxy S24 Ultra (28,000,000) ×1 = True Total (TT) 58,000,000 VND, drawn from real seed data — Step 3 |
| A2 | Numeric `total_amount` tamper values restricted to non-negative integers; decimal/float values folded into the malformed (I5) class rather than a separate BVA sweep — Step 2 ambiguity #2 |
| A3 | Upper business-cap boundary set at 1,000,000,000 VND as a realistic-but-implausible probe, chosen over an architectural max as the primary upper boundary — Step 2 ambiguity #3 |
| A4 | Architectural-extreme probe (`Number.MAX_SAFE_INTEGER`) is an added-value case beyond core BVA methodology, mirroring FR-04's kitchen-sink treatment — Step 3 |
| A5 | Empty-cart checkout submission is treated as a confirmed defect (not merely an untested edge), per explicit scoping decision — Step 2 ambiguity #1 |
| A6 | Coupon feature is included only as a single binary variable (applied / not applied); internal coupon business rules (discount math, expiry, usage caps) are explicitly out of scope, owned by FR-09 — Step 0 decision #2 |
| A7 | `shipping_address` receives one lightweight confirmatory case only, not a full BVA sweep, since it is absent from the FR-08 spec and overlaps FR-04's own address boundary analysis — Step 0 decision #6 |
| A8 | Post-purchase display of purchased products (order history/detail) is explicitly out of scope for FR-08 — the missing `order_items` persistence is a structural gap relevant to FR-11 (order history), not a testable FR-08 behavior — Step 0 decision #4 |
| A9 | Cart quantity / line-item-count bounds are out of scope; the fixture cart is used as-is across all cases, not swept — Step 0 decision #5 |
| A10 | Auth-state invalid classes (missing/invalid token) are tested in isolation with an otherwise-honest body, since `authenticateToken` short-circuits before any other field is read — Step 4 finding #1 |
| A11 | Each `total_amount` tampering test case pairs a single invalid class with an otherwise-honest cart/token/address, per the invalid-class isolation rule — Step 5 selection rule |

---

## 1. Full happy-path (all valid classes combined, per Step 5 optimization rule)
Channel: Direct API. Token = valid; Cart = fixture (A1); Coupon = not applied; `shipping_address` = non-empty valid string.

| ID | `total_amount` | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-01 | `58000000` (= TT, honest) | 200; order persisted with recalculated total = 58,000,000; full product list shown pre-payment; **cart cleared after success** | Executed: 200, `orderId:3` created with `total_amount` persisted = 58,000,000 (confirmed via `GET /api/orders/my-orders`) — but only because the honest value happens to match, not because the backend recalculates anything (server.js:297-309 inserts `req.body.total_amount` verbatim). **Bug confirmed:** `GET /api/cart` immediately after checkout still returned both fixture items — `clearCart()` is never invoked; cart remains populated after a successful order. **Additionally manually verified end-to-end via the real UI** (all other total_amount cases in this report, TC-01/05-15, were run via Direct API only): editing the total in the actual Checkout page input and submitting produced an order persisted with the tampered value, confirming defects #1 and #2 together work through the real browser, not just via direct API calls | A1 |

## 2. Authentication — isolated invalid classes [A10]
Channel: Direct API unless noted. Otherwise-honest body (fixture cart, `total_amount = 58000000`, valid address).

| ID | Auth condition | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-02 | Missing `Authorization` header | 401; no order created | Executed: `401 {"error":"Unauthorized"}`, no order created. Matches — `server.js:103` returns 401 before any other field is read. No defect | A10 |
| TC-03 | Invalid/malformed token signature | Rejected; no order created | Executed: `403 {"error":"Forbidden"}`, no order created. Matches — `server.js:106` correctly rejects the request. No defect | A10 |
| TC-04 | UI: direct navigation to `/checkout` by URL while not logged in | The spec requires only that a guest cannot actually complete a checkout/payment ("tiến hành thanh toán được") — not that the checkout page itself be inaccessible to view | **No defect (corrected — originally over-flagged as a bug).** `App.jsx:58` registers `/checkout` with no page-level auth guard, and `Checkout.jsx` renders regardless of login state. But the spec's literal requirement concerns the checkout *action*, not page visibility: any attempt to actually submit a payment as a guest still correctly fails at the API (401, per TC-02), so the business rule is enforced. A guest viewing a non-functional checkout form is a UX/defense-in-depth observation at most, not a violation of this spec line. Manually verified: guests can view the cart, but only logged-in users can proceed through to a working checkout | — |

## 3. `total_amount` — honest-value boundary (near-TT tampering) [A2, A11]
Channel: Direct API. Valid token; fixture cart; no coupon; valid address.

| ID | `total_amount` | Boundary | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-05 | `57999999` | TT−1 | Recalculated to 58,000,000 | Executed: 200, `orderId:4`, `total_amount` persisted verbatim as 57,999,999 (confirmed via GET). **Bug confirmed:** backend performs zero recalculation, even for a 1-VND tamper | A2, A11 |
| TC-06 | `58000001` | TT+1 | Recalculated to 58,000,000 | Executed: 200, `orderId:5`, `total_amount` persisted verbatim as 58,000,001 (confirmed via GET). **Bug confirmed.** | A2, A11 |

## 4. `total_amount` — zero/negative structural boundary [A2, A11]
Channel: Direct API. Same fixture context as above.

| ID | `total_amount` | Boundary | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-07 | `-1` | LB−1 | Rejected or recalculated to 58,000,000 | Executed: 200, `orderId:6`, `total_amount:-1` persisted as-is (confirmed via GET). **Bug confirmed:** SQLite `INTEGER` column has no constraint; order recorded with a negative total | A2, A11 |
| TC-08 | `0` | LB | Rejected or recalculated to 58,000,000 | Executed: 200, `orderId:7`, `total_amount:0` persisted as-is (confirmed via GET). **Bug confirmed:** a 58-million-VND cart recorded as free | A2, A11 |
| TC-09 | `1` | LB+1 | Rejected or recalculated to 58,000,000 | Executed: 200, `orderId:8`, `total_amount:1` persisted as-is (confirmed via GET). **Bug confirmed:** near-total elimination of amount owed | A2, A11 |

## 5. `total_amount` — upper business-cap boundary [A3, A11]
Channel: Direct API. Same fixture context as above.

| ID | `total_amount` | Boundary | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-10 | `999999999` | UB−1 | Recalculated to 58,000,000 | Executed: 200, `orderId:9`, persisted verbatim as 999,999,999 (confirmed via GET). **Bug confirmed.** | A3, A11 |
| TC-11 | `1000000000` | UB | Recalculated to 58,000,000 | Executed: 200, `orderId:10`, persisted verbatim as 1,000,000,000 (confirmed via GET). **Bug confirmed.** | A3, A11 |
| TC-12 | `1000000001` | UB+1 | Recalculated to 58,000,000 | Executed: 200, `orderId:11`, persisted verbatim as 1,000,000,001 (confirmed via GET). **Bug confirmed.** | A3, A11 |

## 6. `total_amount` — architectural-extreme probe (added-value, beyond core BVA) [A4]

| ID | `total_amount` | Expected | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-13 | `9007199254740991` (`Number.MAX_SAFE_INTEGER`) | N/A — exploratory probe only | Executed: 200, `orderId:12`; `GET /api/orders/my-orders` confirmed `total_amount` persisted exactly as `9007199254740991` — no precision loss, no overflow/coercion anomaly. Confirms the prediction exactly: persists verbatim like every other tampered value | A4 |

## 7. `total_amount` — non-ordered EP classes (malformed / omitted) [A2, A11]

| ID | `total_amount` | Class | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-14 | `58000000.5` (decimal) | I5 — malformed format | Rejected or recalculated to 58,000,000 | Executed: 200, `orderId:13`; GET confirmed `total_amount` persisted as `58000000.5` (kept as REAL, not coerced to integer) — confirms the prediction exactly | A2, A11 |
| TC-15 | Field omitted entirely from JSON body | I6 — missing required field | Rejected (400) or recalculated to 58,000,000 | Executed: 200, `orderId:14`, no crash; GET confirmed `total_amount: null`. Confirms the prediction exactly — same `undefined`→`NULL` coercion as FR-04's TC-08/TC-10/TC-22 | A11 |

## 8. Cart emptiness — isolated + stacked interaction [A5]
Channel: Direct API. Valid token; no coupon; valid address; `items: []`.

| ID | Cart | `total_amount` | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-16 | Empty (0 items) | `0` | Rejected — nothing to purchase | Executed (before the fixture cart was built, cart confirmed empty via `GET /api/cart`): 200, `orderId:1` created with `total_amount:0`. **Bug confirmed (per scoping decision):** backend never reads or validates `items` at all (`Checkout.jsx` sends `items: cart`, but `server.js:299` never destructures it) — an order is created regardless of cart size | A5 |
| TC-17 (deliberate interaction) | Empty (0 items) | `1000000000` | Rejected — nothing to purchase, and even if allowed, recalculated total should be 0 | Executed (empty cart, immediately after TC-16): 200, `orderId:2` created with `total_amount:1000000000` persisted verbatim (confirmed via GET). **Bug confirmed (severity-stacked):** a fully attacker-controlled total is accepted for an order with zero items — the two confirmed defects (no cart-size guard + no total recalculation) compound into a "phantom paid order" for literally nothing in the cart | A5, A2 |

## 9. Coupon — binary smoke test (deliberate interaction) [A6]
Channel: Direct API. Valid token; fixture cart; valid address; assume one valid, active, pre-existing coupon with a 10% discount, so `POST /api/apply-coupon` returns `final_amount = 52200000`.

| ID | Coupon state | `total_amount` submitted | Expected | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-18 | Applied (`coupon_id` attached) | Whatever value `/api/apply-coupon` returns as `final_amount` | Checkout persists correctly with whatever the backend legitimately recalculates net of a validly-applied discount (coupon math itself out of scope) | Executed: obtained a coupon-computed `total_amount` via `POST /api/apply-coupon` (`code:"SAVE10"`), then submitted checkout with that value and `coupon_id` attached → 200, `orderId:15`, persisted verbatim (confirmed via GET); `POST /api/coupon-usage` succeeded. No **new FR-08** defect beyond #1/#3 (total-trust, cart-not-cleared) — the coupon path still just stores whatever value arrives. (Note: the coupon-computed value did not match this case's originally assumed figure; the discrepancy is coupon-calculation logic owned by FR-09, out of scope for FR-08 per A6.) | A6 |

## 10. `shipping_address` — lightweight confirmatory case [A7]
Channel: Direct API. Valid token; fixture cart; `total_amount = 58000000`; no coupon.

| ID | `shipping_address` | Expected | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-19 | `""` (empty string) | Spec is silent; reasonable expectation is a non-empty address is required for delivery | Executed: 200, `orderId:16`, `shipping_address:""` persisted as-is (confirmed via GET). No validation observed in the `/api/checkout` handler. Documented as a minor observation, not scored as a headline FR-08 defect (overlaps FR-04's own address boundary analysis territory) | A7 |

## 11. Order owner identity — confirmatory regression guard [A9]
Channel: Direct API. User A holds a valid token; request body additionally includes a forged `user_id` field pointing at User B, alongside an otherwise-honest fixture cart/total.

| ID | Scenario | Expected | Actual / Bug flag |
|---|---|---|---|
| TC-20 | Forged `user_id` in body, valid token for User A | Persisted `orders.user_id` = User A (token owner), regardless of any client-supplied owner field | Executed: submitted `user_id:1` (Admin) in the body while authenticated as the test user (id 2). 200, `orderId:17`; GET confirmed `orders.user_id = 2` (token owner), not `1`; Admin's own `GET /api/orders/my-orders` remained empty (no leaked/forged order). **Matches — no defect.** `userId` is bound only to `req.user.id` from the verified JWT (`server.js:298`); the body destructure (`{ total_amount, shipping_address }`) never reads a `user_id`/owner-like field at all, so a forged value is silently ignored. Structural guarantee confirmed, same treatment as FR-04's cross-user regression guard |

---

## Summary of Confirmed/Expected Defects

1. **Critical: backend never recalculates `total_amount` from server-side cart/product data.** `POST /api/checkout` (`server.js:297-309`) inserts the client-submitted `total_amount` verbatim, with no product-price lookup at all — the exact scenario the spec explicitly prohibits (TC-05–TC-15, TC-17). **GitHub Issue:** [BUG-B-08 #38](https://github.com/dinosauce-285/Software-Testing-G02/issues/38)
2. **Critical: the checkout total is directly user-editable in the UI.** `Checkout.jsx:110-121` renders a plain `<input type="number">` bound to `editableTotal`, the literal opposite of "không cho phép người dùng chỉnh sửa trực tiếp." Combined with defect #1, any user can pay any amount for any cart (TC-01, TC-05–TC-15). **GitHub Issue:** [BUG-B-07 #37](https://github.com/dinosauce-285/Software-Testing-G02/issues/37)
3. **Cart is never cleared after a successful checkout.** `clearCart()` (defined in `CartContext.jsx:18`) is never invoked in `Checkout.jsx`'s `handleCheckout` — confirmed even on the nominal happy path (TC-01). **GitHub Issue:** [BUG-B-09 #39](https://github.com/dinosauce-285/Software-Testing-G02/issues/39)
4. **No cart-size guard at checkout.** The backend never reads or validates the `items` array; an order is created for an empty cart (TC-16), and this stacks with defect #1 to allow a fully attacker-priced "phantom" order for zero products (TC-17). **GitHub Issue:** [BUG-B-10 #40](https://github.com/dinosauce-285/Software-Testing-G02/issues/40)
5. **No persisted record of purchased line items.** The `orders` table (`database.js:74-81`) has no `order_items`/line-item table; the `items` array sent by the frontend is silently dropped by the backend. Out of scope for FR-08 test cases per explicit decision. Note: on review of FR-11's actual spec, this gap does **not** block FR-11 compliance — FR-11 only requires displaying order code, date, total amount, and status, none of which depend on itemized line items.
6. **No defect (corrected):** a logged-out user can load the `/checkout` page directly by URL, but any actual payment attempt still correctly fails at the API (401, per TC-02). The spec's actual requirement ("only logged-in users may proceed to checkout/payment") concerns the checkout action, not page-view access, and is satisfied. This was originally over-flagged as a bug based on an inferred reading beyond the literal spec text; corrected after manual verification (TC-04).
7. **No confirmed defect** in: auth-state gating (TC-02, TC-03), order-owner identity / cross-user isolation (TC-20), or the coupon-applied path introducing any *additional* breakage beyond defects #1 and #3 (TC-18).
8. **Confirmed: SQLite type-affinity and driver NULL-coercion behavior at the `total_amount` boundaries.** A decimal value (TC-14, `58000000.5`) is kept as REAL and persisted as-is, uncoerced to integer. An omitted `total_amount` field (TC-15) is bound as `undefined`, which the Node sqlite3 driver coerces to SQL `NULL` — the order is created with `total_amount: null` rather than being rejected, consistent with FR-04's analogous omitted-field findings.
