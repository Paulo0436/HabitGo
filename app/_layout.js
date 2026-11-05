
import { Stack } from 'expo-router';
import { HabitsProvider } from '../contexts/HabitsContext';

export default function RootLayout() {
  return (
    <HabitsProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="habit/new"
          options={{ title: 'Novo hábito' }}
        />

        <Stack.Screen
          name="habit/[id]"
          options={{ title: 'Detalhes do hábito' }}
        />
      </Stack>
    </HabitsProvider>
  );
}
