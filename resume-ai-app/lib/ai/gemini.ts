import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

let _client: GoogleGenerativeAI | null = null;

// Cache models by name so we don't recreate unnecessarily
const _modelCache = new Map<string, GenerativeModel>();

function getClient(): GoogleGenerativeAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not set. Please add it to your .env.local file.'
      );
    }
    _client = new GoogleGenerativeAI(apiKey);
  }
  return _client;
}

const DEFAULT_FALLBACK_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite-preview',
  'gemini-3-flash-preview',
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
];

const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const FALLBACK_MODELS = Array.from(new Set([primaryModel, ...DEFAULT_FALLBACK_MODELS]));

function getModel(modelName: string, maxOutputTokens = 16384): GenerativeModel {
  const cacheKey = `${modelName}-${maxOutputTokens}`;

  if (!_modelCache.has(cacheKey)) {
    const client = getClient();
    _modelCache.set(
      cacheKey,
      client.getGenerativeModel({ model: modelName })
    );
  }
  return _modelCache.get(cacheKey)!;
}

/**
 * Call Gemini with a prompt and expect a JSON response.
 * Automatically tries fallback models if quota (429) is hit on any model.
 */
export async function callGeminiJSON<T>(
  prompt: string,
  options: { maxOutputTokens?: number; temperature?: number; thinkingBudget?: number } = {},
  modelIndex = 0
): Promise<T> {
  const { maxOutputTokens = 16384, temperature = 0.1, thinkingBudget = 1024 } = options;
  const currentModelName = FALLBACK_MODELS[modelIndex] || FALLBACK_MODELS[0];

  try {
    const model = getModel(currentModelName, maxOutputTokens);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generationConfig: any = {
      temperature,
      responseMimeType: 'application/json',
      maxOutputTokens,
    };

    if (thinkingBudget !== undefined && thinkingBudget > 0) {
      generationConfig.thinkingConfig = { thinkingBudget };
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const candidate = result.response.candidates?.[0];
    const text = result.response.text();

    if (!text || text.trim().length === 0) {
      if (candidate?.finishReason === 'MAX_TOKENS') {
        throw new Error(
          'Gemini response was cut off (MAX_TOKENS). The input may be too large. Try a shorter resume or job description.'
        );
      }
      throw new Error('Gemini returned an empty response.');
    }

    try {
      return parseJSON<T>(text);
    } catch (parseErr) {
      if (candidate?.finishReason === 'MAX_TOKENS') {
        throw new Error(
          'Gemini response was cut off (MAX_TOKENS). The input may be too large. Try a shorter resume or job description.'
        );
      }
      throw parseErr;
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const isQuotaError =
      errMsg.includes('429') ||
      errMsg.toLowerCase().includes('quota') ||
      errMsg.toLowerCase().includes('too many requests') ||
      errMsg.includes('RESOURCE_EXHAUSTED');

    // If quota exceeded on this model, failover to the next model in the pool
    if (isQuotaError && modelIndex < FALLBACK_MODELS.length - 1) {
      const nextModel = FALLBACK_MODELS[modelIndex + 1];
      console.warn(
        `[Gemini] Quota limit hit on ${currentModelName}. Automatically switching to fallback model: ${nextModel}...`
      );
      return callGeminiJSON<T>(prompt, options, modelIndex + 1);
    }

    const isTokenError = errMsg.includes('MAX_TOKENS');
    if (!isTokenError && !isQuotaError && modelIndex < FALLBACK_MODELS.length - 1) {
      const nextModel = FALLBACK_MODELS[modelIndex + 1];
      console.warn(`[Gemini] Request failed on ${currentModelName}, failing over to ${nextModel}...`, err);
      await new Promise((r) => setTimeout(r, 1000));
      return callGeminiJSON<T>(prompt, options, modelIndex + 1);
    }

    throw err;
  }
}

function parseJSON<T>(text: string): T {
  // Strip markdown code fences if present
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  if (!cleaned) {
    throw new Error('Gemini returned an empty JSON response.');
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Try to extract the largest valid JSON object from the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {
        // fall through to original error
      }
    }
    throw new Error(
      `Gemini returned invalid JSON. First 400 chars: ${cleaned.slice(0, 400)}`
    );
  }
}
