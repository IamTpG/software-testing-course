import { test as base, expect, request, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * API_URL: backend EShop. Mặc định :3000 theo setup_guide.md của SUT.
 * Máy nào đang bận port 3000 thì chạy: API_URL=http://localhost:3001 npx playwright test
 * (và sửa URL tương ứng trong frontend-web).
 */
export const API_URL = process.env.API_URL ?? 'http://localhost:3000';

export type FreshUser = { name: string; email: string; password: string };

type Fixtures = {
  api: APIRequestContext;
  /** Một user MỚI TINH cho mỗi test -> test lockout không làm khóa tài khoản của test khác. */
  freshUser: FreshUser;
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const ctx = await request.newContext({ baseURL: API_URL });
    await use(ctx);
    await ctx.dispose();
  },

  freshUser: async ({ api }, use, testInfo) => {
    // Email duy nhất theo thời điểm + tên test -> tránh đụng dữ liệu giữa các lần chạy.
    const unique = `${Date.now()}-${testInfo.workerIndex}`;
    const user: FreshUser = {
      name: `E2E User ${unique}`,
      email: `e2e-${unique}@eshop.test`,
      password: 'Test1234!',
    };
    const res = await api.post('/api/register', { data: user });
    expect(res.ok(), 'không tạo được user test qua API').toBeTruthy();
    await use(user);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect };
