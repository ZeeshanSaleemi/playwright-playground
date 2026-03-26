import { type Page, type Locator, expect } from '@playwright/test';
import { type APIRequestContext } from '@playwright/test';

export class FooterPage {
  readonly page: Page;
  readonly url = '/';
  readonly footerLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footerLinks = page.locator('footer a[href]');
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async getFooterLinkHrefs(): Promise<string[]> {
    const count = await this.footerLinks.count();
    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await this.footerLinks.nth(i).getAttribute('href');
      if (href) hrefs.push(href);
    }
    return hrefs;
  }

  async checkForBrokenLinks(request: APIRequestContext): Promise<string[]> {
    const hrefs = await this.getFooterLinkHrefs();
    const broken: string[] = [];

    for (const href of hrefs) {
      try {
        let response = await request.head(href, { timeout: 10000 });
        let status = response.status();

        if (status === 405) {
          response = await request.get(href, { timeout: 10000 });
          status = response.status();
        }

        if (status >= 400) {
          broken.push(`${href} → ${status}`);
          console.log(`  FAIL [${status}] ${href}`);
        } else {
          console.log(`  OK [${status}] ${href}`);
        }
      } catch {
        broken.push(`${href} → ERROR`);
        console.log(`  ERROR ${href}`);
      }
    }

    return broken;
  }

  async assertFooterHasLinks() {
    await expect(this.footerLinks.first()).toBeVisible();
  }
}
