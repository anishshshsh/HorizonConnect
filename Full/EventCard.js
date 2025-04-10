import React, { useState } from "react";
import EventComments from "./EventComments";
import LikeButton from "./LikeButton";
import styles from "./Events.module.css";

const EventCard = ({ event, currentUser }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className={styles.eventCard}>
      <h3>{event.title}</h3>
      {event.location && <p>📍 {event.location}</p>}
      {event.description && <p>{event.description}</p>}

      {/* Like button on top */}
      <LikeButton eventId={event.id} currentUser={currentUser} />

      {/* Comment button below */}
      <button
        onClick={() => setShowComments((prev) => !prev)}
        className={styles.bookmarkBtn}
      >
        <span className={styles.IconContainer}>
          <svg fill="white" viewBox="0 0 512 512" height="1em">
            <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
          </svg>
        </span>
        <p className={styles.text}>Comment</p>
      </button>

      {/* Comment section toggle */}
      {showComments && (
        <EventComments eventId={event.id} currentUser={currentUser} />
      )}
    </div>
  );
};

export default EventCard;
