# Active Context — Phase 14: Budget Goals + Mobile Viewport E2E

## Context

Phase 13 is complete and merged. Phase 14 delivers two backlog items:
1. Budget goals — per-category monthly targets with progress bars in BudgetSummary
2. Mobile viewport E2E — 4 Playwright tests at Pixel 5 viewport

Branch: `feature/phase-14-budget-goals-mobile-e2e`

---

## Tasks

| # | Task | Status |
|---|------|--------|
| 14.1a RED | Failing tests — calculateCurrentMonthSummary (budgetUtils.test.ts, 3 new tests) | pending |
| 14.1b RED | Failing tests — goalService (tests/unit/services/goalService.test.ts, 5 new tests) | pending |
| 14.1c RED | Failing tests — BudgetSummary with goals/progress props (4 new + update 6 existing) | pending |
| 14.1d RED | Failing tests — GoalModal component (5 new tests) | pending |
| 14.1a GREEN | calculateCurrentMonthSummary in shared/utils/budgetUtils.ts | pending |
| 14.1a GREEN | BudgetGoal type in shared/types/budget.ts | pending |
| 14.1b GREEN | src/services/goalService.ts | pending |
| 14.1c GREEN | Update src/components/BudgetSummary.tsx (goals + progress bars) | pending |
| 14.1d GREEN | Create src/components/GoalModal.tsx | pending |
| 14.1e GREEN | Create src/hooks/useGoals.ts | pending |
| 14.1e GREEN | Create src/lib/migrations/002_budget_goals.sql | pending |
| 14.1e GREEN | Update src/App.tsx (Goals button + GoalModal + useGoals) | pending |
| 14.2 | Mobile viewport E2E (playwright.config.ts + tests/e2e/mobile.spec.ts) | pending |

---

## Architecture

### New Files
- `src/services/goalService.ts` — fetchGoals / upsertGoal / deleteGoal (Supabase)
- `src/hooks/useGoals.ts` — goals state, handleSetGoal, handleDeleteGoal
- `src/components/GoalModal.tsx` — 3-input modal (income/expense/savings targets)
- `src/lib/migrations/002_budget_goals.sql` — budget_goals table + RLS
- `tests/unit/services/goalService.test.ts` — 5 service tests
- `tests/unit/components/goalModal.test.tsx` — 5 component tests
- `tests/e2e/mobile.spec.ts` — 4 Playwright mobile viewport tests

### Modified Files
- `shared/types/budget.ts` — add BudgetGoal interface
- `shared/utils/budgetUtils.ts` — add calculateCurrentMonthSummary()
- `src/components/BudgetSummary.tsx` — add goals + currentMonthSummary props + progress bars
- `src/App.tsx` — add Goals button, GoalModal, useGoals, calculateCurrentMonthSummary
- `tests/unit/budgetUtils.test.ts` — 3 new calculateCurrentMonthSummary tests
- `tests/unit/components/budgetSummary.test.tsx` — update 6 + add 4 tests
- `playwright.config.ts` — add mobile-chrome project

### Supabase Table
```sql
budget_goals (id, user_id, category, target_amount, created_at)
unique(user_id, category) — upsert on conflict
RLS: auth.uid() = user_id
```

## Key Rules Applied
- TDD iron law: failing test FIRST
- Functional setState (`curr => ...`)
- Ternary conditionals (not &&)
- Progress bars: role="progressbar", aria-label, aria-valuenow, aria-valuemin={0}, aria-valuemax={100}
- 44px min-height on all interactive elements
- aria-labels on all controls
- Readonly TypeScript props interfaces
- No console.log anywhere
