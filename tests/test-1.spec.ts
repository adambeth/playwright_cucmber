import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.bbc.com/sport/formula1/2023/results');
  await page.getByRole('button', { name: 'Las Vegas Grand Prix, Las' }).click();
});
