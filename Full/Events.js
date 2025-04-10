import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import styles from "./Events.module.css";

const Events = ({ currentUser }) => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventCollection = collection(db, "events");
      const snapshot = await getDocs(eventCollection);
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const validEvents = eventsData.filter(
        (event) => event.title && event.description
      );

      setEvents(validEvents);
    };

    fetchEvents();
  }, []);

  return (
    <div className={styles.eventsPage}>
      <button className={styles.backButton} onClick={() => navigate("/")}>
        ⬅ Back to Home
      </button>

      <h2>Upcoming Events</h2>

      <div className={styles.eventList}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
};

export default Events;
