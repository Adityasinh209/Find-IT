import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Only create config if environment variables exist
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey &&
         firebaseConfig.projectId &&
         firebaseConfig.apiKey !== 'your-firebase-api-key-here' &&
         firebaseConfig.projectId !== 'your-project-id' &&
         !firebaseConfig.apiKey.includes('your-') &&
         !firebaseConfig.projectId.includes('your-') &&
         firebaseConfig.apiKey.length > 20 && // Valid API keys are longer
         firebaseConfig.projectId.length > 5; // Valid project IDs are longer
};

let app: any = null;
let db: any = null;
let auth: any = null;

// Only initialize Firebase if properly configured
if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase not configured - using mock data mode");
}

export { db, auth };
export const isFirebaseEnabled = isFirebaseConfigured() && app !== null;
export default app;
