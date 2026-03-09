import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react-native'

// Mock useAuth
const mockUser = { id: 'user-123', email: 'user@example.com' }
jest.mock('../../../src/providers/AuthProvider', () => ({
  useAuth: () => ({ user: mockUser, signOut: jest.fn() }),
}))

// Mock useBudgetItems
const mockUseBudgetItems = jest.fn()
jest.mock('../../../src/hooks/useBudgetItems', () => ({
  useBudgetItems: (...args: unknown[]) => mockUseBudgetItems(...args),
}))

// Mock useBudgetMutations (not needed on Dashboard but imported via deps)
jest.mock('../../../src/hooks/useBudgetMutations', () => ({
  useDeleteItem: () => ({ mutate: jest.fn(), isPending: false }),
}))

// Mock useGoals (Phase 15)
const mockUseGoals = jest.fn()
jest.mock('../../../src/hooks/useGoals', () => ({
  useGoals: (...args: unknown[]) => mockUseGoals(...args),
}))

// Mock expo-router
const mockPush = jest.fn()
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}))

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock @shopify/flash-list
jest.mock('@shopify/flash-list', () => {
  const { FlatList } = require('react-native')
  return { FlashList: FlatList }
})

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  return Reanimated
})

import DashboardScreen from '../index'
import type { BudgetItem } from '../../../../shared/types/budget'

const mockItems: BudgetItem[] = [
  { id: '1', description: 'Salary', amount: 5000, category: 'income', date: '2024-01-15' },
  { id: '2', description: 'Rent', amount: 1200, category: 'expense', date: '2024-01-10' },
  { id: '3', description: 'Savings fund', amount: 500, category: 'savings', date: '2024-01-05' },
]

describe('DashboardScreen (12.5)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseGoals.mockReturnValue({ data: [] })
  })

  test('1. shows loading indicator when isLoading is true', () => {
    // Given
    mockUseBudgetItems.mockReturnValue({ isLoading: true, data: undefined, isError: false, refetch: jest.fn() })
    // When
    const { getByTestId } = render(<DashboardScreen />)
    // Then
    expect(getByTestId('loading-indicator')).toBeTruthy()
  })

  test('2. renders summary cards: balance, income, expenses, savings', () => {
    // Given
    mockUseBudgetItems.mockReturnValue({ isLoading: false, data: mockItems, isError: false, refetch: jest.fn() })
    // When
    const { getByTestId } = render(<DashboardScreen />)
    // Then
    expect(getByTestId('summary-balance')).toBeTruthy()
    expect(getByTestId('summary-income')).toBeTruthy()
    expect(getByTestId('summary-expenses')).toBeTruthy()
    expect(getByTestId('summary-savings')).toBeTruthy()
  })

  test('3. balance card shows correct calculated balance ($3300.00)', () => {
    // Given — balance = 5000 - 1200 - 500 = 3300
    mockUseBudgetItems.mockReturnValue({ isLoading: false, data: mockItems, isError: false, refetch: jest.fn() })
    // When
    const { getByTestId } = render(<DashboardScreen />)
    // Then
    expect(getByTestId('summary-balance').props.children).toContain('$3300.00')
  })

  test('4. shows FlashList with transaction items', () => {
    // Given
    mockUseBudgetItems.mockReturnValue({ isLoading: false, data: mockItems, isError: false, refetch: jest.fn() })
    // When
    const { getAllByTestId } = render(<DashboardScreen />)
    // Then — each TransactionItem has testID
    expect(getAllByTestId(/^transaction-item-/).length).toBe(3)
  })

  test('5. shows empty state ternary when data is empty (not &&)', () => {
    // Given
    mockUseBudgetItems.mockReturnValue({ isLoading: false, data: [], isError: false, refetch: jest.fn() })
    // When
    const { getByTestId } = render(<DashboardScreen />)
    // Then
    expect(getByTestId('empty-state')).toBeTruthy()
  })

  test('6. shows error message when isError is true', () => {
    // Given
    mockUseBudgetItems.mockReturnValue({ isLoading: false, data: undefined, isError: true, refetch: jest.fn() })
    // When
    const { getByTestId } = render(<DashboardScreen />)
    // Then
    expect(getByTestId('error-message')).toBeTruthy()
  })

  test('7. income card shows $5000.00', () => {
    // Given
    mockUseBudgetItems.mockReturnValue({ isLoading: false, data: mockItems, isError: false, refetch: jest.fn() })
    // When
    const { getByTestId } = render(<DashboardScreen />)
    // Then
    expect(getByTestId('summary-income').props.children).toContain('$5000.00')
  })
})

describe('Goals (15)', () => {
  const today = new Date().toISOString().slice(0, 10)
  const currentMonthItems = [
    { id: '1', description: 'Salary', amount: 3000, category: 'income' as const, date: today },
    { id: '2', description: 'Rent', amount: 1200, category: 'expense' as const, date: today },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseBudgetItems.mockReturnValue({ isLoading: false, data: currentMonthItems, isError: false, refetch: jest.fn() })
    mockUseGoals.mockReturnValue({ data: [] })
  })

  test('8. Goals button renders with testID="goals-button"', () => {
    // Given/When
    const { getByTestId } = render(<DashboardScreen />)
    // Then
    expect(getByTestId('goals-button')).toBeTruthy()
  })

  test('9. Income progress bar renders when income goal exists (testID="goal-progress-income")', () => {
    // Given
    mockUseGoals.mockReturnValue({
      data: [{ id: 'g1', category: 'income', targetAmount: 5000 }],
    })
    // When
    const { getByTestId } = render(<DashboardScreen />)
    // Then
    expect(getByTestId('goal-progress-income')).toBeTruthy()
  })

  test('10. Progress bar absent when no goal for that category', () => {
    // Given — no goals set
    mockUseGoals.mockReturnValue({ data: [] })
    // When
    const { queryByTestId } = render(<DashboardScreen />)
    // Then
    expect(queryByTestId('goal-progress-income')).toBeNull()
  })

  test('11. Goals button minHeight is 44', () => {
    // Given/When
    const { getByTestId } = render(<DashboardScreen />)
    const btn = getByTestId('goals-button')
    const style = btn.props.style
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style
    // Then
    expect(flatStyle.minHeight).toBe(44)
  })
})
