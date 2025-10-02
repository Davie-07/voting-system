import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './Auth.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    systemId: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const { systemId, password } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/admin/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="form-container">
        <h2 className="form-title">
          <img src="../../ktvc-logo-r.png" alt="Kandara College Logo" className="college-logo" />
          <span className="college-name">Kandara College</span>
          <span className="form-subtitle">Admin Login</span>
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="systemId">Admin System ID</label>
            <input
              type="text"
              id="systemId"
              name="systemId"
              value={systemId}
              onChange={onChange}
              placeholder="Enter your system ID"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        
        <div className="auth-links">
          <p>
            <Link to="/login">Student Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;