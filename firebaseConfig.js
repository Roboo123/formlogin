// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSMpIwF_o8KrqoFlmzpWpifm5BwdzvMT4",
  authDomain: "reactapp-140c7.firebaseapp.com",
  projectId: "reactapp-140c7",
  storageBucket: "reactapp-140c7.firebasestorage.app",
  messagingSenderId: "524067411248",
  appId: "1:524067411248:web:673fc70b58167f4035e4f5",
  measurementId: "G-NQJVWD80WT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);