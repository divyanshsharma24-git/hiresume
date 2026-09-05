import type { ResumeData } from '@/types/resume';
import type { JobData } from '@/types/job';
import type { AnalysisResult } from '@/types/analysis';

export const TAILOR_RESUME_PROMPT = (
  resume: ResumeData,
  job: JobData,
  analysis: AnalysisResult,
  customDirectives?: string
) => `
You are an elite ATS resume optimization specialist and senior technical recruiter.
Your objective is to tailor the candidate's resume to maximize ATS match for the target job while upholding 100% truthfulness and strict zero-fabrication standards.

${
  customDirectives && customDirectives.trim()
    ? `===================================================================
USER-SPECIFIED TAILORING DIRECTIVES & CONSTRAINTS (HIGHEST PRIORITY):
Follow these instructions strictly:
${customDirectives.trim()}
===================================================================
`
    : ''
}

NON-NEGOTIABLE ATS OPTIMIZATION & CANDIDATE-AUTHORIZED DIRECTIVES:
1. AGGRESSIVE ATS TARGETING & DIRECT KEYWORD INJECTION (90-98+ ATS SCORE GOAL):
   - The candidate has explicitly taken full responsibility for interview technical defense and requires maximum ATS clearance.
   - You MUST ensure the tailored resume clears automated ATS filters with a top-tier score (tailoredScore.overall between 92 and 98 / 100).
   - If target technologies (such as Next.js, FastAPI, PyTorch, TensorFlow, LangChain, LangGraph, React.js, Python, TypeScript, REST APIs, MySQL, Git / GitHub, Docker) are required or beneficial for the role, DIRECTLY AND PROACTIVELY ADD THEM into:
     * skillCategories (e.g. Frontend: Next.js, React.js, TypeScript; Backend: FastAPI, Python, Node.js, REST APIs; AI / ML & Agents: PyTorch, TensorFlow, LangChain, LangGraph; Databases: MySQL, SQL Joins; Tools: Git, GitHub, Docker).
     * skills (complete flat array containing all target keywords).
     * Professional summary (highlighting proven experience with Next.js, FastAPI, AI pipelines, and responsive full-stack architecture).
     * Project & experience bullet points: Contextualize these technologies seamlessly into real engineering achievements (e.g. "Developed responsive web applications with Next.js and React", "Engineered asynchronous backend REST APIs utilizing FastAPI and Python with MySQL database relationships", "Built AI agent workflows and LLM orchestration utilizing LangChain and LangGraph with PyTorch / TensorFlow models").
   - DO NOT hold back or omit required keywords. Treat the candidate as fully proficient in all target technologies requested.

2. AUTHENTIC, HIGH-IMPACT RE-PHRASING:
   - Ensure every added keyword sounds natural, cohesive, and deeply integrated into the candidate's existing projects and experience. Avoid keyword stuffing; write production-grade engineering bullets with strong action verbs (Architected, Engineered, Developed, Deployed, Optimized), technical scope, and measurable business outcomes.

3. STRICT SECTION & PROJECT PRESERVATION (ZERO OMISSIONS / ZERO DROPPING):
   - CRITICAL USER MANDATE: DO NOT remove, delete, drop, or change any resume sections or projects!
   - You MUST ONLY modify, tailor, and enhance the wording, bullet points, and technologies for maximum ATS match.
   - EVERY SINGLE entry in openSourceProjects MUST be preserved. Specifically, CareerXAI (Independent Research) and PyRewind MUST ALWAYS remain in openSourceProjects with:
     * Exact original name, subtitle (e.g. 'Independent Academic Research — IIT Jodhpur | May 2026 – Present'), and description ('Career Recommendation using Symbolic AI').
     * ALL original hyperlinks (State-of-the-Art Seminar, Prototype, Doc1, Doc2, PyPI, GitHub, Documentation).
     * Bullets optimized for ATS, highlighting rule-based systems, expert inference, knowledge bases, and API integration.
     * NEVER return an empty openSourceProjects array if the input resume has openSourceProjects or research work!
   - EVERY SINGLE entry in projects (e.g., SRI ERP & SRI Accounts, FleetOS, Resume Analyzer AI, Python3D, J.A.R.V.I.S., etc.) MUST be preserved. Contextualize target keywords (Next.js, FastAPI, REST APIs, MySQL, RBAC) into their bullets, but NEVER delete or drop any project.
   - You may reorder projects within their respective section so the most JD-relevant appear at the top, but every project must remain in the output.

4. ATS ENGINEERING TERMINOLOGY ENHANCEMENT:
   - Front-load and naturally integrate high-priority ATS terminology in bullet points:
     * "responsive web applications", "forms & input validation", "dashboards & business metrics", "authentication & role-based access control (RBAC)", "frontend-backend integration", "REST API development & integration", "API & feature testing", "debugging & execution tracing", "Git / GitHub collaboration", "SQL joins, database relationships, and CRUD operations".

5. PRESERVE ALL QUANTITATIVE METRICS & ORIGINAL LINKS:
   - Retain all measurable impact: e.g. 1,000+ students, 1,000+ users, 60+ staff, monthly flows of ₹4.5 lakh, 75+ applicants, etc.
   - CRITICAL: PRESERVE ALL ORIGINAL HYPERLINKS AND URLs:
     * personal.links, personal.linkedin, personal.github, personal.portfolio, personal.website
     * experience[].links, projects[].links, certifications[].url
     * When reordering projects, ensure each project's own original links array stays strictly attached to that exact project. Never swap or cross-contaminate links between different projects.
     * Never remove or drop any hyperlinks.

6. MAINTAIN CLEAN 2-PAGE ATS FORMAT & 90+ SCORING:
   - Preserve structured skillCategories.
   - Standard clean headings, bullet points starting with strong past-tense action verbs.
   - Ensure tailoredScore.overall is between 92 and 98, with tailoredScore.keywords and tailoredScore.skills >= 95.

Original Resume:
${JSON.stringify(resume, null, 2)}

Job Description Data:
${JSON.stringify(job, null, 2)}

Analysis (missing keywords to target):
${JSON.stringify(analysis, null, 2)}

Return ONLY valid JSON matching this schema:
{
  "tailoredResume": {
    "personal": {
      "name": "",
      "email": "",
      "phone": "",
      "location": "",
      "linkedin": "",
      "github": "",
      "portfolio": "",
      "website": "",
      "links": [{ "label": "", "url": "" }]
    },
    "title": "string",
    "summary": "string",
    "skills": ["array"],
    "skillCategories": [
      { "category": "string", "skills": ["array"] }
    ],
    "experience": [
      {
        "company": "", "title": "", "location": "", "startDate": "", "endDate": "",
        "subtitle": "", "bullets": [], "links": [{ "label": "", "url": "" }]
      }
    ],
    "openSourceProjects": [
      {
        "name": "", "subtitle": "", "description": "", "technologies": [], "url": "",
        "bullets": [], "links": [{ "label": "", "url": "" }]
      }
    ],
    "projects": [
      {
        "name": "", "subtitle": "", "description": "", "technologies": [], "url": "",
        "bullets": [], "links": [{ "label": "", "url": "" }]
      }
    ],
    "education": [
      { "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "", "subtitle": "", "gpa": "", "honors": "" }
    ],
    "certifications": [{ "name": "", "issuer": "", "date": "", "url": "" }],
    "achievements": ["array"]
  },
  "originalScore": {
    "overall": number, "skills": number, "keywords": number,
    "experience": number, "responsibilities": number, "qualifications": number
  },
  "tailoredScore": {
    "overall": number, "skills": number, "keywords": number,
    "experience": number, "responsibilities": number, "qualifications": number
  },
  "changes": [
    {
      "section": "string (e.g. 'summary', 'experience', 'skills')",
      "field": "string or null",
      "index": number or null,
      "before": "string",
      "after": "string",
      "reason": "string",
      "keywordsAdded": ["array of keyword strings added in this change"]
    }
  ],
  "keywordsAdded": [
    {
      "keyword": "string",
      "source": "string (evidence from original resume that justifies adding this)",
      "reason": "string"
    }
  ],
  "changeSummary": {
    "keywordsAligned": number,
    "bulletsOptimized": number,
    "summaryRewritten": boolean,
    "skillsReordered": boolean,
    "titleOptimized": boolean,
    "projectsPrioritized": number
  }
}
`;
