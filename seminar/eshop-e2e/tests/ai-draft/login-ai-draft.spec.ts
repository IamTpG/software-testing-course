import { test, expect } from '@playwright/test';

/**
 * BẢN NHÁP DO AI SINH (giữ nguyên, KHÔNG sửa) - dùng làm tang chứng cho mục Failure Modes.
 *
 * Prompt đã dùng: "Viết test Playwright cho FR-02 của EShop: người dùng đăng nhập bằng
 * email test@eshop.com / Test1234!, sai mật khẩu 3 lần thì tài khoản bị khóa 30 giây."
 *
 * AI chỉ đọc ĐẶC TẢ, không đọc DOM. Nó giả định trang login là một trang login "bình thường".
 * Test này FAIL trên SUT thật. Xem User_Guide.md muc 6 (Failure Modes).
 */
test('AI draft: đăng nhập thành công', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('heading', { name: 'Đăng nhập' })).toBeVisible();

  await page.getByLabel('Email').fill('test@eshop.com');
  await page.getByLabel('Mật khẩu').fill('Test1234!');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL('/');
});

test('AI draft: khóa tài khoản sau 3 lần sai mật khẩu', async ({ page }) => {
  await page.goto('/login');

  for (let i = 0; i < 3; i++) {
    await page.getByLabel('Email').fill('test@eshop.com');
    await page.getByLabel('Mật khẩu').fill('SaiMatKhau!');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
  }

  await expect(page.getByText(/khóa/i)).toBeVisible();
});
