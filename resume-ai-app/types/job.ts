export type KeywordPriority = 'CRITICAL' | 'IMPORTANT' | 'OPTIONAL';
export type MatchType = 'exact' | 'synonym' | 'related' | 'missing';

export interface JobKeyword {
  term: string;
  priority: KeywordPriority;
  category: 'skill' | 'technology' | 'tool' | 'responsibility' | 'qualification' | 'soft_skill' | 'domain' | 'certification';
}

export interface JobData {
  title: string;
  company?: string;
  location?: string;
  workMode?: 'remote' | 'on-site' | 'hybrid' | 'unspecified';
  requiredSkills: string[];
  preferredSkills: string[];
  technologies: string[];
  tools: string[];
  responsibilities: string[];
  qualifications: string[];
  education: string[];
  experienceRequirements: string[];
  certifications: string[];
  softSkills: string[];
  keywords: JobKeyword[];
  industryTerms: string[];
  rawText: string;
}
