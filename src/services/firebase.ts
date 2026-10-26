import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore & Auth services
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
