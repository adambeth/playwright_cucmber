#!/usr/bin/env node
const { spawnSync } = require("child_process");
const { execSync } = require("child_process");

// Get all command line arguments after the script name
const args = process.argv.slice(2);

// Build the cucumber command with the provided arguments
const cucumberArgs = ["--format", "json:cucumber_report.json", ...args];

console.log(`\n🚀 Running cucumber with args: ${cucumberArgs.join(" ")}\n`);

// Run the cucumber command
const result = spawnSync("cucumber-js", cucumberArgs, {
  stdio: "inherit",
  shell: true,
});

// Generate the report regardless of test success/failure
console.log("\n\nGenerating HTML report...");
try {
  // Run the report generator
  require("./cucumber-html-report");

  // Open the report
  console.log("\nOpening report...");
  execSync("npm run report:open", { stdio: "inherit" });
} catch (error) {
  console.error("Error generating or opening report:", error);
}

// Exit with the same code as cucumber
process.exit(result.status);
