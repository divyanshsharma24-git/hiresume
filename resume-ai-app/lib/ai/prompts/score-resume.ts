import type { ResumeData } from '@/types/resume';
import type { JobData } from '@/types/job';

export const SCORE_RESUME_PROMPT = (resume: ResumeData, job: JobData) => `
You are an expert ATS (Applicant Tracking System) scoring engine.
Score the resume against the job description with precision and return a detailed analysis.

SCORING RULES:
- overall: weighted composite of all sub-scores (0-100)
- skills: how well the candidate's skills match required/preferred skills (0-100)
- keywords: percentage of critical+important keywords present in resume (0-100)
- experience: relevance and depth of experience to the role (0-100)
- responsibilities: how well past bullet points align with job responsibilities (0-100)
- qualifications: how well the candidate meets stated qualifications (0-100)

KEYWORD MATCHING RULES:
- exact: the exact term appears in the resume
- synonym: a recognized synonym or abbreviation appears (e.g. "ML" for "Machine Learning")
- related: a closely related term appears (e.g. "NumPy" when "data manipulation" is required)
- missing: the term does not appear in any form

Resume:
${JSON.stringify(resume, null, 2)}

Job Data:
${JSON.stringify(job, null, 2)}

Return ONLY valid JSON matching this schema:
{
  "score": {
    "overall": number,
    "skills": number,
    "keywords": number,
    "experience": number,
    "responsibilities": number,
    "qualifications": number
  },
  "matchingKeywords": [
    {
      "keyword": "string",
      "matchType": "exact | synonym | related",
      "priority": "CRITICAL | IMPORTANT | OPTIONAL",
      "foundIn": "string describing where it was found, e.g. 'Skills' or 'Experience > Company X > Bullet 2'"
    }
  ],
  "missingKeywords": [
    {
      "keyword": "string",
      "matchType": "missing",
      "priority": "CRITICAL | IMPORTANT | OPTIONAL",
      "foundIn": null
    }
  ],
  "strengths": ["array of 3-5 specific strengths of this resume for this role"],
  "weaknesses": ["array of 3-5 specific gaps or weaknesses"],
  "recommendations": ["array of 4-6 specific, actionable recommendations to improve ATS score"]
}
`;
