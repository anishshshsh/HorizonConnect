import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Homepage";  
import AuthForm from "./AuthForm";  
import "./styles.css";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthForm />} />
    </Routes>
  );
}

export default App;
