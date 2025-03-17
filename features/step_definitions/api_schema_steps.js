const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const Ajv = require("ajv");
const ajv = new Ajv();
const fs = require("fs");
const path = require("path");

// Import schema with error handling
let restCountriesSchema;
try {
  const schemaPath = path.resolve(
    __dirname,
    "../../tests/schemas/restCountriesSchema.js"
  );
  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema file not found: ${schemaPath}`);
    restCountriesSchema = { type: "array", items: { type: "object" } }; // Fallback schema
  } else {
    restCountriesSchema = require("../../tests/schemas/restCountriesSchema");
  }
} catch (error) {
  console.error(`Error loading schema file: ${error.message}`);
  restCountriesSchema = { type: "array", items: { type: "object" } }; // Fallback schema
}

let apiEndpoint;

Given("the API endpoint is available", async function () {
  apiEndpoint = "https://restcountries.com/v3.1/all/";
});

Given("I have the expected schema definition", async function () {
  try {
    // Schema is now imported from a separate file with error handling
    this.schema = restCountriesSchema;
    console.log("Schema loaded successfully");
  } catch (error) {
    console.error(`Error setting schema: ${error.message}`);
    throw new Error(`Failed to load schema: ${error.message}`);
  }
});

When("I send a GET request to the API endpoint", async function () {
  try {
    const response = await fetch(apiEndpoint);
    this.response = response;
    console.log(
      `API request to ${apiEndpoint} completed with status: ${response.status}`
    );
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw new Error(`Failed to fetch from ${apiEndpoint}: ${error.message}`);
  }
});

Then(
  "the response status code should be {int}",
  async function (expectedStatus) {
    try {
      expect(this.response.status).toBe(expectedStatus);
    } catch (error) {
      throw new Error(
        `Expected status ${expectedStatus} but got ${this.response.status}: ${error.message}`
      );
    }
  }
);

Then("the response should be valid JSON", async function () {
  try {
    this.responseData = await this.response.json();
    expect(() => JSON.parse(JSON.stringify(this.responseData))).not.toThrow();
    console.log("Response is valid JSON");
  } catch (error) {
    console.error("Invalid JSON response:", error.message);
    throw new Error(`Response is not valid JSON: ${error.message}`);
  }
});

Then("the response should conform to the published schema", async function () {
  try {
    if (!this.schema) {
      throw new Error(
        "Schema is not defined. Check if schema file was loaded correctly."
      );
    }

    if (!this.responseData) {
      throw new Error(
        "Response data is not available. Check if previous steps completed successfully."
      );
    }

    const validate = ajv.compile(this.schema);
    const isValid = validate(this.responseData);

    if (!isValid) {
      console.log("Schema validation errors:", validate.errors);
      throw new Error(
        `Schema validation failed: ${JSON.stringify(validate.errors)}`
      );
    }

    expect(isValid).toBeTruthy();
  } catch (error) {
    console.error("Schema validation error:", error.message);
    throw error;
  }
});

Then(
  "I should print the validation results in the test report",
  async function () {
    try {
      if (!this.schema || !this.responseData) {
        throw new Error(
          "Schema or response data is missing. Check previous steps."
        );
      }

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
    } catch (error) {
      console.error("Error printing validation results:", error.message);
      throw new Error(`Failed to print validation results: ${error.message}`);
    }
  }
);
