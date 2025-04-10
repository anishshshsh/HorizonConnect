// UserInfoCard.js
import React from "react";
import styles from "./UserInfoCard.module.css";

const UserInfoCard = ({ userData }) => {
  return (
    <div className={styles.container}>
      <img
        src={userData?.profilePic || "https://via.placeholder.com/150"}
        alt="Profile"
        className={styles.profilePic}
      />
      <div className={styles.details}>
        <h1>{userData?.name || "Name"}</h1>
        <p><strong>Bio:</strong> {userData?.bio || "No bio available"}</p>
        <p><strong>Skills:</strong> {Array.isArray(userData?.skills) ? userData.skills.join(", ") : userData?.skills || "N/A"}</p>
        <p><strong>Batch:</strong> {userData?.batch || "N/A"}</p>
        <p><strong>Job Experience:</strong> {userData?.jobExperience || "N/A"}</p>
      </div>
    </div>
  );
};

export default UserInfoCard;
