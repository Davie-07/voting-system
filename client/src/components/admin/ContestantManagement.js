import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './ContestantManagement.css';

const ContestantManagement = () => {
  const [contestants, setContestants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    position: '',
    manifesto: ''
  });
  const [photo, setPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadContestants();
  }, []);
  
  const loadContestants = async () => {
    try {
      const res = await api.get('/admin/contestants');
      setContestants(res.data);
    } catch (err) {
      setError('Failed to load contestants');
    } finally {
      setLoading(false);
    }
  };
  
  const { name, course, position, manifesto } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onPhotoChange = e => {
    setPhoto(e.target.files[0]);
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('course', course);
      formDataToSend.append('position', position);
      formDataToSend.append('manifesto', manifesto);
      if (photo) {
        formDataToSend.append('photo', photo);
      }
      
      if (editingId) {
        // Update existing contestant
        await api.put(`/admin/contestants/${editingId}`, formDataToSend);
        setMessage('Contestant updated successfully!');
      } else {
        // Add new contestant
        await api.post('/admin/contestants', formDataToSend);
        setMessage('Contestant added successfully!');
      }
      
      // Reset form
      setFormData({
        name: '',
        course: '',
        position: '',
        manifesto: ''
      });
      setPhoto(null);
      setEditingId(null);
      
      // Reload contestants
      loadContestants();
    } catch (err) {
      setError('Failed to save contestant');
    } finally {
      setSubmitting(false);
    }
  };
  
  const onEdit = contestant => {
    setFormData({
      name: contestant.name,
      course: contestant.course,
      position: contestant.position,
      manifesto: contestant.manifesto
    });
    setEditingId(contestant._id);
    window.scrollTo(0, 0);
  };
  
  const onDelete = async id => {
    if (window.confirm('Are you sure you want to delete this contestant?')) {
      try {
        await api.delete(`/admin/contestants/${id}`);
        setMessage('Contestant deleted successfully!');
        loadContestants();
      } catch (err) {
        setError('Failed to delete contestant');
      }
    }
  };
  
  const onCancelEdit = () => {
    setFormData({
      name: '',
      course: '',
      position: '',
      manifesto: ''
    });
    setPhoto(null);
    setEditingId(null);
  };
  
  if (loading) {
    return (
      <div className="contestant-management">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading contestants...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="contestant-management">
      <h2>Contestant Management</h2>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-section">
        <h3>{editingId ? 'Edit Contestant' : 'Add New Contestant'}</h3>
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
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
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={position}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="manifesto">Manifesto</label>
            <textarea
              id="manifesto"
              name="manifesto"
              value={manifesto}
              onChange={onChange}
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="photo">Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={onPhotoChange}
            />
          </div>
          
          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (editingId ? 'Update Contestant' : 'Add Contestant')}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onCancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="contestants-list">
        <h3>Current Contestants</h3>
        {contestants.length === 0 ? (
          <p>No contestants added yet.</p>
        ) : (
          <div className="contestants-grid">
            {contestants.map(contestant => (
              <div key={contestant._id} className="contestant-card">
                {contestant.photo && (
                  <img 
                    src={contestant.photo} 
                    alt={contestant.name} 
                    className="contestant-photo"
                  />
                )}
                <div className="contestant-info">
                  <h4>{contestant.name}</h4>
                  <p><strong>Course:</strong> {contestant.course}</p>
                  <p><strong>Position:</strong> {contestant.position}</p>
                  <p><strong>Manifesto:</strong> {contestant.manifesto}</p>
                  <p><strong>Votes:</strong> {contestant.votes}</p>
                  <div className="contestant-actions">
                    <button 
                      className="btn btn-warning"
                      onClick={() => onEdit(contestant)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => onDelete(contestant._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestantManagement;