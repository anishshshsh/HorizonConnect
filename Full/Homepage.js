import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import Search from "./Search";
import "./styles.css";

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
      if (document.querySelectorAll(".fade:not(.fade-in)").length === 0) {
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    const sections = document.querySelectorAll(".fade");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

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
            <li><Link to="/events">Events</Link></li>
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
        <div className="about-image-wrapper">
          <img src="clg_ent_pic.jpeg" alt="NHITM College" />
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              The Alumni Network of New Horizon Institute of Technology and Management (NHITM) serves as a vibrant bridge connecting graduates across generations who have walked through our campus in Kasaravadavli, Thane.
              Founded with the mission to foster lasting relationships among our alumni community, our network provides a platform for professional growth, mentorship opportunities, and continued engagement with the institution that shaped your careers.
              At NHITM, we believe that our alumni are our greatest ambassadors and an integral part of our ongoing legacy of excellence in technology and management education.
              Through this portal, we aim to strengthen the bonds formed during your time at New Horizon, facilitate meaningful collaborations, and create a supportive ecosystem where alumni can network, share experiences, and contribute to the growth of their alma mater and fellow graduates.
            </p>
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="events fade">
        <h2>Upcoming Event</h2>
        <div className="event-list">
          <div className="event-card floating">
            <img src="webinar.jpeg" alt="Webinar" />
            <div className="card-text">
              <p>Webinar</p>
            </div>
          </div>

          <div className="event-card floating">
            <img src="jw.jpeg" alt="Alumni-Student Party" />
            <div className="card-text">
              <p>Alumni-Student Party</p>
            </div>
          </div>

          <div className="event-card floating">
            <img src="meetup_22.jpg" alt="Alumni Meetup" />
            <div className="card-text">
              <p>Alumni Meetup</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials fade" id="testimonials">
        <h2>What Our Alumni Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>"Absolutely loved the community!"</p>
          </div>
          <div className="testimonial-card">
            <p>"The events helped me land my dream job!"</p>
          </div>
          <div className="testimonial-card">
            <p>"Incredible platform for alumni networking."</p>
          </div>
          <div className="testimonial-card">
            <p>"Made friends for life and found mentors."</p>
          </div>
          <div className="testimonial-card">
            <p>"Helped me grow personally and professionally."</p>
          </div>
          <div className="testimonial-card">
            <p>"Would recommend to every student!"</p>
          </div>
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
