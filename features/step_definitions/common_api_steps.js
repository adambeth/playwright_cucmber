const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

// We don't need to export apiEndpoint anymore since we're using the world object

/**
 * Common step to check if the API endpoint is available
 * Used by all API tests
 */
Given("the countries API endpoint is available", async function () {
  try {
    // Get the endpoint from the world object and store it for other steps
    const apiEndpoint = this.apiConfig.countriesApiEndpoint;

    // Store it in the world object so it's accessible to all steps
    this.apiEndpoint = apiEndpoint;

    const timeout = this.apiConfig.apiTimeout;

    // Check if the endpoint is available
    const healthCheck = await fetch(apiEndpoint, {
      method: "HEAD",
      timeout: timeout,
    });

    if (!healthCheck.ok) {
      throw new Error(`API endpoint returned status: ${healthCheck.status}`);
    }

    this.log(
      `Countries API endpoint is available: ${apiEndpoint} (Status: ${healthCheck.status})`,
      true // Force log this important message
    );
  } catch (error) {
    this.logError(`Countries API endpoint is not available: ${error.message}`);
    throw new Error(
      `Countries API endpoint is not available: ${error.message}`
    );
  }
});

/**
 * Common step to check API response status code
 * Used by all API tests
 */
Then(
  "the response status code should be {int}",
  async function (expectedStatus) {
    try {
      expect(this.response.status).toBe(expectedStatus);
    } catch (error) {
      this.logError(
        `Expected status ${expectedStatus} but got ${this.response.status}: ${error.message}`
      );
      throw new Error(
        `Expected status ${expectedStatus} but got ${this.response.status}: ${error.message}`
      );
    }
  }
);

/**
 * Common step to validate JSON response
 * Used by all API tests
 */
Then("the response should be valid JSON", async function () {
  try {
    this.responseData = await this.response.json();
    expect(() => JSON.parse(JSON.stringify(this.responseData))).not.toThrow();
    this.log("Response is valid JSON");
  } catch (error) {
    this.logError(`Invalid JSON response: ${error.message}`);
    throw new Error(`Response is not valid JSON: ${error.message}`);
  }
});

// No need to export apiEndpoint anymore
