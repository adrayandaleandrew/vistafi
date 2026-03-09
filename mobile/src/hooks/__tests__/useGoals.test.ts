import { renderHook, act, waitFor } from '@testing-library/react-native'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGoals, useSetGoal, useDeleteGoal } from '../useGoals'
import type { BudgetGoal } from '@shared/types/budget'

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: { getUser: jest.fn() },
  },
}))

jest.mock('../../services/goalService')
import * as goalService from '../../services/goalService'

const mockFetchGoals = goalService.fetchGoals as jest.Mock
const mockUpsertGoal = goalService.upsertGoal as jest.Mock
const mockDeleteGoal = goalService.deleteGoal as jest.Mock

const existingGoal: BudgetGoal = { id: 'g1', category: 'income', targetAmount: 5000 }

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  queryClient.setQueryData(['goals', 'user-1'], [existingGoal])
  return {
    queryClient,
    wrapper: ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children),
  }
}

describe('useGoals', () => {
  beforeEach(() => jest.clearAllMocks())

  test('1. useGoals — returns data from fetchGoals', async () => {
    // Given
    const goals: BudgetGoal[] = [{ id: 'g1', category: 'income', targetAmount: 5000 }]
    mockFetchGoals.mockResolvedValue(goals)
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    // When
    const { result } = renderHook(() => useGoals('user-1'), { wrapper })
    // Then
    await waitFor(() => expect(result.current.data).toEqual(goals))
  })

  test('2. useSetGoal — mutate calls upsertGoal with correct args', async () => {
    // Given
    const updatedGoal: BudgetGoal = { id: 'g2', category: 'savings', targetAmount: 1500 }
    mockUpsertGoal.mockResolvedValue(updatedGoal)
    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useSetGoal('user-1'), { wrapper })
    // When
    act(() => { result.current.mutate({ category: 'savings', targetAmount: 1500 }) })
    // Then
    await waitFor(() => expect(mockUpsertGoal).toHaveBeenCalledWith('savings', 1500))
  })

  test('3. useSetGoal — optimistic update: replaces matching-category entry before server confirms', async () => {
    // Given
    let resolveUpsert!: (v: BudgetGoal) => void
    mockUpsertGoal.mockImplementation(
      () => new Promise((resolve) => { resolveUpsert = resolve })
    )
    const { wrapper, queryClient } = createWrapper()
    const { result } = renderHook(() => useSetGoal('user-1'), { wrapper })
    // When — fire mutation (does not resolve yet)
    act(() => { result.current.mutate({ category: 'income', targetAmount: 9000 }) })
    // Then — optimistic update applied immediately
    await waitFor(() => {
      const cache = queryClient.getQueryData<BudgetGoal[]>(['goals', 'user-1'])
      const updated = cache?.find(g => g.category === 'income')
      expect(updated?.targetAmount).toBe(9000)
    })
    // Cleanup
    resolveUpsert({ id: 'g1', category: 'income', targetAmount: 9000 })
  })

  test('4. useSetGoal — rolls back cache when upsertGoal rejects', async () => {
    // Given
    mockUpsertGoal.mockRejectedValue(new Error('Server error'))
    const { wrapper, queryClient } = createWrapper()
    const { result } = renderHook(() => useSetGoal('user-1'), { wrapper })
    // When
    act(() => { result.current.mutate({ category: 'income', targetAmount: 9000 }) })
    // Then — cache reverts to original
    await waitFor(() => {
      const cache = queryClient.getQueryData<BudgetGoal[]>(['goals', 'user-1'])
      expect(cache).toEqual([existingGoal])
    })
  })

  test('5. useDeleteGoal — mutate calls deleteGoal with correct id', async () => {
    // Given
    mockDeleteGoal.mockResolvedValue(undefined)
    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useDeleteGoal('user-1'), { wrapper })
    // When
    act(() => { result.current.mutate('g1') })
    // Then
    await waitFor(() => expect(mockDeleteGoal).toHaveBeenCalledWith('g1', expect.anything()))
  })
})
