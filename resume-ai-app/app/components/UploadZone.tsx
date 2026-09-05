'use client';

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import type { ResumeData } from '@/types/resume';

interface UploadZoneProps {
  onParsed: (resumeText: string, resumeData: ResumeData) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

export default function UploadZone({ onParsed, onError, isLoading, setIsLoading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedName, setParsedName] = useState<string | null>(null);
  const [parsedEmail, setParsedEmail] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFileName(null);
    setParsedName(null);
    setParsedEmail(null);
    setParseError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFile = useCallback(async (file: File) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx|doc)$/i)) {
      setParseError('Only PDF and DOCX files are supported.');
      return;
    }
    setFileName(file.name);
    setParseError(null);
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/parse-resume', { method: 'POST', body: form });

      // Safely parse JSON — server may return HTML on crash
      let data: Record<string, unknown> = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(
          res.ok
            ? 'Server returned an unexpected response. Please try again.'
            : `Server error (${res.status}). Please try again.`
        );
      }

      if (!res.ok) {
        throw new Error((data.error as string) || 'Failed to parse resume');
      }
      setParsedName((data.resumeData as { personal?: { name?: string } })?.personal?.name || null);
      setParsedEmail((data.resumeData as { personal?: { email?: string } })?.personal?.email || null);
      onParsed(data.resumeText as string, data.resumeData as ResumeData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setParseError(msg);
      onError(msg);
      setFileName(null);
    } finally {
      setIsLoading(false);
    }
  }, [onParsed, onError, setIsLoading]);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const hasParsed = parsedName || parsedEmail;

  return (
    <div className="upload-zone-wrapper">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${hasParsed ? 'success' : ''} ${parseError ? 'error' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        aria-label="Upload resume file"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={onChange}
          style={{ display: 'none' }}
          id="resume-file-input"
        />

        {isLoading ? (
          <div className="upload-state">
            <div className="spinner" />
            <p className="upload-label">Parsing your resume with AI...</p>
            <p className="upload-sublabel">{fileName}</p>
          </div>
        ) : hasParsed ? (
          <div className="upload-state">
            <CheckCircle size={40} className="icon-success" />
            <p className="upload-label success-text">{parsedName}</p>
            {parsedEmail && <p className="upload-sublabel">{parsedEmail}</p>}
            <p className="upload-sublabel">{fileName}</p>
          </div>
        ) : parseError ? (
          <div className="upload-state">
            <AlertCircle size={40} className="icon-error" />
            <p className="upload-label error-text">Parse Failed</p>
            <p className="upload-sublabel">{parseError}</p>
            <button className="retry-btn" onClick={(e) => { e.stopPropagation(); reset(); }}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="upload-state">
            <div className={`upload-icon-bg ${isDragging ? 'dragging' : ''}`}>
              {isDragging ? <FileText size={32} className="icon-accent" /> : <Upload size={32} className="icon-accent" />}
            </div>
            <p className="upload-label">Drop your resume here</p>
            <p className="upload-sublabel">or click to browse — PDF or DOCX</p>
          </div>
        )}
      </div>

      {hasParsed && (
        <button className="change-file-btn" onClick={reset} aria-label="Remove and upload different file">
          <X size={14} /> Change file
        </button>
      )}
    </div>
  );
}
