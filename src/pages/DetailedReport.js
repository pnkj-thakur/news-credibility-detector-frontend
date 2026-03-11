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

  // Mock detailed report data
  const report = {
    title: 'Global Climate Summit Reaches Historic Agreement',
    source: 'Global News Network',
    date: '2024-02-25',
    content: `International delegates came together yesterday to announce a groundbreaking climate accord. 
    The agreement sets ambitious targets for carbon reduction across member nations and establishes a 
    framework for renewable energy development. Key points include stricter emissions standards for 
    industrial sectors and increased funding for climate research initiatives.`,
    score: 85,
    label: 'High Credibility',
    summary: 'This article demonstrates strong credibility with well-sourced information and balanced reporting.',
    indicators: [
      {
        name: 'Source Reliability',
        status: 'Strong',
        impact: 'High',
        description:
          'Global News Network has a strong track record with 25+ years of reporting. The organization maintains editorial standards and fact-checking procedures.',
      },
      {
        name: 'Language Sentiment',
        status: 'Neutral',
        impact: 'Medium',
        description:
          'The article uses objective language without sensationalism. Words like "announced" and "agreement" are neutral. No excessive exclamation marks detected.',
      },
      {
        name: 'Fact Verification',
        status: 'Verified',
        impact: 'High',
        description:
          'Multiple claims cross-referenced with reliable sources. The summit details match official UN records.',
      },
      {
        name: 'Author Credentials',
        status: 'Strong',
        impact: 'High',
        description:
          'Anna Wilson is a recognized environmental journalist with degrees in Environmental Science and Journalism.',
      },
      {
        name: 'Attribution Quality',
        status: 'Strong',
        impact: 'Medium',
        description:
          'Article includes quotes from 3 official government sources and 2 independent experts.',
      },
      {
        name: 'Temporal Relevance',
        status: 'Current',
        impact: 'Medium',
        description:
          'Article published within 24 hours of the described event, indicating timely reporting.',
      },
    ],
    recommendations: [
      'Check the official UN climate summit website for additional details',
      'Review government statements from major participating nations',
      'Compare with reporting from other reputable news outlets',
    ],
  };

  const dynamicRecommendations = aiResult?.label === "FAKE" 
    ? [
        "This article matches known misinformation patterns. Do not share.", 
        "Check primary sources.", 
        "Verify the author's identity."
      ]
    : report.recommendations;

  const displayReport = aiResult ? {
    ...report, // Use the mock structure for indicators
    title: "Detailed AI Analysis",
    score: Math.round(aiResult.prob_real * 100),
    label: aiResult.label === "REAL" ? "High Credibility" : "Low Credibility",
    recommendations: dynamicRecommendations,
    summary: `Our Transformer model has analyzed the linguistic patterns and determined a ${Math.round(aiResult.prob_real * 100)}% probability of the content being factual.`,
    content: "AI processed text input..." 
  } : report;

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
                <div className="score-badge" style={{ color: getStatusColor('Strong') }}>
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
