# Active Context — Phase 12c: Polish, Realtime & Release

## Context

Phase 12b (Dashboard, Add, History, Edit screens) is merged to master. Phase 12c is the final
mobile phase: Profile screen, Supabase Realtime sync, performance validation, EAS build config,
and a mobile CI workflow.

Branch: `feature/phase-12c-polish-realtime-release`

---

## Tasks

| # | Task | Status |
|---|------|--------|
| 12.8 RED | Failing tests — Profile Screen (profile.tsx) | complete |
| 12.8 GREEN | Profile Screen implementation | complete |
| 12.9 RED | Failing tests — Realtime subscription (useBudgetItems.ts) | complete |
| 12.9 GREEN | useBudgetItems Realtime implementation | complete |
| 12.10 | Performance audit (static checks + npm audit) | complete |
| 12.11 | EAS build config + mobile CI workflow | complete |

---

## Architecture

- `mobile/app/(tabs)/profile.tsx` — Profile screen: email display, sign out, biometrics toggle
- `mobile/app/(tabs)/__tests__/profile.test.tsx` — 7 tests for profile screen
- `mobile/src/hooks/useBudgetItems.ts` — adds Realtime channel subscription + cleanup
- `mobile/src/hooks/__tests__/useBudgetItems.test.ts` — 3 existing + 5 new Realtime tests
- `mobile/eas.json` — EAS build config (development/preview/production)
- `.github/workflows/mobile-ci.yml` — type-check + unit tests on push/PR

## Key Rules Applied
- TDD iron law: failing test FIRST, no production code without failing test
- Ternary conditionals (not &&)
- StyleSheet.create only (no inline objects)
- 44pt touch targets; SafeAreaView on all screens
- Warm Ledger colors
- expo-haptics impactAsync(Light) on sign out
- LocalAuthentication.hasHardwareAsync() guards biometrics toggle
- No credentials in source code (biometric pref → AsyncStorage, not SecureStore)
- All secrets injected via GitHub Actions secrets only
