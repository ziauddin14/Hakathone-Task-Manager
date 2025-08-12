// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASLqpyiN7eVrhMRtQSh2iAGn2oZcgqD1w",
  authDomain: "task-manager-2b24f.firebaseapp.com",
  projectId: "task-manager-2b24f",
  storageBucket: "task-manager-2b24f.firebasestorage.app",
  messagingSenderId: "306888359048",
  appId: "1:306888359048:web:6de0b496ff8679753bf33d",
  measurementId: "G-H521H7F49B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };