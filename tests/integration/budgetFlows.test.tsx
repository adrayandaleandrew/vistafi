// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import App from '../../src/App'
import { mockBudgetItems } from '@shared/data/mockData'
import type { BudgetItem } from '@shared/types/budget'

// Mock AuthContext — always return a logged-in user
vi.mock('../../src/context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: vi.fn().mockReturnValue({
    user: { id: 'test-user-id', email: 'test@test.com' },
    isLoading: false,
    error: null,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }),
}))

// Mock budget service
vi.mock('../../src/services/budgetService', () => ({
  fetchItems: vi.fn(),
  addItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
}))

// Resolve mock after import so vi.mocked works
import { fetchItems, addItem, updateItem, deleteItem } from '../../src/services/budgetService'

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(fetchItems).mockResolvedValue([...mockBudgetItems])
  vi.mocked(addItem).mockImplementation(async (item) => ({ id: 'new-id', ...item } as BudgetItem))
  vi.mocked(updateItem).mockImplementation(async (id, changes) => ({ ...changes, id } as BudgetItem))
  vi.mocked(deleteItem).mockResolvedValue(undefined)
})

/** Helper: find the BudgetForm by its "Quick Add" heading */
const getForm = () => screen.getByText('Quick Add').closest('form') as HTMLFormElement

/** Helper: find the EditModal by its "Edit Transaction" heading */
const getModal = () =>
  screen.getByText('Edit Transaction').closest('div[class*="relative"]') as HTMLElement

describe('Budget CRUD flows', () => {
  it('should add income item and update summary totalIncome', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Groceries')

    // When — add a new income transaction of $100 (income: 5200 → 5300)
    await user.click(within(getForm()).getByRole('button', { name: 'Income' }))
    await user.type(within(getForm()).getByLabelText(/amount/i), '100')
    await user.type(within(getForm()).getByLabelText(/description/i), 'Bonus')
    await user.click(within(getForm()).getByRole('button', { name: /add transaction/i }))

    // Then
    await waitFor(() => expect(screen.getByText('$5300.00')).toBeInTheDocument())
  })

  it('should add expense item and decrease balance', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Groceries')

    // When — add expense $200 (balance: 2300 → 2100)
    await user.type(within(getForm()).getByLabelText(/amount/i), '200')
    await user.type(within(getForm()).getByLabelText(/description/i), 'Electricity')
    await user.click(within(getForm()).getByRole('button', { name: /add transaction/i }))

    // Then
    await waitFor(() => expect(screen.getByText('$2100.00')).toBeInTheDocument())
  })

  it('should delete item and remove it from the list after confirmation', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Groceries')

    // When — two-step delete
    await user.click(screen.getByRole('button', { name: 'Delete Groceries' }))
    await user.click(screen.getByRole('button', { name: /confirm delete/i }))

    // Then
    await waitFor(() => expect(screen.queryByText('Groceries')).not.toBeInTheDocument())
  })

  it('should delete item and update summary expenses after confirmation', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Groceries')

    // When — delete Groceries ($400 expense); expenses: 2100 → 1700
    await user.click(screen.getByRole('button', { name: 'Delete Groceries' }))
    await user.click(screen.getByRole('button', { name: /confirm delete/i }))

    // Then
    await waitFor(() => expect(screen.getByText('$1700.00')).toBeInTheDocument())
  })

  it('should edit item amount and reflect in summary', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Groceries')

    // When — edit Groceries ($400) → $700; expenses: 2100 → 2400
    vi.mocked(updateItem).mockResolvedValue({
      id: '4', description: 'Groceries', amount: 700, category: 'expense', date: '2023-11-08',
    })
    await user.click(screen.getByRole('button', { name: 'Edit Groceries' }))
    const amountInput = within(getModal()).getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '700')
    await user.click(within(getModal()).getByRole('button', { name: /save changes/i }))

    // Then — expenses card shows $2400.00
    await waitFor(() => {
      const expensesCard = screen.getByText('Expenses').closest('div') as HTMLElement
      expect(within(expensesCard).getByText('$2400.00')).toBeInTheDocument()
    })
  })
})

describe('Sort flows', () => {
  it('should display items newest-first by default (item with latest date appears first)', async () => {
    // Given — mockBudgetItems has Utilities on 2023-11-15 (latest date)
    render(<App />)
    await screen.findByText('Groceries')

    // When — default sort is date-desc (newest first)
    const listItems = screen.getAllByRole('listitem')

    // Then — first item in list should be the one with latest date (Utilities 2023-11-15)
    expect(listItems[0]).toHaveTextContent('Utilities')
  })

  it('should place highest-amount item first after switching sort to "amount-desc"', async () => {
    // Given — mockBudgetItems has Monthly Salary at $4000 (highest)
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Groceries')

    // When — change sort to Amount High–Low
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort transactions' }), 'amount-desc')

    // Then — first item should be Monthly Salary ($4000)
    const listItems = screen.getAllByRole('listitem')
    expect(listItems[0]).toHaveTextContent('Monthly Salary')
  })
})

describe('Analytics panel', () => {
  it('C1: Analytics button toggles AnalyticsPanel visibility', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Groceries')

    // When — click Analytics toggle button
    await user.click(screen.getByRole('button', { name: /analytics/i }))

    // Then — AnalyticsPanel is visible
    expect(screen.getByText('Monthly Trend')).toBeInTheDocument()

    // When — click Hide analytics to hide analytics
    await user.click(screen.getByRole('button', { name: /hide analytics/i }))

    // Then — AnalyticsPanel is hidden
    expect(screen.queryByText('Monthly Trend')).not.toBeInTheDocument()
  })

  it('C2: AnalyticsPanel shows correct savings rate calculated from mock items', async () => {
    // Given — mockData: totalSavings=800, totalIncome=5200 → rate=15.4%
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Groceries')

    // When — open analytics
    await user.click(screen.getByRole('button', { name: /analytics/i }))

    // Then — savings rate shown
    expect(screen.getByText('15.4%')).toBeInTheDocument()
  })
})

describe('Filter and search flows', () => {
  it('should filter by category and leave summary unchanged', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Groceries')

    // Verify summary before filter
    expect(screen.getByText('$2300.00')).toBeInTheDocument()

    // When — click Expense filter pill (in the filter bar, not in the form)
    const filterPills = screen.getAllByRole('button', { name: 'Expense' })
    const filterPill = filterPills.find(btn => !getForm().contains(btn))!
    await user.click(filterPill)

    // Then — summary is still full totals
    expect(screen.getByText('$2300.00')).toBeInTheDocument()
    expect(screen.queryByText('Monthly Salary')).not.toBeInTheDocument()
  })

  it('should search by description and leave summary unchanged', async () => {
    // Given
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Groceries')

    // When
    await user.type(screen.getByRole('searchbox'), 'rent')

    // Then — list filtered; summary still full
    expect(screen.getByText('Rent')).toBeInTheDocument()
    expect(screen.queryByText('Groceries')).not.toBeInTheDocument()
    expect(screen.getByText('$2300.00')).toBeInTheDocument()
  })
})
