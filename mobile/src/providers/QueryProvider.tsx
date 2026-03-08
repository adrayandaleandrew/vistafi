import React, { useEffect } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 86_400_000,       // 24 hours
      staleTime: 300_000,       // 5 minutes
      networkMode: 'offlineFirst',
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'VISTAFI_QUERY_CACHE',
})

// Register NetInfo listener for online manager — singleton, outside component
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

interface Props {
  children: React.ReactNode
}

export function QueryProvider({ children }: Props) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
