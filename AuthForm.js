import React, { useState } from 'react';
import styles from './AuthForm.module.css'; // Importing CSS as a module

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.formToggle}>
          <button className={isLogin ? styles.active : ""} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? styles.active : ""} onClick={() => setIsLogin(false)}>SignUp</button>
        </div>
        { isLogin ? (
          <div className={styles.form}>
            <h2>Login Form</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Forgot Password?</a>
            <button>Login</button>
            <p>Not a Member? <a href="#" onClick={() => setIsLogin(false)}>SignUp Now</a></p>
          </div>
        ) : (
          <div className={styles.form}>
            <h2>Signup Form</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button>SignUp</button>
          </div>
        )}
      </div>
    </div>
  );
}
