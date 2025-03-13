import { db } from "./firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

// Function to add a new event
export const addEvent = async (title, date, location, description) => {
  try {
    await addDoc(collection(db, "events"), {
      title,
      date: Timestamp.fromDate(new Date(date)),
      location,
      description,
    });
    console.log("Event added!");
  } catch (error) {
    console.error("Error adding event:", error);
  }
};

// Function to fetch events
export const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toLocaleDateString() || "TBA",
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// Function to add a comment under an event
export const addComment = async (eventId, userId, content) => {
  try {
    await addDoc(collection(db, `events/${eventId}/comments`), {
      userId,
      content,
      timestamp: Timestamp.now(),
    });
    console.log("Comment added!");
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

// Function to fetch comments for an event
export const fetchComments = async (eventId) => {
  try {
    const querySnapshot = await getDocs(collection(db, `events/${eventId}/comments`));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toLocaleString(),
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};
