import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAQgf_GkXnNO5P3Dzx75rnhEqw5KI53VCk",
  authDomain: "audit-heuristic-figma.firebaseapp.com",
  projectId: "audit-heuristic-figma",
  storageBucket: "audit-heuristic-figma.firebasestorage.app",
  messagingSenderId: "147659545349",
  appId: "1:147659545349:web:80fcdd4dc2e7e61b91b56c"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Realtime Database dan export agar bisa dipakai di file lain
export const database = getDatabase(app);