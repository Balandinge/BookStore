// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArFVHoBkYpg9j9IneUOxgtX2u1UIUrmEw",
  authDomain: "bookstore-73bab.firebaseapp.com",
  databaseURL:
    "https://bookstore-73bab-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bookstore-73bab",
  storageBucket: "bookstore-73bab.firebasestorage.app",
  messagingSenderId: "177004055494",
  appId: "1:177004055494:web:5d0ffca3128ca8391940c7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
