
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import { db } from './firebase';

function habitsCollection(userId) {
  return collection(db, 'users', userId, 'habits');
}

function habitDocument(userId, habitId) {
  return doc(db, 'users', userId, 'habits', habitId);
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
  await addDoc(habitsCollection(userId), {
    ...habit,
    completedDates: [],
  });
}

export async function editHabit(userId, habit) {
  const { id, completedDates, ...data } = habit;

  await updateDoc(habitDocument(userId, id), data);
}

export async function removeHabit(userId, habitId) {
  await deleteDoc(habitDocument(userId, habitId));
}

export async function completeHabit(userId, habitId, date) {
  await updateDoc(habitDocument(userId, habitId), {
    completedDates: arrayUnion(date),
  });
}

export async function uncompleteHabit(userId, habitId, date) {
  await updateDoc(habitDocument(userId, habitId), {
    completedDates: arrayRemove(date),
  });
}
