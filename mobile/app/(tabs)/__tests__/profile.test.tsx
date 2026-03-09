import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react-native'

// Mock useAuth — inline jest.fn() to avoid hoisting issues
jest.mock('../../../src/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}))
import { useAuth } from '../../../src/providers/AuthProvider'
const mockUseAuth = useAuth as jest.Mock

// Mock expo-router — inline jest.fn()
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}))
import { useRouter } from 'expo-router'
const mockUseRouter = useRouter as jest.Mock

// Mock expo-haptics — inline jest.fn()
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light' },
}))
import * as Haptics from 'expo-haptics'
const mockImpactAsync = Haptics.impactAsync as jest.Mock

// Mock expo-local-authentication — inline jest.fn()
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(),
}))
import * as LocalAuthentication from 'expo-local-authentication'
const mockHasHardwareAsync = LocalAuthentication.hasHardwareAsync as jest.Mock

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}))

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  return Reanimated
})

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}))

import ProfileScreen from '../profile'

const mockSignOut = jest.fn()
const mockReplace = jest.fn()
const mockUser = { id: 'user-123', email: 'test@example.com' }

describe('ProfileScreen (12.8)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockHasHardwareAsync.mockResolvedValue(false)
    mockUseAuth.mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
      isLoading: false,
      error: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
    })
    mockUseRouter.mockReturnValue({ replace: mockReplace, push: jest.fn() })
  })

  test('1. renders current user email', async () => {
    // Given — mockHasHardwareAsync returns false (set in beforeEach)
    // When
    const { getByTestId } = render(<ProfileScreen />)
    // Then
    await waitFor(() => {
      expect(getByTestId('user-email').props.children).toBe('test@example.com')
    })
  })

  test('2. sign out Pressable exists with minHeight 44', () => {
    // Given/When
    const { getByTestId } = render(<ProfileScreen />)
    const btn = getByTestId('sign-out-button')
    // Then
    const style = btn.props.style
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style
    expect(flatStyle.minHeight).toBe(44)
  })

  test('3. sign out calls useAuth().signOut() on press', async () => {
    // Given
    mockSignOut.mockResolvedValue(undefined)
    const { getByTestId } = render(<ProfileScreen />)
    // When
    await act(async () => {
      fireEvent.press(getByTestId('sign-out-button'))
    })
    // Then
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  test('4. haptics light fires on sign out press', async () => {
    // Given
    mockSignOut.mockResolvedValue(undefined)
    const { getByTestId } = render(<ProfileScreen />)
    // When
    await act(async () => {
      fireEvent.press(getByTestId('sign-out-button'))
    })
    // Then
    expect(mockImpactAsync).toHaveBeenCalledWith('Light')
  })

  test('5. router.replace called with /(auth)/login on sign out', async () => {
    // Given
    mockSignOut.mockResolvedValue(undefined)
    const { getByTestId } = render(<ProfileScreen />)
    // When
    await act(async () => {
      fireEvent.press(getByTestId('sign-out-button'))
    })
    // Then
    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login')
  })

  test('6. shows biometrics toggle when LocalAuthentication.hasHardwareAsync() returns true', async () => {
    // Given
    mockHasHardwareAsync.mockResolvedValue(true)
    // When
    const { getByTestId } = render(<ProfileScreen />)
    // Then
    await waitFor(() => {
      expect(getByTestId('biometrics-toggle')).toBeTruthy()
    })
  })

  test('7. does NOT show biometrics toggle when hardware unavailable', async () => {
    // Given — mockHasHardwareAsync returns false (set in beforeEach)
    // When
    const { queryByTestId } = render(<ProfileScreen />)
    // Then
    await waitFor(() => {
      expect(queryByTestId('biometrics-toggle')).toBeNull()
    })
  })
})
