# Playwright Cucumber Framework

A web automation testing framework built with Playwright and Cucumber for BBC Sport search functionality, F1 results validation, and API schema validation.

## 🚀 Technologies Used

- [Playwright](https://playwright.dev/) - Modern end-to-end testing framework
- [Cucumber](https://cucumber.io/) - Behavior-driven development (BDD) testing framework
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Programming language
- [Ajv](https://ajv.js.org/) - JSON Schema validator for API testing
- [Multiple Cucumber HTML Reporter](https://github.com/wswebcreation/multiple-cucumber-html-reporter) - Enhanced HTML report generation
- [Cucumber HTML Reporter](https://github.com/gkushang/cucumber-html-reporter) - HTML report generation for Cucumber tests

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/adambeth/playwright_cucmber.git
cd playwright_cucmber
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## 🧪 Running Tests

### UI Tests

To run all tests:

```bash
npm run test:cucumber
```

To run tests without opening the report:

```bash
npm run test:cucumber:no-open
```

### API Tests

Run all API tests with HTML reporting:

```bash
npm run test:api
```

Run API tests with minimal console output:

```bash
npm run test:api:quiet
```

### Specific Feature Tests

Country count validation tests:

```bash
npm run test:countries
npm run test:countries:quiet  # For minimal console output
```

API schema validation tests:

```bash
npm run test:schema
npm run test:schema:quiet    # For minimal console output
```

South Africa languages validation tests:

```bash
npm run test:languages
npm run test:languages:quiet # For minimal console output
```

## 📊 Test Reporting

### Available Report Commands

Generate HTML report from existing JSON:

```bash
npm run report:html
```

Open the HTML report:

```bash
npm run report:open
```

### Report Features

The HTML reports include:

- Summary of test results (passed/failed/skipped scenarios)
- Detailed test steps with pass/fail status
- Test execution time and timestamps
- Environment metadata (Node.js version, platform, etc.)
- Failure screenshots (for UI tests)
- Expandable/collapsible sections for easy navigation

### GitHub Pages Integration

After each test run on the main branch, a detailed HTML report is automatically deployed to GitHub Pages at:
[https://adambeth.github.io/playwright_cucmber/cucumber-report.html](https://adambeth.github.io/playwright_cucmber/cucumber-report.html)

## 📁 Project Structure

```
playwright_cucmber/
├── features/                    # Cucumber feature files
│   ├── step_definitions/       # Step definitions
│   ├── support/               # Support files (hooks, world)
│   ├── sport_search.feature   # Sport search feature
│   ├── f1_results.feature    # F1 results validation
│   ├── api_schema_validation.feature # API schema validation
│   ├── south_africa_languages.feature # Language validation
│   └── country_count_validation.feature # Country count validation
├── tests/
│   ├── pageObjects/          # Page Object Models
│   └── schemas/              # JSON Schema definitions
├── .github/                  # GitHub configurations
│   └── workflows/           # GitHub Actions workflows
├── cucumber.js              # Cucumber configuration
├── cucumber-html-report.js  # HTML report configuration
├── cucumber-report-generator.js # Report generator script
├── playwright.config.js     # Playwright configuration
├── run-cucumber.js         # Test runner script
├── docker-compose.yml      # Docker compose configuration
├── Dockerfile             # Docker configuration
└── package.json          # Project dependencies
```

## 🐳 Docker Support

You can run the tests in a Docker container for a consistent environment across different machines.

### Prerequisites

- Docker
- Docker Compose

### Running Tests with Docker

1. Build and run tests:

```bash
docker-compose up --build
```

2. Run specific test scenarios:

```bash
docker-compose run test npm run test:api
docker-compose run test npm run test:schema
docker-compose run test npm run test:countries
docker-compose run test npm run test:languages
```

### Development with Docker

The Docker setup includes volume mounts for:

- `./reports`: Access test reports from your host machine
- `./features`: Live updates to feature files
- `./tests`: Live updates to test implementations

### Docker Environment Variables

Default environment variables:

- `CI=true`: Indicates running in CI environment
- `NODE_ENV=test`: Sets Node environment to test

Override via command line:

```bash
docker-compose run -e NODE_ENV=development test npm run test:cucumber
```

## 📝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request using the provided template

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Author

- Adam Bethlehem - Initial work

## 🙏 Acknowledgments

- BBC Sport team for providing the test environment
- Playwright team for the excellent testing framework
- Cucumber team for BDD capabilities
- Ajv team for JSON Schema validation
