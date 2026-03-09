import { renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBudgetItems } from '../useBudgetItems'
import type { BudgetItem } from '@shared/types/budget'

// Mock budgetService
jest.mock('../../services/budgetService')
import * as budgetService from '../../services/budgetService'

// Mock supabase — define inline so factory captures jest.fn() at hoist time
jest.mock('../../lib/supabase', () => ({
  supabase: {
    channel: jest.fn(),
    removeChannel: jest.fn(),
  },
}))
import { supabase } from '../../lib/supabase'

const mockChannel = supabase.channel as jest.Mock
const mockRemoveChannel = supabase.removeChannel as jest.Mock
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
    // Set up chainable channel mock
    const mockSubscribe = jest.fn()
    const channelObj = {
      on: jest.fn().mockReturnThis(),
      subscribe: mockSubscribe,
    }
    mockChannel.mockReturnValue(channelObj)
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

  test('4. creates a Supabase Realtime channel on mount', () => {
    // Given
    mockFetchItems.mockImplementation(() => new Promise(() => {}))
    // When
    renderHook(() => useBudgetItems('user-123'), { wrapper: createWrapper() })
    // Then
    expect(mockChannel).toHaveBeenCalledWith('budget_items_user-123')
  })

  test('5. subscribes to postgres_changes with event * and table budget_items', () => {
    // Given
    mockFetchItems.mockImplementation(() => new Promise(() => {}))
    // When
    renderHook(() => useBudgetItems('user-123'), { wrapper: createWrapper() })
    // Then
    const channelInstance = mockChannel.mock.results[0].value
    expect(channelInstance.on).toHaveBeenCalledWith(
      'postgres_changes',
      expect.objectContaining({ event: '*', table: 'budget_items' }),
      expect.any(Function)
    )
  })

  test('6. calls queryClient.invalidateQueries when Realtime callback fires', async () => {
    // Given
    mockFetchItems.mockResolvedValue(mockItems)
    let capturedCallback: (() => void) | null = null
    const channelObj = {
      on: jest.fn().mockImplementation((_event: string, _filter: unknown, cb: () => void) => {
        capturedCallback = cb
        return channelObj
      }),
      subscribe: jest.fn(),
    }
    mockChannel.mockReturnValue(channelObj)

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children)

    renderHook(() => useBudgetItems('user-123'), { wrapper })
    // When — simulate Realtime event firing
    await waitFor(() => expect(capturedCallback).not.toBeNull())
    capturedCallback!()
    // Then
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['budgetItems', 'user-123'] })
    )
  })

  test('7. does not subscribe when userId is empty string', () => {
    // Given
    mockFetchItems.mockImplementation(() => new Promise(() => {}))
    // When
    renderHook(() => useBudgetItems(''), { wrapper: createWrapper() })
    // Then
    expect(mockChannel).not.toHaveBeenCalled()
  })

  test('8. calls supabase.removeChannel on unmount', () => {
    // Given
    mockFetchItems.mockImplementation(() => new Promise(() => {}))
    const channelObj = {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    }
    mockChannel.mockReturnValue(channelObj)
    // When
    const { unmount } = renderHook(() => useBudgetItems('user-123'), { wrapper: createWrapper() })
    unmount()
    // Then
    expect(mockRemoveChannel).toHaveBeenCalledWith(channelObj)
  })
})
