import React from 'react'
import { render, fireEvent, act } from '@testing-library/react-native'

// Mock useAuth
const mockUser = { id: 'user-123', email: 'user@example.com' }
jest.mock('../../../src/providers/AuthProvider', () => ({
  useAuth: () => ({ user: mockUser }),
}))

// Mock useAddItem
const mockMutate = jest.fn()
jest.mock('../../../src/hooks/useBudgetMutations', () => ({
  useAddItem: () => ({ mutate: mockMutate, isPending: false }),
}))

// Mock expo-router
const mockReplace = jest.fn()
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
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

import AddScreen from '../add'

describe('AddScreen (12.6)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('1. renders description input, amount input, and submit button', () => {
    // Given/When
    const { getByTestId } = render(<AddScreen />)
    // Then
    expect(getByTestId('description-input')).toBeTruthy()
    expect(getByTestId('amount-input')).toBeTruthy()
    expect(getByTestId('submit-button')).toBeTruthy()
  })

  test('2. submit button has minHeight 44 (touch target)', () => {
    // Given/When
    const { getByTestId } = render(<AddScreen />)
    const btn = getByTestId('submit-button')
    // Then
    const style = btn.props.style
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style
    expect(flatStyle.minHeight).toBe(44)
  })

  test('3. renders three category Pressables: income, expense, savings', () => {
    // Given/When
    const { getByTestId } = render(<AddScreen />)
    // Then
    expect(getByTestId('category-income')).toBeTruthy()
    expect(getByTestId('category-expense')).toBeTruthy()
    expect(getByTestId('category-savings')).toBeTruthy()
  })

  test('4. does NOT call mutate when description is empty', async () => {
    // Given
    const { getByTestId } = render(<AddScreen />)
    fireEvent.changeText(getByTestId('amount-input'), '100')
    // When
    await act(async () => { fireEvent.press(getByTestId('submit-button')) })
    // Then
    expect(mockMutate).not.toHaveBeenCalled()
  })

  test('5. does NOT call mutate when amount is zero or invalid', async () => {
    // Given
    const { getByTestId } = render(<AddScreen />)
    fireEvent.changeText(getByTestId('description-input'), 'Groceries')
    fireEvent.changeText(getByTestId('amount-input'), '0')
    // When
    await act(async () => { fireEvent.press(getByTestId('submit-button')) })
    // Then
    expect(mockMutate).not.toHaveBeenCalled()
  })

  test('6. calls mutate with correct payload on valid form submit', async () => {
    // Given
    mockMutate.mockImplementation((_vars: unknown, opts: { onSuccess?: () => void }) => {
      opts?.onSuccess?.()
    })
    const { getByTestId } = render(<AddScreen />)
    fireEvent.changeText(getByTestId('description-input'), 'Groceries')
    fireEvent.changeText(getByTestId('amount-input'), '75.50')
    // income is default category
    // When
    await act(async () => { fireEvent.press(getByTestId('submit-button')) })
    // Then
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Groceries',
        amount: 75.5,
        category: 'income',
      }),
      expect.any(Object)
    )
  })

  test('7. navigates to /(tabs) on successful submission', async () => {
    // Given
    mockMutate.mockImplementation((_vars: unknown, opts: { onSuccess?: () => void }) => {
      opts?.onSuccess?.()
    })
    const { getByTestId } = render(<AddScreen />)
    fireEvent.changeText(getByTestId('description-input'), 'Salary')
    fireEvent.changeText(getByTestId('amount-input'), '2000')
    // When
    await act(async () => { fireEvent.press(getByTestId('submit-button')) })
    // Then
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)')
  })

  test('8. shows validation error text when submitting empty form', async () => {
    // Given
    const { getByTestId } = render(<AddScreen />)
    // When
    await act(async () => { fireEvent.press(getByTestId('submit-button')) })
    // Then
    expect(getByTestId('validation-error')).toBeTruthy()
  })

  test('9. selecting a category Pressable updates active category style', () => {
    // Given
    const { getByTestId } = render(<AddScreen />)
    // When — press expense
    fireEvent.press(getByTestId('category-expense'))
    // Then — expense should be selected (no error thrown, state updated)
    // We verify by checking that submit now uses 'expense' category
    fireEvent.changeText(getByTestId('description-input'), 'Rent')
    fireEvent.changeText(getByTestId('amount-input'), '1200')
    act(() => { fireEvent.press(getByTestId('submit-button')) })
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'expense' }),
      expect.any(Object)
    )
  })
})
