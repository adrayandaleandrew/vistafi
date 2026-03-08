# Active Context — Phase 12 Planning (chore/phase-12-planning)

## Context

Phase 11 (Supabase Auth + cloud persistence) is fully implemented and merged to master.
This chore branch closes all Phase 11 checkboxes in `docs/Todos.md`, restructures the
monolithic Phase 12 spec into three independently deliverable sub-phases (12a / 12b / 12c),
and corrects all Better Auth references to Supabase Auth throughout Phase 12.

Branch: `chore/phase-12-planning`

---

## Tasks

| # | Task | Status |
|---|------|--------|
| 1 | Check all Phase 11 `[ ]` → `[x]` in `docs/Todos.md` | complete |
| 2 | Replace Phase 12 monolith with sub-phases 12a / 12b / 12c in `docs/Todos.md` | complete |
| 3 | Update `CLAUDE.md` Open TODOs: "Phases 1–10" → "Phases 1–11" | complete |
| 4 | Update `docs/active-context.md` with this plan | complete |

---

## Key Decisions

- Phase 12 split into three independently deliverable sub-phases:
  - **12a** — Mobile Foundation & Auth (Tasks 12.1–12.4): Expo Router + Supabase Auth on simulators
  - **12b** — Core Budget Screens (Tasks 12.5–12.7): Full CRUD on mobile
  - **12c** — Polish, Realtime & Release (Tasks 12.8–12.11): EAS build, Realtime sync, perf targets
- All Better Auth references removed — Phase 12 uses Supabase Auth (`@supabase/supabase-js`) throughout
- Mobile session storage: `@supabase/supabase-js` with AsyncStorage adapter (standard RN pattern)
  — replaces the original spec's "SecureStore only, never AsyncStorage" for auth tokens
- Mobile env vars: `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  — replaces `EXPO_PUBLIC_API_URL` / `BETTER_AUTH_URL`
- No production code changed — docs-only branch
