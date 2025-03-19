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
