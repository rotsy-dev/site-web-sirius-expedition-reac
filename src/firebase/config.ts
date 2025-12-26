// src/firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:  "AIzaSyCdffy_SLEdjhbk3LgWc8fiU2IzUfHSBek",
  authDomain: "sirius-expedition.firebaseapp.com",
  projectId: "sirius-expedition",
  storageBucket: "sirius-expedition.firebasestorage.app",
  messagingSenderId: "645702472516",
  appId: "1:645702472516:web:caca105659522da5c9fd11",
};

// Empêche la double initialisation
export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
