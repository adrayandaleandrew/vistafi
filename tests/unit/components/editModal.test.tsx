// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditModal } from '../../../src/components/EditModal'
import { BudgetItem } from '@shared/types/budget'

const makeItem = (overrides: Partial<BudgetItem> = {}): BudgetItem => ({
  id: 'item-1',
  description: 'Groceries',
  amount: 150,
  category: 'expense',
  date: '2024-01-01',
  ...overrides,
})

describe('EditModal', () => {
  it('should pre-fill description from item prop', () => {
    // Given
    const item = makeItem({ description: 'Rent' })
    // When
    render(<EditModal item={item} onSave={vi.fn()} onCancel={vi.fn()} />)
    // Then
    expect(screen.getByLabelText(/description/i)).toHaveValue('Rent')
  })

  it('should pre-fill amount from item prop', () => {
    // Given
    const item = makeItem({ amount: 1500 })
    // When
    render(<EditModal item={item} onSave={vi.fn()} onCancel={vi.fn()} />)
    // Then
    expect(screen.getByLabelText(/amount/i)).toHaveValue(1500)
  })

  it('should call onCancel when ESC key is pressed', async () => {
    // Given
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<EditModal item={makeItem()} onSave={vi.fn()} onCancel={onCancel} />)
    // When
    await user.keyboard('{Escape}')
    // Then
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('should call onCancel when backdrop is clicked', async () => {
    // Given
    const onCancel = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <EditModal item={makeItem()} onSave={vi.fn()} onCancel={onCancel} />
    )
    // When — click the backdrop (aria-hidden div)
    const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement
    await user.click(backdrop)
    // Then
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('should hide category dropdown when Income type is selected', async () => {
    // Given — item with expense category
    const item = makeItem({ category: 'expense' })
    const user = userEvent.setup()
    render(<EditModal item={item} onSave={vi.fn()} onCancel={vi.fn()} />)
    // When — switch to Income
    await user.click(screen.getByRole('button', { name: 'Income' }))
    // Then — category dropdown hidden
    expect(screen.queryByLabelText(/category/i)).not.toBeInTheDocument()
  })

  it('should show category dropdown when Expense type is selected', async () => {
    // Given — item with income category
    const item = makeItem({ category: 'income' })
    const user = userEvent.setup()
    render(<EditModal item={item} onSave={vi.fn()} onCancel={vi.fn()} />)
    // When — switch to Expense
    await user.click(screen.getByRole('button', { name: 'Expense' }))
    // Then — category dropdown visible
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
  })

  it('should call onSave with updated values when save button is clicked', async () => {
    // Given
    const onSave = vi.fn()
    const item = makeItem({ description: 'Groceries', amount: 150 })
    const user = userEvent.setup()
    render(<EditModal item={item} onSave={onSave} onCancel={vi.fn()} />)
    // When — clear and retype description
    const descInput = screen.getByLabelText(/description/i)
    await user.clear(descInput)
    await user.type(descInput, 'Supermarket')
    await user.click(screen.getByRole('button', { name: /save changes/i }))
    // Then
    expect(onSave).toHaveBeenCalledOnce()
    const saved = onSave.mock.calls[0][0]
    expect(saved.description).toBe('Supermarket')
    expect(saved.id).toBe(item.id)
  })
})
