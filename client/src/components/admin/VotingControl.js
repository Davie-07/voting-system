import React, { useState } from 'react';
import api from '../../utils/api';
import './VotingControl.css';

const VotingControl = ({ session, updateSession }) => {
  const [scheduleData, setScheduleData] = useState({
    startDate: '',
    endDate: ''
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { startDate, endDate } = scheduleData;
  
  const onChange = e => {
    setScheduleData({ ...scheduleData, [e.target.name]: e.target.value });
  };
  
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
  
  const scheduleVoting = async e => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const res = await api.post('/admin/voting/schedule', scheduleData);
      updateSession(res.data);
      setMessage('Voting session scheduled successfully!');
      setError('');
    } catch (err) {
      setError('Failed to schedule voting session');
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
      
      <div className="schedule-section">
        <h3>Schedule Voting Session</h3>
        <form onSubmit={scheduleVoting}>
          <div className="form-group">
            <label htmlFor="startDate">Start Date & Time</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date & Time</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Schedule Voting'}
            </button>
          </div>
        </form>
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