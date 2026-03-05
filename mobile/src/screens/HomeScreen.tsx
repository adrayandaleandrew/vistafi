import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { BudgetItem } from '@shared/types/budget';

export function HomeScreen() {
  const [items] = useState<BudgetItem[]>([]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VistaFi</Text>
      <Text style={styles.subtitle}>
        {items.length === 0 ? 'No transactions yet' : `${items.length} transactions`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F2EC' },
  title: { fontSize: 24, fontWeight: '700', color: '#18170F' },
  subtitle: { marginTop: 8, fontSize: 14, color: '#857F72' },
});
