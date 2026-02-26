import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticleAnalysis from './pages/ArticleAnalysis';
import ArticlesList from './pages/ArticlesList';
import Organizations from './pages/Organizations';
import DetailedReport from './pages/DetailedReport';
import Help from './pages/Help';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/analyze/:id"
            element={user ? <ArticleAnalysis /> : <Navigate to="/login" />}
          />
          <Route
            path="/articles"
            element={user ? <ArticlesList /> : <Navigate to="/login" />}
          />
          <Route
            path="/organizations"
            element={user ? <Organizations /> : <Navigate to="/login" />}
          />
          <Route
            path="/report/:id"
            element={user ? <DetailedReport /> : <Navigate to="/login" />}
          />
          <Route
            path="/help"
            element={user ? <Help /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
