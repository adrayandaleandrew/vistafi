# Active Context — Phase 16: Advanced Analytics (COMPLETE)

## Context

Phase 16 adds an Advanced Analytics panel to the web app, providing monthly trend visualisation,
savings rate metric, and top expenses breakdown. All 23 new tests pass (144 total).

Branch: `feature/phase-16-analytics`

---

## Tasks

| # | Task | Status |
|---|------|--------|
| A RED | 14 utility tests (calculateMonthlyTrends, calculateSavingsRate, getTopExpenses) | ✅ |
| A GREEN | `shared/types/budget.ts` — MonthlyTrend interface | ✅ |
| A GREEN | `shared/utils/budgetUtils.ts` — 3 new functions | ✅ |
| B RED | 7 component tests — analyticsPanel.test.tsx | ✅ |
| B GREEN | `src/components/AnalyticsPanel.tsx` | ✅ |
| C RED | 2 integration tests — Analytics toggle + savings rate | ✅ |
| C GREEN | `src/App.tsx` — showAnalytics state + toggle button + ternary render | ✅ |
| Docs | Update active-context.md, Todos.md, CLAUDE.md | ✅ |

---

## Architecture

### New Types
- `MonthlyTrend { month: string; totalIncome: number; totalExpenses: number; totalSavings: number; balance: number }`

### New Utility Functions
- `calculateMonthlyTrends(items, months=6): MonthlyTrend[]` — groups items by YYYY-MM, last N months ascending
- `calculateSavingsRate(summary): number` — (totalSavings / totalIncome) * 100, returns 0 when income=0
- `getTopExpenses(items, limit=5): BudgetItem[]` — expense items sorted by amount DESC

### New Files
- `src/components/AnalyticsPanel.tsx` — three-card analytics UI
  - Monthly Trend: 6-month grouped bar chart (income/expense bars per month)
  - Savings Rate: percentage with progress bar
  - Top Expenses: ranked list of expense items
- `tests/unit/components/analyticsPanel.test.tsx` — 7 component tests
- `tests/unit/budgetUtils.test.ts` — 14 new tests appended (A1–A14)

### Modified Files
- `shared/types/budget.ts` — add MonthlyTrend interface
- `shared/utils/budgetUtils.ts` — add 3 functions
- `tests/integration/budgetFlows.test.tsx` — add 2 tests (C1, C2)
- `src/App.tsx` — showAnalytics state, Analytics toggle button (`aria-label="Show analytics"` / `"Hide analytics"`), ternary panel switch

## Key Rules Applied
- TDD iron law: failing test FIRST (Red-Green-Refactor)
- Functional setState: `setShowAnalytics(curr => !curr)`
- Ternary conditionals (not &&): `{showAnalytics ? <AnalyticsPanel /> : <>...</>}`
- `Readonly` on AnalyticsPanelProps
- Dynamic bar heights via inline `style={{ height: '${pct}%' }}` (OK for dynamic values)
- `aria-label` on Analytics toggle button, `aria-pressed` for toggle state
- `role="img"` + `aria-label` on chart container
- All amounts `.toFixed(2)` with `className="num"`
- No console.log, no dangerouslySetInnerHTML, no new npm dependencies

## Test Counts
- Pre-Phase-16: 121 tests
- Phase 16 new: 23 tests (14 utility + 7 component + 2 integration)
- Total: 144 tests — all passing
