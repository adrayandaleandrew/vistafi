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
const mockReplace = jest.fn()
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
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

// Mock expo-local-authentication — no hardware by default → showForm=true
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn().mockResolvedValue(false),
  isEnrolledAsync: jest.fn().mockResolvedValue(false),
  authenticate: jest.fn(),
}))

// Mock AsyncStorage — pref off by default → showForm=true
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}))

// Mock supabase
jest.mock('../../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    },
  },
}))

import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../../../src/lib/supabase'

const mockHasHardware = LocalAuthentication.hasHardwareAsync as jest.Mock
const mockIsEnrolled = LocalAuthentication.isEnrolledAsync as jest.Mock
const mockAuthenticate = LocalAuthentication.authenticate as jest.Mock
const mockGetItem = AsyncStorage.getItem as jest.Mock
const mockGetSession = supabase.auth.getSession as jest.Mock

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockError.current = null
    // Default: pref off → showForm=true immediately
    mockGetItem.mockResolvedValue(null)
    mockHasHardware.mockResolvedValue(false)
    mockIsEnrolled.mockResolvedValue(false)
    mockGetSession.mockResolvedValue({ data: { session: null } })
  })

  test('1. renders email input, password input, and submit Pressable', async () => {
    // Given/When
    const { getByTestId } = render(<LoginScreen />)
    // Then — wait for useEffect to set showForm=true
    await waitFor(() => expect(getByTestId('email-input')).toBeTruthy())
    expect(getByTestId('password-input')).toBeTruthy()
    expect(getByTestId('submit-button')).toBeTruthy()
  })

  test('2. submit Pressable has minHeight of 44 (touch target rule)', async () => {
    // Given/When
    const { getByTestId } = render(<LoginScreen />)
    await waitFor(() => expect(getByTestId('submit-button')).toBeTruthy())
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
    await waitFor(() => expect(getByTestId('email-input')).toBeTruthy())
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
    // Given — mockError.current is read by the mock factory on each render
    mockError.current = 'Incorrect email or password.'
    // When
    const { getByText } = render(<LoginScreen />)
    // Then
    await waitFor(() => expect(getByText('Incorrect email or password.')).toBeTruthy())
  })

  test('5. Create account Pressable renders', async () => {
    // Given/When
    const { getByTestId } = render(<LoginScreen />)
    await waitFor(() => expect(getByTestId('create-account-button')).toBeTruthy())
  })

  test('6. biometric prompt shown when pref=true, hardware available, enrolled', async () => {
    // Given — authenticate never resolves so biometric UI stays visible
    mockGetItem.mockResolvedValue('true')
    mockHasHardware.mockResolvedValue(true)
    mockIsEnrolled.mockResolvedValue(true)
    mockAuthenticate.mockImplementation(() => new Promise(() => {}))
    // When
    const { getByTestId } = render(<LoginScreen />)
    // Then
    await waitFor(() => expect(getByTestId('biometric-button')).toBeTruthy())
    expect(getByTestId('use-password-button')).toBeTruthy()
  })

  test('7. biometric success + valid session → router.replace called', async () => {
    // Given
    mockGetItem.mockResolvedValue('true')
    mockHasHardware.mockResolvedValue(true)
    mockIsEnrolled.mockResolvedValue(true)
    mockAuthenticate.mockResolvedValue({ success: true })
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } })
    // When
    render(<LoginScreen />)
    // Then
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/(tabs)'))
  })

  test('8. biometric failure → form shown (email-input visible)', async () => {
    // Given — first authenticate call (auto-triggered on mount) pends so UI is visible
    mockGetItem.mockResolvedValue('true')
    mockHasHardware.mockResolvedValue(true)
    mockIsEnrolled.mockResolvedValue(true)
    // Call #1 (from useEffect) never resolves → biometric UI stays visible
    // Call #2 (from press) returns failure → showForm=true
    mockAuthenticate
      .mockImplementationOnce(() => new Promise(() => {}))
      .mockResolvedValueOnce({ success: false })
    const { getByTestId } = render(<LoginScreen />)
    await waitFor(() => expect(getByTestId('biometric-button')).toBeTruthy())
    // When
    await act(async () => {
      fireEvent.press(getByTestId('biometric-button'))
    })
    // Then
    await waitFor(() => expect(getByTestId('email-input')).toBeTruthy())
  })

  test('9. "Use email instead" button → form shown', async () => {
    // Given — authenticate never resolves so biometric UI stays visible
    mockGetItem.mockResolvedValue('true')
    mockHasHardware.mockResolvedValue(true)
    mockIsEnrolled.mockResolvedValue(true)
    mockAuthenticate.mockImplementation(() => new Promise(() => {}))
    const { getByTestId } = render(<LoginScreen />)
    await waitFor(() => expect(getByTestId('use-password-button')).toBeTruthy())
    // When
    fireEvent.press(getByTestId('use-password-button'))
    // Then
    await waitFor(() => expect(getByTestId('email-input')).toBeTruthy())
  })
})
