'use client';

import { useState } from 'react';
import type { KeywordMatch } from '@/types/analysis';

interface KeywordBadgesProps {
  matching: KeywordMatch[];
  missing: KeywordMatch[];
}

type Filter = 'all' | 'matching' | 'missing' | 'CRITICAL' | 'IMPORTANT' | 'OPTIONAL';

export default function KeywordBadges({ matching, missing }: KeywordBadgesProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const filterBtns: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'matching', label: `✓ Matching (${matching.length})` },
    { key: 'missing', label: `✗ Missing (${missing.length})` },
    { key: 'CRITICAL', label: 'Critical' },
    { key: 'IMPORTANT', label: 'Important' },
    { key: 'OPTIONAL', label: 'Optional' },
  ];

  const all = [
    ...matching.map((k) => ({ ...k, type: 'match' as const })),
    ...missing.map((k) => ({ ...k, type: 'miss' as const })),
  ];

  const filtered = all.filter((k) => {
    if (filter === 'all') return true;
    if (filter === 'matching') return k.type === 'match';
    if (filter === 'missing') return k.type === 'miss';
    return k.priority === filter;
  });

  function badgeClass(k: typeof filtered[0]) {
    if (k.type === 'match') return 'badge match';
    if (k.priority === 'CRITICAL') return 'badge miss-critical';
    if (k.priority === 'IMPORTANT') return 'badge miss-important';
    return 'badge miss-optional';
  }

  function matchTypeLabel(t: string) {
    if (t === 'exact') return '';
    if (t === 'synonym') return '≈';
    if (t === 'related') return '~';
    return '';
  }

  return (
    <div className="keyword-section">
      <div className="keyword-filters">
        {filterBtns.map((btn) => (
          <button
            key={btn.key}
            className={`filter-btn ${filter === btn.key ? 'active' : ''}`}
            onClick={() => setFilter(btn.key)}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className="keyword-grid">
        {filtered.map((k, i) => (
          <span key={i} className={badgeClass(k)} title={k.foundIn ?? undefined}>
            {matchTypeLabel(k.matchType)}{k.keyword}
            <span className="badge-priority">{k.priority[0]}</span>
          </span>
        ))}
        {filtered.length === 0 && (
          <p className="no-keywords">No keywords match this filter.</p>
        )}
      </div>
    </div>
  );
}
