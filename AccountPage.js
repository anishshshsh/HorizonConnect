import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "./firebase"; // Firebase imports
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./AccountPage.module.css"; // Scoped styles

const AccountPage = ({ user }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(""); // Store image URL
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null); // Track selected file

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setProfilePicUrl(data.profilePic || ""); 
            setBio(data.bio || "No bio added.");
            setSkills(data.skills || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [user]);

  // Profile picture upload
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setProfilePicFile(file); // Track the file
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", user.uid), { profilePic: downloadURL });
      setProfilePicUrl(downloadURL);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  // Save edited details
  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), { bio, skills });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={styles.accountPage}>
      <button className={styles.backButton} onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div className={styles.profileHeader}>
        <div className={styles.profilePicContainer}>
          {profilePicUrl ? (
            <img src={profilePicUrl} alt="Profile" className={styles.profilePic} />
          ) : (
            <div className={styles.profilePlaceholder}>Upload Profile Picture</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className={styles.profilePicInput}
          />
        </div>
        <div className={styles.profileDetails}>
          <h1>{userData?.name || "User Name"}</h1>

          {isEditing ? (
            <>
              <textarea
                className={styles.bioInput}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio..."
              />
              <input
                className={styles.skillsInput}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Skills (comma separated)"
              />
              <button className={styles.saveButton} onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <p className={styles.bio}>{bio}</p>
              <p className={styles.skills}><strong>Skills:</strong> {skills || "No skills added"}</p>
              <button className={styles.editButton} onClick={() => setIsEditing(true)}>Edit</button>
            </>
          )}
        </div>
      </div>

      <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AccountPage;
