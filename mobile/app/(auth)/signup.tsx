import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../../src/providers/AuthProvider'

export default function SignupScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const { signUp, error: authError } = useAuth()
  const router = useRouter()

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setPasswordsMatch(false)
      return
    }
    setPasswordsMatch(true)
    await signUp(email.trim(), password)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start tracking your finances</Text>

        <TextInput
          testID="email-input"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#857F72"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          testID="password-input"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#857F72"
          secureTextEntry
        />

        <TextInput
          testID="confirm-password-input"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor="#857F72"
          secureTextEntry
        />

        {!passwordsMatch ? (
          <Text style={styles.error}>Passwords do not match</Text>
        ) : null}

        {authError ? <Text style={styles.error}>{authError}</Text> : null}

        <Pressable
          testID="submit-button"
          style={styles.submitButton}
          onPress={handleSubmit}
          accessibilityRole="button"
          accessibilityLabel="Create account"
        >
          <Text style={styles.submitText}>Create Account</Text>
        </Pressable>

        <Pressable
          style={styles.linkButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Already have an account? Sign in"
        >
          <Text style={styles.linkText}>Already have an account?</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F2EC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#18170F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#857F72',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FDFCFA',
    borderWidth: 1,
    borderColor: '#E0DBCF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#18170F',
    marginBottom: 16,
    minHeight: 44,
  },
  error: {
    color: '#C1281A',
    fontSize: 14,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#18170F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    marginTop: 8,
    cursor: 'pointer',
  },
  submitText: {
    color: '#F5F2EC',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    marginTop: 16,
    cursor: 'pointer',
  },
  linkText: {
    color: '#857F72',
    fontSize: 14,
  },
})
