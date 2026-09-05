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

    // ── Rock-Solid Reconciliation: Guarantee Zero Project Loss & Preserve CareerXAI ──
    if (tailoringResult?.tailoredResume) {
      const tailored = tailoringResult.tailoredResume;

      const isResearchOrOs = (p: { name?: string; subtitle?: string; description?: string }) =>
        /careerxai|pyrewind|symbolic ai|independent research|open-source/i.test(
          `${p.name || ''} ${p.subtitle || ''} ${p.description || ''}`
        );

      // Collect original open-source & research projects
      const origOsProjects = [
        ...(resumeData.openSourceProjects || []),
        ...(resumeData.projects || []).filter(isResearchOrOs),
      ];
      const uniqueOrigOs: typeof resumeData.projects = [];
      origOsProjects.forEach((p) => {
        if (!uniqueOrigOs.some((u) => u.name.toLowerCase() === p.name.toLowerCase())) {
          uniqueOrigOs.push(p);
        }
      });

      // Collect original standard projects (excluding OS/research)
      const origStandardProjects = (resumeData.projects || []).filter((p) => !isResearchOrOs(p));

      // 1. Reconcile openSourceProjects in tailored output
      let tailoredOs = tailored.openSourceProjects ? [...tailored.openSourceProjects] : [];
      let tailoredProjects = tailored.projects ? [...tailored.projects] : [];

      // If any research/OS project was placed in tailored.projects, move it to tailoredOs
      const misplacedInProjects = tailoredProjects.filter(isResearchOrOs);
      misplacedInProjects.forEach((p) => {
        if (!tailoredOs.some((op) => op.name.toLowerCase() === p.name.toLowerCase())) {
          tailoredOs.push(p);
        }
      });
      tailoredProjects = tailoredProjects.filter((p) => !isResearchOrOs(p));

      // Ensure every original open-source / research project exists in tailoredOs
      uniqueOrigOs.forEach((origP) => {
        const foundIdx = tailoredOs.findIndex(
          (tp) => tp.name.toLowerCase() === origP.name.toLowerCase() ||
                  tp.name.toLowerCase().includes(origP.name.toLowerCase()) ||
                  origP.name.toLowerCase().includes(tp.name.toLowerCase())
        );
        if (foundIdx === -1) {
          // Restore missing project (e.g. CareerXAI) directly from original resume
          tailoredOs.push({ ...origP });
        } else {
          // Preserve links and essential metadata from original
          const matched = tailoredOs[foundIdx];
          if ((!matched.links || matched.links.length === 0) && origP.links && origP.links.length > 0) {
            matched.links = origP.links;
          }
          if (!matched.url && origP.url) {
            matched.url = origP.url;
          }
          if (!matched.subtitle && origP.subtitle) {
            matched.subtitle = origP.subtitle;
          }
        }
      });

      // 2. Reconcile standard projects in tailored output
      origStandardProjects.forEach((origP) => {
        const foundIdx = tailoredProjects.findIndex(
          (tp) => tp.name.toLowerCase() === origP.name.toLowerCase() ||
                  tp.name.toLowerCase().includes(origP.name.toLowerCase()) ||
                  origP.name.toLowerCase().includes(tp.name.toLowerCase())
        );
        if (foundIdx === -1) {
          tailoredProjects.push({ ...origP });
        } else {
          const matched = tailoredProjects[foundIdx];
          if ((!matched.links || matched.links.length === 0) && origP.links && origP.links.length > 0) {
            matched.links = origP.links;
          }
          if (!matched.url && origP.url) {
            matched.url = origP.url;
          }
          if (!matched.subtitle && origP.subtitle) {
            matched.subtitle = origP.subtitle;
          }
        }
      });

      if (tailoredOs.length > 0) {
        tailored.openSourceProjects = tailoredOs;
      }
      tailored.projects = tailoredProjects;
    }

    return NextResponse.json(tailoringResult);
  } catch (err: unknown) {
    console.error('[tailor] Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
