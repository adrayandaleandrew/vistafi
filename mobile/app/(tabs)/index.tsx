import { View, Text, StyleSheet } from 'react-native'

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard — coming in Phase 12b</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F2EC' },
  text: { fontSize: 16, color: '#857F72' },
})
