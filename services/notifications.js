
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'habitgo-reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  if (Platform.OS === 'web') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Lembretes do HabitGo',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  const currentPermissions = await Notifications.getPermissionsAsync();

  if (currentPermissions.granted) {
    return true;
  }

  const requestedPermissions =
    await Notifications.requestPermissionsAsync();

  return requestedPermissions.granted;
}

export async function scheduleDailyReminder(
  hour,
  minute,
  habitName = null
) {
  if (Platform.OS === 'web') {
    return null;
  }

  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    throw new Error(
      'Permissão para notificações não concedida.'
    );
  }

  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: habitName
          ? `Hora de ${habitName}! 🌱`
          : 'Hora dos seus hábitos! 🌱',
        body: habitName
          ? `Não se esqueça de realizar seu hábito: ${habitName}.`
          : 'Reserve um momento para registrar seus hábitos no HabitGo.',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        ...(Platform.OS === 'android'
          ? { channelId: CHANNEL_ID }
          : {}),
      },
    });

  return notificationId;
}

export async function cancelDailyReminder(notificationId) {
  if (Platform.OS === 'web' || !notificationId) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(
    notificationId
  );
}
