import { Page, Locator, expect } from '@playwright/test';

export class AdminUsersPage {
  readonly panel: Locator;
  readonly tbody: Locator;

  constructor(private page: Page) {
    this.panel = page.getByTestId('admin-users-panel');
    this.tbody = page.getByTestId('admin-users-tbody');
  }

  async goto() {
    await this.page.getByTestId('admin-nav-users').click();
    await expect(this.panel).toBeVisible();
  }

  async rowCount(): Promise<number> {
    return this.tbody.locator('tr').count();
  }

  userRow(id: number): Locator {
    return this.page.getByTestId(`admin-user-row-${id}`);
  }

  /** deleteUser() in App.jsx awaits the DELETE, then fires an unawaited
   * fetchData() that re-GETs the user list to refresh the table. Waiting
   * only for the DELETE response (not this follow-up GET) let a prior
   * version of this test read the row count before the refetch landed,
   * silently passing on stale DOM instead of observing the real result. */
  async deleteUser(id: number) {
    const deleteResponse = this.page.waitForResponse(
      (res) => res.url().includes(`/api/admin/users/${id}`) && res.request().method() === 'DELETE',
    );
    const refetchResponse = this.page.waitForResponse(
      (res) => res.url().endsWith('/api/admin/users') && res.request().method() === 'GET',
    );
    await this.page.getByTestId(`admin-delete-user-${id}`).click();
    await deleteResponse;
    await refetchResponse;
  }
}
