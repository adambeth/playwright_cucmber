// @ts-check
const { test, expect } = require("@playwright/test");
const HomePage = require("./pageObjects/HomePage");

test("has title", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  // Use the page object methods
  const title = await homePage.getTitle();
});
