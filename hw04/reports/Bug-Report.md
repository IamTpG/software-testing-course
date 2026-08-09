# HW04 — Bug Report

7 defects, each independently re-confirmed via automated cross-browser UI testing (all originally discovered in HW02's Domain Testing pass — this report demonstrates each is also triggerable through real browser interaction, not just direct API calls). Screenshots are in [`reports/screenshots/`](screenshots/), captured automatically by Playwright at the moment of the failing assertion (`screenshot: 'only-on-failure'`).

**Status: draft content only.** None of these have been posted to GitHub Issues on `dinosauce-285/Software-Testing-G02` (the group's shared issue-tracking repo, required by the instructors) yet — that's a separate, explicit step for you to review and authorize before anything gets posted publicly.

---

## BUG-1 — [FR-04] Frontend phone validation regex is the inverse of the spec (Critical)

**Feature:** Personal Profile Management
**Severity:** Major

**Steps to reproduce:**
1. Log in as any user, go to Profile.
2. Enter a spec-valid phone number (10-11 digits, starting with `0`, e.g. `0912345678`).
3. Click "Cập nhật".

**Expected:** Per spec ("bắt đầu bằng số 0, từ 10–11 chữ số"), the number should be accepted and saved.
**Actual:** Client-side regex `/^[1-9][0-9]{8,9}$/` rejects it (requires first digit 1-9), blocking the whole form submission with an alert. Conversely, spec-*invalid* numbers (wrong first digit) are wrongly *accepted*.

**Automated evidence:** `automation/tests/fr04-profile/profile-phone-bugs.spec.ts` — TC-13, TC-15 (valid numbers wrongly rejected), TC-23 (invalid number wrongly accepted).
**Screenshot:** `screenshots/BUG-A11-phone-regex-rejects-valid-number.png` (Profile page with a valid `0912345678` entered, immediately before the assertion on the rejection alert fails)

---

## BUG-2 — [FR-04] Empty phone (a valid, optional field) blocks saving unrelated fields (Major)

**Feature:** Personal Profile Management
**Severity:** Major

**Steps to reproduce:**
1. Log in, go to Profile.
2. Clear the phone field (leave it empty — phone is optional per spec).
3. Change Name and/or Address.
4. Click "Cập nhật".

**Expected:** Name/Address should save; phone should clear (spec: phone is optional).
**Actual:** The same regex bug (BUG-1) rejects the empty string too, blocking the *entire* submission — so even unrelated Name/Address changes are silently lost.

**Automated evidence:** `profile-phone-bugs.spec.ts` — TC-11.
**Screenshot:** `screenshots/BUG-A12-empty-phone-blocks-form-save.png`

---

## BUG-3 — [FR-04] Zero server-side validation on Name/Address (Major)

**Feature:** Personal Profile Management
**Severity:** Major

**Steps to reproduce:**
1. Log in, go to Profile.
2. Set Name to whitespace-only (`"   "`), or a 101+ character string; or Address to 256+ characters.
3. Click "Cập nhật", reload the page.

**Expected:** Rejected, or at minimum capped/trimmed.
**Actual:** `PUT /api/users/me` performs no validation at all — any value is persisted verbatim, confirmed by reload.

**Automated evidence:** `automation/tests/fr04-profile/profile-invalid-fields.spec.ts` — TC-06, TC-07, TC-09.
**Screenshot:** `screenshots/BUG-A13-zero-name-validation.png`

---

## BUG-4 — [FR-08] Backend never recalculates `total_amount` from the server-side cart (Critical)

**Feature:** Checkout
**Severity:** Critical

**Steps to reproduce:**
1. Add items to cart (e.g. iPhone 15 Pro Max + Samsung Galaxy S24 Ultra = 58,000,000 VND), proceed to checkout.
2. Edit the "Tổng tiền thanh toán" input to any other value (tested: -1, 0, 1, off-by-one, 999,999,999, 1,000,000,000, `Number.MAX_SAFE_INTEGER`, a decimal).
3. Submit, then check the resulting order via `GET /api/orders/my-orders`.

**Expected:** Spec explicitly requires server-side recalculation from the cart ("Backend phải tự tính lại tổng tiền; không chấp nhận giá trị total_amount do client gửi lên").
**Actual:** `POST /api/checkout` inserts the client-submitted value verbatim, with zero product-price lookup. Every tampered value persists exactly as submitted, confirmed for all boundary/edge values tested.

**Automated evidence:** `automation/tests/fr08-checkout/checkout-total-tampering.spec.ts` — TC-05 through TC-14 (10 of 11 rows; TC-01, the honest value, correctly passes since it can't be distinguished from a coincidence at that one value).
**Screenshot:** `screenshots/BUG-B08-total-amount-not-recalculated.png` (zero-total case)

---

## BUG-5 — [FR-08] No cart-size guard — an order is created even for an empty cart (Major)

**Feature:** Checkout
**Severity:** Major

**Steps to reproduce:**
1. While logged in, navigate directly to `/checkout` without adding anything to the cart.
2. Submit.

**Expected:** Rejected — nothing to purchase.
**Actual:** `200`, an order is created. Combined with BUG-4, this allows a fully attacker-priced order for zero actual products.

**Automated evidence:** `automation/tests/fr08-checkout/checkout-empty-cart.spec.ts` — TC-16, TC-17.
**Screenshot:** `screenshots/BUG-B10-empty-cart-checkout-accepted.png`

---

## BUG-6 — [FR-19] No role check on either admin endpoint (Critical)

**Feature:** User Management (Admin)
**Severity:** Critical

**Steps to reproduce:**
1. Log in as any account (even a plain `user`-role account, or one carrying an arbitrary garbage role string).
2. Manually place that account's token into the admin panel's `localStorage["adminToken"]` and reload (bypasses the admin login form's client-side role check, which is UI-only — the backend never verifies role itself).

**Expected:** Rejected — this is an admin-only panel.
**Actual:** The full dashboard renders, including the Users tab with working delete buttons, for any authenticated session regardless of role. Confirmed across 8 distinct role values (`user`, `superadmin`, `moderator`, `"0"`, `"999"`, `ADMIN`, `null`, `"admin "`).

**Automated evidence:** `automation/tests/fr19-user-management/user-management-role-bypass.spec.ts` — 8/8 rows.
**Screenshot:** `screenshots/BUG-C08-no-role-check-admin-panel.png` (full dashboard rendered for a bypassed non-admin session)

---

## BUG-7 — [FR-19] No self-deletion guard — an admin can delete their own logged-in account (Critical)

**Feature:** User Management (Admin)
**Severity:** Critical

**Steps to reproduce:**
1. Log in to the admin panel, go to "Người dùng".
2. Click "Xóa" on the row matching your own currently-logged-in account.

**Expected:** Spec explicitly requires this be blocked ("không được xóa chính tài khoản đang đăng nhập"). No confirmation dialog exists at all.
**Actual:** The account is deleted immediately, with zero confirmation and zero self-id check. If this is the only admin account, the system loses all admin access until directly restoring the database.

**Automated evidence:** `automation/tests/fr19-user-management/zz-user-management-destructive.spec.ts` — TC-14.
**Screenshot:** `screenshots/BUG-F2-admin-self-deletion.png` (Users table completely empty immediately after: both the admin and the previously-deleted Test User are gone)

---

## Next step

Once you've reviewed this content, let me know and I can post these as GitHub Issues on `dinosauce-285/Software-Testing-G02` (one per bug, each with its screenshot attached) — I won't do that without your explicit go-ahead since it's a public action on your group's shared repo, not just yours.
