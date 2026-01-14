// src/firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {  getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
import { getDatabase } from "firebase/database"; // Realtime Database


const firebaseConfig = {
  apiKey:  "AIzaSyA2i7wEhzTQO9CKA45meqnn70JunpdV2RY",
  authDomain: "site-web-sirius-expedition.firebaseapp.com",
  databaseURL: "https://sirius-expedition-default-rtdb.firebaseio.com", 
  projectId: "site-web-sirius-expedition",
  storageBucket: "site-web-sirius-expedition.firebasestorage.app",
  messagingSenderId: "805029750026",
  appId: "1:805029750026:web:dfc4f69f38ff80a1b9c6f3",
};



// Empêche la double initialisation
export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const dbR = getDatabase(app); 
export const storage = getStorage(app);
