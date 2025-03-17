const report = require("multiple-cucumber-html-reporter");
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
if (!fs.existsSync("./reports/cucumber-report")) {
  fs.mkdirSync("./reports/cucumber-report", { recursive: true });
}

// Convert the cucumber_report.json file to the format expected by multiple-cucumber-html-reporter
// Cucumber.js v11 uses a different format than what multiple-cucumber-html-reporter expects
try {
  // Read the cucumber_report.json file
  const rawData = fs.readFileSync("./cucumber_report.json", "utf8");

  // Parse the JSON data
  const jsonData = JSON.parse(rawData);

  // Create a compatible format for multiple-cucumber-html-reporter
  const compatibleData = [];

  // Process each line as a separate JSON object
  const lines = rawData.split("\n").filter((line) => line.trim());
  for (const line of lines) {
    try {
      const envelope = JSON.parse(line);

      // Process only the test case finished events
      if (envelope.testCaseFinished) {
        // Find the corresponding test case started event
        const testCaseStarted = jsonData.find(
          (e) =>
            e.testCaseStarted &&
            e.testCaseStarted.id === envelope.testCaseFinished.testCaseStartedId
        );

        // Find the corresponding test case
        const testCase = jsonData.find(
          (e) =>
            e.testCase &&
            e.testCase.id === testCaseStarted?.testCaseStarted?.testCaseId
        );

        if (testCase && testCaseStarted) {
          // Create a compatible test case object
          const compatibleTestCase = {
            id: testCase.testCase.id,
            uri: testCase.testCase.uri,
            name: testCase.testCase.name,
            line: testCase.testCase.location.line,
            keyword: "Scenario",
            description: "",
            type: "scenario",
            tags: testCase.testCase.tags.map((tag) => ({ name: tag.name })),
            steps: [],
            status: envelope.testCaseFinished.willBeRetried
              ? "pending"
              : envelope.testCaseFinished.testResult.status === "PASSED"
              ? "passed"
              : "failed",
          };

          compatibleData.push(compatibleTestCase);
        }
      }
    } catch (e) {
      console.error("Error processing line:", e);
    }
  }

  // Write the compatible data to a new file
  fs.writeFileSync(
    "./reports/cucumber-report/cucumber_report_compatible.json",
    JSON.stringify(compatibleData, null, 2)
  );

  console.log("Converted Cucumber.js v11 report to compatible format");
} catch (error) {
  console.error("Error converting report format:", error);
  process.exit(1);
}

// Generate the report
report.generate({
  jsonDir: "./reports/cucumber-report/",
  reportPath: "./reports/cucumber-report/html",
  metadata: {
    browser: {
      name: "API Tests",
      version: "N/A",
    },
    device: "Local development",
    platform: {
      name: "Node.js",
      version: process.version,
    },
  },
  customData: {
    title: "REST Countries API Test Report",
    data: [
      { label: "Project", value: "REST Countries API Testing" },
      { label: "Release", value: "1.0.0" },
      { label: "Execution Date", value: new Date().toISOString().slice(0, 10) },
      { label: "Environment", value: "Test" },
    ],
  },
  displayDuration: true,
  durationInMS: true,
  openReportInBrowser: true,
  pageTitle: "REST Countries API Test Report",
  reportName: "REST Countries API Test Results",
  pageFooter:
    '<div class="created-by">Created by REST Countries API Test Framework</div>',
});

console.log("Multiple Cucumber HTML report generated successfully!");
console.log(
  `Report is available at: ${path.resolve(
    "./reports/cucumber-report/html/index.html"
  )}`
);
