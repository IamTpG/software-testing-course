import { test, expect, seedAdminSession, TEST_USER } from '../../fixtures/admin-fixtures';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { AdminUsersPage } from '../../pages/AdminUsersPage';
import data from '../../data/fr19-readonly.json';

/**
 * FR-19 User Management - non-destructive, order-independent cases.
 * Assertion pattern: DOM/UI-state + dialog. Safe to repeat across all 3
 * browsers (no mutation of shared DB state).
 */
for (const row of data) {
  test(`${row.id} - ${row.description}`, async ({ page, adminToken }) => {
    if (row.id === 'TC-03') {
      await seedAdminSession(page, adminToken);
      await page.goto('/');
      const usersPage = new AdminUsersPage(page);
      await usersPage.goto();

      await expect(usersPage.tbody.locator('tr')).toHaveCount(2);
      const panelText = await usersPage.panel.innerText();
      expect(panelText.toLowerCase()).not.toContain('password');
    } else {
      // ADMIN-LOGIN-BLOCK: real login attempt through the gated form, not the bypass technique.
      const loginPage = new AdminLoginPage(page);
      await loginPage.goto();

      const dialogPromise = new Promise<string>((resolve) => {
        page.once('dialog', async (dialog) => {
          const message = dialog.message();
          await dialog.accept();
          resolve(message);
        });
      });
      await loginPage.login(TEST_USER.email, TEST_USER.password);
      const alertText = await dialogPromise;

      expect(alertText).toContain('không phải là admin');
    }
  });
}
