'use client';

import { useState } from 'react';
import { SparklesIcon, CloseIcon, RefreshIcon, CheckIcon } from './Icons';

interface EditWithAIModalProps {
  sectionName: string;
  currentText: string;
  isOpen: boolean;
  onClose: () => void;
  onApply: (newText: string) => void;
}

export default function EditWithAIModal({
  sectionName,
  currentText,
  isOpen,
  onClose,
  onApply,
}: EditWithAIModalProps) {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    'Make it more concise (save space)',
    'Emphasize Python, MySQL joins and database relationships',
    'Highlight immediate availability and on-site Noida readiness',
    'Strengthen action verbs and highlight quantified impact',
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const promptToUse = customPrompt || instruction;
    if (!promptToUse.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/edit-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName,
          currentContent: currentText,
          instruction: promptToUse,
          jobTitle: 'Fullstack Developer Intern',
          company: 'Linkup Group Pvt Ltd',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to refine section');

      setPreviewText(data.updatedContent);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Refinement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <SparklesIcon size={15} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Edit with AI</h3>
              <p className="text-[11px] text-slate-500 capitalize">Refining {sectionName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <CloseIcon size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Quick Refinements</label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInstruction(p);
                    handleGenerate(p);
                  }}
                  className="text-[11px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/90 rounded-full px-2.5 py-1 transition-all text-left cursor-pointer"
                >
                  ⚡ {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instruction Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Custom Instruction</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g. Tone down technical jargon / highlight team collaboration..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={loading || !instruction.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                {loading ? <RefreshIcon size={13} className="animate-spin" /> : <SparklesIcon size={13} />}
                <span>Generate</span>
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          {/* Preview Comparison */}
          {previewText && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">AI Suggested Version</span>
              <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs text-slate-800 leading-relaxed font-serif">
                {previewText}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (previewText) onApply(previewText);
              onClose();
            }}
            disabled={!previewText}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <CheckIcon size={13} />
            <span>Apply to Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
}
