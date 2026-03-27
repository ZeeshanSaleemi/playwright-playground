import { test, expect } from '@playwright/test';

test.describe('Sample Results', () => {

  test('passing test - homepage title is correct', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Daily News/);
  });

  test('failing test - wrong title assertion', async ({ page }) => {
    await page.goto('/');
    // Deliberately wrong — title is "Daily News", not "Breaking News"
    await expect(page).toHaveTitle(/Breaking News/);
  });

  test.skip('skipped test - not implemented yet', async ({ page }) => {
    // This test is skipped and will show as skipped in the report
    await page.goto('/profile');
    await expect(page.getByTestId('profile-heading')).toBeVisible();
  });

  test('flaky test - fails first attempt, passes on retry', async ({ page }) => {
    await page.goto('/');
    // Math.random() < 0.5 fails ~50% of the time, simulating a flaky test.
    // With retries: 2 in CI it will eventually pass.
    const shouldFail = Math.random() < 0.5;
    expect(shouldFail, 'Simulated flaky failure — will pass on retry').toBe(false);
  });

});
