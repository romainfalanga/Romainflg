import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBrdHLIBSsZ8Ez6JEud3NQq6O67Q1_cD_s",
  authDomain: "romain-flg.firebaseapp.com",
  projectId: "romain-flg",
  storageBucket: "romain-flg.firebasestorage.app",
  messagingSenderId: "742176302732",
  appId: "1:742176302732:web:a8218c4b8452d6cfc73da9",
  measurementId: "G-JGMQ2X96RY"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore
export const db = getFirestore(app);

// Initialiser Auth
export const auth = getAuth(app);

// Initialiser Storage
export const storage = getStorage(app);

// Types pour l'application
export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Credits {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'spend';
  description: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  telegram_url?: string;
  is_active: boolean;
  created_at: string;
}