const { Formatter } = require("@cucumber/cucumber");

/**
 * Custom formatter to enhance the JSON output with additional metadata
 * This helps improve the quality of the generated reports
 */
class EnhancedJsonFormatter extends Formatter {
  constructor(options) {
    super(options);
    options.eventBroadcaster.on("envelope", (envelope) => {
      if (envelope.testRunFinished) {
        // Add timestamp to the report
        envelope.testRunFinished.timestamp = {
          seconds: Math.floor(Date.now() / 1000),
          nanos: (Date.now() % 1000) * 1000000,
        };
      }

      // Add additional metadata to test case started events
      if (envelope.testCaseStarted) {
        envelope.testCaseStarted.timestamp = {
          seconds: Math.floor(Date.now() / 1000),
          nanos: (Date.now() % 1000) * 1000000,
        };
      }

      // Add additional metadata to test case finished events
      if (envelope.testCaseFinished) {
        envelope.testCaseFinished.timestamp = {
          seconds: Math.floor(Date.now() / 1000),
          nanos: (Date.now() % 1000) * 1000000,
        };
      }

      // Write the envelope to the output stream
      this.log(JSON.stringify(envelope) + "\n");
    });
  }
}

module.exports = EnhancedJsonFormatter;
