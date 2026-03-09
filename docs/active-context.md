# Active Context — Phase 15: Mobile Goals

## Context

Phase 14 is complete and merged. Phase 15 brings the goals feature to the mobile app (Expo/React Native), reaching parity with the web goals feature introduced in Phase 14.

Branch: `feature/phase-15-mobile-goals`

---

## Tasks

| # | Task | Status |
|---|------|--------|
| 15.A RED | goalService tests (5 tests) | pending |
| 15.A GREEN | `mobile/src/services/goalService.ts` | pending |
| 15.B RED | useGoals hook tests (5 tests) | pending |
| 15.B GREEN | `mobile/src/hooks/useGoals.ts` | pending |
| 15.C RED | set-goals screen tests (5 tests) | pending |
| 15.C GREEN | `mobile/app/set-goals.tsx` | pending |
| 15.D RED | Dashboard goals tests (4 new tests) | pending |
| 15.D GREEN | Modify `mobile/app/(tabs)/index.tsx` | pending |
| 15.E | Register set-goals in `mobile/app/_layout.tsx` | pending |

---

## Architecture

### New Files
- `mobile/src/services/goalService.ts` — fetchGoals / upsertGoal / deleteGoal (Supabase)
- `mobile/src/services/__tests__/goalService.test.ts` — 5 service tests
- `mobile/src/hooks/useGoals.ts` — useGoals / useSetGoal / useDeleteGoal (React Query)
- `mobile/src/hooks/__tests__/useGoals.test.ts` — 5 hook tests
- `mobile/app/set-goals.tsx` — modal screen (3 text inputs, save/cancel)
- `mobile/app/__tests__/set-goals.test.tsx` — 5 screen tests

### Modified Files
- `mobile/app/(tabs)/index.tsx` — add Goals button + GoalProgress sub-component + per-category progress bars
- `mobile/app/(tabs)/__tests__/index.test.tsx` — add 4 new tests (tests 8–11)
- `mobile/app/_layout.tsx` — register `set-goals` as modal Stack.Screen

### Supabase Table
- Reuses `budget_goals` table from Phase 14 (same schema, same RLS)
- Mobile goalService maps `target_amount` → `targetAmount` same as web

## Key Rules Applied
- TDD iron law: failing test FIRST
- Functional setState (`curr => ...`)
- Ternary conditionals (not &&)
- All interactive elements minHeight: 44
- useCallback on all callbacks
- React.memo on GoalProgress sub-component
- No console.log, no inline styles, no TouchableOpacity
- StyleSheet.create only — Warm Ledger tokens
