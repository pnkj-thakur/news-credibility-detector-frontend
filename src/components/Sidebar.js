import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>News Detector</h2>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-label">Main</h3>
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link
            to="/articles"
            className={`nav-link ${isActive('/articles') ? 'active' : ''}`}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Articles List</span>
          </Link>
          <Link
            to="/organizations"
            className={`nav-link ${isActive('/organizations') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏢</span>
            <span className="nav-text">Organizations</span>
          </Link>
        </div>

        <div className="nav-section">
          <h3 className="nav-label">Resources</h3>
          <Link
            to="/help"
            className={`nav-link ${isActive('/help') ? 'active' : ''}`}
          >
            <span className="nav-icon">❓</span>
            <span className="nav-text">Help & FAQ</span>
          </Link>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogoutClick} className="logout-btn">
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
