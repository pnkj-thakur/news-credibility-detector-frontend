import React from 'react';
import './Header.css';

function Header({ user }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1>News Credibility Detector</h1>
      </div>

      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">
              {user?.role
                ?.replace('-', ' ')
                .split(' ')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ') || 'User'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
