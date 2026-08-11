import { test, expect } from '../../fixtures/checkout-fixtures';
import { CheckoutPage } from '../../pages/CheckoutPage';
import data from '../../data/fr08-empty-cart.json';

/**
 * FR-08 Checkout — empty-cart submission (TC-16/17).
 * Assertion pattern: network/response (status code). Deliberately does not
 * use the homePage fixture, so the cart stays empty; token is still needed
 * so the request reaches the cart-size check rather than failing auth.
 *
 * Expected to FAIL against the current SUT — HW02 confirmed the backend
 * never reads or validates the items array (BUG-B-10). A failure here is
 * the intended signal, not a broken script.
 */
for (const row of data) {
  test(`${row.id} - ${row.description}`, async ({ page, token }) => {
    void token; // triggers the login/token-seeding fixture; not read directly here
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await checkoutPage.setTotal(row.tamperedTotal);

    const result = await checkoutPage.submitAndGetResult();
    expect(
      result.status,
      'Per spec, checkout with zero items should be rejected, not create an order',
    ).not.toBe(200);
  });
}
