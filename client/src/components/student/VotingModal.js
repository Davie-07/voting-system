import React, { useState } from 'react';
import api from '../../utils/api';
import './VotingModal.css';

const VotingModal = ({ position, contestants, onClose, onVoteSuccess }) => {
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleVote = async () => {
    if (!selectedContestant) {
      setError('Please select a candidate to vote for');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await api.post('/voting/vote', {
        contestantId: selectedContestant,
        position: position
      });
      
      onVoteSuccess();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to cast vote');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Vote for {position}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="contestants-list">
            {contestants && contestants.map(contestant => (
              <div 
                key={contestant._id}
                className={`contestant-option ${selectedContestant === contestant._id ? 'selected' : ''}`}
                onClick={() => setSelectedContestant(contestant._id)}
              >
                {contestant.photo && (
                  <img 
                    src={contestant.photo} 
                    alt={contestant.name} 
                    className="contestant-photo"
                  />
                )}
                <div className="contestant-info">
                  <h3>{contestant.name}</h3>
                  <p><strong>Course:</strong> {contestant.course}</p>
                  <p><strong>Manifesto:</strong> {contestant.manifesto}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn btn-success"
              onClick={handleVote}
              disabled={loading || !selectedContestant}
            >
              {loading ? 'Voting...' : 'Cast Vote'}
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;