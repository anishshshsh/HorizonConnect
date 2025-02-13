import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Firebase authentication & Firestore
import { collection, getDocs } from "firebase/firestore"; // Firestore functions
import Search from "./Search"; 
import "./styles.css"; 

const HomePage = ({ user }) => {  
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // Store fetched events

  // ✅ Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });

      // Disconnect when all elements have been observed
      if (document.querySelectorAll(".fade:not(.fade-in)").length === 0) {
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    const sections = document.querySelectorAll(".fade");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect(); // Cleanup on unmount
  }, []);

  // ✅ Fetch Events from Firestore (optional)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // ✅ Navigation function for Account button
  const handleAccountClick = () => navigate(user ? "/account" : "/login");

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>HorizonConnect</h1>
        </div>
        <nav className="navbar">
          <ul>
            <li><Search user={user} /></li>
            <li><a href="#about">About</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><button onClick={handleAccountClick} className="accountButton">Account</button></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero fade">
        <h2>Welcome to HorizonConnect</h2>
        <p>Connecting alumni of NHITM across generations. Stay updated, network, and share your journey.</p>
        <a href="#about" className="cta-button">Learn More</a>
      </section>

      {/* About Section */}
      <section id="about" className="about fade">
        <h2>About Us</h2>
        <p>HorizonConnect is the exclusive alumni network of NHITM...</p>
      </section>

      {/* Events Section (Now Dynamic) */}
      <section id="events" className="events fade">
        <h2>Upcoming Events</h2>
        <div className="event-list">
          {events.length > 0 ? (
            events.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>Date: {event.date}</p>
              </div>
            ))
          ) : (
            <p>No upcoming events.</p>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials fade">
        <h2>What Alumni Say</h2>
        <div className="testimonial-card">
          <p>"HorizonConnect helped me reconnect with my peers..."</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 NHITM. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
