# SecuritEase

## Overview

SecuritEase is an end-to-end testing framework for validating Formula 1 race results. It utilizes Playwright for browser automation and Cucumber for behavior-driven development (BDD), allowing for human-readable test specifications.

## Technologies Used

- **Playwright**: Browser automation framework for end-to-end web testing
- **Cucumber.js**: BDD testing framework that allows writing tests in Gherkin syntax
- **Node.js**: JavaScript runtime environment
- **Page Object Model**: Design pattern for improved test maintenance and reduced code duplication

## Project Structure

```
├── features/                     # Cucumber feature files and step definitions
│   ├── step_definitions/         # JavaScript implementations of Gherkin steps
│   ├── support/                  # Support files for Cucumber
│   └── *.feature                 # Gherkin feature files describing test scenarios
├── tests/
│   └── pageObjects/              # Page Object Model classes
│       ├── BasePage.js           # Base page class with common functionality
│       └── F1ResultsPage.js      # F1-specific page interactions
├── cucumber.js                   # Cucumber configuration
├── playwright.config.js          # Playwright configuration
└── package.json                  # Project dependencies and scripts
```

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd SecuritEase
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running Tests

Run the Cucumber tests with:

```
npm run test:cucumber
```

This will execute all feature files and generate an HTML report (`cucumber-report.html`) that can be viewed in any browser.

### Test Reports

- **HTML Report**: Generated after test execution at `cucumber-report.html`
- **Playwright Report**: Available in the `playwright-report` directory

## Feature Examples

The tests validate Formula 1 race results using BDD scenarios:

```gherkin
Feature: Formula 1 Race Results
  As a BBC editor
  I want to report on F1 race results
  So that readers get accurate race information

  Scenario: Validate 2023 Las Vegas Grand Prix Top 3 Finishers
    Given I am on the "2023" Formula 1 results page
    When I view the "Las Vegas Grand Prix" race results
    Then I should see the following race results:
      | Position | Driver Name    | Team     |
      |        1 | Max Verstappen | Red Bull |
      |        2 | George Russell | Mercedes |
      |        3 | Sergio Perez   | Red Bull |
```

## Adding New Tests

1. Create a new feature file in the `features` directory
2. Implement step definitions in `features/step_definitions` if needed
3. Create or extend page objects in `tests/pageObjects` to interact with the web pages

## Troubleshooting

- If tests fail, check the HTML report for detailed error messages
- Verify that the website structure hasn't changed, which might require updates to the page object selectors
- Ensure your internet connection is stable when running tests

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
