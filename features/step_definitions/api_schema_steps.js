const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const Ajv = require("ajv");
const ajv = new Ajv();
const restCountriesSchema = require("../../tests/schemas/restCountriesSchema");

let apiEndpoint;
let response;

Given("the API endpoint is available", async function () {
  apiEndpoint = "https://restcountries.com/v3.1/all/";
});

Given("I have the expected schema definition", async function () {
  // Schema is now imported from a separate file
  this.schema = restCountriesSchema;
});

When("I send a GET request to the API endpoint", async function () {
  const response = await fetch(apiEndpoint);
  this.response = response;
});

Then(
  "the response status code should be {int}",
  async function (expectedStatus) {
    expect(this.response.status).toBe(expectedStatus);
  }
);

Then("the response should be valid JSON", async function () {
  this.responseData = await this.response.json();
  expect(() => JSON.parse(JSON.stringify(this.responseData))).not.toThrow();
});

Then("the response should conform to the published schema", async function () {
  const validate = ajv.compile(this.schema);
  const isValid = validate(this.responseData);

  if (!isValid) {
    console.log("Schema validation errors:", validate.errors);
  }

  expect(isValid).toBeTruthy();
});

Then(
  "I should print the validation results in the test report",
  async function () {
    const validate = ajv.compile(this.schema);
    const isValid = validate(this.responseData);

    console.log("\n=== API Schema Validation Results ===");
    console.log(`Endpoint: ${apiEndpoint}`);
    console.log(`Validation Status: ${isValid ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`Total countries in response: ${this.responseData.length}`);

    if (!isValid) {
      console.log("\nValidation Errors:");
      validate.errors.forEach((error) => {
        console.log(`- ${error.message}`);
      });
    }

    console.log("===================================\n");
  }
);
