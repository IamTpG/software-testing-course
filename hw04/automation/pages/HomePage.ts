import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  /** Cart is pure in-memory React state (no persistence), so the fixture
   * cart must be rebuilt via real UI clicks on every test rather than
   * seeded once. Scoped by product-card testid + name text so it doesn't
   * depend on knowing the product's DB id. */
  async addToCart(productName: string) {
    const card = this.page.locator('[data-testid^="product-card-"]').filter({ hasText: productName });
    await card.getByRole('button', { name: 'Thêm vào giỏ' }).click();
  }
}
