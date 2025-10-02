import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './VotingResults.css';

const VotingResults = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadResults();
  }, []);
  
  const loadResults = async () => {
    try {
      const res = await api.get('/admin/voting/results');
      setResults(res.data);
    } catch (err) {
      setError('Failed to load voting results');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="voting-results">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="voting-results">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
  
  const { overall, byPosition, totalVotes } = results;
  
  return (
    <div className="voting-results">
      <h2>Voting Results</h2>
      
      <div className="results-summary">
        <div className="summary-card">
          <h3>Total Votes</h3>
          <p className="vote-count">{totalVotes || 0}</p>
        </div>
      </div>
      
      <div className="results-section">
        <h3>Results by Position</h3>
        {byPosition && Object.keys(byPosition).length > 0 ? (
          Object.keys(byPosition).map(position => (
            <div key={position} className="position-results">
              <h4>{position}</h4>
              <div className="contestants-list">
                {byPosition[position].map((item, index) => (
                  <div key={item.contestant._id} className="contestant-result">
                    <div className="contestant-info">
                      <span className="rank">#{index + 1}</span>
                      <span className="name">{item.contestant.name}</span>
                      <span className="votes">{item.votes} votes</span>
                      {index === 0 && <span className="leader-badge">Leader</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No votes recorded yet.</p>
        )}
      </div>
      
      <div className="overall-results">
        <h3>Overall Results</h3>
        {overall && overall.length > 0 ? (
          <div className="contestants-list">
            {overall.map((contestant, index) => (
              <div key={contestant._id} className="contestant-result">
                <div className="contestant-info">
                  <span className="rank">#{index + 1}</span>
                  <span className="name">{contestant.name}</span>
                  <span className="position">{contestant.position}</span>
                  <span className="votes">{contestant.votes} votes</span>
                  {index === 0 && <span className="leader-badge">Top</span>}
                </div>
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

export default VotingResults;