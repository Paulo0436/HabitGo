
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../services/firebase';

import {
  subscribeToHabits,
  createHabit,
  editHabit,
  removeHabit,
  completeHabit,
  uncompleteHabit,
} from '../services/habits';

const HabitsContext = createContext(null);

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribeHabits = null;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (unsubscribeHabits) {
          unsubscribeHabits();
          unsubscribeHabits = null;
        }

        setHabits([]);
        setError(null);

        if (!user) {
          setUserId(null);
          setLoading(true);
          return;
        }

        setUserId(user.uid);
        setLoading(true);

        unsubscribeHabits = subscribeToHabits(
          user.uid,
          (data) => {
            setHabits(data);
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('Erro ao carregar hábitos:', err);
            setError('Não foi possível carregar os hábitos.');
            setLoading(false);
          }
        );
      },
      (err) => {
        console.error('Erro na autenticação:', err);
        setError('Falha na autenticação.');
        setLoading(false);
      }
    );

    return () => {
      unsubscribeAuth();

      if (unsubscribeHabits) {
        unsubscribeHabits();
      }
    };
  }, []);

  async function addHabit(habit) {
    if (!userId) {
      throw new Error('Usuário ainda não autenticado.');
    }

    await createHabit(userId, {
      name: habit.name,
      description: habit.description ?? '',
      frequency: habit.frequency,
    });
  }

  async function updateHabit(habit) {
    if (!userId) {
      throw new Error('Usuário ainda não autenticado.');
    }

    await editHabit(userId, habit);
  }

  async function deleteHabit(id) {
    if (!userId) {
      throw new Error('Usuário ainda não autenticado.');
    }

    await removeHabit(userId, id);
  }

  async function completeHabitToday(habitId) {
    if (!userId) {
      throw new Error('Usuário ainda não autenticado.');
    }

    await completeHabit(userId, habitId, getTodayDate());
  }

  async function uncompleteHabitToday(habitId) {
    if (!userId) {
      throw new Error('Usuário ainda não autenticado.');
    }

    await uncompleteHabit(userId, habitId, getTodayDate());
  }

  return (
    <HabitsContext.Provider
      value={{
        habits,
        userId,
        loading,
        error,
        addHabit,
        updateHabit,
        deleteHabit,
        completeHabitToday,
        uncompleteHabitToday,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);

  if (!context) {
    throw new Error(
      'useHabits deve ser usado dentro de HabitsProvider'
    );
  }

  return context;
}
