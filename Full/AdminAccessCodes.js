import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./AdminAccessCodes.module.css";

export default function AdminAccessCodes() {
  const [requests, setRequests] = useState([]); // Users requesting access
  const [accessCodes, setAccessCodes] = useState([]); // Available access codes
  const [searchEmail, setSearchEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const checkAdminStatus = async (user) => {
      if (user) {
        try {
          const adminQuery = query(collection(db, "admin"), where("email", "==", user.email));
          const adminSnapshot = await getDocs(adminQuery);

          if (!adminSnapshot.empty) {
            setIsAdmin(true);
          } else {
            navigate("/"); // Redirect if not admin
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, checkAdminStatus);
    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    if (!isAdmin) return; // Only fetch data if user is admin

    const fetchRequestsAndCodes = async () => {
      try {
        // Fetch users requesting access
        const usersQuery = query(collection(db, "users"));
        const usersSnapshot = await getDocs(usersQuery);
        const users = usersSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => !user.accessCode); // Show only users without access codes
        setRequests(users);

        // Fetch available access codes
        const codesQuery = query(collection(db, "accessCodes"));
        const codesSnapshot = await getDocs(codesQuery);
        const codes = codesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAccessCodes(codes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRequestsAndCodes();
  }, [isAdmin]);

  const assignAccessCode = async (userId, selectedCode) => {
    if (!selectedCode) return alert("Please select an access code");

    try {
      // Update user's access code
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { accessCode: selectedCode.code });

      // Remove assigned access code from available codes
      await deleteDoc(doc(db, "accessCodes", selectedCode.id));

      // Refresh lists
      setRequests((prev) => prev.filter((user) => user.id !== userId));
      setAccessCodes((prev) => prev.filter((code) => code.id !== selectedCode.id));

      alert(`Assigned access code ${selectedCode.code} to the user`);
    } catch (error) {
      console.error("Error assigning access code:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return null; // Prevent page from rendering if not admin

  return (
    <div className={styles.container}>
      <h2>Admin - Access Code Requests</h2>

      <input
        type="text"
        placeholder="Search by email..."
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        className={styles.searchBox}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Assign Access Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests
            .filter(({ email }) => email.toLowerCase().includes(searchEmail.toLowerCase()))
            .map(({ id, email }) => (
              <tr key={id}>
                <td>{email}</td>
                <td>
                  <select className={styles.selectBox} id={`code-${id}`}>
                    <option value="">Select Code</option>
                    {accessCodes.map((code) => (
                      <option key={code.id} value={code.id}>
                        {code.code}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className={styles.assignButton}
                    onClick={() => {
                      const selectElement = document.getElementById(`code-${id}`);
                      const selectedCodeId = selectElement.value;
                      const selectedCode = accessCodes.find((c) => c.id === selectedCodeId);
                      assignAccessCode(id, selectedCode);
                    }}
                  >
                    ✅ Assign
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
