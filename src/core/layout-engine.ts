import type {
  DesignTokens,
  PresentationDocument,
  PresentationElement,
  Slide,
  SlideOutlineItem,
} from './schema';
import { dimensionsForAspectRatio } from './schema';
import { autoRepairDocument } from './quality-scorer';

export interface LayoutCandidateInput {
  title: string;
  description: string;
  category: string;
  outline: SlideOutlineItem[];
  tokens: DesignTokens;
  imageAssets?: string[];
  sourceRefs?: { sourceId: string; filename: string; excerpt: string }[];
  allowCustomComponents?: boolean;
}

function estimateTextHeight(text: string, fontSize: number, boxWidth: number, lineHeight = 1.35): number {
  const avgCharWidth = fontSize * 0.52;
  const charsPerLine = Math.max(12, Math.floor((boxWidth - 16) / avgCharWidth));
  const lines = text
    .split('\n')
    .reduce((acc, line) => acc + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);
  return Math.max(fontSize * lineHeight + 16, Math.ceil(lines * fontSize * lineHeight) + 18);
}

function buildSlideElementsForPattern(
  item: SlideOutlineItem,
  idx: number,
  total: number,
  tokens: DesignTokens,
  width: number,
  height: number,
  imageAssets: string[],
  allowCustomComponents: boolean
): { layoutPattern: string; elements: PresentationElement[] } {
  const pad = tokens.spacing.slidePadding || 56;
  const innerW = width - pad * 2;
  const { colors, typography } = tokens;
  const slideId = item.id || `slide-${idx + 1}`;
  const points = item.keyPoints.length > 0 ? item.keyPoints : [item.purpose || item.title];
  const pattern = idx === 0 ? 'title-hero' : item.layoutPattern;

  const elements: PresentationElement[] = [];

  if (pattern === 'title-hero') {
    const hasHeroImage = imageAssets.length > 0;
    const textColW = hasHeroImage ? Math.round(innerW * 0.56) : Math.round(innerW * 0.78);

    elements.push({
      id: `${slideId}-kicker`,
      name: 'Deck Kicker',
      type: 'text',
      x: pad,
      y: pad + 32,
      width: textColW,
      height: 36,
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      visible: true,
      locked: false,
      content: `${String(idx + 1).padStart(2, '0')} · ${item.semanticType.toUpperCase()}`,
      fontFamily: typography.monoFont,
      fontSize: 13,
      fontWeight: 500,
      fontStyle: 'normal',
      lineHeight: 1.3,
      letterSpacing: 0.08,
      textAlign: 'left',
      color: colors.accent,
      borderRadius: 0,
      padding: 4,
      semanticRole: 'kicker',
    });

    const titleH = Math.min(260, estimateTextHeight(item.title, 54, textColW, 1.12));
    elements.push({
      id: `${slideId}-title`,
      name: 'Hero Headline',
      type: 'text',
      x: pad,
      y: pad + 82,
      width: textColW,
      height: titleH,
      rotation: 0,
      zIndex: 3,
      opacity: 1,
      visible: true,
      locked: false,
      content: item.title,
      fontFamily: typography.displayFont,
      fontSize: 52,
      fontWeight: typography.displayWeight,
      fontStyle: 'normal',
      lineHeight: 1.12,
      letterSpacing: -0.02,
      textAlign: 'left',
      color: colors.ink,
      borderRadius: 0,
      padding: 4,
      semanticRole: 'title',
    });

    const subText = points.slice(0, 2).join(' — ');
    elements.push({
      id: `${slideId}-subtitle`,
      name: 'Subtitle',
      type: 'text',
      x: pad,
      y: pad + 96 + titleH,
      width: textColW,
      height: 110,
      rotation: 0,
      zIndex: 3,
      opacity: 1,
      visible: true,
      locked: false,
      content: subText,
      fontFamily: typography.bodyFont,
      fontSize: 20,
      fontWeight: 400,
      fontStyle: 'normal',
      lineHeight: 1.45,
      letterSpacing: 0,
      textAlign: 'left',
      color: colors.muted,
      borderRadius: 0,
      padding: 4,
      semanticRole: 'subtitle',
    });

    if (hasHeroImage) {
      elements.push({
        id: `${slideId}-hero-img`,
        name: 'Hero Visual',
        type: 'image',
        x: pad + textColW + 36,
        y: pad + 24,
        width: innerW - textColW - 36,
        height: height - pad * 2 - 48,
        rotation: 0,
        zIndex: 2,
        opacity: 1,
        visible: true,
        locked: false,
        src: imageAssets[0],
        alt: item.title,
        objectFit: 'cover',
        borderRadius: tokens.radius.card,
      });
    } else {
      elements.push({
        id: `${slideId}-accent-rule`,
        name: 'Editorial Rule',
        type: 'shape',
        x: pad,
        y: height - pad - 28,
        width: 120,
        height: 4,
        rotation: 0,
        zIndex: 1,
        opacity: 1,
        visible: true,
        locked: false,
        shapeKind: 'rect',
        fill: colors.accent,
        stroke: colors.accent,
        strokeWidth: 0,
        borderRadius: 2,
      });
    }

    return { layoutPattern: 'title-hero', elements };
  }

  // Standard slide header shared across editorial patterns
  elements.push({
    id: `${slideId}-kicker`,
    name: 'Section Index',
    type: 'text',
    x: pad,
    y: pad - 8,
    width: 360,
    height: 30,
    rotation: 0,
    zIndex: 2,
    opacity: 1,
    visible: true,
    locked: false,
    content: `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')} · ${item.semanticType.toUpperCase()}`,
    fontFamily: typography.monoFont,
    fontSize: 12,
    fontWeight: 500,
    fontStyle: 'normal',
    lineHeight: 1.3,
    letterSpacing: 0.06,
    textAlign: 'left',
    color: colors.accent,
    borderRadius: 0,
    padding: 2,
    semanticRole: 'kicker',
  });

  const headerH = Math.min(112, estimateTextHeight(item.title, 34, innerW, 1.18));
  elements.push({
    id: `${slideId}-title`,
    name: 'Slide Title',
    type: 'text',
    x: pad,
    y: pad + 26,
    width: innerW,
    height: headerH,
    rotation: 0,
    zIndex: 2,
    opacity: 1,
    visible: true,
    locked: false,
    content: item.title,
    fontFamily: typography.displayFont,
    fontSize: 34,
    fontWeight: typography.displayWeight,
    fontStyle: 'normal',
    lineHeight: 1.18,
    letterSpacing: -0.015,
    textAlign: 'left',
    color: colors.ink,
    borderRadius: 0,
    padding: 2,
    semanticRole: 'title',
  });

  const bodyTop = pad + 44 + headerH;
  const bodyH = height - bodyTop - pad;

  if (pattern === 'data-chart-split') {
    const leftW = Math.round(innerW * 0.44);
    const rightW = innerW - leftW - 36;

    elements.push({
      id: `${slideId}-narrative`,
      name: 'Key Findings',
      type: 'text',
      x: pad,
      y: bodyTop,
      width: leftW,
      height: bodyH - 40,
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      visible: true,
      locked: false,
      content: points.map((p) => `• ${p}`).join('\n\n'),
      fontFamily: typography.bodyFont,
      fontSize: 18,
      fontWeight: 400,
      fontStyle: 'normal',
      lineHeight: 1.5,
      letterSpacing: 0,
      textAlign: 'left',
      color: colors.ink,
      borderRadius: 0,
      padding: 4,
      semanticRole: 'body',
    });

    elements.push({
      id: `${slideId}-chart`,
      name: 'Data Visualization',
      type: 'chart',
      x: pad + leftW + 36,
      y: bodyTop,
      width: rightW,
      height: Math.min(390, bodyH),
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      visible: true,
      locked: false,
      chartKind: 'bar',
      title: 'Observed Progression',
      data: [
        { label: 'Q1', value: 38, color: colors.chartPalette[0] },
        { label: 'Q2', value: 56, color: colors.chartPalette[1] },
        { label: 'Q3', value: 74, color: colors.chartPalette[2] },
        { label: 'Q4', value: 92, color: colors.accent },
      ],
      showValues: true,
      showLegend: false,
      accentColor: colors.accent,
      textColor: colors.ink,
      surfaceColor: colors.surface,
    });
    return { layoutPattern: 'data-chart-split', elements };
  }

  if (pattern === 'comparison-two-col' && allowCustomComponents) {
    const mid = Math.ceil(points.length / 2);
    elements.push({
      id: `${slideId}-comparison`,
      name: 'Two-Column Comparison',
      type: 'custom',
      x: pad,
      y: bodyTop + 12,
      width: innerW,
      height: Math.min(360, bodyH - 16),
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      visible: true,
      locked: false,
      componentKey: 'comparison-matrix',
      componentVersion: '1.0.0',
      props: {
        leftTitle: 'Baseline Approach',
        leftItems: points.slice(0, mid),
        rightTitle: 'Target Architecture',
        rightItems: points.slice(mid).length > 0 ? points.slice(mid) : ['Structured alignment', 'Measurable impact'],
        accentColor: colors.accent,
      },
    });
    return { layoutPattern: 'comparison-two-col', elements };
  }

  if (pattern === 'timeline-horizontal' && allowCustomComponents) {
    elements.push({
      id: `${slideId}-timeline`,
      name: 'Milestone Roadmap',
      type: 'custom',
      x: pad,
      y: bodyTop + 28,
      width: innerW,
      height: 250,
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      visible: true,
      locked: false,
      componentKey: 'milestone-timeline',
      componentVersion: '1.0.0',
      props: {
        heading: item.purpose || 'Execution Sequence',
        stages: points.slice(0, 4).map((p, i) => `0${i + 1}. Phase ${i + 1} | Step ${i + 1} | ${p}`),
        accentColor: colors.accent,
      },
    });
    return { layoutPattern: 'timeline-horizontal', elements };
  }

  if (pattern === 'editorial-quote' && allowCustomComponents) {
    elements.push({
      id: `${slideId}-quote`,
      name: 'Editorial Pull-Quote',
      type: 'custom',
      x: pad,
      y: bodyTop + 20,
      width: innerW,
      height: 290,
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      visible: true,
      locked: false,
      componentKey: 'quote-pullout',
      componentVersion: '1.0.0',
      props: {
        quote: points[0] || item.purpose || item.title,
        author: points[1] || 'Source Synthesis',
        role: item.sourceRef || 'Primary Brief',
        accentColor: colors.accent,
      },
    });
    return { layoutPattern: 'editorial-quote', elements };
  }

  if (pattern === 'kpi-trio' && allowCustomComponents) {
    const cards = points.slice(0, 3);
    const gap = 24;
    const cardW = Math.floor((innerW - gap * (cards.length - 1)) / cards.length);
    cards.forEach((pt, cIdx) => {
      const numMatch = pt.match(/([+-]?\d[\d,.]*%?|\$\d[\d,.]*[BMK]?)/);
      const val = numMatch ? numMatch[1] : `0${cIdx + 1}`;
      elements.push({
        id: `${slideId}-kpi-${cIdx}`,
        name: `Metric Card ${cIdx + 1}`,
        type: 'custom',
        x: pad + cIdx * (cardW + gap),
        y: bodyTop + 32,
        width: cardW,
        height: 230,
        rotation: 0,
        zIndex: 2,
        opacity: 1,
        visible: true,
        locked: false,
        componentKey: 'editorial-kpi-card',
        componentVersion: '1.0.0',
        props: {
          label: `Key Indicator ${cIdx + 1}`,
          value: val,
          delta: pt,
          footnote: item.sourceRef || 'Verified outline',
          accentColor: colors.accent,
        },
      });
    });
    return { layoutPattern: 'kpi-trio', elements };
  }

  // Default: split-media or structured two-column editorial text
  const imgSrc = imageAssets[(idx - 1) % Math.max(1, imageAssets.length)];
  if (imgSrc && idx % 2 === 1) {
    const textW = Math.round(innerW * 0.52);
    const imgW = innerW - textW - 36;
    elements.push({
      id: `${slideId}-body`,
      name: 'Editorial Points',
      type: 'text',
      x: pad,
      y: bodyTop,
      width: textW,
      height: bodyH - 36,
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      visible: true,
      locked: false,
      content: points.map((p) => `• ${p}`).join('\n\n'),
      fontFamily: typography.bodyFont,
      fontSize: 19,
      fontWeight: 400,
      fontStyle: 'normal',
      lineHeight: 1.5,
      letterSpacing: 0,
      textAlign: 'left',
      color: colors.ink,
      borderRadius: 0,
      padding: 4,
      semanticRole: 'body',
    });
    elements.push({
      id: `${slideId}-visual`,
      name: 'Slide Image',
      type: 'image',
      x: pad + textW + 36,
      y: bodyTop,
      width: imgW,
      height: Math.min(410, bodyH - 20),
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      visible: true,
      locked: false,
      src: imgSrc,
      alt: item.title,
      objectFit: 'cover',
      borderRadius: tokens.radius.card,
    });
    return { layoutPattern: 'split-media', elements };
  }

  // Clean multi-card structured grid
  const cols = Math.min(3, Math.max(1, points.length));
  const gap = 24;
  const colW = Math.floor((innerW - gap * (cols - 1)) / cols);
  points.slice(0, 3).forEach((pt, pIdx) => {
    elements.push({
      id: `${slideId}-card-bg-${pIdx}`,
      name: `Panel ${pIdx + 1}`,
      type: 'shape',
      x: pad + pIdx * (colW + gap),
      y: bodyTop + 12,
      width: colW,
      height: Math.min(340, bodyH - 28),
      rotation: 0,
      zIndex: 1,
      opacity: 1,
      visible: true,
      locked: false,
      shapeKind: 'rounded-rect',
      fill: colors.surface,
      stroke: colors.border,
      strokeWidth: 1,
      borderRadius: tokens.radius.card,
    });
    elements.push({
      id: `${slideId}-card-idx-${pIdx}`,
      name: `Panel Index ${pIdx + 1}`,
      type: 'text',
      x: pad + pIdx * (colW + gap) + 24,
      y: bodyTop + 34,
      width: colW - 48,
      height: 34,
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      visible: true,
      locked: false,
      content: `0${pIdx + 1}`,
      fontFamily: typography.monoFont,
      fontSize: 15,
      fontWeight: 600,
      fontStyle: 'normal',
      lineHeight: 1.2,
      letterSpacing: 0.04,
      textAlign: 'left',
      color: colors.accent,
      borderRadius: 0,
      padding: 2,
      semanticRole: 'kicker',
    });
    elements.push({
      id: `${slideId}-card-text-${pIdx}`,
      name: `Panel Copy ${pIdx + 1}`,
      type: 'text',
      x: pad + pIdx * (colW + gap) + 24,
      y: bodyTop + 76,
      width: colW - 48,
      height: Math.min(240, bodyH - 110),
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      visible: true,
      locked: false,
      content: pt,
      fontFamily: typography.bodyFont,
      fontSize: 18,
      fontWeight: 400,
      fontStyle: 'normal',
      lineHeight: 1.5,
      letterSpacing: 0,
      textAlign: 'left',
      color: colors.ink,
      borderRadius: 0,
      padding: 2,
      semanticRole: 'body',
    });
  });

  return { layoutPattern: 'editorial-columns', elements };
}

export function composePresentationFromOutline(
  id: string,
  input: LayoutCandidateInput
): PresentationDocument {
  const { width, height } = dimensionsForAspectRatio('16:9');
  const images = input.imageAssets || [];
  const allowCustom = input.allowCustomComponents ?? true;

  // Enforce slide-to-slide rhythm: avoid two consecutive non-title slides using identical pattern
  const patternCycle = images.length > 0
    ? ['split-media', 'editorial-columns', 'data-chart-split', 'kpi-trio', 'timeline-horizontal']
    : ['editorial-columns', 'data-chart-split', 'kpi-trio', 'timeline-horizontal', 'comparison-two-col'];
  let prevPattern = '';

  const slides: Slide[] = input.outline.map((item, idx) => {
    let chosenItem = { ...item };
    if (idx > 0 && chosenItem.layoutPattern === 'split-media' && images.length === 0) {
      chosenItem.layoutPattern = patternCycle[idx % patternCycle.length];
    }
    if (idx > 0 && chosenItem.layoutPattern === prevPattern) {
      const nextAlternative = patternCycle.find((p) => p !== prevPattern) || 'data-chart-split';
      chosenItem.layoutPattern = nextAlternative;
    }

    let built = buildSlideElementsForPattern(
      chosenItem,
      idx,
      input.outline.length,
      input.tokens,
      width,
      height,
      images,
      allowCustom
    );

    if (idx > 0 && built.layoutPattern === prevPattern) {
      chosenItem.layoutPattern = patternCycle.find((p) => p !== prevPattern && p !== built.layoutPattern) || 'data-chart-split';
      built = buildSlideElementsForPattern(
        chosenItem,
        idx,
        input.outline.length,
        input.tokens,
        width,
        height,
        images,
        allowCustom
      );
    }

    prevPattern = built.layoutPattern;

    return {
      id: item.id || `slide-${idx + 1}`,
      order: idx,
      layoutPattern: built.layoutPattern,
      title: item.title,
      background: {
        type: 'solid',
        color: input.tokens.colors.background,
      },
      speakerNotes: item.purpose || '',
      transition: 'fade',
      elements: built.elements,
    };
  });

  const doc: PresentationDocument = {
    id,
    title: input.title,
    description: input.description,
    category: input.category,
    aspectRatio: '16:9',
    width,
    height,
    themeId: input.tokens.id,
    tokens: input.tokens,
    slides,
    sourceRefs: (input.sourceRefs || []).map((s) => ({ ...s, slideIds: slides.map((sl) => sl.id) })),
    version: 1,
    updatedAt: new Date().toISOString(),
  };

  return autoRepairDocument(doc);
}
