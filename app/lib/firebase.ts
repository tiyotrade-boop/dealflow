import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdcgXyjBbhEIkK1w0EDXlCOd_Xskcr_pA",
  authDomain: "dealflow-6f7c9.firebaseapp.com",
  projectId: "dealflow-6f7c9",
  storageBucket: "dealflow-6f7c9.firebasestorage.app",
  messagingSenderId: "914216322933",
  appId: "1:914216322933:web:3f7f24eff897ede19b753c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();