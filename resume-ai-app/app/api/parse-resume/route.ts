import { NextRequest, NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/ai/gemini';
import { RESUME_PARSE_PROMPT, VALIDATE_RESUME_PROMPT } from '@/lib/ai/prompts/analyze-resume';
import type { ResumeData } from '@/types/resume';
import { heuristicParseResume } from '@/lib/ai/heuristic-parser';

// Force Node.js runtime — required for pdf-parse and mammoth (they use Node APIs)
export const runtime = 'nodejs';

import { extractText } from 'unpdf';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mammoth = require('mammoth');

// ~4 chars per token → 20,000 chars ≈ 5,000 tokens (safe headroom for output)
const MAX_RESUME_CHARS = 20_000;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // File size guard — 5MB max
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Please upload a file under 5MB.' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|doc)$/i)) {
      return NextResponse.json(
        { error: 'Only PDF and DOCX files are supported.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let resumeText = '';

    try {
      console.log('[parse-resume] Received file:', file.name, file.size, file.type, 'buffer length:', buffer.length);
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const result = await extractText(new Uint8Array(buffer));
        resumeText = Array.isArray(result.text) ? result.text.join('\n\n') : (result.text || '');
        console.log('[parse-resume] Successfully extracted PDF text via unpdf, length:', resumeText.length);

        // Extract embedded PDF URI annotations so hyperlinks are preserved with 100% fidelity
        const rawLatin = buffer.toString('latin1');
        const uriMatches = rawLatin.match(/\/URI\s*\(([^)]+)\)/g);
        if (uriMatches && uriMatches.length > 0) {
          const extractedUrls = Array.from(
            new Set(
              uriMatches
                .map((m) => m.replace(/^\/URI\s*\(/, '').replace(/\)$/, '').trim())
                .filter((url) => url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:'))
            )
          );
          if (extractedUrls.length > 0) {
            resumeText += '\n\n--- EMBEDDED DOCUMENT HYPERLINKS (ATTACH TO MATCHING PROFILE / PROJECTS / CERTIFICATIONS) ---\n';
            resumeText += extractedUrls.map((u) => `- ${u}`).join('\n');
          }
        }
      } else {
        // Convert DOCX to HTML first to capture all hyperlinks: [label](url)
        const htmlResult = await mammoth.convertToHtml({ buffer });
        let html = htmlResult.value ?? '';
        html = html.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
        html = html
          .replace(/<p[^>]*>/gi, '')
          .replace(/<\/p>/gi, '\n')
          .replace(/<li[^>]*>/gi, '• ')
          .replace(/<\/li>/gi, '\n')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ');
        resumeText = html;
      }
    } catch (extractErr: unknown) {
      console.error('[parse-resume] Text extraction failed:', extractErr);
      const msg = extractErr instanceof Error ? extractErr.message : String(extractErr);
      return NextResponse.json(
        { error: `Could not read this file: ${msg}` },
        { status: 422 }
      );
    }

    // Clean up extracted text
    resumeText = resumeText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (resumeText.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from this file. It may be a scanned image — please use a text-based PDF or DOCX.' },
        { status: 422 }
      );
    }

    // Truncate to stay within token budget
    if (resumeText.length > MAX_RESUME_CHARS) {
      console.warn(`[parse-resume] Truncating resume from ${resumeText.length} to ${MAX_RESUME_CHARS} chars`);
      resumeText = resumeText.slice(0, MAX_RESUME_CHARS);
    }

    // Parse resume text → structured ResumeData (with deterministic fallback)
    let resumeData: ResumeData;
    try {
      resumeData = await callGeminiJSON<ResumeData>(
        RESUME_PARSE_PROMPT(resumeText),
        { maxOutputTokens: 16384, temperature: 0.1, thinkingBudget: 1024 }
      );
    } catch (aiErr) {
      console.warn('[parse-resume] Gemini API parse failed/unavailable. Using heuristic parser fallback.', aiErr);
      resumeData = heuristicParseResume(resumeText);
    }

    // Quick structural validation
    const hasName = (resumeData?.personal?.name ?? '').trim().length > 0;
    const hasContent =
      (resumeData?.experience?.length ?? 0) > 0 ||
      (resumeData?.skills?.length ?? 0) > 0 ||
      (resumeData?.education?.length ?? 0) > 0;

    if (!hasName || !hasContent) {
      // If AI returned incomplete data, merge with heuristic extraction
      const fallback = heuristicParseResume(resumeText);
      resumeData = {
        ...fallback,
        ...resumeData,
        personal: {
          ...fallback.personal,
          ...(resumeData?.personal || {}),
          name: resumeData?.personal?.name || fallback.personal.name,
          email: resumeData?.personal?.email || fallback.personal.email,
        },
      };
    }
    return NextResponse.json({ resumeData, resumeText });
  } catch (err: unknown) {
    console.error('[parse-resume] Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error parsing resume';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
