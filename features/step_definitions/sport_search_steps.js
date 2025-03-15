const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const SearchPage = require("../pages/SearchPage");

let searchPage;

Given("I am on the search page", async function () {
  searchPage = new SearchPage(this.page);
  await searchPage.navigateToSearchPage();
});

When("I enter {string} in the search field", async function (searchTerm) {
  await searchPage.enterSearchTerm(searchTerm);
});

When("I submit the search", async function () {
  await searchPage.submitSearch();
});

Then("I should see at least {int} search results", async function (minResults) {
  const resultCount = await searchPage.getSearchResultsCount();
  expect(resultCount).toBeGreaterThanOrEqual(minResults);
});

Then("all results should be relevant to {string}", async function (searchTerm) {
  const resultsText = await searchPage.getSearchResultsText();
  const searchTerms = searchTerm.toLowerCase().split(" ");
  console.log("--------------------------------", searchTerms);
  for (const resultText of resultsText) {
    const lowerResultText = resultText.toLowerCase();
    const isRelevant = searchTerms.some((term) =>
      lowerResultText.includes(term)
    );
    expect(isRelevant).toBeTruthy();
  }
});

Then(
  "each result should contain either {string} or {string}",
  async function (term1, term2) {
    const resultsText = await searchPage.getSearchResultsText();

    for (const resultText of resultsText) {
      const lowerResultText = resultText.toLowerCase();
      const containsTerm1 = lowerResultText.includes(term1.toLowerCase());
      const containsTerm2 = lowerResultText.includes(term2.toLowerCase());
      expect(containsTerm1 || containsTerm2).toBeTruthy();
    }
  }
);

Then(
  "the results should include different types of content",
  async function (dataTable) {
    const expectedContentTypes = dataTable
      .raw()
      .slice(1)
      .map((row) => row[0].toLowerCase());
    const actualContentTypes = await searchPage.getContentTypes();

    for (const expectedType of expectedContentTypes) {
      const hasContentType = actualContentTypes.some(
        (type) => type.toLowerCase() === expectedType
      );
      expect(hasContentType).toBeTruthy();
    }
  }
);

Then("the results should be properly paginated", async function () {
  const isPaginationVisible = await searchPage.isPaginationVisible();
  expect(isPaginationVisible).toBeTruthy();
});

Then(
  "I should be able to navigate through all result pages",
  async function () {
    const isPaginationVisible = await searchPage.isPaginationVisible();
    expect(isPaginationVisible).toBeTruthy();
    // Additional pagination navigation tests can be added here
  }
);
