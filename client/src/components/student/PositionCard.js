import React from 'react';
import './PositionCard.css';

const PositionCard = ({ position, contestants, hasVoted, onClick }) => {
  return (
    <div 
      className={`position-card ${hasVoted ? 'voted' : ''}`}
      onClick={hasVoted ? null : onClick}
    >
      <h3>{position}</h3>
      <div className="contestant-count">
        {contestants ? contestants.length : 0} candidates
      </div>
      {hasVoted && (
        <div className="voted-badge">
          <i className="fas fa-check-circle"></i> Voted
        </div>
      )}
    </div>
  );
};

export default PositionCard;