'use client';

import { useEffect, useRef } from 'react';

interface ScoreRingProps {
  score: number;        // 0–100
  size?: number;        // diameter in px
  strokeWidth?: number;
  label?: string;
  color?: string;
  animate?: boolean;
}

function getColor(score: number): string {
  if (score >= 75) return '#22c55e';  // green
  if (score >= 50) return '#f59e0b';  // amber
  return '#ef4444';                   // red
}

export default function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
  label,
  color,
  animate = true,
}: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ringColor = color ?? getColor(clampedScore);
  const offset = circumference - (clampedScore / 100) * circumference;

  useEffect(() => {
    if (!animate || !circleRef.current) return;
    const circle = circleRef.current;
    circle.style.strokeDashoffset = String(circumference);
    const raf = requestAnimationFrame(() => {
      circle.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)';
      circle.style.strokeDashoffset = String(offset);
    });
    return () => cancelAnimationFrame(raf);
  }, [clampedScore, circumference, offset, animate]);

  return (
    <div className="score-ring-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: animate ? undefined : 'none', filter: `drop-shadow(0 0 6px ${ringColor}80)` }}
        />
      </svg>
      <div className="score-ring-inner">
        <span className="score-ring-value" style={{ color: ringColor }}>{clampedScore}</span>
        {label && <span className="score-ring-label">{label}</span>}
      </div>
    </div>
  );
}
