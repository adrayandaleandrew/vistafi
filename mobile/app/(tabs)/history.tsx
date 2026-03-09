import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useAuth } from '../../src/providers/AuthProvider'
import { useBudgetItems } from '../../src/hooks/useBudgetItems'
import { useDeleteItem } from '../../src/hooks/useBudgetMutations'
import TransactionItem from '../../src/components/TransactionItem'
import type { BudgetItem, BudgetCategory } from '@shared/types/budget'

type FilterCategory = BudgetCategory | 'all'

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expense' },
  { key: 'savings', label: 'Savings' },
]

export default function HistoryScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const { data: items, isLoading } = useBudgetItems(user?.id ?? '')
  const { mutate: deleteMutate } = useDeleteItem(user?.id ?? '')

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all')
  const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null)
  const [actionSheetVisible, setActionSheetVisible] = useState(false)

  const filtered = (items ?? []).filter((item) => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesSearch = item.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleLongPress = useCallback((item: BudgetItem) => {
    setSelectedItem(item)
    setActionSheetVisible(true)
  }, [])

  const handleEdit = useCallback(() => {
    setActionSheetVisible(false)
    if (selectedItem) {
      router.push({
        pathname: '/edit-transaction',
        params: {
          id: selectedItem.id,
          description: selectedItem.description,
          amount: String(selectedItem.amount),
          category: selectedItem.category,
          date: selectedItem.date,
        },
      })
    }
  }, [selectedItem, router])

  const handleDelete = useCallback(() => {
    setActionSheetVisible(false)
    if (selectedItem) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      deleteMutate(selectedItem.id, {})
    }
  }, [selectedItem, deleteMutate])

  const handleDismiss = useCallback(() => {
    setActionSheetVisible(false)
    setSelectedItem(null)
  }, [])

  const keyExtractor = useCallback((item: BudgetItem) => item.id, [])

  const renderItem = useCallback(({ item }: { item: BudgetItem }) => (
    <TransactionItem
      item={item}
      testID={`transaction-item-${item.id}`}
      onLongPress={() => handleLongPress(item)}
    />
  ), [handleLongPress])

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          testID="search-input"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search transactions..."
          placeholderTextColor="#857F72"
        />
      </View>

      {/* Filter Pills */}
      <View style={styles.filterRow}>
        {FILTERS.map(({ key, label }) => (
          <Pressable
            key={key}
            testID={`filter-${key}`}
            style={[
              styles.filterPill,
              filterCategory === key && styles.filterPillActive,
            ]}
            onPress={() => setFilterCategory(key)}
          >
            <Text
              style={[
                styles.filterText,
                filterCategory === key && styles.filterTextActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      {!isLoading && filtered.length === 0 ? (
        <View testID="empty-state" style={styles.emptyState}>
          <Text style={styles.emptyText}>No transactions match your filter.</Text>
        </View>
      ) : (
        <FlashList
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={72}
        />
      )}

      {/* Action Sheet Modal */}
      <Modal
        visible={actionSheetVisible}
        transparent
        animationType="fade"
        onRequestClose={handleDismiss}
      >
        <Pressable style={styles.backdrop} onPress={handleDismiss}>
          <View style={styles.actionSheet}>
            <Text style={styles.actionTitle} numberOfLines={1}>
              {selectedItem?.description}
            </Text>
            <Pressable
              testID="action-edit"
              style={styles.actionButton}
              onPress={handleEdit}
            >
              <Text style={styles.actionText}>Edit</Text>
            </Pressable>
            <Pressable
              testID="action-delete"
              style={[styles.actionButton, styles.actionDelete]}
              onPress={handleDelete}
            >
              <Text style={[styles.actionText, styles.actionDeleteText]}>Delete</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={handleDismiss}>
              <Text style={[styles.actionText, styles.actionCancelText]}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2EC',
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#FDFCFA',
    borderWidth: 1,
    borderColor: '#E0DBCF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#18170F',
    minHeight: 44,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0DBCF',
    backgroundColor: '#FDFCFA',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#18170F',
    borderColor: '#18170F',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#857F72',
  },
  filterTextActive: {
    color: '#FDFCFA',
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: '#FDFCFA',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
    paddingTop: 12,
  },
  actionTitle: {
    fontSize: 13,
    color: '#857F72',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0DBCF',
    minHeight: 44,
  },
  actionText: {
    fontSize: 16,
    color: '#18170F',
  },
  actionDelete: {},
  actionDeleteText: {
    color: '#C1281A',
    fontWeight: '600',
  },
  actionCancelText: {
    color: '#857F72',
  },
})
