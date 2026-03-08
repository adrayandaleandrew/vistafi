// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App'

beforeEach(() => {
  localStorage.clear()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

/** Helper: find the BudgetForm by its "Quick Add" heading */
const getForm = () => screen.getByText('Quick Add').closest('form') as HTMLFormElement

/** Helper: find the EditModal by its "Edit Transaction" heading */
const getModal = () =>
  screen.getByText('Edit Transaction').closest('div[class*="relative"]') as HTMLElement

describe('localStorage persistence', () => {
  it('should load items from localStorage when available, instead of mock data', () => {
    // Given — pre-populate localStorage with a custom item
    const customItems = [{ id: 'x1', description: 'Custom Persisted Item', amount: 999, category: 'income', date: '2024-06-01' }]
    localStorage.setItem('vistafi-items', JSON.stringify(customItems))
    // When
    render(<App />)
    // Then — shows custom item, not mock data
    expect(screen.getByText('Custom Persisted Item')).toBeInTheDocument()
    expect(screen.queryByText('Groceries')).not.toBeInTheDocument()
  })
})

describe('Budget CRUD flows', () => {
  it('should add income item and update summary totalIncome', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    // When — add a new income transaction of $100 (income: 5200 → 5300)
    await user.click(within(getForm()).getByRole('button', { name: 'Income' }))
    await user.type(within(getForm()).getByLabelText(/amount/i), '100')
    await user.type(within(getForm()).getByLabelText(/description/i), 'Bonus')
    await user.click(within(getForm()).getByRole('button', { name: /add transaction/i }))
    // Then
    expect(screen.getByText('$5300.00')).toBeInTheDocument()
  })

  it('should add expense item and decrease balance', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    // When — add expense $200 (balance: 2300 → 2100)
    await user.type(within(getForm()).getByLabelText(/amount/i), '200')
    await user.type(within(getForm()).getByLabelText(/description/i), 'Electricity')
    await user.click(within(getForm()).getByRole('button', { name: /add transaction/i }))
    // Then
    expect(screen.getByText('$2100.00')).toBeInTheDocument()
  })

  it('should delete item and remove it from the list after confirmation', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    // When — two-step delete
    await user.click(screen.getByRole('button', { name: 'Delete Groceries' }))
    await user.click(screen.getByRole('button', { name: /confirm delete/i }))
    // Then
    expect(screen.queryByText('Groceries')).not.toBeInTheDocument()
  })

  it('should delete item and update summary expenses after confirmation', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    // When — delete Groceries ($400 expense); expenses: 2100 → 1700
    await user.click(screen.getByRole('button', { name: 'Delete Groceries' }))
    await user.click(screen.getByRole('button', { name: /confirm delete/i }))
    // Then
    expect(screen.getByText('$1700.00')).toBeInTheDocument()
  })

  it('should edit item amount and reflect in summary', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    // When — edit Groceries ($400) → $700; expenses: 2100 → 2400
    await user.click(screen.getByRole('button', { name: 'Edit Groceries' }))
    const amountInput = within(getModal()).getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '700')
    await user.click(within(getModal()).getByRole('button', { name: /save changes/i }))
    // Then — expenses card shows $2400.00
    const expensesCard = screen.getByText('Expenses').closest('div') as HTMLElement
    expect(within(expensesCard).getByText('$2400.00')).toBeInTheDocument()
  })
})

describe('Filter and search flows', () => {
  it('should filter by category and leave summary unchanged', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    // Verify summary before filter
    expect(screen.getByText('$2300.00')).toBeInTheDocument()
    // When — click Expense filter pill (in the filter bar, not in the form)
    const filterPills = screen.getAllByRole('button', { name: 'Expense' })
    // The filter pill is the one NOT inside the form
    const filterPill = filterPills.find(btn => !getForm().contains(btn))!
    await user.click(filterPill)
    // Then — summary is still full totals
    expect(screen.getByText('$2300.00')).toBeInTheDocument()
    // And income items are hidden from list
    expect(screen.queryByText('Monthly Salary')).not.toBeInTheDocument()
  })

  it('should search by description and leave summary unchanged', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    // When
    await user.type(screen.getByRole('searchbox'), 'rent')
    // Then — list filtered; summary still full
    expect(screen.getByText('Rent')).toBeInTheDocument()
    expect(screen.queryByText('Groceries')).not.toBeInTheDocument()
    expect(screen.getByText('$2300.00')).toBeInTheDocument()
  })
})
