// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BudgetSummary } from '../../../src/components/BudgetSummary'
import { BudgetSummary as BudgetSummaryType } from '@shared/types/budget'

const makeSummary = (overrides: Partial<BudgetSummaryType> = {}): BudgetSummaryType => ({
  totalIncome: 0,
  totalExpenses: 0,
  totalSavings: 0,
  balance: 0,
  ...overrides,
})

describe('BudgetSummary', () => {
  it('should render income total when given summary data', () => {
    // Given
    const summary = makeSummary({ totalIncome: 5200 })
    // When
    render(<BudgetSummary summary={summary} />)
    // Then
    expect(screen.getByText('$5200.00')).toBeInTheDocument()
  })

  it('should render expenses total when given summary data', () => {
    // Given
    const summary = makeSummary({ totalExpenses: 2100 })
    // When
    render(<BudgetSummary summary={summary} />)
    // Then
    expect(screen.getByText('$2100.00')).toBeInTheDocument()
  })

  it('should render savings total when given summary data', () => {
    // Given
    const summary = makeSummary({ totalSavings: 800 })
    // When
    render(<BudgetSummary summary={summary} />)
    // Then
    expect(screen.getByText('$800.00')).toBeInTheDocument()
  })

  it('should render balance when given summary data', () => {
    // Given
    const summary = makeSummary({ balance: 2300 })
    // When
    render(<BudgetSummary summary={summary} />)
    // Then
    expect(screen.getByText('$2300.00')).toBeInTheDocument()
  })

  it('should apply income color class when balance is positive', () => {
    // Given
    const summary = makeSummary({ balance: 500 })
    // When
    render(<BudgetSummary summary={summary} />)
    // Then
    const balanceEl = screen.getByText('$500.00')
    expect(balanceEl).toHaveClass('text-income')
  })

  it('should apply expense color class when balance is negative', () => {
    // Given
    const summary = makeSummary({ balance: -200 })
    // When
    render(<BudgetSummary summary={summary} />)
    // Then
    const balanceEl = screen.getByText('$-200.00')
    expect(balanceEl).toHaveClass('text-expense')
  })
})
