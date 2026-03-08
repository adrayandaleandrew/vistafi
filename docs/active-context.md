# Active Context — Phase 8 Testing

## Branch
`feature/phase-8-testing`

## Status
IN PROGRESS

---

## What This Task Does

Adds automated test coverage to satisfy:
- `Agents.md` step 5: run tests after every implementation
- `QA-TestAutomation.md`: unit tests for pure utils + 3 E2E critical flows
- `DevOps-CICD.md`: CI pipeline (install → lint → test → build) on every PR/push

---

## Files Changed

| File | Change |
|------|--------|
| `vitest.config.ts` | CREATE — unit test configuration |
| `playwright.config.ts` | CREATE — E2E test configuration |
| `tests/unit/budgetUtils.test.ts` | CREATE — unit tests for calculateBudgetSummary and generateId |
| `tests/e2e/app.spec.ts` | CREATE — E2E tests for add/delete/edit flows |
| `.github/workflows/ci.yml` | CREATE — GitHub Actions CI pipeline |
| `package.json` | MODIFY — add test scripts |
| `docs/Todos.md` | MODIFY — mark Phase 8 complete |

---

## Key Implementation Details

### Unit Tests (Vitest)
- Environment: `node` (pure function tests, no jsdom needed)
- Alias: `@shared` → `./shared`
- `calculateBudgetSummary`: empty array, income/expense/savings sums, balance, negative balance, full mock data, decimals
- `generateId`: non-empty string, 7 chars, 100 unique values, alphanumeric only

### E2E Tests (Playwright)
- Runs against preview server at `localhost:4173`
- `beforeEach`: clear localStorage + reload → 7-item mock data baseline
- Flow 1 — Add Transaction (4 tests)
- Flow 2 — Delete Transaction (3 tests)
- Flow 3 — Edit Transaction (4 tests)

### CI Pipeline (GitHub Actions)
- Triggers: push/PR to develop or main
- Steps: npm ci → lint → unit tests → build
- E2E excluded from CI at Phase 8 (preview server setup deferred)

---

## What Comes Next (Phase 9+)
- Add E2E to CI pipeline (requires preview server in CI)
- Integration tests (component interactions)
- Version bump and production release checklist
