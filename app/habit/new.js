
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useHabits } from '../../contexts/HabitsContext';

export default function NewHabitScreen() {
  const { addHabit, userId } = useHabits();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('Diário');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) return;

    const cleanName = name.trim();
    const cleanDescription = description.trim();

    if (cleanName.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres.');
      return;
    }

    if (cleanName.length > 60) {
      setError('O nome deve ter no máximo 60 caracteres.');
      return;
    }

    if (cleanDescription.length > 200) {
      setError('A descrição deve ter no máximo 200 caracteres.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await addHabit({
        name: cleanName,
        description: cleanDescription,
        frequency,
      });

      router.back();
    } catch (err) {
      console.error('Erro ao cadastrar hábito:', err);
      setError('Não foi possível salvar o hábito. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Novo hábito</Text>

      <Text style={styles.label}>Nome do hábito *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(value) => {
          setName(value);
          setError('');
        }}
        placeholder="Ex.: Estudar React Native"
        maxLength={60}
        editable={!saving}
      />

      <Text style={styles.counter}>{name.length}/60</Text>

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Descreva seu hábito"
        multiline
        maxLength={200}
        editable={!saving}
        textAlignVertical="top"
      />

      <Text style={styles.counter}>
        {description.length}/200
      </Text>

      <Text style={styles.label}>Frequência</Text>

      <View style={styles.frequencyRow}>
        {['Diário', 'Semanal'].map((option) => (
          <Pressable
            key={option}
            disabled={saving}
            style={[
              styles.frequencyButton,
              frequency === option && styles.selected,
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

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <Pressable
        style={[
          styles.button,
          (!userId || saving) && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={!userId || saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            {userId ? 'Salvar hábito' : 'Conectando ao Firebase...'}
          </Text>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
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
    minHeight: 110,
  },
  counter: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  selected: {
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
  error: {
    color: '#DC2626',
    marginTop: 18,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
