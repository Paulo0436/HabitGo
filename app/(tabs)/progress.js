
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../../contexts/HabitsContext';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDateOffset(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);

  return formatDate(date);
}

function getWeekDays() {
  const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return Array.from({ length: 7 }, (_, index) => {
    const offset = index - 6;
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offset);

    return {
      date: formatDate(date),
      label: labels[date.getDay()],
      day: date.getDate(),
    };
  });
}

function getCompletedCount(habits, date) {
  return habits.filter((habit) =>
    (habit.completedDates ?? []).includes(date)
  ).length;
}

function getCurrentStreak(habits) {
  if (habits.length === 0) {
    return 0;
  }

  let streak = 0;
  let offset = 0;

  const today = getDateOffset(0);

  if (getCompletedCount(habits, today) !== habits.length) {
    offset = -1;
  }

  while (offset >= -365) {
    const date = getDateOffset(offset);

    if (getCompletedCount(habits, date) !== habits.length) {
      break;
    }

    streak += 1;
    offset -= 1;
  }

  return streak;
}

export default function ProgressScreen() {
  const { habits, loading, error } = useHabits();
  const [selectedDay, setSelectedDay] = useState(null);

  const today = getDateOffset(0);
  const weekDays = getWeekDays();
  const totalHabits = habits.length;
  const completedToday = getCompletedCount(habits, today);

  const todayPercentage =
    totalHabits > 0
      ? Math.round((completedToday / totalHabits) * 100)
      : 0;

  const streak = getCurrentStreak(habits);

  const weeklyData = weekDays.map((day) => {
    const completed = getCompletedCount(habits, day.date);

    return {
      ...day,
      completed,
      percentage:
        totalHabits > 0
          ? Math.round((completed / totalHabits) * 100)
          : 0,
    };
  });

  const selectedData =
    weeklyData.find((day) => day.date === selectedDay) ??
    weeklyData[6];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.statusText}>
          Carregando progresso...
        </Text>
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Meu Progresso</Text>
        <Text style={styles.subtitle}>
          Acompanhe sua evolução diária.
        </Text>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Ionicons
            name="checkmark-circle-outline"
            size={28}
            color="#16A34A"
          />

          <Text style={styles.summaryNumber}>
            {completedToday}/{totalHabits}
          </Text>

          <Text style={styles.summaryLabel}>
            Concluídos hoje
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons
            name="pie-chart-outline"
            size={28}
            color="#2563EB"
          />

          <Text style={styles.summaryNumber}>
            {todayPercentage}%
          </Text>

          <Text style={styles.summaryLabel}>
            Progresso diário
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons
            name="flame-outline"
            size={28}
            color="#EA580C"
          />

          <Text style={styles.summaryNumber}>
            {streak}
          </Text>

          <Text style={styles.summaryLabel}>
            Dias de sequência
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons
            name="list-outline"
            size={28}
            color="#7C3AED"
          />

          <Text style={styles.summaryNumber}>
            {totalHabits}
          </Text>

          <Text style={styles.summaryLabel}>
            Hábitos cadastrados
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Progresso de hoje
        </Text>

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            {completedToday} de {totalHabits} hábitos
          </Text>

          <Text style={styles.progressPercentage}>
            {todayPercentage}%
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${todayPercentage}%` },
            ]}
          />
        </View>

        <Text style={styles.helperText}>
          {totalHabits === 0
            ? 'Cadastre seu primeiro hábito para começar.'
            : completedToday === totalHabits
              ? 'Todos os hábitos foram concluídos hoje!'
              : 'Continue registrando seus hábitos ao longo do dia.'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Últimos 7 dias
        </Text>

        <Text style={styles.helperText}>
          Percentual de hábitos concluídos por dia
        </Text>

        <View style={styles.chart}>
          {weeklyData.map((day) => {
            const isSelected =
              (selectedDay ?? today) === day.date;

            return (
              <Pressable
                key={day.date}
                style={styles.chartColumn}
                onPress={() => setSelectedDay(day.date)}
                accessibilityRole="button"
                accessibilityLabel={`${day.label}, dia ${day.day}: ${day.percentage}% concluído`}
              >
                <Text style={styles.chartPercentage}>
                  {day.percentage}%
                </Text>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${day.percentage}%`,
                        backgroundColor: isSelected
                          ? '#2563EB'
                          : '#93C5FD',
                      },
                    ]}
                  />
                </View>

                <Text
                  style={[
                    styles.dayLabel,
                    isSelected && styles.selectedDayLabel,
                  ]}
                >
                  {day.label}
                </Text>

                <Text style={styles.dayNumber}>
                  {day.day}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.selectedDayBox}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color="#2563EB"
          />

          <Text style={styles.selectedDayText}>
            {selectedData.date}: {selectedData.completed} de{' '}
            {totalHabits} hábitos concluídos
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Progresso por hábito
        </Text>

        {habits.length === 0 ? (
          <Text style={styles.helperText}>
            Nenhum hábito cadastrado.
          </Text>
        ) : (
          habits.map((habit) => {
            const completedDates = habit.completedDates ?? [];
            const completed = completedDates.includes(today);

            return (
              <View
                key={habit.id}
                style={styles.habitRow}
              >
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>
                    {habit.name}
                  </Text>

                  <Text style={styles.habitDetails}>
                    {completedDates.length} conclusão(ões)
                    registrada(s)
                  </Text>
                </View>

                <Ionicons
                  name={
                    completed
                      ? 'checkmark-circle'
                      : 'ellipse-outline'
                  }
                  size={25}
                  color={completed ? '#16A34A' : '#94A3B8'}
                />
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  statusText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
    textAlign: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 6,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    width: '48%',
    flexGrow: 1,
    alignItems: 'center',
    gap: 8,
  },
  summaryNumber: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  progressPercentage: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 8,
  },
  helperText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 8,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 24,
    gap: 6,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  chartPercentage: {
    fontSize: 10,
    color: '#64748B',
  },
  barTrack: {
    height: 110,
    width: '75%',
    maxWidth: 35,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  selectedDayLabel: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  dayNumber: {
    fontSize: 10,
    color: '#94A3B8',
  },
  selectedDayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
  },
  selectedDayText: {
    fontSize: 12,
    color: '#1D4ED8',
    flex: 1,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  habitInfo: {
    flex: 1,
    paddingRight: 12,
  },
  habitName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  habitDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
  },
});
