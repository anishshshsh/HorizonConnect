import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Search.module.css"; // Use CSS Module for styles

export default function Search() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const isLoggedIn = localStorage.getItem("user"); // Check if user is logged in

    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      console.log("Searching for:", query);
      // Implement search logic here
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />
      <button onClick={handleSearch} className={styles.searchButton}>
        🔍 Search
      </button>
    </div>
  );
}
