import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

/** ✅ Function to add a new event */
export const addEvent = async (title, date, location, description) => {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      title,
      date: Timestamp.fromDate(new Date(date)),
      location,
      description,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, title, date, location, description };
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

/** ✅ Function to fetch all events */
export const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString() || "TBA",
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

/** ✅ Function to add a comment under an event */
export const addComment = async (eventId, userId, content) => {
  if (!eventId || !userId || !content)
    throw new Error("Invalid comment data");

  try {
    // 🔍 Get user info from 'users' collection
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.exists() ? userDoc.data() : {};

    const docRef = await addDoc(collection(db, `events/${eventId}/comments`), {
      userId,
      content,
      timestamp: Timestamp.now(),
      displayName: userData.name || "Anonymous",
      photoURL: userData.photoURL || "", // Cloudinary link
    });

    return {
      id: docRef.id,
      userId,
      content,
      displayName: userData.name || "Anonymous",
      photoURL: userData.photoURL || "",
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

/** ✅ Function to fetch comments for an event */
export const fetchComments = async (eventId) => {
  if (!eventId) throw new Error("Event ID is required");

  try {
    const querySnapshot = await getDocs(
      collection(db, `events/${eventId}/comments`)
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

/** ✅ Function to check if an access code exists */
export const checkAccessCode = async (accessCode) => {
  try {
    const querySnapshot = await getDocs(collection(db, "accesscodes"));
    const validCodeDoc = querySnapshot.docs.find(
      (doc) => doc.data().access_code === accessCode
    );
    return validCodeDoc ? validCodeDoc.id : null;
  } catch (error) {
    console.error("Error checking access code:", error);
    throw error;
  }
};

/** ✅ Function to delete an access code after use */
export const deleteAccessCode = async (accessCode) => {
  try {
    const querySnapshot = await getDocs(collection(db, "accesscodes"));
    const validCodeDoc = querySnapshot.docs.find(
      (doc) => doc.data().access_code === accessCode
    );
    if (!validCodeDoc) throw new Error("Access code not found");

    await deleteDoc(doc(db, "accesscodes", validCodeDoc.id));
    console.log(`Access code ${accessCode} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting access code:", error);
    throw error;
  }
};
