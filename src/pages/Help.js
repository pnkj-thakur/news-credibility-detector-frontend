import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './Help.css';

function Help() {
  const { user } = useContext(AuthContext);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const steps = [
    {
      number: 1,
      title: 'Paste Article Text',
      description:
        'Go to the Dashboard and paste the full text of the news article you want to analyze into the text area.',
      icon: '📄',
    },
    {
      number: 2,
      title: 'Click Analyze',
      description:
        'Click the "Analyze Article" button to submit the article for credibility analysis.',
      icon: '⚡',
    },
    {
      number: 3,
      title: 'View Results',
      description:
        'The system will analyze the article and display a credibility score along with a detailed explanation.',
      icon: '📊',
    },
  ];

  const faqs = [
    {
      question: 'How accurate is the credibility score?',
      answer:
        'Our system achieves approximately 82% accuracy in distinguishing between credible and non-credible news. The accuracy depends on the quality and diversity of the training data. We continuously work to improve our models through user feedback and additional training.',
    },
    {
      question: 'What factors are analyzed?',
      answer:
        'We analyze multiple factors including: source reliability, language sentiment, fact verification, author credentials, attribution quality, and temporal relevance of the article. Each factor contributes to the overall credibility score.',
    },
    {
      question: 'Can I analyze non-English articles?',
      answer:
        'Currently, our system only supports English language content. We are working on multilingual support for future versions.',
    },
    {
      question: 'How long does analysis take?',
      answer:
        'Most articles are analyzed within 30-60 seconds. Complex articles with extensive content may take up to 2 minutes.',
    },
    {
      question: 'What does each credibility score mean?',
      answer:
        'High Credibility (80+%): Article is well-sourced and factually accurate. Moderate Credibility (60-79%): Article has mostly accurate information but may have minor issues. Low Credibility (<60%): Article has significant credibility concerns and should be verified further.',
    },
    {
      question: 'How is my data handled?',
      answer:
        'User data is encrypted and stored securely. We do not share personal information with third parties. Analyzed articles are stored only for improving our system with user permission.',
    },
    {
      question: 'Can I provide feedback on results?',
      answer:
        'Yes! After viewing analysis results, you can provide feedback by clicking "Helpful" or "Not Helpful". This feedback helps us improve our system accuracy.',
    },
    {
      question: 'What should I do if I disagree with the score?',
      answer:
        'If you disagree with a score, you can provide feedback through the feedback button. We also recommend comparing results with other fact-checking services and making your own informed decision.',
    },
  ];

  const toggleFaq = (idx) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  return (
    <div className="help-container">
      <Sidebar />
      <div className="help-main">
        <Header user={user} />

        <div className="help-content">
          <div className="help-hero">
            <h1>How News Credibility Detector Works</h1>
            <p>Learn how to use our AI-powered news analysis system</p>
          </div>

          <section className="steps-section">
            <h2>Getting Started</h2>
            <div className="steps-grid">
              {steps.map((step) => (
                <div key={step.number} className="step-card">
                  <div className="step-icon">{step.icon}</div>
                  <h3>Step {step.number}: {step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="features-section">
            <h2>Key Features</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h3>Multiple User Roles</h3>
                <p>
                  Access is customized for General Readers, Journalists, Students,
                  and Developers.
                </p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📈</div>
                <h3>Organization Scoring</h3>
                <p>
                  See credibility scores for entire news organizations, not just
                  individual articles.
                </p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔍</div>
                <h3>Detailed Analysis</h3>
                <p>
                  Get in-depth explanations of why articles received their scores.
                </p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💡</div>
                <h3>Educational Content</h3>
                <p>
                  Learn about misinformation indicators and how to identify them.
                </p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📚</div>
                <h3>History Tracking</h3>
                <p>
                  View and manage all your previous analyses with search and
                  filter options.
                </p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔄</div>
                <h3>Continuous Improvement</h3>
                <p>
                  Your feedback helps us improve the accuracy of our detection
                  system.
                </p>
              </div>
            </div>
          </section>

          <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`faq-item ${expandedFaq === idx ? 'expanded' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">
                      {expandedFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {expandedFaq === idx && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="tips-section">
            <h2>Tips for Better Results</h2>
            <div className="tips-list">
              <div className="tip-item">
                <h4>✓ Provide Full Article Text</h4>
                <p>
                  Paste the complete article for the most accurate analysis. Short
                  excerpts may not provide sufficient context.
                </p>
              </div>
              <div className="tip-item">
                <h4>✓ Cross-Check Results</h4>
                <p>
                  While our system is highly accurate, it's good practice to verify
                  findings with other fact-checking sources.
                </p>
              </div>
              <div className="tip-item">
                <h4>✓ Understand the Indicators</h4>
                <p>
                  Read the detailed analysis to understand which factors influenced
                  the credibility score.
                </p>
              </div>
              <div className="tip-item">
                <h4>✓ Provide Feedback</h4>
                <p>
                  Help us improve by providing feedback on analysis results. Your
                  input makes the system more accurate.
                </p>
              </div>
            </div>
          </section>

          <section className="contact-section">
            <h2>Need More Help?</h2>
            <p>
              If you have questions or suggestions, please contact our support team at{' '}
              <strong>support@newscredibility.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Help;
