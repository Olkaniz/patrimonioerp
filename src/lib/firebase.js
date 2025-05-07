import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // IMPORTANTE: adiciona Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDpQQvha0fpjQPfH4k1j7YyELYP8waLBS0",
  authDomain: "plataforma-internacional.firebaseapp.com",
  projectId: "plataforma-internacional",
  storageBucket: "plataforma-internacional.firebasestorage.app",
  messagingSenderId: "934572411136",
  appId: "1:934572411136:web:4c4084a5adc068f1e30be5",
  measurementId: "G-WQ3CP9Z4PH",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // ADICIONA ESTA LINHA

export { db }; // EXPORTA O DB
