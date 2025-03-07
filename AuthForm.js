import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          username: "New User",
        });
      }

      navigate("/"); // Redirect after authentication
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      {/* ✅ Back to Home Button */}
      <button className={styles.backButton} onClick={() => navigate("/")}>
        ⬅ Back to Home
      </button>

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
          <p>
            {isLogin ? "Not a Member?" : "Already have an account?"} 
            <a href="#" onClick={() => setIsLogin(!isLogin)}> {isLogin ? "Sign Up Now" : "Login"}</a>
          </p>
        </form>
      </div>
    </div>
  );
}
