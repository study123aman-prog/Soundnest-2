

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="top-navbar">
      <div className="d-flex align-items-center gap-2">
        <span className="nav-brand">SoundNest</span>
        <button className="nav-btn ms-3" onClick={() => navigate(-1)} title="Go back">
          <i className="bi bi-chevron-left"></i>
        </button>
        <button className="nav-btn" onClick={() => navigate(1)} title="Go forward">
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      {/* Right: User info + logout */}
      <div className="d-flex align-items-center gap-3">
        {user && (
          <>
            <span className={`role-badge role-${user.role}`}>{user.role}</span>
            <span className="text-white" style={{ fontSize: '0.9rem' }}>{user.name}</span>
            <button className="btn btn-sm btn-outline-light rounded-pill" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Logout
            </button>
          </>
        )}
        {!user && (
          <button className="btn btn-sm btn-outline-light rounded-pill" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
