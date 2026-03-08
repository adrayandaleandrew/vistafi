// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BudgetItemList } from '../../../src/components/BudgetItemList'
import { BudgetItem } from '@shared/types/budget'

const makeItem = (overrides: Partial<BudgetItem> = {}): BudgetItem => ({
  id: 'item-1',
  description: 'Test Item',
  amount: 100,
  category: 'expense',
  date: '2024-01-01',
  ...overrides,
})

describe('BudgetItemList', () => {
  it('should render all items when given a non-empty list', () => {
    // Given
    const items = [
      makeItem({ id: '1', description: 'Rent' }),
      makeItem({ id: '2', description: 'Groceries' }),
    ]
    // When
    render(<BudgetItemList items={items} onDeleteItem={vi.fn()} onEditItem={vi.fn()} />)
    // Then
    expect(screen.getByText('Rent')).toBeInTheDocument()
    expect(screen.getByText('Groceries')).toBeInTheDocument()
  })

  it('should show empty state message when items array is empty', () => {
    // Given / When
    render(<BudgetItemList items={[]} onDeleteItem={vi.fn()} onEditItem={vi.fn()} />)
    // Then
    expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument()
  })

  it('should call onEditItem with the correct item when edit button is clicked', async () => {
    // Given
    const item = makeItem({ description: 'Salary', category: 'income' })
    const onEditItem = vi.fn()
    const user = userEvent.setup()
    render(<BudgetItemList items={[item]} onDeleteItem={vi.fn()} onEditItem={onEditItem} />)
    // When
    await user.click(screen.getByRole('button', { name: `Edit ${item.description}` }))
    // Then
    expect(onEditItem).toHaveBeenCalledWith(item)
  })

  it('should show confirm button on first delete click, not immediately delete', async () => {
    // Given
    const item = makeItem({ id: 'abc123', description: 'Utilities' })
    const onDeleteItem = vi.fn()
    const user = userEvent.setup()
    render(<BudgetItemList items={[item]} onDeleteItem={onDeleteItem} onEditItem={vi.fn()} />)
    // When — first click
    await user.click(screen.getByRole('button', { name: `Delete ${item.description}` }))
    // Then — not deleted yet, confirm button appears
    expect(onDeleteItem).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /confirm delete/i })).toBeInTheDocument()
  })

  it('should call onDeleteItem with the correct item id on confirm click', async () => {
    // Given
    const item = makeItem({ id: 'abc123', description: 'Utilities' })
    const onDeleteItem = vi.fn()
    const user = userEvent.setup()
    render(<BudgetItemList items={[item]} onDeleteItem={onDeleteItem} onEditItem={vi.fn()} />)
    // When — two-step delete
    await user.click(screen.getByRole('button', { name: `Delete ${item.description}` }))
    await user.click(screen.getByRole('button', { name: /confirm delete/i }))
    // Then
    expect(onDeleteItem).toHaveBeenCalledWith('abc123')
  })

  it('should cancel pending delete when cancel button is clicked', async () => {
    // Given
    const item = makeItem({ description: 'Utilities' })
    const onDeleteItem = vi.fn()
    const user = userEvent.setup()
    render(<BudgetItemList items={[item]} onDeleteItem={onDeleteItem} onEditItem={vi.fn()} />)
    // When
    await user.click(screen.getByRole('button', { name: `Delete ${item.description}` }))
    await user.click(screen.getByRole('button', { name: /cancel delete/i }))
    // Then
    expect(onDeleteItem).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: /confirm delete/i })).not.toBeInTheDocument()
  })
})
