// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BudgetSummary } from '../../../src/components/BudgetSummary'
import { BudgetSummary as BudgetSummaryType, BudgetGoal } from '@shared/types/budget'

const makeSummary = (overrides: Partial<BudgetSummaryType> = {}): BudgetSummaryType => ({
  totalIncome: 0,
  totalExpenses: 0,
  totalSavings: 0,
  balance: 0,
  ...overrides,
})

const noGoals: BudgetGoal[] = []
const zeroMonthSummary: BudgetSummaryType = makeSummary()

describe('BudgetSummary', () => {
  it('should render income total when given summary data', () => {
    // Given
    const summary = makeSummary({ totalIncome: 5200 })
    // When
    render(<BudgetSummary summary={summary} goals={noGoals} currentMonthSummary={zeroMonthSummary} />)
    // Then
    expect(screen.getByText('$5200.00')).toBeInTheDocument()
  })

  it('should render expenses total when given summary data', () => {
    // Given
    const summary = makeSummary({ totalExpenses: 2100 })
    // When
    render(<BudgetSummary summary={summary} goals={noGoals} currentMonthSummary={zeroMonthSummary} />)
    // Then
    expect(screen.getByText('$2100.00')).toBeInTheDocument()
  })

  it('should render savings total when given summary data', () => {
    // Given
    const summary = makeSummary({ totalSavings: 800 })
    // When
    render(<BudgetSummary summary={summary} goals={noGoals} currentMonthSummary={zeroMonthSummary} />)
    // Then
    expect(screen.getByText('$800.00')).toBeInTheDocument()
  })

  it('should render balance when given summary data', () => {
    // Given
    const summary = makeSummary({ balance: 2300 })
    // When
    render(<BudgetSummary summary={summary} goals={noGoals} currentMonthSummary={zeroMonthSummary} />)
    // Then
    expect(screen.getByText('$2300.00')).toBeInTheDocument()
  })

  it('should apply income color class when balance is positive', () => {
    // Given
    const summary = makeSummary({ balance: 500 })
    // When
    render(<BudgetSummary summary={summary} goals={noGoals} currentMonthSummary={zeroMonthSummary} />)
    // Then
    const balanceEl = screen.getByText('$500.00')
    expect(balanceEl).toHaveClass('text-income')
  })

  it('should apply expense color class when balance is negative', () => {
    // Given
    const summary = makeSummary({ balance: -200 })
    // When
    render(<BudgetSummary summary={summary} goals={noGoals} currentMonthSummary={zeroMonthSummary} />)
    // Then
    const balanceEl = screen.getByText('$-200.00')
    expect(balanceEl).toHaveClass('text-expense')
  })

  it('renders a progress bar for a category that has a goal', () => {
    // Given
    const summary = makeSummary({ totalIncome: 5200 })
    const goals: BudgetGoal[] = [{ id: 'g1', category: 'income', targetAmount: 6000 }]
    const currentMonthSummary = makeSummary({ totalIncome: 3000 })
    // When
    render(<BudgetSummary summary={summary} goals={goals} currentMonthSummary={currentMonthSummary} />)
    // Then
    expect(screen.getByRole('progressbar', { name: /income goal progress/i })).toBeInTheDocument()
  })

  it('does not render a progress bar when no goal exists for that category', () => {
    // Given
    const summary = makeSummary({ totalExpenses: 2100 })
    const goals: BudgetGoal[] = [] // no expense goal
    // When
    render(<BudgetSummary summary={summary} goals={goals} currentMonthSummary={zeroMonthSummary} />)
    // Then
    expect(screen.queryByRole('progressbar', { name: /expense goal progress/i })).not.toBeInTheDocument()
  })

  it('progress bar has correct aria-label', () => {
    // Given
    const summary = makeSummary({ totalSavings: 800 })
    const goals: BudgetGoal[] = [{ id: 'g2', category: 'savings', targetAmount: 1000 }]
    const currentMonthSummary = makeSummary({ totalSavings: 500 })
    // When
    render(<BudgetSummary summary={summary} goals={goals} currentMonthSummary={currentMonthSummary} />)
    // Then
    expect(screen.getByRole('progressbar', { name: 'Savings goal progress' })).toBeInTheDocument()
  })

  it('shows current month amount and target amount as text in the progress section', () => {
    // Given
    const summary = makeSummary({ totalExpenses: 2100 })
    const goals: BudgetGoal[] = [{ id: 'g3', category: 'expense', targetAmount: 2500 }]
    const currentMonthSummary = makeSummary({ totalExpenses: 1800 })
    // When
    render(<BudgetSummary summary={summary} goals={goals} currentMonthSummary={currentMonthSummary} />)
    // Then — both amounts appear as text in the progress section
    expect(screen.getByText('$1800.00')).toBeInTheDocument()
    expect(screen.getByText('$2500.00')).toBeInTheDocument()
  })
})
