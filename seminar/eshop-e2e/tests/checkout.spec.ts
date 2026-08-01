import { test, expect } from '../fixtures/test-fixtures';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * FLOW 3 - FR-08/FR-09: Thanh toán + Mã giảm giá.
 *
 * Nguyên tắc: locator bám DOM thật, assertion bám ĐẶC TẢ.
 */
const PRODUCT = 'iPhone 15 Pro Max'; // 30.000.000 ₫ -> vượt ngưỡng mọi coupon mẫu

test.describe('FR-08 Thanh toán', () => {
  // Đăng nhập trước qua UI rồi mới mua hàng: FR-08 yêu cầu phải đăng nhập.
  test.beforeEach(async ({ loginPage, freshUser, page }) => {
    await loginPage.goto();
    await loginPage.login(freshUser.email, freshUser.password);
    await expect(page.getByRole('button', { name: 'Thoát' })).toBeVisible();
  });

  test('TC-K1: đặt hàng thành công thì hiện thông báo xác nhận', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await home.goto();
    await home.addToCartButton(PRODUCT).click();
    await cart.openFromNavbar();
    await cart.checkoutButton.click();

    await expect(checkout.confirmButton).toBeVisible();
    await checkout.confirmButton.click();

    await expect(checkout.successHeading).toBeVisible();
  });

  test('TC-K2 [FR-08]: sau khi thanh toán thành công, giỏ hàng phải được xóa', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await home.goto();
    await home.addToCartButton(PRODUCT).click();
    await cart.openFromNavbar();
    await cart.checkoutButton.click();
    await checkout.confirmButton.click();
    await expect(checkout.successHeading).toBeVisible();

    // FR-08: "Sau thanh toán thành công, giỏ hàng được xóa."
    await cart.openFromNavbar();
    await expect(cart.emptyMessage, 'giỏ phải trống sau khi đặt hàng').toBeVisible();
  });

  test('TC-K3 [FR-08]: người dùng KHÔNG được sửa trực tiếp tổng tiền', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await home.goto();
    await home.addToCartButton(PRODUCT).click();
    await cart.openFromNavbar();
    await cart.checkoutButton.click();

    // NEO TRẠNG THÁI TRƯỚC KHI ASSERT VẮNG MẶT.
    // toHaveCount(0) / not.toBeVisible() KHÔNG được auto-wait bảo vệ: chúng đúng ngay ở
    // lần poll đầu tiên, lúc SPA còn chưa render xong /checkout -> test xanh giả.
    await expect(checkout.confirmButton, 'phải đang ở trang /checkout').toBeVisible();

    // FR-08: "Tổng tiền thanh toán được tính tự động từ giỏ hàng và KHÔNG cho phép
    // người dùng chỉnh sửa trực tiếp."
    const editable = page.locator('input[type="number"]');
    await expect(editable, 'tổng tiền không được là input sửa được').toHaveCount(0);
  });

  test('TC-K4 [FR-08/SEC]: backend phải tự tính lại tổng tiền, không tin client', async ({
    page,
    api,
  }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.addToCartButton(PRODUCT).click();
    await cart.openFromNavbar();
    await cart.checkoutButton.click();

    // Kẻ tấn công sửa tổng tiền 30.000.000 -> 1.000 ngay trên UI rồi bấm xác nhận.
    const totalInput = page.locator('input[type="number"]');
    await totalInput.fill('1000');
    await page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click();
    await expect(page.getByRole('heading', { name: 'Thanh toán thành công!' })).toBeVisible();

    // FR-08: "Backend phải tự tính lại tổng tiền; không chấp nhận total_amount do client gửi."
    // Oracle nằm ở DỮ LIỆU, không nằm ở UI: đơn vừa tạo phải có tổng tiền = 30.000.000.
    const res = await api.get('/api/orders/my-orders', {
      headers: { Authorization: `Bearer ${await page.evaluate(() => localStorage.getItem('token'))}` },
    });
    expect(res.ok()).toBeTruthy();
    const orders = await res.json();
    const latest = orders[0];
    expect(Number(latest.total_amount), 'backend không được nhận tổng tiền do client gửi').toBe(
      30000000,
    );
  });
});

test.describe('FR-09 Mã giảm giá', () => {
  test.beforeEach(async ({ loginPage, freshUser, page }) => {
    await loginPage.goto();
    await loginPage.login(freshUser.email, freshUser.password);
    await expect(page.getByRole('button', { name: 'Thoát' })).toBeVisible();
  });

  test('TC-K5: mã EXPIRED (hết hạn 2020) phải bị từ chối', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await home.goto();
    await home.addToCartButton(PRODUCT).click();
    await cart.openFromNavbar();
    await cart.checkoutButton.click();

    await expect(checkout.confirmButton, 'phải đang ở trang /checkout').toBeVisible();
    await checkout.applyCoupon('EXPIRED');

    // C2: "Ngày hiện tại phải trước expired_at" -> mã hết hạn phải báo lỗi.
    // Chờ PHẢN HỒI THẬT của server trước, rồi mới khẳng định không có dòng giảm giá.
    // Nếu chỉ viết toHaveCount(0) ngay sau click thì test xanh cả khi request còn đang bay.
    await expect(page.getByText('Mã giảm giá đã hết hạn')).toBeVisible();
    await expect(page.getByText('✅')).toHaveCount(0);
  });
});
