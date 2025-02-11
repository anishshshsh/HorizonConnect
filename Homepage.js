import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Search from "./Search"; // Import Search Component
import "./styles.css"; // Your existing CSS

const Homepage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll(".fade");
    sections.forEach((section) => {
      observer.observe(section);
    });
  }, []);

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>HorizonConnect</h1>
        </div>
        <nav className="navbar">
          <ul>
            <li><Search /></li> {/* Search Bar */}
            <li><a href="#about">About</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero fade">
        <h2>Welcome to HorizonConnect</h2>
        <p>
          Connecting alumni of New Horizon Institute of Technology across
          generations. Stay updated, network, and share your journey.
        </p>
        <a href="#about" className="cta-button">Learn More</a>
      </section>

      {/* About Section */}
      <section id="about" className="about fade">
        <h2>About Us</h2>
        <p>
          HorizonConnect is the exclusive alumni network of NHIT. We aim to
          bridge the gap between past, present, and future students, fostering
          a vibrant community for collaboration, mentorship, and growth.
        </p>
      </section>

      {/* Events Section */}
      <section id="events" className="events fade">
        <h2>Upcoming Events</h2>
        <div className="event-list">
          <div className="event-card">
            <h3>Alumni Meet 2025</h3>
            <p>Date: March 15, 2025</p>
            <p>Venue: NHIT Auditorium</p>
          </div>
          <div className="event-card">
            <h3>Webinar: Tech Trends</h3>
            <p>Date: February 28, 2025</p>
            <p>Online Event</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials fade">
        <h2>What Alumni Say</h2>
        <div className="testimonial-card">
          <p>
            "HorizonConnect helped me reconnect with my peers and stay updated
            on NHIT events. Truly a remarkable platform!" - Alumni Name
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 New Horizon Institute of Technology. All rights reserved.</p>
        <p>Developed by the NHITM Alumni Network Team.</p>
      </footer>
    </div>
  );
};

export default Homepage;
