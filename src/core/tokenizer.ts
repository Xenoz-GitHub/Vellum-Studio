/**
 * Application-Level Semantic Tokenizer & Vocabulary Normalizer (v1.2.0)
 *
 * IMPORTANT: This module performs deterministic application-level tokenization,
 * domain alias normalization, and semantic block classification for prompt analysis
 * and layout routing. It does NOT alter or replace the underlying AI model's
 * internal subword BPE tokenizer.
 */

export const APP_TOKENIZER_VERSION = '1.2.0';

export type SemanticBlockRole =
  | 'title'
  | 'subtitle'
  | 'argument'
  | 'supporting_point'
  | 'statistic'
  | 'quote'
  | 'timeline'
  | 'comparison'
  | 'process'
  | 'conclusion'
  | 'reference';

export interface AppToken {
  raw: string;
  normalized: string;
  label: string;
  weight: number;
}

export interface SemanticBlock {
  id: string;
  role: SemanticBlockRole;
  text: string;
  tokens: AppToken[];
  densityScore: number; // 0..1
  numericSignals: string[];
  sourceId?: string;
}

const DEFAULT_VOCAB_ALIASES: Record<string, { normalized: string; label: string; weight: number }> = {
  kpi: { normalized: 'key performance indicator', label: 'METRIC', weight: 1.4 },
  arr: { normalized: 'annual recurring revenue', label: 'FINANCIAL', weight: 1.5 },
  mrr: { normalized: 'monthly recurring revenue', label: 'FINANCIAL', weight: 1.4 },
  roi: { normalized: 'return on investment', label: 'FINANCIAL', weight: 1.3 },
  cagr: { normalized: 'compound annual growth rate', label: 'GROWTH', weight: 1.4 },
  q1: { normalized: 'quarter 1', label: 'TEMPORAL', weight: 1.2 },
  q2: { normalized: 'quarter 2', label: 'TEMPORAL', weight: 1.2 },
  q3: { normalized: 'quarter 3', label: 'TEMPORAL', weight: 1.2 },
  q4: { normalized: 'quarter 4', label: 'TEMPORAL', weight: 1.2 },
  vs: { normalized: 'versus', label: 'COMPARISON', weight: 1.5 },
  versus: { normalized: 'versus', label: 'COMPARISON', weight: 1.5 },
  roadmap: { normalized: 'timeline roadmap', label: 'TIMELINE', weight: 1.4 },
  milestone: { normalized: 'milestone', label: 'TIMELINE', weight: 1.3 },
  phase: { normalized: 'phase', label: 'PROCESS', weight: 1.3 },
  workflow: { normalized: 'workflow', label: 'PROCESS', weight: 1.3 },
  architecture: { normalized: 'system architecture', label: 'SYSTEM', weight: 1.2 },
  source: { normalized: 'source reference', label: 'CITATION', weight: 1.2 },
};

export function tokenizeText(
  input: string,
  customAliases: Record<string, { normalized: string; label: string; weight: number }> = {}
): AppToken[] {
  const vocab = { ...DEFAULT_VOCAB_ALIASES, ...customAliases };
  const rawParts = input
    .replace(/[^\w\s%$.-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  return rawParts.map((raw) => {
    const lower = raw.toLowerCase();
    const match = vocab[lower];
    if (match) {
      return {
        raw,
        normalized: match.normalized,
        label: match.label,
        weight: match.weight,
      };
    }
    if (/^\$?\d[\d,.]*%?$/.test(raw)) {
      return { raw, normalized: raw, label: 'NUMERIC', weight: 1.4 };
    }
    if (/^(19|20)\d{2}$/.test(raw)) {
      return { raw, normalized: raw, label: 'YEAR', weight: 1.3 };
    }
    return { raw, normalized: lower, label: 'TERM', weight: 1.0 };
  });
}

export function classifySemanticBlock(text: string, index: number, total: number): SemanticBlockRole {
  const lower = text.toLowerCase();
  const tokens = tokenizeText(text);
  const labels = new Set(tokens.map((t) => t.label));

  if (index === 0 && text.length < 110) return 'title';
  if (/^["“].+["”]\s*[-—]/.test(text.trim()) || lower.includes('said ') || lower.includes('quote:')) {
    return 'quote';
  }
  if (labels.has('COMPARISON') || /\b(compare|comparison|before vs after|pros and cons)\b/i.test(lower)) {
    return 'comparison';
  }
  if (labels.has('TIMPORAL') || labels.has('TIMELINE') || labels.has('YEAR') || /\b(timeline|roadmap|202\d)\b/i.test(lower)) {
    return 'timeline';
  }
  if (labels.has('PROCESS') || /\b(step \d|stage \d|pipeline|workflow|how it works)\b/i.test(lower)) {
    return 'process';
  }
  if ((labels.has('NUMERIC') || labels.has('METRIC') || labels.has('FINANCIAL')) && text.length < 220) {
    return 'statistic';
  }
  if (labels.has('CITATION') || /\b(reference|citation|appendix|bibliography)\b/i.test(lower)) {
    return 'reference';
  }
  if (index === total - 1 && /\b(conclusion|summary|next steps|takeaway|recommendation)\b/i.test(lower)) {
    return 'conclusion';
  }
  return text.length > 140 ? 'argument' : 'supporting_point';
}

export function extractSemanticBlocks(rawContent: string, sourceId?: string): SemanticBlock[] {
  const paragraphs = rawContent
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return paragraphs.map((text, idx) => {
    const tokens = tokenizeText(text);
    const numericSignals = tokens.filter((t) => t.label === 'NUMERIC' || t.label === 'YEAR').map((t) => t.raw);
    const wordCount = tokens.length;
    const densityScore = Math.min(1, Number((wordCount / 85).toFixed(2)));

    return {
      id: `blk-${idx + 1}`,
      role: classifySemanticBlock(text, idx, paragraphs.length),
      text,
      tokens,
      densityScore,
      numericSignals,
      sourceId,
    };
  });
}
