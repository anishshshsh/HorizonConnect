import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import styles from "./UserProfileChat.module.css";
import UserInfoCard from "./UserInfoCard";

const getChatId = (uid1, uid2) => {
  return [uid1, uid2].sort().join("_");
};

const sendMessage = async (senderId, receiverId, messageText) => {
  const chatId = getChatId(senderId, receiverId);
  const chatRef = doc(db, "chats", chatId);

  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      participants: [senderId, receiverId],
      createdAt: serverTimestamp(),
      lastMessage: messageText,
      lastTimestamp: serverTimestamp(),
    });
  } else {
    await setDoc(
      chatRef,
      {
        lastMessage: messageText,
        lastTimestamp: serverTimestamp(),
      },
      { merge: true }
    );
  }

  const messagesRef = collection(db, "chats", chatId, "messages");
  await addDoc(messagesRef, {
    text: messageText,
    senderId,
    timestamp: serverTimestamp(),
    seen: false,
  });
};

const UserProfileChat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUserId = auth.currentUser?.uid;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  // 👤 Load the user's profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // 📩 Listen for real-time updates with proper ordering
  useEffect(() => {
    if (!currentUserId || !userId) return;

    const chatId = getChatId(currentUserId, userId);
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [currentUserId, userId]);

  const handleSend = async () => {
    if (!chatInput.trim()) return;

    const messageText = chatInput.trim();
    setChatInput("");

    await sendMessage(currentUserId, userId, messageText);
  };

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>User not found.</div>;

  return (
    <div className={styles.pageBackground}>
      <button className={styles.backButton} onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div className={styles.container}>
        <div className={styles.profile}>
          <UserInfoCard userData={profile} />
        </div>

        <div className={styles.chat}>
          <div className={styles.chatWindow}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.senderId === currentUserId
                    ? styles.sent
                    : styles.received
                }
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileChat;
