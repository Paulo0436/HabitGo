
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao HabitGo!</Text>
      <Text style={styles.subtitle}>
        Organize seus hábitos e acompanhe seu progresso.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748B',
  },
});
