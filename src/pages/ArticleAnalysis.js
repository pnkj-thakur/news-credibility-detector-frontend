import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './ArticleAnalysis.css';

function ArticleAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Mock data for analysis result
  const analysisResult = {
    title: 'Global Climate Summit Reaches Historic Agreement',
    source: 'Global News Network',
    date: '2024-02-25',
    url: 'https://example.com/article',
    score: 85,
    label: 'High Credibility',
    summary:
      'This article demonstrates strong credibility with well-sourced information and balanced reporting.',
    keyFactors: [
      {
        name: 'Source Reliability',
        status: 'Strong',
        description: 'Publisher has established track record of accurate reporting',
      },
      {
        name: 'Language Sentiment',
        status: 'Neutral',
        description: 'Article uses objective language without sensationalism',
      },
      {
        name: 'Fact Verification',
        status: 'Verified',
        description: 'Multiple claims cross-referenced with reliable sources',
      },
      {
        name: 'Author Credentials',
        status: 'Strong',
        description: 'Author is recognized expert in the field',
      },
    ],
    flagsAndWarnings: [
      {
        flag: 'Minor concern',
        description: 'One claim could benefit from additional source verification',
      },
    ],
    content: `This is a sample article content demonstrating how news credibility detection works...`,
  };

  const handleFeedback = (helpful) => {
    setFeedback(helpful ? 'helpful' : 'not-helpful');
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedback('');
    }, 3000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="analysis-container">
      <Sidebar />
      <div className="analysis-main">
        <Header user={user} />

        <div className="analysis-content">
          <div className="article-header">
            <h1>{analysisResult.title}</h1>
            <div className="article-meta">
              <span className="source">{analysisResult.source}</span>
              <span className="date">{analysisResult.date}</span>
            </div>
          </div>

          <div className="score-section">
            <div
              className="score-badge-large"
              style={{ borderColor: getScoreColor(analysisResult.score) }}
            >
              <div className="score-number">{analysisResult.score}%</div>
              <div className="score-label">{analysisResult.label}</div>
            </div>
            <div className="score-description">
              <p>{analysisResult.summary}</p>
            </div>
          </div>

          <div className="factors-section">
            <div className="key-factors">
              <h3>Key Factors</h3>
              <div className="factors-list">
                {analysisResult.keyFactors.map((factor, idx) => (
                  <div key={idx} className="factor-item">
                    <div className="factor-header">
                      <h4>{factor.name}</h4>
                      <span className={`status status-${factor.status.toLowerCase()}`}>
                        {factor.status}
                      </span>
                    </div>
                    <p>{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flags-warnings">
              <h3>Flags & Warnings</h3>
              {analysisResult.flagsAndWarnings.length > 0 ? (
                <div className="warnings-list">
                  {analysisResult.flagsAndWarnings.map((warning, idx) => (
                    <div key={idx} className="warning-item">
                      <h4>{warning.flag}</h4>
                      <p>{warning.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-warnings">No warnings detected</p>
              )}
            </div>
          </div>

          <div className="feedback-section">
            <h3>Was this analysis helpful?</h3>
            <div className="feedback-buttons">
              <button
                onClick={() => handleFeedback(true)}
                className="feedback-btn helpful"
              >
                👍 Helpful
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className="feedback-btn not-helpful"
              >
                👎 Not Helpful
              </button>
            </div>
            {feedbackSubmitted && (
              <p className="feedback-submitted">
                Thank you for your feedback!
              </p>
            )}
          </div>

          <div className="action-buttons">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate(`/report/${id}`)}
              className="btn-primary"
            >
              View Detailed Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleAnalysis;
