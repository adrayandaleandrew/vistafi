# CLAUDE.md — VistaFi

## Project
VistaFi — Simple Budget Planner
React 19 + TypeScript + Tailwind CSS v4 + Vite (web app, no backend, no auth)

---

## MANDATORY WORKFLOW — Follow Every Time

### Step 1 — Create Branch First
Before writing any code, create a branch:
- `feature/<name>` — new functionality
- `fix/<name>` — bug fixes
- `chore/<name>` — maintenance, docs, config

Never code on master directly.

### Step 2 — Read Docs and Skills During Planning and Implementation
Before planning and throughout code changes, consult:
- All files in `docs/` — standards, conventions, and task plan
- `docs/SecurityGuide.md` — mobile + Supabase-specific security rules
- `.agents/skills/` — coding best practices; all skills are listed below with their scope

#### Skill Index

| Skill | When to Use |
|-------|-------------|
| `vercel-react-best-practices` | All React/Vite work — re-render rules, functional setState, ternary conditionals, bundle, waterfalls |
| `test-driven-development` | Any new feature or bug fix — write failing test FIRST (Red-Green-Refactor); no production code without a failing test |
| `testing-strategies` | Planning test coverage — test pyramid (unit 70 / integration 20 / E2E 10), Given-When-Then, AAA |
| `ui-ux-pro-max` | Any UI/design work — accessibility (4.5:1 contrast, 44px touch targets, aria-labels), animation (150–300ms), layout, typography |
| `frontend-design` | Creating or redesigning components/pages — bold aesthetic direction, avoid generic AI aesthetics, distinctive typography |
| `react-components` | Stitch design→React conversion — modular files, logic in hooks, data in mockData, `Readonly` TypeScript interface |
| `react-native-architecture` | Mobile (Expo/RN) — Expo Router, auth provider, offline-first React Query, native modules, EAS Build |
| `react-native-best-practices` | RN performance — FPS/re-renders, bundle size, TTI, memory leaks; Measure→Optimize→Re-measure cycle |
| `react-native-design` | RN styling — StyleSheet.create, React Navigation, Reanimated 3, Gesture Handler, platform-specific |
| `vercel-react-native-skills` | RN/Expo patterns — FlashList, animation GPU properties, native navigators, expo-image, safe areas |
| `supabase-auth-best-practices` | Auth setup (Phase 11+) — Supabase Auth `signInWithPassword`/`signUp`/`signOut`, `onAuthStateChange`, session restore via `getSession`; never use `service_role` key client-side |
| `supabase-postgres-best-practices` | Database work (Phase 11+) — Supabase PostgreSQL schema, RLS (CRITICAL: every table), indexes on `user_id`, UUID PKs, connection pool singleton |

#### Critical Rules (Apply to Every Task)
- `rerender-functional-setstate` — always `setBudgetItems(curr => ...)`, never direct reference
- `rendering-conditional-render` — ternary (`condition ? <X /> : null`), never `condition && <X />`
- `js-cache-storage` — lazy `useState` init for localStorage, not `useEffect` on mount
- **TDD iron law** — write failing test first; no production code without a prior failing test
- `touch-target-size` — minimum 44×44px for all interactive elements
- `aria-labels` — all icon-only buttons must have `aria-label`
- No `console.log` in production or test code
- No `dangerouslySetInnerHTML`
- Controlled inputs only (`value` + `onChange`)

#### Security Rules (Non-Negotiable)
- **Never put real Supabase URLs, anon keys, or any backend credentials anywhere except `.env.local`**
- `.env.local` is gitignored — it must never be committed or pushed under any circumstances
- All `*.example` files must contain placeholder templates only — no real values, no real domains, no patterns that hint at real project identifiers
- Never use the Supabase `service_role` key client-side — it bypasses RLS entirely
- No secrets, tokens, or credentials in source code, comments, config files, or CI workflow files (use GitHub Actions secrets for CI)
- When generating any env-related file, verify with `git check-ignore` that it is blocked before committing

### Step 3 — Post-Implementation Compliance Check
After all code changes are done, verify every change against:
- All applicable files in `docs/`
- `docs/SecurityGuide.md` — pre-push audit checklist + Supabase/mobile security rules
- All applicable rules in `.agents/skills/`

Fix anything that conflicts before proceeding.

### Step 4 — Update active-context.md
After plan approval and before writing any code, copy the full approved plan into `docs/active-context.md`. This ensures the active context always reflects the current task.

### Step 5 — Push to GitHub
Only push after the compliance check passes.
User handles merging and pulling to local master manually — never auto-merge.

---

## Project Structure
```
src/
  App.tsx                 # Root — all state lives here
  main.tsx
  index.css               # @theme tokens + body styles
  components/
    BudgetForm.tsx        # Add transaction form (segmented type control)
    BudgetItemList.tsx    # Transaction list (hover-reveal edit + delete)
    BudgetSummary.tsx     # Bento grid: balance hero + 3 metrics
    FilterBar.tsx         # Category filter pills + text search
    EditModal.tsx         # Edit transaction modal (ESC/backdrop dismiss)
shared/
  types/
    budget.ts             # BudgetItem, BudgetSummary, BudgetCategory
  utils/
    budgetUtils.ts        # calculateBudgetSummary(), generateId()
  data/
    mockData.ts           # Seed data (7 items)
tests/
  unit/
    budgetUtils.test.ts   # 14 Vitest unit tests
    components/           # 26 component unit tests (jsdom)
  integration/
    budgetFlows.test.tsx  # 7 integration tests (full App)
  e2e/
    app.spec.ts           # 11 Playwright E2E tests
  setup.ts                # jest-dom matchers + cleanup
docs/                     # Project standards — read before every task
.agents/skills/           # Coding skill library — reference during all work
```

## Key Types
- `BudgetCategory = 'income' | 'expense' | 'savings'`
- `BudgetItem { id, description, amount, category, date }`
- `BudgetSummary { totalIncome, totalExpenses, totalSavings, balance }`

## Scripts
- `npm run dev` — local dev server
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — ESLint
- `npm run preview` — preview production build
- `npm run test:unit` — Vitest unit + integration tests
- `npm run test:e2e` — Playwright E2E tests (requires build first)

## Config
- Tailwind v4 via `@tailwindcss/vite` plugin (not PostCSS)
- Strict TypeScript: `noUnusedLocals`, `noUnusedParameters`

## Open TODOs
- Phases 1–13 complete
- Remaining backlog: mobile viewport E2E, budget goals
- Phase 12c note: EAS build step in mobile-ci.yml requires user to run `eas init` once + add `EAS_TOKEN` to GitHub secrets before activating
