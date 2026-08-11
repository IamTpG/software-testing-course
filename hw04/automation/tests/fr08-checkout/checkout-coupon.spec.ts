import { test, expect } from '../../fixtures/checkout-fixtures';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import data from '../../data/fr08-coupon.json';

/**
 * FR-08 Checkout — coupon-applied checkout (TC-18).
 * Assertion pattern: network/response, dynamic expectation. The coupon's
 * discount math is FR-09's scope (out of scope here, and independently
 * known to be buggy - SAVE10 inverts its own formula), so this asserts
 * only what FR-08 owns: checkout must persist exactly what
 * /api/apply-coupon returned as final_amount, not a hardcoded figure that
 * assumes the coupon math is correct.
 *
 * Expected to PASS - HW02 found no FR-08-owned defect on this path beyond
 * the already-covered total-trust bug (which this case doesn't isolate,
 * since the "tampered" value here is exactly what the app itself computed).
 */
for (const row of data) {
  test(`${row.id} - ${row.description}`, async ({ page, token, homePage }) => {
    await homePage.addToCart('iPhone 15 Pro Max');
    await homePage.addToCart('Samsung Galaxy S24 Ultra');

    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    const checkoutPage = new CheckoutPage(page);

    const coupon = await checkoutPage.applyCoupon(row.couponCode);
    expect(typeof coupon.finalAmount).toBe('number');

    const result = await checkoutPage.submitAndGetResult();
    expect(result.status).toBe(200);
    expect(result.orderId).not.toBeNull();

    const persistedTotal = await CheckoutPage.getPersistedOrderTotal(page, token, result.orderId as number);
    expect(
      persistedTotal,
      'Checkout should persist exactly what the coupon endpoint computed as final_amount',
    ).toBe(coupon.finalAmount);
  });
}
