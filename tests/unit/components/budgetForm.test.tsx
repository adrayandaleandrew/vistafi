// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BudgetForm } from '../../../src/components/BudgetForm'

describe('BudgetForm', () => {
  it('should render the form with amount and description inputs', () => {
    // Given / When
    render(<BudgetForm onAddItem={vi.fn()} />)
    // Then
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument()
  })

  it('should call onAddItem with correct BudgetItem shape when form is submitted', async () => {
    // Given
    const onAddItem = vi.fn()
    const user = userEvent.setup()
    render(<BudgetForm onAddItem={onAddItem} />)
    // When
    await user.click(screen.getByRole('button', { name: 'Income' }))
    await user.type(screen.getByLabelText(/amount/i), '500')
    await user.type(screen.getByLabelText(/description/i), 'Salary')
    await user.click(screen.getByRole('button', { name: /add transaction/i }))
    // Then
    expect(onAddItem).toHaveBeenCalledOnce()
    const item = onAddItem.mock.calls[0][0]
    expect(item.description).toBe('Salary')
    expect(item.amount).toBe(500)
    expect(item.category).toBe('income')
    expect(item.id).toBeTruthy()
    expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('should not call onAddItem when description is empty', async () => {
    // Given
    const onAddItem = vi.fn()
    const user = userEvent.setup()
    render(<BudgetForm onAddItem={onAddItem} />)
    // When
    await user.type(screen.getByLabelText(/amount/i), '100')
    await user.click(screen.getByRole('button', { name: /add transaction/i }))
    // Then
    expect(onAddItem).not.toHaveBeenCalled()
  })

  it('should not call onAddItem when amount is zero', async () => {
    // Given
    const onAddItem = vi.fn()
    const user = userEvent.setup()
    render(<BudgetForm onAddItem={onAddItem} />)
    // When
    await user.type(screen.getByLabelText(/description/i), 'Test')
    await user.type(screen.getByLabelText(/amount/i), '0')
    await user.click(screen.getByRole('button', { name: /add transaction/i }))
    // Then
    expect(onAddItem).not.toHaveBeenCalled()
  })

  it('should not call onAddItem when amount is negative', async () => {
    // Given
    const onAddItem = vi.fn()
    const user = userEvent.setup()
    render(<BudgetForm onAddItem={onAddItem} />)
    // When
    await user.type(screen.getByLabelText(/description/i), 'Test')
    await user.type(screen.getByLabelText(/amount/i), '-50')
    await user.click(screen.getByRole('button', { name: /add transaction/i }))
    // Then
    expect(onAddItem).not.toHaveBeenCalled()
  })

  it('should submit savings category when Savings is selected from category dropdown', async () => {
    // Given
    const onAddItem = vi.fn()
    const user = userEvent.setup()
    render(<BudgetForm onAddItem={onAddItem} />)
    // When — Expense is default type, switch category to Savings
    await user.selectOptions(screen.getByLabelText(/category/i), 'savings')
    await user.type(screen.getByLabelText(/amount/i), '100')
    await user.type(screen.getByLabelText(/description/i), 'Emergency Fund')
    await user.click(screen.getByRole('button', { name: /add transaction/i }))
    // Then
    expect(onAddItem).toHaveBeenCalledOnce()
    expect(onAddItem.mock.calls[0][0].category).toBe('savings')
  })

  it('should show success confirmation after adding a transaction', async () => {
    // Given
    const user = userEvent.setup()
    render(<BudgetForm onAddItem={vi.fn()} />)
    // When
    await user.type(screen.getByLabelText(/amount/i), '100')
    await user.type(screen.getByLabelText(/description/i), 'Test item')
    await user.click(screen.getByRole('button', { name: /add transaction/i }))
    // Then
    expect(screen.getByRole('status')).toHaveTextContent(/transaction added/i)
  })

  // --- Date picker tests (Task 13.2) ---

  it('should render a date input labeled "Date"', () => {
    // Given / When
    render(<BudgetForm onAddItem={vi.fn()} />)
    // Then
    expect(screen.getByLabelText('Date')).toBeInTheDocument()
  })

  it('should render date input with type="date"', () => {
    // Given / When
    render(<BudgetForm onAddItem={vi.fn()} />)
    // Then
    const dateInput = screen.getByLabelText('Date') as HTMLInputElement
    expect(dateInput.type).toBe('date')
  })

  it('should default date input to today\'s ISO date string (YYYY-MM-DD)', () => {
    // Given
    const today = new Date().toISOString().split('T')[0]
    // When
    render(<BudgetForm onAddItem={vi.fn()} />)
    // Then
    const dateInput = screen.getByLabelText('Date') as HTMLInputElement
    expect(dateInput.value).toBe(today)
  })

  it('should submit item with the date shown in the date input (not hardcoded Date.now())', async () => {
    // Given
    const onAddItem = vi.fn()
    const user = userEvent.setup()
    render(<BudgetForm onAddItem={onAddItem} />)
    const dateInput = screen.getByLabelText('Date')
    // When — change date to a past date
    await user.clear(dateInput)
    await user.type(dateInput, '2023-06-15')
    await user.type(screen.getByLabelText(/amount/i), '250')
    await user.type(screen.getByLabelText(/description/i), 'Backdated Payment')
    await user.click(screen.getByRole('button', { name: /add transaction/i }))
    // Then — submitted item date must match what was typed, not today
    expect(onAddItem).toHaveBeenCalledOnce()
    const item = onAddItem.mock.calls[0][0]
    expect(item.date).toBe('2023-06-15')
  })
})
