import { test, expect, seedAdminSession } from '../../fixtures/admin-fixtures';
import { AdminUsersPage } from '../../pages/AdminUsersPage';
import data from '../../data/fr19-destructive.json';

/**
 * FR-19 User Management - destructive delete cases (TC-06, TC-14).
 * These PERMANENTLY remove rows from the shared DB, and there is no reseed
 * mechanism available mid-run (the server only reseeds on restart) - unlike
 * every other case in this suite, they are NOT safely repeatable across
 * multiple browsers within one server lifetime. Restricted to Chromium only.
 * Declared last within this file, and this file is the last spec in
 * tests/fr19-user-management (alphabetically), so it runs after every other
 * FR-19 case (fullyParallel:false / workers:1 keeps this deterministic).
 *
 * Assertion pattern: DOM/UI-state (row count).
 *
 * Restricted to webkit specifically (not chromium): Playwright runs whole
 * projects in declaration order (all of chromium's tests, then all of
 * firefox's, then all of webkit's - confirmed empirically, not just
 * assumed). Scoping this to chromium - the first-declared project - meant
 * it deleted both seed accounts before Firefox/WebKit's passes had even
 * started, corrupting every later test that logs in as either account.
 * webkit is the last-declared project, so restricting the deletions to it
 * lets every other browser's non-destructive pass complete first.
 */
test.describe(() => {
  test.skip(
    ({ browserName }) => browserName !== 'webkit',
    'Destructive to shared DB state - see file header comment.',
  );

  for (const row of data) {
    test(`${row.id} - ${row.description}`, async ({ page, adminToken }) => {
      await seedAdminSession(page, adminToken);
      await page.goto('/');
      const usersPage = new AdminUsersPage(page);
      await usersPage.goto();

      const beforeCount = await usersPage.rowCount();
      await usersPage.deleteUser(row.targetId);

      if (row.id === 'TC-06') {
        // Correct behavior: admin deletes a different existing user - no defect expected.
        await expect(usersPage.tbody.locator('tr')).toHaveCount(beforeCount - 1);
      } else {
        // TC-14: per spec, an admin must not be able to delete their own
        // currently-logged-in account - the row count should stay unchanged.
        await expect(
          usersPage.tbody.locator('tr'),
          'Per spec, self-deletion of the currently-logged-in admin account must be rejected',
        ).toHaveCount(beforeCount);
      }
    });
  }
});
