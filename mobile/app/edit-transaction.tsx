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
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from '../src/providers/AuthProvider'
import { useUpdateItem } from '../src/hooks/useBudgetMutations'
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

export default function EditTransactionScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useLocalSearchParams<{
    id: string
    description: string
    amount: string
    category: string
    date: string
  }>()
  const { mutate } = useUpdateItem(user?.id ?? '')

  const [description, setDescription] = useState(params.description ?? '')
  const [amount, setAmount] = useState(params.amount ?? '')
  const [category, setCategory] = useState<BudgetCategory>(
    (params.category as BudgetCategory) ?? 'income'
  )
  const [validationError, setValidationError] = useState<string | null>(null)

  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handleSave = useCallback(() => {
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
      {
        id: params.id,
        description: description.trim(),
        amount: parsedAmount,
        category,
        date: params.date ?? new Date().toISOString().split('T')[0],
      },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          router.dismiss()
        },
      }
    )
  }, [description, amount, category, params, mutate, router])

  const handleCancel = useCallback(() => {
    router.dismiss()
  }, [router])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            testID="cancel-button"
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.heading}>Edit Transaction</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          testID="description-input"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
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

        {/* Save */}
        <AnimatedPressable
          testID="submit-button"
          style={[styles.submitButton, animatedStyle]}
          onPressIn={() => { scale.value = withSpring(0.95) }}
          onPressOut={() => { scale.value = withSpring(1) }}
          onPress={handleSave}
        >
          <Text style={styles.submitText}>Save Changes</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 12,
  },
  cancelText: {
    fontSize: 16,
    color: '#857F72',
  },
  heading: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#18170F',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
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
