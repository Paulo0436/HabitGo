
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBCe2tlW21-o9Sl-HnFsZB3emGGG3Gnnmw',
  authDomain: 'habitgo-df208.firebaseapp.com',
  projectId: 'habitgo-df208',
  storageBucket: 'habitgo-df208.firebasestorage.app',
  messagingSenderId: '798049093815',
  appId: '1:798049093815:web:43da7f9f7a34f3cf05e532',
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
