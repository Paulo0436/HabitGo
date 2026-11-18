
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../../contexts/HabitsContext';

export default function HabitsScreen() {
  const { habits, loading, error } = useHabits();

  function openHabit(id) {
    router.push({
      pathname: '/habit/[id]',
      params: { id },
    });
  }

  function renderHabit({ item }) {
    return (
      <Pressable
        style={styles.card}
        onPress={() => openHabit(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`Gerenciar ${item.name}`}
      >
        <View style={styles.habitIcon}>
          <Ionicons
            name="leaf-outline"
            size={23}
            color="#2563EB"
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.habitName}>{item.name}</Text>

          {item.description ? (
            <Text style={styles.description}>
              {item.description}
            </Text>
          ) : null}

          <View style={styles.frequencyRow}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color="#64748B"
            />
            <Text style={styles.frequency}>
              {item.frequency}
            </Text>
          </View>
        </View>

        <View style={styles.editIcon}>
          <Ionicons
            name="create-outline"
            size={22}
            color="#2563EB"
          />
        </View>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.statusText}>
          Carregando hábitos...
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Meus Hábitos</Text>
          <Text style={styles.subtitle}>
            Adicione e gerencie seus hábitos.
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/habit/new')}
          accessibilityRole="button"
          accessibilityLabel="Adicionar novo hábito"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Novo</Text>
        </Pressable>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderHabit}
        contentContainerStyle={styles.list}
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
              Comece adicionando seu primeiro hábito!
            </Text>

            <Pressable
              style={styles.emptyButton}
              onPress={() => router.push('/habit/new')}
            >
              <Ionicons
                name="add"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.emptyButtonText}>
                Criar hábito
              </Text>
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
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  statusText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
  },
  addButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexGrow: 1,
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
  habitIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
    paddingRight: 12,
  },
  habitName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
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
  editIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
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
  emptyButton: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
