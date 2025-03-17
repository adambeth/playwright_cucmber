const { setWorldConstructor } = require("@cucumber/cucumber");

/**
 * Custom world class for sharing context between steps
 */
class CustomWorld {
  constructor() {
    // Common API configuration
    this.apiConfig = {
      // Base URL for the REST Countries API
      countriesApiEndpoint: "https://restcountries.com/v3.1/all/",

      // Default timeout for API requests in milliseconds
      apiTimeout: 5000,

      // Expected counts for validation
      expectedCountryCounts: {
        // The official count of UN-recognized sovereign states (193)
        // Plus Vatican City and Palestine (observer states) = 195
        sovereignStates: 195,

        // Minimum threshold for UN members in the API
        minUnMembers: 190,

        // Minimum threshold for independent countries in the API
        minIndependentCountries: 190,
      },
    };
  }
}

setWorldConstructor(CustomWorld);
