import { test, expect } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';

test.describe('Sign Up', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    // Clear any stored users so tests are isolated
    await page.goto('/signup', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.removeItem('dn_users'));
    signupPage = new SignupPage(page);
    await signupPage.goto();
  });

  test('signup page loads with all form fields @regression @auth', async () => {
    await signupPage.assertOnSignupPage();
    await expect(signupPage.nameInput).toBeVisible();
    await expect(signupPage.emailInput).toBeVisible();
    await expect(signupPage.passwordInput).toBeVisible();
    await expect(signupPage.confirmPasswordInput).toBeVisible();
    await expect(signupPage.signupButton).toBeVisible();
  });

  test('successful signup shows success message and redirects to login @smoke @regression @auth @navigation', async ({ page }) => {
    await signupPage.signUp({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret123',
    });

    await signupPage.assertSuccessVisible('Account created successfully');
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });

  test('submitting empty form shows name required error @regression @auth', async () => {
    await signupPage.submit();
    await signupPage.assertErrorVisible('Full name is required');
  });

  test('missing email shows error @regression @auth', async () => {
    await signupPage.fillName('Jane Doe');
    await signupPage.submit();
    await signupPage.assertErrorVisible('Email address is required');
  });

  test('invalid email format shows error @regression @auth', async () => {
    await signupPage.fillName('Jane Doe');
    await signupPage.fillEmail('not-an-email');
    await signupPage.submit();
    await signupPage.assertErrorVisible('valid email');
  });

  test('missing password shows error @regression @auth', async () => {
    await signupPage.fillName('Jane Doe');
    await signupPage.fillEmail('jane@example.com');
    await signupPage.submit();
    await signupPage.assertErrorVisible('Password is required');
  });

  test('password shorter than 6 characters shows error @regression @auth', async () => {
    await signupPage.fillName('Jane Doe');
    await signupPage.fillEmail('jane@example.com');
    await signupPage.fillPassword('abc');
    await signupPage.submit();
    await signupPage.assertErrorVisible('at least 6 characters');
  });

  test('mismatched passwords show error @regression @auth', async () => {
    await signupPage.fillName('Jane Doe');
    await signupPage.fillEmail('jane@example.com');
    await signupPage.fillPassword('secret123');
    await signupPage.fillConfirmPassword('different');
    await signupPage.submit();
    await signupPage.assertErrorVisible('Passwords do not match');
  });

  test('duplicate email shows error @regression @auth', async ({ page }) => {
    // Pre-seed a user in localStorage
    await page.evaluate(() => {
      localStorage.setItem('dn_users', JSON.stringify([
        { name: 'Existing User', email: 'taken@example.com', password: 'password1' },
      ]));
    });

    await signupPage.signUp({
      name: 'New User',
      email: 'taken@example.com',
      password: 'newpassword',
    });

    await signupPage.assertErrorVisible('already exists');
  });

  test('login link navigates to login page @regression @auth @navigation', async ({ page }) => {
    await signupPage.loginLink.click();
    await expect(page).toHaveURL(/login/);
  });
});
