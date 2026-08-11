import { test, expect } from '../../fixtures/test-fixtures';
import data from '../../data/fr04-phone-bugs.json';

const SUCCESS_ALERT = 'Cập nhật thành công!';

/**
 * FR-04 Profile Management — phone regex vs. spec mismatch (TC-11/13/15/23).
 * Assertion pattern: dialog assertion. Profile.jsx uses window.alert() for
 * both the client-side validation error and the success message, so the
 * alert text itself tells us whether the submission was accepted.
 *
 * All 4 rows are expected to FAIL against the current SUT — HW02 confirmed
 * the frontend regex is the inverse of the spec (rejects valid numbers,
 * accepts an invalid prefix) (BUG-A-11/BUG-A-12). Failures here are the
 * intended signal, not broken scripts.
 */
for (const row of data) {
  test(`${row.id} - ${row.description}`, async ({ profilePage }) => {
    test.info().annotations.push({ type: 'known-defect', description: row.bugRef });

    await profilePage.fillForm({
      name: row.fillerName,
      phone: row.phone,
      address: row.fillerAddress,
    });
    const alertText = await profilePage.submitAndGetAlert();

    if (row.expectSuccessAlert) {
      expect(alertText, 'Per spec this phone value is valid and should save').toBe(SUCCESS_ALERT);
    } else {
      expect(
        alertText,
        'Per spec this phone value is invalid and must not silently succeed',
      ).not.toBe(SUCCESS_ALERT);
    }
  });
}
