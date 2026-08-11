import { test, expect } from '@playwright/test';

test('SUT homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'EShop' })).toBeVisible();
});
