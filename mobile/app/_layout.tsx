import { Stack } from 'expo-router'
import { QueryProvider } from '../src/providers/QueryProvider'
import { AuthProvider } from '../src/providers/AuthProvider'

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="set-goals" options={{ presentation: 'modal' }} />
        </Stack>
      </AuthProvider>
    </QueryProvider>
  )
}
