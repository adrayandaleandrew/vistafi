# Active Context — Phase 12b: Core Budget Screens

## Context

Phase 12a (Expo Router migration + Supabase Auth + auth screens) is fully implemented and merged to master.
Phase 12b implements full CRUD budget screens on mobile using TDD (Red-Green-Refactor).

Branch: `feature/phase-12b-budget-screens`

---

## Tasks

| # | Task | Status |
|---|------|--------|
| 12.5 RED | Failing tests — Dashboard Screen (index.tsx) | complete |
| 12.5 GREEN | Dashboard Screen implementation | complete |
| 12.6 RED | Failing tests — Add Transaction Screen (add.tsx) | complete |
| 12.6 GREEN | Add Transaction Screen implementation | complete |
| 12.7 RED | Failing tests — History + Edit screens | complete |
| 12.7 GREEN | History + edit-transaction implementation | complete |

---

## Architecture

- `mobile/app/(tabs)/index.tsx` — Dashboard: summary cards + FlashList
- `mobile/app/(tabs)/add.tsx` — Add Transaction: form with validation
- `mobile/app/(tabs)/history.tsx` — History: filter + search + long-press
- `mobile/app/edit-transaction.tsx` — Edit modal: pre-filled form
- `mobile/src/components/TransactionItem.tsx` — React.memo list row (shared by Dashboard + History)
- Tests in `mobile/app/(tabs)/__tests__/` and `mobile/app/__tests__/`

## Key Rules Applied
- TDD iron law: failing test FIRST, no production code without failing test
- FlashList only (no FlatList/ScrollView for lists) — estimatedItemSize={72}
- React.memo on TransactionItem; useCallback on renderItem/keyExtractor
- StyleSheet.create only (no inline objects in list items)
- Ternary conditionals (not &&)
- 44pt touch targets; SafeAreaView on all screens
- Warm Ledger colors: Income #0D7040, Expense #C1281A, Savings #1E52BB
- Reanimated withSpring on submit buttons; expo-haptics on success
