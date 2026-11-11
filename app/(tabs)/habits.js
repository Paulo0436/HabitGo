
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

  function renderHabit({ item }) {
    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/habit/[id]',
            params: { id: item.id },
          })
        }
      >
        <View style={styles.cardContent}>
          <Text style={styles.habitName}>
            {item.name}
          </Text>

          {item.description ? (
            <Text style={styles.description}>
              {item.description}
            </Text>
          ) : null}

          <View style={styles.frequencyRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color="#64748B"
            />
            <Text style={styles.frequency}>
              {item.frequency}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#94A3B8"
        />
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

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

        <Text style={styles.statusText}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Meus Hábitos
        </Text>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/habit/new')}
        >
          <Ionicons
            name="add"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.addButtonText}>
            Novo
          </Text>
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
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
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
});
