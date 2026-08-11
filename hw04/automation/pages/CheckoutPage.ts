import { Page, Locator } from '@playwright/test';

const BACKEND_URL = 'http://localhost:3000';

export interface CheckoutResult {
  status: number;
  orderId: number | null;
  message: string | null;
}

export interface CouponResult {
  finalAmount: number;
  discountAmount: number;
}

export class CheckoutPage {
  readonly form: Locator;
  readonly productList: Locator;
  readonly totalInput: Locator;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly submitButton: Locator;

  constructor(private page: Page) {
    this.form = page.getByTestId('checkout-form');
    this.productList = page.getByTestId('checkout-product-list');
    this.totalInput = page.getByTestId('checkout-total-input');
    this.couponInput = page.getByTestId('checkout-coupon-input');
    this.applyCouponButton = page.getByTestId('checkout-apply-coupon-button');
    this.submitButton = page.getByTestId('checkout-submit-button');
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async setTotal(value: number) {
    await this.totalInput.fill(String(value));
  }

  async applyCoupon(code: string): Promise<CouponResult> {
    const responsePromise = this.page.waitForResponse((res) => res.url().includes('/api/apply-coupon'));
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
    const response = await responsePromise;
    const body = await response.json();
    return { finalAmount: body.final_amount, discountAmount: body.discount_amount };
  }

  async submitAndGetResult(): Promise<CheckoutResult> {
    const responsePromise = this.page.waitForResponse(
      (res) => res.url().includes('/api/checkout') && res.request().method() === 'POST',
    );
    await this.submitButton.click();
    const response = await responsePromise;
    const status = response.status();
    let body: { orderId?: number; message?: string; error?: string } = {};
    try {
      body = await response.json();
    } catch {
      // non-JSON error body, leave body empty
    }
    return { status, orderId: body.orderId ?? null, message: body.message ?? body.error ?? null };
  }

  /** Verification-only API read (mirrors FR-04's network/response pattern):
   * the Checkout page itself shows no post-purchase order detail, so the
   * only way to confirm what was actually persisted is to ask the backend. */
  static async getPersistedOrderTotal(
    page: Page,
    token: string,
    orderId: number,
  ): Promise<number | null> {
    const res = await page.request.get(`${BACKEND_URL}/api/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const orders: Array<{ id: number; total_amount: number }> = await res.json();
    const order = orders.find((o) => o.id === orderId);
    return order ? order.total_amount : null;
  }
}
