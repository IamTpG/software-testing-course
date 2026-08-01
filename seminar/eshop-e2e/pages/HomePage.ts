import { Page, Locator } from '@playwright/test';

/** Page Object cho trang chủ (/) - danh sách sản phẩm. */
export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Tìm kiếm...');
    this.searchButton = page.getByRole('button', { name: 'Tìm' });
    // Không có data-testid trong SUT -> neo vào nút "Thêm vào giỏ" của từng card.
    this.productCards = page.locator('div.border.rounded.shadow-sm');
  }

  async goto() {
    await this.page.goto('/');
  }

  /** Card sản phẩm theo tên hiển thị. */
  card(productName: string): Locator {
    return this.productCards.filter({ hasText: productName });
  }

  /** Nút "Thêm vào giỏ" ngay trên card ở trang chủ (1 click là ăn). */
  addToCartButton(productName: string): Locator {
    return this.card(productName).getByRole('button', { name: 'Thêm vào giỏ' });
  }

  async openProductDetail(productName: string) {
    await this.card(productName).getByRole('link', { name: 'Xem chi tiết' }).click();
  }
}
