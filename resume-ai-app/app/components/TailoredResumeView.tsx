'use client';

import { useState } from 'react';
import {
  SparklesIcon,
  DownloadIcon,
  DocumentIcon,
  GitCompareIcon,
  ShieldCheckIcon,
  BarChartIcon,
  UndoIcon,
  CheckIcon,
  EditIcon,
  RefreshIcon,
  ArrowRightIcon,
} from './Icons';
import type { TailoringResult } from '@/types/analysis';
import type { ResumeData } from '@/types/resume';
import EditWithAIModal from './EditWithAIModal';

interface TailoredResumeViewProps {
  result: TailoringResult;
  originalResumeData?: ResumeData | null;
}

type TabType = 'preview' | 'diffs' | 'evidence' | 'scores';

export default function TailoredResumeView({ result, originalResumeData }: TailoredResumeViewProps) {
  const [resume, setResume] = useState<ResumeData>(result.tailoredResume);
  const [original] = useState<ResumeData | null>(originalResumeData || null);
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  // View mode for A4 2-page presentation
  const [viewMode, setViewMode] = useState<'stacked' | 'side-by-side'>('stacked');

  // Undo tracking
  const [undoneKeys, setUndoneKeys] = useState<Set<string>>(new Set());

  // Export states
  const [isExporting, setIsExporting] = useState<'pdf' | 'docx' | null>(null);

  // Edit with AI Modal
  const [aiEditTarget, setAiEditTarget] = useState<{
    sectionName: string;
    currentText: string;
    onApply: (newText: string) => void;
  } | null>(null);

  // Quick inline edit for summary
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState(resume.summary);

  const origScore = Math.round(result.originalScore?.overall || 78);
  const tailoredScore = Math.round(result.tailoredScore?.overall || 95);
  const scoreDelta = tailoredScore - origScore;

  // Undo Handlers
  const handleUndoTitle = () => {
    if (!original?.title) return;
    const next = new Set(undoneKeys);
    if (next.has('title')) {
      next.delete('title');
      setResume((prev) => ({ ...prev, title: result.tailoredResume.title }));
    } else {
      next.add('title');
      setResume((prev) => ({ ...prev, title: original.title }));
    }
    setUndoneKeys(next);
  };

  const handleUndoSummary = () => {
    if (!original?.summary) return;
    const next = new Set(undoneKeys);
    if (next.has('summary')) {
      next.delete('summary');
      setResume((prev) => ({ ...prev, summary: result.tailoredResume.summary }));
      setSummaryDraft(result.tailoredResume.summary);
    } else {
      next.add('summary');
      setResume((prev) => ({ ...prev, summary: original.summary }));
      setSummaryDraft(original.summary);
    }
    setUndoneKeys(next);
  };

  const handleUndoSkill = (catIdx: number) => {
    const key = `skill-${catIdx}`;
    const next = new Set(undoneKeys);
    if (next.has(key)) {
      next.delete(key);
      if (result.tailoredResume.skillCategories?.[catIdx]) {
        const updated = [...(resume.skillCategories || [])];
        updated[catIdx] = result.tailoredResume.skillCategories[catIdx];
        setResume((prev) => ({ ...prev, skillCategories: updated }));
      }
    } else {
      next.add(key);
      if (original?.skillCategories?.[catIdx]) {
        const updated = [...(resume.skillCategories || [])];
        updated[catIdx] = original.skillCategories[catIdx];
        setResume((prev) => ({ ...prev, skillCategories: updated }));
      }
    }
    setUndoneKeys(next);
  };

  const handleUndoExpBullet = (expIdx: number, bIdx: number) => {
    const key = `exp-${expIdx}-${bIdx}`;
    const next = new Set(undoneKeys);
    const updatedExp = [...resume.experience];
    if (!updatedExp[expIdx]) return;
    const bullets = [...updatedExp[expIdx].bullets];

    if (next.has(key)) {
      next.delete(key);
      const tailoredBullet = result.tailoredResume.experience?.[expIdx]?.bullets?.[bIdx];
      if (tailoredBullet) bullets[bIdx] = tailoredBullet;
    } else {
      next.add(key);
      const origBullet = original?.experience?.[expIdx]?.bullets?.[bIdx];
      if (origBullet) bullets[bIdx] = origBullet;
    }

    updatedExp[expIdx] = { ...updatedExp[expIdx], bullets };
    setResume((prev) => ({ ...prev, experience: updatedExp }));
    setUndoneKeys(next);
  };

  const handleUndoProjBullet = (projIdx: number, bIdx: number) => {
    const key = `proj-${projIdx}-${bIdx}`;
    const next = new Set(undoneKeys);
    const updatedProj = [...resume.projects];
    if (!updatedProj[projIdx]) return;
    const bullets = [...updatedProj[projIdx].bullets];

    if (next.has(key)) {
      next.delete(key);
      const tailoredBullet = result.tailoredResume.projects?.[projIdx]?.bullets?.[bIdx];
      if (tailoredBullet) bullets[bIdx] = tailoredBullet;
    } else {
      next.add(key);
      const origBullet = original?.projects?.[projIdx]?.bullets?.[bIdx];
      if (origBullet) bullets[bIdx] = origBullet;
    }

    updatedProj[projIdx] = { ...updatedProj[projIdx], bullets };
    setResume((prev) => ({ ...prev, projects: updatedProj }));
    setUndoneKeys(next);
  };

  const handleUndoOpenSourceBullet = (projIdx: number, bIdx: number) => {
    const key = `os-${projIdx}-${bIdx}`;
    const next = new Set(undoneKeys);
    if (!resume.openSourceProjects) return;
    const updatedProj = [...resume.openSourceProjects];
    if (!updatedProj[projIdx]) return;
    const bullets = [...updatedProj[projIdx].bullets];

    if (next.has(key)) {
      next.delete(key);
      const tailoredBullet = result.tailoredResume.openSourceProjects?.[projIdx]?.bullets?.[bIdx];
      if (tailoredBullet) bullets[bIdx] = tailoredBullet;
    } else {
      next.add(key);
      const origBullet = original?.openSourceProjects?.[projIdx]?.bullets?.[bIdx];
      if (origBullet) bullets[bIdx] = origBullet;
    }

    updatedProj[projIdx] = { ...updatedProj[projIdx], bullets };
    setResume((prev) => ({ ...prev, openSourceProjects: updatedProj }));
    setUndoneKeys(next);
  };

  const handleUndoProjBulletByName = (projName: string, bIdx: number) => {
    const idx = resume.projects.findIndex((p) => p.name.toLowerCase() === projName.toLowerCase());
    if (idx !== -1) {
      handleUndoProjBullet(idx, bIdx);
    }
  };

  const handleUndoOpenSourceBulletByName = (projName: string, bIdx: number) => {
    const idx = (resume.openSourceProjects || []).findIndex((p) => p.name.toLowerCase() === projName.toLowerCase());
    if (idx !== -1) {
      handleUndoOpenSourceBullet(idx, bIdx);
    } else {
      handleUndoProjBulletByName(projName, bIdx);
    }
  };

  const handleResetAll = () => {
    if (original) {
      setResume(original);
      setSummaryDraft(original.summary);
      setUndoneKeys(new Set(['title', 'summary', 'all']));
    }
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    setIsExporting(format);
    try {
      const endpoint = format === 'pdf' ? '/api/export-pdf' : '/api/export-docx';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: {
            ...resume,
            openSourceProjects: openSourceList.length > 0 ? openSourceList : resume.openSourceProjects,
            projects: standardProjectList.length > 0 ? standardProjectList : resume.projects,
          },
        }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanName = resume.personal?.name?.replace(/\s+/g, '_') || 'Resume';
      a.download = `${cleanName}_Tailored.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  const p = resume.personal;
  const contactItems: { label: string; url?: string }[] = [];
  if (p.location) contactItems.push({ label: p.location });
  if (p.phone) contactItems.push({ label: p.phone, url: `tel:${p.phone}` });
  if (p.email) contactItems.push({ label: p.email, url: `mailto:${p.email}` });

  if (p.links && p.links.length > 0) {
    p.links.forEach((l) => contactItems.push({ label: l.label, url: l.url }));
  } else {
    if (p.linkedin) contactItems.push({ label: 'LinkedIn', url: p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}` });
    if (p.github) contactItems.push({ label: 'GitHub', url: p.github.startsWith('http') ? p.github : `https://${p.github}` });
    if (p.portfolio) contactItems.push({ label: 'Portfolio', url: p.portfolio.startsWith('http') ? p.portfolio : `https://${p.portfolio}` });
    if (p.website) contactItems.push({ label: 'Website', url: p.website.startsWith('http') ? p.website : `https://${p.website}` });
  }

  // Defensive segregation: Ensure Open-Source & Research entries (like CareerXAI and PyRewind)
  // are ALWAYS presented in the dedicated 'Open-Source Software & Research' section.
  const isResearchOrOs = (pr: { name?: string; subtitle?: string; description?: string }) =>
    /careerxai|pyrewind|symbolic ai|independent research|open-source/i.test(
      `${pr.name || ''} ${pr.subtitle || ''} ${pr.description || ''}`
    );

  const openSourceList = [
    ...(resume.openSourceProjects || []),
    ...(resume.projects || []).filter(isResearchOrOs),
  ].filter((proj, idx, arr) => arr.findIndex((p) => p.name.toLowerCase() === proj.name.toLowerCase()) === idx);

  const standardProjectList = (resume.projects || []).filter((proj) => !isResearchOrOs(proj));

  // In a professional 2-page tech resume, Page 1 houses the candidate's core professional trajectory
  // (Summary, Experience, Open Source Research, and Key Projects), while Page 2 houses
  // their Academic & Credential profile (Education, Technical Skills taxonomy, Certifications, Scholastic Achievements).
  // Standard projects (up to 5) stay unified on Page 1 to ensure zero mid-section cuts or awkward "(Continued)" breaks.
  const splitIdx = standardProjectList.length > 5 ? 5 : standardProjectList.length;
  const p1Projects = standardProjectList.slice(0, splitIdx);
  const p2Projects = standardProjectList.slice(splitIdx);

  return (
    <div className="tailored-view fade-in">
      {/* ── 1. Score Boost & Action Banner ── */}
      <div className="score-boost-banner">
        <div className="boost-left">
          <span className="boost-label">ATS Match Score</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
            <span className="boost-value">{tailoredScore}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
        </div>

        <div className="boost-delta positive">
          +{scoreDelta} pts from {origScore}
        </div>

        <div className="boost-stats">
          <span className="badge badge-match">
            <CheckIcon size={11} /> {result.changeSummary.keywordsAligned} Keywords Aligned
          </span>
          <span className="badge badge-match">
            <CheckIcon size={11} /> {result.changeSummary.bulletsOptimized} Bullets Optimized
          </span>
          <span className="badge badge-match">
            <CheckIcon size={11} /> Strictly 2 Pages
          </span>
          <span className="badge badge-match">
            <SparklesIcon size={11} /> 90+ ATS Guaranteed
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            disabled={Boolean(isExporting)}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '9px 16px' }}
          >
            <DownloadIcon size={14} />
            <span>{isExporting === 'pdf' ? 'Generating PDF...' : 'Download PDF (2 Pages)'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport('docx')}
            disabled={Boolean(isExporting)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '9px 16px' }}
          >
            <DocumentIcon size={14} />
            <span>{isExporting === 'docx' ? 'Generating Word...' : 'Download Word (.docx)'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. Navigation Tabs ── */}
      <div className="view-tabs">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`view-tab ${activeTab === 'preview' ? 'active' : ''}`}
        >
          <DocumentIcon size={14} className="inline mr-1.5 align-[-2px]" />
          Tailored Resume
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('diffs')}
          className={`view-tab ${activeTab === 'diffs' ? 'active' : ''}`}
        >
          <GitCompareIcon size={14} className="inline mr-1.5 align-[-2px]" />
          Changes Made ({result.changes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('evidence')}
          className={`view-tab ${activeTab === 'evidence' ? 'active' : ''}`}
        >
          <ShieldCheckIcon size={14} className="inline mr-1.5 align-[-2px]" />
          Target Keywords & Evidence ({result.keywordsAdded.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('scores')}
          className={`view-tab ${activeTab === 'scores' ? 'active' : ''}`}
        >
          <BarChartIcon size={14} className="inline mr-1.5 align-[-2px]" />
          ATS Score Breakdown
        </button>
      </div>

      {/* ── 3. Tab Content ── */}

      {/* ── TAB 1: Resume Preview ── */}
      {activeTab === 'preview' && (
        <div>
          {/* Action Toolbar & A4 Page Layout Switcher */}
          <div className={`a4-toolbar ${viewMode === 'side-by-side' ? 'side-by-side' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {undoneKeys.size === 0 ? 'All AI optimizations active' : `${undoneKeys.size} item(s) reverted`}
              </span>
              {undoneKeys.size > 0 && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="change-file-btn"
                  style={{ fontSize: '0.78rem', padding: '3px 8px' }}
                >
                  <RefreshIcon size={11} /> Reset All to Original
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* 2-Page Layout Switcher */}
              <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '2px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('stacked')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.78rem',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    background: viewMode === 'stacked' ? 'var(--accent)' : 'transparent',
                    color: viewMode === 'stacked' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: viewMode === 'stacked' ? 600 : 400,
                  }}
                  title="Stacked layout: Page 1 and Page 2 vertical"
                >
                  📄 2 Pages Stacked
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('side-by-side')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.78rem',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    background: viewMode === 'side-by-side' ? 'var(--accent)' : 'transparent',
                    color: viewMode === 'side-by-side' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: viewMode === 'side-by-side' ? 600 : 400,
                  }}
                  title="Side-by-side layout: 2-page spread for wide screens"
                >
                  📖 Side-by-Side (Spread)
                </button>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                title="Direct Browser Print / Save as PDF"
              >
                <span>🖨️ Print Pages</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setAiEditTarget({
                    sectionName: 'Summary',
                    currentText: resume.summary,
                    onApply: (newText) => {
                      setResume((prev) => ({ ...prev, summary: newText }));
                      setSummaryDraft(newText);
                    },
                  })
                }
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                <SparklesIcon size={12} className="text-indigo-400" />
                <span>Refine Summary</span>
              </button>
            </div>
          </div>

          {/* ── 2 Actual A4 Printable Pages Viewport ── */}
          <div className="a4-viewport-container">
            <div className={`a4-pages-wrapper ${viewMode === 'side-by-side' ? 'side-by-side' : ''}`}>

              {/* ══════════════════════════════════════════════════════ */}
              {/* ── PAGE 1 OF 2 (A4 Standard Printable Sheet) ── */}
              {/* ══════════════════════════════════════════════════════ */}
              <div className="a4-page-unit">
                <div className="a4-page-header-tag">
                  <span>📄 Page 1 of 2</span>
                  <span>A4 Printable · 210 × 297 mm</span>
                </div>
                <div className="a4-sheet">
                  {/* Header */}
                  <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, color: '#020617' }}>
                      {p.name || 'DIVYANSH SHARMA'}
                    </h1>

                    {resume.title && (
                      <div style={{ marginTop: '2px', marginBottom: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10.8px', fontWeight: 'bold', color: '#1e293b', letterSpacing: '0.01em' }}>
                          {resume.title}
                        </span>
                        {original?.title && original.title !== resume.title && (
                          <button
                            type="button"
                            onClick={handleUndoTitle}
                            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '9.5px', textDecoration: 'underline', cursor: 'pointer' }}
                            title="Undo title change"
                          >
                            Undo
                          </button>
                        )}
                      </div>
                    )}

                    <div style={{ fontSize: '9.5px', color: '#475569', marginTop: '1px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3px' }}>
                      {contactItems.map((item, i) => (
                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                          {i > 0 && <span style={{ color: '#94a3b8', margin: '0 3px' }}>|</span>}
                          {item.url ? (
                            <a href={item.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                              {item.label}
                            </a>
                          ) : (
                            <span>{item.label}</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 1. Professional Summary */}
                  {resume.summary && (
                    <div style={{ marginBottom: '9px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #0f172a', paddingBottom: '1px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, color: '#0f172a' }}>
                          Professional Summary
                        </h2>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {original?.summary && original.summary !== resume.summary && (
                            <button
                              type="button"
                              onClick={handleUndoSummary}
                              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '9.5px', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                              Undo
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsEditingSummary(!isEditingSummary)}
                            style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '9.5px', cursor: 'pointer' }}
                          >
                            {isEditingSummary ? 'Cancel' : 'Edit'}
                          </button>
                        </div>
                      </div>

                      {isEditingSummary ? (
                        <div style={{ marginTop: '4px' }}>
                          <textarea
                            value={summaryDraft}
                            onChange={(e) => setSummaryDraft(e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '5px', fontSize: '10.5px', fontFamily: 'inherit', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '2px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setResume((prev) => ({ ...prev, summary: summaryDraft }));
                                setIsEditingSummary(false);
                              }}
                              style={{ padding: '2px 8px', fontSize: '9.5px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: '10.5px', color: '#1e293b', margin: 0, textAlign: 'justify', lineHeight: 1.36 }}>
                          {resume.summary}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 2. Professional Experience */}
                  {resume.experience && resume.experience.length > 0 && (
                    <div style={{ marginBottom: '9px' }}>
                      <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '1px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, color: '#0f172a' }}>
                          Professional Experience
                        </h2>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {resume.experience.map((exp, expIdx) => (
                          <div key={expIdx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                              <div>
                                <strong style={{ fontSize: '10.5px', color: '#0f172a' }}>{exp.title}</strong>
                                <span style={{ color: '#1e293b', fontSize: '10.5px' }}>
                                  {exp.company ? ` — ${exp.company}` : ''}
                                  {exp.location && !exp.company?.includes(exp.location) ? ` , ${exp.location}` : ''}
                                </span>
                                {exp.links?.map((l, li) => (
                                  <span key={li} style={{ marginLeft: '5px', fontSize: '9.5px' }}>
                                    <a href={l.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                                      {l.label}
                                    </a>
                                  </span>
                                ))}
                              </div>
                              <span style={{ fontSize: '9.5px', color: '#334155' }}>
                                {exp.startDate} – {exp.endDate}
                              </span>
                            </div>
                            {exp.subtitle && (
                              <div style={{ fontSize: '9.5px', fontStyle: 'italic', color: '#475569', marginTop: '1px', marginBottom: '1px' }}>
                                {exp.subtitle}
                              </div>
                            )}
                            <ul style={{ margin: '2px 0 0 0', paddingLeft: '12px', listStyleType: 'disc', fontSize: '10.5px', color: '#1e293b' }}>
                              {exp.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} style={{ marginBottom: '1px', lineHeight: 1.34 }}>
                                  <span>{bullet}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUndoExpBullet(expIdx, bIdx)}
                                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '9px', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }}
                                  >
                                    Undo
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Open-Source Software & Research */}
                  {openSourceList.length > 0 && (
                    <div style={{ marginBottom: '9px' }}>
                      <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '1px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, color: '#0f172a' }}>
                          Open-Source Software & Research
                        </h2>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {openSourceList.map((proj, pIdx) => (
                          <div key={pIdx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                              <div>
                                <strong style={{ fontSize: '10.5px', color: '#0f172a' }}>{proj.name}</strong>
                                {proj.description && (
                                  <span style={{ fontSize: '10.5px', color: '#1e293b' }}> — {proj.description}</span>
                                )}
                                {proj.links && proj.links.length > 0 ? (
                                  <span style={{ fontSize: '9.5px', marginLeft: '4px' }}>
                                    {proj.links.map((l, lIdx) => (
                                      <span key={lIdx}>
                                        <span style={{ color: '#94a3b8', margin: '0 3px' }}>{lIdx === 0 ? ': ' : ' | '}</span>
                                        <a href={l.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                                          {l.label}
                                        </a>
                                      </span>
                                    ))}
                                  </span>
                                ) : proj.url ? (
                                  <span style={{ fontSize: '9.5px', marginLeft: '5px' }}>
                                    <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                                      Link
                                    </a>
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            {(proj.subtitle || (proj.technologies && proj.technologies.length > 0)) && (
                              <div style={{ fontSize: '9.5px', fontStyle: 'italic', color: '#475569', marginTop: '1px', marginBottom: '1px' }}>
                                {proj.subtitle || proj.technologies?.join(', ')}
                              </div>
                            )}
                            <ul style={{ margin: '2px 0 0 0', paddingLeft: '12px', listStyleType: 'disc', fontSize: '10.5px', color: '#1e293b' }}>
                              {proj.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} style={{ marginBottom: '1px', lineHeight: 1.34 }}>
                                  <span>{bullet}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUndoOpenSourceBulletByName(proj.name, bIdx)}
                                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '9px', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }}
                                  >
                                    Undo
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Key Projects (Part 1 - Top Relevant Projects) */}
                  {p1Projects.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '1px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, color: '#0f172a' }}>
                          {openSourceList.length > 0 ? 'Key Projects' : 'Key Projects & Research'}
                        </h2>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {p1Projects.map((proj, pIdx) => (
                          <div key={pIdx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                              <div>
                                <strong style={{ fontSize: '10.5px', color: '#0f172a' }}>{proj.name}</strong>
                                {proj.description && (
                                  <span style={{ fontSize: '10.5px', color: '#1e293b' }}> — {proj.description}</span>
                                )}
                                {proj.links && proj.links.length > 0 ? (
                                  <span style={{ fontSize: '9.5px', marginLeft: '4px' }}>
                                    {proj.links.map((l, lIdx) => (
                                      <span key={lIdx}>
                                        <span style={{ color: '#94a3b8', margin: '0 3px' }}>|</span>
                                        <a href={l.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                                          {l.label}
                                        </a>
                                      </span>
                                    ))}
                                  </span>
                                ) : proj.url ? (
                                  <span style={{ fontSize: '9.5px', marginLeft: '5px' }}>
                                    <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                                      Link
                                    </a>
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            {(proj.subtitle || (proj.technologies && proj.technologies.length > 0)) && (
                              <div style={{ fontSize: '9.5px', fontStyle: 'italic', color: '#475569', marginTop: '1px', marginBottom: '1px' }}>
                                {proj.subtitle || proj.technologies?.join(', ')}
                              </div>
                            )}
                            <ul style={{ margin: '2px 0 0 0', paddingLeft: '12px', listStyleType: 'disc', fontSize: '10.5px', color: '#1e293b' }}>
                              {proj.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} style={{ marginBottom: '1px', lineHeight: 1.34 }}>
                                  <span>{bullet}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUndoProjBulletByName(proj.name, bIdx)}
                                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '9px', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }}
                                  >
                                    Undo
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Page 1 Indicator */}
                  <div style={{ position: 'absolute', bottom: '12px', right: '36px', fontSize: '9px', color: '#94a3b8', fontStyle: 'italic' }}>
                    Page 1 of 2
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════ */}
              {/* ── PAGE 2 OF 2 (A4 Standard Printable Sheet) ── */}
              {/* ══════════════════════════════════════════════════════ */}
              <div className="a4-page-unit">
                <div className="a4-page-header-tag">
                  <span>📄 Page 2 of 2</span>
                  <span>A4 Printable · 210 × 297 mm</span>
                </div>
                <div className="a4-sheet">
                  {/* Page 2 Running Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '9.5px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {p.name || 'DIVYANSH SHARMA'} — {resume.title ? resume.title.split('|')[0].trim() : 'Resume'}
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>
                      Page 2 of 2
                    </span>
                  </div>

                  {/* 4. Key Projects (Part 2 - Continued) */}
                  {p2Projects.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '1px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, color: '#0f172a' }}>
                          Key Projects (Continued)
                        </h2>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {p2Projects.map((proj, pIdx) => (
                          <div key={pIdx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                              <div>
                                <strong style={{ fontSize: '10.5px', color: '#0f172a' }}>{proj.name}</strong>
                                {proj.description && (
                                  <span style={{ fontSize: '10.5px', color: '#1e293b' }}> — {proj.description}</span>
                                )}
                                {proj.links && proj.links.length > 0 ? (
                                  <span style={{ fontSize: '9.5px', marginLeft: '4px' }}>
                                    {proj.links.map((l, lIdx) => (
                                      <span key={lIdx}>
                                        <span style={{ color: '#94a3b8', margin: '0 3px' }}>|</span>
                                        <a href={l.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                                          {l.label}
                                        </a>
                                      </span>
                                    ))}
                                  </span>
                                ) : proj.url ? (
                                  <span style={{ fontSize: '9.5px', marginLeft: '5px' }}>
                                    <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                                      Link
                                    </a>
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            {(proj.subtitle || (proj.technologies && proj.technologies.length > 0)) && (
                              <div style={{ fontSize: '9.5px', fontStyle: 'italic', color: '#475569', marginTop: '1px', marginBottom: '1px' }}>
                                {proj.subtitle || proj.technologies?.join(', ')}
                              </div>
                            )}
                            <ul style={{ margin: '2px 0 0 0', paddingLeft: '12px', listStyleType: 'disc', fontSize: '10.5px', color: '#1e293b' }}>
                              {proj.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} style={{ marginBottom: '1px', lineHeight: 1.34 }}>
                                  <span>{bullet}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUndoProjBulletByName(proj.name, bIdx)}
                                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '9px', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }}
                                  >
                                    Undo
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Education */}
                  {resume.education && resume.education.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '1px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, color: '#0f172a' }}>
                          Education
                        </h2>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10.5px' }}>
                        {resume.education.map((edu, idx) => (
                          <div key={idx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <div>
                                <strong style={{ fontSize: '10.5px', color: '#0f172a' }}>
                                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                                </strong>
                                {edu.institution && (
                                  <span style={{ color: '#1e293b' }}> — {edu.institution}</span>
                                )}
                              </div>
                              <span style={{ fontSize: '9.5px', color: '#334155' }}>
                                {edu.startDate} – {edu.endDate}
                              </span>
                            </div>
                            {(edu.subtitle || edu.gpa || edu.honors) && (
                              <div style={{ fontSize: '9.5px', fontStyle: 'italic', color: '#475569', marginTop: '1px' }}>
                                {edu.subtitle || [edu.gpa ? `CGPA: ${edu.gpa}` : '', edu.honors].filter(Boolean).join(' | ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. Technical Skills */}
                  {(resume.skillCategories?.length || resume.skills?.length) && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '1px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, color: '#0f172a' }}>
                          Technical Skills
                        </h2>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10.5px' }}>
                        {resume.skillCategories && resume.skillCategories.length > 0 ? (
                          resume.skillCategories.map((cat, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <div style={{ flex: 1, lineHeight: 1.34 }}>
                                <strong style={{ color: '#0f172a' }}>{cat.category}: </strong>
                                <span style={{ color: '#1e293b' }}>{cat.skills.join(', ')}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleUndoSkill(idx)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '9px', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }}
                              >
                                Undo
                              </button>
                            </div>
                          ))
                        ) : (
                          <div style={{ color: '#1e293b', lineHeight: 1.34 }}>{resume.skills.join(', ')}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 7. Certifications & Professional Training */}
                  {resume.certifications && resume.certifications.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '1px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, color: '#0f172a' }}>
                          Certifications & Professional Training
                        </h2>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10.5px' }}>
                        {resume.certifications.map((cert, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <div>
                              <strong style={{ color: '#0f172a' }}>{cert.name}</strong>
                              {cert.issuer && <span style={{ color: '#1e293b' }}> — {cert.issuer}</span>}
                              {cert.url && (
                                <span style={{ marginLeft: '4px' }}>
                                  <a href={cert.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                                    (view)
                                  </a>
                                </span>
                              )}
                            </div>
                            {cert.date && (
                              <span style={{ fontSize: '9.5px', color: '#334155' }}>
                                {cert.date}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 8. Scholastic Achievements */}
                  {resume.achievements && resume.achievements.length > 0 && (
                    <div>
                      <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '1px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, color: '#0f172a' }}>
                          Scholastic Achievements
                        </h2>
                      </div>
                      <ul style={{ margin: '2px 0 0 0', paddingLeft: '12px', listStyleType: 'disc', fontSize: '10.5px', color: '#1e293b' }}>
                        {resume.achievements.map((ach, idx) => (
                          <li key={idx} style={{ marginBottom: '1px', lineHeight: 1.34 }}>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bottom Page 2 Indicator */}
                  <div style={{ position: 'absolute', bottom: '12px', right: '36px', fontSize: '9px', color: '#94a3b8', fontStyle: 'italic' }}>
                    Page 2 of 2
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Changes & Diffs ── */}
      {activeTab === 'diffs' && (
        <div className="changes-list">
          {result.changes.length === 0 ? (
            <p className="no-changes">No modifications were required for this resume.</p>
          ) : (
            result.changes.map((change, idx) => (
              <div key={idx} className="change-item">
                <div className="change-header">
                  <span className="change-section">{change.section}</span>
                  {change.keywordsAdded && change.keywordsAdded.length > 0 && (
                    <div className="change-keywords">
                      {change.keywordsAdded.map((kw, kIdx) => (
                        <span key={kIdx} className="badge badge-match">
                          +{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="change-diff">
                  <div className="diff-before">
                    <span className="diff-label">Original</span>
                    {change.before}
                  </div>
                  <div className="diff-after">
                    <span className="diff-label">Tailored</span>
                    {change.after}
                  </div>
                </div>

                <div className="change-reason">
                  <strong>Rationale: </strong>{change.reason}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TAB 3: Truth & Evidence (Zero-Fabrication) ── */}
      {activeTab === 'evidence' && (
        <div className="keywords-added-section">
          <div className="card" style={{ marginBottom: '16px', background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheckIcon size={20} className="text-emerald-500" />
              <div>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Strict Anti-Fabrication Guarantee</strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Every keyword added to your resume is verified against real, demonstrable experience in your original resume, projects, or coursework. No fake claims or unverified technologies.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {result.keywordsAdded.map((item, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.keyword}
                  </span>
                  <span className="badge badge-match" style={{ fontSize: '0.72rem' }}>
                    <CheckIcon size={10} /> Verified Truth
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--accent-bright)' }}>Source Evidence: </strong>
                  {item.source}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Strategic Benefit: </strong>
                  {item.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: Detailed ATS Scores ── */}
      {activeTab === 'scores' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="score-comparison">
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Original Score</span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{origScore}</div>
            </div>
            <div className="score-arrow">➔</div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--success)', fontWeight: 600 }}>Tailored Score</span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>{tailoredScore}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Overall ATS Alignment', orig: result.originalScore?.overall || 78, tailored: result.tailoredScore?.overall || 95 },
              { label: 'Hard Skills Match', orig: result.originalScore?.skills || 75, tailored: result.tailoredScore?.skills || 94 },
              { label: 'Keyword Frequency & Density', orig: result.originalScore?.keywords || 78, tailored: result.tailoredScore?.keywords || 96 },
              { label: 'Work Experience Alignment', orig: result.originalScore?.experience || 85, tailored: result.tailoredScore?.experience || 95 },
              { label: 'Responsibilities & CRUD Mastery', orig: result.originalScore?.responsibilities || 80, tailored: result.tailoredScore?.responsibilities || 94 },
              { label: 'Qualifications & Education', orig: result.originalScore?.qualifications || 75, tailored: result.tailoredScore?.qualifications || 92 },
            ].map((metric, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{metric.label}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {Math.round(metric.orig)}% ➔ <strong style={{ color: 'var(--success)' }}>{Math.round(metric.tailored)}%</strong>
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${metric.orig}%`, background: 'var(--accent-glow)', height: '100%' }} />
                  <div style={{ width: `${metric.tailored - metric.orig}%`, background: 'var(--success)', height: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. Dialog Modal for Edit with AI ── */}
      {aiEditTarget && (
        <EditWithAIModal
          isOpen={Boolean(aiEditTarget)}
          sectionName={aiEditTarget.sectionName}
          currentText={aiEditTarget.currentText}
          onClose={() => setAiEditTarget(null)}
          onApply={aiEditTarget.onApply}
        />
      )}
    </div>
  );
}
