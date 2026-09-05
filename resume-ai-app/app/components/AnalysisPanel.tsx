'use client';

import { CheckCircle2, XCircle, Lightbulb, TrendingUp } from 'lucide-react';
import ATSScoreCard from './ATSScoreCard';
import KeywordBadges from './KeywordBadges';
import type { AnalysisResult } from '@/types/analysis';

interface AnalysisPanelProps {
  analysis: AnalysisResult;
  onTailor: () => void;
  isTailoring: boolean;
}

export default function AnalysisPanel({ analysis, onTailor, isTailoring }: AnalysisPanelProps) {
  return (
    <div className="analysis-panel">
      {/* Score */}
      <section className="panel-section">
        <h2 className="section-heading">ATS Score Breakdown</h2>
        <ATSScoreCard score={analysis.score} />
      </section>

      {/* Keywords */}
      <section className="panel-section">
        <h2 className="section-heading">Keyword Analysis</h2>
        <KeywordBadges matching={analysis.matchingKeywords} missing={analysis.missingKeywords} />
      </section>

      {/* Strengths & Weaknesses */}
      <div className="sw-grid">
        <section className="sw-card strengths">
          <h3 className="sw-heading">
            <CheckCircle2 size={16} className="icon-success" /> Strengths
          </h3>
          <ul className="sw-list">
            {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>
        <section className="sw-card weaknesses">
          <h3 className="sw-heading">
            <XCircle size={16} className="icon-error" /> Weaknesses
          </h3>
          <ul className="sw-list">
            {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </section>
      </div>

      {/* Recommendations */}
      <section className="panel-section">
        <h2 className="section-heading">
          <Lightbulb size={16} className="icon-accent" /> Recommendations
        </h2>
        <ul className="recommendations-list">
          {analysis.recommendations.map((r, i) => (
            <li key={i} className="recommendation-item">
              <span className="rec-number">{i + 1}</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="tailor-cta">
        <div className="tailor-cta-text">
          <TrendingUp size={20} className="icon-accent" />
          <div>
            <p className="cta-title">Ready to boost your score?</p>
            <p className="cta-sub">Our AI will rewrite and optimize your resume for this role — no fabrication, only smart rephrasing.</p>
          </div>
        </div>
        <button
          id="tailor-resume-btn"
          className="btn-primary btn-large"
          onClick={onTailor}
          disabled={isTailoring}
        >
          {isTailoring ? (
            <><span className="spinner-sm" /> Tailoring...</>
          ) : (
            '✦ Tailor My Resume'
          )}
        </button>
      </div>
    </div>
  );
}
