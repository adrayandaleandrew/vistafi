import type { BudgetGoal } from '@shared/types/budget'

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: { getUser: jest.fn() },
  },
}))

import { fetchGoals, upsertGoal, deleteGoal } from '../goalService'
import { supabase } from '../../lib/supabase'

const mockFrom = supabase.from as jest.Mock
const mockGetUser = supabase.auth.getUser as jest.Mock

describe('goalService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('1. fetchGoals — maps target_amount → targetAmount; returns typed array', async () => {
    // Given
    const rows = [
      { id: 'g1', category: 'income', target_amount: 5000 },
      { id: 'g2', category: 'expense', target_amount: 2000 },
    ]
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: rows, error: null }),
      }),
    })
    // When
    const result = await fetchGoals()
    // Then
    const expected: BudgetGoal[] = [
      { id: 'g1', category: 'income', targetAmount: 5000 },
      { id: 'g2', category: 'expense', targetAmount: 2000 },
    ]
    expect(result).toEqual(expected)
  })

  test('2. fetchGoals — returns [] when data is null', async () => {
    // Given
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: null, error: null }),
      }),
    })
    // When
    const result = await fetchGoals()
    // Then
    expect(result).toEqual([])
  })

  test('3. fetchGoals — throws when supabase returns an error', async () => {
    // Given
    const supabaseError = new Error('Network error')
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: null, error: supabaseError }),
      }),
    })
    // When / Then
    await expect(fetchGoals()).rejects.toThrow('Network error')
  })

  test('4. upsertGoal — calls upsert with { user_id, category, target_amount }; returns mapped goal', async () => {
    // Given
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    const returned = { id: 'g3', category: 'savings', target_amount: 1500 }
    mockFrom.mockReturnValue({
      upsert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: returned, error: null }),
        }),
      }),
    })
    // When
    const result = await upsertGoal('savings', 1500)
    // Then
    expect(mockFrom).toHaveBeenCalledWith('budget_goals')
    const upsertFn = mockFrom.mock.results[0].value.upsert
    expect(upsertFn).toHaveBeenCalledWith(
      { user_id: 'user-1', category: 'savings', target_amount: 1500 },
      { onConflict: 'user_id,category' }
    )
    expect(result).toEqual({ id: 'g3', category: 'savings', targetAmount: 1500 })
  })

  test('5. deleteGoal — calls .delete().eq("id", id) and resolves void', async () => {
    // Given
    const eqMock = jest.fn().mockResolvedValue({ error: null })
    mockFrom.mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: eqMock,
      }),
    })
    // When
    await deleteGoal('g1')
    // Then
    expect(mockFrom).toHaveBeenCalledWith('budget_goals')
    expect(eqMock).toHaveBeenCalledWith('id', 'g1')
  })
})
