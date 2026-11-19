
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { HabitsProvider } from '../contexts/HabitsContext';
import { initializeAnonymousAuth } from '../services/auth';

export default function RootLayout() {
  useEffect(() => {
    initializeAnonymousAuth()
      .then((user) => {
        console.log('Firebase Auth conectado:', user.uid);
      })
      .catch((error) => {
        console.error(
          'Erro na autenticação Firebase:',
          error.code,
          error.message
        );
      });
  }, []);

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
