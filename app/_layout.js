
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
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
  );
}
