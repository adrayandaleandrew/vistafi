import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../../src/providers/AuthProvider'

const BIOMETRICS_PREF_KEY = 'vistafi-biometrics-enabled'

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [hasBiometrics, setHasBiometrics] = useState(false)
  const [biometricsEnabled, setBiometricsEnabled] = useState(false)

  useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then((has) => {
      setHasBiometrics(has)
      if (has) {
        AsyncStorage.getItem(BIOMETRICS_PREF_KEY).then((val) => {
          setBiometricsEnabled(val === 'true')
        })
      }
    })
  }, [])

  const handleSignOut = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    await signOut()
    router.replace('/(auth)/login')
  }

  const handleBiometricsToggle = async () => {
    const next = !biometricsEnabled
    setBiometricsEnabled(next)
    await AsyncStorage.setItem(BIOMETRICS_PREF_KEY, String(next))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.card}>
          <Text style={styles.emailLabel}>Email</Text>
          <Text testID="user-email" style={styles.email}>
            {user?.email}
          </Text>
        </View>
      </View>

      {hasBiometrics ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Security</Text>
          <View style={styles.card}>
            <Pressable
              testID="biometrics-toggle"
              style={styles.toggleRow}
              onPress={handleBiometricsToggle}
            >
              <Text style={styles.toggleLabel}>Biometric Login</Text>
              <View style={[styles.toggleIndicator, biometricsEnabled ? styles.toggleOn : styles.toggleOff]}>
                <Text style={styles.toggleText}>{biometricsEnabled ? 'ON' : 'OFF'}</Text>
              </View>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={styles.signOutSection}>
        <Pressable
          testID="sign-out-button"
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2EC',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#857F72',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FDFCFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0DBCF',
  },
  emailLabel: {
    fontSize: 12,
    color: '#857F72',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#18170F',
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  toggleLabel: {
    fontSize: 15,
    color: '#18170F',
  },
  toggleIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  toggleOn: {
    backgroundColor: '#0D7040',
  },
  toggleOff: {
    backgroundColor: '#857F72',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FDFCFA',
  },
  signOutSection: {
    marginTop: 'auto',
    paddingBottom: 16,
  },
  signOutButton: {
    backgroundColor: '#18170F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: 14,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FDFCFA',
  },
})
