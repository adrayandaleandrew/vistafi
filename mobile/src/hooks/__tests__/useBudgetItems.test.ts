import { renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBudgetItems } from '../useBudgetItems'
import type { BudgetItem } from '@shared/types/budget'

// Mock budgetService
jest.mock('../../services/budgetService')
import * as budgetService from '../../services/budgetService'

const mockFetchItems = budgetService.fetchItems as jest.Mock

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockItems: BudgetItem[] = [
  { id: '1', description: 'Salary', amount: 5000, category: 'income', date: '2024-01-01' },
]

describe('useBudgetItems', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('1. returns isLoading true on initial mount', () => {
    // Given
    mockFetchItems.mockImplementation(() => new Promise(() => {}))
    // When
    const { result } = renderHook(() => useBudgetItems('user-123'), {
      wrapper: createWrapper(),
    })
    // Then
    expect(result.current.isLoading).toBe(true)
  })

  test('2. returns data array when fetchItems resolves', async () => {
    // Given
    mockFetchItems.mockResolvedValue(mockItems)
    // When
    const { result } = renderHook(() => useBudgetItems('user-123'), {
      wrapper: createWrapper(),
    })
    // Then
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockItems)
  })

  test('3. returns isError true when fetchItems rejects', async () => {
    // Given
    mockFetchItems.mockRejectedValue(new Error('Network error'))
    // When
    const { result } = renderHook(() => useBudgetItems('user-123'), {
      wrapper: createWrapper(),
    })
    // Then
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
