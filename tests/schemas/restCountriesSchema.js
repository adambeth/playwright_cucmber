/**
 * Schema definition for REST Countries API v3.1
 * Validates the structure of country data returned by the API
 *
 * Note: Some countries may not have all properties, so many are made optional
 */
const restCountriesSchema = {
  type: "array",
  items: {
    type: "object",
    // Only require the most essential properties that all countries should have
    required: [
      "name",
      "cca2",
      "cca3",
      "status",
      "region",
      "latlng",
      "landlocked",
      "area",
      "flag",
      "population",
      "continents",
      "flags",
    ],
    properties: {
      name: {
        type: "object",
        required: ["common", "official"],
        properties: {
          common: { type: "string" },
          official: { type: "string" },
          nativeName: { type: "object" },
        },
      },
      tld: { type: ["array", "null"], items: { type: "string" } },
      cca2: { type: "string" },
      ccn3: { type: ["string", "null"] },
      cca3: { type: "string" },
      cioc: { type: ["string", "null"] },
      independent: { type: ["boolean", "null"] },
      status: { type: "string" },
      unMember: { type: ["boolean", "null"] },
      currencies: { type: ["object", "null"] },
      idd: {
        type: ["object", "null"],
        properties: {
          root: { type: "string" },
          suffixes: { type: "array", items: { type: "string" } },
        },
      },
      capital: { type: ["array", "null"], items: { type: "string" } },
      altSpellings: { type: ["array", "null"], items: { type: "string" } },
      region: { type: "string" },
      subregion: { type: ["string", "null"] },
      languages: { type: ["object", "null"] },
      translations: { type: ["object", "null"] },
      latlng: { type: "array", items: { type: "number" } },
      landlocked: { type: "boolean" },
      borders: { type: ["array", "null"], items: { type: "string" } },
      area: { type: "number" },
      demonyms: { type: ["object", "null"] },
      flag: { type: "string" },
      maps: {
        type: ["object", "null"],
        properties: {
          googleMaps: { type: "string" },
          openStreetMaps: { type: "string" },
        },
      },
      population: { type: "number" },
      gini: { type: ["object", "null"] },
      fifa: { type: ["string", "null"] },
      car: {
        type: ["object", "null"],
        properties: {
          signs: { type: "array", items: { type: "string" } },
          side: { type: "string" },
        },
      },
      timezones: { type: ["array", "null"], items: { type: "string" } },
      continents: { type: "array", items: { type: "string" } },
      flags: {
        type: "object",
        properties: {
          png: { type: "string" },
          svg: { type: "string" },
          alt: { type: ["string", "null"] },
        },
      },
      coatOfArms: {
        type: ["object", "null"],
        properties: {
          png: { type: ["string", "null"] },
          svg: { type: ["string", "null"] },
        },
      },
      startOfWeek: { type: ["string", "null"] },
      capitalInfo: {
        type: ["object", "null"],
        properties: {
          latlng: { type: ["array", "null"], items: { type: "number" } },
        },
      },
      postalCode: {
        type: ["object", "null"],
        properties: {
          format: { type: "string" },
          regex: { type: "string" },
        },
      },
    },
  },
};

module.exports = restCountriesSchema;
