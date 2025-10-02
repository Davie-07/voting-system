import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './LiveVotes.css';

const LiveVotes = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadResults();
    // Refresh results every 10 seconds
    const interval = setInterval(loadResults, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const loadResults = async () => {
    try {
      const res = await api.get('/voting/live-results');
      setResults(res.data);
    } catch (err) {
      setError('Failed to load live results');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="live-votes">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading live votes...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="live-votes">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
  
  const { allContestants, byPosition, leaders } = results;
  
  return (
    <div className="live-votes">
      <h2>Live Voting Results</h2>
      
      <div className="results-section">
        <h3>Leaders by Position</h3>
        {leaders && Object.keys(leaders).length > 0 ? (
          <div className="leaders-grid">
            {Object.keys(leaders).map(position => {
              const leader = leaders[position];
              return (
                <div key={position} className="leader-card">
                  <h4>{position}</h4>
                  <div className="leader-info">
                    {leader.photo && (
                      <img 
                        src={leader.photo} 
                        alt={leader.name} 
                        className="leader-photo"
                      />
                    )}
                    <div className="leader-details">
                      <p className="leader-name">{leader.name}</p>
                      <p className="vote-count">{leader.votes} votes</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No votes recorded yet.</p>
        )}
      </div>
      
      <div className="results-section">
        <h3>All Contestants</h3>
        {allContestants && allContestants.length > 0 ? (
          <div className="contestants-table">
            <div className="table-header">
              <div>Photo</div>
              <div>Name</div>
              <div>Position</div>
              <div>Votes</div>
            </div>
            {allContestants.map(contestant => (
              <div key={contestant._id} className="table-row">
                <div>
                  {contestant.photo ? (
                    <img 
                      src={contestant.photo} 
                      alt={contestant.name} 
                      className="table-photo"
                    />
                  ) : (
                    <div className="placeholder-photo">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                <div>{contestant.name}</div>
                <div>{contestant.position}</div>
                <div className="vote-count">{contestant.votes}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No votes recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default LiveVotes;