import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './Dashboard.css';
import { getArticles } from '../services/api';

function Dashboard() {
  const [articleTitle, setArticleTitle] = useState('');
  const [articleText, setArticleText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;

      try {
        const response = await getArticles(user.id);
        if (response && response.data && Array.isArray(response.data)) {
          setRecentAnalyses(response.data.slice(0,5));
        } else {
          setRecentAnalyses([])
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setRecentAnalyses([])
      }
    };

    fetchHistory();
  }, [user]);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!articleText.trim()) {
      alert('Please paste an article text to analyze');
      return;
    }

    setAnalyzing(true);

    //calls uvicorn server
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: articleText }),
      });
    
    if (!response.ok) throw new Error('Failed to Connect to analysis server');

    const result = await response.json();

    const resultWithTitle = {
      ...result,
      title: articleTitle || "Text Analysis",
      content: articleText
    };

    setAnalyzing(false);
    
    // navigate(`/analyze/${uniqueID}`, { state: {result} });
    navigate(`/analyze/new`, { state: {result: resultWithTitle} });

    } catch (error) {
      console.error("Analysis Error: ", error);
      alert("Could not reach the analysis server.")
      setAnalyzing(false);
    }
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'badge-high';
    if (score >= 60) return 'badge-moderate';
    return 'badge-low';
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header user={user} />

        <div className="dashboard-content">
          <section className="article-input-section">
            <h2>Analyze a News Article</h2>
            <form onSubmit={handleAnalyze} className="article-form">
              <div className="form-group">
                <label htmlFor='articleTitle'>Article Title</label>
                <input 
                  id='articleTitle'
                  type="text"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder='Enter a title for this analysis (e.g., Politics, Global Warming, etc.)'
                  className='article-input-title'
                />
                <label htmlFor="articleText">
                  Paste or type the full article text here, then click Analyze.
                </label>
                <textarea
                  id="articleText"
                  value={articleText}
                  onChange={(e) => setArticleText(e.target.value)}
                  placeholder="Paste your article text here..."
                  rows="8"
                  className="article-textarea"
                />
              </div>
              <button
                type="submit"
                disabled={analyzing}
                className="analyze-button"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Article'}
              </button>
            </form>
          </section>

          <section className="recent-analyses-section">
            <h2>Recent Analyses</h2>
            <div className="table-responsive">
              <table className="analyses-table">
                <thead>
                  <tr>
                    <th>Article Title</th>
                    <th>Source</th>
                    <th>Date</th>
                    <th>Credibility Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAnalyses.map((analysis) => (
                    <tr
                      key={analysis.article_id || analysis.id}
                      onClick={() => navigate(`/analyze/${analysis.article_id || analysis.id}`, { state: { result: analysis}})}
                      className="analyses-row"
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="title-cell">{analysis.title}</td>
                      <td>{analysis.source}</td>
                      <td>{analysis.analyzed_at ? new Date(analysis.analyzed_at).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <span className={`score-badge ${getScoreBadgeClass(analysis.score)}`}>
                          {Number(analysis.score).toFixed(2)}%
                        </span>
                      </td>
                      <td>{analysis.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
