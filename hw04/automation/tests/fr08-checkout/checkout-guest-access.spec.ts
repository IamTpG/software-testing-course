import { test, expect } from '@playwright/test';
import data from '../../data/fr08-guest-access.json';

/**
 * FR-08 Checkout — guest page-view access (TC-04).
 * Assertion pattern: DOM/UI-state (visibility). Uses the base Playwright
 * test (no login fixture) since this case is specifically about
 * unauthenticated access. The spec only gates the checkout *action*
 * ("chi nguoi dung da dang nhap moi tien hanh thanh toan duoc"), not page
 * visibility, so the form being visible while logged out is NOT a defect
 * (HW02 originally over-flagged this, then corrected it after re-reading
 * the literal spec).
 */
for (const row of data) {
  test(`${row.id} - ${row.description}`, async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByTestId('checkout-form')).toBeVisible();
  });
}
