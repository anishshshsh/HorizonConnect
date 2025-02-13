import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { auth } from "./firebase"; 
import HomePage from "./Homepage";  
import AuthForm from "./AuthForm";  
import Account from "./AccountPage";  
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update user state
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="/account" element={<Account user={user} />} />
    </Routes>
  );
}

export default App;
