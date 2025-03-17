const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
// We don't need to import apiEndpoint anymore
// const { apiEndpoint } = require("./common_api_steps");

// South Africa-specific endpoint
let southAfricaEndpoint;

// Expected official languages of South Africa
const EXPECTED_LANGUAGES = {
  // ISO 639-1 language codes for South Africa's 11 official languages
  afr: "Afrikaans",
  eng: "English",
  nbl: "South Ndebele",
  nso: "Northern Sotho",
  sot: "Southern Sotho",
  ssw: "Swati",
  tsn: "Tswana",
  tso: "Tsonga",
  ven: "Venda",
  xho: "Xhosa",
  zul: "Zulu",
  // South African Sign Language (SASL) - may not be in the API yet
  sfs: "South African Sign Language",
};

// Note: The "the countries API endpoint is available" step is now in common_api_steps.js

When(
  "I retrieve information about South Africa from the API",
  async function () {
    try {
      // Create a specific endpoint for South Africa (using alpha code)
      southAfricaEndpoint = this.apiEndpoint.replace("all", "alpha/ZAF");

      // Make the API request
      const response = await fetch(southAfricaEndpoint);
      this.response = response;
      console.log(
        `API request to ${southAfricaEndpoint} completed with status: ${response.status}`
      );
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw new Error(
        `Failed to fetch from ${southAfricaEndpoint}: ${error.message}`
      );
    }
  }
);

Then("I should verify South Africa's official languages", async function () {
  try {
    if (!this.responseData) {
      throw new Error(
        "Response data is not available. Check if previous steps completed successfully."
      );
    }

    // The API returns an array with a single country object for alpha code requests
    const southAfrica = Array.isArray(this.responseData)
      ? this.responseData[0]
      : this.responseData;

    // Store South Africa data for later steps if we need it
    this.southAfrica = southAfrica;

    // Verify we have the languages property
    expect(southAfrica).toHaveProperty("languages");

    // Store the languages for reporting
    this.languages = southAfrica.languages;

    // Log the languages found
    console.log("South Africa languages found in API:");
    Object.entries(this.languages).forEach(([code, name]) => {
      console.log(`- ${code}: ${name}`);
    });

    // Verify that we have at least some of the expected languages
    const languageCodes = Object.keys(this.languages);
    console.log("language codes", languageCodes);
    const expectedCodes = Object.keys(EXPECTED_LANGUAGES);

    // Check that we have at least some of the expected languages
    const foundLanguages = expectedCodes.filter((code) =>
      languageCodes.includes(code)
    );
    this.foundLanguages = foundLanguages;

    // We should find at least some of the expected languages
    expect(foundLanguages.length).toBeGreaterThan(0);
  } catch (error) {
    console.error("Language validation error:", error.message);
    throw error;
  }
});

Then(
  "I should check if South African Sign Language is included in the list",
  async function () {
    try {
      if (!this.languages) {
        throw new Error(
          "Languages data is not available. Check if previous steps completed successfully."
        );
      }

      // Check if South African Sign Language is included
      // It might be under different codes, so we'll check both the code and name
      const hasSASLByCode = Object.keys(this.languages).includes("sfs");
      const hasSASLByName = Object.values(this.languages).some(
        (name) =>
          name.toLowerCase().includes("sign") &&
          name.toLowerCase().includes("south africa")
      );

      // Store the result for reporting
      this.hasSASL = hasSASLByCode || hasSASLByName;

      // Modified: Now we WILL fail the test if SASL is not found
      if (this.hasSASL) {
        console.log(
          "✅ South African Sign Language (SASL) is included in the official languages"
        );
      } else {
        console.log(
          "❌ South African Sign Language (SASL) is NOT included in the official languages"
        );
        console.log(
          "This is a critical policy gap that needs to be addressed."
        );
        // Fail the test with a clear message
        throw new Error(
          "Test failed: South African Sign Language (SASL) is not included in the official languages. " +
            "This is a critical requirement for inclusive education policies."
        );
      }
    } catch (error) {
      console.error("SASL check error:", error.message);
      throw error;
    }
  }
);

Then(
  "I should print the language validation results in the test report",
  async function () {
    try {
      if (!this.languages) {
        throw new Error(
          "Languages data is not available. Check if previous steps completed successfully."
        );
      }

      console.log("\n=== South Africa Language Validation Results ===");
      console.log(`Endpoint: ${southAfricaEndpoint}`);

      // Print the languages found in the API
      console.log("\nLanguages found in API:");
      Object.entries(this.languages).forEach(([code, name]) => {
        console.log(`- ${code}: ${name}`);
      });

      // Print the expected languages
      console.log("\nExpected official languages:");
      Object.entries(EXPECTED_LANGUAGES).forEach(([code, name]) => {
        const found = Object.keys(this.languages).includes(code);
        console.log(`- ${code}: ${name} ${found ? "✅" : "❌"}`);
      });

      // Print SASL status
      console.log("\nSouth African Sign Language (SASL) Status:");
      if (this.hasSASL) {
        console.log("✅ SASL is recognized in the API data");
      } else {
        console.log("❌ SASL is NOT recognized in the API data");
        console.log(
          "Recommendation: Include SASL as an official language in educational policies"
        );
        console.log(
          "and ensure it is properly represented in international databases."
        );
      }

      // Print policy recommendation
      console.log("\nPolicy Recommendation:");
      console.log(
        "As the Minister of Education, ensure that South African Sign Language (SASL)"
      );
      console.log(
        "is officially recognized as one of South Africa's official languages"
      );
      console.log(
        "so that it is fully incorporated into educational policies, resources,"
      );
      console.log("and inclusive learning environments.");

      console.log("===================================\n");
    } catch (error) {
      console.error(
        "Error printing language validation results:",
        error.message
      );
      throw new Error(
        `Failed to print language validation results: ${error.message}`
      );
    }
  }
);
