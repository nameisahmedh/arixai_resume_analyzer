# Contributing to ArixAI Resume Analyzer

We love your input! We want to make contributing to this project as easy and transparent as possible.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (OS, Node version, npm version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the JavaScript styleguide
* Include appropriate test cases
* Update documentation as needed
* End all files with a newline

## Development Setup

### 1. Fork and Clone
```bash
git clone https://github.com/yourusername/arixai-resume-analyzer.git
cd arixai-resume-analyzer
npm install
```

### 2. Create Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 3. Make Changes
- Write clear, commented code
- Follow existing code style
- Add JSDoc comments for functions

### 4. Test Locally
```bash
npm run dev
# Test your changes thoroughly
```

### 5. Commit Changes
```bash
git add .
git commit -m 'Add amazing feature'
# Use clear, descriptive commit messages
```

### 6. Push and Create PR
```bash
git push origin feature/amazing-feature
```

## Styleguides

### JavaScript/React

* Use ES6+ syntax
* Use meaningful variable names
* Add JSDoc comments for functions
* Format with proper indentation (2 spaces)

```javascript
/**
 * Analyzes resume with AI model
 * @param {File} resumeFile - Resume file to analyze
 * @param {string} jobDescription - Target job description
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeResume(resumeFile, jobDescription) {
  // Implementation
}
```

### Commit Messages

* Use present tense ("Add feature" not "Added feature")
* Use imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

```
Add resume upload validation

- Validate file size (max 5MB)
- Check file format (PDF, DOCX, TXT)
- Show user-friendly error messages

Fixes #123
```

### Documentation

* Use clear, simple language
* Include code examples where relevant
* Update README.md if adding features
* Keep documentation in sync with code

## Project Structure Guidelines

```
When adding new files, follow this structure:

Components: client/src/components/
Pages: client/src/pages/
Hooks: client/src/hooks/
Utilities: client/src/lib/
Server Routes: server/
```

## Testing

While not required for all contributions, tests are appreciated:

```bash
# If testing framework is added
npm run test
npm run test:watch  # Watch mode
```

## Review Process

1. **Automated Checks**: GitHub Actions runs on all PRs
2. **Code Review**: Maintainers review your code
3. **Feedback**: We'll provide constructive feedback
4. **Approval & Merge**: Once approved, your PR will be merged

## Becoming a Maintainer

* Have made valuable contributions
* Demonstrated knowledge of codebase
* Commitment to project quality and community
* Contact maintainers via email

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## Questions?

* 📧 Email: dev@arixai.com
* 💬 GitHub Issues: Ask in relevant issue
* 🐦 Twitter: @arixai_dev

---

Thank you for contributing! 🎉
