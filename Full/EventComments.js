import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import styles from "./EventComments.module.css";

const EventComments = ({ eventId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [posting, setPosting] = useState(false);
  const [likes, setLikes] = useState({});
  const userCache = useRef({});

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      setUser(authUser || null);
    });

    const commentsRef = collection(db, "events", eventId, "comments");
    const q = query(commentsRef, orderBy("timestamp", "asc"));

    const unsubscribeComments = onSnapshot(q, async (snapshot) => {
      const commentsData = [];

      for (let docSnap of snapshot.docs) {
        const data = docSnap.data();
        let userData = userCache.current[data.userId];

        if (!userData) {
          try {
            const userDoc = await getDoc(doc(db, "users", data.userId));
            userData = userDoc.exists() ? userDoc.data() : {};
            userCache.current[data.userId] = userData;
          } catch (err) {
            console.error("Failed to fetch user:", err);
            userData = {};
          }
        }

        commentsData.push({
          id: docSnap.id,
          ...data,
          userData,
        });
      }

      setComments(commentsData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeComments();
    };
  }, [eventId]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    setPosting(true);

    await addDoc(collection(db, "events", eventId, "comments"), {
      userId: user.uid,
      content: newComment.trim(),
      timestamp: serverTimestamp(),
    });

    setNewComment("");
    setPosting(false);
  };

  const toggleLike = (commentId) => {
    setLikes((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className={styles.commentSectionContainer}>
      <h4>Comments</h4>

      {user && (
        <div className={styles.commentInputContainer}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleSubmit} disabled={posting || !newComment.trim()}>
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      )}

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.singleComment}>
            <img
              src={comment.userData.profilePic || "/default-avatar.png"}
              alt="User Avatar"
              className={styles.commentAvatar}
            />
            <div className="content">
              <strong>{comment.userData.name || "Anonymous"}</strong>
              <p>{comment.content}</p>
              <div className={styles.likeRow}>
                <button
                  className={`${styles.likeButton} ${
                    likes[comment.id] ? styles.liked : ""
                  }`}
                  onClick={() => toggleLike(comment.id)}
                >
                  {likes[comment.id] ? "❤️" : "🤍"}
                </button>
                <span className={styles.likeCount}>
                  {likes[comment.id] ? "1 like" : "0 likes"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventComments;
