import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqhPPoz91j6A4YmWMytzC2HCLTheVNMyc",
  authDomain: "optivexstudio.firebaseapp.com",
  projectId: "optivexstudio",
  storageBucket: "optivexstudio.firebasestorage.app",
  messagingSenderId: "344147371142",
  appId: "1:344147371142:web:49b3af5b91be446b3a9d07"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();