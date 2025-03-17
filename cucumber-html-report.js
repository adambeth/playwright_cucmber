const reporter = require("cucumber-html-reporter");
const fs = require("fs");
const path = require("path");

// Ensure the cucumber_report.json file exists
if (!fs.existsSync("./cucumber_report.json")) {
  console.error("Error: cucumber_report.json file not found!");
  console.error(
    "Please run tests with the --format json:cucumber_report.json option first."
  );
  process.exit(1);
}

// Create the reports directory if it doesn't exist
if (!fs.existsSync("./reports")) {
  fs.mkdirSync("./reports", { recursive: true });
}

// Define reporter options
const options = {
  theme: "bootstrap",
  jsonFile: "cucumber_report.json",
  output: path.join(__dirname, "reports/cucumber-report.html"),
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "Test",
    Platform: "Node.js " + process.version,
    Parallel: "Scenarios",
    Executed: "Local",
  },
  failedSummaryReport: true,
};

// Generate the report
reporter.generate(options);

console.log("Cucumber HTML report generated successfully!");
console.log(`Report is available at: ${path.resolve(options.output)}`);
