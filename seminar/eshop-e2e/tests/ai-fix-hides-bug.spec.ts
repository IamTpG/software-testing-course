import { test, expect } from '../fixtures/test-fixtures';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';

/**
 * BẰNG CHỨNG cho Failure Mode #2 của User_Guide:
 * "AI sửa TEST cho xanh, thay vì báo BUG."
 *
 * Bối cảnh: TC-C2 (một click ở trang chi tiết) đang ĐỎ. Ta đưa nguyên log lỗi cho AI
 * và hỏi "vì sao test fail, sửa giúp". AI trả lời rất thuyết phục rằng đây là vấn đề
 * timing/hydration của React và đề xuất... click thêm một lần nữa (hoặc thêm waitForTimeout
 * rồi click lại).
 *
 * Test dưới đây LÀ bản sửa đó. Nó XANH. Và chính vì nó xanh, defect thật
 * (ProductDetail.jsx nuốt cú click đầu tiên bằng biến clickCount) BIẾN MẤT khỏi báo cáo.
 * Suite 100% xanh, sản phẩm vẫn hỏng với người dùng thật.
 */
const PRODUCT = 'iPhone 15 Pro Max';

test('BẢN SỬA CỦA AI (xanh nhưng che mất defect FR-06)', async ({ page }) => {
  const home = new HomePage(page);
  const cart = new CartPage(page);

  await home.goto();
  await home.openProductDetail(PRODUCT);

  const addButton = page.getByRole('button', { name: 'Thêm vào giỏ hàng' });

  // "Fix" do AI đề xuất: click lần nữa cho chắc.
  await addButton.click();
  await addButton.click();

  await cart.openFromNavbar();
  await expect(cart.row(PRODUCT)).toHaveCount(1);

  // Test xanh. Nhưng người dùng thật bấm MỘT lần thì không có gì vào giỏ.
  // Đây là lý do user guide bắt buộc: mọi "fix" do AI đề xuất phải trả lời được câu hỏi
  // "cái này sửa TEST hay sửa SUT?" trước khi merge.
});
