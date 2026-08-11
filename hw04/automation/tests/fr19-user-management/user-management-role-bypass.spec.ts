import { test, expect, loginAs, setUserRole, seedAdminSession, TEST_USER } from '../../fixtures/admin-fixtures';
import data from '../../data/fr19-role-bypass.json';

/**
 * FR-19 User Management - role-bypass via localStorage token injection.
 * TC-15 and TC-05 are HW02's own pre-existing UI cases; the remaining rows
 * are a data-driven expansion across further non-admin role values,
 * sampling the same "any non-admin role" equivalence class the source
 * report already established this technique for (A11).
 *
 * Setup uses FR-04's own confirmed role-escalation bug (PUT /api/users/me)
 * purely as plumbing to obtain a token carrying an arbitrary role string -
 * that bug is not what's under test here, FR-04's own suite already covers
 * and fails it directly.
 *
 * Assertion pattern: DOM/UI-state. All rows are expected to FAIL against
 * the current SUT - HW02 confirmed neither admin endpoint checks role at
 * all (BUG-C-08). A failure here is the intended signal, not a broken
 * script. Safe to repeat across all 3 browsers: setting a role is an
 * idempotent overwrite, not a row deletion.
 */
for (const row of data) {
  test(`${row.id} - ${row.description}`, async ({ page }) => {
    let token = await loginAs(page, TEST_USER.email, TEST_USER.password);
    await setUserRole(page, token, row.role);
    token = await loginAs(page, TEST_USER.email, TEST_USER.password); // re-login: JWT bakes in role at sign time

    await seedAdminSession(page, token);
    await page.goto('/');

    await expect(
      page.getByTestId('admin-login-email-input'),
      `Per spec, a non-admin session (role="${row.role}") must be refused, not shown the dashboard`,
    ).toBeVisible();
  });
}
