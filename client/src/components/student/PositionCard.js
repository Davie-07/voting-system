import React from 'react';
import './PositionCard.css';

const PositionCard = ({ position, contestants, hasVoted, onClick }) => {
  return (
    <div 
      className={`position-card ${hasVoted ? 'voted' : ''}`}
      onClick={hasVoted ? null : onClick}
    >
      <h3>{position}</h3>
      <p>{contestants ? contestants.length : 0} candidates</p>
      {hasVoted && (
        <div className="voted-badge">
          <i className="fas fa-check-circle"></i> Voted
        </div>
      )}
    </div>
  );
};

export default PositionCard;