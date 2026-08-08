import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

const BACKEND_URL = 'http://localhost:3000';
const TEST_USER = { email: 'test@eshop.com', password: 'Test1234!' };

type Fixtures = {
  token: string;
  homePage: HomePage;
};

/** Same API-speed login as FR-04's fixture (POST /api/login, seed
 * localStorage before navigating) so every case starts already
 * authenticated instead of retyping credentials through the UI. */
export const test = base.extend<Fixtures>({
  token: async ({ page }, use) => {
    const loginResponse = await page.request.post(`${BACKEND_URL}/api/login`, {
      data: TEST_USER,
    });
    const { token } = await loginResponse.json();

    await page.addInitScript((t) => {
      window.localStorage.setItem('token', t);
    }, token);

    await use(token);
  },

  homePage: async ({ page, token }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },
});

export { expect };
