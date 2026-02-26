import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('general-reader');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Simulate API call
      const userData = {
        email,
        role,
        name: email.split('@')[0],
        loginTime: new Date().toISOString(),
      };

      handleLogin(userData);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>News Credibility Detector</h1>
          <p>AI-Powered News Analysis System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">User Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="general-reader">General Reader</option>
              <option value="journalist">Journalist</option>
              <option value="student">Student</option>
              <option value="developer">Developer</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="#signup">Sign up here</a></p>
        </div>
      </div>

      <div className="login-background"></div>
    </div>
  );
}

export default Login;
