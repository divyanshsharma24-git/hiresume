import { NextRequest, NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/ai/gemini';
import { ANALYZE_JOB_PROMPT } from '@/lib/ai/prompts/analyze-job';
import { SCORE_RESUME_PROMPT } from '@/lib/ai/prompts/score-resume';
import type { ResumeData } from '@/types/resume';
import type { JobData } from '@/types/job';
import type { AnalysisResult } from '@/types/analysis';

export const runtime = 'nodejs';

const MAX_JD_CHARS = 8_000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { resumeData, jobDescription } = body as {
      resumeData: ResumeData;
      jobDescription: string;
    };

    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        { error: 'resumeData and jobDescription are required' },
        { status: 400 }
      );
    }

    if (jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job description is too short. Please paste the full job posting.' },
        { status: 400 }
      );
    }

    // Truncate JD if too long
    if (jobDescription.length > MAX_JD_CHARS) {
      jobDescription = jobDescription.slice(0, MAX_JD_CHARS);
    }

    // Step 1: Extract structured job data from the JD text
    const jobData = await callGeminiJSON<JobData>(
      ANALYZE_JOB_PROMPT(jobDescription),
      { maxOutputTokens: 16384, temperature: 0.1, thinkingBudget: 1024 }
    );

    // Step 2: Score the resume against the job data
    const analysisResult = await callGeminiJSON<AnalysisResult>(
      SCORE_RESUME_PROMPT(resumeData, jobData),
      { maxOutputTokens: 16384, temperature: 0.1, thinkingBudget: 1024 }
    );

    return NextResponse.json({ jobData, analysisResult });
  } catch (err: unknown) {
    console.error('[analyze] Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
