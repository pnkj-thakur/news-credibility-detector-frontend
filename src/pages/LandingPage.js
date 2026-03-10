import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const platformHighlights = [
  {
    title: 'Credibility scoring',
    description:
      'Evaluate article trust signals with a clear score built for readers, students, and journalists.',
  },
  {
    title: 'Source comparison',
    description:
      'Review reporting patterns across outlets so conflicting claims are easier to investigate.',
  },
  {
    title: 'Actionable reports',
    description:
      'Turn raw article text into summaries, supporting context, and follow-up research paths.',
  },
];

const workflowSteps = [
  'Paste a news article or report into the analyzer.',
  'Review credibility indicators and supporting context.',
  'Track recent analyses and compare reporting patterns.',
];

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-brand">
          <span className="landing-brand-mark">NCD</span>
          <div>
            <h1>News Credibility Detector</h1>
            <p>AI-powered analysis for modern news verification</p>
          </div>
        </div>

        <nav className="landing-nav" aria-label="Public navigation">
          <Link to="/login" className="landing-nav-link">
            Log In
          </Link>
          <Link to="/signup" className="landing-nav-button">
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <span className="landing-kicker">Assess stories before they shape opinions</span>
            <h2>Understand what an article says, how reliable it looks, and where to investigate next.</h2>
            <p>
              News Credibility Detector helps users inspect article content, compare sources,
              and keep a record of recent analyses inside one focused dashboard.
            </p>

            <div className="landing-hero-actions">
              <Link to="/signup" className="landing-primary-action">
                Create an Account
              </Link>
              <Link to="/login" className="landing-secondary-action">
                Go to Login
              </Link>
            </div>
          </div>

          <div className="landing-hero-panel">
            <div className="landing-panel-card">
              <p className="landing-panel-label">How it works</p>
              <ul className="landing-step-list">
                {workflowSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="landing-highlights">
          {platformHighlights.map((item) => (
            <article key={item.title} className="landing-highlight-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <section className="landing-overview">
          <div className="landing-overview-card">
            <h3>Built for practical verification</h3>
            <p>
              The platform is designed for people who need quick signal checks without losing
              traceability. Analysts can move from raw text to a structured review in a few steps.
            </p>
          </div>
          <div className="landing-overview-card">
            <h3>Matches the internal dashboard workflow</h3>
            <p>
              The same clean layout, report-first structure, and clear actions continue after
              login, so the public entry point feels connected to the application itself.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
