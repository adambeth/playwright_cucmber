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
  browser = await chromium.launch({ headless: false });
});

AfterAll(async function () {
  await browser.close();
});

// Skip browser initialization for API tests
// Before({ tags: "@schema-validation" }, async function () {
//   // Don't create a browser context or page for API tests
//   this.isApiTest = true;
// });

// Regular setup for UI tests
Before({ tags: "not @schema-validation" }, async function () {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

// Clean up for UI tests
After({ tags: "not @schema-validation" }, async function () {
  await this.page.close();
  await this.context.close();
});
