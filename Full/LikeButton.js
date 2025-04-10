import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import "./LikeButton.css";

const LikeButton = ({ eventId, currentUser }) => {
  const [likes, setLikes] = useState([]);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    const eventRef = doc(db, "events", eventId);
    const unsubscribe = onSnapshot(eventRef, (docSnap) => {
      const data = docSnap.data();
      const likeList = data?.likes || [];
      setLikes(likeList);
      setUserLiked(currentUser && likeList.includes(currentUser.uid));
    });

    return () => unsubscribe();
  }, [eventId, currentUser]);

  const handleLike = async () => {
    if (!currentUser) return;
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      likes: userLiked
        ? arrayRemove(currentUser.uid)
        : arrayUnion(currentUser.uid),
    });
  };

  return (
    <div className="like-button" onClick={handleLike}>
      <input
        className="on"
        id={`heart-${eventId}`}
        type="checkbox"
        checked={userLiked}
        readOnly
      />
      <label className="like" htmlFor={`heart-${eventId}`}>
        <svg
          className="like-icon"
          fillRule="nonzero"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
        <span className="like-text">Likes</span>
      </label>
      <span className="like-count one">{likes.length}</span>
      <span className="like-count two">{likes.length + 1}</span>
    </div>
  );
};

export default LikeButton;
