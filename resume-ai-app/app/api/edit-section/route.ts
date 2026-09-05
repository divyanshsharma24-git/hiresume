import { NextRequest, NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/ai/gemini';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionName, currentContent, instruction, jobTitle, company } = body as {
      sectionName: string;
      currentContent: string;
      instruction: string;
      jobTitle?: string;
      company?: string;
    };

    if (!sectionName || !currentContent || !instruction) {
      return NextResponse.json(
        { error: 'sectionName, currentContent, and instruction are required' },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert resume writer and ATS optimization specialist.
Rewrite or refine the following resume section based on the user's specific instruction.

Target Role: ${jobTitle || 'Full Stack Developer'}
Target Company: ${company || 'Target Company'}
Section: ${sectionName}

Current Section Content:
"""
${currentContent}
"""

User Instruction:
"${instruction}"

STRICT RULES:
1. Follow the user's instruction precisely.
2. The candidate has explicitly authorized full ATS keyword injection (e.g. Next.js, FastAPI, PyTorch, TensorFlow, LangChain, LangGraph, etc.) to clear ATS filters. Proactively weave in target technologies requested in the instruction with professional engineering rigor.
3. Front-load action verbs, maintain active voice, and keep formatting clean and publication-ready.
4. Return ONLY valid JSON matching this schema:
{
  "updatedContent": "string (the complete refined section text)",
  "summaryOfChange": "string (1 concise sentence explaining what was changed)",
  "keywordsAdded": ["array of keyword strings added"]
}
`;

    const result = await callGeminiJSON<{
      updatedContent: string;
      summaryOfChange: string;
      keywordsAdded: string[];
    }>(prompt, { maxOutputTokens: 2048, temperature: 0.2, thinkingBudget: 512 });

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('[edit-section] Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
