
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  const icons = {
    index: 'home-outline',
    habits: 'checkbox-outline',
    progress: 'stats-chart-outline',
    settings: 'settings-outline',
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={icons[route.name] || 'ellipse-outline'}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="habits" options={{ title: 'Hábitos' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progresso' }} />
      <Tabs.Screen name="settings" options={{ title: 'Configurações' }} />
    </Tabs>
  );
}
