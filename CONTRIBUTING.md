# Contributing to Google Search Console CLI

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/search-console-cli.git`
3. Install dependencies: `bun install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development

### Prerequisites

- Bun 1.0+
- A Google Cloud project with Search Console API enabled
- Service account credentials with appropriate permissions

### Setup

1. Copy `.env.example` to `.env` and configure your credentials
2. Run tests: `bun run test`
3. Build: `bun run build`

### Code Style

- Use TypeScript with strict mode
- Add type annotations to all function parameters and return types
- Write descriptive commit messages
- Add tests for new functionality

## Pull Request Process

1. Ensure all tests pass: `bun run test`
2. Build successfully: `bun run build`
3. Update documentation if needed
4. Create a pull request with a clear description of your changes

## Adding New Tools

When adding new commands:

1. Create the implementation in `src/tools/`
2. Register the tool in `src/index.ts`
3. Add tests in `tests/`
4. Update `README.md` with the new tool documentation

## Reporting Issues

Please include:
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Error messages if applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
