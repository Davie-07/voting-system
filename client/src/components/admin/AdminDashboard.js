import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AdminHeader from './AdminHeader';
import VotingControl from './VotingControl';
import ContestantManagement from './ContestantManagement';
import VotingResults from './VotingResults';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [session, setSession] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // This would be handled by protected routes in a real app
        // For now, we'll just load the session data
        loadSession();
      } catch (err) {
        navigate('/admin-login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const loadSession = async () => {
    try {
      const res = await api.get('/admin/voting/session');
      setSession(res.data);
    } catch (err) {
      console.error('Failed to load session', err);
    } finally {
      setLoading(false);
    }
  };
  
  const updateSession = (newSession) => {
    setSession(newSession);
  };
  
  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminHeader />
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
    <div className="admin-dashboard">
      <AdminHeader />
      <div className="container">
        <Routes>
          <Route 
            path="/" 
            element={
              <VotingControl 
                session={session} 
                updateSession={updateSession} 
              />
            } 
          />
          <Route 
            path="/contestants" 
            element={<ContestantManagement />} 
          />
          <Route 
            path="/results" 
            element={<VotingResults />} 
          />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;