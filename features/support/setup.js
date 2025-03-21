// This setup.js file is used to configure the test environment for Cucumber.js tests.
// It manages the lifecycle of the Playwright browser for UI tests and sets up global hooks.
// - `BeforeAll` and `AfterAll` hooks are used to launch and close the browser.
// - `Before` and `After` hooks manage browser context and page for each UI test scenario.
// - The file also checks for `@api-test` tags to skip browser initialization for API-only tests.
// - Default timeout for steps is set to 30 seconds.

const {
  Before,
  After,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
} = require("@cucumber/cucumber");
const { chromium } = require("@playwright/test");

// Increase timeout to 30 seconds
setDefaultTimeout(30 * 1000);

let browser;

BeforeAll(async function () {
  // Check if we're running only API tests (to avoid launching browser unnecessarily)
  const isApiTestOnly = process.argv.some((arg) => arg.includes("@api-test"));

  if (!isApiTestOnly) {
    browser = await chromium.launch({ headless: true });
    console.log("Browser launched for UI tests");
  } else {
    console.log("Skipping browser launch for API-only tests");
  }
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
    console.log("Browser closed");
  }
});

// Skip browser initialization for API tests
Before({ tags: "not @api-test" }, async function () {
  if (browser) {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
    console.log("Browser context and page created for UI test");
  }
});

// Clean up for UI tests
After({ tags: "not @api-test" }, async function () {
  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
});
