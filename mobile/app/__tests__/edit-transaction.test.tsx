import React from 'react'
import { render, fireEvent, act } from '@testing-library/react-native'

// Mock useAuth
const mockUser = { id: 'user-123', email: 'user@example.com' }
jest.mock('../../src/providers/AuthProvider', () => ({
  useAuth: () => ({ user: mockUser }),
}))

// Mock useUpdateItem
const mockUpdateMutate = jest.fn()
jest.mock('../../src/hooks/useBudgetMutations', () => ({
  useUpdateItem: () => ({ mutate: mockUpdateMutate, isPending: false }),
}))

// Mock expo-router (local params carry the item to edit)
const mockDismiss = jest.fn()
const mockLocalSearchParams = {
  id: 'item-1',
  description: 'Old Rent',
  amount: '1200',
  category: 'expense',
  date: '2024-01-10',
}
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockLocalSearchParams,
  useRouter: () => ({ dismiss: mockDismiss, back: mockDismiss }),
}))

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
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

import EditTransactionScreen from '../edit-transaction'

describe('EditTransactionScreen (12.7)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('1. pre-fills description from route params', () => {
    // Given/When
    const { getByTestId } = render(<EditTransactionScreen />)
    // Then
    expect(getByTestId('description-input').props.value).toBe('Old Rent')
  })

  test('2. pre-fills amount from route params', () => {
    // Given/When
    const { getByTestId } = render(<EditTransactionScreen />)
    // Then
    expect(getByTestId('amount-input').props.value).toBe('1200')
  })

  test('3. pre-fills category from route params (expense selected)', () => {
    // Given/When
    const { getByTestId } = render(<EditTransactionScreen />)
    // Then — category-expense should have selected style
    expect(getByTestId('category-expense')).toBeTruthy()
  })

  test('4. save button has minHeight 44 (touch target)', () => {
    // Given/When
    const { getByTestId } = render(<EditTransactionScreen />)
    const btn = getByTestId('submit-button')
    const style = btn.props.style
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style
    // Then
    expect(flatStyle.minHeight).toBe(44)
  })

  test('5. calls useUpdateItem mutate with updated fields on save', async () => {
    // Given
    mockUpdateMutate.mockImplementation((_vars: unknown, opts: { onSuccess?: () => void }) => {
      opts?.onSuccess?.()
    })
    const { getByTestId } = render(<EditTransactionScreen />)
    fireEvent.changeText(getByTestId('description-input'), 'New Rent')
    fireEvent.changeText(getByTestId('amount-input'), '1400')
    // When
    await act(async () => { fireEvent.press(getByTestId('submit-button')) })
    // Then
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'item-1',
        description: 'New Rent',
        amount: 1400,
        category: 'expense',
      }),
      expect.any(Object)
    )
  })

  test('6. dismisses modal on successful save', async () => {
    // Given
    mockUpdateMutate.mockImplementation((_vars: unknown, opts: { onSuccess?: () => void }) => {
      opts?.onSuccess?.()
    })
    const { getByTestId } = render(<EditTransactionScreen />)
    // When
    await act(async () => { fireEvent.press(getByTestId('submit-button')) })
    // Then
    expect(mockDismiss).toHaveBeenCalled()
  })

  test('7. cancel button dismisses without saving', async () => {
    // Given
    const { getByTestId } = render(<EditTransactionScreen />)
    // When
    await act(async () => { fireEvent.press(getByTestId('cancel-button')) })
    // Then
    expect(mockDismiss).toHaveBeenCalled()
    expect(mockUpdateMutate).not.toHaveBeenCalled()
  })

  test('8. shows validation error when description is cleared and saved', async () => {
    // Given
    const { getByTestId } = render(<EditTransactionScreen />)
    fireEvent.changeText(getByTestId('description-input'), '')
    // When
    await act(async () => { fireEvent.press(getByTestId('submit-button')) })
    // Then
    expect(getByTestId('validation-error')).toBeTruthy()
    expect(mockUpdateMutate).not.toHaveBeenCalled()
  })
})
