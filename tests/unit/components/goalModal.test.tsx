// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GoalModal } from '../../../src/components/GoalModal'
import { BudgetGoal } from '@shared/types/budget'

describe('GoalModal', () => {
  it('renders 3 labeled inputs: Income target, Expense limit, Savings goal', () => {
    // Given / When
    render(<GoalModal goals={[]} onSave={vi.fn()} onCancel={vi.fn()} />)
    // Then
    expect(screen.getByLabelText(/income target/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/expense limit/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/savings goal/i)).toBeInTheDocument()
  })

  it('pre-fills each input with existing goal targetAmount', () => {
    // Given
    const goals: BudgetGoal[] = [
      { id: 'g1', category: 'income', targetAmount: 5000 },
      { id: 'g2', category: 'expense', targetAmount: 2500 },
      { id: 'g3', category: 'savings', targetAmount: 1000 },
    ]
    // When
    render(<GoalModal goals={goals} onSave={vi.fn()} onCancel={vi.fn()} />)
    // Then
    expect(screen.getByLabelText(/income target/i)).toHaveValue(5000)
    expect(screen.getByLabelText(/expense limit/i)).toHaveValue(2500)
    expect(screen.getByLabelText(/savings goal/i)).toHaveValue(1000)
  })

  it('clicking Save calls onSave with correct updates array', async () => {
    // Given
    const user = userEvent.setup()
    const goals: BudgetGoal[] = [
      { id: 'g1', category: 'income', targetAmount: 5000 },
    ]
    const onSave = vi.fn()
    render(<GoalModal goals={goals} onSave={onSave} onCancel={vi.fn()} />)

    // When — change income target and save
    const incomeInput = screen.getByLabelText(/income target/i)
    await user.clear(incomeInput)
    await user.type(incomeInput, '6000')
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Then
    expect(onSave).toHaveBeenCalledTimes(1)
    const callArg = onSave.mock.calls[0][0] as Array<{ category: string; targetAmount: number | null }>
    const incomeUpdate = callArg.find(u => u.category === 'income')
    expect(incomeUpdate?.targetAmount).toBe(6000)
  })

  it('leaving an input empty means that category targetAmount is null in onSave payload', async () => {
    // Given
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<GoalModal goals={[]} onSave={onSave} onCancel={vi.fn()} />)

    // When — leave all inputs empty and save
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Then
    const callArg = onSave.mock.calls[0][0] as Array<{ category: string; targetAmount: number | null }>
    expect(callArg.every(u => u.targetAmount === null)).toBe(true)
  })

  it('clicking Cancel calls onCancel without calling onSave', async () => {
    // Given
    const user = userEvent.setup()
    const onSave = vi.fn()
    const onCancel = vi.fn()
    render(<GoalModal goals={[]} onSave={onSave} onCancel={onCancel} />)

    // When
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    // Then
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSave).not.toHaveBeenCalled()
  })
})
