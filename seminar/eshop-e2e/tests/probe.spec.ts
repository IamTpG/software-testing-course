import { test, expect } from '@playwright/test';

test('probe: DOM thật của trang login', async ({ page }) => {
  await page.goto('/login');
  console.log('H1 count   :', await page.getByRole('heading', { level: 1 }).count());
  console.log('H2 texts   :', await page.getByRole('heading', { level: 2 }).allTextContents());
  console.log('textboxes  :', await page.getByRole('textbox').count());
  console.log('getByLabel(Username) count:', await page.getByLabel('Username').count());
  console.log('buttons    :', await page.getByRole('button').allTextContents());
  console.log('inputs html:', await page.locator('form input').evaluateAll(
    els => els.map(e => (e as HTMLInputElement).outerHTML)));
});

test('probe: DOM thật của trang chủ', async ({ page }) => {
  await page.goto('/');
  console.log('H1 count home:', await page.getByRole('heading', { level: 1 }).count());
  console.log('H1 texts home:', await page.getByRole('heading', { level: 1 }).allTextContents());
  console.log('nav links    :', await page.getByRole('link').allTextContents());
  console.log('add buttons  :', await page.getByRole('button', { name: 'Thêm vào giỏ' }).count());
});
