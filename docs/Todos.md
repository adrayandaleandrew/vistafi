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

- [x] Add component unit tests — BudgetForm, BudgetItemList, BudgetSummary, FilterBar, EditModal
- [x] Add integration tests — component interaction flows (add→list+summary, delete→list+summary, edit→list+summary)

### CI/CD

- [x] Add E2E tests to CI pipeline (requires preview server in CI)

### Release

- [x] Version bump to 1.0.0 in package.json
- [x] Production release checklist

---

## Done Criteria

- Test pyramid balanced: ~70% unit, ~20% integration, ~10% E2E
- E2E runs on every PR in CI
- Version tagged and release notes written

---

# NON-GOALS (FOR NOW)

- Multi-currency support
- Budget categories beyond income / expense / savings
- App Store / Google Play store submission (EAS build in scope; store submission is a future phase)
- Push notifications (beyond Phase 12 optional scope)

---

# PHASE 10 — ARCHITECTURE & AUDIT (COMPLETE)

Phases 1–10 merged and released as v1.0.0. See git history for full audit trail.

---

# PHASE 11 — BACKEND + AUTHENTICATION (WEB)

## Objective

Introduce Supabase Auth for user authentication and Supabase PostgreSQL for cloud data persistence.
Replace `localStorage` inside `useBudget.ts` with typed service calls. All existing web UI
components, design tokens, and layout remain completely unchanged.

---

## Architecture

| Layer | Technology |
|-------|-----------|
| Authentication | Supabase Auth (`@supabase/supabase-js`) |
| Database | Supabase PostgreSQL |

Supabase Auth handles sign-up, sign-in, sessions, and JWTs entirely client-side — no separate
server needed. Budget data lives in the `budget_items` table in the same Supabase project.
RLS policies on `budget_items` use `auth.uid()` (Supabase's native JWT claim) so the database
automatically scopes every query to the signed-in user.

---

## User Stories

- As a new user, I want to sign up with email and password so my data is permanently stored in the cloud
- As a returning user, I want to log in and see my transactions exactly as I left them on any browser
- As a logged-in user, I want transactions auto-saved when I add, edit, or delete — no manual save
- As a user, I want to log out so my data stays private on shared devices
- As a user, I want clear error messages when login fails so I can correct my credentials
- As a user, I want my session to survive browser refresh without logging in again

---

## Tasks

### 11.1 — Supabase Client Setup

- [x] Install `@supabase/supabase-js`
- [x] Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` (anon key is safe to expose client-side — RLS enforces all access control)
- [x] Create `src/lib/supabase.ts` — Supabase client singleton (`createClient(url, anonKey)`)
- [x] Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as GitHub Actions secrets in CI
- [x] Add `.env.local` to `.gitignore` (verify — must never be committed)

### 11.2 — Supabase PostgreSQL Schema

- [x] Create `budget_items` table in Supabase SQL editor: `id` (uuid PK, `gen_random_uuid()`), `user_id` (uuid NOT NULL, references `auth.users(id)` ON DELETE CASCADE), `description` (text NOT NULL), `amount` (numeric(12,2) NOT NULL CHECK (amount > 0)), `category` (text NOT NULL CHECK (category IN ('income','expense','savings'))), `date` (date NOT NULL), `created_at` (timestamptz DEFAULT now())
- [x] Add index on `budget_items(user_id)` for query performance
- [x] Add index on `budget_items(user_id, date DESC)` for ordered list fetches
- [x] Write migration SQL file (version-controlled in `src/lib/migrations/`)

### 11.3 — Row Level Security

- [x] Enable RLS on `budget_items` table
- [x] RLS policy SELECT: `user_id = auth.uid()`
- [x] RLS policy INSERT: `user_id = auth.uid()`
- [x] RLS policy UPDATE: `user_id = auth.uid()`
- [x] RLS policy DELETE: `user_id = auth.uid()`
- [x] Verify zero cross-user access in Supabase SQL editor (query as different user, expect 0 rows)

### 11.4 — Data Service

> TDD: write failing unit tests for each function BEFORE writing implementation.

- [x] Create `src/services/budgetService.ts`:
  - `fetchItems(): Promise<BudgetItem[]>` — Supabase `select` (RLS auto-scopes to signed-in user)
  - `addItem(item: Omit<BudgetItem, 'id'>): Promise<BudgetItem>` — Supabase `insert`
  - `updateItem(id: string, changes: Partial<BudgetItem>): Promise<BudgetItem>` — Supabase `update`
  - `deleteItem(id: string): Promise<void>` — Supabase `delete`
- [x] All functions use the shared Supabase client from `src/lib/supabase.ts` (no manual userId arg — RLS uses `auth.uid()` automatically)
- [x] All functions throw typed errors on failure
- [x] Write unit tests with Supabase client mocked

### 11.5 — Supabase AuthContext (Web)

> TDD: write failing tests before implementing.

- [x] Create `src/context/AuthContext.tsx`:
  - On mount: `supabase.auth.getSession()` to restore session from localStorage (Supabase handles this automatically)
  - `supabase.auth.onAuthStateChange` listener to keep `user` state in sync
  - `signIn`: calls `supabase.auth.signInWithPassword({ email, password })`
  - `signUp`: calls `supabase.auth.signUp({ email, password })`
  - `signOut`: calls `supabase.auth.signOut()`
  - `isLoading`: true while initial session is resolving
  - `error`: typed `AuthError | null` from Supabase responses
- [x] Wrap `src/main.tsx` with `<AuthProvider>`
- [x] Unit tests: sign in success sets user; sign in failure sets error; sign out clears user; session restored on mount

### 11.6 — Web Auth Screens

> TDD: write failing component tests BEFORE building screens.
>
> `frontend-design` skill: auth screens must have a **distinctive design direction** — not generic SaaS.
> Choose a clear aesthetic (e.g., refined editorial, warm minimal, or bold contrast) that extends
> the Warm Ledger palette. Do NOT use Inter as the display font for headings (use a characterful
> pairing). Auth screens are the first impression — make them memorable.

- [x] Create `src/components/auth/LoginForm.tsx` (Readonly props interface):
  - Email + password controlled inputs
  - Inline error from `AuthContext.error`
  - 44px min-height on all interactive elements (`ui-ux-pro-max`)
  - Visible focus rings on all inputs and buttons (`focus-visible:ring-2 focus-visible:ring-ink`)
  - "Create account" link
  - Validation: email format + password min 8 chars at form boundary
- [x] Create `src/components/auth/SignupForm.tsx` (Readonly props):
  - Email, password, confirm password — all controlled
  - Passwords-match validation
  - "Already have an account?" link
- [x] Create `src/pages/LoginPage.tsx` and `src/pages/SignupPage.tsx`:
  - Distinctive typographic treatment (display font + body font pairing)
  - Warm Ledger tokens used throughout
  - VistaFi branding element
- [x] Wire routing: conditional render in `App.tsx` based on `AuthContext.user` (no external router needed unless already added)
- [x] Logic in hooks — no business logic directly in page components (`react-components` rule)

### 11.7 — Migrate `useBudget.ts`

> TDD: update existing useBudget tests to expect service calls BEFORE modifying the hook.

- [x] Replace lazy `useState` from localStorage with async `fetchItems(userId)` call in `useEffect` on mount
- [x] Replace `handleAddItem` localStorage write with `addItem()` service call
- [x] Replace `handleSaveEdit` with `updateItem()` service call
- [x] Replace `handleDeleteItem` with `deleteItem()` service call
- [x] Remove localStorage `useEffect` sync entirely
- [x] Use `Promise.all` where multiple independent fetches are needed (`vercel-react-best-practices`: eliminate waterfalls)
- [x] All `setBudgetItems` calls use functional form `curr => ...` (`rerender-functional-setstate`)
- [x] Add `isLoading: boolean` and `dataError: string | null` to hook return
- [x] New users start with empty list — no mockData fallback for authenticated users

### 11.8 — Session Persistence + Route Protection

- [x] Loading state: show neutral spinner while `AuthContext.isLoading` is true (no auth UI flash)
- [x] Unauthenticated: render `<LoginPage />` instead of main app
- [x] Authenticated on auth page: redirect to main app
- [x] Sign out: clear query state, re-render to login screen
- [x] Session survives browser refresh (Supabase Auth persists session to localStorage automatically)

### 11.9 — Error Handling

- [x] Network error on fetch: "Could not load transactions. Check your connection."
- [x] Wrong credentials: "Incorrect email or password."
- [x] Email not verified: "Please verify your email before signing in."
- [x] Email already in use: "An account with this email already exists."
- [x] Mutation error: non-blocking banner; no optimistic removal until confirmed
- [x] All error strings are user-facing — never raw exception messages

---

## Security Requirements (Phase 11)

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` never committed to git (`.env.local` in `.gitignore`)
- Anon key is safe client-side — RLS is the security boundary, not the key
- **Never use the Supabase `service_role` key client-side** — it bypasses RLS entirely
- RLS enabled on `budget_items` — zero cross-user access via `auth.uid()`
- All inputs validated at form boundary before any service call
- Password minimum 8 characters (enforced client-side; Supabase Auth enforces server-side)
- No `console.log` of tokens, user IDs, passwords, or session data
- CI secrets inject env vars — no hardcoded values in workflow files
- Staging and production use separate Supabase projects

---

## Testing (Phase 11)

> Iron Law: failing test first. Every function, every component.

- Unit: `budgetService` functions (Supabase client mocked); `AuthContext` sign-in/up/out/restore; `LoginForm` render/validation/submit/error; `SignupForm` passwords-match; `useBudget` calls service on mount
- Integration: login flow → data loads → app renders; add/edit/delete transaction persists; session survives mock refresh
- E2E: sign up → empty dashboard; log in → see transactions; log out → login screen; refresh → session restored; add transaction → persists after refresh; wrong password → inline error

---

## Acceptance Criteria (Phase 11)

1. New user can sign up and reach the main budget planner
2. Returning user sees their previously saved transactions on login
3. All transactions stored in Supabase PostgreSQL (not localStorage)
4. Session persists across browser refresh without re-login
5. Sign out returns to login screen
6. No user can see another user's transactions (RLS enforced)
7. Auth screens have a distinctive, memorable design — not generic SaaS
8. All existing web UI components, colors, and layout are visually identical to pre-Phase-11
9. CI pipeline passes with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` injected as secrets; no env values in repository

---

# PHASE 12a — MOBILE FOUNDATION & AUTH

## Objective

Working Expo Router app with Supabase Auth on iOS and Android simulators.
Reuses `shared/` types and utils. Replaces the stub scaffold in `mobile/` with Expo Router,
production deps, and fully functional auth flow using the same Supabase project as the web app.

---

## User Stories

- As a mobile user, I want to log in with the same credentials as the web so I have one account everywhere
- As a mobile user, I want my session to persist across app restarts so I don't re-login every time
- As a mobile user, I want route protection so I can't reach the budget screens without signing in

---

## Tasks

### 12.1 — Expo Router Migration

- [ ] Remove legacy scaffold: `mobile/App.tsx`, `mobile/src/navigation/AppNavigator.tsx`
- [ ] Install Expo Router + deps: `expo-router`, `expo-status-bar`, `react-native-safe-area-context`, `react-native-screens`
- [ ] Install auth + storage: `@supabase/supabase-js`, `@react-native-async-storage/async-storage`, `expo-secure-store`
- [ ] Install offline + data: `@tanstack/react-query`, `@tanstack/react-query-persist-client`, `@tanstack/query-async-storage-persister`, `@react-native-community/netinfo`
- [ ] Install UI/animation: `@shopify/flash-list`, `react-native-reanimated`, `react-native-gesture-handler`, `expo-haptics`, `expo-local-authentication` (optional biometrics)
- [ ] Update `mobile/app.json`: `"main": "expo-router/entry"`, add `"scheme": "vistafi"`
- [ ] Create `mobile/app/_layout.tsx` — root layout wrapping `<QueryProvider>`, `<AuthProvider>`, `<Stack>`
- [ ] Create `mobile/app/(auth)/_layout.tsx` — stack for login/signup screens
- [ ] Create `mobile/app/(tabs)/_layout.tsx` — bottom tab navigator with **native tabs** (not JS navigator — `vercel-react-native-skills` rule)
- [ ] Add `@shared` path alias to `mobile/tsconfig.json` and `mobile/metro.config.js`
- [ ] Verify `expo start` resolves all routes

### 12.2 — Mobile AuthProvider (TDD)

> TDD: write failing tests before implementing.

- [ ] Create `mobile/src/lib/supabase.ts` — Supabase singleton with AsyncStorage session adapter
- [ ] Create `mobile/src/providers/AuthProvider.tsx`:
  - On mount: `supabase.auth.getSession()` to restore persisted session
  - `supabase.auth.onAuthStateChange` listener to keep `user` state in sync
  - `signIn`: `supabase.auth.signInWithPassword({ email, password })`
  - `signUp`: `supabase.auth.signUp({ email, password })`
  - `signOut`: `supabase.auth.signOut()`
  - Route protection via `useSegments` + `useRouter`
  - Exports `useAuth()` hook

### 12.3 — React Query + Offline Provider (TDD)

> TDD: write failing tests for hooks before implementing.

- [ ] Create `mobile/src/providers/QueryProvider.tsx`:
  - `QueryClient`: `gcTime: 86400000`, `staleTime: 300000`, `networkMode: 'offlineFirst'`
  - `createAsyncStoragePersister` with `AsyncStorage`, key `'VISTAFI_QUERY_CACHE'`
  - `PersistQueryClientProvider` wrapping children
  - `NetInfo.addEventListener` → `onlineManager.setEventListener`
- [ ] Create `mobile/src/hooks/useBudgetItems.ts`:
  - `useQuery(['budgetItems', userId])` → calls `budgetService.fetchItems` (reused from `shared/`)
  - Ternary for loading/error/data states (not `&&` — `vercel-react-native-skills` rule)
- [ ] Create `mobile/src/hooks/useBudgetMutations.ts`:
  - `useAddItem`, `useUpdateItem`, `useDeleteItem` — each with optimistic updates via `onMutate`
  - All rollback on error; all `queryClient.invalidateQueries` on settle
  - All use `useCallback` for stable references

### 12.4 — Mobile Auth Screens (TDD)

> TDD: write failing tests before implementing.

- [ ] Create `mobile/app/(auth)/login.tsx`:
  - Controlled `TextInput` for email (`keyboardType="email-address"`), password (`secureTextEntry`)
  - All styles in `StyleSheet.create` (no inline objects)
  - 44pt touch targets on all interactive elements (`react-native-design` rule)
  - `Pressable` not `TouchableOpacity` (`vercel-react-native-skills` rule)
  - Reanimated 3 `withSpring(0.95)` on press-in, `withSpring(1)` on press-out for submit button
  - `expo-haptics` light on successful sign-in
  - Inline error when `useAuth().error` is set
  - `SafeAreaView` wrapping the screen
- [ ] Create `mobile/app/(auth)/signup.tsx` — same patterns; passwords-match validation

---

## Security Requirements (Phase 12a)

- `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `mobile/.env` — not committed to git
- `mobile/.env` in `.gitignore`
- Supabase session tokens managed by `@supabase/supabase-js` with AsyncStorage adapter (standard RN pattern)
- Never use the Supabase `service_role` key in mobile — same rule as web
- No cross-user data access — same RLS policies from Phase 11 cover mobile API calls
- No `console.log` of tokens, user IDs, or sensitive data
- No hardcoded credentials in `mobile/` source

---

## Testing (Phase 12a)

> TDD iron law applies to every task in 12.2–12.4.

- Unit: `AuthProvider` (getSession on mount, onAuthStateChange, signIn/signUp/signOut, route protection); `useBudgetItems` (fetch, offline cache); `useAddItem`/`useDeleteItem`/`useUpdateItem` (optimistic update + rollback); login/signup screens (render, submit, validation, error)
- Integration: auth flow → session persists → route protection → app renders

---

## Done Criteria (Phase 12a)

1. Login/signup works on iOS Simulator and Android Emulator using same Supabase credentials as web
2. Session persists across app restarts (AsyncStorage adapter)
3. Route protection redirects unauthenticated users to login screen
4. `expo start` resolves all routes without errors

---

# PHASE 12b — CORE BUDGET SCREENS

## Objective

Full CRUD for transactions on mobile. All screens share the same Supabase PostgreSQL backend
as the web app.

---

## User Stories

- As a mobile user, I want to see my current balance and transaction history the moment I open the app
- As a mobile user, I want to add a transaction with a few taps — logging feels frictionless
- As a mobile user, I want to edit or delete transactions from a list with native gestures
- As a mobile user, I want my data available offline so I can review my history without internet

---

## Tasks

### 12.5 — Dashboard Screen (Home Tab) (TDD)

> TDD: write failing tests before implementing.

- [x] Create `mobile/app/(tabs)/index.tsx`:
  - Summary cards: Balance, Income, Expenses, Savings — uses `calculateBudgetSummary()` from `shared/utils/budgetUtils.ts`
  - Amounts formatted as `$0.00` with `fontVariant: ['tabular-nums']` in StyleSheet
  - Colors from Warm Ledger: Income `#0D7040`, Expense `#C1281A`, Savings `#1E52BB`
  - `FlashList` for transaction list — `estimatedItemSize={72}` (CRITICAL — no FlatList or ScrollView)
  - `TransactionItem` extracted as separate component, wrapped in `React.memo`
  - `TransactionItem` uses `StyleSheet.create` only (no inline objects in list item)
  - `useCallback` on `renderItem` and `keyExtractor`
  - `Platform.select` for iOS shadow vs Android elevation on cards
  - Pull-to-refresh via `onRefresh` + `refreshing` props on FlashList
  - Empty state: ternary render — "No transactions yet. Add your first one." (not `&&`)
  - `SafeAreaView` or `useSafeAreaInsets` on all screens
  - All animations use only `transform` and `opacity` (GPU properties rule)

### 12.6 — Add Transaction Screen (Add Tab) (TDD)

> TDD: write failing tests before implementing.

- [x] Create `mobile/app/(tabs)/add.tsx`:
  - Description: controlled `TextInput`
  - Amount: controlled `TextInput` (`keyboardType="decimal-pad"`)
  - Category: segmented control with three `Pressable` items (Income / Expense / Savings)
  - Date input (ISO date string, defaults to today)
  - Submit `Pressable` with Reanimated `withSpring` press animation
  - `expo-haptics.notificationAsync(Success)` on successful add
  - Validation: description non-empty, amount > 0, category valid (same rules as web)
  - On success: `router.replace('/(tabs)')` to Dashboard
  - All styles in `StyleSheet.create`

### 12.7 — History + Edit (History Tab) (TDD)

- [x] Create `mobile/app/(tabs)/history.tsx`:
  - Category filter pills (All / Income / Expense / Savings) as `Pressable` row
  - Text search input (controlled, filters description case-insensitive)
  - `FlashList` for virtualized list
  - Long-press on transaction row → native action sheet with "Edit" and "Delete" options
  - "Edit" → push to `mobile/app/edit-transaction.tsx` (modal presentation)
  - "Delete" → calls `useDeleteItem` with `expo-haptics` medium feedback
- [x] Create `mobile/app/edit-transaction.tsx` — modal screen:
  - Pre-fills all fields from selected `BudgetItem`
  - Same validation as Add screen
  - On save: `useUpdateItem`, `expo-haptics` success, dismiss modal
  - On cancel: dismiss without saving

---

## Testing (Phase 12b)

> TDD iron law applies to every task in 12.5–12.7.

- Unit: all screens (render, submit, validation, error states, empty state); `TransactionItem` (render, memo)
- Integration: add transaction → optimistic update → server confirm; offline add → reconnect → sync

---

## Done Criteria (Phase 12b)

1. Authenticated user can view, add, edit, and delete transactions on mobile
2. FlashList used for every transaction list — no FlatList or ScrollView wrapping lists
3. Offline: cached transactions visible when network is unavailable
4. All interactive elements meet 44pt minimum touch target

---

# PHASE 12c — POLISH, REALTIME & RELEASE

## Objective

Production-ready mobile app with realtime sync, performance targets met, and EAS build.

---

## User Stories

- As a mobile user, I want offline changes to sync automatically when I reconnect
- As a mobile user, I want changes made on the web to appear on my phone in real time
- As a mobile user, I want haptic feedback when actions complete so the app feels polished

---

## Tasks

### 12.8 — Profile Screen (Profile Tab) (TDD)

- [x] Create `mobile/app/(tabs)/profile.tsx`:
  - Display current user email
  - Sign out `Pressable` — `useAuth().signOut()`, `expo-haptics` light, redirect to `/(auth)/login`
  - Optional biometrics: check `expo-local-authentication` hardware availability; if available, show "Enable Face ID / Fingerprint" toggle; store preference in `AsyncStorage` (preference is not a secret)

### 12.9 — Supabase Realtime Sync

- [x] In `useBudgetItems.ts`: subscribe to Supabase Realtime channel on `budget_items` for current user's rows (INSERT, UPDATE, DELETE events)
- [x] On event: `queryClient.invalidateQueries(['budgetItems', userId])`
- [x] Unsubscribe on unmount via `useEffect` cleanup
- [x] Integration test: mock Realtime event fires → query invalidated → list reflects new state

### 12.10 — Performance Validation

> Per `react-native-best-practices`: Measure → Optimize → Re-measure before releasing.

- [x] Confirm FlashList used for every transaction list (no FlatList anywhere) — ✅ index.tsx + history.tsx
- [x] Confirm `React.memo` on `TransactionItem` — ✅ confirmed
- [x] Confirm `useCallback` on `renderItem` and all callbacks passed to FlashList — ✅ confirmed
- [x] Confirm no inline style objects in list items — ✅ TransactionItem uses StyleSheet.create only
- [x] Confirm no barrel imports from `shared/` (import directly from source files) — ✅ confirmed
- [x] Run `npm audit` in `mobile/` — 9 vulns (5 low, 4 high) in transitive deps of expo/@expo/cli/cacache/tar; pre-existing, not in app code; documented and accepted
- Note: FPS/TTI/bundle size require a connected device/simulator — to be validated during EAS preview build testing

### 12.11 — EAS Build + Mobile CI

- [x] Create `mobile/eas.json`:
  - `development`: `developmentClient: true`, iOS simulator enabled
  - `preview`: `distribution: 'internal'`, Android APK
  - `production`: `autoIncrement: true`
- [x] Add `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` as GitHub Actions secrets (instructions in PR)
- [x] Create `.github/workflows/mobile-ci.yml`: type-check + unit tests; EAS build step requires user to run `eas init` + add `EAS_TOKEN` secret first
- [x] Add `type-check` and `test:ci` scripts to `mobile/package.json`
- [x] Confirm existing `ci.yml` (web) is unaffected — ✅ uses root `npm ci`, no `working-directory`, unaffected

---

## Security Requirements (Phase 12c)

- All security rules from Phase 12a apply
- Biometrics is opt-in — app fully functional without it
- No `console.log` of tokens, user IDs, or sensitive data
- EAS secrets injected via GitHub Actions secrets — no hardcoded values in workflow files

---

## Testing (Phase 12c)

> TDD iron law applies to 12.8–12.9.

- Unit: `ProfileScreen` (email display, sign out, biometrics toggle); Realtime subscription (subscribe on mount, invalidate on event, unsubscribe on unmount)
- Integration: Realtime event → list update; sign out → redirect to login
- E2E (Detox or Maestro): sign up → empty Dashboard; login → see transactions; add → appears in list; delete → removed; edit → updated; logout → login screen; offline → cached data visible

---

## Done Criteria (Phase 12c)

1. EAS preview build produces installable APK/IPA
2. Adding transaction on mobile appears on web within 5 seconds (Realtime)
3. Adding transaction on web appears on mobile within 5 seconds (Realtime)
4. Mobile CI (lint + unit tests) passes on every PR
5. All performance targets met: 60fps scroll, <2s TTI, <1.5MB bundle

---

# PHASE 13 — SORT, DATE PICKER & CSV EXPORT

## Objective

Web app backlog items: sort transactions, date picker on Quick Add, CSV export, and font refresh.

---

## Tasks

### 13.1 — Sort Transactions (TDD) ✅ COMPLETE

- [x] Add `SortOption` type to `shared/types/budget.ts`
- [x] Add `sortBy` state + `SORT_FNS` lookup to `useBudget.ts`; spread before `.sort()` to avoid mutation
- [x] Add `sortBy`/`onSortChange` required props to `FilterBar.tsx` + render `<select>` with 4 options
- [x] Pass `sortBy`/`setSortBy` from `useBudget()` to `FilterBar` in `App.tsx`
- [x] 5 new unit tests (filterBar.test.tsx) + 2 integration tests (budgetFlows.test.tsx)

### 13.2 — Date Picker on Quick Add (TDD) ✅ COMPLETE

- [x] Add `date` state (lazy `useState` init) to `BudgetForm.tsx`
- [x] Add `<input type="date" />` labeled "Date"; use controlled state in submit; reset to today after submit
- [x] 4 new unit tests (budgetForm.test.tsx)

### 13.3 — CSV Export (TDD) ✅ COMPLETE

- [x] Create `src/utils/csvExport.ts`: `generateCsv()` + `downloadCsv()` (DOM Blob API, web-only)
- [x] Add Export CSV button to `App.tsx` header (ternary render when `budgetItems.length > 0`)
- [x] Expose `budgetItems` in `useBudget()` return for export of unfiltered data
- [x] 5 new unit tests (csvExport.test.ts)

### 13.4 — Font Refresh (Design) ✅ COMPLETE

- [x] Replace Inter with DM Sans in `index.html` Google Fonts link
- [x] Update `--font-sans` token + body `font-family` in `index.css`
- [x] Apply `style={{ fontFamily: 'var(--font-display)' }}` to `VistaFi` h1 in `App.tsx`
- [x] Apply `style={{ fontFamily: 'var(--font-display)' }}` to `Quick Add` h2 in `BudgetForm.tsx`

---

## Testing (Phase 13)

- 16 new tests total: 5 sort unit + 5 CSV unit + 4 date picker unit + 2 sort integration
- All 104 tests pass (was 88 pre-Phase 13)

---

## Done Criteria (Phase 13) ✅

1. Sort dropdown shows 4 options; default is Newest First (date-desc)
2. Date input appears in Quick Add; backdated transactions saved with correct date
3. Export CSV button appears when items exist; downloads valid CSV
4. Body font is DM Sans; VistaFi h1 and Quick Add h2 render in Playfair Display

---

# Phase 14 — Budget Goals + Mobile Viewport E2E

## Tasks

| # | Task | Status |
|---|------|--------|
| 14.1a | `calculateCurrentMonthSummary` util + `BudgetGoal` type | ✅ |
| 14.1b | `goalService.ts` (fetchGoals / upsertGoal / deleteGoal) | ✅ |
| 14.1c | `BudgetSummary` — goals + currentMonthSummary props + progress bars | ✅ |
| 14.1d | `GoalModal` — 3-input modal for monthly targets | ✅ |
| 14.1e | `useGoals` hook + Goals button in App + migration SQL | ✅ |
| 14.2 | Mobile viewport E2E — 4 Playwright tests (Pixel 5) | ✅ |

## Done Criteria (Phase 14) ✅

1. `calculateCurrentMonthSummary` filters items by month prefix and delegates to `calculateBudgetSummary`
2. `BudgetGoal` interface exported from `shared/types/budget.ts`
3. `goalService.ts` maps `target_amount` → `targetAmount`; upserts on `user_id,category` conflict
4. `BudgetSummary` shows a `role="progressbar"` with `aria-label` for each category that has a goal
5. `GoalModal` accepts 3 number inputs; empty inputs produce `null` targetAmount in onSave payload
6. Goals button in header opens `GoalModal`; Cancel/Save dismiss it
7. `tests/e2e/mobile.spec.ts` runs 4 tests against Pixel 5 viewport
8. All 121 unit/integration tests pass; lint clean; build clean

---

# Phase 15 — Mobile Goals

## Objective

Bring the budget goals feature to the mobile app (Expo/React Native), reaching parity with the web goals feature from Phase 14.

---

## Tasks

| # | Task | Status |
|---|------|--------|
| 15.A | `mobile/src/services/goalService.ts` — fetchGoals / upsertGoal / deleteGoal | ✅ |
| 15.B | `mobile/src/hooks/useGoals.ts` — useGoals / useSetGoal / useDeleteGoal | ✅ |
| 15.C | `mobile/app/set-goals.tsx` — modal screen (3 inputs, save/cancel) | ✅ |
| 15.D | `mobile/app/(tabs)/index.tsx` — Goals button + GoalProgress sub-component | ✅ |
| 15.E | `mobile/app/_layout.tsx` — register set-goals as modal Stack.Screen | ✅ |

## Done Criteria (Phase 15) ✅

1. `goalService` maps `target_amount` → `targetAmount`; upserts on `user_id,category` conflict; reuses Phase 14 Supabase table
2. `useGoals`, `useSetGoal`, `useDeleteGoal` hooks with optimistic updates and rollback
3. `set-goals.tsx` modal screen pre-fills existing goal values; save/cancel wired correctly
4. Dashboard shows a "Goals" Pressable (minHeight: 44) that navigates to `/set-goals`
5. Per-category progress bars render when a goal exists for that category
6. All 15 new tests pass (5 service + 5 hook + 5 screen); 11 dashboard tests pass
7. All 121 web unit/integration tests remain passing

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
