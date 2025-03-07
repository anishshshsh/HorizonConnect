import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, query, orderBy, startAt, endAt, getDocs } from "firebase/firestore";
import styles from "./SearchResults.module.css";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("query") || "";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery.trim()) return;
      
      try {
        const usersRef = collection(db, "users");
        
        const q = query(
          usersRef,
          orderBy("name"),
          startAt(searchQuery),
          endAt(searchQuery + "\uf8ff")
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setUsers(results);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  return (
    <div className={styles.searchResultsContainer}>
      {/* ✅ Back to Home Button */}
      <button className={styles.backButton} onClick={() => navigate("/")}>
        ⬅ Back to Home
      </button>

      <h2 className={styles.resultsHeader}>Search Results for "{searchQuery}"</h2>
      {loading ? (
        <p className={styles.noResults}>Loading...</p>
      ) : users.length > 0 ? (
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.id} className={styles.resultItem}>
              <img src={user.profilePic || "https://via.placeholder.com/55"} alt={user.name} className={styles.profilePic} />
              <div className={styles.userDetails}>
                <p className={styles.userName}>{user.name}</p>
                {user.bio && <p className={styles.userBio}>{user.bio}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noResults}>No users found.</p>
      )}
    </div>
  );
}
