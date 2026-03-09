import React, { useState, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useAuth } from '../src/providers/AuthProvider'
import { useGoals, useSetGoal, useDeleteGoal } from '../src/hooks/useGoals'
import type { BudgetGoal } from '@shared/types/budget'

export default function SetGoalsScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const { data: goals } = useGoals(user?.id ?? '')
  const { mutate: setGoalMutate } = useSetGoal(user?.id ?? '')
  const { mutate: deleteGoalMutate } = useDeleteGoal(user?.id ?? '')

  const [incomeValue, setIncomeValue] = useState('')
  const [expenseValue, setExpenseValue] = useState('')
  const [savingsValue, setSavingsValue] = useState('')

  useEffect(() => {
    if (goals !== undefined) {
      const incomeGoal = (goals ?? []).find((g: BudgetGoal) => g.category === 'income')
      const expenseGoal = (goals ?? []).find((g: BudgetGoal) => g.category === 'expense')
      const savingsGoal = (goals ?? []).find((g: BudgetGoal) => g.category === 'savings')
      setIncomeValue(incomeGoal !== undefined ? String(incomeGoal.targetAmount) : '')
      setExpenseValue(expenseGoal !== undefined ? String(expenseGoal.targetAmount) : '')
      setSavingsValue(savingsGoal !== undefined ? String(savingsGoal.targetAmount) : '')
    }
  }, [goals])

  const handleSave = useCallback(() => {
    const incomeGoal = (goals ?? []).find((g: BudgetGoal) => g.category === 'income')
    const expenseGoal = (goals ?? []).find((g: BudgetGoal) => g.category === 'expense')
    const savingsGoal = (goals ?? []).find((g: BudgetGoal) => g.category === 'savings')

    const incomeNum = parseFloat(incomeValue)
    const expenseNum = parseFloat(expenseValue)
    const savingsNum = parseFloat(savingsValue)

    if (!isNaN(incomeNum) && incomeNum > 0) {
      setGoalMutate({ category: 'income', targetAmount: incomeNum })
    } else if (incomeValue === '' && incomeGoal !== undefined) {
      deleteGoalMutate(incomeGoal.id)
    }

    if (!isNaN(expenseNum) && expenseNum > 0) {
      setGoalMutate({ category: 'expense', targetAmount: expenseNum })
    } else if (expenseValue === '' && expenseGoal !== undefined) {
      deleteGoalMutate(expenseGoal.id)
    }

    if (!isNaN(savingsNum) && savingsNum > 0) {
      setGoalMutate({ category: 'savings', targetAmount: savingsNum })
    } else if (savingsValue === '' && savingsGoal !== undefined) {
      deleteGoalMutate(savingsGoal.id)
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    router.dismiss()
  }, [goals, incomeValue, expenseValue, savingsValue, setGoalMutate, deleteGoalMutate, router])

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
          <Text style={styles.heading}>Set Monthly Goals</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Income Target */}
        <Text style={styles.label}>Income Target</Text>
        <TextInput
          testID="income-input"
          style={styles.input}
          value={incomeValue}
          onChangeText={setIncomeValue}
          keyboardType="decimal-pad"
          placeholder="e.g. 5000"
          placeholderTextColor="#857F72"
        />

        {/* Expense Limit */}
        <Text style={styles.label}>Expense Limit</Text>
        <TextInput
          testID="expense-input"
          style={styles.input}
          value={expenseValue}
          onChangeText={setExpenseValue}
          keyboardType="decimal-pad"
          placeholder="e.g. 2000"
          placeholderTextColor="#857F72"
        />

        {/* Savings Goal */}
        <Text style={styles.label}>Savings Goal</Text>
        <TextInput
          testID="savings-input"
          style={styles.input}
          value={savingsValue}
          onChangeText={setSavingsValue}
          keyboardType="decimal-pad"
          placeholder="e.g. 1000"
          placeholderTextColor="#857F72"
        />

        {/* Save */}
        <Pressable
          testID="save-button"
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Save Goals</Text>
        </Pressable>
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
    minHeight: 44,
  },
  saveButton: {
    backgroundColor: '#18170F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    minHeight: 44,
    paddingVertical: 14,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FDFCFA',
  },
})
