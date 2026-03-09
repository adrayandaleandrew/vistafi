import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useAuth } from '../../src/providers/AuthProvider'
import { useBudgetItems } from '../../src/hooks/useBudgetItems'
import { useGoals } from '../../src/hooks/useGoals'
import { calculateBudgetSummary, calculateCurrentMonthSummary } from '@shared/utils/budgetUtils'
import TransactionItem from '../../src/components/TransactionItem'
import type { BudgetItem, BudgetGoal } from '@shared/types/budget'

interface GoalProgressProps {
  readonly goal: BudgetGoal | null
  readonly current: number
  readonly color: string
  readonly testID: string
}

const GoalProgress = React.memo(function GoalProgress({ goal, current, color, testID }: GoalProgressProps) {
  if (goal === null) return null
  const pct = Math.min(100, Math.round((current / goal.targetAmount) * 100))
  return (
    <View style={styles.progressSection}>
      <View style={styles.progressTrack}>
        <View testID={testID} style={[styles.progressFill, { flex: pct, backgroundColor: color }]} />
        <View style={[styles.progressRemainder, { flex: 100 - pct }]} />
      </View>
      <Text style={styles.progressLabel}>
        {`$${current.toFixed(2)} / $${goal.targetAmount.toFixed(2)}`}
      </Text>
    </View>
  )
})

export default function DashboardScreen() {
  const { user } = useAuth()
  const { isLoading, data: items, isError, refetch } = useBudgetItems(user?.id ?? '')
  const { data: goals } = useGoals(user?.id ?? '')
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const summary = calculateBudgetSummary(items ?? [])
  const monthSummary = calculateCurrentMonthSummary(items ?? [])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  const handleGoalsPress = useCallback(() => { router.push('/set-goals') }, [router])

  const findGoal = useCallback((cat: string) =>
    (goals ?? []).find(g => g.category === cat) ?? null, [goals])

  const keyExtractor = useCallback((item: BudgetItem) => item.id, [])

  const renderItem = useCallback(({ item }: { item: BudgetItem }) => (
    <TransactionItem item={item} testID={`transaction-item-${item.id}`} />
  ), [])

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator testID="loading-indicator" size="large" color="#18170F" />
      </SafeAreaView>
    )
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text testID="error-message" style={styles.errorText}>
          Could not load transactions. Check your connection.
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Goals Button */}
      <View style={styles.summaryHeader}>
        <Pressable testID="goals-button" style={styles.goalsButton} onPress={handleGoalsPress}>
          <Text style={styles.goalsButtonText}>Goals</Text>
        </Pressable>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={[styles.card, styles.cardFull]}>
          <Text style={styles.cardLabel}>Balance</Text>
          <Text testID="summary-balance" style={[styles.cardAmount, styles.balanceAmount]}>
            {`$${summary.balance.toFixed(2)}`}
          </Text>
        </View>
        <View style={[styles.card, styles.cardThird]}>
          <Text style={styles.cardLabel}>Income</Text>
          <Text testID="summary-income" style={[styles.cardAmount, styles.incomeAmount]}>
            {`$${summary.totalIncome.toFixed(2)}`}
          </Text>
          <GoalProgress
            goal={findGoal('income')}
            current={monthSummary.totalIncome}
            color="#0D7040"
            testID="goal-progress-income"
          />
        </View>
        <View style={[styles.card, styles.cardThird]}>
          <Text style={styles.cardLabel}>Expenses</Text>
          <Text testID="summary-expenses" style={[styles.cardAmount, styles.expenseAmount]}>
            {`$${summary.totalExpenses.toFixed(2)}`}
          </Text>
          <GoalProgress
            goal={findGoal('expense')}
            current={monthSummary.totalExpenses}
            color="#C1281A"
            testID="goal-progress-expense"
          />
        </View>
        <View style={[styles.card, styles.cardThird]}>
          <Text style={styles.cardLabel}>Savings</Text>
          <Text testID="summary-savings" style={[styles.cardAmount, styles.savingsAmount]}>
            {`$${summary.totalSavings.toFixed(2)}`}
          </Text>
          <GoalProgress
            goal={findGoal('savings')}
            current={monthSummary.totalSavings}
            color="#1E52BB"
            testID="goal-progress-savings"
          />
        </View>
      </View>

      {/* Transaction List */}
      <View style={styles.listContainer}>
        <Text style={styles.listHeader}>Transactions</Text>
        {(items ?? []).length === 0 ? (
          <View testID="empty-state" style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No transactions yet. Add your first one.
            </Text>
          </View>
        ) : (
          <FlashList
            data={items}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={72}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const shadow = Platform.select({
  ios: {
    shadowColor: '#18170F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  android: {
    elevation: 2,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2EC',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F2EC',
  },
  errorText: {
    fontSize: 15,
    color: '#C1281A',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  summaryHeader: {
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 4,
    paddingTop: 8,
  },
  goalsButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FDFCFA',
    borderWidth: 1,
    borderColor: '#E0DBCF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalsButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#18170F',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 4,
    gap: 8,
    ...shadow,
  },
  card: {
    backgroundColor: '#FDFCFA',
    borderRadius: 12,
    padding: 16,
  },
  cardFull: {
    width: '100%',
  },
  cardThird: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: '#857F72',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  balanceAmount: {
    fontSize: 28,
    color: '#18170F',
  },
  incomeAmount: {
    color: '#0D7040',
  },
  expenseAmount: {
    color: '#C1281A',
  },
  savingsAmount: {
    color: '#1E52BB',
  },
  progressSection: {
    marginTop: 8,
  },
  progressTrack: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#E0DBCF',
  },
  progressFill: {
    borderRadius: 2,
  },
  progressRemainder: {
    backgroundColor: 'transparent',
  },
  progressLabel: {
    fontSize: 10,
    color: '#857F72',
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  listHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#857F72',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 15,
    color: '#857F72',
    textAlign: 'center',
  },
})
