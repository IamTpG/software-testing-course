import { Page, Locator } from '@playwright/test';

/** Page Object cho trang /cart. */
export class CartPage {
  readonly page: Page;
  readonly rows: Locator;
  readonly totalLabel: Locator;
  readonly checkoutButton: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator('tbody tr');
    // SUT đang ghi "Tổng tạm tính", FR-07 yêu cầu "Tổng cộng".
    this.totalLabel = page.getByText(/Tổng tạm tính|Tổng cộng/);
    this.checkoutButton = page.getByRole('button', { name: 'Tiến hành thanh toán' });
    this.emptyMessage = page.getByText('Giỏ hàng của bạn đang trống');
  }

  /**
   * BẪY: KHÔNG dùng page.goto('/cart') sau khi đã thêm hàng.
   * Giỏ hàng của SUT nằm trong React state (CartContext dùng useState, KHÔNG persist
   * xuống localStorage). Mọi hard navigation (goto/F5) đều RESET giỏ về rỗng.
   * => Sau khi thêm hàng, phải điều hướng bằng CLICK vào link trên navbar (SPA routing)
   *    thì state mới được giữ. Xem User_Guide.md mục 5 (Troubleshooting) lỗi #2.
   */
  async openFromNavbar() {
    await this.page.getByRole('link', { name: 'Giỏ hàng' }).click();
    await this.page.waitForURL('**/cart');
  }

  /** Chỉ dùng khi CHƯA có gì trong giỏ (ví dụ kiểm tra empty state). */
  async goto() {
    await this.page.goto('/cart');
  }

  /** Dòng giỏ hàng theo tên sản phẩm. */
  row(productName: string): Locator {
    return this.rows.filter({ hasText: productName });
  }

  /** Ô "Số lượng" (cột thứ 3) của một dòng. */
  quantityCell(productName: string): Locator {
    return this.row(productName).locator('td').nth(2);
  }
}
