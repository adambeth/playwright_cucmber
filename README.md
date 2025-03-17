# SecuritEase

A web automation testing framework built with Playwright and Cucumber for BBC Sport search functionality.

## 🚀 Technologies Used

- [Playwright](https://playwright.dev/) - Modern end-to-end testing framework
- [Cucumber](https://cucumber.io/) - Behavior-driven development (BDD) testing framework
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Programming language
- [Cursor](https://cursor.sh/) - AI-powered IDE for enhanced development experience
- [Claude Sonnet](https://www.anthropic.com/claude) - AI assistant for code generation and review

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## 🛠️ Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd SecuritEase
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

To run all tests:

```bash
npm test
```

To run specific feature:

```bash
npm test -- --grep "@sport-search"
```

## 📁 Project Structure

```
SecuritEase/
├── features/                    # Cucumber feature files
│   ├── step_definitions/       # Step definitions
│   └── sport_search.feature    # Sport search feature
├── tests/
│   └── pageObjects/           # Page Object Models
├── .github/                    # GitHub configurations
│   └── pull_request_template.md # PR template
└── package.json               # Project dependencies
```

## 🤖 AI Development Tools

This project leverages AI-powered development tools to enhance productivity:

- **Cursor**: Used for intelligent code completion, refactoring, and debugging
- **Claude Sonnet**: Assists with code generation, review, and documentation

## 📝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request using the provided template

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- BBC Sport team for providing the test environment
- Playwright team for the excellent testing framework
- Cucumber team for BDD capabilities
- Cursor team for the AI-powered development experience
