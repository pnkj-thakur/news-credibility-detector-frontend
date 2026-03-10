import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/api';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setIsSubmitting(true);
      const response = await login({ email, password });
      handleLogin(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      const fallbackMessage = err.message || 'Login failed. Please try again.';
      setError(serverMessage ?? fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="auth-shell">
        <section className="auth-info-panel">
          <Link to="/" className="auth-home-link">
            News Credibility Detector
          </Link>
          <span className="auth-kicker">Welcome back</span>
          <h1>Sign in to continue reviewing article credibility.</h1>
          <p>
            Access your dashboard, recent analyses, and report history from one
            consistent workspace.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <strong>Structured analysis</strong>
              <span>Review credibility scores and article metadata in one place.</span>
            </div>
            <div className="auth-feature-item">
              <strong>Role-based use</strong>
              <span>Select the context that fits how you work with reporting.</span>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="login-header">
            <h2>Log In</h2>
            <p>Enter your account details to open the dashboard.</p>
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

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
