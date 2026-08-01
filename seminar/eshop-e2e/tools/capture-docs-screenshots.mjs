/**
 * Chụp ảnh minh hoạ cho User_Guide.md.
 * Chạy khi SUT đang bật:  node tools/capture-docs-screenshots.mjs
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const WEB = process.env.BASE_URL ?? 'http://localhost:5173';
const REPORT = process.env.REPORT_URL ?? 'http://localhost:9323';
const OUT = 'docs/screenshots';

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

// 1) Trang login của SUT: heading ghi "Đăng Ký", nhãn "Username",
//    mật khẩu hiện rõ vì type="text", nút "Sign In".
await page.goto(`${WEB}/login`);
const form = page.locator('form');
await form.getByRole('textbox').first().fill('test@eshop.com');
await form.getByRole('textbox').nth(1).fill('Test1234!');
await page.screenshot({ path: `${OUT}/01-sut-login-bugs.png` });
console.log('saved 01-sut-login-bugs.png');

// 2) Trang chủ: 2 thẻ <h1> -> nguồn cơn của strict mode violation.
await page.goto(WEB);
await page.screenshot({ path: `${OUT}/02-sut-home.png`, fullPage: true });
console.log('saved 02-sut-home.png');

// 3) HTML report của Playwright (cần chạy `npx playwright show-report` trước).
try {
  await page.goto(REPORT, { timeout: 5000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/03-html-report.png` });
  console.log('saved 03-html-report.png');
} catch {
  console.log('BỎ QUA report: chưa chạy `npx playwright show-report`');
}

await browser.close();
