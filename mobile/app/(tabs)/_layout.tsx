import { Tabs } from 'expo-router'
import { StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

const ICON_SIZE = 24

function renderTabIcon(focused: boolean, active: IoniconName, inactive: IoniconName) {
  return (
    <Ionicons
      name={focused ? active : inactive}
      size={ICON_SIZE}
      color={focused ? '#18170F' : '#857F72'}
    />
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#18170F',
        tabBarInactiveTintColor: '#857F72',
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'home', 'home-outline'),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'add-circle', 'add-circle-outline'),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'list', 'list-outline'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'person', 'person-outline'),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FDFCFA',
    borderTopColor: '#E0DBCF',
  },
})
