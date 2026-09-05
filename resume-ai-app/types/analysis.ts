import type { ResumeData } from './resume';
import type { MatchType, KeywordPriority } from './job';

export interface KeywordMatch {
  keyword: string;
  matchType: MatchType;
  priority: KeywordPriority;
  foundIn?: string; // e.g. "Experience > Company X > Bullet 2"
}

export interface ATSScoreBreakdown {
  overall: number;
  skills: number;
  keywords: number;
  experience: number;
  responsibilities: number;
  qualifications: number;
}

export interface AnalysisResult {
  score: ATSScoreBreakdown;
  matchingKeywords: KeywordMatch[];
  missingKeywords: KeywordMatch[];
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface ResumeChange {
  section: string;
  field?: string;
  index?: number;
  before: string;
  after: string;
  reason: string;
  keywordsAdded?: string[];
}

export interface KeywordAddition {
  keyword: string;
  source: string; // where in original resume the evidence exists
  reason: string;
}

export interface TailoringResult {
  tailoredResume: ResumeData;
  originalScore: ATSScoreBreakdown;
  tailoredScore: ATSScoreBreakdown;
  changes: ResumeChange[];
  keywordsAdded: KeywordAddition[];
  changeSummary: {
    keywordsAligned: number;
    bulletsOptimized: number;
    summaryRewritten: boolean;
    skillsReordered: boolean;
    titleOptimized: boolean;
    projectsPrioritized: number;
  };
}

export type AppStep =
  | 'upload'
  | 'analyzing'
  | 'analyzed'
  | 'tailoring'
  | 'tailored';

export interface AppState {
  step: AppStep;
  resumeText: string | null;
  resumeData: ResumeData | null;
  jobDescription: string;
  analysisResult: AnalysisResult | null;
  tailoringResult: TailoringResult | null;
  error: string | null;
}
