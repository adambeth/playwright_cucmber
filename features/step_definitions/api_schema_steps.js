const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const Ajv = require("ajv");
const ajv = new Ajv();
const fs = require("fs");
const path = require("path");

// Define the schema path but don't load it yet
const schemaPath = path.resolve(
  __dirname,
  "../../tests/schemas/restCountriesSchema.js"
);

let apiEndpoint;

Given("the API endpoint is available", async function () {
  try {
    apiEndpoint = "https://restcountries.com/v3.1/all/";

    // Actually check if the endpoint is available
    const healthCheck = await fetch(apiEndpoint, {
      method: "HEAD", // Use HEAD request for faster response
      timeout: 5000, // Set a reasonable timeout
    });

    if (!healthCheck.ok) {
      throw new Error(`API endpoint returned status: ${healthCheck.status}`);
    }

    console.log(
      `API endpoint is available: ${apiEndpoint} (Status: ${healthCheck.status})`
    );
  } catch (error) {
    console.error(`API endpoint is not available: ${error.message}`);
    throw new Error(`API endpoint is not available: ${error.message}`);
  }
});

Given("I have the expected schema definition", async function () {
  try {
    // Check if schema file exists
    if (!fs.existsSync(schemaPath)) {
      console.error(`Schema file not found: ${schemaPath}`);
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    // Load the schema file
    try {
      const schema = require(schemaPath);
      this.schema = schema;
      console.log("Schema loaded successfully from file");
    } catch (loadError) {
      console.error(`Error loading schema file: ${loadError.message}`);
      throw new Error(`Failed to load schema file: ${loadError.message}`);
    }

    // Validate that we have a schema
    if (!this.schema) {
      throw new Error("Schema is undefined after loading");
    }
  } catch (error) {
    console.error(`Error setting schema: ${error.message}`);
    throw error; // Re-throw the error to fail the test
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
