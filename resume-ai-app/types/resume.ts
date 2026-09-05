export interface ResumeLink {
  label: string;
  url: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  website?: string;
  links?: ResumeLink[];
}

export interface ExperienceEntry {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  subtitle?: string;
  bullets: string[];
  links?: ResumeLink[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  subtitle?: string;
  bullets: string[];
  links?: ResumeLink[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  subtitle?: string;
  gpa?: string;
  honors?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  title: string;
  summary: string;
  skills: string[];
  skillCategories?: SkillCategory[];
  experience: ExperienceEntry[];
  openSourceProjects?: ProjectEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  achievements: string[];
}

export type ResumeSection = keyof ResumeData;

