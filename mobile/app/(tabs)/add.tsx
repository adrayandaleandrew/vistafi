import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useAuth } from '../../src/providers/AuthProvider'
import { useAddItem } from '../../src/hooks/useBudgetMutations'
import type { BudgetCategory } from '@shared/types/budget'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const CATEGORIES: { key: BudgetCategory; label: string }[] = [
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expense' },
  { key: 'savings', label: 'Savings' },
]

const CATEGORY_COLOR: Record<BudgetCategory, string> = {
  income: '#0D7040',
  expense: '#C1281A',
  savings: '#1E52BB',
}

export default function AddScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const { mutate } = useAddItem(user?.id ?? '')

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<BudgetCategory>('income')
  const [date] = useState(() => new Date().toISOString().split('T')[0])
  const [validationError, setValidationError] = useState<string | null>(null)

  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handleSubmit = useCallback(() => {
    const parsedAmount = parseFloat(amount)

    if (!description.trim()) {
      setValidationError('Description is required.')
      return
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError('Amount must be greater than 0.')
      return
    }

    setValidationError(null)

    mutate(
      { description: description.trim(), amount: parsedAmount, category, date },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          router.replace('/(tabs)')
        },
      }
    )
  }, [description, amount, category, date, mutate, router])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Add Transaction</Text>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          testID="description-input"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Groceries"
          placeholderTextColor="#857F72"
        />

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          testID="amount-input"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#857F72"
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.segmentRow}>
          {CATEGORIES.map(({ key, label }) => {
            const isSelected = category === key
            return (
              <Pressable
                key={key}
                testID={`category-${key}`}
                style={[
                  styles.segment,
                  isSelected && { backgroundColor: CATEGORY_COLOR[key] },
                ]}
                onPress={() => setCategory(key)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isSelected && styles.segmentTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {/* Validation error */}
        {validationError !== null ? (
          <Text testID="validation-error" style={styles.errorText}>
            {validationError}
          </Text>
        ) : null}

        {/* Submit */}
        <AnimatedPressable
          testID="submit-button"
          style={[styles.submitButton, animatedStyle]}
          onPressIn={() => { scale.value = withSpring(0.95) }}
          onPressOut={() => { scale.value = withSpring(1) }}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Add Transaction</Text>
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2EC',
  },
  scrollContent: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18170F',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#857F72',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FDFCFA',
    borderWidth: 1,
    borderColor: '#E0DBCF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#18170F',
    minHeight: 48,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0DBCF',
    backgroundColor: '#FDFCFA',
    minHeight: 44,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#857F72',
  },
  segmentTextSelected: {
    color: '#FDFCFA',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 13,
    color: '#C1281A',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#18170F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    minHeight: 44,
    paddingVertical: 14,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FDFCFA',
  },
})
