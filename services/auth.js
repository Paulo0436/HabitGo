
import {
    onAuthStateChanged,
    signInAnonymously,
  } from 'firebase/auth';
  
  import { auth } from './firebase';
  
  export function initializeAnonymousAuth() {
    return new Promise((resolve, reject) => {
      let unsubscribe = () => {};
  
      unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          unsubscribe();
  
          if (user) {
            resolve(user);
            return;
          }
  
          try {
            const result = await signInAnonymously(auth);
            resolve(result.user);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );
    });
  }
  