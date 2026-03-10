import React from 'react'
import { render, fireEvent, act } from '@testing-library/react-native'

// Mock useAuth
const mockUser = { id: 'user-123', email: 'user@example.com' }
jest.mock('../../../src/providers/AuthProvider', () => ({
  useAuth: () => ({ user: mockUser }),
}))

// Mock useBudgetItems
const mockUseBudgetItems = jest.fn()
jest.mock('../../../src/hooks/useBudgetItems', () => ({
  useBudgetItems: (...args: unknown[]) => mockUseBudgetItems(...args),
}))

// Mock useBudgetMutations
const mockDeleteMutate = jest.fn()
jest.mock('../../../src/hooks/useBudgetMutations', () => ({
  useDeleteItem: () => ({ mutate: mockDeleteMutate, isPending: false }),
}))

// Mock expo-router
const mockPush = jest.fn()
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}))

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'Medium' },
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'Success' },
}))

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  return Reanimated
})

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}))

import HistoryScreen from '../history'
import type { BudgetItem } from '../../../../shared/types/budget'

const mockItems: BudgetItem[] = [
  { id: '1', description: 'Salary', amount: 5000, category: 'income', date: '2024-01-15' },
  { id: '2', description: 'Rent', amount: 1200, category: 'expense', date: '2024-01-10' },
  { id: '3', description: 'Savings fund', amount: 500, category: 'savings', date: '2024-01-05' },
]

describe('HistoryScreen (12.7)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseBudgetItems.mockReturnValue({
      isLoading: false,
      data: mockItems,
      isError: false,
      refetch: jest.fn(),
    })
  })

  test('1. renders search input', () => {
    // Given/When
    const { getByTestId } = render(<HistoryScreen />)
    // Then
    expect(getByTestId('search-input')).toBeTruthy()
  })

  test('2. renders category filter pills: all, income, expense, savings', () => {
    // Given/When
    const { getByTestId } = render(<HistoryScreen />)
    // Then
    expect(getByTestId('filter-all')).toBeTruthy()
    expect(getByTestId('filter-income')).toBeTruthy()
    expect(getByTestId('filter-expense')).toBeTruthy()
    expect(getByTestId('filter-savings')).toBeTruthy()
  })

  test('3. renders all transaction items in the list', () => {
    // Given/When
    const { getAllByTestId } = render(<HistoryScreen />)
    // Then
    expect(getAllByTestId(/^transaction-item-/).length).toBe(3)
  })

  test('4. filters list by search text (case-insensitive)', () => {
    // Given
    const { getByTestId, getAllByTestId } = render(<HistoryScreen />)
    // When
    fireEvent.changeText(getByTestId('search-input'), 'salary')
    // Then
    expect(getAllByTestId(/^transaction-item-/).length).toBe(1)
  })

  test('5. filters list by category when income pill is pressed', () => {
    // Given
    const { getByTestId, getAllByTestId } = render(<HistoryScreen />)
    // When
    fireEvent.press(getByTestId('filter-income'))
    // Then
    expect(getAllByTestId(/^transaction-item-/).length).toBe(1)
  })

  test('6. shows empty state when no items match filter', () => {
    // Given
    const { getByTestId } = render(<HistoryScreen />)
    // When — search for something that doesn't exist
    fireEvent.changeText(getByTestId('search-input'), 'xyznotfound')
    // Then
    expect(getByTestId('empty-state')).toBeTruthy()
  })

  test('7. navigates to edit-transaction on edit action from long-press menu', async () => {
    // Given
    const { getAllByTestId, getByTestId } = render(<HistoryScreen />)
    // When — long press first item
    fireEvent(getAllByTestId(/^transaction-item-/)[0], 'longPress')
    // press Edit in action sheet (via testID)
    await act(async () => {
      fireEvent.press(getByTestId('action-edit'))
    })
    // Then
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/edit-transaction' })
    )
  })

  test('8. calls deleteItem mutate with item id on delete action', async () => {
    // Given
    const { getAllByTestId, getByTestId } = render(<HistoryScreen />)
    // When — long press first item, then delete
    fireEvent(getAllByTestId(/^transaction-item-/)[0], 'longPress')
    await act(async () => {
      fireEvent.press(getByTestId('action-delete'))
    })
    // Then
    expect(mockDeleteMutate).toHaveBeenCalledWith('1', expect.any(Object))
  })

  test('9. "all" filter pill shows all items after category filter applied', () => {
    // Given
    const { getByTestId, getAllByTestId } = render(<HistoryScreen />)
    fireEvent.press(getByTestId('filter-expense'))
    expect(getAllByTestId(/^transaction-item-/).length).toBe(1)
    // When
    fireEvent.press(getByTestId('filter-all'))
    // Then
    expect(getAllByTestId(/^transaction-item-/).length).toBe(3)
  })
})
