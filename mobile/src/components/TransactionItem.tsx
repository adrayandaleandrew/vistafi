import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { BudgetItem, BudgetCategory } from '@shared/types/budget'

interface Props {
  readonly item: BudgetItem
  readonly onLongPress?: () => void
  readonly testID?: string
}

const CATEGORY_COLOR: Record<BudgetCategory, string> = {
  income: '#0D7040',
  expense: '#C1281A',
  savings: '#1E52BB',
}

const CATEGORY_LABEL: Record<BudgetCategory, string> = {
  income: 'Income',
  expense: 'Expense',
  savings: 'Savings',
}

function TransactionItemComponent({ item, onLongPress, testID }: Props) {
  const color = CATEGORY_COLOR[item.category]
  const label = CATEGORY_LABEL[item.category]

  return (
    <View
      style={styles.row}
      testID={testID ?? `transaction-item-${item.id}`}
      onStartShouldSetResponder={() => true}
      onLongPress={onLongPress}
      accessible
    >
      <View style={styles.left}>
        <Text style={styles.description} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.meta}>
          {label} · {item.date}
        </Text>
      </View>
      <Text style={[styles.amount, { color }]}>
        {item.category === 'expense' ? '-' : '+'}${item.amount.toFixed(2)}
      </Text>
    </View>
  )
}

const TransactionItem = React.memo(TransactionItemComponent)
export default TransactionItem

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 72,
    backgroundColor: '#FDFCFA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0DBCF',
  },
  left: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: '#18170F',
  },
  meta: {
    fontSize: 12,
    color: '#857F72',
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
})
