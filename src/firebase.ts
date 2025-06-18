import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-GG2e5v7bfaUw930LyXp2kgg6BYQTcYQ",
  authDomain: "text-call-mvp.firebaseapp.com",
  projectId: "text-call-mvp",
  storageBucket: "text-call-mvp.appspot.com",
  messagingSenderId: "717448089215",
  appId: "1:717448089215:web:bb8d804c20ca75532cb94a",
  measurementId: "G-KB73VQHWB0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 