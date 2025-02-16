import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAuj421c4TfpG5yAs1zmsnxq1iFvJrabgM",
    authDomain: "ai-gaming-career-advisor-temp.firebaseapp.com",
    projectId: "ai-gaming-career-advisor-temp",
    storageBucket: "ai-gaming-career-advisor-temp.firebasestorage.app",
    messagingSenderId: "496989633867",
    appId: "1:496989633867:web:e6802f8e3bf290745efcce"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);