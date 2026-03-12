import { renderHook, act, waitFor } from '@testing-library/react-native'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAddItem, useUpdateItem, useDeleteItem } from '../useBudgetMutations'
import type { BudgetItem } from '@shared/types/budget'

// Mock budgetService
jest.mock('../../services/budgetService')
import * as budgetService from '../../services/budgetService'

const mockAddItem = budgetService.addItem as jest.Mock
const mockUpdateItem = budgetService.updateItem as jest.Mock
const mockDeleteItem = budgetService.deleteItem as jest.Mock

const existingItem: BudgetItem = {
  id: '1',
  description: 'Rent',
  amount: 1200,
  category: 'expense',
  date: '2024-01-01',
}

const newItemInput = { description: 'Bonus', amount: 500, category: 'income' as const, date: '2024-01-15' }
const newItem: BudgetItem = { id: '2', ...newItemInput }

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  queryClient.setQueryData(['budgetItems', 'user-123'], [existingItem])
  return {
    queryClient,
    wrapper: ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children),
  }
}

describe('useAddItem', () => {
  beforeEach(() => jest.clearAllMocks())

  test('1. mutate calls budgetService.addItem', async () => {
    // Given
    mockAddItem.mockResolvedValue(newItem)
    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useAddItem('user-123'), { wrapper })
    // When
    act(() => { result.current.mutate(newItemInput) })
    // Then
    await waitFor(() => expect(mockAddItem).toHaveBeenCalledWith('user-123', newItemInput))
  })

  test('2. optimistic update: cache updated before server confirms', async () => {
    // Given
    let resolveAddItem!: (value: BudgetItem) => void
    mockAddItem.mockImplementation(
      () => new Promise((resolve) => { resolveAddItem = resolve })
    )
    const { wrapper, queryClient } = createWrapper()
    const { result } = renderHook(() => useAddItem('user-123'), { wrapper })
    // When - fire mutation (does not resolve yet)
    act(() => { result.current.mutate(newItemInput) })
    // Then - optimistic update applied immediately
    await waitFor(() => {
      const cache = queryClient.getQueryData<BudgetItem[]>(['budgetItems', 'user-123'])
      expect(cache?.some((i) => i.description === 'Bonus')).toBe(true)
    })
    // Cleanup
    resolveAddItem(newItem)
  })

  test('3. rollback: cache reverts on error', async () => {
    // Given
    mockAddItem.mockRejectedValue(new Error('Server error'))
    const { wrapper, queryClient } = createWrapper()
    const { result } = renderHook(() => useAddItem('user-123'), { wrapper })
    // When
    act(() => { result.current.mutate(newItemInput) })
    // Then - cache reverts to original
    await waitFor(() => {
      const cache = queryClient.getQueryData<BudgetItem[]>(['budgetItems', 'user-123'])
      expect(cache).toEqual([existingItem])
    })
  })

  test('4. invalidateQueries called on settled', async () => {
    // Given
    mockAddItem.mockResolvedValue(newItem)
    const { wrapper, queryClient } = createWrapper()
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useAddItem('user-123'), { wrapper })
    // When
    act(() => { result.current.mutate(newItemInput) })
    // Then
    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ['budgetItems', 'user-123'] }))
  })
})

describe('useUpdateItem', () => {
  beforeEach(() => jest.clearAllMocks())

  test('5. mutate calls budgetService.updateItem', async () => {
    // Given
    const updated = { ...existingItem, amount: 1300 }
    mockUpdateItem.mockResolvedValue(updated)
    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useUpdateItem('user-123'), { wrapper })
    // When
    act(() => { result.current.mutate(updated) })
    // Then
    await waitFor(() => expect(mockUpdateItem).toHaveBeenCalledWith(updated))
  })

  test('6. optimistic update applied for useUpdateItem', async () => {
    // Given
    let resolveUpdate!: (v: BudgetItem) => void
    mockUpdateItem.mockImplementation(() => new Promise((r) => { resolveUpdate = r }))
    const { wrapper, queryClient } = createWrapper()
    const { result } = renderHook(() => useUpdateItem('user-123'), { wrapper })
    const updated = { ...existingItem, amount: 9999 }
    // When
    act(() => { result.current.mutate(updated) })
    // Then
    await waitFor(() => {
      const cache = queryClient.getQueryData<BudgetItem[]>(['budgetItems', 'user-123'])
      expect(cache?.find((i) => i.id === '1')?.amount).toBe(9999)
    })
    resolveUpdate(updated)
  })

  test('7. rollback on useUpdateItem error', async () => {
    // Given
    mockUpdateItem.mockRejectedValue(new Error('fail'))
    const { wrapper, queryClient } = createWrapper()
    const { result } = renderHook(() => useUpdateItem('user-123'), { wrapper })
    // When
    act(() => { result.current.mutate({ ...existingItem, amount: 9999 }) })
    // Then
    await waitFor(() => {
      const cache = queryClient.getQueryData<BudgetItem[]>(['budgetItems', 'user-123'])
      expect(cache).toEqual([existingItem])
    })
  })
})

describe('useDeleteItem', () => {
  beforeEach(() => jest.clearAllMocks())

  test('8. mutate calls budgetService.deleteItem', async () => {
    // Given
    mockDeleteItem.mockResolvedValue(undefined)
    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useDeleteItem('user-123'), { wrapper })
    // When
    act(() => { result.current.mutate('1') })
    // Then
    await waitFor(() => expect(mockDeleteItem).toHaveBeenCalledWith('1'))
  })

  test('9. invalidateQueries called on settled for useDeleteItem', async () => {
    // Given
    mockDeleteItem.mockResolvedValue(undefined)
    const { wrapper, queryClient } = createWrapper()
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteItem('user-123'), { wrapper })
    // When
    act(() => { result.current.mutate('1') })
    // Then
    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ['budgetItems', 'user-123'] }))
  })
})
