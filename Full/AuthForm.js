import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import styles from "./AuthForm.module.css";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
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
        // ✅ Check access code (only unused)
        const querySnapshot = await getDocs(collection(db, "accessCodes"));
        const validCodeDoc = querySnapshot.docs.find(
          (doc) =>
            doc.data().code === accessCode.trim() &&
            doc.data().used === false
        );

        if (!validCodeDoc) {
          setError("Invalid or already used access code.");
          return;
        }

        // ✅ Create user
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // ✅ Force refresh token so Firestore sees updated auth
        await userCredential.user.getIdToken(true);

        // ✅ Set user profile in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          username: "New User",
        });

        // ✅ Mark the access code as used
        await updateDoc(doc(db, "accessCodes", validCodeDoc.id), {
          used: true,
          usedBy: email,
          usedAt: Timestamp.now(),
        });
      }

      navigate("/"); // Redirect after login/signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate("/")}>
        ⬅ Back to Home
      </button>
      <div className={styles.formContainer}>
        <div className={styles.formToggle}>
          <button
            className={isLogin ? styles.active : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? styles.active : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
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
            <>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Access Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
              />
            </>
          )}
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          <p>
            {isLogin ? "Not a Member?" : "Already have an account?"}
            <a href="#" onClick={() => setIsLogin(!isLogin)}>
              {" "}
              {isLogin ? "Sign Up Now" : "Login"}
            </a>
          </p>
          {!isLogin && (
            <p
              className={styles.accessCodeLink}
              onClick={() => navigate("/request-access")}
            >
              Need an access code?
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
