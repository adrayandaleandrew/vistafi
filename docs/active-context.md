# Active Context — Fix: Touch Target Compliance (ui-ux-pro-max `touch-target-size`)

## Context

The post-Phase-8 skills compliance check flagged 10 interactive elements across 4 components that fall below the 44×44px minimum required by the `ui-ux-pro-max` skill (`touch-target-size` rule, CRITICAL priority) and explicitly listed in `CLAUDE.md` Critical Rules.

The 2 higher-priority violations (missing label, emoji icon in FilterBar) were already fixed in `fix/skill-compliance-a11y`. This plan resolves the remaining flagged items.

---

## Branch

```bash
git checkout master && git pull origin master && git checkout -b fix/touch-targets-a11y
```

---

## What's Changing and Why

| Element | Current | Fix | Reason |
|---------|---------|-----|--------|
| FilterBar filter pills | `h-8` (32px) | `min-h-[44px]` | Below 44px minimum |
| FilterBar search input | `h-8` (32px) | `min-h-[44px]` | Below 44px minimum |
| FilterBar clear button | `h-8 w-8` (32px) | `min-h-[44px] min-w-[44px]` | Below 44px minimum |
| BudgetForm type toggles | `h-9` (36px) | `min-h-[44px]` | Below 44px minimum |
| BudgetForm amount input | `py-2.5` (~38px) | `min-h-[44px]` | Below 44px minimum |
| BudgetForm category select | `py-2.5` (~38px) | `min-h-[44px]` | Below 44px minimum |
| BudgetForm description input | `py-2.5` (~38px) | `min-h-[44px]` | Below 44px minimum |
| EditModal type toggles | `h-9` (36px) | `min-h-[44px]` | Below 44px minimum |
| EditModal amount input | `py-2.5` (~38px) | `min-h-[44px]` | Below 44px minimum |
| EditModal category select | `py-2.5` (~38px) | `min-h-[44px]` | Below 44px minimum |
| EditModal description input | `py-2.5` (~38px) | `min-h-[44px]` | Below 44px minimum |
| BudgetItemList edit button | `p-2` (~31px) | `min-h-[44px] min-w-[44px]` | Below 44px minimum |
| BudgetItemList delete button | `p-2` (~31px) | `min-h-[44px] min-w-[44px]` | Below 44px minimum |

**Already compliant (do not touch):**
- BudgetForm "Add Transaction" button — `min-h-[44px]` ✅
- EditModal "Cancel" button — `min-h-[44px]` ✅
- EditModal "Save Changes" button — `min-h-[44px]` ✅

**Strategy for inputs/selects:** add `min-h-[44px]` alongside existing `py-2.5` — the browser honours `min-height` so the element expands to 44px without changing horizontal padding.

**Strategy for BudgetItemList buttons:** replace `p-2` with `min-h-[44px] min-w-[44px] flex items-center justify-center` — SVG stays the same size visually; the clickable area expands.

**Strategy for filter pills:** add `min-h-[44px] flex items-center` alongside `px-3` — pills become slightly taller but remain pill-shaped.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/FilterBar.tsx` | pills, search input, clear button |
| `src/components/BudgetForm.tsx` | type toggles, amount input, category select, description input |
| `src/components/EditModal.tsx` | type toggles, amount input, category select, description input |
| `src/components/BudgetItemList.tsx` | edit button, delete button |

---

## Detailed Changes

### FilterBar.tsx

**Filter pills** — replace `h-8 px-3 rounded-full` with `min-h-[44px] flex items-center px-3 rounded-full`

**Search input** — replace `h-8 px-3` with `min-h-[44px] px-3`

**Clear button** — replace `h-8 w-8 flex items-center justify-center` with `min-h-[44px] min-w-[44px] flex items-center justify-center`

---

### BudgetForm.tsx

**Type toggle buttons** — replace `h-9` with `min-h-[44px]`

**Amount input** — add `min-h-[44px]` to existing classes (keep `pl-8 pr-4 py-2.5`)

**Category select** — add `min-h-[44px]` to existing classes (keep `py-2.5 px-3`)

**Description input** — add `min-h-[44px]` to existing classes (keep `py-2.5 px-3`)

---

### EditModal.tsx

Same changes as BudgetForm (both share the same form pattern):

**Type toggle buttons** — `h-9` → `min-h-[44px]`

**Amount input** (`#edit-amount`) — add `min-h-[44px]`

**Category select** (`#edit-category`) — add `min-h-[44px]`

**Description input** (`#edit-description`) — add `min-h-[44px]`

---

### BudgetItemList.tsx

**Edit button** — replace `p-2 rounded-lg` with `min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg`

**Delete button** — same replacement as edit button

---

## Commit Strategy (Git-conventions.md — one concern per commit)

| # | Message | Files |
|---|---------|-------|
| 1 | `chore: add active-context rule and update CLAUDE.md step numbering` | `CLAUDE.md` |
| 2 | `docs: write touch target fix plan into active-context.md` | `docs/active-context.md` |
| 3 | `fix: expand FilterBar interactive elements to 44px touch target minimum` | `FilterBar.tsx` |
| 4 | `fix: expand BudgetForm inputs and type toggles to 44px touch target minimum` | `BudgetForm.tsx` |
| 5 | `fix: expand EditModal inputs and type toggles to 44px touch target minimum` | `EditModal.tsx` |
| 6 | `fix: expand BudgetItemList action buttons to 44px touch target minimum` | `BudgetItemList.tsx` |

---

## Verification

1. `npm run lint` — no lint errors
2. `npm run build` — TypeScript + Vite build clean
3. `npm run test:unit` — 14 unit tests still pass
4. `npm run build && npm run test:e2e` — all 11 E2E tests still pass (E2E selectors use aria-labels and text, not size-dependent)
5. Visual check: run `npm run dev`, confirm all buttons/inputs are visually acceptable at new height

---

## Post-Implementation Compliance Checklist

- [ ] `ui-ux-pro-max` `touch-target-size` — all interactive elements ≥ 44×44px
- [ ] `vercel-react-best-practices` — no new functional setState violations, no new `&&` conditionals introduced
- [ ] `Repo-Standards.md` — no dead code added
- [ ] `Git-conventions.md` — conventional commits, one concern per commit
- [ ] `Agents.md` — branch first, lint+test run, docs checked, push after compliance passes
