# Active Context — Phase 9: Quality & Release

## Context

Post-Phase-8 codebase audit (2026-03-08) identified 9 tasks across 3 priority tiers. All tasks stem from standards gaps, dead code, outdated documentation, or missing test coverage. Phases 0–8 are complete.

---

## Tasks (in order)

| # | Task | Branch | Priority |
|---|------|--------|----------|
| 1 | Fix CI branch triggers | `chore/fix-ci-branch-triggers` | CRITICAL |
| 2 | Update CLAUDE.md project structure | `chore/update-claude-project-structure` | HIGH |
| 3 | Fix README dev port | `fix/readme-dev-port` | HIGH |
| 4 | Remove dead App.css | `chore/remove-dead-app-css` | HIGH |
| 5 | Add Readonly to component props | `chore/readonly-component-props` | HIGH |
| 6 | Document Phase 9 in Todos.md | `docs/phase-9-todos` | HIGH |
| 7 | Component unit tests | `test/component-unit-tests` | MEDIUM |
| 8 | Integration tests | `test/integration-tests` | MEDIUM |
| 9 | E2E tests in CI | `feature/e2e-ci` | MEDIUM |

---

## TASK 1 — Fix CI Branch Triggers

**Files:** `.github/workflows/ci.yml`, `docs/DevOps-CICD.md`

Change `develop`/`main` → `master` in both files.

---

## TASK 2 — Update CLAUDE.md Project Structure

**File:** `CLAUDE.md`

Replace old project structure block with post-Phase-8 layout (shared/, EditModal, FilterBar, tests/).

---

## TASK 3 — Fix README Dev Port

**File:** `README.md`

Replace `localhost:3000` → `localhost:5173`.

---

## TASK 4 — Remove Dead App.css

**File:** `src/App.css` — delete (comment-only, not imported anywhere).

---

## TASK 5 — Add Readonly to Component Props

**Files:** All 5 components

Add `Readonly<>` wrapper to prop destructure parameters.

---

## TASK 6 — Document Phase 9 in Todos.md

**File:** `docs/Todos.md`

Append Phase 9 section with testing, CI/CD, and release tasks.

---

## TASK 7 — Component Unit Tests

**Files:** `tests/unit/components/*.test.tsx`, `vitest.config.ts`

Install: `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`

Add jsdom environment via `environmentMatchGlobs` in vitest config.

Write tests for: BudgetSummary, FilterBar, BudgetForm, BudgetItemList, EditModal.

---

## TASK 8 — Integration Tests

**File:** `tests/integration/budgetFlows.test.tsx`

7 integration tests covering add/delete/edit/filter/search flows through App.tsx.

---

## TASK 9 — E2E in CI

**File:** `.github/workflows/ci.yml`

Add `e2e` job with `needs: ci`, build + playwright run. Update Todos.md.
