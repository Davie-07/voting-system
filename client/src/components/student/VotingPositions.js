import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import PositionCard from './PositionCard';
import VotingModal from './VotingModal';
import './VotingPositions.css';

const VotingPositions = ({ session }) => {
  const [positions, setPositions] = useState([]);
  const [contestants, setContestants] = useState({});
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadPositions();
    loadContestants();
    
    // Set up polling to check for updates every 5 seconds
    const interval = setInterval(() => {
      loadPositions();
      loadContestants();
    }, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);
  
  const loadPositions = async () => {
    try {
      const res = await api.get('/student/voting/positions');
      setPositions(res.data);
    } catch (err) {
      setError('Failed to load positions');
    }
  };
  
  const loadContestants = async () => {
    try {
      const res = await api.get('/student/contestants');
      setContestants(res.data);
    } catch (err) {
      setError('Failed to load contestants');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePositionClick = (position) => {
    // Check if student has already voted for this position
    const positionData = positions.find(p => p.position === position);
    if (positionData && positionData.hasVoted) {
      alert('You have already voted for this position.');
      return;
    }
    
    setSelectedPosition(position);
  };
  
  const handleCloseModal = () => {
    setSelectedPosition(null);
  };
  
  const handleVoteSuccess = () => {
    // Reload positions to update voted status
    loadPositions();
    setSelectedPosition(null);
  };
  
  // Calculate time until voting starts
  const getTimeUntilStart = () => {
    if (!session || !session.startDate) return null;
    
    const now = new Date();
    const start = new Date(session.startDate);
    
    if (now >= start) return null;
    
    const diff = start - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };
  
  const timeUntilStart = getTimeUntilStart();
  const isVotingOpen = session && session.isOpen;
  
  if (loading) {
    return (
      <div className="voting-positions">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading voting positions...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="voting-positions">
      <div className="session-status">
        <h2>Voting Status</h2>
        {isVotingOpen ? (
          <p className="voting-open">Voting is currently <strong>OPEN</strong></p>
        ) : timeUntilStart ? (
          <div>
            <p className="voting-closed">Voting starts in:</p>
            <div className="countdown">
              {timeUntilStart.days}d {timeUntilStart.hours}h {timeUntilStart.minutes}m
            </div>
          </div>
        ) : (
          <p className="voting-closed">Voting is currently <strong>CLOSED</strong></p>
        )}
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {isVotingOpen ? (
        <>
          <h2>Available Positions</h2>
          {Object.keys(contestants).length > 0 ? (
            <div className="positions-grid">
              {Object.keys(contestants).map(position => {
                const positionData = positions.find(p => p.position === position);
                const hasVoted = positionData ? positionData.hasVoted : false;
                
                return (
                  <PositionCard
                    key={position}
                    position={position}
                    contestants={contestants[position]}
                    hasVoted={hasVoted}
                    onClick={() => handlePositionClick(position)}
                  />
                );
              })}
            </div>
          ) : (
            <p>No positions available for voting at the moment.</p>
          )}
        </>
      ) : (
        <div className="voting-closed-message">
          <h3>Voting is not currently open</h3>
          <p>Please wait for the admin to open the voting session.</p>
          {timeUntilStart && (
            <div className="countdown-info">
              <p>Voting will start on: {new Date(session.startDate).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
      
      {selectedPosition && (
        <VotingModal
          position={selectedPosition}
          contestants={contestants[selectedPosition]}
          onClose={handleCloseModal}
          onVoteSuccess={handleVoteSuccess}
        />
      )}
    </div>
  );
};

export default VotingPositions;