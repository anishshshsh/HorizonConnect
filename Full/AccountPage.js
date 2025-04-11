import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import axios from "axios";
import styles from "./AccountPage.module.css";
import UserInfoCard from "./UserInfoCard";

//const CLOUDINARY_UPLOAD_URL 
//const CLOUDINARY_UPLOAD_PRESET 

const AccountPage = ({ user }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [batch, setBatch] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setUsername(data.name || "");
            setProfilePicUrl(data.profilePic || "");
            setBio(data.bio || "");
            setSkills(data.skills || "");
            setBatch(data.batch || "");
            setJobExperience(data.jobExperience || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
      const imageUrl = response.data.secure_url;

      setProfilePicUrl(imageUrl);
      await updateDoc(doc(db, "users", user.uid), { profilePic: imageUrl });
      setUserData((prev) => ({ ...prev, profilePic: imageUrl }));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        name: username,
        bio,
        skills,
        batch,
        jobExperience,
        profilePic: profilePicUrl,
      };
      await updateDoc(doc(db, "users", user.uid), updatedData);
      setUserData((prev) => ({ ...prev, ...updatedData }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className={`${styles.accountPage} ${darkMode ? styles.dark : ""}`}>
      {/* 🌗 Dark Mode Toggle (top-right) */}
      <button className={styles.themeToggle} onClick={() => setDarkMode((prev) => !prev)}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <button className={styles.backButton} onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div className={styles.profileContainer}>
        {isEditing ? (
          <>
            <div className={styles.profilePicContainer}>
              <label htmlFor="profilePicInput">
                <img
                  src={profilePicUrl || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className={styles.profilePicCentered}
                />
              </label>
              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className={styles.profilePicInput}
              />
            </div>

            <div className={styles.profileDetailsCentered}>
              <input
                className={styles.inputField}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
              />
              <textarea
                className={styles.inputField}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio..."
              />
              <input
                className={styles.inputField}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Skills (comma separated)"
              />
              <input
                className={styles.inputField}
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="Batch"
              />
              <textarea
                className={styles.inputField}
                value={jobExperience}
                onChange={(e) => setJobExperience(e.target.value)}
                placeholder="Job Experience"
              />
              <button className={styles.saveButton} onClick={handleSave}>
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <UserInfoCard userData={userData} />
            <button className={styles.editButton} onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </>
        )}
      </div>

      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AccountPage;
