import { type Page, type Locator, expect } from '@playwright/test';
import { AuthPage } from './AuthPage';

export class SignupPage extends AuthPage {
  readonly url = '/signup';

  // Signup-specific locators
  readonly nameInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly signupButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page); // initialises emailInput, passwordInput, errorMessage, successMessage

    this.nameInput = page.getByTestId('name-input');
    this.confirmPasswordInput = page.getByTestId('confirm-password-input');
    this.signupButton = page.getByTestId('signup-button');
    this.loginLink = page.getByTestId('login-link');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillConfirmPassword(password: string) {
    await this.confirmPasswordInput.fill(password);
  }

  async submit() {
    await this.signupButton.click();
  }

  async signUp(data: { name: string; email: string; password: string; confirmPassword?: string }) {
    await this.fillName(data.name);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillConfirmPassword(data.confirmPassword ?? data.password);
    await this.submit();
  }

  async assertOnSignupPage() {
    await expect(this.page).toHaveURL(/signup/);
    await expect(this.signupButton).toBeVisible();
  }
}
