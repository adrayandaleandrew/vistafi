import { describe, it, expect } from 'vitest'
import { calculateBudgetSummary, calculateCurrentMonthSummary, generateId, calculateMonthlyTrends, calculateSavingsRate, getTopExpenses } from '@shared/utils/budgetUtils'
import { BudgetItem, BudgetSummary } from '@shared/types/budget'

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

// ---------------------------------------------------------------------------
// calculateMonthlyTrends
// ---------------------------------------------------------------------------

describe('calculateMonthlyTrends', () => {
  const now = new Date()
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  it('A1: returns array of exactly `months` length (default 6)', () => {
    const result = calculateMonthlyTrends([])
    expect(result).toHaveLength(6)
  })

  it('A2: returns months in ascending order (oldest → newest)', () => {
    const result = calculateMonthlyTrends([])
    for (let i = 1; i < result.length; i++) {
      expect(result[i].month > result[i - 1].month).toBe(true)
    }
  })

  it('A3: groups items into the correct month slot', () => {
    const items: BudgetItem[] = [
      { id: '1', description: 'Salary', amount: 2000, category: 'income', date: `${currentYearMonth}-01` },
    ]
    const result = calculateMonthlyTrends(items)
    const currentSlot = result[result.length - 1]
    expect(currentSlot.month).toBe(currentYearMonth)
    expect(currentSlot.totalIncome).toBe(2000)
  })

  it('A4: month with no items has all-zero values', () => {
    const result = calculateMonthlyTrends([])
    result.forEach(slot => {
      expect(slot.totalIncome).toBe(0)
      expect(slot.totalExpenses).toBe(0)
      expect(slot.totalSavings).toBe(0)
      expect(slot.balance).toBe(0)
    })
  })

  it('A5: items outside the last N months window are excluded', () => {
    // An item dated 10 years ago should not appear in any slot
    const items: BudgetItem[] = [
      { id: '1', description: 'Old', amount: 999, category: 'income', date: '2000-01-01' },
    ]
    const result = calculateMonthlyTrends(items)
    const totalIncome = result.reduce((sum, s) => sum + s.totalIncome, 0)
    expect(totalIncome).toBe(0)
  })

  it('A6: current month is always the last entry', () => {
    const result = calculateMonthlyTrends([])
    expect(result[result.length - 1].month).toBe(currentYearMonth)
  })

  it('A7: totals per month match calculateBudgetSummary called on same items', () => {
    const items: BudgetItem[] = [
      { id: '1', description: 'Salary', amount: 3000, category: 'income', date: `${currentYearMonth}-01` },
      { id: '2', description: 'Rent', amount: 1000, category: 'expense', date: `${currentYearMonth}-05` },
      { id: '3', description: 'Fund', amount: 200, category: 'savings', date: `${currentYearMonth}-10` },
    ]
    const result = calculateMonthlyTrends(items)
    const currentSlot = result[result.length - 1]
    const expected = calculateBudgetSummary(items)
    expect(currentSlot.totalIncome).toBe(expected.totalIncome)
    expect(currentSlot.totalExpenses).toBe(expected.totalExpenses)
    expect(currentSlot.totalSavings).toBe(expected.totalSavings)
    expect(currentSlot.balance).toBe(expected.balance)
  })
})

// ---------------------------------------------------------------------------
// calculateSavingsRate
// ---------------------------------------------------------------------------

describe('calculateSavingsRate', () => {
  it('A8: returns correct percentage: (500 / 2000) * 100 = 25.0', () => {
    const summary: BudgetSummary = { totalIncome: 2000, totalExpenses: 1000, totalSavings: 500, balance: 500 }
    expect(calculateSavingsRate(summary)).toBe(25.0)
  })

  it('A9: returns 0 when totalIncome is 0', () => {
    const summary: BudgetSummary = { totalIncome: 0, totalExpenses: 0, totalSavings: 0, balance: 0 }
    expect(calculateSavingsRate(summary)).toBe(0)
  })

  it('A10: returns 100 when totalSavings equals totalIncome exactly', () => {
    const summary: BudgetSummary = { totalIncome: 1000, totalExpenses: 0, totalSavings: 1000, balance: 0 }
    expect(calculateSavingsRate(summary)).toBe(100)
  })
})

// ---------------------------------------------------------------------------
// getTopExpenses
// ---------------------------------------------------------------------------

describe('getTopExpenses', () => {
  const mixed: BudgetItem[] = [
    { id: '1', description: 'Salary', amount: 3000, category: 'income', date: '2024-01-01' },
    { id: '2', description: 'Rent', amount: 1500, category: 'expense', date: '2024-01-05' },
    { id: '3', description: 'Groceries', amount: 400, category: 'expense', date: '2024-01-08' },
    { id: '4', description: 'Utilities', amount: 200, category: 'expense', date: '2024-01-15' },
    { id: '5', description: 'Netflix', amount: 15, category: 'expense', date: '2024-01-20' },
    { id: '6', description: 'Coffee', amount: 50, category: 'expense', date: '2024-01-25' },
    { id: '7', description: 'Savings Fund', amount: 500, category: 'savings', date: '2024-01-02' },
  ]

  it('A11: returns only expense-category items (not income or savings)', () => {
    const result = getTopExpenses(mixed)
    result.forEach(item => expect(item.category).toBe('expense'))
  })

  it('A12: returns items sorted by amount DESC', () => {
    const result = getTopExpenses(mixed)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].amount <= result[i - 1].amount).toBe(true)
    }
  })

  it('A13: respects the limit parameter (default 5)', () => {
    const result = getTopExpenses(mixed)
    expect(result).toHaveLength(5)
    const limitedResult = getTopExpenses(mixed, 2)
    expect(limitedResult).toHaveLength(2)
  })

  it('A14: returns empty array when no expense items exist', () => {
    const noExpenses: BudgetItem[] = [
      { id: '1', description: 'Salary', amount: 3000, category: 'income', date: '2024-01-01' },
    ]
    expect(getTopExpenses(noExpenses)).toEqual([])
  })
})
