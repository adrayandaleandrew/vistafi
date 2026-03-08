import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

// Chunked secure storage — handles iOS 2048-byte limit on SecureStore values
const CHUNK_SIZE = 1800

const ChunkedSecureStore = {
  getItem: async (key: string): Promise<string | null> => {
    const chunkCountStr = await SecureStore.getItemAsync(`${key}_chunk_count`)
    if (!chunkCountStr) {
      return SecureStore.getItemAsync(key)
    }
    const chunkCount = parseInt(chunkCountStr, 10)
    const chunks: string[] = []
    for (let i = 0; i < chunkCount; i++) {
      const chunk = await SecureStore.getItemAsync(`${key}_chunk_${i}`)
      if (chunk === null) return null
      chunks.push(chunk)
    }
    return chunks.join('')
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value)
      return
    }
    const chunks = value.match(/.{1,1800}/g) ?? []
    await SecureStore.setItemAsync(`${key}_chunk_count`, String(chunks.length))
    await Promise.all(
      chunks.map((chunk, i) => SecureStore.setItemAsync(`${key}_chunk_${i}`, chunk))
    )
  },

  removeItem: async (key: string): Promise<void> => {
    const chunkCountStr = await SecureStore.getItemAsync(`${key}_chunk_count`)
    if (chunkCountStr) {
      await Promise.all(
        Array.from({ length: parseInt(chunkCountStr, 10) }, (_, i) =>
          SecureStore.deleteItemAsync(`${key}_chunk_${i}`)
        )
      )
      await SecureStore.deleteItemAsync(`${key}_chunk_count`)
    }
    await SecureStore.deleteItemAsync(key)
  },
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ChunkedSecureStore,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
