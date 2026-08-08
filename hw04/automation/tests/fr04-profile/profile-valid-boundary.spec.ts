import { test, expect } from '../../fixtures/test-fixtures';
import data from '../../data/fr04-valid-boundary.json';

/**
 * FR-04 Profile Management — valid boundary sweep (TC-01/02/03/04/37).
 * Assertion pattern: network/response assertion (PUT status) combined with
 * a reload-and-verify, since PUT /api/users/me only ever returns
 * {"message": "Profile updated"} with no echoed fields — status alone
 * cannot confirm the values actually persisted.
 */
for (const row of data) {
  test(`${row.id} - ${row.description}`, async ({ profilePage }) => {
    await profilePage.fillForm({ name: row.name, phone: row.phone, address: row.address });

    const { status, body } = await profilePage.submitAndGetResponse();
    expect(status).toBe(row.expectedStatus);
    expect(body).toMatchObject({ message: 'Profile updated' });

    await profilePage.reload();
    await expect(profilePage.nameInput).toHaveValue(row.name);
    await expect(profilePage.phoneInput).toHaveValue(row.phone);
    await expect(profilePage.addressInput).toHaveValue(row.address);
  });
}
