import React from 'react'
import { render, fireEvent, act, waitFor } from '@testing-library/react-native'
import LoginScreen from '../login'

// Mock useAuth
const mockSignIn = jest.fn()
const mockError = { current: null as string | null }

jest.mock('../../../src/providers/AuthProvider', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    error: mockError.current,
    isLoading: false,
    user: null,
    signUp: jest.fn(),
    signOut: jest.fn(),
  }),
}))

// Mock expo-router
const mockPush = jest.fn()
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}))

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light' },
}))

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  return Reanimated
})

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockError.current = null
  })

  test('1. renders email input, password input, and submit Pressable', () => {
    // Given/When
    const { getByTestId } = render(<LoginScreen />)
    // Then
    expect(getByTestId('email-input')).toBeTruthy()
    expect(getByTestId('password-input')).toBeTruthy()
    expect(getByTestId('submit-button')).toBeTruthy()
  })

  test('2. submit Pressable has minHeight of 44 (touch target rule)', () => {
    // Given/When
    const { getByTestId } = render(<LoginScreen />)
    const btn = getByTestId('submit-button')
    // Then — style prop or StyleSheet must include minHeight: 44
    const style = btn.props.style
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style
    expect(flatStyle.minHeight).toBe(44)
  })

  test('3. calls useAuth().signIn with email and password on valid submit', async () => {
    // Given
    mockSignIn.mockResolvedValue(undefined)
    const { getByTestId } = render(<LoginScreen />)
    fireEvent.changeText(getByTestId('email-input'), 'user@example.com')
    fireEvent.changeText(getByTestId('password-input'), 'password123')
    // When
    await act(async () => {
      fireEvent.press(getByTestId('submit-button'))
    })
    // Then
    expect(mockSignIn).toHaveBeenCalledWith('user@example.com', 'password123')
  })

  test('4. shows inline error Text when useAuth().error is non-null (ternary)', async () => {
    // Given — error is set
    mockError.current = 'Incorrect email or password.'
    jest.resetModules()
    // Re-mock with error
    jest.doMock('../../../src/providers/AuthProvider', () => ({
      useAuth: () => ({
        signIn: mockSignIn,
        error: 'Incorrect email or password.',
        isLoading: false,
        user: null,
        signUp: jest.fn(),
        signOut: jest.fn(),
      }),
    }))
    const LoginWithError = require('../login').default
    // When
    const { getByText } = render(<LoginWithError />)
    // Then
    expect(getByText('Incorrect email or password.')).toBeTruthy()
  })

  test('5. Create account Pressable renders', () => {
    // Given/When
    const { getByTestId } = render(<LoginScreen />)
    // Then
    expect(getByTestId('create-account-button')).toBeTruthy()
  })
})
