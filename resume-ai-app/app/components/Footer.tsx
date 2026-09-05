'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '60px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(2, 6, 23, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        padding: '36px 24px 32px 24px',
        color: '#94a3b8',
        fontSize: '0.85rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {/* Badges row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              padding: '3px 10px',
              borderRadius: '9999px',
            }}
          >
            IIT Jodhpur · AIDE
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '3px 10px',
              borderRadius: '9999px',
            }}
          >
            Production ATS Optimizer
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '3px 10px',
              borderRadius: '9999px',
            }}
          >
            Multi-Model AI Failover
          </span>
        </div>

        {/* Primary Branding Text */}
        <div style={{ fontSize: '0.92rem', color: '#e2e8f0', fontWeight: 500, lineHeight: 1.6, maxWidth: '800px' }}>
          Made by <strong style={{ color: '#ffffff', fontWeight: 700 }}>Divyansh Sharma</strong> · Department of Artificial Intelligence and Data Science Engineering (AIDE) · <span style={{ color: '#60a5fa', fontWeight: 600 }}>IIT Jodhpur</span>
        </div>

        {/* Links Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '16px', fontSize: '0.82rem' }}>
          <a
            href="https://github.com/divyanshsharma24-git"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            GitHub
          </a>
          <span style={{ color: '#334155' }}>•</span>
          <a
            href="https://www.linkedin.com/in/divyansh-sharma-a92889340/"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            LinkedIn
          </a>
          <span style={{ color: '#334155' }}>•</span>
          <a
            href="https://divyansh-portfolio-portfolio.vercel.app/"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            Portfolio
          </a>
          <span style={{ color: '#334155' }}>•</span>
          <a
            href="mailto:b25bs1093@iitj.ac.in"
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            b25bs1093@iitj.ac.in
          </a>
        </div>

        {/* Copyright notice */}
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
          © {new Date().getFullYear()} ResumeAI. Designed for Ivy League & Silicon Valley ATS standards.
        </div>
      </div>
    </footer>
  );
}
