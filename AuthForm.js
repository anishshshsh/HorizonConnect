import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Redirect after login
import { auth } from "./firebase"; // Import Firebase auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import styles from "./AuthForm.module.css"; // Importing CSS as a module

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Navigation hook

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      if (isLogin) {
        // Login user
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/"); // Redirect to homepage after login
      } else {
        // Sign up user
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/"); // Redirect after signup
      }
    } catch (err) {
      setError(err.message); // Display error message
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.formToggle}>
          <button className={isLogin ? styles.active : ""} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? styles.active : ""} onClick={() => setIsLogin(false)}>SignUp</button>
        </div>
        <form className={styles.form} onSubmit={handleAuth}>
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          {error && <p className={styles.error}>{error}</p>} {/* Display errors */}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {!isLogin && <input type="password" placeholder="Confirm Password" required />}
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
