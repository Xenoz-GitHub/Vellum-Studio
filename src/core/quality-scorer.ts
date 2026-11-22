import type { PresentationDocument, PresentationElement, Slide } from './schema';

export interface QualityIssue {
  slideId: string;
  slideIndex: number;
  elementId?: string;
  severity: 'hard' | 'soft';
  code: string;
  message: string;
}

export interface QualityReport {
  diagnosticScore: number; // Diagnostic heuristic only (0..100), not an objective measure of perfection
  hardDefectCount: number;
  softDefectCount: number;
  issues: QualityIssue[];
  metrics: {
    alignmentConsistency: number;
    whitespaceRatio: number;
    layoutDiversity: number;
    contrastCompliance: number;
  };
  disclaimer: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

function relativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function contrastRatio(fgHex: string, bgHex: string): number {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  if (!fg || !bg) return 7;
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

function rectsOverlap(a: PresentationElement, b: PresentationElement): boolean {
  const margin = 4;
  return !(
    a.x + a.width - margin <= b.x ||
    b.x + b.width - margin <= a.x ||
    a.y + a.height - margin <= b.y ||
    b.y + b.height - margin <= a.y
  );
}

function resolveEffectiveBackgroundHex(
  el: PresentationElement,
  slide: Slide,
  fallbackBg: string
): string {
  if (el.type === 'text' && el.backgroundColor && hexToRgb(el.backgroundColor)) {
    return el.backgroundColor;
  }
  const cx = el.x + el.width / 2;
  const cy = el.y + el.height / 2;
  const enclosingShapes = slide.elements
    .filter(
      (candidate) =>
        candidate.visible &&
        candidate.id !== el.id &&
        candidate.type === 'shape' &&
        candidate.zIndex <= el.zIndex &&
        candidate.opacity >= 0.7 &&
        (candidate.blur ?? 0) === 0 &&
        cx >= candidate.x &&
        cx <= candidate.x + candidate.width &&
        cy >= candidate.y &&
        cy <= candidate.y + candidate.height &&
        hexToRgb(candidate.fill) !== null
    )
    .sort((a, b) => b.zIndex - a.zIndex);

  if (enclosingShapes.length > 0 && enclosingShapes[0].type === 'shape') {
    return enclosingShapes[0].fill;
  }
  return fallbackBg;
}

export function evaluatePresentationQuality(doc: PresentationDocument): QualityReport {
  const issues: QualityIssue[] = [];
  let contrastChecks = 0;
  let contrastPasses = 0;
  let totalWhitespaceRatio = 0;
  const patterns: string[] = [];

  doc.slides.forEach((slide, idx) => {
    patterns.push(slide.layoutPattern);
    const slideArea = doc.width * doc.height;
    let coveredArea = 0;

    for (const el of slide.elements) {
      if (!el.visible) continue;
      const isAmbientShape =
        el.type === 'shape' && ((el.blur ?? 0) > 0 || el.opacity <= 0.45);
      if (!isAmbientShape) {
        coveredArea += el.width * el.height;
      }

      if (el.width <= 0 || el.height <= 0) {
        issues.push({
          slideId: slide.id,
          slideIndex: idx,
          elementId: el.id,
          severity: 'hard',
          code: 'INVALID_DIMENSIONS',
          message: `Slide ${idx + 1} has an element with non-positive dimensions.`,
        });
      }

      if (
        !isAmbientShape &&
        (el.x < 0 || el.y < 0 || el.x + el.width > doc.width + 2 || el.y + el.height > doc.height + 2)
      ) {
        issues.push({
          slideId: slide.id,
          slideIndex: idx,
          elementId: el.id,
          severity: 'hard',
          code: 'CANVAS_OVERFLOW',
          message: `Slide ${idx + 1} element "${el.name}" extends outside the ${doc.width}x${doc.height} canvas.`,
        });
      }

      if (el.type === 'text') {
        const bg = resolveEffectiveBackgroundHex(
          el,
          slide,
          slide.background.color || doc.tokens.colors.background || '#FFFFFF'
        );
        const ratio = contrastRatio(el.color, bg);
        contrastChecks++;
        const minRequired = el.fontSize >= 24 ? 3.0 : 4.5;
        if (el.gradientText || ratio >= minRequired) {
          contrastPasses++;
        } else {
          issues.push({
            slideId: slide.id,
            slideIndex: idx,
            elementId: el.id,
            severity: 'hard',
            code: 'LOW_CONTRAST',
            message: `Text "${el.content.slice(0, 28)}..." contrast ${ratio}:1 is below ${minRequired}:1.`,
          });
        }

        if (el.fontSize < 12) {
          issues.push({
            slideId: slide.id,
            slideIndex: idx,
            elementId: el.id,
            severity: 'soft',
            code: 'SMALL_TEXT',
            message: `Text on slide ${idx + 1} is ${el.fontSize}px (recommended >= 13px for readability).`,
          });
        }
      }
    }

    const textEls = slide.elements.filter((e) => e.visible && e.type === 'text' && e.opacity > 0.25);
    for (let i = 0; i < textEls.length; i++) {
      for (let j = i + 1; j < textEls.length; j++) {
        if (rectsOverlap(textEls[i], textEls[j])) {
          issues.push({
            slideId: slide.id,
            slideIndex: idx,
            elementId: textEls[j].id,
            severity: 'hard',
            code: 'TEXT_OVERLAP',
            message: `Two text elements overlap on slide ${idx + 1}.`,
          });
        }
      }
    }

    const rawCoverage = Math.min(1, coveredArea / slideArea);
    totalWhitespaceRatio += Math.max(0, 1 - rawCoverage);

    if (idx > 0 && slide.layoutPattern === doc.slides[idx - 1].layoutPattern && slide.layoutPattern !== 'freeform') {
      issues.push({
        slideId: slide.id,
        slideIndex: idx,
        severity: 'soft',
        code: 'REPEATED_LAYOUT',
        message: `Slide ${idx + 1} repeats the "${slide.layoutPattern}" layout from the previous slide.`,
      });
    }
  });

  const hardDefectCount = issues.filter((i) => i.severity === 'hard').length;
  const softDefectCount = issues.filter((i) => i.severity === 'soft').length;
  const uniquePatterns = new Set(patterns).size;
  const layoutDiversity = Math.round((uniquePatterns / Math.max(1, doc.slides.length)) * 100);
  const contrastCompliance = contrastChecks > 0 ? Math.round((contrastPasses / contrastChecks) * 100) : 100;
  const avgWhitespace = Math.round((totalWhitespaceRatio / Math.max(1, doc.slides.length)) * 100);
  const alignmentConsistency = Math.max(40, 100 - hardDefectCount * 12);

  const rawScore = Math.max(
    15,
    Math.min(98, 100 - hardDefectCount * 14 - softDefectCount * 5)
  );

  return {
    diagnosticScore: rawScore,
    hardDefectCount,
    softDefectCount,
    issues,
    metrics: {
      alignmentConsistency,
      whitespaceRatio: avgWhitespace,
      layoutDiversity,
      contrastCompliance,
    },
    disclaimer: 'Diagnostic heuristic score for layout, bounds, contrast, and rhythm checks; not a claim of objective perfection.',
  };
}

export function autoRepairDocument(doc: PresentationDocument): PresentationDocument {
  const repairedSlides: Slide[] = doc.slides.map((slide) => {
    const bgHex = slide.background.color || doc.tokens.colors.background || '#FFFFFF';
    const fixedElements = slide.elements.map((el) => {
      const clampedWidth = Math.min(el.width, doc.width - 16);
      const clampedHeight = Math.min(el.height, doc.height - 16);
      const clampedX = Math.max(8, Math.min(el.x, doc.width - clampedWidth - 8));
      const clampedY = Math.max(8, Math.min(el.y, doc.height - clampedHeight - 8));

      if (el.type === 'text') {
        const bg = resolveEffectiveBackgroundHex(el, slide, bgHex);
        let color = el.color;
        if (contrastRatio(color, bg) < 4.5) {
          color = contrastRatio('#191B1F', bg) >= contrastRatio('#FFFFFF', bg) ? '#191B1F' : '#FFFFFF';
        }
        return {
          ...el,
          x: clampedX,
          y: clampedY,
          width: clampedWidth,
          height: clampedHeight,
          color,
        };
      }

      return {
        ...el,
        x: clampedX,
        y: clampedY,
        width: clampedWidth,
        height: clampedHeight,
      };
    });

    return {
      ...slide,
      elements: fixedElements,
    };
  });

  return {
    ...doc,
    slides: repairedSlides,
  };
}
