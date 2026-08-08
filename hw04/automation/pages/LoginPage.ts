import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByTestId('login-username-input').fill(email);
    await this.page.getByTestId('login-password-input').fill(password);
    await this.page.getByTestId('login-submit-button').click();
    await this.page.waitForURL('/');
  }
}
