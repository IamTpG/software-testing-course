# GitHub Issues draft — IamTpG/software-testing-course

Found incidentally while reading `eshop-sut/backend/server.js` during HW05 test-plan design (self-verification step before building each JMeter plan) — not the focus of this homework, but genuine functional bugs worth recording per Section 6 Task 1.

**Posted:**
- Issue 1 (price type flip): https://github.com/IamTpG/software-testing-course/issues/7
- Issue 2 (404-as-200): https://github.com/IamTpG/software-testing-course/issues/8
- Issue 3 (coupon negative discount): https://github.com/IamTpG/software-testing-course/issues/9

Screenshots still to be attached to each issue (posted text-only for now, per plan).

Content below kept as the local record / draft source.

---

## Issue 1

**Title:** `[HW05][Products] price field type flips between number and string depending on product id parity`

**Body:**
```markdown
**Severity:** Minor (data-consistency / API contract bug)
**Endpoint:** `GET /api/products/:id`
**File:** `eshop-sut/backend/server.js:162`
**Found via:** HW05 performance-test design self-verification (before building the Load test plan), re-confirmed live with curl.

### Steps to reproduce
```bash
curl -s http://localhost:3000/api/products/1 | python3 -c "import json,sys; d=json.load(sys.stdin); print(type(d['price']), d['price'])"
curl -s http://localhost:3000/api/products/2 | python3 -c "import json,sys; d=json.load(sys.stdin); print(type(d['price']), d['price'])"
```

### Expected
`price` should have the same JSON type (number) regardless of which product is requested.

### Actual
```
id=1 (odd)  -> <class 'int'> 30000000
id=2 (even) -> <class 'str'> 28000000
```
Root cause, `server.js:162`:
```js
if (row.id % 2 === 0) row.price = row.price.toString();
```
Any client that assumes `price` is always numeric (e.g. does arithmetic on it) will break for exactly half of all products.
```

---

## Issue 2

**Title:** `[HW05][Products] GET /api/products/:id returns HTTP 200 with {} instead of 404 for a nonexistent id`

**Body:**
```markdown
**Severity:** Minor (incorrect HTTP semantics)
**Endpoint:** `GET /api/products/:id`
**File:** `eshop-sut/backend/server.js:161`
**Found via:** HW05 performance-test design self-verification, re-confirmed live with curl.

### Steps to reproduce
```bash
curl -s -o /tmp/resp.json -w "HTTP %{http_code}\n" http://localhost:3000/api/products/999
cat /tmp/resp.json
```

### Expected
A nonexistent product id should return `404 Not Found` with an error body, consistent with how other endpoints in this API report "not found" (e.g. `POST /api/forgot-password` correctly returns 404 for an unknown email).

### Actual
```
HTTP 200
{}
```
Root cause, `server.js:161`:
```js
if (!row) return res.status(200).json({});
```
Clients checking `response.ok` (any 2xx) instead of validating the body will silently treat a missing product as a successful, empty response.
```

---

## Issue 3

**Title:** `[HW05][Coupons] Percent-type coupon discount formula produces a large negative discount instead of the intended percentage off`

**Body:**
```markdown
**Severity:** Major (business-logic / financial calculation bug)
**Endpoint:** `POST /api/apply-coupon`
**File:** `eshop-sut/backend/server.js:398-401`
**Found via:** HW05 Spike test plan design (transactional group) — self-verification before building assertions, re-confirmed live with curl and again in the real JMeter run's View Results Tree.

### Steps to reproduce
```bash
curl -s -X POST http://localhost:3000/api/apply-coupon \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE10","total_amount":500000,"user_id":1}'
```

### Expected
`SAVE10` is a 10%-off coupon (seeded as `('SAVE10', 'percent', 10, 300000, '2099-12-31', 1, 1)` in `database.js`). On a 500,000₫ order, the discount should be 50,000₫ and `final_amount` should be 450,000₫.

### Actual
```json
{"success":true,"coupon_id":1,"discount_amount":-4500000,"final_amount":5000000,"message":"Áp dụng thành công! Giảm 10%"}
```
The order total is *increased tenfold* instead of discounted 10%. Root cause, `server.js:398-401`:
```js
if (coupon.type === "percent") {
  discount_amount = Math.floor(
    total_amount * (1 - coupon.discount_value),
  );
}
```
`coupon.discount_value` is stored as a whole number (`10`, meaning "10%"), but the formula treats it as if it were already a fraction. It should be `total_amount * (coupon.discount_value / 100)`. Every percent-type coupon in the system is affected (`SAVE10`, and `EXPIRED` once its expiry is fixed) — fixed-type coupons (`BIGBUY`, `VIP100`) are not affected, since they don't go through this branch.

Also visible directly in the HW05 Spike test run's View Results Tree report (`results/23127244_Spike_20260815_report`), which captured the same response body live under load.
```

---

## After posting

- [x] Posted to `IamTpG/software-testing-course` (issues #7, #8, #9).
- [ ] Attach a real screenshot to each issue (curl/Postman output, or for Issue 3 specifically, a screenshot of the View Results Tree panel showing the response — that data is already saved in `results/23127244_Spike_20260815_report`). Can be added by editing the issue directly on GitHub, no need to repost.
