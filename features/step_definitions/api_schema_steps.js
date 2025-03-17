const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const Ajv = require("ajv");
// We don't need to import apiEndpoint anymore
// const { apiEndpoint } = require("./common_api_steps");

// Create Ajv instance with options for draft-06
const ajv = new Ajv({
  strict: false, // Be more lenient with validation
  formats: {
    uri: true, // Enable URI format validation
  },
});

// Add format validators
ajv.addFormat("uri", {
  type: "string",
  validate: (str) => {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  },
});

const fs = require("fs");
const path = require("path");

// Define the schema path but don't load it yet
const schemaPath = path.resolve(__dirname, "../../tests/schemas/all.json");

// Note: The "the countries API endpoint is available" step is now in common_api_steps.js

Given("I have the expected schema definition", async function () {
  try {
    // Check if schema file exists
    if (!fs.existsSync(schemaPath)) {
      console.error(`Schema file not found: ${schemaPath}`);
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    // Load the schema file and data to the world object
    try {
      // Read and parse JSON file instead of requiring a JS module
      const schemaContent = fs.readFileSync(schemaPath, "utf8");
      this.schema = JSON.parse(schemaContent);
      console.log("Schema loaded successfully from JSON file");
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

//we could make a common step for any api calls and use a switch statement to determine the method to use
When("I send a GET request to the API endpoint", async function () {
  try {
    // Use the apiEndpoint from the world object
    const response = await fetch(this.apiEndpoint);
    this.response = response;
    console.log(
      `API request to ${this.apiEndpoint} completed with status: ${response.status}`
    );
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw new Error(
      `Failed to fetch from ${this.apiEndpoint}: ${error.message}`
    );
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

    // Remove $schema property if it exists to avoid validation issues
    const schemaToValidate = { ...this.schema };
    if (schemaToValidate.$schema) {
      delete schemaToValidate.$schema;
    }

    const validate = ajv.compile(schemaToValidate);
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

      // Remove $schema property if it exists to avoid validation issues
      const schemaToValidate = { ...this.schema };
      if (schemaToValidate.$schema) {
        delete schemaToValidate.$schema;
      }

      const validate = ajv.compile(schemaToValidate);
      const isValid = validate(this.responseData);

      console.log("\n=== API Schema Validation Results ===");
      console.log(`Endpoint: ${this.apiEndpoint}`);
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
