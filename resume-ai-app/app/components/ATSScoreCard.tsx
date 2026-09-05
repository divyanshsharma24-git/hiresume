'use client';

import ScoreRing from './ScoreRing';
import type { ATSScoreBreakdown } from '@/types/analysis';

interface ATSScoreCardProps {
  score: ATSScoreBreakdown;
  label?: string;
  compact?: boolean;
}

const METRICS: { key: keyof ATSScoreBreakdown; label: string }[] = [
  { key: 'skills', label: 'Skills' },
  { key: 'keywords', label: 'Keywords' },
  { key: 'experience', label: 'Experience' },
  { key: 'responsibilities', label: 'Responsibilities' },
  { key: 'qualifications', label: 'Qualifications' },
];

function barColor(v: number) {
  if (v >= 75) return '#22c55e';
  if (v >= 50) return '#f59e0b';
  return '#ef4444';
}

export default function ATSScoreCard({ score, label, compact }: ATSScoreCardProps) {
  return (
    <div className="score-card">
      {label && <p className="score-card-label">{label}</p>}
      <div className="score-card-top">
        <ScoreRing score={score.overall} size={compact ? 100 : 130} strokeWidth={10} label="Overall" />
        <div className="score-metrics">
          {METRICS.map(({ key, label: metricLabel }) => {
            const val = Math.round(score[key]);
            const color = barColor(val);
            return (
              <div key={key} className="metric-row">
                <span className="metric-label">{metricLabel}</span>
                <div className="metric-bar-track">
                  <div
                    className="metric-bar-fill"
                    style={{ width: `${val}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
                  />
                </div>
                <span className="metric-value" style={{ color }}>{val}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
