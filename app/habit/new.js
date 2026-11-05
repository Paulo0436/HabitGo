
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useHabits } from '../../contexts/HabitsContext';

export default function NewHabitScreen() {
  const { addHabit } = useHabits();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('Diário');
  const [error, setError] = useState('');

  function handleSave() {
    const cleanName = name.trim();

    if (cleanName.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres.');
      return;
    }

    setError('');

    addHabit({
      name: cleanName,
      description: description.trim(),
      frequency,
      createdAt: new Date().toISOString(),
    });

    Alert.alert('Sucesso', 'Hábito cadastrado com sucesso!');
    router.back();
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Nome do hábito *</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex.: Ler 20 minutos"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError('');
        }}
        maxLength={60}
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <Text style={styles.label}>Descrição</Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descreva seu objetivo"
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={200}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Frequência</Text>

      <View style={styles.frequencyContainer}>
        {['Diário', 'Semanal'].map((option) => (
          <Pressable
            key={option}
            style={[
              styles.frequencyButton,
              frequency === option && styles.selectedButton,
            ]}
            onPress={() => setFrequency(option)}
          >
            <Text
              style={[
                styles.frequencyText,
                frequency === option && styles.selectedText,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>Salvar hábito</Text>
      </Pressable>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: {
    height: 110,
  },
  error: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 6,
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  frequencyText: {
    color: '#334155',
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  errorText: {
    color: '#DC2626',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 32,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
