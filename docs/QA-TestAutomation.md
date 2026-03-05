# QA Test Automation

---

# Philosophy

Test critical flows first.

Focus on:
- Stability
- Reliability
- Regression prevention

---

# Test Levels

## 1. Unit Tests

Test:
- Utilities
- Business logic

Priority targets:
- `calculateBudgetSummary()` — verify income, expense, savings totals and balance calculation across various item combinations
- `generateId()` — verify output is a non-empty string and that repeated calls produce unique values

---

## 2. Integration Tests

Test:
- Component interactions
- State updates propagating through the component tree

---

## 3. E2E Tests

Test the three critical VistaFi user flows:

- **Add transaction** — fill in description, amount, category; submit; verify item appears in list and summary updates
- **Delete transaction** — click delete on an item; verify item removed from list and summary updates
- **Edit transaction** — click edit on an item; verify form pre-fills; change a value; submit; verify list and summary reflect the update

Note: Edit flow E2E should be implemented after Phase 4 (edit functionality) is complete.

---

# Automation Scope

Automate:
- Core flows
- Repeated tests

Don't automate:
- Rapidly changing UI

---

# Test Rules

- Tests must be deterministic
- No flaky tests
- No external calls — app is client-only, no mocking needed for network

---

# Coverage Goal

70–80% is enough.

---

# Golden Rule

Quality > quantity of tests.
