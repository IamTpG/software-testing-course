import { test, expect } from '../../fixtures/checkout-fixtures';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import data from '../../data/fr08-total-tampering.json';

const TRUE_CART_TOTAL = 58000000; // iPhone 15 Pro Max (30,000,000) + Samsung Galaxy S24 Ultra (28,000,000)

/**
 * FR-08 Checkout — total_amount tampering sweep (TC-01/05/06/07/08/09/10/11/12/13/14).
 * Assertion pattern: network/response. The Checkout page shows no
 * post-purchase order detail, so persistence is verified via a follow-up
 * GET /api/orders/my-orders read (mirrors FR-04's network/response pattern).
 *
 * All rows except TC-01 (honest value) are expected to FAIL against the
 * current SUT — HW02 confirmed the backend never recalculates total_amount
 * from the server-side cart (BUG-B-08). A failure here is the intended
 * signal, not a broken script.
 */
for (const row of data) {
  test(`${row.id} - ${row.description}`, async ({ page, token, homePage }) => {
    await homePage.addToCart('iPhone 15 Pro Max');
    await homePage.addToCart('Samsung Galaxy S24 Ultra');

    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    const checkoutPage = new CheckoutPage(page);

    if (row.id === 'TC-01') {
      await expect(checkoutPage.productList).toContainText('iPhone 15 Pro Max');
      await expect(checkoutPage.productList).toContainText('Samsung Galaxy S24 Ultra');
    }

    await checkoutPage.setTotal(row.tamperedTotal);
    const result = await checkoutPage.submitAndGetResult();
    expect(result.status).toBe(200);
    expect(result.orderId).not.toBeNull();

    const persistedTotal = await CheckoutPage.getPersistedOrderTotal(page, token, result.orderId as number);
    expect(
      persistedTotal,
      'Per spec, the backend must recalculate the total from the server-side cart, not trust the client value',
    ).toBe(TRUE_CART_TOTAL);
  });
}
