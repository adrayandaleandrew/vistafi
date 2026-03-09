// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnalyticsPanel } from '../../../src/components/AnalyticsPanel'
import type { BudgetItem, BudgetSummary } from '@shared/types/budget'

const currentMonth = new Date().toISOString().slice(0, 7)

const mockItems: BudgetItem[] = [
  { id: '1', description: 'Salary', amount: 4000, category: 'income', date: `${currentMonth}-01` },
  { id: '2', description: 'Rent', amount: 1500, category: 'expense', date: `${currentMonth}-02` },
  { id: '3', description: 'Groceries', amount: 400, category: 'expense', date: `${currentMonth}-03` },
  { id: '4', description: 'Retirement', amount: 500, category: 'savings', date: `${currentMonth}-04` },
]
const mockSummary: BudgetSummary = { totalIncome: 4000, totalExpenses: 1900, totalSavings: 500, balance: 1600 }

describe('AnalyticsPanel', () => {
  it('B1: renders "Monthly Trend" section heading', () => {
    render(<AnalyticsPanel items={mockItems} summary={mockSummary} />)
    expect(screen.getByText('Monthly Trend')).toBeInTheDocument()
  })

  it('B2: renders 6 month-column bars by default', () => {
    render(<AnalyticsPanel items={mockItems} summary={mockSummary} />)
    // Each month has an income bar and an expense bar — 6 months × 2 bars = 12
    // We check via the chart container aria-label
    const chart = screen.getByRole('img', { name: /monthly income and expenses bar chart/i })
    expect(chart).toBeInTheDocument()
    // Check there are 6 month label spans
    const monthAbbrs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const allMonthLabels = monthAbbrs.filter(abbr => screen.queryAllByText(abbr).length > 0)
    expect(allMonthLabels.length).toBeGreaterThanOrEqual(1)
    // The chart has 6 children (one per month column)
    expect(chart.children).toHaveLength(6)
  })

  it('B3: renders "Savings Rate" section with correct percentage ("12.5%")', () => {
    // 500 / 4000 = 12.5%
    render(<AnalyticsPanel items={mockItems} summary={mockSummary} />)
    expect(screen.getByText('Savings Rate')).toBeInTheDocument()
    expect(screen.getByText('12.5%')).toBeInTheDocument()
  })

  it('B4: renders "Top Expenses" section with expense items in descending order', () => {
    render(<AnalyticsPanel items={mockItems} summary={mockSummary} />)
    expect(screen.getByText('Top Expenses')).toBeInTheDocument()
    // Rent ($1500) should appear before Groceries ($400)
    const rent = screen.getByText('Rent')
    const groceries = screen.getByText('Groceries')
    expect(rent).toBeInTheDocument()
    expect(groceries).toBeInTheDocument()
    // Verify ordering by DOM position
    const rentPos = rent.compareDocumentPosition(groceries)
    // DOCUMENT_POSITION_FOLLOWING = 4 means groceries comes after rent in DOM
    expect(rentPos & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('B5: top expenses list does not include income or savings items', () => {
    render(<AnalyticsPanel items={mockItems} summary={mockSummary} />)
    // Salary (income) and Retirement (savings) should not appear in Top Expenses
    const topExpensesSection = screen.getByText('Top Expenses').closest('div') as HTMLElement
    expect(topExpensesSection).not.toHaveTextContent('Salary')
    expect(topExpensesSection).not.toHaveTextContent('Retirement')
  })

  it('B6: renders month abbreviations (e.g. "Jan", "Feb") as bar labels', () => {
    render(<AnalyticsPanel items={mockItems} summary={mockSummary} />)
    const monthAbbrs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    // At least one month abbreviation should be present
    const found = monthAbbrs.some(abbr => screen.queryAllByText(abbr).length > 0)
    expect(found).toBe(true)
  })

  it('B7: renders gracefully with no items (no crash, shows empty state)', () => {
    const emptySummary: BudgetSummary = { totalIncome: 0, totalExpenses: 0, totalSavings: 0, balance: 0 }
    render(<AnalyticsPanel items={[]} summary={emptySummary} />)
    expect(screen.getByText('Monthly Trend')).toBeInTheDocument()
    expect(screen.getByText('Savings Rate')).toBeInTheDocument()
    expect(screen.getByText('Top Expenses')).toBeInTheDocument()
    expect(screen.getByText('No expense items yet.')).toBeInTheDocument()
  })
})
