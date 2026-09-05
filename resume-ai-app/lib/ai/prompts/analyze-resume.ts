import type { ResumeData } from '@/types/resume';

export const RESUME_PARSE_PROMPT = (resumeText: string) => `
You are an expert resume parser. Parse the following resume text into structured JSON.

IMPORTANT RULES:
- Only extract information that is actually present in the resume
- Do not invent or fabricate any information
- If a field is not present, use an empty string or empty array
- Preserve all original dates, metrics, and facts exactly as written
- For experience bullets, extract each bullet point as a separate string in the array
- CRITICAL FOR HYPERLINKS: If 'EMBEDDED DOCUMENT HYPERLINKS' are listed at the bottom, accurately map each URL with its matching label (e.g. LinkedIn, GitHub, Portfolio, Website, PyPI, specific projects like SRI ERP, FleetOS, Resume Analyzer, and certification view links). Preserve every link!

Resume text:
"""
${resumeText}
"""

Return ONLY valid JSON (no markdown, no code fences) matching this exact schema:
{
  "personal": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "portfolio": "string",
    "website": "string",
    "links": [
      { "label": "string (e.g. LinkedIn, GitHub, Portfolio, Website)", "url": "string" }
    ]
  },
  "title": "string (professional title/headline)",
  "summary": "string (professional summary)",
  "skills": ["flat array of all skill strings"],
  "skillCategories": [
    {
      "category": "string (e.g. Languages, Programming & CS, Frontend / Backend, Databases, AI / ML, Generative AI, MLOps / DevOps, Tools)",
      "skills": ["array of skill strings"]
    }
  ],
  "experience": [
    {
      "company": "string",
      "title": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "subtitle": "string (optional secondary role/details)",
      "bullets": ["array of bullet point strings"],
      "links": [{ "label": "string (e.g. LinkedIn)", "url": "string" }]
    }
  ],
  "projects": [
    {
      "name": "string",
      "subtitle": "string (optional subtitle or tech line like 'React, TypeScript, Supabase')",
      "description": "string",
      "technologies": ["array of tech strings"],
      "url": "string",
      "bullets": ["array of bullet point strings"],
      "links": [{ "label": "string (e.g. PyPI, GitHub, Documentation, Demo, Link, Report, PPT)", "url": "string" }]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string",
      "subtitle": "string (e.g. Executive Program | 2026 - Present | CGPA: 7.5)",
      "gpa": "string",
      "honors": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string",
      "url": "string (link if provided e.g. view link)"
    }
  ],
  "achievements": ["array of achievement strings"]
}
`;

export const VALIDATE_RESUME_PROMPT = (resume: ResumeData) => `
You are validating a parsed resume for completeness and accuracy.

Parsed resume:
${JSON.stringify(resume, null, 2)}

Check:
1. Is the personal name present?
2. Are there at least some skills or experience entries?
3. Does the data look like a real resume (not random text)?

Return ONLY valid JSON:
{
  "isValid": boolean,
  "issues": ["array of issue strings if any"],
  "confidence": number (0-100, how confident the parse was)
}
`;
