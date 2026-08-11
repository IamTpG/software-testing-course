# FR-08 — Checkout: Selected Cases for Automation

Source: [`hw02/.../FR-08-Checkout/DomainTesting_BVA.md`](../../../hw02/23127244_HW02_AI_DomainTesting_100/reports/FR-08-Checkout/DomainTesting_BVA.md)

15 of the 20 HW02 test cases were selected, all driven purely through the real browser UI, none invented, none with their field-under-test value or expected result changed. Unlike FR-04, HW02's own report already confirms UI-channel execution is valid here: "Additionally manually verified end-to-end via the real UI ... editing the total in the actual Checkout page input and submitting produced an order persisted with the tampered value" (TC-01 note).

Cart state is pure in-memory React (`CartContext.jsx`, no persistence), so unlike FR-04's localStorage-token shortcut, every case rebuilds the fixture cart via real `Home.jsx` "Thêm vào giỏ" clicks. No SUT logic changed - `data-testid` hooks added to `Home.jsx` (product card, add-to-cart button) and `Checkout.jsx` (total input, coupon input/button, submit button, product list, form container), same non-functional pattern as FR-04.

| Script | Data file | Cases | Assertion pattern |
|---|---|---|---|
| `checkout-total-tampering.spec.ts` | `data/fr08-total-tampering.json` | TC-01, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14 (11) | Network/response: intercept the checkout POST for `orderId`, then a follow-up `GET /api/orders/my-orders` read confirms what was actually persisted (the Checkout page shows no post-purchase order detail, so there is nothing to read from the DOM) |
| `checkout-empty-cart.spec.ts` | `data/fr08-empty-cart.json` | TC-16, 17 (2) | Network/response (status code) |
| `checkout-guest-access.spec.ts` | `data/fr08-guest-access.json` | TC-04 (1) | DOM/UI-state (visibility) |
| `checkout-coupon.spec.ts` | `data/fr08-coupon.json` | TC-18 (1) | Network/response, dynamic expectation (asserts against the coupon endpoint's own returned value, not a hardcoded figure) |

## Notable deviation from HW02's original expected value (TC-18)

HW02's report originally assumed `SAVE10` (10% off) would produce `final_amount = 52,200,000`, then found by execution that the real result is `580,000,000` - the coupon's percent formula is inverted (`total * (1 - discount_value)` with `discount_value = 10`, not `0.10`). Re-reading `server.js`'s `/api/apply-coupon` handler confirms this arithmetic exactly: `discount_amount = Math.floor(58000000 * (1 - 10)) = -522000000`, `final_amount = 58000000 - (-522000000) = 580000000`. This bug is owned by FR-09 (coupon logic), explicitly out of scope for FR-08 per HW02's own scoping decision (assumption A6). TC-18's assertion is written to check only what FR-08 owns - that checkout persists exactly what the coupon endpoint returned - using the coupon response's own value dynamically rather than a hardcoded expected figure, so this case stays valid regardless of whether FR-09's math bug is ever fixed.

## Excluded - structurally impossible via UI (not attempted, not modified to fit)

- **TC-02/TC-03** (missing/invalid auth token) - Direct-API-channel cases in the original report; a UI equivalent would mean reinterpreting the assertion (observed page/alert state instead of the literal 401/403 response), which was already rejected for FR-04's analogous TC-34/35 to keep this batch strictly unmodified.
- **TC-15** (`total_amount` omitted entirely from the JSON body) - a real form always sends the field (the input always has a value); there is no user interaction that omits it.
- **TC-19** (`shipping_address` tampering) - `Checkout.jsx` has no shipping-address field at all and never sends `shipping_address` in its request body; the field is only reachable via a raw API payload.
- **TC-20** (forged `user_id` in the request body) - a real form cannot inject an arbitrary extra JSON field; only a raw API call can.

These remain candidates for a future API-channel batch if pursued later.
