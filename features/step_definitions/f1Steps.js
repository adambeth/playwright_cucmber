const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const F1ResultsPage = require("../../tests/pageObjects/F1ResultsPage");

Given("I am on the {string} Formula 1 results page", async function (year) {
  console.log(year);
  this.f1Page = new F1ResultsPage(this.page);
  await this.f1Page.goto(year);
});

When("I view the {string} race results", async function (raceName) {
  await this.f1Page.selectRace(raceName);
});

Then("I should see the following race results:", async function (dataTable) {
  console.log(dataTable);
  const expectedResults = dataTable.hashes();
  // Get the actual race results
  const actualResults = await this.f1Page.getRaceResults();
  // Verify we have results
  expect(actualResults.length).toBeGreaterThan(0);
  // Only verify as many results as we have in the expected data
  for (
    let i = 0;
    // index out of bounds save guards
    i < Math.min(expectedResults.length, actualResults.length);
    i++
  ) {
    expect.soft(actualResults[i].position).toBe(expectedResults[i].Position);
    expect
      .soft(actualResults[i].driverName)
      .toBe(expectedResults[i]["Driver Name"]);
    expect.soft(actualResults[i].team).toBe(expectedResults[i].Team);
  }
});
