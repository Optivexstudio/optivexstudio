import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Optional: dev-ში თუ რამე აკლია, სწრაფად გეტყვის
const requiredKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

if (import.meta.env.DEV) {
  const missing = requiredKeys.filter((k) => !import.meta.env[k]);
  if (missing.length) {
    console.warn(
      "[Firebase] Missing env vars:",
      missing.join(", "),
      "→ Add them to .env"
    );
  }
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

/* ===== OAuth Providers ===== */
export const googleProvider = new GoogleAuthProvider();

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope("user:email");

export const appleProvider = new OAuthProvider("apple.com");
// სურვილისამებრ Apple scope-ები:
// appleProvider.addScope("email");
// appleProvider.addScope("name");

/* ===== Keep your existing exports ===== */
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
};
