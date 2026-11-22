import fs from 'node:fs/promises';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import type { DesignTokens, PresentationDocument, SlideOutlineItem } from '../core/schema.ts';
import { extractSemanticBlocks } from '../core/tokenizer.ts';
import { composePresentationFromOutline } from '../core/layout-engine.ts';
import { evaluatePresentationQuality, autoRepairDocument } from '../core/quality-scorer.ts';
import { DESIGN_TOKEN_PRESETS } from '../core/seed-data.ts';

export interface GenerationSourceInput {
  id: string;
  filename: string;
  mimeType: string;
  storagePath: string;
  publicUrl: string;
  kind: string;
  extractedText: string;
}

export interface OutlinePlanResult {
  title: string;
  description: string;
  audience: string;
  tone: string;
  suggestedThemeId: string;
  referenceObservations?: {
    visualDirection: string;
    extractedColors: string[];
    layoutRhythm: string;
  };
  outline: SlideOutlineItem[];
  sourceRefs: { sourceId: string; filename: string; excerpt: string }[];
  modelUsed: string;
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured in environment secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function buildMultimodalParts(
  sources: GenerationSourceInput[],
  referenceImages: GenerationSourceInput[]
) {
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  for (const src of sources) {
    if (src.kind === 'pdf' || src.kind === 'image') {
      try {
        const buf = await fs.readFile(src.storagePath);
        parts.push({ text: `Source file "${src.filename}" (ID: ${src.id}):` });
        parts.push({
          inlineData: {
            mimeType: src.mimeType === 'image/svg+xml' ? 'text/plain' : src.mimeType,
            data: src.mimeType === 'image/svg+xml' ? Buffer.from(buf).toString('base64') : buf.toString('base64'),
          },
        });
      } catch {
        // Skip unreadable file cleanly
      }
    } else if (src.extractedText) {
      parts.push({
        text: `Source text from "${src.filename}" (ID: ${src.id}):\n${src.extractedText.slice(0, 12000)}`,
      });
    }
  }

  for (const ref of referenceImages) {
    if (ref.kind === 'image' && ref.mimeType !== 'image/svg+xml') {
      try {
        const buf = await fs.readFile(ref.storagePath);
        parts.push({ text: `Visual reference image "${ref.filename}":` });
        parts.push({
          inlineData: {
            mimeType: ref.mimeType,
            data: buf.toString('base64'),
          },
        });
      } catch {
        // ignore
      }
    }
  }

  return parts;
}

export async function generatePresentationOutlineWithAi(params: {
  prompt: string;
  slideCount: number;
  category: string;
  referenceMode: string;
  referenceNotes: string;
  sources: GenerationSourceInput[];
  referenceImages: GenerationSourceInput[];
  modelName?: string;
}): Promise<OutlinePlanResult> {
  const ai = getGeminiClient();
  const model = params.modelName || 'gemini-4-hydrogen';

  const semanticBlocks = extractSemanticBlocks(
    [params.prompt, ...params.sources.map((s) => s.extractedText)].filter(Boolean).join('\n\n')
  );

  const multimodalParts = await buildMultimodalParts(params.sources, params.referenceImages);

  const instructionText = `
You are an architectural presentation strategist and art director.
Analyze the user's prompt, uploaded source materials, semantic block hints, and optional visual reference images.

Rules:
1. Never invent statistics, facts, quotes, or citations not present in the prompt or provided sources.
2. Create a cohesive narrative arc of ${params.slideCount} slides for category "${params.category}".
3. Choose varied layoutPattern values from:
   - "title-hero" (slide 1 only)
   - "split-media"
   - "editorial-columns"
   - "data-chart-split"
   - "kpi-trio"
   - "comparison-two-col"
   - "timeline-horizontal"
   - "editorial-quote"
4. Avoid repeating the exact same layoutPattern on consecutive slides.
5. Suggested theme IDs: "warm-atelier", "gallery-editorial", "obsidian-studio", "nordic-slate".
6. Reference mode requested: "${params.referenceMode}". Notes: "${params.referenceNotes || 'None'}".

Application-level semantic analysis hints (word-role classification):
${semanticBlocks.slice(0, 12).map((b) => `- [${b.role}] ${b.text.slice(0, 140)}`).join('\n')}

User prompt:
${params.prompt}
`.trim();

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [...multimodalParts, { text: instructionText }],
    },
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          audience: { type: Type.STRING },
          tone: { type: Type.STRING },
          suggestedThemeId: { type: Type.STRING },
          visualDirection: { type: Type.STRING },
          extractedColors: { type: Type.ARRAY, items: { type: Type.STRING } },
          layoutRhythm: { type: Type.STRING },
          outline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                purpose: { type: Type.STRING },
                layoutPattern: { type: Type.STRING },
                semanticType: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                sourceRef: { type: Type.STRING },
              },
              required: ['title', 'purpose', 'layoutPattern', 'semanticType', 'keyPoints'],
            },
          },
        },
        required: ['title', 'description', 'suggestedThemeId', 'outline'],
      },
    },
  });

  const rawJson = (response.text || '{}').trim();
  const parsed = JSON.parse(rawJson) as {
    title: string;
    description: string;
    audience?: string;
    tone?: string;
    suggestedThemeId?: string;
    visualDirection?: string;
    extractedColors?: string[];
    layoutRhythm?: string;
    outline: Array<{
      title: string;
      purpose: string;
      layoutPattern: string;
      semanticType: string;
      keyPoints: string[];
      sourceRef?: string;
    }>;
  };

  const validSemantic = new Set([
    'title',
    'context',
    'argument',
    'evidence',
    'data',
    'comparison',
    'timeline',
    'process',
    'quote',
    'conclusion',
    'reference',
  ]);

  const outline: SlideOutlineItem[] = (parsed.outline || []).map((item, idx) => ({
    id: `slide-${idx + 1}`,
    order: idx,
    title: item.title || `Slide ${idx + 1}`,
    purpose: item.purpose || '',
    layoutPattern: idx === 0 ? 'title-hero' : item.layoutPattern || 'editorial-columns',
    semanticType: (validSemantic.has(item.semanticType) ? item.semanticType : 'argument') as SlideOutlineItem['semanticType'],
    keyPoints: Array.isArray(item.keyPoints) ? item.keyPoints.slice(0, 5) : [],
    sourceRef: item.sourceRef,
  }));

  const validTheme = DESIGN_TOKEN_PRESETS.some((t) => t.id === parsed.suggestedThemeId)
    ? parsed.suggestedThemeId!
    : 'warm-atelier';

  return {
    title: parsed.title || 'Untitled Presentation',
    description: parsed.description || '',
    audience: parsed.audience || 'General professional audience',
    tone: parsed.tone || 'Clear and authoritative',
    suggestedThemeId: validTheme,
    referenceObservations:
      params.referenceImages.length > 0 || parsed.visualDirection
        ? {
            visualDirection: parsed.visualDirection || 'Editorial clarity',
            extractedColors: parsed.extractedColors || [],
            layoutRhythm: parsed.layoutRhythm || 'Alternating visual & analytical spreads',
          }
        : undefined,
    outline,
    sourceRefs: params.sources.map((s) => ({
      sourceId: s.id,
      filename: s.filename,
      excerpt: s.extractedText ? s.extractedText.slice(0, 180) : 'Uploaded visual/PDF document',
    })),
    modelUsed: model,
  };
}

export async function renderDocumentFromApprovedOutline(params: {
  id: string;
  title: string;
  description: string;
  category: string;
  outline: SlideOutlineItem[];
  tokens: DesignTokens;
  imageAssets: string[];
  sourceRefs: { sourceId: string; filename: string; excerpt: string }[];
  allowCustomComponents: boolean;
}): Promise<{ document: PresentationDocument; qualityReport: ReturnType<typeof evaluatePresentationQuality> }> {
  const composed = composePresentationFromOutline(params.id, {
    title: params.title,
    description: params.description,
    category: params.category,
    outline: params.outline,
    tokens: params.tokens,
    imageAssets: params.imageAssets,
    sourceRefs: params.sourceRefs,
    allowCustomComponents: params.allowCustomComponents,
  });

  const repaired = autoRepairDocument(composed);
  const qualityReport = evaluatePresentationQuality(repaired);
  return { document: repaired, qualityReport };
}
