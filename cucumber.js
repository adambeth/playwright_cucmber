module.exports = {
  default: {
    formatOptions: {
      snippetInterface: "async-await",
    },
    publishQuiet: true,
    requireModule: ["@cucumber/pretty-formatter"],
    require: ["features/step_definitions/*.js", "features/support/*.js"],
    format: ["@cucumber/pretty-formatter", "json:cucumber_report.json"],
  },
  quiet: {
    formatOptions: {
      snippetInterface: "async-await",
    },
    publishQuiet: true,
    require: ["features/step_definitions/*.js", "features/support/*.js"],
    format: ["json:cucumber_report.json"],
  },
  report: {
    formatOptions: {
      snippetInterface: "async-await",
    },
    publishQuiet: true,
    require: ["features/step_definitions/*.js", "features/support/*.js"],
    format: ["@cucumber/pretty-formatter", "json:cucumber_report.json"],
  },
};
