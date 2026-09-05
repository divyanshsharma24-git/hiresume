'use client';

import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';

interface JobInputProps {
  value: string;
  onChange: (v: string) => void;
  directives?: string;
  onDirectivesChange?: (v: string) => void;
  disabled?: boolean;
}

const MIN_CHARS = 100;
const MAX_CHARS = 8000;

export default function JobInput({
  value,
  onChange,
  directives = '',
  onDirectivesChange,
  disabled,
}: JobInputProps) {
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDirectives, setShowDirectives] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (directives && directives.trim()) {
      setShowDirectives(true);
    }
  }, [directives]);

  const count = value.length;
  const isReady = count >= MIN_CHARS;

  return (
    <div className={`job-input-wrapper ${focused ? 'focused' : ''}`} suppressHydrationWarning>
      <div className="job-input-header">
        <span className="job-input-label">
          <Briefcase size={15} className="icon-accent" /> Job Description
        </span>
        <span
          className={`char-count ${count > MAX_CHARS ? 'over' : isReady ? 'ready' : ''}`}
          suppressHydrationWarning
        >
          {count.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>
      <textarea
        id="job-description-input"
        className={`job-textarea ${focused ? 'focused' : ''}`}
        placeholder="Paste the full job description here — the more detail, the better the AI tailoring…"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        rows={10}
        aria-label="Job description text"
        suppressHydrationWarning
      />
      <div className="job-input-footer" suppressHydrationWarning>
        {isReady ? (
          <span className="hint ready">✓ Ready to analyze</span>
        ) : (
          <span className="hint">{MIN_CHARS - count} more characters needed</span>
        )}

        {mounted && onDirectivesChange && (
          <button
            type="button"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-medium underline-offset-2 hover:underline"
            onClick={() => setShowDirectives(!showDirectives)}
          >
            {showDirectives ? '▲ Hide Custom Directives' : '✦ Add Custom ATS Directives / Target Notes'}
          </button>
        )}
      </div>

      {mounted && onDirectivesChange && showDirectives && (
        <div className="mt-3 pt-3 border-t border-slate-700/60 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span>🎯 Custom Tailoring Directives & ATS Boost (Optional)</span>
            </label>
            <span className="text-[11px] text-slate-400">Target 90+ ATS score, inject target tech (Next.js, FastAPI, PyTorch, etc.)</span>
          </div>
          <textarea
            className="w-full bg-slate-900/90 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            rows={4}
            placeholder="e.g. Target 95+ ATS score; aggressively inject Next.js, FastAPI, PyTorch, TensorFlow, LangChain, LangGraph; emphasize fullstack REST APIs & AI agent pipelines; highlight immediate joining..."
            value={directives}
            onChange={(e) => onDirectivesChange(e.target.value)}
            disabled={disabled}
            suppressHydrationWarning
          />
        </div>
      )}
    </div>
  );
}
