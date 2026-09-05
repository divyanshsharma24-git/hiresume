export const ANALYZE_JOB_PROMPT = (jobDescription: string) => `
You are an expert job description analyst and ATS specialist.
Analyze the following job description and extract all relevant information into structured JSON.

IMPORTANT RULES:
- Extract ALL keywords that an ATS system would scan for
- Classify keywords by priority: CRITICAL (required/must-have), IMPORTANT (preferred/nice-to-have), OPTIONAL (bonus/mentioned once)
- Classify keywords by category accurately
- Include both explicit and implied requirements
- Capture industry-specific terminology and acronyms

Job Description:
"""
${jobDescription}
"""

Return ONLY valid JSON matching this exact schema (no extra text, no markdown):
{
  "title": "string (exact job title)",
  "company": "string (company name if mentioned, else empty string)",
  "requiredSkills": ["array of required/must-have skills"],
  "preferredSkills": ["array of preferred/nice-to-have skills"],
  "technologies": ["array of specific technologies, frameworks, platforms"],
  "tools": ["array of tools, software, IDEs, CLIs mentioned"],
  "responsibilities": ["array of key job responsibilities as concise phrases"],
  "qualifications": ["array of qualifications/requirements"],
  "education": ["array of education requirements"],
  "experienceRequirements": ["array of experience requirements e.g. '5+ years Python'"],
  "certifications": ["array of certifications mentioned"],
  "softSkills": ["array of soft skills and interpersonal qualities"],
  "industryTerms": ["array of domain/industry-specific terminology"],
  "keywords": [
    {
      "term": "string",
      "priority": "CRITICAL | IMPORTANT | OPTIONAL",
      "category": "skill | technology | tool | responsibility | qualification | soft_skill | domain | certification"
    }
  ],
  "rawText": "omitted"
}
`;
