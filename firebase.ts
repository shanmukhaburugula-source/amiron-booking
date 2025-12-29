
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCD71dLOv_SwCb3pHUbaxqk9KLQxO0dvEM",
  authDomain: "ai-session-728ce.firebaseapp.com",
  projectId: "ai-session-728ce",
  storageBucket: "ai-session-728ce.firebasestorage.app",
  messagingSenderId: "203854584130",
  appId: "1:203854584130:web:865a0bcb2f492571b210db",
  measurementId: "G-00VBLXTS75"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;
