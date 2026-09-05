'use client';

import { useState, useCallback } from 'react';
import { AlertCircle, X, Sparkles, FileSearch, Wand2, CheckCheck } from 'lucide-react';
import UploadZone from './components/UploadZone';
import JobInput from './components/JobInput';
import AnalysisPanel from './components/AnalysisPanel';
import TailoredResumeView from './components/TailoredResumeView';
import LiveTailoringProgress from './components/LiveTailoringProgress';
import Footer from './components/Footer';
import type { ResumeData } from '@/types/resume';
import type { JobData } from '@/types/job';
import type { AnalysisResult, TailoringResult, AppStep } from '@/types/analysis';
import { sampleOriginalResume, sampleTailoredResult } from '@/lib/sample-data';

// ─── Step bar config ──────────────────────────────────────────────────────────
const STEPS: { key: AppStep; label: string; icon: React.ReactNode }[] = [
  { key: 'upload',    label: 'Upload',   icon: <FileSearch size={12} /> },
  { key: 'analyzing', label: 'Analyze',  icon: <Sparkles size={12} /> },
  { key: 'analyzed',  label: 'Results',  icon: <CheckCheck size={12} /> },
  { key: 'tailoring', label: 'Tailor',   icon: <Wand2 size={12} /> },
  { key: 'tailored',  label: 'Done',     icon: <CheckCheck size={12} /> },
];

const STEP_ORDER: AppStep[] = ['upload', 'analyzing', 'analyzed', 'tailoring', 'tailored'];

function stepIndex(step: AppStep) {
  return STEP_ORDER.indexOf(step);
}

// ─── Loading overlay ─────────────────────────────────────────────────────────
function LoadingState({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="loading-state fade-in">
      <div className="pulse-dots">
        <span /><span /><span />
      </div>
      <p className="loading-title">{title}</p>
      <p className="loading-sub">{sub}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [step, setStep] = useState<AppStep>('upload');
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [customDirectives, setCustomDirectives] = useState('');
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [tailoringResult, setTailoringResult] = useState<TailoringResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);

  const handleParsed = useCallback((text: string, data: ResumeData) => {
    setResumeText(text);
    setResumeData(data as ResumeData);
    setError(null);
  }, []);

  const handleParseError = useCallback((msg: string) => {
    setError(msg);
  }, []);

  const canAnalyze =
    resumeData &&
    resumeText &&
    jobDescription.trim().length >= 100 &&
    step === 'upload';

  const handleAnalyze = async () => {
    if (!resumeData || !jobDescription) return;
    setStep('analyzing');
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setJobData(data.jobData);
      setAnalysisResult(data.analysisResult);
      setStep('analyzed');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setStep('upload');
    }
  };

  const handleTailor = async () => {
    if (!resumeData || !jobData || !analysisResult) return;
    setStep('tailoring');
    setError(null);
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobData, analysisResult, customDirectives }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Tailoring failed');
      setTailoringResult(data);
      setStep('tailored');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tailoring failed');
      setStep('analyzed');
    }
  };

  const handleReset = () => {
    setStep('upload');
    setResumeText(null);
    setResumeData(null);
    setJobDescription('');
    setCustomDirectives('');
    setJobData(null);
    setAnalysisResult(null);
    setTailoringResult(null);
    setError(null);
    setIsParsingFile(false);
  };

  const handleLoadDemo = () => {
    setResumeData(sampleOriginalResume);
    setTailoringResult(sampleTailoredResult);
    setStep('tailored');
  };

  const currentStepIdx = stepIndex(step);

  return (
    <div className="app-shell">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="logo">
          <div className="logo-icon">✦</div>
          ResumeAI
          <span className="logo-tag">Beta</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoadDemo}
            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-300 transition-colors cursor-pointer"
          >
            ✦ Sample Tailored Resume
          </button>
          {step !== 'upload' && (
            <button
              className="change-file-btn"
              onClick={handleReset}
              aria-label="Start over"
              style={{ fontSize: '0.82rem' }}
            >
              <X size={13} /> Start Over
            </button>
          )}
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="app-main">

        {/* Step bar */}
        <nav className="step-bar" aria-label="Progress">
          {STEPS.map((s, i) => {
            const idx = i;
            const isDone   = currentStepIdx > idx;
            const isActive = currentStepIdx === idx;
            return (
              <div key={s.key} className="step-item">
                <div className={`step-dot ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <span className={`step-label ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <div className="step-connector" />}
              </div>
            );
          })}
        </nav>

        {/* ── STEP: upload ──────────────────────────────────────────────────── */}
        {step === 'upload' && (
          <div className="fade-in">
            {/* Hero */}
            <div className="hero">
              <div className="hero-badge">
                <Sparkles size={13} /> AI-Powered Resume Tailoring & ATS Optimizer
              </div>
              <h1 className="hero-title">
                Beat the ATS.<br />
                <span className="gradient-text">Land the interview.</span>
              </h1>
              <p className="hero-sub">
                Upload your resume, paste a job description, and tailor every bullet point interactively with live AI, ATS diagnostics, and instant export.
              </p>
            </div>

            {/* Quick Demo CTA Banner */}
            <div className="flex items-center justify-between p-3.5 mb-6 bg-emerald-50/90 border border-emerald-200 rounded-xl shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  ✦
                </span>
                <div>
                  <p className="text-xs font-bold text-emerald-950">
                    Preview Sample Tailored Resume (Linkup Group Fullstack Intern)
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Explore 95 ATS match score, side-by-side diffs, anti-fabrication truth evidence, and instant 2-page export.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLoadDemo}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0"
              >
                <span>View Sample Resume</span>
                <span className="text-emerald-200">→</span>
              </button>
            </div>

            {/* Upload + JD */}
            <div className="two-col">
              <div className="card">
                <p className="section-title-sm">Your Resume</p>
                <UploadZone
                  onParsed={handleParsed}
                  onError={handleParseError}
                  isLoading={isParsingFile}
                  setIsLoading={setIsParsingFile}
                />
              </div>
              <div className="card">
                <p className="section-title-sm">Target Job</p>
                <JobInput
                  value={jobDescription}
                  onChange={setJobDescription}
                  directives={customDirectives}
                  onDirectivesChange={setCustomDirectives}
                  disabled={isParsingFile}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="error-banner" style={{ marginTop: '16px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
                <button onClick={() => setError(null)} aria-label="Dismiss error"><X size={14} /></button>
              </div>
            )}

            {/* Analyze CTA */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <button
                id="analyze-resume-btn"
                className="btn-primary btn-large"
                onClick={handleAnalyze}
                disabled={!canAnalyze || isParsingFile}
              >
                <Sparkles size={17} />
                {isParsingFile ? 'Parsing resume…' : !resumeData ? 'Upload a resume to continue' : jobDescription.trim().length < 100 ? 'Paste a job description (100+ chars)' : 'Analyze My Resume'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: analyzing ───────────────────────────────────────────────── */}
        {step === 'analyzing' && (
          <LoadingState
            title="Analyzing your resume…"
            sub="Gemini AI is extracting job requirements and scoring your resume against the ATS criteria. This takes ~15–30 seconds."
          />
        )}

        {/* ── STEP: analyzed ────────────────────────────────────────────────── */}
        {step === 'analyzed' && analysisResult && (
          <div className="fade-in">
            {error && (
              <div className="error-banner" style={{ marginBottom: '20px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
                <button onClick={() => setError(null)} aria-label="Dismiss error"><X size={14} /></button>
              </div>
            )}
            <AnalysisPanel
              analysis={analysisResult}
              onTailor={handleTailor}
              isTailoring={false}
            />
          </div>
        )}

        {/* ── STEP: tailoring ───────────────────────────────────────────────── */}
        {step === 'tailoring' && (
          <LiveTailoringProgress originalScore={analysisResult?.score?.overall || 74} />
        )}

        {/* ── STEP: tailored ────────────────────────────────────────────────── */}
        {step === 'tailored' && tailoringResult && (
          <div className="fade-in">
            {error && (
              <div className="error-banner" style={{ marginBottom: '20px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
                <button onClick={() => setError(null)} aria-label="Dismiss error"><X size={14} /></button>
              </div>
            )}
            <TailoredResumeView result={tailoringResult} originalResumeData={resumeData || sampleOriginalResume} />
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
