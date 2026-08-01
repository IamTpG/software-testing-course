# FR-04 — Personal Profile Management: Domain Testing / BVA Test Case Suite

**Methodology:** Domain Testing via Equivalence Partitioning (EP) and Boundary Value Analysis (BVA), following a 7-step human-in-the-loop QA process. Combinatorial strategy: **Isolated Boundaries + Happy-Path Interactions** (Option C), with deliberate targeted channel crossings for Phone Number and API-only injection tests for Email/Role.

**Source spec (FR-04, Vietnamese, instructor-provided):**
> Người dùng đã đăng nhập có thể cập nhật: Họ Tên, Số điện thoại, Địa chỉ giao hàng mặc định.
> Số điện thoại hợp lệ: bắt đầu bằng số 0, từ 10–11 chữ số.
> Email không được phép thay đổi qua giao diện.
> Người dùng chỉ có thể cập nhật hồ sơ của chính mình; không thể tự thay đổi thuộc tính role.

**Code under test:**
- Frontend: `frontend-web/src/pages/Profile.jsx`
- Backend: `backend/server.js` (`GET`/`PUT /api/users/me`)
- DB schema: `backend/database.js` (`users` table)
- Session state: `frontend-web/src/context/AuthContext.jsx`

**Preconditions (unless a case states otherwise):** Actor is logged in as a standard `role='user'` account, holding a valid JWT, submitting via `PUT /api/users/me`.

---

## Assumption Legend

| Tag | Assumption |
|---|---|
| A1 | Name business cap = 100 chars (assumed; not enforced by spec or code) — Step 2 |
| A2 | Shipping address cap = 255 chars (assumed; not enforced by spec or code) — Step 2 |
| A3 | Whitespace-only name is invalid by business rule — Step 2 Flag A |
| A4 | Phone is strict digits-only, no separators/country code — Step 2 Flag B |
| A5 | Phone is optional; empty string is valid — Step 2 Flag C |
| A6 | Written spec (not the current frontend regex) is the source of truth for phone's valid domain — Step 0 decision #1 |
| A7 | Filler value for a field NOT under test is chosen to avoid masking the field that IS under test |
| A8 | No phone value is simultaneously spec-valid AND accepted by today's buggy frontend regex — a frontend-passing but spec-noncompliant placeholder is used for UI happy-path confirmation, and flagged as a deliberate deviation |
| A9 | Auth-state cases use one fixed nominal valid payload; not crossed with field boundaries — Step 5 |
| A10 | Cross-user case is a single confirmatory regression guard, not a boundary sweep — Step 0 decision #6 |
| A11 | Field-omission (JSON key entirely absent) tested via Direct API only — Step 3 logic-check #1 |
| A12 | Email/Role injection cases pair the injected field with an otherwise-valid Name/Phone/Address baseline, so the injected field is the sole variable under test |
| A13 | The combined Email+Role "kitchen-sink" case is an added-value scenario beyond core EP methodology — Step 3 logic-check #3 |

Nominal valid fillers used throughout: **Name** = `"Nguyen Van A"`, **Phone** = `""` (empty, spec-valid per A5), **Address** = `"123 Nguyen Trai, Thanh Xuan, Hanoi"`.

---

## 1. Full Name — combined valid boundary sweep (Name × Address paired to reduce bloat, per Step 6 optimization rule)
Channel: Direct API. Phone filler = `""` [A5, A7].

| ID | Name value | Address value | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-01 | `"A"` (1, LB) | `""` (0, LB) | 200, both fields saved | Executed: 200, `name:"A"`, `shipping_address:""` persisted exactly as sent (verified via GET). Matches — no defect | A7 |
| TC-02 | `"An"` (2, LB+1) | 1-char string (LB+1) | 200, both fields saved | Executed: 200, `name:"An"`, `shipping_address:"X"` persisted. Matches — no defect | A7 |
| TC-03 | 99-char string (UB-1) | 254-char string (UB-1) | 200, both fields saved | Executed: 200, full 99-char name and 254-char address persisted verbatim. Matches — no defect | A7 |
| TC-04 | 100-char string (UB) | 255-char string (UB) | 200, both fields saved | Executed: 200, full 100-char name and 255-char address persisted verbatim. Matches — no defect | A1, A2, A7 |

## 2. Full Name — isolated invalid classes
Channel: Direct API. Phone/Address filler = nominal valid values [A7].

| ID | Name value | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-05 | `""` (empty) | 400 — rejected | Executed: 200, `name:""` persisted. **Bug confirmed:** backend has zero validation. | A7 |
| TC-06 | `"   "` (whitespace-only) | 400 — rejected | Executed: 200, `name:"   "` persisted verbatim. **Bug confirmed:** same as above. | A3, A7 |
| TC-07 | 101-char string (UB+1) | 400 — rejected (cap violation) | Executed: 200, full 101-char value persisted. **Bug confirmed:** no cap enforced. | A1, A7 |
| TC-08 | `name` key omitted from JSON body | Undetermined pending execution — this endpoint has no defined behavior for an omitted required field; will be resolved to a concrete Pass/Fail once executed and the actual behavior is documented. | Executed: 200, no crash. The omitted `name` key was bound as `undefined`, which node's sqlite3 driver coerced to SQL `NULL` — `GET /api/users/me` afterward showed `name: null`, other fields untouched. Resolves the prior "undetermined" prediction: this driver version silently NULLs rather than throwing. **Bug:** an omitted field silently wipes existing data instead of leaving it unchanged or being rejected. | A11 |

## 3. Shipping Address — isolated invalid classes
Channel: Direct API. Name/Phone filler = nominal valid values [A7].

| ID | Address value | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-09 | 256-char string (UB+1) | 400 — rejected (cap violation) | Executed: 200, full 256-char value persisted. **Bug confirmed:** no cap enforced. | A2, A7 |
| TC-10 | `shipping_address` key omitted from JSON body | Undetermined pending execution — this endpoint has no defined behavior for an omitted required field; will be resolved to a concrete Pass/Fail once executed and the actual behavior is documented. | Executed: 200, no crash. Omitted `shipping_address` key bound as `undefined` → coerced to `NULL`; GET confirmed `shipping_address: null`. Resolves the prior "undetermined" prediction, consistent with TC-08. **Bug:** omission silently wipes the field. | A11 |

## 4. Phone Number — valid/optional classes, dual-channel (core bug investigation)
Name/Address filler = nominal valid values [A7].

| ID | Phone value | Channel | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-11 | `""` (empty, V2) | UI | 200, phone cleared, other fields saved | Executed (manual UI test): submission blocked entirely by a client-side `alert`; name/address changes were also **not saved**, since the whole form submission is blocked before any request is sent. **Bug confirmed:** current frontend regex wrongly rejects empty phone input, and this also prevents saving unrelated fields — confirms Flag C bug | A5, A6, A8 |
| TC-12 | `""` (empty, V2) | API | 200, phone cleared | Executed: 200, `phone:""` persisted. Matches spec — no defect via API | A5 |
| TC-13 | `"0912345678"` (10, LB) | UI | 200, phone saved | Executed (manual UI test): submission blocked entirely by a client-side `alert`; name/address changes were also **not saved**. **Bug confirmed:** frontend regex requires first digit 1–9; this spec-valid value is wrongly rejected client-side, also blocking unrelated field saves | A6, A8 |
| TC-14 | `"0912345678"` (10, LB) | API | 200, phone saved | Executed: 200, `phone:"0912345678"` persisted. Matches spec via API, but only because backend has **no validation at all** (accepted for the wrong reason) | A6 |
| TC-15 | `"09123456789"` (11, UB) | UI | 200, phone saved | Executed (manual UI test): submission blocked entirely by a client-side `alert`; name/address changes were also **not saved**. **Bug confirmed:** rejected client-side, same regex mismatch as TC-13, also blocking unrelated field saves | A6, A8 |
| TC-16 | `"09123456789"` (11, UB) | API | 200, phone saved | Executed: 200, `phone:"09123456789"` persisted. Matches spec via API (again, absence of validation, not correctness) | A6 |

## 5. Phone Number — isolated invalid classes
Channel: Direct API (primary — exposes total absence of server-side validation). Name/Address filler = nominal valid.

| ID | Phone value | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-17 | `"0"` (1 digit) | 400 — rejected (too short) | Executed: 200, `phone:"0"` persisted as-is. **Bug confirmed.** | A4, A6 |
| TC-18 | `"091234567"` (9 digits, LB-1) | 400 — rejected (too short) | Executed: 200, `phone:"091234567"` persisted as-is. **Bug confirmed.** | A6 |
| TC-19 | `"091234567890"` (12 digits, UB+1) | 400 — rejected (too long) | Executed: 200, `phone:"091234567890"` persisted as-is. **Bug confirmed.** | A6 |
| TC-20 | `"1912345678"` (10 digits, wrong prefix) | 400 — rejected (must start with 0) | Executed: 200, `phone:"1912345678"` persisted as-is. **Bug confirmed.** | A6 |
| TC-21 | `"091-2345678"` (non-digit char) | 400 — rejected (charset) | Executed: 200, `phone:"091-2345678"` persisted as-is (hyphen retained). **Bug confirmed.** | A4 |
| TC-22 | `phone` key omitted from JSON body | Undetermined pending execution — this endpoint has no defined behavior for an omitted required field; will be resolved to a concrete Pass/Fail once executed and the actual behavior is documented. | Executed: 200, no crash. Omitted `phone` key bound as `undefined` → coerced to `NULL`; GET confirmed `phone: null`. Resolves the prior "undetermined" prediction, consistent with TC-08/TC-10. **Bug:** omission silently wipes the field. | A5, A11 |

## 6. Phone Number — wrong-prefix class via UI (extra channel crossing)
| ID | Phone value | Channel | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-23 | `"1912345678"` (10 digits, wrong prefix) | UI | Rejected client-side (spec-invalid) | Executed (manual UI test): submission succeeded, all fields saved. **Confirmed bug:** current frontend regex `[1-9][0-9]{8,9}` actively **accepts** this value and submits it — the exact inverse of the spec rule | A6, A8 |

## 7. Email — immutability control (API only; UI cannot send this field)
Name/Phone/Address = nominal valid baseline [A12].

| ID | Email in payload | Expected | Actual / Bug flag |
|---|---|---|---|
| TC-24 | Absent | Email unchanged, 200 | Executed: 200, email remained `test@eshop.com`. Matches — no defect |
| TC-25 | Same as current value | Email unchanged, 200 | Executed: 200, email remained `test@eshop.com`. Matches — no defect |
| TC-26 | Different valid email | Email unchanged, 200 | Executed: 200, email remained `test@eshop.com` despite `email:"new@example.com"` in the payload. Matches — no defect (email not in UPDATE query at all) |
| TC-27 | Malformed value (`"notanemail"`) | Email unchanged, 200 | Executed: 200, email remained `test@eshop.com` despite the malformed value in the payload. Matches — no defect |

## 8. Role — privilege-escalation investigation (API only; UI cannot send this field)
Name/Phone/Address = nominal valid baseline [A12].

| ID | Role in payload | Backend code path | Expected (per spec) | Actual / Bug flag |
|---|---|---|---|---|
| TC-28 | Absent | Falsy → skipped | Role unchanged, 200 | Executed: 200, role remained `"user"`. Matches — no defect |
| TC-29 | `""` (empty string) | Falsy → skipped | Role unchanged, 200 | Executed: 200, role remained `"user"`. Matches — no defect (safe by JS truthiness accident, not by design) |
| TC-30 | `"user"` (current value) | **Truthy → vulnerable UPDATE runs** | Role unchanged, 200 | Executed: 200, role remained `"user"` (self-value re-applied via the truthy branch). No observable defect for this input — but confirms the vulnerable code path executes unconditionally whenever role is truthy, corroborating the TC-31/TC-33 escalation finding rather than standing as its own defect. |
| TC-31 | `"admin"` | **Truthy → vulnerable UPDATE runs** | Role unchanged, 200 | Executed: 200; `GET /api/users/me` confirmed role was overwritten from `"user"` to `"admin"`. **Confirmed critical security bug — privilege escalation.** (Role reset back to `"user"` immediately after, for downstream test cleanliness.) |
| TC-32 | `"xyz"` (garbage) | **Truthy → vulnerable UPDATE runs** | Role unchanged, 200 | Executed: 200; GET confirmed role overwritten to `"xyz"`. **Confirmed bug:** role overwritten to an undefined/invalid role value. (Reset back to `"user"` after.) |

## 9. Combined kitchen-sink attack (added-value case, beyond core EP methodology) [A13]
| ID | Payload | Channel | Expected | Actual / Bug flag |
|---|---|---|---|---|
| TC-33 | Valid Name/Phone/Address + `email="attacker@evil.com"` + `role="admin"` | API | Email and role both unchanged, 200 | Executed: 200; GET confirmed email stayed `test@eshop.com` (safe), but **role was overwritten to `"admin"`** — the escalation succeeds even hidden inside an otherwise-ordinary profile update, with no suspicious-looking request shape. **Confirmed.** (Role reset back to `"user"` after.) |

## 10. Authentication State (fixed regression-guard set) [A9]
| ID | Auth condition | Payload | Expected | Actual / Bug flag |
|---|---|---|---|---|
| TC-34 | Missing `Authorization` header | Nominal valid | 401 | Executed: request with no `Authorization` header returned `401 {"error":"Unauthorized"}`. Matches — no defect |
| TC-35 | Invalid/expired token | Nominal valid | 403 | Executed: request with a malformed JWT (`Bearer invalid.token.value`) returned `403 {"error":"Forbidden"}`. Matches — no defect |

## 11. Cross-user regression guard (single confirmatory case) [A10]
| ID | Scenario | Expected | Actual / Bug flag |
|---|---|---|---|
| TC-36 | User A holds a valid token, submits a profile update; User B's row is checked afterward | Only User A's row is modified; User B's row is untouched | Executed: logged in as Admin (User A) and Test User (User B) separately; Admin submitted a profile update (name/phone/address); GET afterward confirmed Test User's row was completely untouched, and only Admin's own row changed. Matches — structurally guaranteed (row target is always `req.user.id` from the JWT; no client-suppliable target-user field exists on this endpoint). (Admin's profile fields were reverted to seed values after the test.) |

## 12. UI channel — current-implementation happy path (confirmatory) [A8]
| ID | Name | Phone | Address | Channel | Expected (given today's buggy frontend) | Note |
|---|---|---|---|---|---|---|
| TC-37 | `"Nguyen Van A"` | `"912345678"` (frontend-passing, spec-noncompliant) | `"123 Nguyen Trai, Thanh Xuan, Hanoi"` | UI | 200, all three fields saved | Executed (manual UI test): submission succeeded, all three fields saved as expected. This is **not** the spec-ideal happy path — no phone value can satisfy both the spec and today's frontend regex simultaneously (see TC-11/13/15/23). This case only confirms the save mechanism works end-to-end today. |

---

## Summary of Confirmed/Expected Defects

1. **Phone regex mismatch (frontend vs. spec)** — `Profile.jsx` line 43 requires first digit 1–9 and 9–10 total digits; spec requires first digit 0 and 10–11 total digits. Every spec-valid phone number is rejected by the UI (TC-11, TC-13, TC-15); the wrong-prefix class is wrongly accepted (TC-23). **GitHub Issue:** [BUG-A-11 #33](https://github.com/dinosauce-285/Software-Testing-G02/issues/33)
2. **Empty phone blocks unrelated saves** — the buggy regex rejects `""`, so a user cannot save just their name/address without a valid phone on file (TC-11), even though phone should be optional (Flag C). **GitHub Issue:** [BUG-A-12 #34](https://github.com/dinosauce-285/Software-Testing-G02/issues/34)
3. **Zero server-side validation** on `name`, `phone`, `shipping_address` — every length/format/charset invalid class is silently accepted and persisted by the backend (TC-05–TC-07, TC-17–TC-21). **GitHub Issue:** [BUG-A-13 #35](https://github.com/dinosauce-285/Software-Testing-G02/issues/35)
4. **Critical: role privilege-escalation vulnerability** — `PUT /api/users/me` applies a client-supplied `role` field whenever it's truthy (`server.js` lines 118–129), letting any authenticated user set their own `role` to `"admin"` (TC-31), including hidden inside an otherwise-normal profile update (TC-33). **GitHub Issue:** [BUG-A-10 #32](https://github.com/dinosauce-285/Software-Testing-G02/issues/32)
5. **No confirmed defect** in: email immutability, auth-state gating, or cross-user isolation.
6. **Confirmed: silent NULL-coercion on field omission** — when `name`, `shipping_address`, or `phone` is omitted entirely from the JSON payload (TC-08, TC-10, TC-22), the endpoint returns 200 with no crash; the omitted key is bound as `undefined` and node's sqlite3 driver coerces it to SQL `NULL`, silently wiping the existing value instead of leaving it unchanged or rejecting the request. A partial-update client that omits an untouched field will unintentionally erase it. **GitHub Issue:** [BUG-A-14 #36](https://github.com/dinosauce-285/Software-Testing-G02/issues/36)
