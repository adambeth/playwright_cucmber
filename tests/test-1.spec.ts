import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://www.bbc.com/sport");
  await page.getByRole("link", { name: "Search BBC" }).click();

  await page.getByRole("combobox", { name: "Input your search term" }).click();
  await page
    .getByRole("combobox", { name: "Input your search term" })
    .fill("sport 2023");
  await page
    .getByRole("combobox", { name: "Input your search term" })
    .press("Enter");
});
