# Active Context — fix/mobile-core-bugs: Mobile Core Bugs

## Context

Three bugs found in the installed APK that need fixing:
1. **Add Transaction silently fails** — `budgetService.ts` inserts without `user_id`; Supabase RLS rejects it
2. **Bottom nav icons broken** — `_layout.tsx` has no `tabBarIcon` definitions; Expo renders placeholder boxes
3. **Biometrics toggle non-functional** — `login.tsx` never reads the pref or calls `LocalAuthentication.authenticate()`

Branch: `fix/mobile-core-bugs`

---

## Tasks

| # | Task | Status |
|---|------|--------|
| 1 | Update `docs/active-context.md` | ✅ |
| 2 | Bug 1 — `budgetService.ts` + `useBudgetMutations.ts` | ✅ |
| 3 | Bug 2 — `(tabs)/_layout.tsx` icons | ✅ |
| 4 | Bug 3 — `login.tsx` biometrics | ✅ |
| 5 | Update affected tests | ✅ |
| 6 | Compliance check + commit + push | ⬜ |

---

## Files Changed

- `mobile/src/services/budgetService.ts` — `addItem` now accepts `userId` param, includes it in insert
- `mobile/src/hooks/useBudgetMutations.ts` — `useAddItem` injects `userId` into `mutationFn`
- `mobile/app/(tabs)/_layout.tsx` — full replacement with Ionicons tab icons
- `mobile/app/(auth)/login.tsx` — biometrics flow: reads pref, triggers auth on mount, conditional JSX
- `mobile/src/hooks/__tests__/useBudgetMutations.test.ts` — Test 1 assertion updated for new signature
- `mobile/app/(auth)/__tests__/login.test.tsx` — 3 new mocks + 4 new biometric tests
