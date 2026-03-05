# Security Best Practices

## Purpose

Defines mandatory security standards for this project.

Goals:

- Protect user data
- Prevent common vulnerabilities
- Enforce secure development habits
- Reduce risk in production

Security is not optional.
Security is part of quality.

---

# Core Security Principles

## 1. Least Privilege

Give minimum access required.

Examples:
- Components receive only the props they need
- No global mutable state outside of defined state management

---

## 2. Defense in Depth

Do not rely on a single protection layer.

Use:
- Client-side input validation (form boundary)
- TypeScript types to prevent malformed data at compile time
- Dependency auditing

---

## 3. Secure by Default

Default state must be secure.

Example:
- Never render raw HTML — React escapes output by default
- Do not use `dangerouslySetInnerHTML`

---

# Input Validation

Validate ALL user inputs at the form boundary.

Check for:
- Description: non-empty string
- Amount: a number greater than 0
- Category: one of the allowed `BudgetCategory` values

Reject invalid submissions before they enter state.

---

# XSS Prevention

React escapes all rendered output by default — this protection is only broken if you:

- Use `dangerouslySetInnerHTML`
- Inject raw HTML via `innerHTML` in DOM manipulation

**Rule:** Never use `dangerouslySetInnerHTML`. Never manipulate the DOM directly with raw user input.

---

# Secrets Management

## Never commit secrets

Do NOT store in repo:
- API keys
- Tokens
- Credentials
- Private configs

## Use

- Environment variables (`.env` files, not committed)
- CI/CD secrets

Note: VistaFi currently has no backend or external APIs — no secrets are required. Apply this rule when any are introduced.

---

# Dependency Security

Only use:
- Maintained libraries
- Trusted sources
- Actively updated packages

## Regularly

- Update dependencies
- Remove unused packages
- Run `npm audit` to check for known vulnerabilities

---

# Secure Coding Practices

Avoid:
- Hardcoded credentials or tokens
- Dynamic code execution (`eval`, `new Function`)
- Bypassing TypeScript with `any` casts on user input

Prefer:
- Typed data throughout
- Explicit validation at system boundaries (form inputs)
- Controlled form inputs (`value` + `onChange`) — never uncontrolled inputs for data that affects state

---

# CI/CD Security

- Protect pipelines
- Restrict access
- Secure secrets in CI environment variables
- Require reviews before merge

---

# Access Control

## Principle

Not everyone needs access to everything.

## Enforce

- Environment separation (dev / staging / production)
- Production access limited to authorized maintainers

---

# Code Review Security Checklist

Check for:
- No `dangerouslySetInnerHTML` usage
- Input validation present on all form fields
- No secrets committed
- No unused dependencies with known vulnerabilities
- No `eval` or dynamic code execution

---

# Developer Responsibilities

Every developer must:
- Follow this doc
- Report vulnerabilities
- Fix security issues quickly

---

# Golden Rules

Never trust input
Never expose secrets
Never skip validation
Never ignore security warnings

---

# Final Philosophy

Security is a feature.
A secure app earns trust.
Trust keeps users.
