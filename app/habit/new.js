
import { View, Text, StyleSheet } from 'react-native';

export default function NewHabitScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar novo hábito</Text>
      <Text>Em breve, teremos o formulário de cadastro.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
