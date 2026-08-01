import { Page, Locator } from '@playwright/test';

/** Page Object cho trang /checkout. */
export class CheckoutPage {
  readonly page: Page;
  readonly totalInput: Locator;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly confirmButton: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    // FR-08 nói tổng tiền KHÔNG được cho sửa. SUT lại render nó thành <input type="number">.
    this.totalInput = page.getByLabel('Tổng tiền thanh toán (VND):');
    this.couponInput = page.getByPlaceholder('Nhập mã giảm giá...');
    this.applyCouponButton = page.getByRole('button', { name: 'Áp dụng' });
    this.confirmButton = page.getByRole('button', { name: 'Xác Nhận Thanh Toán' });
    this.successHeading = page.getByRole('heading', { name: 'Thanh toán thành công!' });
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async applyCoupon(code: string) {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }
}
