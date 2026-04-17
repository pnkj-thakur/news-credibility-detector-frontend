import React, { useState, useContext, useEffect, useRef} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './ArticleAnalysis.css';
import { saveAnalysis } from '../services/api';

function ArticleAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const aiResult = location.state?.result;
  const hasSaved = useRef(false);

  const encodeUnicode = (str) => {
    return btoa(new TextEncoder().encode(str).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  }

  useEffect(() => {
    const autoSave = async () => {
    if (!aiResult || !user || !user.id || hasSaved.current) return;
    const encodeContent = aiResult.content || aiResult.text || "";
    const saveKey = `saved_${encodeUnicode(encodeContent).substring(0, 16)}`;

    if (sessionStorage.getItem(saveKey) || hasSaved.current) return;
    if (id && id !== 'new') return;
      try {
        hasSaved.current = true;
        const payload = {
          userId: user.id,
          title: aiResult.title || "Text Analysis",
          content: aiResult.content || "No content provided",
          source: aiResult.source || "Manual Entry",
          score: (aiResult.prob_real * 100).toFixed(2),
          label: aiResult.label === "REAL" ? "High Credibility" : "Low Credibility",
          summary: `The AI is ${(aiResult.prob_real * 100).toFixed(1)}% confident this is REAL.`,
        };
        await saveAnalysis(payload);
        sessionStorage.setItem(saveKey, 'true');
        console.log("Analysis automatically saved");
      } catch (err) {
        console.error("Failed to save:", err);
        hasSaved.current = false;
      }
  };
  autoSave();
  
  }, [aiResult, user]);

  if (!aiResult) {
  return (
    <div className="analysis-container">
      <Sidebar />
      <div className="analysis-main">
        <Header user={user} />
        <div className="error-state">
          <h2>No Analysis Data Found</h2>
          <p>Please go back to the Dashboard and paste an article to analyze.</p>
          <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

const rawScore = aiResult.score !== undefined 
  ? Number(aiResult.score) 
  : Number(aiResult.prob_real) * 100;

  const displayData = {
    title: "Analysis Result",
    content: aiResult.text || aiResult.content || "",
    source: aiResult.source || "AI Prediction",
    date: new Date().toLocaleDateString(),
    score: rawScore,
    label: aiResult.label === "REAL" ? "High Credibility" : "Low Credibility",
    summary: `The AI model is ${(rawScore).toFixed(2)}% confident this text is REAL`,
    keyFactors: [],
    flagsAndWarnings: (aiResult.label === "FAKE" || aiResult.label === "fake") 
    ? [{flag: "High Risk", description: "This text matches patterns commonly found in misinformation."}] 
    : []
  } 

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
            <h1>{displayData.title}</h1>
            <div className="article-meta">
              <span className="source">{displayData.source}</span>
              <span className="date">{displayData.date}</span>
            </div>
          </div>

          <div className="score-section">
            <div
              className="score-badge-large"
              style={{ borderColor: getScoreColor(displayData.score) }}
            >
              <div className="score-number">{displayData.score.toFixed(2)}%</div>
              <div className="score-label">{displayData.label}</div>
            </div>
            <div className="score-description">
              <p>{displayData.summary}</p>
            </div>
          </div>

          <div className="factors-section">
            <div className="key-factors">
              <h3>Key Factors</h3>
              <div className="factors-list">
                {displayData.keyFactors.map((factor, idx) => (
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
              {displayData.flagsAndWarnings.length > 0 ? (
                <div className="warnings-list">
                  {displayData.flagsAndWarnings.map((warning, idx) => (
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
              // onClick={() => navigate(`/report/${id}`)}
              onClick={() => navigate(`/report/${id}`, { state: { result: aiResult } })}
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
