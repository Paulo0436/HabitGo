
import { useEffect, useState } from 'react';
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
import {
  scheduleDailyReminder,
  cancelDailyReminder,
} from '../../services/notifications';

const STORAGE_KEY = '@habitgo:notification-settings';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [notificationId, setNotificationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const formatTime = (value) => String(value).padStart(2, '0');

  useEffect(() => {
    async function loadSettings() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          const settings = JSON.parse(saved);

          setNotificationsEnabled(
            settings.enabled === true && Platform.OS !== 'web'
          );
          setSelectedHour(settings.hour ?? 8);
          setSelectedMinute(settings.minute ?? 0);
          setNotificationId(settings.notificationId ?? null);
        }
      } catch {
        setMessage('Não foi possível carregar as configurações.');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function saveSettings(enabled, hour, minute, id) {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        enabled,
        hour,
        minute,
        notificationId: id,
      })
    );
  }

  async function updateReminder(enabled, hour, minute) {
    if (saving) {
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      if (Platform.OS === 'web') {
        setMessage(
          'Os lembretes estão disponíveis no aplicativo Android.'
        );
        return;
      }

      let newNotificationId = null;

      if (enabled) {
        newNotificationId = await scheduleDailyReminder(
          hour,
          minute
        );
      }

      if (notificationId) {
        await cancelDailyReminder(notificationId);
      }

      await saveSettings(
        enabled,
        hour,
        minute,
        newNotificationId
      );

      setNotificationsEnabled(enabled);
      setSelectedHour(hour);
      setSelectedMinute(minute);
      setNotificationId(newNotificationId);

      setMessage(
        enabled
          ? `Lembrete diário configurado para ${formatTime(hour)}:${formatTime(minute)}.`
          : 'Lembretes desativados.'
      );
    } catch (error) {
      const errorMessage =
        error?.message ??
        'Não foi possível atualizar o lembrete.';

      setMessage(errorMessage);

      if (Platform.OS !== 'web') {
        Alert.alert('Notificações', errorMessage);
      }
    } finally {
      setSaving(false);
    }
  }

  function changeHour(amount) {
    const nextHour = (selectedHour + amount + 24) % 24;

    if (notificationsEnabled) {
      updateReminder(true, nextHour, selectedMinute);
    } else {
      setSelectedHour(nextHour);
      saveSettings(false, nextHour, selectedMinute, null)
        .catch(() => {
          setMessage('Não foi possível salvar o horário.');
        });
    }
  }

  function changeMinute(amount) {
    const nextMinute = (selectedMinute + amount + 60) % 60;

    if (notificationsEnabled) {
      updateReminder(true, selectedHour, nextMinute);
    } else {
      setSelectedMinute(nextMinute);
      saveSettings(false, selectedHour, nextMinute, null)
        .catch(() => {
          setMessage('Não foi possível salvar o horário.');
        });
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
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
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>
          Personalize sua experiência no HabitGo.
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
              Lembretes diários
            </Text>
            <Text style={styles.sectionDescription}>
              Receba um aviso para não esquecer seus hábitos.
            </Text>
          </View>

          <Switch
            value={notificationsEnabled}
            onValueChange={(value) =>
              updateReminder(value, selectedHour, selectedMinute)
            }
            disabled={saving || Platform.OS === 'web'}
            trackColor={{
              false: '#CBD5E1',
              true: '#93C5FD',
            }}
            thumbColor={
              notificationsEnabled ? '#2563EB' : '#F1F5F9'
            }
          />
        </View>

        {Platform.OS === 'web' && (
          <Text style={styles.webNotice}>
            Os lembretes estão disponíveis no Android.
          </Text>
        )}

        {notificationsEnabled && (
          <View style={styles.timeSection}>
            <Text style={styles.timeTitle}>
              Horário do lembrete
            </Text>

            <View style={styles.timePicker}>
              <View style={styles.timeControl}>
                <Pressable
                  style={styles.timeButton}
                  onPress={() => changeHour(1)}
                  disabled={saving}
                >
                  <Ionicons
                    name="chevron-up"
                    size={24}
                    color="#2563EB"
                  />
                </Pressable>

                <Text style={styles.timeNumber}>
                  {formatTime(selectedHour)}
                </Text>

                <Pressable
                  style={styles.timeButton}
                  onPress={() => changeHour(-1)}
                  disabled={saving}
                >
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color="#2563EB"
                  />
                </Pressable>
              </View>

              <Text style={styles.timeSeparator}>:</Text>

              <View style={styles.timeControl}>
                <Pressable
                  style={styles.timeButton}
                  onPress={() => changeMinute(1)}
                  disabled={saving}
                >
                  <Ionicons
                    name="chevron-up"
                    size={24}
                    color="#2563EB"
                  />
                </Pressable>

                <Text style={styles.timeNumber}>
                  {formatTime(selectedMinute)}
                </Text>

                <Pressable
                  style={styles.timeButton}
                  onPress={() => changeMinute(-1)}
                  disabled={saving}
                >
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color="#2563EB"
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#2563EB"
              />
              <Text style={styles.infoText}>
                Horário selecionado: {formatTime(selectedHour)}:
                {formatTime(selectedMinute)}
              </Text>
            </View>
          </View>
        )}

        {saving && (
          <View style={styles.feedbackRow}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.feedbackText}>
              Salvando lembrete...
            </Text>
          </View>
        )}

        {message !== '' && (
          <Text style={styles.feedbackText}>
            {message}
          </Text>
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
  timeSection: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 20,
    paddingTop: 20,
  },
  timeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 18,
    gap: 12,
  },
  timeControl: {
    alignItems: 'center',
    gap: 8,
  },
  timeButton: {
    width: 48,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1E293B',
    minWidth: 65,
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#64748B',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1D4ED8',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  feedbackText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 12,
  },
  webNotice: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 14,
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
