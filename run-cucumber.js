#!/usr/bin/env node
const { spawnSync } = require("child_process");
const { execSync } = require("child_process");

// Get all command line arguments after the script name
const args = process.argv.slice(2);

// Check if --no-open flag is present and remove it from args if it is
const noOpen = args.includes("--no-open");
const cucumberArgs = args.filter((arg) => arg !== "--no-open");

// Build the cucumber command with the provided arguments
const finalArgs = ["--format", "json:cucumber_report.json", ...cucumberArgs];

console.log(`\n🚀 Running cucumber with args: ${finalArgs.join(" ")}\n`);

// Run the cucumber command
const result = spawnSync("cucumber-js", finalArgs, {
  stdio: "inherit",
  shell: true,
});

// Generate the report regardless of test success/failure
console.log("\n\nGenerating HTML report...");
try {
  // Run the report generator
  require("./cucumber-html-report");

  // Only open the report if --no-open flag is not present
  if (!noOpen) {
    console.log("\nOpening report...");
    execSync("npm run report:open", { stdio: "inherit" });
  } else {
    console.log("\nSkipping report opening (--no-open flag present)");
  }
} catch (error) {
  console.error("Error generating or opening report:", error);
}

// Exit with the same code as cucumber
process.exit(result.status);
