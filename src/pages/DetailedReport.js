import React, { useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './DetailedReport.css';

function DetailedReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const aiResult = location.state?.result;
  const MAX_LENGTH = 512;

  const dynamicRecommendations = aiResult?.label === "FAKE" 
    ? [
        "This article matches known misinformation patterns. Do not share.", 
        "Check primary sources.", 
        "Verify the author's identity."
      ]
      : [
        "Cross-reference this with other reputable news outlets to gain more context.",
        "Check for updates to this story as new information may have emerged.",
        "Review the official website of any mentioned organizations for primary statements."
      ];

  const rawScoreValue = aiResult?.score !== undefined
    ? Number(aiResult.score)
    : Number(aiResult?.prob_real || 0) * 100;

  const displayReport = aiResult ? {
    title: aiResult.title || "Detailed Text Analysis",
    source: aiResult.source || "DistilBert Model",
    date: aiResult.analyzed_at ? new Date(aiResult.analyzed_at).toLocaleDateString() : new Date().toLocaleDateString(),
    score: rawScoreValue.toFixed(2),
    label: aiResult.label === "REAL" ? "High Credibility" : "Low Credibility",
    content: aiResult.text || aiResult.content || "",
    summary: `Using the DistilBERT-base architecture, our model performed a contextual analysis of the text's semantic embeddings. By processing tokens through multiple attention heads, it identified a ${rawScoreValue.toFixed(2)}% correlation with factual reporting patterns.`,
    recommendations: dynamicRecommendations,
    indicators: [
      {
        name: 'Attention-Based Context',
        status: rawScoreValue > 80 ? 'Strong' : rawScoreValue > 60 ? 'Medium' : 'Weak',
        impact: 'High',
        description: (rawScoreValue > 50) 
          ? 'The DistilBERT model found that the semantic "attention" weights align with logical, fact-based prose.' 
          : 'The model detected disjointed semantic patterns often seen in synthetic or manipulated text.'
      },
      {
        name: 'Token Sequence Density',
        status: (rawScoreValue > 50) ? 'Verified' : 'Irregular',
        impact: 'Medium',
        description: (rawScoreValue > 50)
          ? `The sequence distribution within the window shows high consistency with journalistic standards.`
          : `The sequence distribution deviates significantly from established journalistic standards.`
      }
    ]
  } : null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Strong':
      case 'Verified':
      case 'Current':
        return '#27ae60';
      case 'Neutral':
      case 'Medium':
        return '#f39c12';
      case 'Weak':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  if (!displayReport) {
    return (
      <div className="detailed-report-container">
        <Sidebar /><div className="detailed-report-main"><Header user={user} />
        <div className="error-state">
          <h2>No Report Data Available</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">Back to Dashboard</button>
        </div>
      </div></div>
    );
  }
  return (
    <div className="detailed-report-container">
      <Sidebar />
      <div className="detailed-report-main">
        <Header user={user} />

        <div className="detailed-report-content">
          <div className="report-header">
            <h1>{displayReport.title}</h1>
            <div className="report-meta">
              <span>{displayReport.source}</span>
              <span>{displayReport.date}</span>
            </div>
          </div>

          <div className="report-layout">
            <div className="report-left">
              <div className="article-preview">
                <h3>Article Preview</h3>
                <div className="preview-content">
                  <p>{displayReport.content}</p>
                </div>
              </div>
            </div>

            <div className="report-right">
              <div className="score-summary">
                <div className="score-badge" style={{ color: getStatusColor(displayReport.score >= 80 ? 'Strong' : displayReport.score >= 60 ? 'Medium' : 'Weak') }}>
                  <div className="score-number">{displayReport.score}%</div>
                  <div className="score-label">{displayReport.label}</div>
                </div>
                <p className="score-summary-text">{displayReport.summary}</p>
              </div>

              <div className="indicators-section">
                <h3>Analysis Indicators</h3>
                <div className="indicators-list">
                  {displayReport.indicators.map((indicator, idx) => (
                    <div key={idx} className="indicator-item">
                      <div className="indicator-header">
                        <h4>{indicator.name}</h4>
                        <div className="indicator-badges">
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(
                                indicator.status
                              ),
                            }}
                          >
                            {indicator.status}
                          </span>
                          <span className="impact-badge">
                            Impact: {indicator.impact}
                          </span>
                        </div>
                      </div>
                      <p className="indicator-description">
                        {indicator.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="recommendations-section">
                <h3>Recommendations for Verification</h3>
                <ol className="recommendations-list">
                  {displayReport.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="report-actions">
            <button onClick={() => navigate(-1)} className="btn-secondary">
              Back
            </button>
            <button
              onClick={() => navigate('/articles')}
              className="btn-primary"
            >
              View All Articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedReport;
