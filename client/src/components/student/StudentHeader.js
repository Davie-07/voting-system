import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentHeader.css';

const StudentHeader = () => {
  const navigate = useNavigate();
  
  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  return (
    <header className="student-header">
      <div className="container">
        <div className="header-content">
          <h1>
            <Link to="/student">
              <img src="../../ktvc-logo-r.png" alt="Kandara College Logo" className="header-logo" />
              Kandara College Voting
            </Link>
          </h1>
          <nav>
            <ul>
              <li>
                <Link to="/student">Vote</Link>
              </li>
              <li>
                <Link to="/student/live-votes">Live Votes</Link>
              </li>
              <li>
                <button onClick={onLogout} className="btn btn-danger">
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;