
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function HabitDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Detalhes do hábito: {id}</Text>
    </View>
  );
}
