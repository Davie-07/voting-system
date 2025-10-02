import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();
  
  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };
  
  return (
    <header className="admin-header">
      <div className="container">
        <div className="header-content">
          <h1>
            <Link to="/admin">
              <img src="../../ktvc-logo-r.png" alt="Kandara College Logo" className="header-logo" />
              Kandara College Admin
            </Link>
          </h1>
          <nav>
            <ul>
              <li>
                <Link to="/admin">Voting Control</Link>
              </li>
              <li>
                <Link to="/admin/contestants">Contestants</Link>
              </li>
              <li>
                <Link to="/admin/results">Results</Link>
              </li>
              <li>
                <button onClick={onLogout} className="btn btn-danger">
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;