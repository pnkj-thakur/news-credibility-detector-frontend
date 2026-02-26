import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './Organizations.css';

function Organizations() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [expandedOrg, setExpandedOrg] = useState(null);

  const [organizations] = useState([
    {
      id: 1,
      name: 'Global News Network',
      score: 85,
      grade: 'A',
      articlesAnalyzed: 24,
      lastAnalysis: '2024-02-25',
      articles: [
        {
          id: 1,
          title: 'Global Climate Summit Reaches Historic Agreement',
          score: 85,
        },
        { id: 6, title: 'International Trade Agreement Signed', score: 88 },
      ],
    },
    {
      id: 2,
      name: 'Tech Weekly',
      score: 72,
      grade: 'B',
      articlesAnalyzed: 18,
      lastAnalysis: '2024-02-24',
      articles: [
        {
          id: 2,
          title: 'Tech Company Announces New Product Line',
          score: 72,
        },
        { id: 7, title: 'Latest Tech Innovations Explained', score: 70 },
      ],
    },
    {
      id: 3,
      name: 'Financial Times',
      score: 78,
      grade: 'A',
      articlesAnalyzed: 31,
      lastAnalysis: '2024-02-23',
      articles: [
        { id: 3, title: 'Market Shows Signs of Recovery', score: 78 },
        { id: 8, title: 'Investment Tips for 2024', score: 81 },
      ],
    },
    {
      id: 4,
      name: 'Politics Daily',
      score: 65,
      grade: 'C',
      articlesAnalyzed: 15,
      lastAnalysis: '2024-02-22',
      articles: [
        {
          id: 4,
          title: 'Healthcare Reform Proposal Sparks Debate',
          score: 65,
        },
        { id: 9, title: 'Election Results Analysis', score: 62 },
      ],
    },
    {
      id: 5,
      name: 'Science Journal',
      score: 92,
      grade: 'A+',
      articlesAnalyzed: 45,
      lastAnalysis: '2024-02-21',
      articles: [
        { id: 5, title: 'Scientific Breakthrough in Medicine', score: 92 },
        { id: 10, title: 'Research Findings in Physics', score: 94 },
      ],
    },
  ]);

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return '#27ae60';
      case 'B':
        return '#f39c12';
      case 'C':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="organizations-container">
      <Sidebar />
      <div className="organizations-main">
        <Header user={user} />

        <div className="organizations-content">
          <h2>News Organizations Credibility</h2>

          <div className="organizations-grid">
            {organizations.map((org) => (
              <div
                key={org.id}
                className={`org-card ${
                  expandedOrg === org.id ? 'expanded' : ''
                }`}
              >
                <div className="org-card-header">
                  <div className="org-info">
                    <h3>{org.name}</h3>
                  </div>
                  <div
                    className="org-grade"
                    style={{ borderColor: getGradeColor(org.grade) }}
                  >
                    <span>{org.grade}</span>
                  </div>
                </div>

                <div className="org-score">
                  <div className="score-value">{org.score}%</div>
                  <div className="score-label">Credibility Score</div>
                </div>

                <div className="org-stats">
                  <div className="stat">
                    <span className="stat-label">Articles Analyzed</span>
                    <span className="stat-value">{org.articlesAnalyzed}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Last Analysis</span>
                    <span className="stat-value">{org.lastAnalysis}</span>
                  </div>
                </div>

                {expandedOrg === org.id && (
                  <div className="org-articles">
                    <h4>Recent Articles</h4>
                    <div className="articles-list">
                      {org.articles.map((article) => (
                        <div key={article.id} className="article-item">
                          <span className="article-title">
                            {article.title}
                          </span>
                          <span className="article-score">
                            {article.score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() =>
                    setExpandedOrg(expandedOrg === org.id ? null : org.id)
                  }
                  className="org-action-btn"
                >
                  {expandedOrg === org.id
                    ? 'Hide Article Reports'
                    : 'View Article Reports'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Organizations;
