const { expect } = require("@playwright/test");
const BasePage = require("./BasePage");

/**
 * Page Object class for the BBC Search functionality
 * Handles all search-related interactions and verifications
 */
class SearchPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    super(page);
    this.searchInput = page.getByRole("link", { name: "Search BBC" });
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.searchResults = page.locator('[data-testid="default-promo"]');
    this.paginationControls = page.locator(".pagination");
    this.searchPageInput = page.locator("#searchInput");

    // F1 Race Results specific locators
    this.raceAccordion = page.getByRole("button", {
      name: /Las Vegas Grand Prix/,
    });
    this.raceTable = page.locator('table[aria-label="Race result"]');
  }

  /**
   * Navigate to the search page and open the search interface
   * @returns {Promise<void>}
   */
  async navigateToSearchPage() {
    await this.navigate("/");
    await this.searchInput.click();
  }

  /**
   * Click on the search input to focus it
   * @returns {Promise<void>}
   */
  async clickSearchInput() {
    await this.searchInput.click();
  }

  /**
   * Enter a search term into the search input and press Enter
   * @param {string} searchTerm - The term to search for
   * @returns {Promise<void>}
   */
  async enterSearchTerm(searchTerm) {
    await this.searchPageInput.fill(searchTerm);
  }

  /**
   * Submit the search by pressing the enter key
   * @returns {Promise<void>}
   */
  async submitSearch() {
    await this.searchPageInput.press("Enter");
    await this.page.waitForTimeout(5000);
  }

  /**
   * Get the total count of search results
   * @returns {Promise<number>} The number of search results
   */
  async getSearchResultsCount() {
    return await this.searchResults.count();
  }

  /**
   * Get the text content of all search results
   * @returns {Promise<string[]>} Array of search result text contents
   */
  async getSearchResultsText() {
    return await this.searchResults.allTextContents();
  }

  /**
   * Get the content types for all search results
   * @returns {Promise<string[]>} Array of content types
   */
  async getContentTypes() {
    const results = await this.searchResults.all();
    const contentTypes = [];

    for (const result of results) {
      const type = await result.getAttribute("data-content-type"); // Update based on your implementation
      contentTypes.push(type);
    }

    return contentTypes;
  }

  /**
   * Check if pagination controls are visible
   * @returns {Promise<boolean>} Whether pagination is visible
   */
  async isPaginationVisible() {
    return await this.paginationControls.isVisible();
  }

  /**
   * Get detailed information for all search result promos
   * @returns {Promise<Array<{
   *   title: string,
   *   description: string,
   *   link: string,
   *   date: string,
   *   section: string,
   *   imageUrl: string
   * }>>} Array of promo details
   */
  async getSearchResultDetails() {
    const promos = await this.searchResults.all();
    const results = [];

    for (const promo of promos) {
      const result = {
        title:
          (await promo
            .locator(".ssrcss-1b1mki6-PromoHeadline")
            .textContent()) || "",
        description:
          (await promo.locator(".ssrcss-1q0x1qg-Paragraph").textContent()) ||
          "",
        link: (await promo.locator("a").getAttribute("href")) || "",
        date:
          (await promo
            .locator(".ssrcss-61mhsj-MetadataText")
            .first()
            .textContent()) || "",
        section:
          (await promo
            .locator('[data-testid^="service-identifiers"]')
            .textContent()) || "",
        imageUrl: (await promo.locator("img").getAttribute("src")) || "",
      };
      results.push(result);
    }

    return results;
  }

  /**
   * Get all article titles from search results
   * @returns {Promise<string[]>} Array of article titles
   */
  async getArticleTitles() {
    return await this.searchResults
      .locator(".ssrcss-1b1mki6-PromoHeadline")
      .allTextContents();
  }

  /**
   * Get all article descriptions from search results
   * @returns {Promise<string[]>} Array of article descriptions
   */
  async getArticleDescriptions() {
    return await this.searchResults
      .locator(".ssrcss-1q0x1qg-Paragraph")
      .allTextContents();
  }

  /**
   * Get all article dates from search results
   * @returns {Promise<string[]>} Array of article dates
   */
  async getArticleDates() {
    return await this.searchResults
      .locator(".ssrcss-61mhsj-MetadataText")
      .first()
      .allTextContents();
  }

  /**
   * Click on the race accordion to expand/collapse it
   * @param {string} raceName - Name of the race to click
   * @returns {Promise<void>}
   */
  async clickRaceAccordion(raceName) {
    const accordion = this.page.getByRole("button", {
      name: new RegExp(raceName, "i"),
    });
    await accordion.click();
    // Wait for the table to be visible
    await this.raceTable.waitFor({ state: "visible" });
  }

  /**
   * Get race results table data
   * @returns {Promise<Array<{
   *   position: string,
   *   driver: string,
   *   number: string,
   *   grid: string,
   *   pits: string,
   *   fastestLap: string,
   *   raceTime: string,
   *   points: string,
   *   team: string
   * }>>} Array of race result details
   */
  async getRaceResults() {
    const rows = await this.raceTable.locator("tbody tr").all();
    const results = [];

    for (const row of rows) {
      const result = {
        position: await row.locator("td").nth(0).textContent(),
        driver: await row.locator(".ssrcss-1hf3wfc-FullName").textContent(),
        team: await row.locator(".ssrcss-qo0qz1-TeamFullName").textContent(),
        number: await row.locator("td").nth(2).textContent(),
        grid: await row.locator("td").nth(3).textContent(),
        pits: await row.locator("td").nth(4).textContent(),
        fastestLap: await row.locator("td").nth(5).textContent(),
        raceTime: await row.locator("td").nth(6).textContent(),
        points: await row.locator("td").nth(7).textContent(),
      };

      // Clean up the text content (remove hidden text and trim)
      Object.keys(result).forEach((key) => {
        result[key] = result[key].trim().replace(/^.*hidden\s+/, "");
      });

      results.push(result);
    }

    return results;
  }

  /**
   * Get race date and time information
   * @returns {Promise<string>} The race date and time information
   */
  async getRaceDateTime() {
    const dateElement = this.page.locator(
      ".ssrcss-12ec24t-TableFooterDescription"
    );
    return await dateElement.textContent();
  }

  /**
   * Get specific driver's result
   * @param {string} driverName - Full name of the driver
   * @returns {Promise<Object|null>} Driver's result or null if not found
   */
  async getDriverResult(driverName) {
    const results = await this.getRaceResults();
    return (
      results.find(
        (result) => result.driver.toLowerCase() === driverName.toLowerCase()
      ) || null
    );
  }
}

module.exports = SearchPage;
