
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../../contexts/HabitsContext';

export default function HabitDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { habits, updateHabit, deleteHabit } = useHabits();

  const habit = habits.find((item) => item.id === id);

  const [editing, setEditing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [name, setName] = useState(habit?.name ?? '');
  const [description, setDescription] = useState(
    habit?.description ?? ''
  );
  const [frequency, setFrequency] = useState(
    habit?.frequency ?? 'Diário'
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleEdit() {
    if (!habit) return;

    setName(habit.name);
    setDescription(habit.description ?? '');
    setFrequency(habit.frequency);
    setError('');
    setSuccess('');
    setEditing(true);
  }

  function handleSave() {
    if (!habit) return;

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

    updateHabit({
      id: habit.id,
      name: cleanName,
      description: cleanDescription,
      frequency,
    });

    setError('');
    setEditing(false);
    setSuccess('Hábito atualizado com sucesso!');
  }

  function handleCancel() {
    setEditing(false);
    setError('');
  }

  function handleDelete() {
    setDeleteModalVisible(true);
  }

  function confirmDelete() {
    if (!habit) return;

    setDeleteModalVisible(false);
    deleteHabit(habit.id);
    router.replace('/habits');
  }

  if (!habit) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color="#94A3B8"
        />

        <Text style={styles.title}>
          Hábito não encontrado
        </Text>

        <Text style={styles.description}>
          O hábito pode ter sido removido ou os dados
          ainda não foram carregados.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace('/habits')}
        >
          <Text style={styles.buttonText}>
            Voltar para hábitos
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {editing ? (
          <>
            <Text style={styles.screenTitle}>
              Editar hábito
            </Text>

            <Text style={styles.label}>
              Nome do hábito *
            </Text>

            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(value) => {
                setName(value);
                setError('');
              }}
              placeholder="Digite o nome do hábito"
              maxLength={60}
            />

            <Text style={styles.counter}>
              {name.length}/60
            </Text>

            <Text style={styles.label}>
              Descrição
            </Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva seu hábito"
              multiline
              maxLength={200}
              textAlignVertical="top"
            />

            <Text style={styles.counter}>
              {description.length}/200
            </Text>

            <Text style={styles.label}>
              Frequência
            </Text>

            <View style={styles.frequencyRow}>
              {['Diário', 'Semanal'].map((option) => (
                <Pressable
                  key={option}
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
              <View style={styles.errorBox}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#DC2626"
                />
                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            ) : null}

            <Pressable
              style={styles.button}
              onPress={handleSave}
            >
              <Ionicons
                name="save-outline"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.buttonText}>
                Salvar alterações
              </Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={handleCancel}
            >
              <Text style={styles.secondaryText}>
                Cancelar
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.screenTitle}>
              Detalhes do hábito
            </Text>

            {success ? (
              <View style={styles.successBox}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#15803D"
                />
                <Text style={styles.successText}>
                  {success}
                </Text>
              </View>
            ) : null}

            <View style={styles.card}>
              <View style={styles.habitIcon}>
                <Ionicons
                  name="leaf-outline"
                  size={28}
                  color="#2563EB"
                />
              </View>

              <Text style={styles.title}>
                {habit.name}
              </Text>

              <Text style={styles.description}>
                {habit.description || 'Sem descrição.'}
              </Text>

              <View style={styles.infoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#64748B"
                />
                <Text style={styles.infoText}>
                  Frequência: {habit.frequency}
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.button}
              onPress={handleEdit}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.buttonText}>
                Editar hábito
              </Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color="#DC2626"
              />
              <Text style={styles.deleteText}>
                Excluir hábito
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons
                name="trash-outline"
                size={28}
                color="#DC2626"
              />
            </View>

            <Text style={styles.modalTitle}>
              Excluir hábito?
            </Text>

            <Text style={styles.modalDescription}>
              Deseja realmente excluir "{habit.name}"?
              Esta ação não poderá ser desfeita.
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelText}>
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                style={styles.confirmDeleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmDeleteText}>
                  Excluir
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  habitIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: '#64748B',
    fontSize: 15,
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
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: 4,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyButton: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryText: {
    color: '#64748B',
    fontSize: 16,
  },
  deleteButton: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  deleteText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    flex: 1,
  },
  successBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  successText: {
    color: '#15803D',
    fontSize: 14,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
  },
  cancelText: {
    color: '#334155',
    fontWeight: '600',
  },
  confirmDeleteButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  confirmDeleteText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
