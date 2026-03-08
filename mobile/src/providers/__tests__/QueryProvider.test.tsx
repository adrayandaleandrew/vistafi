import React from 'react'
import { render, act } from '@testing-library/react-native'
import { Text } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { QueryProvider } from '../QueryProvider'

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
}))

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}))

// Mock persist client
jest.mock('@tanstack/react-query-persist-client', () => ({
  PersistQueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@tanstack/query-async-storage-persister', () => ({
  createAsyncStoragePersister: jest.fn(() => ({})),
}))

import NetInfo from '@react-native-community/netinfo'

describe('QueryProvider', () => {
  test('1. renders children without error', async () => {
    // Given/When
    let errorThrown = false
    try {
      await act(async () => {
        render(
          <QueryProvider>
            <Text>child</Text>
          </QueryProvider>
        )
      })
    } catch {
      errorThrown = true
    }
    // Then
    expect(errorThrown).toBe(false)
  })

  test('2. useQueryClient() is accessible inside provider', async () => {
    // Given
    let hasQueryClient = false
    function QueryConsumer() {
      const qc = useQueryClient()
      hasQueryClient = !!qc
      return null
    }
    // When
    await act(async () => {
      render(
        <QueryProvider>
          <QueryConsumer />
        </QueryProvider>
      )
    })
    // Then
    expect(hasQueryClient).toBe(true)
  })

  test('3. NetInfo.addEventListener is called to register online manager listener', async () => {
    // Given/When
    await act(async () => {
      render(
        <QueryProvider>
          <Text>child</Text>
        </QueryProvider>
      )
    })
    // Then
    expect(NetInfo.addEventListener).toHaveBeenCalled()
  })
})
