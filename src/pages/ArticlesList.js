import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './ArticlesList.css';
import { getArticles } from '../services/api';

function ArticlesList() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterScore, setFilterScore] = useState('');

  useEffect(() => {
    const loadData = async() => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await getArticles(user.id);
        setArticles(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load articles:", err);
        setError("Could not load analysis history");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

 const getScoreRange = (score) => {
    const numScore = Number(score);
    if (numScore >= 80) return 'high';
    if (numScore >= 60) return 'moderate';
    return 'low';
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'badge-high';
    if (score >= 60) return 'badge-moderate';
    return 'badge-low';
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSource = !filterSource || article.source === filterSource;
    const matchesScore = !filterScore || getScoreRange(article.score) === filterScore;
    return matchesSearch && matchesSource && matchesScore;
  });

 

  const sources = [...new Set(articles.map((a) => a.source))];
  if (loading) return <div className="loading">Connecting to the Database . . .</div>;
  if (error) return <div className='error'>{error}</div>;
  
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
                          {Number(article.score).toFixed(2)}%
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/report/${article.id}`, { state: { result: article } })}
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
