// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_API,
  authDomain: "real-estate-app-e48f1.firebaseapp.com",
  projectId: "real-estate-app-e48f1",
  storageBucket: "real-estate-app-e48f1.firebasestorage.app",
  messagingSenderId: "38479813072",
  appId: "1:38479813072:web:b37bf510d0136dd40481d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);