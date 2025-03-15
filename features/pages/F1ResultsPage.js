const { expect } = require("@playwright/test");
const BasePage = require("./BasePage");

class F1ResultsPage extends BasePage {
  constructor(page) {
    super(page);
    // Locators for F1 results page elements
    this.raceResults = page.locator(".race-results-table");
    this.raceSelector = page.locator(".race-selector");
    this.driverPositions = page.locator(".driver-position");
    this.driverNames = page.locator(".driver-name");
    this.raceTitle = page.locator(".race-title");
  }

  /**
   * Navigate to a specific year's F1 results page
   * @param {string} year - The year to view results for
   */
  async goto(year) {
    await this.navigate(`sports/formula1/${year}/results`);
  }

  /**
   * Select a specific Grand Prix from the results
   * @param {string} raceName - Name of the Grand Prix
   */
  async selectRace(raceName) {
    await this.page.getByText(raceName).click();
    await this.waitForNavigation();
  }

  /**
   * Get the race results
   * @returns {Promise<Array>} Array of driver results
   */
  async getRaceResults() {
    const results = [];
    const positions = await this.driverPositions.all();
    const names = await this.driverNames.all();

    for (let i = 0; i < positions.length; i++) {
      const position = await positions[i].textContent();
      const name = await names[i].textContent();
      results.push({ position, name });
    }

    return results;
  }

  /**
   * Get the current race title
   * @returns {Promise<string>} The race title
   */
  async getRaceTitle() {
    return await this.raceTitle.textContent();
  }

  /**
   * Verify if a driver finished in a specific position
   * @param {string} driverName - Name of the driver
   * @param {number} position - Expected position
   * @returns {Promise<boolean>} Whether the driver finished in that position
   */
  async verifyDriverPosition(driverName, position) {
    const results = await this.getRaceResults();
    return results.some(
      (result) =>
        result.name === driverName && parseInt(result.position) === position
    );
  }

  /**
   * Get the top N finishers
   * @param {number} n - Number of top positions to return
   * @returns {Promise<Array>} Array of top N finishers
   */
  async getTopFinishers(n) {
    const results = await this.getRaceResults();
    return results.slice(0, n);
  }
}

module.exports = F1ResultsPage;
