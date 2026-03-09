import { describe, it, expect } from 'vitest'
import { calculateBudgetSummary, calculateCurrentMonthSummary, generateId } from '@shared/utils/budgetUtils'
import { BudgetItem } from '@shared/types/budget'

const makeItem = (overrides: Partial<BudgetItem> & Pick<BudgetItem, 'category' | 'amount'>): BudgetItem =>
  ({ id: '1', description: 'Test', date: '2024-01-01', ...overrides })

// ---------------------------------------------------------------------------
// calculateBudgetSummary
// ---------------------------------------------------------------------------

describe('calculateBudgetSummary', () => {
  it('returns all zeros for an empty array', () => {
    const result = calculateBudgetSummary([])
    expect(result).toEqual({ totalIncome: 0, totalExpenses: 0, totalSavings: 0, balance: 0 })
  })

  it('sums income items correctly', () => {
    const items = [
      makeItem({ id: '1', category: 'income', amount: 3000 }),
      makeItem({ id: '2', category: 'income', amount: 2200 }),
    ]
    const { totalIncome } = calculateBudgetSummary(items)
    expect(totalIncome).toBe(5200)
  })

  it('sums expense items correctly', () => {
    const items = [
      makeItem({ id: '1', category: 'expense', amount: 1500 }),
      makeItem({ id: '2', category: 'expense', amount: 400 }),
      makeItem({ id: '3', category: 'expense', amount: 200 }),
    ]
    const { totalExpenses } = calculateBudgetSummary(items)
    expect(totalExpenses).toBe(2100)
  })

  it('sums savings items correctly', () => {
    const items = [
      makeItem({ id: '1', category: 'savings', amount: 500 }),
      makeItem({ id: '2', category: 'savings', amount: 300 }),
    ]
    const { totalSavings } = calculateBudgetSummary(items)
    expect(totalSavings).toBe(800)
  })

  it('calculates balance as income − expenses − savings', () => {
    const items = [
      makeItem({ id: '1', category: 'income', amount: 5200 }),
      makeItem({ id: '2', category: 'expense', amount: 2100 }),
      makeItem({ id: '3', category: 'savings', amount: 800 }),
    ]
    const { balance } = calculateBudgetSummary(items)
    expect(balance).toBe(2300)
  })

  it('produces a negative balance when expenses exceed income', () => {
    const items = [
      makeItem({ id: '1', category: 'income', amount: 100 }),
      makeItem({ id: '2', category: 'expense', amount: 500 }),
    ]
    const { balance } = calculateBudgetSummary(items)
    expect(balance).toBe(-400)
  })

  it('handles the full 7-item mock dataset correctly', () => {
    const items: BudgetItem[] = [
      { id: '1', description: 'Monthly Salary', amount: 4000, category: 'income', date: '2023-11-01' },
      { id: '2', description: 'Freelance Project', amount: 1200, category: 'income', date: '2023-11-10' },
      { id: '3', description: 'Rent', amount: 1500, category: 'expense', date: '2023-11-05' },
      { id: '4', description: 'Groceries', amount: 400, category: 'expense', date: '2023-11-08' },
      { id: '5', description: 'Utilities', amount: 200, category: 'expense', date: '2023-11-15' },
      { id: '6', description: 'Retirement Fund', amount: 500, category: 'savings', date: '2023-11-02' },
      { id: '7', description: 'Emergency Fund', amount: 300, category: 'savings', date: '2023-11-02' },
    ]
    expect(calculateBudgetSummary(items)).toEqual({
      totalIncome: 5200,
      totalExpenses: 2100,
      totalSavings: 800,
      balance: 2300,
    })
  })

  it('handles a single income item with no expenses or savings', () => {
    const items = [makeItem({ id: '1', category: 'income', amount: 1000 })]
    expect(calculateBudgetSummary(items)).toEqual({
      totalIncome: 1000,
      totalExpenses: 0,
      totalSavings: 0,
      balance: 1000,
    })
  })

  it('returns zero balance when income exactly covers expenses + savings', () => {
    const items = [
      makeItem({ id: '1', category: 'income', amount: 1000 }),
      makeItem({ id: '2', category: 'expense', amount: 600 }),
      makeItem({ id: '3', category: 'savings', amount: 400 }),
    ]
    const { balance } = calculateBudgetSummary(items)
    expect(balance).toBe(0)
  })

  it('handles decimal amounts using toBeCloseTo', () => {
    const items = [
      makeItem({ id: '1', category: 'income', amount: 99.99 }),
      makeItem({ id: '2', category: 'expense', amount: 33.33 }),
    ]
    const { balance } = calculateBudgetSummary(items)
    expect(balance).toBeCloseTo(66.66, 2)
  })
})

// ---------------------------------------------------------------------------
// calculateCurrentMonthSummary
// ---------------------------------------------------------------------------

describe('calculateCurrentMonthSummary', () => {
  it('returns zeros when all items are in a different month', () => {
    // Given — items all from 2023-11, filtering for 2024-01
    const items: BudgetItem[] = [
      { id: '1', description: 'Salary', amount: 4000, category: 'income', date: '2023-11-01' },
      { id: '2', description: 'Rent', amount: 1500, category: 'expense', date: '2023-11-05' },
    ]
    // When
    const result = calculateCurrentMonthSummary(items, '2024-01')
    // Then
    expect(result).toEqual({ totalIncome: 0, totalExpenses: 0, totalSavings: 0, balance: 0 })
  })

  it('sums only items matching the given month string', () => {
    // Given — mixed months
    const items: BudgetItem[] = [
      { id: '1', description: 'Salary', amount: 4000, category: 'income', date: '2024-01-01' },
      { id: '2', description: 'Bonus', amount: 500, category: 'income', date: '2024-02-15' },
      { id: '3', description: 'Rent', amount: 1500, category: 'expense', date: '2024-01-05' },
    ]
    // When
    const result = calculateCurrentMonthSummary(items, '2024-01')
    // Then
    expect(result).toEqual({
      totalIncome: 4000,
      totalExpenses: 1500,
      totalSavings: 0,
      balance: 2500,
    })
  })

  it('uses current month by default when no month arg is provided', () => {
    // Given — item dated in current month
    const currentMonth = new Date().toISOString().slice(0, 7)
    const items: BudgetItem[] = [
      { id: '1', description: 'Salary', amount: 3000, category: 'income', date: `${currentMonth}-01` },
    ]
    // When — no month arg, defaults to current month
    const result = calculateCurrentMonthSummary(items)
    // Then
    expect(result.totalIncome).toBe(3000)
  })
})

// ---------------------------------------------------------------------------
// generateId
// ---------------------------------------------------------------------------

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('returns exactly 7 characters (substring(2,9) contract)', () => {
    const id = generateId()
    expect(id).toHaveLength(7)
  })

  it('returns 100 unique values on 100 calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })

  it('returns only alphanumeric characters (base-36)', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateId()).toMatch(/^[a-z0-9]+$/)
    }
  })
})
