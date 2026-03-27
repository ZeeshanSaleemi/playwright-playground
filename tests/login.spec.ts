import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const TEST_USER = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'secret123',
};

test.describe('Log In', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Seed a test user and clear any existing session
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.evaluate((user) => {
      localStorage.setItem('dn_users', JSON.stringify([user]));
      localStorage.removeItem('dn_session');
    }, TEST_USER);
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('login page loads with all form fields', async () => {
    await loginPage.assertOnLoginPage();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('successful login shows success message and redirects to home', async ({ page }) => {
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    await loginPage.assertSuccessVisible('Login successful');
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });

  test('submitting empty form shows email required error', async () => {
    await loginPage.submit();
    await loginPage.assertErrorVisible('Email address is required');
  });

  test('missing password shows error', async () => {
    await loginPage.fillEmail(TEST_USER.email);
    await loginPage.submit();
    await loginPage.assertErrorVisible('Password is required');
  });

  test('unknown email shows error', async () => {
    await loginPage.login('nobody@example.com', 'password123');
    await loginPage.assertErrorVisible('No account found');
  });

  test('wrong password shows error', async () => {
    await loginPage.login(TEST_USER.email, 'wrongpassword');
    await loginPage.assertErrorVisible('Incorrect password');
  });

  test('successful login stores session in localStorage', async ({ page }) => {
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // Wait for redirect then verify session was stored
    await expect(page).toHaveURL('/', { timeout: 5000 });
    const session = await page.evaluate(() => localStorage.getItem('dn_session'));
    expect(session).not.toBeNull();

    const parsed = JSON.parse(session!);
    expect(parsed.email).toBe(TEST_USER.email);
    expect(parsed.name).toBe(TEST_USER.name);
  });

  test('signup link navigates to signup page', async ({ page }) => {
    await loginPage.signupLink.click();
    await expect(page).toHaveURL(/signup/);
  });
});
