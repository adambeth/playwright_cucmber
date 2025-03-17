const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const SearchPage = require("../../tests/pageObjects/SearchPage");

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

/**
 * Verifies that all search results contain the specified search terms
 * This step ensures that each result contains ALL of the words in the search term
 * For example, if searching for "sport news", both "sport" AND "news" must be present
 *
 * @param {string} searchTerm - The search term(s) to check for. Multiple terms should be space-separated
 * @example
 * // Single term search
 * Then('all results should be relevant to "sports"')
 *
 * // Multiple terms search
 * Then('all results should be relevant to "sports news"')
 *
 * @throws {Error} When any search result does not contain all specified terms
 * @returns {Promise<void>}
 */
Then("all results should be relevant to {string}", async function (searchTerm) {
  const resultsText = await searchPage.getSearchResultsText();
  const searchTerms = searchTerm.toLowerCase().split(" ");
  console.log("Searching for terms:", searchTerms);

  let allResultsRelevant = true;
  let irrelevantResults = [];

  for (const resultText of resultsText) {
    const lowerResultText = resultText.toLowerCase();
    const isRelevant = searchTerms.every((term) =>
      lowerResultText.includes(term)
    );

    if (!isRelevant) {
      allResultsRelevant = false;
      irrelevantResults.push(resultText);
      console.log(
        `❌ Result does not contain all search terms: "${resultText.substring(
          0,
          100
        )}..."`
      );
    } else {
      console.log(
        `✅ Result contains all search terms: "${resultText.substring(
          0,
          100
        )}..."`
      );
    }
  }

  if (!allResultsRelevant) {
    console.log("\nSearch terms not found in these results:");
    irrelevantResults.forEach((result) =>
      console.log(`- ${result.substring(0, 100)}...`)
    );
  }

  expect(
    allResultsRelevant,
    `Some results did not contain all required search terms: ${searchTerms.join(
      ", "
    )}`
  ).toBeTruthy();
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

Then(
  "the search results should contain the terms {string}",
  async function (searchTerms) {
    const resultsArray = await searchPage.getSearchResultsText();
    const terms = searchTerms
      .toLowerCase()
      .split(",")
      .map((term) => term.trim());

    for (const result of resultsArray) {
      const lowerResult = result.toLowerCase();
      console.log("Checking result:", lowerResult);

      for (const term of terms) {
        if (lowerResult.includes(term)) {
          console.log(`Found term "${term}" in result`);
        }
      }
    }

    // Verify that at least one result contains each search term
    for (const term of terms) {
      const foundTerm = resultsArray.some((result) =>
        result.toLowerCase().includes(term)
      );
      expect(
        foundTerm,
        `Expected to find term "${term}" in search results`
      ).toBeTruthy();
    }
  }
);
