import React from 'react'
import { render, fireEvent, act } from '@testing-library/react-native'

// Hoisting-safe mock definitions
const mockDismiss = jest.fn()
const mockSetGoalMutate = jest.fn()
const mockDeleteGoalMutate = jest.fn()
const mockUseGoals = jest.fn()

jest.mock('../../src/providers/AuthProvider', () => ({
  useAuth: () => ({ user: { id: 'user-1' } }),
}))
jest.mock('../../src/hooks/useGoals', () => ({
  useGoals: (...args: unknown[]) => mockUseGoals(...args),
  useSetGoal: () => ({ mutate: mockSetGoalMutate, isPending: false }),
  useDeleteGoal: () => ({ mutate: mockDeleteGoalMutate, isPending: false }),
}))
jest.mock('expo-router', () => ({ useRouter: () => ({ dismiss: mockDismiss }) }))
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'Success' },
}))
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}))
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: { getUser: jest.fn() },
  },
}))

import SetGoalsScreen from '../set-goals'
import type { BudgetGoal } from '../../../shared/types/budget'

const existingGoals: BudgetGoal[] = [
  { id: 'g1', category: 'income', targetAmount: 5000 },
]

describe('SetGoalsScreen (15)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseGoals.mockReturnValue({ data: existingGoals })
  })

  test('1. pre-fills income input from existing goal (value === "5000")', () => {
    // Given/When
    const { getByTestId } = render(<SetGoalsScreen />)
    // Then
    expect(getByTestId('income-input').props.value).toBe('5000')
  })

  test('2. expense and savings inputs are empty when no goals exist for those categories', () => {
    // Given/When
    const { getByTestId } = render(<SetGoalsScreen />)
    // Then
    expect(getByTestId('expense-input').props.value).toBe('')
    expect(getByTestId('savings-input').props.value).toBe('')
  })

  test('3. save button calls useSetGoal.mutate for each non-empty input', async () => {
    // Given
    const { getByTestId } = render(<SetGoalsScreen />)
    fireEvent.changeText(getByTestId('expense-input'), '2000')
    // When
    await act(async () => { fireEvent.press(getByTestId('save-button')) })
    // Then — income pre-filled to 5000, expense entered as 2000
    expect(mockSetGoalMutate).toHaveBeenCalledWith({ category: 'income', targetAmount: 5000 })
    expect(mockSetGoalMutate).toHaveBeenCalledWith({ category: 'expense', targetAmount: 2000 })
  })

  test('4. save button calls useDeleteGoal.mutate when a goal is cleared (input → "")', async () => {
    // Given — income has an existing goal (g1), user clears input
    const { getByTestId } = render(<SetGoalsScreen />)
    fireEvent.changeText(getByTestId('income-input'), '')
    // When
    await act(async () => { fireEvent.press(getByTestId('save-button')) })
    // Then
    expect(mockDeleteGoalMutate).toHaveBeenCalledWith('g1')
    expect(mockSetGoalMutate).not.toHaveBeenCalledWith(expect.objectContaining({ category: 'income' }))
  })

  test('5. cancel button calls router.dismiss() without calling any mutate', async () => {
    // Given
    const { getByTestId } = render(<SetGoalsScreen />)
    // When
    await act(async () => { fireEvent.press(getByTestId('cancel-button')) })
    // Then
    expect(mockDismiss).toHaveBeenCalled()
    expect(mockSetGoalMutate).not.toHaveBeenCalled()
    expect(mockDeleteGoalMutate).not.toHaveBeenCalled()
  })
})
