import { test as base, expect, Page } from '@playwright/test';

const BACKEND_URL = 'http://localhost:3000';
export const ADMIN_USER = { email: 'admin@eshop.com', password: 'Admin123!' };
export const TEST_USER = { email: 'test@eshop.com', password: 'Test1234!' };

type Fixtures = {
  adminToken: string;
};

/** Real admin session, obtained via the shared login endpoint (fast setup,
 * same pattern as FR-04/FR-08's fixtures) - used for the destructive
 * self-delete/other-delete cases that must go through the real login form
 * indirectly via a seeded token, since re-typing credentials each time adds
 * nothing to what's under test. */
export const test = base.extend<Fixtures>({
  // The global config's baseURL points at frontend-web (:5173) for FR-04/08.
  // FR-19 targets the separate frontend-admin SPA on :5174, so every test
  // using this module's `test` gets the correct origin automatically.
  baseURL: async ({}, use) => {
    await use('http://localhost:5174');
  },

  adminToken: async ({ page }, use) => {
    const res = await page.request.post(`${BACKEND_URL}/api/login`, { data: ADMIN_USER });
    const { token } = await res.json();
    await use(token);
  },
});

/** Logs in via the shared backend endpoint (not the admin panel's own
 * gated login form) and returns the resulting JWT. Used to obtain a
 * non-admin token for the role-bypass cases, mirroring exactly what
 * HW02's TC-15 did manually. */
export async function loginAs(page: Page, email: string, password: string): Promise<string> {
  const res = await page.request.post(`${BACKEND_URL}/api/login`, { data: { email, password } });
  const body = await res.json();
  return body.token;
}

/** Exploits FR-04's confirmed role-escalation bug (PUT /api/users/me
 * applies a client-supplied role with no check) purely as setup plumbing
 * to obtain an account carrying an arbitrary role string, so the admin
 * panel's role-bypass behavior can be exercised for that role. This is
 * not the thing under test here - FR-04 already covers and fails that
 * bug directly. */
export async function setUserRole(page: Page, token: string, role: string) {
  await page.request.put(`${BACKEND_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: 'Test User', phone: '912345678', shipping_address: '', role },
  });
}

/** Seeds the admin panel's own localStorage key (distinct from the main
 * site's "token") before navigating, bypassing its client-side
 * role !== "admin" login gate - the exact technique HW02's TC-15 used
 * manually through devtools. */
export async function seedAdminSession(page: Page, token: string) {
  await page.addInitScript((t) => {
    window.localStorage.setItem('adminToken', t);
  }, token);
}

export { expect };
