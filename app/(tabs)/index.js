
import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../../contexts/HabitsContext';

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function HomeScreen() {
  const {
    habits,
    loading,
    error,
    completeHabitToday,
    uncompleteHabitToday,
  } = useHabits();

  const [processingHabits, setProcessingHabits] = useState({});
  const [actionError, setActionError] = useState(null);

  const today = getTodayDate();

  const completedCount = habits.filter((habit) =>
    (habit.completedDates ?? []).includes(today)
  ).length;

  const progressPercentage =
    habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  async function toggleHabit(habit) {
    if (processingHabits[habit.id]) return;

    const isCompleted = (habit.completedDates ?? []).includes(today);

    setProcessingHabits((previous) => ({
      ...previous,
      [habit.id]: true,
    }));

    setActionError(null);

    try {
      if (isCompleted) {
        await uncompleteHabitToday(habit.id);
      } else {
        await completeHabitToday(habit.id);
      }
    } catch (err) {
      console.error('Erro ao atualizar hábito:', err);
      setActionError('Não foi possível atualizar o hábito.');
    } finally {
      setProcessingHabits((previous) => ({
        ...previous,
        [habit.id]: false,
      }));
    }
  }

  function renderHabit({ item }) {
    const isCompleted = (item.completedDates ?? []).includes(today);
    const isProcessing = Boolean(processingHabits[item.id]);

    return (
      <View style={[styles.card, isCompleted && styles.completedCard]}>
        <Pressable
          style={styles.checkButton}
          onPress={() => toggleHabit(item)}
          disabled={isProcessing}
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: isCompleted,
            disabled: isProcessing,
          }}
          accessibilityLabel={
            isCompleted ? `Desmarcar ${item.name}` : `Concluir ${item.name}`
          }
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
              size={30}
              color={isCompleted ? '#16A34A' : '#94A3B8'}
            />
          )}
        </Pressable>

        <View style={styles.cardContent}>
          <Text style={[styles.habitName, isCompleted && styles.completedName]}>
            {item.name}
          </Text>

          {item.description ? (
            <Text style={styles.description}>{item.description}</Text>
          ) : null}

          <View style={styles.frequencyRow}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color="#64748B"
            />
            <Text style={styles.frequency}>{item.frequency}</Text>
          </View>

          {isCompleted && (
            <View style={styles.completedRow}>
              <Ionicons
                name="checkmark-circle"
                size={15}
                color="#16A34A"
              />
              <Text style={styles.completedText}>Concluído hoje</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.statusText}>Carregando hábitos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="cloud-offline-outline"
          size={48}
          color="#DC2626"
        />
        <Text style={styles.statusText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderHabit}
        extraData={processingHabits}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Minha Rotina</Text>
              <Text style={styles.subtitle}>
                Acompanhe e conclua seus hábitos de hoje.
              </Text>
            </View>

            {actionError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{actionError}</Text>
              </View>
            )}

            {habits.length > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>
                    Progresso de hoje
                  </Text>

                  <Text style={styles.progressCount}>
                    {completedCount}/{habits.length}
                  </Text>
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progressPercentage}%` },
                    ]}
                  />
                </View>

                <Text style={styles.progressDescription}>
                  {completedCount === habits.length
                    ? 'Parabéns! Todos os hábitos foram concluídos!'
                    : `${habits.length - completedCount} hábito(s) pendente(s)`}
                </Text>
              </View>
            )}

            {habits.length > 0 && (
              <Text style={styles.sectionTitle}>
                Hábitos de hoje
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="leaf-outline"
              size={54}
              color="#94A3B8"
            />

            <Text style={styles.emptyTitle}>
              Nenhum hábito cadastrado
            </Text>

            <Text style={styles.emptyText}>
              Adicione seu primeiro hábito para começar sua rotina.
            </Text>

            <Pressable
              style={styles.addButton}
              onPress={() => router.push('/habit/new')}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Criar hábito</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  statusText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  progressCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 10,
  },
  progressDescription: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  checkButton: {
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  completedName: {
    color: '#15803D',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  frequencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  frequency: {
    fontSize: 13,
    color: '#64748B',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  completedText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
  },
  errorContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 70,
    paddingHorizontal: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
