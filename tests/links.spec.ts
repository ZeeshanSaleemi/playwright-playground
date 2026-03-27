import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { FooterPage } from '../pages/FooterPage';

test.describe('Links', () => {
  let homePage: HomePage;
  let footerPage: FooterPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    footerPage = new FooterPage(page);
    await footerPage.goto();
  });

  test('all footer links are reachable @smoke @regression @navigation', async ({ request }) => {
    const hrefs = await footerPage.getFooterLinkHrefs();
    console.log(`Checking ${hrefs.length} footer links...`);

    const broken = await footerPage.checkForBrokenLinks(request);
    expect(broken, `Broken links:\n${broken.join('\n')}`).toHaveLength(0);
  });

  test('footer has links @regression @navigation', async () => {
    await footerPage.assertFooterHasLinks();
    const count = await footerPage.footerLinks.count();
    console.log(`Found ${count} footer links`);

    for (let i = 0; i < count; i++) {
      const href = await footerPage.footerLinks.nth(i).getAttribute('href');
      const text = (await footerPage.footerLinks.nth(i).innerText()).trim();
      console.log(`  [${i + 1}] ${text || '(no text)'} → ${href}`);
    }
  });

  test('all links on homepage have valid format @regression @navigation', async ({ page }) => {
    const links = page.locator('a[href^="/"]');
    const count = await links.count();

    const hrefs = new Set<string>();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href) hrefs.add(href);
    }

    console.log(`Checking ${hrefs.size} unique internal links...`);

    for (const href of hrefs) {
      expect(href, `Invalid link found: ${href}`).toMatch(/^\//);
    }

    console.log(`All ${hrefs.size} links have valid format`);
  });
});
