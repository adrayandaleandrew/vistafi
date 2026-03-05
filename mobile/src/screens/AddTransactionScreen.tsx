import { View, Text, StyleSheet } from 'react-native';
import type { BudgetCategory } from '@shared/types/budget';

const categories: BudgetCategory[] = ['income', 'expense', 'savings'];

export function AddTransactionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>
      <Text style={styles.subtitle}>Categories: {categories.join(', ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F2EC' },
  title: { fontSize: 20, fontWeight: '600', color: '#18170F' },
  subtitle: { marginTop: 8, fontSize: 14, color: '#857F72' },
});
