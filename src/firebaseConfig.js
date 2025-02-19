import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDnHDVr2SRz4oUDn-bx9O9_IrK8jkilDbA",
    authDomain: "gareer-guide.firebaseapp.com",
    projectId: "gareer-guide",
    storageBucket: "gareer-guide.firebasestorage.app",
    messagingSenderId: "855105007417",
    appId: "1:855105007417:web:05fd6ae194cfa89e64c2e8",
    measurementId: "G-Q0DJPD7TD9"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);