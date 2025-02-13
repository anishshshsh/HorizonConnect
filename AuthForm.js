import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Import Firestore
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions
import styles from "./AuthForm.module.css";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (isLogin) {
        // Login user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if user exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          // Add user to Firestore if they don’t exist (fallback for older accounts)
          await setDoc(userRef, { email, username: "New User" });
        }

      } else {
        // Sign up user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email,
          username: "New User", // Default username
        });
      }

      navigate("/"); // Redirect after login/signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.formToggle}>
          <button className={isLogin ? styles.active : ""} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? styles.active : ""} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>
        <form className={styles.form} onSubmit={handleAuth}>
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          {error && <p className={styles.error}>{error}</p>}
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          {!isLogin && (
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          )}
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          {isLogin ? (
            <p>Not a Member? <a href="#" onClick={() => setIsLogin(false)}>Sign Up Now</a></p>
          ) : (
            <p>Already have an account? <a href="#" onClick={() => setIsLogin(true)}>Login</a></p>
          )}
        </form>
      </div>
    </div>
  );
}
