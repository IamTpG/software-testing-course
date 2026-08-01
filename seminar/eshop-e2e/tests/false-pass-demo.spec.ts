import { test, expect } from '../fixtures/test-fixtures';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';

/**
 * BẰNG CHỨNG cho Failure Mode #1 của User_Guide: assertion "vắng mặt" (toHaveCount(0),
 * not.toBeVisible) KHÔNG được auto-wait bảo vệ. Nó đúng ngay ở lần poll đầu tiên,
 * tại thời điểm SPA còn chưa kịp điều hướng sang /checkout.
 *
 * Hai test dưới đây kiểm tra CÙNG MỘT yêu cầu FR-08 ("tổng tiền không được sửa trực tiếp")
 * trên CÙNG MỘT SUT, nhưng cho ra KẾT QUẢ NGƯỢC NHAU. Chỉ khác đúng 1 dòng neo trạng thái.
 */
const PRODUCT = 'iPhone 15 Pro Max';

test.beforeEach(async ({ loginPage, freshUser, page }) => {
  await loginPage.goto();
  await loginPage.login(freshUser.email, freshUser.password);
  await expect(page.getByRole('button', { name: 'Thoát' })).toBeVisible();
});

async function goToCheckout(page: any) {
  const home = new HomePage(page);
  const cart = new CartPage(page);
  await home.goto();
  await home.addToCartButton(PRODUCT).click();
  await cart.openFromNavbar();
  await cart.checkoutButton.click();
}

test('SAI - false pass: assert vắng mặt ngay sau click (test XANH dù SUT có lỗi)', async ({
  page,
}) => {
  await goToCheckout(page);

  // Không neo gì cả. Lần poll đầu tiên chạy khi React chưa render xong /checkout
  // -> đếm được 0 input number -> assertion thoả mãn NGAY -> test xanh.
  await expect(page.locator('input[type="number"]')).toHaveCount(0);
});

test('ĐÚNG - neo trạng thái trước khi assert vắng mặt (test ĐỎ, bắt đúng lỗi)', async ({
  page,
}) => {
  await goToCheckout(page);

  // Neo: chờ trang /checkout thực sự render xong (nút xác nhận đã hiện).
  await expect(page.getByRole('button', { name: 'Xác Nhận Thanh Toán' })).toBeVisible();

  // Bây giờ mới hỏi "có input sửa tổng tiền không?" -> lộ ra defect FR-08.
  await expect(
    page.locator('input[type="number"]'),
    'FR-08: tổng tiền phải do hệ thống tính, không cho sửa',
  ).toHaveCount(0);
});
