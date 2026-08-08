import { Page, Locator, expect } from '@playwright/test';

export interface ProfileFormData {
  name?: string;
  phone?: string;
  address?: string;
}

export class ProfilePage {
  readonly nameInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly submitButton: Locator;

  constructor(private page: Page) {
    this.nameInput = page.getByTestId('profile-name-input');
    this.phoneInput = page.getByTestId('profile-phone-input');
    this.addressInput = page.getByTestId('profile-address-input');
    this.submitButton = page.getByTestId('profile-submit-button');
  }

  /**
   * Profile.jsx's fields start empty and only populate after an async
   * GET /api/users/me resolves (fired from AuthContext on mount). Waiting
   * for that response before returning avoids a race where a caller reads
   * a field's value before the fetched data has rendered into the DOM.
   */
  async goto() {
    const profileFetched = this.page.waitForResponse(
      (res) => res.url().includes('/api/users/me') && res.request().method() === 'GET',
    );
    await this.page.goto('/profile');
    await profileFetched;
    await expect(this.nameInput).not.toHaveValue('');
  }

  async fillForm(data: ProfileFormData) {
    if (data.name !== undefined) await this.nameInput.fill(data.name);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.address !== undefined) await this.addressInput.fill(data.address);
  }

  /**
   * Profile.jsx uses window.alert() for BOTH the client-side phone-validation
   * error and the success message. The dialog listener must be registered
   * before the click, or Playwright auto-dismisses the alert and the text is
   * lost.
   */
  async submitAndGetAlert(): Promise<string> {
    const dialogPromise = new Promise<string>((resolve) => {
      this.page.once('dialog', async (dialog) => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });
    await this.submitButton.click();
    return dialogPromise;
  }

  /** Captures the PUT /api/users/me response, and also consumes the success
   * alert that fires right after (see submitAndGetAlert doc) so it doesn't
   * block the next action. */
  async submitAndGetResponse(): Promise<{ status: number; body: unknown }> {
    const alertPromise = new Promise<void>((resolve) => {
      this.page.once('dialog', async (dialog) => {
        await dialog.accept();
        resolve();
      });
    });
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (res) => res.url().includes('/api/users/me') && res.request().method() === 'PUT',
      ),
      this.submitButton.click(),
    ]);
    await alertPromise;
    const body = await response.json().catch(() => null);
    return { status: response.status(), body };
  }

  async reload() {
    await this.page.reload();
  }
}
