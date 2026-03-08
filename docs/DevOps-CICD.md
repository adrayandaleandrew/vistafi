# DevOps & CI/CD

## Purpose

Defines how we build, test, and deploy the application in a reliable, repeatable, and automated way.

Goals:

- Fast feedback
- Stable releases
- Minimal manual work
- Predictable deployments

---

# Core Philosophy

Automation > Manual Work
Consistency > Speed
Reliability > Complexity

If a process is repeated twice → automate it.

---

# Environments

We maintain separate environments:

## 1. Development (Dev)

Purpose:
- Active development
- Feature testing

Characteristics:
- Unstable
- Frequent changes
- Debug enabled

Run locally:
```
npm run dev
```

---

## 2. Staging

Purpose:
- Pre-production testing
- QA validation

Characteristics:
- Production-like config
- Used for regression tests
- Release candidate validation

Preview locally:
```
npm run build
npm run preview
```

---

## 3. Production

Purpose:
- Real users

Characteristics:
- Stable only
- No debugging tools
- Strict access control

---

# Branch Strategy

master → production
feature/* → development work

---

## Flow

Feature Branch → PR → master → deploy

---

# CI/CD Pipeline Overview

Pipeline Stages:

1. Install
2. Lint
3. Test
4. Build
5. Deploy

Every push triggers CI.

---

# Continuous Integration (CI)

## Trigger

On:
- Pull Requests
- Push to master

---

## CI Steps

### 1. Install Dependencies

- Clean install
- Lockfile enforced

```
npm ci
```

---

### 2. Lint

Ensure:
- Code style consistency
- No obvious issues

```
npm run lint
```

Fail build if lint fails.

---

### 3. Run Tests

Run:
- Unit tests

Rules:
- No flaky tests
- Deterministic only

Fail build if tests fail.

---

### 4. Build

Verify:
- App builds successfully
- No TypeScript errors

```
npm run build
```

This runs `tsc -b && vite build` — both type-checking and bundling must pass.

---

# Continuous Deployment (CD)

Deployment must be automated.

---

## Staging Deployment

Auto-deploy when:
- Merged into develop

Used by:
- QA
- Internal testing

---

## Production Deployment

Deploy when:
- Merged into main
- Or tagged release (v1.0.0)

Production deploy requires:
- Passing CI
- Stable staging verification

---

# Versioning

Use Semantic Versioning:

MAJOR.MINOR.PATCH

Examples:

1.0.0 → first stable release
1.1.0 → new feature
1.1.1 → bug fix

---

# Secrets Management

Never store secrets in repo.

Use:
- Environment variables
- Secret managers

Examples:
- API keys
- Tokens
- Third-party service credentials

Note: VistaFi currently has no backend or external services — no secrets are required. Apply this rule if any are introduced.

---

# Monitoring

Track:

- Build failures
- Deploy errors
- Runtime errors (if error tracking is added)

Goal:
Detect problems early.

---

# Rollback Strategy

Every deploy must be reversible.

Rollback triggers:

- Critical bug
- Crash spike
- Data issues

Always keep:
- Previous stable build

---

# Automation Rules

Automate:

- Testing
- Linting
- Build checks
- Deployment

Avoid manual deployments.

---

# Release Checklist

Before production release:

- Tests passing
- Lint clean
- No debug logs or `console.log` left in code
- Docs updated
- Version bumped

---

# Logging Strategy

Log:

- Errors
- Important events
- Warnings

Do NOT log:
- Sensitive data
- Personal user info

---

# Performance Considerations

Optimize:

- Bundle size
- Asset sizes (images, fonts)
- Unnecessary re-renders

Goal:
Fast load on average hardware.

---

# Reliability Rules

Never deploy:

- Broken builds
- Untested features
- Experimental code

---

# Incident Response

If production issue occurs:

1. Identify
2. Mitigate
3. Rollback if needed
4. Document incident
5. Prevent recurrence

---

# Documentation Rule

CI/CD changes must be documented.

If pipeline changes → update this file.

---

# Golden Rule

A stable system users trust
> a fast system that breaks.
