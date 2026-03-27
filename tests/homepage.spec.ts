import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

// Step 6: Create the Page Object inside beforeEach so every test gets a fresh one
test.describe('Homepage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('homepage has correct title @smoke @regression', async () => {
    await homePage.assertTitle();
  });

  test('article cards have headline and image @regression', async () => {
    await homePage.assertArticleCardsExist();
    const count = await homePage.articleCards.count();
    console.log(`Found ${count} cards with headline and image`);
  });

  test('clicking first article card opens article page @regression @navigation', async ({ page }) => {
    const headline = await homePage.clickFirstArticleCard();
    console.log(`Clicking card with headline: ${headline}`);
    await expect(page.getByText(headline)).toBeVisible();
  });

  test('clicking sports nav link opens sports page @regression @navigation', async ({ page }) => {
    await homePage.clickNavLink('Sports');
    await expect(page).toHaveURL(/sport/);
  });

  test('first article card has a valid link @regression', async () => {
    await expect(homePage.articleCards.first()).toHaveAttribute('href', /article/);
  });

  test('navigation bar has enough links @regression @navigation', async () => {
    const count = await homePage.navLinks.count();
    expect(count).toBeGreaterThan(5);
    console.log(`Found ${count} nav links`);
  });
});
