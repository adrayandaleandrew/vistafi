import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useAuth } from '../../src/providers/AuthProvider'
import { supabase } from '../../src/lib/supabase'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const BIOMETRICS_PREF_KEY = 'vistafi-biometrics-enabled'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const { signIn, error: authError } = useAuth()
  const router = useRouter()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const triggerBiometric = async () => {
    const result = await LocalAuthentication.authenticate({
      promptMessage: 'Sign in to VistaFi',
    })
    if (result.success) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session !== null) {
        router.replace('/(tabs)')
        return
      }
    }
    setShowForm(true)
  }

  useEffect(() => {
    async function checkBiometrics() {
      const pref = await AsyncStorage.getItem(BIOMETRICS_PREF_KEY)
      if (pref !== 'true') {
        setShowForm(true)
        return
      }
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      if (!hasHardware || !isEnrolled) {
        setShowForm(true)
        return
      }
      setBiometricAvailable(true)
      triggerBiometric()
    }
    checkBiometrics()
  }, [])

  const handleSubmit = async () => {
    setValidationError(null)
    const emailTrimmed = email.trim()
    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      setValidationError('Please enter a valid email address.')
      return
    }
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters.')
      return
    }
    await signIn(emailTrimmed, password)
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const displayError = validationError ?? authError

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>VistaFi</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {showForm ? (
          <View>
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

            {displayError ? <Text style={styles.error}>{displayError}</Text> : null}

            <AnimatedPressable
              testID="submit-button"
              style={[styles.submitButton, animatedStyle]}
              onPressIn={() => { scale.value = withSpring(0.95) }}
              onPressOut={() => { scale.value = withSpring(1) }}
              onPress={handleSubmit}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
            >
              <Text style={styles.submitText}>Sign In</Text>
            </AnimatedPressable>

            <Pressable
              testID="create-account-button"
              style={styles.linkButton}
              onPress={() => router.push('/(auth)/signup')}
              accessibilityRole="button"
              accessibilityLabel="Create account"
            >
              <Text style={styles.linkText}>Create account</Text>
            </Pressable>
          </View>
        ) : (
          biometricAvailable ? (
            <View style={styles.biometricContainer}>
              <Pressable
                testID="biometric-button"
                style={styles.biometricButton}
                onPress={triggerBiometric}
                accessibilityRole="button"
                accessibilityLabel="Sign in with biometrics"
              >
                <Text style={styles.submitText}>Use Biometrics</Text>
              </Pressable>
              <Pressable
                testID="use-password-button"
                style={styles.linkButton}
                onPress={() => setShowForm(true)}
                accessibilityRole="button"
                accessibilityLabel="Use email and password instead"
              >
                <Text style={styles.linkText}>Use email instead</Text>
              </Pressable>
            </View>
          ) : null
        )}
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
  biometricContainer: {
    alignItems: 'center',
    gap: 16,
  },
  biometricButton: {
    backgroundColor: '#18170F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    width: '100%',
    paddingVertical: 14,
  },
})
