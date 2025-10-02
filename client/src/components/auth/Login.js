import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    admissionNumber: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const { admissionNumber, password } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/student/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="form-container">
        <h2 className="form-title">
          <img src="../../ktvc-logo.png" alt="Kandara Technical College Logo" className="college-logo" />
          <span className="college-name">Kandara Technical College</span>
          <span className="form-subtitle">Student Login</span>
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="admissionNumber">Admission Number</label>
            <input
              type="text"
              id="admissionNumber"
              name="admissionNumber"
              value={admissionNumber}
              onChange={onChange}
              required
              autoComplete="username"
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
              required
              autoComplete="current-password"
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
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <p className="admin-login-link">
            <Link to="/admin-login">Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;