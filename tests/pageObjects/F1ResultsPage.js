const BasePage = require("./BasePage");

class F1ResultsPage extends BasePage {
  constructor(page) {
    super(page);

    this.selectors = {
      raceTitle: ".race-title",
      resultsTable: ".results-table",
      raceSelector: ".race-selector",
      positionColumn: ".position",
      driverNameColumn: ".driver-name",
      teamColumn: ".team",
    };
  }

  async goto(year = "2023") {
    await this.navigate(`/formula1/${year}/results`);
  }

  async selectRace(raceName) {
    console.log(raceName);
    // First find the button with the race name
    const raceButton = this.page.getByRole("button", {
      name: new RegExp(raceName, "i"),
    });

    // Click the button to expand the section if it's not already expanded
    await raceButton.click();

    // Find the entire section that contains this button (traversing up the DOM)
    const raceSection = raceButton.locator("xpath=./ancestor::section");

    // Wait for the section to be fully loaded
    await this.page.waitForTimeout(1000);

    // Return the section locator for further use
    return raceSection;
  }

  /**
   * Gets the section element for a specific race
   * @param {string} raceName - The name of the race to find
   * @returns {Promise<Locator>} - The section locator
   */
  async getRaceSection(raceName) {
    // Find the button with the race name
    const raceButton = this.page.getByRole("button", {
      name: new RegExp(raceName, "i"),
    });
    console.log(raceButton);
    // Find the entire section that contains this button
    const raceSection = raceButton.locator("xpath=./ancestor::section");
    console.log(raceSection);
    return raceSection;
  }

  async getRaceResults() {
    // Wait for the race results table to be visible
    await this.page.waitForSelector('table[aria-label="Race result"]');

    // Use the proper selector for the results table that matches the BBC F1 page
    const rows = await this.page
      .locator('table[aria-label="Race result"] tbody tr')
      .all();
    const results = [];

    for (const row of rows.slice(0, 3)) {
      // Get top 3 results using the proper selectors from the BBC F1 page
      const positionCell = row.locator("td").nth(0);
      const driverCell = row.locator("td").nth(1);
      const teamCell = driverCell.locator(".ssrcss-qo0qz1-TeamFullName");

      results.push({
        position: await positionCell
          .locator('span[aria-hidden="true"]')
          .textContent(),
        driverName: await driverCell
          .locator(".ssrcss-1hf3wfc-FullName")
          .textContent(),
        team: await teamCell.textContent(),
      });
    }

    return results;
  }

  async getRaceTitle() {
    return await this.getText(this.selectors.raceTitle);
  }

  /**
   * Gets race data from a specific race section
   * @param {Locator} raceSection - The section locator
   * @returns {Promise<Object>} - The race data including date, results table, etc.
   */
  async getRaceDataFromSection(raceSection) {
    // Make sure section is expanded
    const button = raceSection.locator("button").first();
    const isExpanded = await button.getAttribute("aria-expanded");

    if (isExpanded !== "true") {
      await button.click();
      await this.page.waitForTimeout(1000);
    }

    // Get race title
    const titleElement = raceSection
      .locator(".ssrcss-6m6lw7-AccordionHandleTitle")
      .first();
    const title = await titleElement.textContent();

    // Get race date
    const dateElement = raceSection
      .locator(".ssrcss-3h8um8-AdditionalText")
      .first();
    const date = await dateElement.textContent();

    // Get race results table
    const table = raceSection.locator('table[aria-label="Race result"]');
    const rows = await table.locator("tbody tr").all();

    const results = [];
    for (const row of rows) {
      const cells = await row.locator("td").all();
      if (cells.length >= 8) {
        results.push({
          position: await cells[0]
            .locator('span[aria-hidden="true"]')
            .textContent(),
          driver: {
            name: await cells[1]
              .locator(".ssrcss-1hf3wfc-FullName")
              .textContent(),
            abbreviation: await cells[1]
              .locator(".ssrcss-cjelrz-AbbreviatedName")
              .textContent(),
            team: await cells[1]
              .locator(".ssrcss-qo0qz1-TeamFullName")
              .textContent(),
          },
          number: await cells[2]
            .locator('span[aria-hidden="true"]')
            .textContent(),
          grid: await cells[3]
            .locator('span[aria-hidden="true"]')
            .textContent(),
          pits: await cells[4]
            .locator('span[aria-hidden="true"]')
            .textContent(),
          fastestLap: await cells[5]
            .locator('span[aria-hidden="true"]')
            .textContent(),
          raceTime: await cells[6]
            .locator('span[aria-hidden="true"]')
            .textContent(),
          points: await cells[7]
            .locator('span[aria-hidden="true"]')
            .textContent(),
        });
      }
    }

    // Get last updated time if available
    let lastUpdated = "";
    const footerElement = raceSection.locator(
      ".ssrcss-12ec24t-TableFooterDescription"
    );
    if ((await footerElement.count()) > 0) {
      lastUpdated = await footerElement.textContent();
    }

    return {
      title,
      date,
      results,
      lastUpdated,
    };
  }

  /**
   * Gets complete data for a specific race by name
   * @param {string} raceName - The name of the race to get data for
   * @returns {Promise<Object>} - Complete race data
   */
  async getCompleteRaceData(raceName) {
    const raceSection = await this.getRaceSection(raceName);
    return this.getRaceDataFromSection(raceSection);
  }

  /**
   * Gets the Las Vegas Grand Prix results
   * @returns {Promise<Array>} - Array of driver results
   */
  async getLasVegasGrandPrixResults() {
    // Directly target Las Vegas Grand Prix by its specific name
    await this.selectRace("Las Vegas Grand Prix");

    // Get the race results using the updated method
    return this.getRaceResults();
  }
}

module.exports = F1ResultsPage;
