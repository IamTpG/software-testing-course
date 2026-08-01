import { test, expect } from '../fixtures/test-fixtures';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';

/**
 * FLOW 2 - FR-07: Giỏ hàng (Add-to-Cart).
 *
 * Nguyên tắc: locator bám DOM thật, assertion bám ĐẶC TẢ.
 * Test FAIL ở đây = SUT vi phạm đặc tả, không phải test viết sai.
 */
const PRODUCT = 'iPhone 15 Pro Max';

test.describe('FR-07 Giỏ hàng', () => {
  test('TC-C1: thêm từ trang chủ thì sản phẩm nằm trong giỏ', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.addToCartButton(PRODUCT).click();
    await cart.openFromNavbar();

    // Oracle: đúng 1 dòng, đúng tên sản phẩm, số lượng 1.
    await expect(cart.row(PRODUCT)).toHaveCount(1);
    await expect(cart.quantityCell(PRODUCT)).toHaveText('1');
  });

  test('TC-C2 [FR-06]: một cú click "Thêm vào giỏ hàng" ở trang chi tiết phải thêm được hàng', async ({
    page,
  }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.openProductDetail(PRODUCT);

    // FR-06: "Nút Thêm vào giỏ hàng - sau khi bấm hiển thị phản hồi trực quan".
    // MỘT cú click phải có tác dụng. Không được click 2 lần chỉ để cho test xanh.
    await page.getByRole('button', { name: 'Thêm vào giỏ hàng' }).click();

    await cart.openFromNavbar();
    await expect(cart.row(PRODUCT), 'sản phẩm phải có trong giỏ sau 1 click').toHaveCount(1);
  });

  test('TC-C3 [FR-07]: thêm cùng sản phẩm 2 lần thì tăng số lượng, KHÔNG tạo dòng mới', async ({
    page,
  }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.addToCartButton(PRODUCT).click();
    await home.addToCartButton(PRODUCT).click();
    await cart.openFromNavbar();

    // FR-07: "Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới."
    await expect(cart.row(PRODUCT), 'phải gộp thành 1 dòng').toHaveCount(1);
    await expect(cart.quantityCell(PRODUCT), 'số lượng phải là 2').toHaveText('2');
  });

  test('TC-C4 [FR-23]: link "Giỏ hàng" trên navbar phải có badge số lượng', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.addToCartButton(PRODUCT).click();

    // FR-23: 'Link "Giỏ hàng" phải hiển thị badge số lượng sản phẩm trong giỏ.'
    const cartLink = page.getByRole('link', { name: /Giỏ hàng/ });
    await expect(cartLink, 'navbar phải hiện số lượng trong giỏ').toContainText('1');
  });

  test('TC-C5 [FR-07]: nhãn tổng tiền phải là "Tổng cộng"', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.addToCartButton(PRODUCT).click();
    await cart.openFromNavbar();

    // FR-07: 'Tổng tiền hiển thị nhãn chính xác: "Tổng cộng" (không phải "Tổng tạm tính").'
    await expect(page.getByText(/Tổng cộng/)).toBeVisible();
  });

  test('TC-C6 [FR-07/FR-24]: nút Xóa phải có dialog xác nhận', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.addToCartButton(PRODUCT).click();
    await cart.openFromNavbar();

    // FR-07: "Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện."
    let dialogShown = false;
    page.on('dialog', async (d) => {
      dialogShown = true;
      await d.dismiss();
    });

    await cart.row(PRODUCT).getByRole('button', { name: 'Xóa' }).click();

    expect(dialogShown, 'phải hiện dialog xác nhận trước khi xóa').toBe(true);
    // Vì ta đã DISMISS dialog, sản phẩm phải còn nguyên trong giỏ.
    await expect(cart.row(PRODUCT), 'huỷ xác nhận thì không được xóa').toHaveCount(1);
  });
});
