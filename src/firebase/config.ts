// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2i7wEhzTQO9CKA45meqnn70JunpdV2RY",
  authDomain: "site-web-sirius-expedition.firebaseapp.com",
  projectId: "site-web-sirius-expedition",
  storageBucket: "site-web-sirius-expedition.firebasestorage.app",
  messagingSenderId: "805029750026",
  appId: "1:805029750026:web:dfc4f69f38ff80a1b9c6f3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);