
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../../contexts/HabitsContext';
import {
  scheduleDailyReminder,
  cancelDailyReminder,
} from '../../services/notifications';

const STORAGE_KEY = '@habitgo:habit-notifications';
const OLD_STORAGE_KEY = '@habitgo:notification-settings';

function formatTime(value) {
  return String(value).padStart(2, '0');
}

export default function SettingsScreen() {
  const { habits, loading: habitsLoading, error } = useHabits();

  const [reminders, setReminders] = useState({});
  const [draftTimes, setDraftTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState('');

  const remindersRef = useRef({});
  const busyRef = useRef(false);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const [saved, oldSaved] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(OLD_STORAGE_KEY),
        ]);

        const settings = saved ? JSON.parse(saved) : {};

        if (oldSaved && Platform.OS !== 'web') {
          const previous = JSON.parse(oldSaved);

          if (previous.notificationId) {
            await cancelDailyReminder(previous.notificationId);
          }

          await AsyncStorage.removeItem(OLD_STORAGE_KEY);
        }

        if (!active) return;

        remindersRef.current = settings;
        setReminders(settings);

        const times = {};

        Object.entries(settings).forEach(([id, value]) => {
          times[id] = {
            hour: value.hour ?? 8,
            minute: value.minute ?? 0,
          };
        });

        setDraftTimes(times);
      } catch (err) {
        console.error('Erro ao carregar lembretes:', err);

        if (active) {
          setMessage('Não foi possível carregar os lembretes.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading || habitsLoading || busyRef.current) return;

    let cancelled = false;

    async function removeDeletedHabits() {
      const current = remindersRef.current;
      const validIds = new Set(habits.map((habit) => habit.id));

      const removedIds = Object.keys(current).filter(
        (id) => !validIds.has(id)
      );

      if (removedIds.length === 0) return;

      busyRef.current = true;

      try {
        for (const id of removedIds) {
          if (current[id]?.notificationId) {
            await cancelDailyReminder(current[id].notificationId);
          }
        }

        const updated = { ...remindersRef.current };

        removedIds.forEach((id) => {
          delete updated[id];
        });

        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );

        if (!cancelled) {
          remindersRef.current = updated;
          setReminders(updated);
        }
      } catch (err) {
        console.error('Erro ao limpar lembretes:', err);
      } finally {
        busyRef.current = false;
      }
    }

    removeDeletedHabits();

    return () => {
      cancelled = true;
    };
  }, [habits, habitsLoading, loading, reminders]);

  async function updateReminder(habit, enabled, hour, minute) {
    if (busyRef.current || Platform.OS === 'web') return;

    busyRef.current = true;
    setSavingId(habit.id);
    setMessage('');

    const previous = remindersRef.current[habit.id];
    let newNotificationId = null;

    try {
      if (enabled) {
        newNotificationId = await scheduleDailyReminder(
          hour,
          minute,
          habit.name
        );
      }

      const updated = {
        ...remindersRef.current,
        [habit.id]: {
          enabled,
          hour,
          minute,
          notificationId: newNotificationId,
        },
      };

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );

      remindersRef.current = updated;
      setReminders(updated);

      setDraftTimes((current) => ({
        ...current,
        [habit.id]: { hour, minute },
      }));

      if (previous?.notificationId) {
        try {
          await cancelDailyReminder(previous.notificationId);
        } catch (cancelError) {
          console.error(
            'Erro ao cancelar lembrete anterior:',
            cancelError
          );
          setMessage(
            'Configuração salva, mas não foi possível cancelar o lembrete anterior.'
          );
          return;
        }
      }

      setMessage(
        enabled
          ? `Lembrete de ${habit.name} configurado para ${formatTime(hour)}:${formatTime(minute)}.`
          : `Lembrete de ${habit.name} desativado.`
      );
    } catch (err) {
      if (newNotificationId) {
        try {
          await cancelDailyReminder(newNotificationId);
        } catch (cancelError) {
          console.error(
            'Erro ao desfazer agendamento:',
            cancelError
          );
        }
      }

      const errorMessage =
        err?.message ?? 'Não foi possível salvar o lembrete.';

      setMessage(errorMessage);
      Alert.alert('Notificações', errorMessage);
    } finally {
      busyRef.current = false;
      setSavingId(null);
    }
  }

  function changeTime(habitId, field, amount) {
    setDraftTimes((current) => {
      const saved = remindersRef.current[habitId];

      const previous = current[habitId] ?? {
        hour: saved?.hour ?? 8,
        minute: saved?.minute ?? 0,
      };

      const limit = field === 'hour' ? 24 : 60;

      return {
        ...current,
        [habitId]: {
          ...previous,
          [field]: (previous[field] + amount + limit) % limit,
        },
      };
    });
  }

  function renderHabit(habit) {
    const saved = reminders[habit.id] ?? {
      enabled: false,
      hour: 8,
      minute: 0,
    };

    const draft = draftTimes[habit.id] ?? {
      hour: saved.hour,
      minute: saved.minute,
    };

    const isSaving = savingId === habit.id;
    const disabled =
      Platform.OS === 'web' || savingId !== null;

    const hasChanges =
      draft.hour !== saved.hour ||
      draft.minute !== saved.minute;

    return (
      <View key={habit.id} style={styles.habitCard}>
        <View style={styles.habitHeader}>
          <View style={styles.habitIcon}>
            <Ionicons
              name="leaf-outline"
              size={22}
              color="#2563EB"
            />
          </View>

          <View style={styles.habitInfo}>
            <Text style={styles.habitName}>
              {habit.name}
            </Text>

            <Text style={styles.habitStatus}>
              {saved.enabled
                ? `Ativado às ${formatTime(saved.hour)}:${formatTime(saved.minute)}`
                : 'Lembrete desativado'}
            </Text>
          </View>

          <Switch
            value={saved.enabled}
            disabled={disabled}
            onValueChange={(enabled) =>
              updateReminder(
                habit,
                enabled,
                draft.hour,
                draft.minute
              )
            }
            trackColor={{
              false: '#CBD5E1',
              true: '#93C5FD',
            }}
            thumbColor={
              saved.enabled ? '#2563EB' : '#F1F5F9'
            }
          />
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.timeTitle}>
            Horário do lembrete
          </Text>

          <View style={styles.timePicker}>
            <View style={styles.timeControl}>
              <Pressable
                style={styles.timeButton}
                disabled={disabled}
                onPress={() =>
                  changeTime(habit.id, 'hour', 1)
                }
              >
                <Ionicons
                  name="chevron-up"
                  size={23}
                  color="#2563EB"
                />
              </Pressable>

              <Text style={styles.timeNumber}>
                {formatTime(draft.hour)}
              </Text>

              <Pressable
                style={styles.timeButton}
                disabled={disabled}
                onPress={() =>
                  changeTime(habit.id, 'hour', -1)
                }
              >
                <Ionicons
                  name="chevron-down"
                  size={23}
                  color="#2563EB"
                />
              </Pressable>
            </View>

            <Text style={styles.timeSeparator}>:</Text>

            <View style={styles.timeControl}>
              <Pressable
                style={styles.timeButton}
                disabled={disabled}
                onPress={() =>
                  changeTime(habit.id, 'minute', 1)
                }
              >
                <Ionicons
                  name="chevron-up"
                  size={23}
                  color="#2563EB"
                />
              </Pressable>

              <Text style={styles.timeNumber}>
                {formatTime(draft.minute)}
              </Text>

              <Pressable
                style={styles.timeButton}
                disabled={disabled}
                onPress={() =>
                  changeTime(habit.id, 'minute', -1)
                }
              >
                <Ionicons
                  name="chevron-down"
                  size={23}
                  color="#2563EB"
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={[
              styles.saveButton,
              (disabled || !hasChanges) &&
                styles.saveButtonDisabled,
            ]}
            disabled={disabled || !hasChanges}
            onPress={() =>
              updateReminder(
                habit,
                saved.enabled,
                draft.hour,
                draft.minute
              )
            }
          >
            {isSaving ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Ionicons
                name="save-outline"
                size={18}
                color="#FFFFFF"
              />
            )}

            <Text style={styles.saveButtonText}>
              {isSaving ? 'Salvando...' : 'Salvar horário'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (loading || habitsLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
        <Text style={styles.loadingText}>
          Carregando configurações...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Configurações
        </Text>

        <Text style={styles.subtitle}>
          Personalize os lembretes dos seus hábitos.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#2563EB"
            />
          </View>

          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitle}>
              Notificações dos hábitos
            </Text>

            <Text style={styles.sectionDescription}>
              Configure um horário para cada hábito.
            </Text>
          </View>
        </View>

        {Platform.OS === 'web' && (
          <Text style={styles.notice}>
            As notificações estão disponíveis no aplicativo Android.
          </Text>
        )}

        {error ? (
          <Text style={styles.errorText}>
            {error}
          </Text>
        ) : habits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="leaf-outline"
              size={40}
              color="#94A3B8"
            />

            <Text style={styles.emptyText}>
              Cadastre um hábito para configurar seus lembretes.
            </Text>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {habits.map(renderHabit)}
          </View>
        )}

        {message !== '' && (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              {message}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="phone-portrait-outline"
              size={24}
              color="#2563EB"
            />
          </View>

          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitle}>
              Plataforma
            </Text>

            <Text style={styles.sectionDescription}>
              {Platform.OS === 'android'
                ? 'Aplicativo Android'
                : Platform.OS === 'ios'
                  ? 'Aplicativo iOS'
                  : 'Versão Web'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Ionicons
          name="leaf-outline"
          size={22}
          color="#16A34A"
        />

        <Text style={styles.footerText}>
          HabitGo — Um hábito de cada vez.
        </Text>
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
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  sectionDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
    lineHeight: 18,
  },
  habitsList: {
    marginTop: 20,
    gap: 12,
  },
  habitCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  habitStatus: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  timeSection: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  timeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  timeControl: {
    alignItems: 'center',
    gap: 8,
  },
  timeButton: {
    width: 46,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    minWidth: 62,
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#64748B',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 11,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  notice: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  messageBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  messageText: {
    fontSize: 13,
    color: '#1D4ED8',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 16,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
  },
});
