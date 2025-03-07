import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // Import Firebase auth if using Firebase
import styles from "./Search.module.css"; // Using CSS Modules

export default function Search() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initially null to prevent false redirects
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Check Firebase authentication status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user); // Converts user object to boolean
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return; // Prevent empty searches

    if (isLoggedIn === false) {
      navigate("/login"); // Redirect to login **only if explicitly logged out**
    } else if (isLoggedIn === true) {
      navigate(`/search-results?query=${encodeURIComponent(query)}`); // ✅ Navigate to search results
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress} // ✅ Trigger search on Enter key
        className={styles.searchInput}
      />
      <button onClick={handleSearch} className={styles.searchButton}>
        🔍 Search
      </button>
    </div>
  );
}
