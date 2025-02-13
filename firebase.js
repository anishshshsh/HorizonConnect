import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChgTlgt0ir-luutLjWQOeXsReP6bXW9cE",
  authDomain: "horizonconnect-28e5d.firebaseapp.com",
  projectId: "horizonconnect-28e5d",
  storageBucket: "horizonconnect-28e5d.appspot.com", // ✅ Fixed this line
  messagingSenderId: "803936933849",
  appId: "1:803936933849:web:ebde9e45a79fbd7a506bc8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ Initialize Authentication
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db,storage, doc, setDoc, getDoc };
