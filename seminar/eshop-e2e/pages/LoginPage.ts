import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object cho trang /login.
 *
 * CẢNH BÁO LOCATOR — đọc kèm Section 6 (Failure Modes) của User_Guide.
 * Các locator dưới đây bám theo DOM THẬT của SUT, KHÔNG bám theo đặc tả.
 * SUT đang vi phạm FR-02/FR-21/FR-22:
 *   - Tiêu đề trang ghi "Đăng Ký" (đáng lẽ "Đăng nhập"), và trang KHÔNG có thẻ <h1>
 *   - Nhãn ô email ghi "Username", input là type="text" (đáng lẽ "Email" + type="email")
 *   - Ô mật khẩu cũng là type="text" -> mật khẩu hiển thị rõ trên màn hình
 *   - Nút submit ghi "Sign In" (đáng lẽ tiếng Việt)
 *   - <label> KHÔNG gắn for/id và không bọc input => page.getByLabel('Username')
 *     trả về ĐÚNG 0 phần tử. Ta đã kiểm chứng bằng tests/probe.spec.ts.
 *   - Toàn bộ SUT không có bất kỳ data-testid nào.
 *
 * Vì cả 2 ô đều là type="text" và không có nhãn dùng được, ta buộc phải neo theo
 * VỊ TRÍ trong form. Đây là locator YẾU. Sự yếu đó là BẰNG CHỨNG của defect,
 * không phải một lựa chọn thiết kế tốt. Khi SUT được sửa (gắn for/id hoặc thêm
 * data-testid), chỉ cần đổi 2 dòng khai báo bên dưới, các spec không phải sửa.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    const form = page.locator('form');
    this.usernameInput = form.getByRole('textbox').first();
    this.passwordInput = form.getByRole('textbox').nth(1);
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.getByText('Đăng nhập thất bại');
  }

  async goto() {
    await this.page.goto('/login');
    await expect(this.submitButton).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.usernameInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
