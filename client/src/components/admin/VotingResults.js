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
      <h2>Final Voting Results</h2>
      
      <div className="results-summary">
        <div className="summary-card">
          <h3>Total Votes Cast</h3>
          <p className="vote-count">{totalVotes || 0}</p>
        </div>
      </div>
      
      <div className="results-section">
        <h3>Results by Position</h3>
        {byPosition && Object.keys(byPosition).length > 0 ? (
          Object.keys(byPosition).map(position => (
            <div key={position} className="position-results">
              <h4>{position}</h4>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Contestant Name</th>
                    <th>Votes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {byPosition[position].map((item, index) => (
                    <tr key={item.contestant._id}>
                      <td>#{index + 1}</td>
                      <td>{item.contestant.name}</td>
                      <td>{item.votes}</td>
                      <td>{index === 0 ? 'Winner' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No votes recorded yet.</p>
        )}
      </div>
      
      <div className="overall-results">
        <h3>Overall Results</h3>
        <table className="results-table overall-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Contestant Name</th>
              <th>Position</th>
              <th>Votes</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {overall && overall.length > 0 ? (
              overall.map((contestant, index) => (
                <tr key={contestant._id}>
                  <td>#{index + 1}</td>
                  <td>{contestant.name}</td>
                  <td>{contestant.position}</td>
                  <td>{contestant.votes}</td>
                  <td>{index === 0 ? 'Top Contestant' : ''}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No votes recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VotingResults;