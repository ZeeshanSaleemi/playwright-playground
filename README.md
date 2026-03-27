# Playwright Test Automation Playground

An end-to-end test automation project built with **Playwright** and **TypeScript**, using the **Page Object Model (POM)** pattern to keep tests clean, maintainable, and scalable.

---

## What This Project Does

This project automates UI and link-integrity tests against a locally served news website. It covers:

- Verifying page titles and article card rendering
- Navigation link behaviour
- Footer link reachability (HTTP status checks)
- Internal link format validation

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation & test runner |
| TypeScript | Typed test code |
| Node.js | Local web server (`serve.js`) |
| Page Object Model | Test architecture pattern |

---

## Project Structure

```
playwright-playground/
├── pages/
│   ├── HomePage.ts        # Page object for the homepage
│   └── FooterPage.ts      # Page object for footer interactions
├── tests/
│   ├── homepage.spec.ts   # Homepage UI tests
│   └── links.spec.ts      # Link validation tests
├── playwright.config.ts   # Playwright configuration
└── serve.js               # Local static server
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
npm install
```

**3. Install Playwright browsers**

```bash
npx playwright install
```

---

## Running the Tests

**Run all tests (headed mode)**

```bash
npx playwright test
```

**Run a specific test file**

```bash
npx playwright test tests/homepage.spec.ts
npx playwright test tests/links.spec.ts
```

**Run in headless mode**

```bash
npx playwright test --headed=false
```

**View the HTML test report**

```bash
npx playwright show-report
```

> The local web server starts automatically before tests run and shuts down after.

---

## Page Object Model

This project follows the **Page Object Model (POM)** pattern — each page of the application has a dedicated class that encapsulates its locators and interactions. Tests never define selectors directly; they call methods on page objects instead.

**Benefits:**
- Selectors are defined once and reused across all tests
- If the UI changes, you update one class — not every test
- Tests read like plain English, making them easier to maintain

```
tests/homepage.spec.ts  →  uses  →  pages/HomePage.ts
tests/links.spec.ts     →  uses  →  pages/FooterPage.ts
```

---

## Test Coverage

| Test File | What It Tests |
|---|---|
| `homepage.spec.ts` | Title, article cards, navigation, link format |
| `links.spec.ts` | Footer links reachable, internal link format |
