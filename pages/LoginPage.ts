import { type Page, type Locator, expect } from '@playwright/test';
import { AuthPage } from './AuthPage';

export class LoginPage extends AuthPage {
  readonly url = '/login';

  // Login-specific locators
  readonly loginButton: Locator;
  readonly signupLink: Locator;

  constructor(page: Page) {
    super(page); // initialises emailInput, passwordInput, errorMessage, successMessage

    this.loginButton = page.getByTestId('login-button');
    this.signupLink = page.getByTestId('signup-link');
  }

  async submit() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async assertOnLoginPage() {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.loginButton).toBeVisible();
  }

  async assertRedirectedToHome() {
    await expect(this.page).toHaveURL('/');
  }
}
