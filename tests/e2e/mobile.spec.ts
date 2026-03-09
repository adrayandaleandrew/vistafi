import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 5'] });

test.describe('@mobile Mobile viewport tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Supabase auth to return no session
    await page.route('**/auth/v1/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { session: null }, error: null }),
      });
    });
  });

  test('Login page renders all key elements at mobile viewport', async ({ page }) => {
    await page.goto('http://localhost:4173');
    // Check for VistaFi heading or login elements
    await expect(page.getByRole('heading', { name: /vistafi/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('Login input fields are accessible at mobile viewport', async ({ page }) => {
    await page.goto('http://localhost:4173');
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('No horizontal scroll overflow on login page at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:4173');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1);
  });

  test('Signup page renders correctly at mobile viewport', async ({ page }) => {
    await page.goto('http://localhost:4173');
    // Navigate to signup if there's a link
    const signupLink = page.getByRole('link', { name: /sign up|create account/i });
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await expect(page.getByRole('heading', { name: /sign up|create account/i })).toBeVisible();
    } else {
      // Just verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1);
    }
  });
});
