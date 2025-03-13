import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from "./Events.module.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUser(user);
      }
    });

    // Fetch events
    const unsubscribeEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeEvents();
    };
  }, [navigate]);

  return (
    <div className={styles.eventsPage}>
      <button onClick={() => navigate("/")} className={styles.backButton}>← Back to Home</button>
      <h2>Upcoming Events</h2>
      <div className={styles.eventList}>
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p>No events available.</p>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event }) => {
  return (
    <div className={styles.eventCard}>
      <h3>{event.title}</h3>
      {event.location && <p>📍 {event.location}</p>}
      {event.description && <p>{event.description}</p>}
    </div>
  );
};

export default Events;
