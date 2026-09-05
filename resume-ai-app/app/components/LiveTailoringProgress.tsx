'use client';

import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, TrendingUp, Lightbulb, Wand2, FileSearch, FileText } from 'lucide-react';

interface LiveTailoringProgressProps {
  originalScore?: number;
}

const TAILORING_STAGES = [
  {
    id: 1,
    icon: FileSearch,
    title: 'Parsing Target Job & Missing Keywords',
    desc: 'Extracting essential skills, required frameworks, and ATS priority keywords...',
  },
  {
    id: 2,
    icon: Wand2,
    title: 'Optimizing Professional Headline',
    desc: 'Aligning candidate title and subheadline with target job seniority...',
  },
  {
    id: 3,
    icon: Lightbulb,
    title: 'Rewriting Executive Summary',
    desc: 'Injecting high-frequency ATS keywords and crafting a compelling narrative...',
  },
  {
    id: 4,
    icon: FileText,
    title: 'Enhancing Work Experience & Bullets',
    desc: 'Applying STAR methodology, front-loading action verbs, and adding measurable impact...',
  },
  {
    id: 5,
    icon: Sparkles,
    title: 'Restructuring Technical Skills & Links',
    desc: 'Categorizing technical skills (Languages, Databases, AI/ML) and preserving hyperlinks...',
  },
  {
    id: 6,
    icon: TrendingUp,
    title: 'Recalculating ATS Score & Generating Document',
    desc: 'Running ATS parser simulation and preparing pixel-perfect PDF & Word exports...',
  },
];

export default function LiveTailoringProgress({ originalScore = 74 }: LiveTailoringProgressProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [displayScore, setDisplayScore] = useState(originalScore);
  const targetScore = Math.min(96, Math.max(88, originalScore + 14));

  useEffect(() => {
    // Progress through the stages realistically over 12-16 seconds while API call finishes
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < TAILORING_STAGES.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Smoothly animate the ATS score ticking upwards in real-time
    const scoreInterval = setInterval(() => {
      setDisplayScore((prev) => {
        if (prev < targetScore) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(scoreInterval);
  }, [targetScore]);

  return (
    <div
      className="live-tailoring-container fade-in"
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '32px 24px',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15)',
      }}
    >
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '14px',
            letterSpacing: '0.5px',
          }}
        >
          <Sparkles size={14} />
          RESUMEAI ENGINE • REAL-TIME RESUME TAILORING
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
          Tailoring Your Resume Live
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Watch every section optimize in real time to match the job requirements and beat the ATS.
        </p>
      </div>

      {/* Live ATS Score Counter Box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '28px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Live Simulated ATS Match Score
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '4px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '-1px' }}>
              {displayScore}%
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                fontSize: '0.85rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <TrendingUp size={14} /> +{Math.max(0, displayScore - originalScore)} pts
            </span>
          </div>
        </div>

        {/* Live status badge */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38bdf8',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <span className="spinner-sm" />
            Optimizing Section {currentStageIndex + 1} of {TAILORING_STAGES.length}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
            Preserving original facts & hyperlinks
          </div>
        </div>
      </div>

      {/* Real-time Stages List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {TAILORING_STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '14px 18px',
                borderRadius: '12px',
                background: isCurrent
                  ? 'rgba(99, 102, 241, 0.12)'
                  : isDone
                  ? 'rgba(30, 41, 59, 0.4)'
                  : 'rgba(15, 23, 42, 0.3)',
                border: isCurrent
                  ? '1px solid rgba(129, 140, 248, 0.4)'
                  : isDone
                  ? '1px solid rgba(34, 197, 94, 0.2)'
                  : '1px solid rgba(51, 65, 85, 0.2)',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ marginTop: '2px' }}>
                {isDone ? (
                  <CheckCircle2 size={20} style={{ color: '#4ade80' }} />
                ) : isCurrent ? (
                  <span className="spinner-sm" style={{ borderColor: '#818cf8', borderTopColor: 'transparent' }} />
                ) : (
                  <Icon size={20} style={{ color: '#64748b', opacity: 0.6 }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: isCurrent ? '#f8fafc' : isDone ? '#e2e8f0' : '#64748b',
                    }}
                  >
                    {stage.title}
                  </span>
                  {isDone && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#4ade80',
                        fontWeight: 600,
                        background: 'rgba(34, 197, 94, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      OPTIMIZED
                    </span>
                  )}
                  {isCurrent && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#818cf8',
                        fontWeight: 600,
                        background: 'rgba(99, 102, 241, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      IN PROGRESS
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: isCurrent ? '#cbd5e1' : isDone ? '#94a3b8' : '#475569',
                    marginTop: '3px',
                    lineHeight: 1.4,
                  }}
                >
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
