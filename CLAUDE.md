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
- `.agents/skills/` — coding best practices (most relevant: `vercel-react-best-practices`, `react-components`)

### Step 3 — Post-Implementation Compliance Check
After all code changes are done, verify every change against:
- All applicable files in `docs/`
- All applicable rules in `.agents/skills/`

Fix anything that conflicts before proceeding.

### Step 4 — Push to GitHub
Only push after the compliance check passes.
User handles merging and pulling to local master manually — never auto-merge.

---

## Project Structure
```
src/
  App.tsx                 # Root — all state lives here
  main.tsx
  components/
    BudgetForm.tsx        # Add/edit transaction form
    BudgetItemList.tsx    # Transaction list (edit + delete per row)
    BudgetSummary.tsx     # 4-card summary (income, expenses, savings, balance)
  data/
    mockData.ts           # Seed data (7 items)
  types/
    budget.ts             # BudgetItem, BudgetSummary, BudgetCategory
  utils/
    budgetUtils.ts        # calculateBudgetSummary(), generateId()
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

## Config
- Tailwind v4 via `@tailwindcss/vite` plugin (not PostCSS)
- Strict TypeScript: `noUnusedLocals`, `noUnusedParameters`

## Open TODOs
- Edit transaction UI (Phase 4) — `handleEditItem` is a stub (`alert()` only)
- Fix `index.css` Vite scaffold dark background conflicting with Tailwind
- Update `index.html` title to "VistaFi"
- localStorage persistence (Phase 6)
- Category filter + search UI (Phase 7)
