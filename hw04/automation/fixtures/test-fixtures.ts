import { test as base, expect } from '@playwright/test';
import { ProfilePage } from '../pages/ProfilePage';

const BACKEND_URL = 'http://localhost:3000';
const TEST_USER = { email: 'test@eshop.com', password: 'Test1234!' };

type Fixtures = {
  profilePage: ProfilePage;
};

/**
 * Logs in via the API (fast, avoids retyping credentials through the UI for
 * every data row) then seeds localStorage before navigating, landing on
 * /profile already authenticated as the seeded standard user.
 */
export const test = base.extend<Fixtures>({
  profilePage: async ({ page }, use) => {
    const loginResponse = await page.request.post(`${BACKEND_URL}/api/login`, {
      data: TEST_USER,
    });
    const { token } = await loginResponse.json();

    await page.addInitScript((t) => {
      window.localStorage.setItem('token', t);
    }, token);

    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    await use(profilePage);
  },
});

export { expect };
