import React from 'react'
import { render, fireEvent, act } from '@testing-library/react-native'
import SignupScreen from '../signup'

// Mock useAuth
const mockSignUp = jest.fn()
let mockAuthError: string | null = null

jest.mock('../../../src/providers/AuthProvider', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
    error: mockAuthError,
    isLoading: false,
    user: null,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}))

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), replace: jest.fn() }),
}))

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  return Reanimated
})

describe('SignupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthError = null
  })

  test('1. renders email, password, confirmPassword inputs and submit Pressable', () => {
    // Given/When
    const { getByTestId } = render(<SignupScreen />)
    // Then
    expect(getByTestId('email-input')).toBeTruthy()
    expect(getByTestId('password-input')).toBeTruthy()
    expect(getByTestId('confirm-password-input')).toBeTruthy()
    expect(getByTestId('submit-button')).toBeTruthy()
  })

  test('2. shows passwords-mismatch error when passwords differ (ternary)', async () => {
    // Given
    const { getByTestId, getByText } = render(<SignupScreen />)
    fireEvent.changeText(getByTestId('email-input'), 'user@example.com')
    fireEvent.changeText(getByTestId('password-input'), 'password123')
    fireEvent.changeText(getByTestId('confirm-password-input'), 'differentpass')
    // When
    await act(async () => {
      fireEvent.press(getByTestId('submit-button'))
    })
    // Then
    expect(getByText('Passwords do not match')).toBeTruthy()
  })

  test('3. calls useAuth().signUp with email and password when passwords match', async () => {
    // Given
    mockSignUp.mockResolvedValue(undefined)
    const { getByTestId } = render(<SignupScreen />)
    fireEvent.changeText(getByTestId('email-input'), 'new@example.com')
    fireEvent.changeText(getByTestId('password-input'), 'securepass')
    fireEvent.changeText(getByTestId('confirm-password-input'), 'securepass')
    // When
    await act(async () => {
      fireEvent.press(getByTestId('submit-button'))
    })
    // Then
    expect(mockSignUp).toHaveBeenCalledWith('new@example.com', 'securepass')
  })

  test('4. shows inline error from useAuth().error (ternary)', () => {
    // Given — auth error is set
    mockAuthError = 'Unable to create account. Please try again.'
    jest.resetModules()
    jest.doMock('../../../src/providers/AuthProvider', () => ({
      useAuth: () => ({
        signUp: mockSignUp,
        error: 'Unable to create account. Please try again.',
        isLoading: false,
        user: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      }),
    }))
    const SignupWithError = require('../signup').default
    // When
    const { getByText } = render(<SignupWithError />)
    // Then
    expect(getByText('Unable to create account. Please try again.')).toBeTruthy()
  })
})
