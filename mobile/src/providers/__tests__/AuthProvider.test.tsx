import React from 'react'
import { render, act, waitFor } from '@testing-library/react-native'
import { AuthProvider, useAuth } from '../AuthProvider'

// Mock expo-router
const mockReplace = jest.fn()
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSegments: jest.fn(() => []),
}))

// Mock supabase client
const mockGetSession = jest.fn()
const mockOnAuthStateChange = jest.fn()
const mockSignInWithPassword = jest.fn()
const mockSignUp = jest.fn()
const mockSignOut = jest.fn()
const mockUnsubscribe = jest.fn()

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
    },
  },
}))

import { useSegments } from 'expo-router'

const mockUseSegments = useSegments as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  mockGetSession.mockResolvedValue({ data: { session: null }, error: null })
  mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: mockUnsubscribe } } })
  mockUseSegments.mockReturnValue([])
})

// Helper consumer component
function AuthConsumer() {
  const auth = useAuth()
  return null
}

describe('AuthProvider', () => {
  test('1. calls getSession() on mount to restore session', async () => {
    // Given - AuthProvider mounted
    // When
    await act(async () => {
      render(<AuthProvider><AuthConsumer /></AuthProvider>)
    })
    // Then
    expect(mockGetSession).toHaveBeenCalledTimes(1)
  })

  test('2. subscribes to onAuthStateChange on mount and unsubscribes on unmount', async () => {
    // Given
    let unmount: () => void
    await act(async () => {
      const result = render(<AuthProvider><AuthConsumer /></AuthProvider>)
      unmount = result.unmount
    })
    expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1)
    // When unmounted
    act(() => { unmount() })
    // Then unsubscribed
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
  })

  test('3. signIn calls supabase.auth.signInWithPassword with email and password', async () => {
    // Given
    mockSignInWithPassword.mockResolvedValue({ data: { user: null }, error: null })
    let authValue: ReturnType<typeof useAuth> | null = null
    function Capture() {
      authValue = useAuth()
      return null
    }
    await act(async () => {
      render(<AuthProvider><Capture /></AuthProvider>)
    })
    // When
    await act(async () => {
      await authValue!.signIn('test@example.com', 'password123')
    })
    // Then
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  test('4. signUp calls supabase.auth.signUp with email and password', async () => {
    // Given
    mockSignUp.mockResolvedValue({ data: { user: null }, error: null })
    let authValue: ReturnType<typeof useAuth> | null = null
    function Capture() {
      authValue = useAuth()
      return null
    }
    await act(async () => {
      render(<AuthProvider><Capture /></AuthProvider>)
    })
    // When
    await act(async () => {
      await authValue!.signUp('new@example.com', 'securepass')
    })
    // Then
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'securepass',
    })
  })

  test('5. signOut calls supabase.auth.signOut', async () => {
    // Given
    mockSignOut.mockResolvedValue({ error: null })
    let authValue: ReturnType<typeof useAuth> | null = null
    function Capture() {
      authValue = useAuth()
      return null
    }
    await act(async () => {
      render(<AuthProvider><Capture /></AuthProvider>)
    })
    // When
    await act(async () => {
      await authValue!.signOut()
    })
    // Then
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  test('6. useAuth() throws when used outside AuthProvider', () => {
    // Given/When/Then
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<AuthConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    )
    consoleError.mockRestore()
  })

  test('7. redirects to login when user is null and not in (auth) segment', async () => {
    // Given - user is null, segment is not (auth)
    mockUseSegments.mockReturnValue(['(tabs)'])
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })
    // When
    await act(async () => {
      render(<AuthProvider><AuthConsumer /></AuthProvider>)
    })
    // Then
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(auth)/login')
    })
  })

  test('8. redirects to tabs when user is set and segment is (auth)', async () => {
    // Given - user exists, currently in (auth) segment
    const mockUser = { id: 'user-123', email: 'user@example.com' }
    mockGetSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    })
    mockUseSegments.mockReturnValue(['(auth)'])
    // When
    await act(async () => {
      render(<AuthProvider><AuthConsumer /></AuthProvider>)
    })
    // Then
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)')
    })
  })
})
