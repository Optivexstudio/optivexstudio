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
  apiKey: "AIzaSyAqhPPoz91j6A4YmWMytzC2HCLTheVNMyc",
  authDomain: "optivexstudio.firebaseapp.com",
  projectId: "optivexstudio",
  storageBucket: "optivexstudio.firebasestorage.app",
  messagingSenderId: "344147371142",
  appId: "1:344147371142:web:49b3af5b91be446b3a9d07",
};

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
