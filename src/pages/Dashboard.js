import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './Dashboard.css';

function Dashboard() {
  const [articleText, setArticleText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState([
    {
      id: 1,
      title: 'Global Climate Summit Reaches Historic Agreement',
      source: 'Global News Network',
      date: '2024-02-25',
      score: 85,
      label: 'High Credibility',
    },
    {
      id: 2,
      title: 'Tech Company Announces New Product Line',
      source: 'Tech Weekly',
      date: '2024-02-24',
      score: 72,
      label: 'Moderate Credibility',
    },
    {
      id: 3,
      title: 'Market Shows Signs of Recovery',
      source: 'Financial Times',
      date: '2024-02-23',
      score: 78,
      label: 'High Credibility',
    },
  ]);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
    const uniqueID = Date.now();

    const newAnalysis = {
      id: uniqueID,
      title: articleText.substring(0, 50) + '...',
      source: 'AI Model',
      date: new Date().toISOString().split('T')[0],
      score: Math.round(result.prob_real * 100),
      label: result.label === "REAL" ? "High Credibility" : "Low Credibility",
      aiResult: result
    };
    
    // setRecentAnalyses([newAnalysis, ...recentAnalyses.slice[0, 4]]);
    setRecentAnalyses([newAnalysis, ...recentAnalyses.slice(0, 4)]);
    setArticleText('');
    setAnalyzing(false);
    
    navigate(`/analyze/${uniqueID}`, { state: {result} });

    } catch (error) {
      console.error("Analysis Error: ", error);
      alert("Could not reach the analysis server.")
      setAnalyzing(false);
    }

    // Simulate API call
  //   setTimeout(() => {
  //     const newAnalysis = {
  //       id: recentAnalyses.length + 1,
  //       title: articleText.substring(0, 50) + '...',
  //       source: 'User Input',
  //       date: new Date().toISOString().split('T')[0],
  //       score: Math.floor(Math.random() * 30) + 60,
  //       label: 'Processing Complete',
  //     };

  //     setRecentAnalyses([newAnalysis, ...recentAnalyses.slice(0, 4)]);
  //     setArticleText('');
  //     setAnalyzing(false);
  //     navigate(`/analyze/${newAnalysis.id}`);
  //   }, 2000);
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
                      key={analysis.id}
                      onClick={() => navigate(`/analyze/${analysis.id}`, { state: { result: analysis.aiResult}})}
                      className="analyses-row"
                    >
                      <td className="title-cell">{analysis.title}</td>
                      <td>{analysis.source}</td>
                      <td>{analysis.date}</td>
                      <td>
                        <span className={`score-badge ${getScoreBadgeClass(analysis.score)}`}>
                          {analysis.score}%
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
