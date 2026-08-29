import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBLr3E3MJMJac60Ft9CJR7KX7xrQAtgB5A",
  authDomain: "sportagent-ae118.firebaseapp.com",
  projectId: "sportagent-ae118",
  storageBucket: "sportagent-ae118.firebasestorage.app",
  messagingSenderId: "818975064072",
  appId: "1:818975064072:web:01112bb59099a68fa9d1bd",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  query,
  where,
  serverTimestamp,
};
export type { FirebaseUser };
