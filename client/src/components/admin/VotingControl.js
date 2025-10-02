import React, { useState } from 'react';
import api from '../../utils/api';
import './VotingControl.css';

const VotingControl = ({ session, updateSession }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const openVoting = async () => {
    try {
      setLoading(true);
      const res = await api.post('/admin/voting/open');
      updateSession(res.data);
      setMessage('Voting session opened successfully! Students can now vote.');
      setError('');
    } catch (err) {
      setError('Failed to open voting session');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };
  
  const closeVoting = async () => {
    try {
      setLoading(true);
      const res = await api.post('/admin/voting/close');
      updateSession(res.data);
      setMessage('Voting session closed successfully! Final results are now available.');
      setError('');
    } catch (err) {
      setError('Failed to close voting session');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };
  
  const isOpen = session && session.isOpen;
  const hasSchedule = session && session.startDate;
  
  return (
    <div className="voting-control">
      <h2>Voting Control Panel</h2>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="control-buttons">
        <button 
          className={`btn ${isOpen ? 'btn-danger' : 'btn-success'}`}
          onClick={isOpen ? closeVoting : openVoting}
          disabled={loading}
        >
          {loading ? 'Processing...' : isOpen ? 'Close Voting' : 'Open Voting'}
        </button>
      </div>
      
      <div className="voting-status-indicator">
        <h3>Current Voting Status</h3>
        <div className={`status-badge ${isOpen ? 'status-open' : 'status-closed'}`}>
          {isOpen ? 'VOTING IS CURRENTLY OPEN' : 'VOTING IS CURRENTLY CLOSED'}
        </div>
        {isOpen && (
          <p className="status-note">
            Students can vote now. Close voting to finalize results.
          </p>
        )}
      </div>
      
      <div className="session-status">
        <h3>Session Details</h3>
        <div className="status-card">
          <p><strong>Status:</strong> 
            <span className={`status-text ${isOpen ? 'text-open' : 'text-closed'}`}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </p>
          {hasSchedule && (
            <>
              <p><strong>Start Date:</strong> {new Date(session.startDate).toLocaleString()}</p>
              <p><strong>End Date:</strong> {session.endDate ? new Date(session.endDate).toLocaleString() : 'Not ended yet'}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingControl;