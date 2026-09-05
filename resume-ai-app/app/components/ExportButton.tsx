'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import type { ResumeData } from '@/types/resume';

interface ExportButtonProps {
  resumeData: ResumeData;
}

export default function ExportButton({ resumeData }: ExportButtonProps) {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExportPdf = async () => {
    setLoadingPdf(true);
    setError(null);
    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to export PDF');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const name = resumeData.personal?.name?.replace(/\s+/g, '_') || 'resume';
      a.download = `${name}_tailored.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleExportDocx = async () => {
    setLoadingDocx(true);
    setError(null);
    try {
      const res = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to export DOCX');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const name = resumeData.personal?.name?.replace(/\s+/g, '_') || 'resume';
      a.download = `${name}_tailored.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'DOCX export failed');
    } finally {
      setLoadingDocx(false);
    }
  };

  return (
    <div className="export-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          id="export-pdf-btn"
          className="btn-primary"
          onClick={handleExportPdf}
          disabled={loadingPdf || loadingDocx}
          aria-label="Export tailored resume as PDF"
        >
          {loadingPdf ? (
            <><span className="spinner-sm" /> Exporting PDF...</>
          ) : (
            <><Download size={15} /> Export PDF</>
          )}
        </button>

        <button
          id="export-docx-btn"
          className="btn-secondary"
          onClick={handleExportDocx}
          disabled={loadingPdf || loadingDocx}
          aria-label="Export tailored resume as Word document"
          style={{
            background: 'rgba(37, 99, 235, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#93c5fd',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
          }}
        >
          {loadingDocx ? (
            <><span className="spinner-sm" /> Exporting Word...</>
          ) : (
            <><Download size={15} /> Export Word (.docx)</>
          )}
        </button>
      </div>
      {error && <p className="export-error">{error}</p>}
    </div>
  );
}
