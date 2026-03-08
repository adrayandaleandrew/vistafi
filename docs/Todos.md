# Todos.md — VistaFi Software Specification & Task Plan

## Purpose

This document serves as:

- A development specification
- A task checklist
- An execution roadmap
- A source of truth for implementation

It is written for developers and AI agents.

All tasks must follow project markdown standards.

---

# GLOBAL MANDATORY RULES

## Rule 1 — Always Use Markdown Docs

Before ANY implementation:

- Review relevant markdown files
- Follow defined standards
- If conflict exists → update docs first

No exceptions.

---

## Rule 2 — Branch Before Work

Before any task:

1. Create branch
2. Then code

Format:

feature/<task-name>

---

## Rule 3 — Push After Task

After finishing:

- Commit
- Push branch
- Open PR (if applicable)

---

# PRODUCT OVERVIEW

## Product Name
VistaFi

## Product Type
Web-based personal budget planner.

## Target Users

- Individuals tracking personal income, expenses, and savings
- Anyone wanting a simple, no-signup budget tool

---

## Core Value Proposition

Provide:

- Quick transaction entry (income, expense, savings)
- Live budget summary (total income, expenses, savings, balance)
- Easy edit and delete of transactions

Without:

- Accounts or login
- Complex setup
- External dependencies

---

# SYSTEM COMPONENTS

1. React 19 web app (Vite + TypeScript + Tailwind v4)
2. Client-side state only (no backend, no database)
3. Testing suite
4. CI/CD pipeline

---

# PHASE 0 — FOUNDATION

## Objective

Establish stable project setup.

---

## Tasks

### Repo

- [x] Initialize Vite + React + TypeScript project
- [x] Add Tailwind CSS v4 via `@tailwindcss/vite` plugin
- [x] Add docs folder
- [x] Configure .gitignore
- [x] Create README

---

### App Setup

- [x] Define `BudgetItem`, `BudgetSummary`, `BudgetCategory` types (`src/types/budget.ts`)
- [x] Create `calculateBudgetSummary()` and `generateId()` utils (`src/utils/budgetUtils.ts`)
- [x] Add mock data seed (`src/data/mockData.ts`)
- [x] Wire `App.tsx` with initial state from mock data

---

## Done Criteria

- App runs locally with `npm run dev`
- Types, utils, and mock data in place

---

# PHASE 1 — CORE UI

## Objective

Render the full budget planner UI.

---

## Tasks

- [x] Build `BudgetSummary` component — 4-card summary (income, expenses, savings, balance)
- [x] Build `BudgetForm` component — form to add new transactions
- [x] Build `BudgetItemList` component — transaction list with delete button per row
- [x] Wire all components into `App.tsx`

---

## Done Criteria

- Summary cards display correct totals
- Form submits and adds a new transaction
- Transaction list renders all items

---

# PHASE 2 — DELETE TRANSACTION

## Objective

Allow users to remove transactions.

---

## Tasks

- [x] Add `handleDeleteItem` handler in `App.tsx`
- [x] Pass `onDeleteItem` prop to `BudgetItemList`
- [x] Render delete button per row and call `onDeleteItem`

---

## Done Criteria

- Clicking delete removes the item from the list
- Summary updates after deletion

---

# PHASE 3 — EDIT BUTTON (STUB)

## Objective

Wire up edit button per transaction row.

---

## Tasks

- [x] Add edit button to each row in `BudgetItemList`
- [x] Add `onEditItem` prop and `handleEditItem` handler
- [x] `handleEditItem` sets `itemToEdit` state in `App.tsx`

---

## Done Criteria

- Edit button exists on each row
- `itemToEdit` state is set on click (stub — no edit UI yet)

---

# PHASE 4 — EDIT TRANSACTION (OPEN)

## Objective

Implement actual edit functionality.

---

## Tasks

- [x] Decide on edit pattern (inline edit vs. modal vs. form pre-fill)
- [x] Populate `BudgetForm` with `itemToEdit` values when set
- [x] Update `handleEditItem` to replace the existing item instead of adding a new one
- [x] Add cancel/reset logic to clear `itemToEdit`
- [x] Remove placeholder `alert()` from `handleEditItem`

---

## Done Criteria

- User can click Edit → form pre-fills with item data
- Submitting the form updates the item in the list
- Summary reflects updated values
- Cancel clears the form back to add mode

---

# PHASE 5 — BUG FIXES & CLEANUP (OPEN)

## Objective

Fix known issues from post-Phase-3 review.

---

## Tasks

- [x] Fix `index.css` — remove leftover Vite scaffold styles (dark `:root` background) that conflict with Tailwind light theme
- [x] Update `index.html` title from "Vite + React + TS" to "VistaFi"

---

## Done Criteria

- App renders on a white/light background by default
- Browser tab shows "VistaFi"

---

# PHASE 6 — PERSISTENCE (OPEN)

## Objective

Preserve transactions across page refreshes.

---

## Tasks

- [x] Save `budgetItems` to `localStorage` on every change
- [x] Load `budgetItems` from `localStorage` on app init (fall back to mock data if empty)

---

## Done Criteria

- Transactions persist after browser refresh
- First-time load still shows mock data as a starting point

---

# PHASE 7 — FILTERING & SEARCH (OPEN)

## Objective

Let users find and filter transactions.

---

## Tasks

- [x] Add category filter (All / Income / Expense / Savings)
- [x] Add text search on description
- [x] Filter applied to `BudgetItemList` display only (does not affect summary totals)

---

## Done Criteria

- Selecting a category shows only matching items
- Typing in search field filters by description (case-insensitive)
- Summary always shows totals across all items

---

# PHASE 8 — TESTING (OPEN)

## Objective

Add automated test coverage.

---

## Tasks

### Unit

- [x] Test `calculateBudgetSummary()` — income, expense, savings totals, balance calculation
- [x] Test `generateId()` — returns unique strings

### E2E

- [x] Add transaction flow
- [x] Delete transaction flow
- [x] Edit transaction flow (after Phase 4 complete)

### CI

- [x] GitHub Actions pipeline (install → lint → unit tests → build)

---

## Done Criteria

- Unit tests pass
- E2E critical flows covered
- No test breaks on CI

---

# PHASE 9 — QUALITY & RELEASE

## Objective

Close remaining post-Phase-8 audit gaps: test coverage, CI completeness, and version release.

---

## Tasks

### Testing

- [ ] Add component unit tests — BudgetForm, BudgetItemList, BudgetSummary, FilterBar, EditModal
- [ ] Add integration tests — component interaction flows (add→list+summary, delete→list+summary, edit→list+summary)

### CI/CD

- [x] Add E2E tests to CI pipeline (requires preview server in CI)

### Release

- [ ] Version bump to 1.0.0 in package.json
- [ ] Production release checklist

---

## Done Criteria

- Test pyramid balanced: ~70% unit, ~20% integration, ~10% E2E
- E2E runs on every PR in CI
- Version tagged and release notes written

---

# NON-GOALS (FOR NOW)

- User accounts or authentication
- Backend or cloud sync
- Multi-currency support
- Budget categories beyond income / expense / savings
- Mobile app

---

# MVP SUCCESS CRITERIA

MVP is successful if:

- Transactions can be added, edited, and deleted
- Summary totals are always accurate
- Data persists across refreshes
- No critical bugs

---

# FINAL PRINCIPLE

Ship simple.
Ship stable.
Improve iteratively.

A working product beats a perfect plan.
