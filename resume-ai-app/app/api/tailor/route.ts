import { NextRequest, NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/ai/gemini';
import { TAILOR_RESUME_PROMPT } from '@/lib/ai/prompts/tailor-resume';
import type { ResumeData } from '@/types/resume';
import type { JobData } from '@/types/job';
import type { AnalysisResult, TailoringResult } from '@/types/analysis';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeData, jobData, analysisResult, customDirectives } = body as {
      resumeData: ResumeData;
      jobData: JobData;
      analysisResult: AnalysisResult;
      customDirectives?: string;
    };

    if (!resumeData || !jobData || !analysisResult) {
      return NextResponse.json(
        { error: 'resumeData, jobData, and analysisResult are required' },
        { status: 400 }
      );
    }

    const tailoringResult = await callGeminiJSON<TailoringResult>(
      TAILOR_RESUME_PROMPT(resumeData, jobData, analysisResult, customDirectives),
      { maxOutputTokens: 16384, temperature: 0.15, thinkingBudget: 2048 }
    );

    return NextResponse.json(tailoringResult);
  } catch (err: unknown) {
    console.error('[tailor] Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
