# Security Policy

## Supported Versions

The following versions of the Code Voyage template are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## Reporting a Vulnerability

We take the security of our software seriously. If you believe you have found a security vulnerability in the Code Voyage template, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please send an email to [security@codevoyage.dev](mailto:security@codevoyage.dev).

You should receive a response within 24 hours. If for some reason you do not, please follow up with us to ensure we received your original message.

## Security Features

This template includes the following built-in security features:

- **Dependabot**: Automatically checks for vulnerable dependencies.
- **Secret Scanning**: Prevents accidental commit of credentials.
- **CodeQL**: Static code analysis for security vulnerabilities.
- **Strict CSP**: Content Security Policy configuration (recommended in production).

## Best Practices for Users

When using this template for your own site, we recommend:

1. Regularly updating dependencies (`npm update`).
2. Enabling Branch Protection rules on your repository.
3. Reviewing the `content.json` to ensure no sensitive data is included in public fields.
