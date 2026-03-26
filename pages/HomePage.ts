import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  // Step 1: Store the page instance
  readonly page: Page;
  readonly url = '/';

  // Step 2: Declare your locators as class properties
  readonly articleCards: Locator;
  readonly navLinks: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 3: Define locators once here, not scattered across tests
    this.articleCards = page.locator('a:has(h3):has(.main-img)');
    this.navLinks = page.locator('nav a');
  }

  // Step 4: Define actions as methods

  /** Navigate to the homepage */
  async goto() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  /** Click a nav link by its label (e.g. 'Sports', 'Politics') */
  async clickNavLink(name: string) {
    await this.page.getByRole('link', { name, exact: true }).first().click();
  }

  /** Click the first article card and return its headline text */
  async clickFirstArticleCard(): Promise<string> {
    const firstCard = this.articleCards.first();
    const headline = await firstCard.locator('h3').innerText();
    await firstCard.click();
    return headline;
  }

  // Step 5: Define assertions as methods (optional but very clean)

  /** Assert the page title contains 'Daily News' */
  async assertTitle() {
    await expect(this.page).toHaveTitle(/Daily News/);
  }

  /** Assert there is at least one article card */
  async assertArticleCardsExist() {
    await expect(this.articleCards.first()).toBeVisible();
  }
}
