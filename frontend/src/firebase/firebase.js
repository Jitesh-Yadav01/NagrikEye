import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";





const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Verify Firebase config is loaded
if (!firebaseConfig.apiKey) {
  console.error("Firebase configuration is missing. Please check your environment variables.");
  console.warn("Expected env variables: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.");
}

let app;
try {
  app = initializeApp(firebaseConfig);
  getAnalytics(app);
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

