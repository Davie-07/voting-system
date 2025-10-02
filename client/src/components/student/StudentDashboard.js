import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import StudentHeader from './StudentHeader';
import VotingPositions from './VotingPositions';
import LiveVotes from './LiveVotes';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [session, setSession] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Load session data
        await loadSession();
        
        // Set up polling to check for session changes every 2 seconds for better responsiveness
        const interval = setInterval(async () => {
          await loadSession();
        }, 2000);
        
        // Clean up interval on unmount
        return () => clearInterval(interval);
      } catch (err) {
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const loadSession = async () => {
    try {
      const res = await api.get('/student/voting/session');
      setSession(res.data);
    } catch (err) {
      console.error('Failed to load session:', err);
      // Don't navigate to login on session load failure, just continue
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="student-dashboard">
        <StudentHeader />
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="student-dashboard">
      <StudentHeader />
      <div className="container">
        <Routes>
          <Route 
            index
            element={<VotingPositions session={session} />} 
          />
          <Route 
            path="live-votes" 
            element={<LiveVotes />} 
          />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;