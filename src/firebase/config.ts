// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATcTJOmEhXWnUdOQs2TxKqWjysQsqNUuE",
  authDomain: "aesthify-studio.firebaseapp.com",
  projectId: "aesthify-studio",
  storageBucket: "aesthify-studio.firebasestorage.app",
  messagingSenderId: "996639652883",
  appId: "1:996639652883:web:506b83d763b7acea2c13e6",
  measurementId: "G-BKTN0QH9PF",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app); // Firebase Authentication
const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(app); // Firestore Database

export { auth, googleProvider, firestore };
