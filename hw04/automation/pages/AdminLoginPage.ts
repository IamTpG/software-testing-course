import { Page } from '@playwright/test';

export class AdminLoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(email: string, password: string) {
    await this.page.getByTestId('admin-login-email-input').fill(email);
    await this.page.getByTestId('admin-login-password-input').fill(password);
    await this.page.getByTestId('admin-login-submit-button').click();
  }
}
