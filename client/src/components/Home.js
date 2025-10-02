import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="school-header">
        <div className="logo-placeholder">
          <img src="../../ktvc-logo-r.png" alt="Kandara Technical College Logo" className="school-logo" />
        </div>
        <h1>Kandara Technical College</h1>
        <p className="school-intro">
          Welcome to the official voting system of Kandara College. 
          Participate in electing your student representatives and make your voice heard.
        </p>
      </div>
      
      <div className="actions-section">
        <Link to="/login" className="btn account-btn">
          ACCOUNT
        </Link>
      </div>
      
      <div className="features-section">
        <h2>Why Use Our Voting System?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-shield-alt feature-icon"></i>
            <h3>Secure & Transparent</h3>
            <p>Your vote is encrypted and counted accurately with full transparency.</p>
          </div>
          
          <div className="feature-card">
            <i className="fas fa-vote-yea feature-icon"></i>
            <h3>Easy to Use</h3>
            <p>Simple and intuitive interface makes voting a breeze for everyone.</p>
          </div>
          
          <div className="feature-card">
            <i className="fas fa-chart-bar feature-icon"></i>
            <h3>Real-time Results</h3>
            <p>See live updates of voting results as they come in.</p>
          </div>
          
          <div className="feature-card">
            <i className="fas fa-mobile-alt feature-icon"></i>
            <h3>Mobile Friendly</h3>
            <p>Access the voting system from any device, anywhere.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;