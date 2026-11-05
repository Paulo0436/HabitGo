
import {
    createContext,
    useContext,
    useReducer,
  } from 'react';
  
  const HabitsContext = createContext(null);
  
  const initialState = {
    habits: [],
  };
  
  function habitsReducer(state, action) {
    switch (action.type) {
      case 'ADD_HABIT':
        return {
          ...state,
          habits: [...state.habits, action.payload],
        };
  
      case 'UPDATE_HABIT':
        return {
          ...state,
          habits: state.habits.map((habit) =>
            habit.id === action.payload.id
              ? { ...habit, ...action.payload }
              : habit
          ),
        };
  
      case 'DELETE_HABIT':
        return {
          ...state,
          habits: state.habits.filter(
            (habit) => habit.id !== action.payload
          ),
        };
  
      default:
        return state;
    }
  }
  
  export function HabitsProvider({ children }) {
    const [state, dispatch] = useReducer(
      habitsReducer,
      initialState
    );
  
    function addHabit(habit) {
      dispatch({
        type: 'ADD_HABIT',
        payload: {
          ...habit,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        },
      });
    }
  
    function updateHabit(habit) {
      dispatch({
        type: 'UPDATE_HABIT',
        payload: habit,
      });
    }
  
    function deleteHabit(id) {
      dispatch({
        type: 'DELETE_HABIT',
        payload: id,
      });
    }
  
    return (
      <HabitsContext.Provider
        value={{
          habits: state.habits,
          addHabit,
          updateHabit,
          deleteHabit,
        }}
      >
        {children}
      </HabitsContext.Provider>
    );
  }
  
  export function useHabits() {
    const context = useContext(HabitsContext);
  
    if (!context) {
      throw new Error(
        'useHabits deve ser usado dentro de HabitsProvider'
      );
    }
  
    return context;
  }
  