# Playwright Test Automation Playground

An end-to-end test automation project built with **Playwright** and **TypeScript**, using the **Page Object Model (POM)** pattern to keep tests clean, maintainable, and scalable.

---

## What This Project Does

This project automates UI, auth, and link-integrity tests against a locally served news website. It covers:

- Verifying page titles and article card rendering
- Navigation link behaviour
- Footer link reachability (HTTP status checks)
- Internal link format validation
- Login and signup flows (form validation, success/error states, session storage)

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation & test runner |
| TypeScript | Typed test code |
| Node.js | Local web server (`serve.js`) |
| Allure | Test reporting (`allure-playwright`) |
| Page Object Model | Test architecture pattern |
| GitHub Actions | CI/CD pipeline |

---

## Project Structure

```
playwright-playground/
├── .github/workflows/
│   └── playwright.yml          # CI pipeline (runs on PR to develop/main)
├── pages/
│   ├── AuthPage.ts             # Abstract base class for login/signup pages
│   ├── HomePage.ts             # Page object for the homepage
│   ├── LoginPage.ts            # Page object for login (extends AuthPage)
│   ├── SignupPage.ts           # Page object for signup (extends AuthPage)
│   └── FooterPage.ts           # Page object for footer interactions
├── tests/
│   ├── homepage.spec.ts        # Homepage UI tests
│   ├── links.spec.ts           # Footer & internal link validation tests
│   ├── login.spec.ts           # Login flow tests
│   └── signup.spec.ts          # Signup flow tests
├── demo-tests/
│   └── sample-results.spec.ts  # Demo tests (pass/fail/skip/flaky examples)
├── dummy-site/                 # Static news website served locally
├── playwright.config.ts        # Main Playwright configuration
├── playwright.demo.config.ts   # Demo configuration (targets demo-tests/)
└── serve.js                    # Local static file server (port 3000)
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm

---

## Getting Started

**1. Clone the repository**

```bash
git clone <your-repo-url>
cd playwright-playground
```

**2. Install dependencies**

```bash
npm ci
```

**3. Install Playwright browsers**

```bash
npx playwright install --with-deps chromium
```

---

## Running the Tests

> The local web server (`serve.js`) starts automatically before tests run and shuts down after — no manual server step needed.

**Run all tests**

```bash
npx playwright test
```

**Run a specific test file**

```bash
npx playwright test tests/homepage.spec.ts
npx playwright test tests/login.spec.ts
npx playwright test tests/signup.spec.ts
npx playwright test tests/links.spec.ts
```

**Run tests by tag**

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @auth
npx playwright test --grep @navigation
```

**Run demo tests**

```bash
npx playwright test --config=playwright.demo.config.ts
```

**View the HTML report**

```bash
npx playwright show-report
```

**View the Allure report**

```bash
npx allure generate allure-results --clean
npx allure open
```

---

## Page Object Model

This project follows the **Page Object Model (POM)** pattern — each page has a dedicated class that encapsulates its locators and interactions. Tests never define selectors directly; they call methods on page objects instead.

**Benefits:**
- Selectors are defined once and reused across all tests
- If the UI changes, you update one class — not every test
- Tests read like plain English, making them easier to maintain

**POM Hierarchy:**

```
AuthPage (abstract base)
├── LoginPage   ← used by tests/login.spec.ts
└── SignupPage  ← used by tests/signup.spec.ts

HomePage        ← used by tests/homepage.spec.ts
FooterPage      ← used by tests/links.spec.ts
```

---

## Test Coverage

| Test File | What It Tests |
|---|---|
| `homepage.spec.ts` | Title, article cards, navigation links, link format |
| `links.spec.ts` | Footer link reachability (HTTP), internal link format |
| `login.spec.ts` | Login form, success redirect, error states, session storage |
| `signup.spec.ts` | Signup form, success redirect, all validation error states |
| `sample-results.spec.ts` | Demo: passing, failing, skipped, and flaky test examples |

---

## Reporting

| Report | Location | How to Generate |
|---|---|---|
| HTML Report | `playwright-report/` | Auto-generated after `npx playwright test` |
| Allure Report | `allure-report/` | `npx allure generate allure-results --clean` |
| Demo Allure Report | `allure-report/` (from `allure-results-demo/`) | Run with demo config |

---

## CI/CD

Tests run automatically on every pull request targeting `develop` or `main` via GitHub Actions (`.github/workflows/playwright.yml`).

The pipeline:
1. Checks out code
2. Sets up Node.js 20
3. Installs dependencies via `npm ci`
4. Installs Chromium with system dependencies
5. Runs all Playwright tests
6. Uploads the HTML report as a downloadable artifact (retained for 30 days)
