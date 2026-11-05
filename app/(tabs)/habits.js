
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HabitsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Hábitos</Text>

      <Button
        title="Adicionar hábito"
        onPress={() => router.push('/habit/new')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E293B',
  },
});
