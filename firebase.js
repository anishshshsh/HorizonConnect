// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChgTlgt0ir-luutLjWQOeXsReP6bXW9cE",
  authDomain: "horizonconnect-28e5d.firebaseapp.com",
  projectId: "horizonconnect-28e5d",
  storageBucket: "horizonconnect-28e5d.firebasestorage.app",
  messagingSenderId: "803936933849",
  appId: "1:803936933849:web:ebde9e45a79fbd7a506bc8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ Initialize Authentication

export { app, auth };
