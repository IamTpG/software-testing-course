# AI Audit Log — FR-08 Checkout

**AI tool:** Claude Code (Claude Sonnet 5)
**Date:** 2026-08-09 (autonomous continuation, user handed off and went to sleep)
**Skill applied:** `playwright-automation` (`.claude/skills/playwright-automation/SKILL.md`)

## Step 0 — Scope & code grounding

- Read `Checkout.jsx`, `Cart.jsx`, `CartContext.jsx`, `Home.jsx`, `ProductDetail.jsx`, `App.jsx`, the `POST /api/checkout` and `POST /api/apply-coupon` handlers, and the HW02 FR-08 BVA report.
- Found: no stable selectors on Home/Checkout inputs (same gap as FR-04); cart state is pure in-memory React with no persistence; `POST /api/checkout`'s response has no echoed fields (same as FR-04's profile endpoint), so verification needs a follow-up API read; `shipping_address` is never sent by the real Checkout UI at all, despite the backend accepting it.
- **Decisions made from this:** added `data-testid`s to Home/Checkout; selected 15 pre-existing cases, all UI-native without reinterpretation; excluded TC-02/03/15/19/20 as structurally impossible via UI (see `SELECTED-CASES.md` for the case-by-case reasoning).

## Step 1-3 — Page Objects, data schema, assertion strategy

- Output: `pages/HomePage.ts`, `pages/CartPage.ts`, `pages/CheckoutPage.ts`, `fixtures/checkout-fixtures.ts`, 4 JSON data files.
- `CheckoutPage.getPersistedOrderTotal()` is a verification-only API read (GET /api/orders/my-orders), used because the checkout POST response and the success screen both carry no order detail to assert on from the DOM.

## Step 4 — Script generation

- Output: `checkout-total-tampering.spec.ts` (11 rows), `checkout-empty-cart.spec.ts` (2 rows), `checkout-guest-access.spec.ts` (1 row), `checkout-coupon.spec.ts` (1 row).
- Negative-case assertions target the spec-correct expected outcome (true cart total, or rejection for an empty cart), same policy as FR-04, so a failing assertion is the bug-detection signal.

## Step 5 — Execution & review (2 real script defects found and fixed)

1. **Cart-wiping hard navigation.** First run: TC-01 (the *honest*-value, no-defect case) failed with an empty product list — a strong signal since TC-01 has no known product bug to hide behind. Root cause: `CheckoutPage.goto()` used `page.goto('/checkout')`, a hard reload, which wiped `CartContext`'s in-memory (unpersisted) cart that had just been built via Home page clicks. Fixed by adding `CartPage`, which navigates via the app's own `<Link>`/button clicks (React Router client-side navigation, state-preserving) instead of a URL-based `goto()` for any case that needs a pre-built cart.
2. **Coupon usage-cap cross-browser test isolation.** Second run: TC-18 passed on Chromium, failed on Firefox and WebKit with `coupon.finalAmount` undefined. Root cause: the seeded `SAVE10` coupon allows only 1 use per user (`max_uses_per_user: 1`), and all 3 browser projects share one live DB within a single suite invocation (the server only reseeds on restart) — Chromium's run consumed the account's only use. This is a test-repeatability defect in the fixture data, not a product bug. Fixed by raising the seeded `max_uses_per_user` to 100 in `database.js`.

Final result (all 3 browsers, after both fixes): 9 passed / 36 failed, fully consistent across browsers. All 36 failures verified as known, pre-existing HW02 defects (BUG-B-08, BUG-B-10) — zero script defects remaining.

## Gap noted for the report

TC-02/03 (auth-state) and TC-19/20 (shipping_address tampering, forged user_id) could not be included in this UI-only batch for structural reasons documented in `SELECTED-CASES.md` — a deliberate, documented scope decision, not an oversight.
