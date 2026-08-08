import { test, expect } from '../../fixtures/test-fixtures';
import data from '../../data/fr04-invalid-fields.json';

/**
 * FR-04 Profile Management — invalid Name/Address classes (TC-06/07/09).
 * Assertion pattern: persisted-state assertion. Per spec these values should
 * be rejected (the whole request should fail), so the field-under-test
 * should read back UNCHANGED from its own pre-test baseline after a reload.
 * Baseline is captured fresh at the start of each test (not hardcoded) so
 * the assertion holds regardless of what earlier tests left in the account.
 *
 * These are expected to FAIL against the current SUT — HW02 confirmed the
 * backend enforces zero server-side validation on these fields (BUG-A-13).
 * A failure here is the intended signal, not a broken script.
 */
for (const row of data) {
  test(`${row.id} - ${row.description}`, async ({ profilePage }) => {
    test.info().annotations.push({ type: 'known-defect', description: row.bugRef });

    const fieldInput = row.field === 'name' ? profilePage.nameInput : profilePage.addressInput;
    const baseline = await fieldInput.inputValue();

    await profilePage.fillForm({
      name: row.field === 'name' ? row.invalidValue : row.fillerName,
      phone: row.fillerPhone,
      address: row.field === 'address' ? row.invalidValue : row.fillerAddress,
    });
    await profilePage.submitAndGetAlert();
    await profilePage.reload();

    await expect(
      fieldInput,
      `Per spec, an invalid ${row.field} must be rejected and the field left unchanged`,
    ).toHaveValue(baseline);
  });
}
