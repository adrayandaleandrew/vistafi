# Active Context — Phase 11: Backend + Authentication (Web)

## Context

Phases 1–10 complete and released as v1.0.0. Phase 11 introduces Supabase Auth for user
authentication and Supabase PostgreSQL for cloud data persistence. Replaces `localStorage`
inside `useBudget.ts` with typed service calls. All existing web UI components, design tokens,
and layout remain completely unchanged.

Branch: `feature/phase-11-auth`

---

## Tasks (in order)

| # | Task | Status |
|---|------|--------|
| 11.1 | Supabase client setup (`src/lib/supabase.ts`) | pending |
| 11.2 | Supabase PostgreSQL schema (`budget_items` table) | complete (done in SQL editor) |
| 11.3 | Row Level Security (RLS with `auth.uid()`) | complete (done in SQL editor) |
| 11.4 | Data service (`src/services/budgetService.ts`) — TDD | pending |
| 11.5 | AuthContext (`src/context/AuthContext.tsx`) — TDD | pending |
| 11.6 | Web auth screens (LoginForm, SignupForm, LoginPage, SignupPage) — TDD | pending |
| 11.7 | Migrate `useBudget.ts` — replace localStorage with service calls | pending |
| 11.8 | Session persistence + route protection in `App.tsx` | pending |
| 11.9 | Error handling | pending |

---

## Key Decisions

- Supabase Auth (not Better Auth) — client-side only, no separate server
- `service_role` key NEVER used client-side
- `budget_items.user_id` references `auth.users(id)` ON DELETE CASCADE
- RLS policies use `auth.uid()` — no manual userId in service calls for SELECT/UPDATE/DELETE
- `addItem` fetches current user via `supabase.auth.getUser()` to provide `user_id` for INSERT
- `useBudget` only mounts when user is authenticated — service always has an active session
- Auth routing: local `authView` state in `App.tsx` (`'login' | 'signup'`)
- Display font: Playfair Display for auth screen headings (distinctive pairing with Inter body)
- Integration tests: mock `AuthContext` + mock service functions
