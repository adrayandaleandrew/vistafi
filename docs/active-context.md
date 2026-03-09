# Active Context — Phase 13: Sort, Date Picker & CSV Export

## Context

Phase 12c is complete and merged. Phase 13 addresses four backlog items from the web app:
- Sort transactions (newest-first default, 4 options)
- Date picker on Quick Add (replace hardcoded today's date)
- CSV export (client-side Blob download)
- Font refresh (DM Sans body, activate Playfair Display headings)

Branch: `feature/phase-13-sort-date-export`

---

## Tasks

| # | Task | Status |
|---|------|--------|
| 13.1 RED | Failing tests — Sort transactions (filterBar + integration) | in progress |
| 13.1 GREEN | Sort implementation (useBudget, FilterBar, App) | pending |
| 13.2 RED | Failing tests — Date picker (budgetForm.test.tsx) | pending |
| 13.2 GREEN | Date picker implementation (BudgetForm.tsx) | pending |
| 13.3 RED | Failing tests — CSV export (csvExport.test.ts) | pending |
| 13.3 GREEN | CSV export implementation (csvExport.ts + App.tsx) | pending |
| 13.4 | Font refresh — DM Sans + Playfair Display (no TDD) | pending |

---

## Architecture

- `shared/types/budget.ts` — add `SortOption` type
- `src/hooks/useBudget.ts` — add `sortBy` state + sort pipeline; expose `budgetItems`
- `src/components/FilterBar.tsx` — add `sortBy`/`onSortChange` required props + sort select
- `src/App.tsx` — pass sort props; add Export CSV button; apply display font to h1
- `src/components/BudgetForm.tsx` — add `date` state + date input; apply display font to h2
- `src/utils/csvExport.ts` — NEW: `generateCsv()` + `downloadCsv()`
- `tests/unit/csvExport.test.ts` — NEW: 5 unit tests
- `tests/unit/components/filterBar.test.tsx` — 6 existing renders updated + 5 new sort tests
- `tests/unit/components/budgetForm.test.tsx` — 4 new date picker tests
- `tests/integration/budgetFlows.test.tsx` — 2 new sort integration tests
- `index.html` — replace Inter with DM Sans
- `src/index.css` — update `--font-sans` + body font-family

## Key Rules Applied
- TDD iron law: failing test FIRST
- Functional setState (`curr => ...`)
- Ternary conditionals (not &&)
- Lazy useState init for date field
- 44px min-height on all interactive elements
- aria-labels on all controls
- cursor-pointer on all clickable elements
- Logic in hooks (sortBy state in useBudget, not FilterBar)
- Readonly TypeScript props interfaces
