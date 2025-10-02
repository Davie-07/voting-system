import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    admissionNumber: '',
    course: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  
  const { firstName, admissionNumber, course, password } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const res = await api.post('/auth/student/register', formData);
      localStorage.setItem('token', res.data.token);
      setSuccess(true);
      
      // Redirect after 4 seconds to simulate loading effect
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 4000);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Registration failed');
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
          <span className="form-subtitle">Student Registration</span>
        </h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Registration successful! Redirecting to dashboard...
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={onChange}
              placeholder="Enter your first name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="admissionNumber">Admission Number</label>
            <input
              type="text"
              id="admissionNumber"
              name="admissionNumber"
              value={admissionNumber}
              onChange={onChange}
              placeholder="Enter your admission number"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="course">Course</label>
            <input
              type="text"
              id="course"
              name="course"
              value={course}
              onChange={onChange}
              placeholder="Enter your course"
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
              className="btn btn-success"
              disabled={loading || success}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        
        <div className="auth-links">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;