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
  launchReport: false,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "Test",
    Platform: "Node.js " + process.version,
    Parallel: "Scenarios",
    Executed: "Local",
  },
  failedSummaryReport: true,
};

// Get the absolute path to the report
const reportPath = path.resolve(options.output);
const fileUrl = `file://${reportPath}`;

// Print a message before generating the report
console.log("\n\n🚀 Generating Cucumber HTML report...");

// Generate the report
reporter.generate(options);

// Create a visually distinct report link message
console.log("\n\n");
console.log(
  "╔═════════════════════════════════════════════════════════════════════════════════╗"
);
console.log(
  "║                           CUCUMBER HTML REPORT                                  ║"
);
console.log(
  "╚═════════════════════════════════════════════════════════════════════════════════╝"
);
console.log("\n✅ Cucumber HTML report generated successfully!");
console.log(`\n📊 Report location: ${reportPath}`);
console.log(`\n🔗 Click to open: ${fileUrl}`);
console.log("\n💻 Or run: npm run report:open");
console.log(
  "\n═════════════════════════════════════════════════════════════════════════════════\n"
);
