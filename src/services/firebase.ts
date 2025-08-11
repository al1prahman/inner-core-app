import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBp9eEJIQ25usW77Mu_QDwSVx5q4fDHTU",
  authDomain: "inner-core-app.firebaseapp.com",
  projectId: "inner-core-app",
  storageBucket: "inner-core-app.firebasestorage.app",
  messagingSenderId: "785160615489",
  appId: "1:785160615489:web:97cb9bad56de846c5178c0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
