
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
  } from 'firebase/firestore';
  
  import { db } from './firebase';
  
  function habitsCollection(userId) {
    return collection(db, 'users', userId, 'habits');
  }
  
  export function subscribeToHabits(userId, onData, onError) {
    return onSnapshot(
      habitsCollection(userId),
      (snapshot) => {
        const habits = snapshot.docs.map((document) => ({
          ...document.data(),
          id: document.id,
        }));
  
        onData(habits);
      },
      onError
    );
  }
  
  export async function createHabit(userId, habit) {
    await addDoc(habitsCollection(userId), habit);
  }
  
  export async function editHabit(userId, habit) {
    const { id, ...data } = habit;
  
    await updateDoc(
      doc(db, 'users', userId, 'habits', id),
      data
    );
  }
  
  export async function removeHabit(userId, habitId) {
    await deleteDoc(
      doc(db, 'users', userId, 'habits', habitId)
    );
  }
  