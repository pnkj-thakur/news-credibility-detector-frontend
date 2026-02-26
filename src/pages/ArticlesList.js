import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './ArticlesList.css';

function ArticlesList() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterScore, setFilterScore] = useState('');

  const [articles] = useState([
    {
      id: 1,
      title: 'Global Climate Summit Reaches Historic Agreement',
      source: 'Global News Network',
      date: '2024-02-25',
      score: 85,
    },
    {
      id: 2,
      title: 'Tech Company Announces New Product Line',
      source: 'Tech Weekly',
      date: '2024-02-24',
      score: 72,
    },
    {
      id: 3,
      title: 'Market Shows Signs of Recovery',
      source: 'Financial Times',
      date: '2024-02-23',
      score: 78,
    },
    {
      id: 4,
      title: 'Healthcare Reform Proposal Sparks Debate',
      source: 'Politics Daily',
      date: '2024-02-22',
      score: 65,
    },
    {
      id: 5,
      title: 'Scientific Breakthrough in Medicine',
      source: 'Science Journal',
      date: '2024-02-21',
      score: 92,
    },
  ]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSource = !filterSource || article.source === filterSource;
    const matchesScore =
      !filterScore || getScoreRange(article.score) === filterScore;
    return matchesSearch && matchesSource && matchesScore;
  });

  const getScoreRange = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'moderate';
    return 'low';
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'badge-high';
    if (score >= 60) return 'badge-moderate';
    return 'badge-low';
  };

  const sources = [...new Set(articles.map((a) => a.source))];

  return (
    <div className="articles-list-container">
      <Sidebar />
      <div className="articles-list-main">
        <Header user={user} />

        <div className="articles-list-content">
          <h2>Articles Analysis History</h2>

          <div className="filters-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by article title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filters">
              <div className="filter-group">
                <label>Filter by Source</label>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                >
                  <option value="">All Sources</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Filter by Score</label>
                <select
                  value={filterScore}
                  onChange={(e) => setFilterScore(e.target.value)}
                >
                  <option value="">All Scores</option>
                  <option value="high">High (80+)</option>
                  <option value="moderate">Moderate (60-79)</option>
                  <option value="low">Low (&lt;60)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="articles-table">
              <thead>
                <tr>
                  <th>Article Title</th>
                  <th>Source</th>
                  <th>Date Analyzed</th>
                  <th>Credibility Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <tr key={article.id}>
                      <td className="title-cell">{article.title}</td>
                      <td>{article.source}</td>
                      <td>{article.date}</td>
                      <td>
                        <span
                          className={`score-badge ${getScoreBadgeClass(
                            article.score
                          )}`}
                        >
                          {article.score}%
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/analyze/${article.id}`)}
                          className="view-btn"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-results">
                      No articles found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlesList;
