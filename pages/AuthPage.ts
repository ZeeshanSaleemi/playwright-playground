import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Shared base for auth pages (Login, Signup).
 * Holds locators and methods that are common to both pages.
 */
export abstract class AuthPage {
  abstract readonly url: string;

  readonly page: Page;

  // Shared locators — same data-testid on both /login and /signup
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.errorMessage = page.getByTestId('error-message');
    this.successMessage = page.getByTestId('success-message');
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async assertErrorVisible(text?: string) {
    await expect(this.errorMessage).toBeVisible();
    if (text) await expect(this.errorMessage).toContainText(text);
  }

  async assertSuccessVisible(text?: string) {
    await expect(this.successMessage).toBeVisible();
    if (text) await expect(this.successMessage).toContainText(text);
  }
}
