/**
 * Base Page Object class that all specific page objects will extend
 * Provides common functionality for all pages
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || "https://www.bbc.com/sport";
  }

  /**
   * Navigate to a specific path
   * @param {string} path - The path to navigate to (appended to baseUrl)
   */
  async navigate(path = "") {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation() {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Get page title
   * @returns {Promise<string>} - The page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Check if element exists
   * @param {string} selector - The selector to check
   * @returns {Promise<boolean>} - Whether the element exists
   */
  async hasElement(selector) {
    return (await this.page.locator(selector).count()) > 0;
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - The selector to wait for
   * @param {Object} options - Optional timeout settings
   */
  async waitForElement(selector, options = {}) {
    await this.page.locator(selector).waitFor({ state: "visible", ...options });
  }

  /**
   * Click on an element
   * @param {string} selector - The selector to click
   */
  async click(selector) {
    await this.page.locator(selector).click();
  }

  /**
   * Fill a form field
   * @param {string} selector - The selector for the form field
   * @param {string} value - The value to fill
   */
  async fill(selector, value) {
    await this.page.locator(selector).fill(value);
  }

  /**
   * Get text from an element
   * @param {string} selector - The selector to get text from
   * @returns {Promise<string>} - The text content
   */
  async getText(selector) {
    return await this.page.locator(selector).textContent();
  }

  /**
   * Take a screenshot
   * @param {string} name - Name for the screenshot file
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}

module.exports = BasePage;
