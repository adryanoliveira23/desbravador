import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAYAOm6ChPpDj8z58R_uasbcbvpwTtJZSs",
  authDomain: "desbravador-645ef.firebaseapp.com",
  projectId: "desbravador-645ef",
  storageBucket: "desbravador-645ef.firebasestorage.app",
  messagingSenderId: "705219931132",
  appId: "1:705219931132:web:d91922a74903fe633f6079",
  measurementId: "G-6QVY792341",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
