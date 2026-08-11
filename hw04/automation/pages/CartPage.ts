import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  /** Must click the header "Gio hang" Link (React Router client-side nav),
   * not page.goto('/cart') - a hard navigation would reload the SPA and
   * wipe CartContext's in-memory (unpersisted) cart state. */
  async goto() {
    await this.page.getByRole('link', { name: 'Giỏ hàng' }).click();
    await this.page.waitForURL('/cart');
  }

  /** Cart.jsx's checkout click guards on AuthContext's `user`, which only
   * populates after an async GET /api/users/me resolves post-mount. Waiting
   * for the header's logged-in greeting avoids a false "not logged in"
   * redirect if this runs before that fetch completes. */
  async proceedToCheckout() {
    await expect(this.page.getByText(/Chào,/)).toBeVisible();
    await this.page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
    await this.page.waitForURL('/checkout');
  }
}
