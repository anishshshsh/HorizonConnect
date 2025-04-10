import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import styles from "./RequestAccess.module.css";

export default function RequestAccess() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [yearOfAdmission, setYearOfAdmission] = useState("");
  const [yearOfGraduation, setYearOfGraduation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email || !fullName || !yearOfAdmission || !yearOfGraduation) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Check if access code already exists for the email
      const q = query(collection(db, "accessCodes"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("You already have an access code. Check your email.");
        return;
      }

      // Store request in accessCodesRequest collection
      await addDoc(collection(db, "accessCodesRequest"), {
        email,
        fullName,
        yearOfAdmission,
        yearOfGraduation,
        timestamp: new Date(),
      });

      setMessage("Request submitted! An admin will send your access code via email.");
      setEmail("");
      setFullName("");
      setYearOfAdmission("");
      setYearOfGraduation("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate("/login")}>
        ⬅ Back to Login
      </button>
      <div className={styles.formContainer}>
        <h2>Request Access Code</h2>
        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleRequest}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Year of Admission"
            value={yearOfAdmission}
            onChange={(e) => setYearOfAdmission(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Year of Graduation"
            value={yearOfGraduation}
            onChange={(e) => setYearOfGraduation(e.target.value)}
            required
          />
          <button type="submit" className={styles.submitButton}>
            Request Code
          </button>
        </form>
      </div>
    </div>
  );
}
