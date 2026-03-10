import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signup } from '../services/api';
import './Signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('general-reader');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      await signup({ name, email, password, role });
      // After creating an account, send the user to the login page instead
      // of automatically logging them in.
      navigate('/login');
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      const fallbackMessage = err.message || 'Sign up failed. Please try again.';
      setError(serverMessage ?? fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-shell">
        <section className="signup-info-panel">
          <Link to="/" className="signup-home-link">
            News Credibility Detector
          </Link>
          <span className="signup-kicker">Create access</span>
          <h1>Start using the platform to analyze news with more structure.</h1>
          <p>
            Create an account to save your role, enter the dashboard, and begin
            reviewing article credibility inside the main workflow.
          </p>

          <div className="signup-benefit-list">
            <div className="signup-benefit-item">
              <strong>Fast onboarding</strong>
              <span>Create an account and move directly into the dashboard.</span>
            </div>
            <div className="signup-benefit-item">
              <strong>Focused workspace</strong>
              <span>Track analyses, sources, and reports from a single interface.</span>
            </div>
          </div>
        </section>

        <section className="signup-card">
          <div className="signup-header">
            <h2>Create Account</h2>
            <p>Set up your profile to start using the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

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
                placeholder="Create a password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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

            <button type="submit" className="signup-button" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Already have an account? <Link to="/login">Log in here</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Signup;
