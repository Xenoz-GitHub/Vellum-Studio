import type { PresentationDocument, Slide, PresentationElement } from '../core/schema';
import { dimensionsForAspectRatio } from '../core/schema';
import { DESIGN_TOKEN_PRESETS } from '../core/seed-data';
import crypto from 'node:crypto';

/**
 * Algorithmic Design Generation System
 * Uses patterns, calculations, and design rules instead of external AI APIs
 */

export interface GenerationRequest {
  prompt: string;
  slideCount: number;
  category: string;
  themeId?: string;
  aspectRatio?: string;
  layoutPatterns?: string[];
}

export interface TokenUsage {
  tokensUsed: number;
  creditsDeducted: number;
}

// Tokenizer - calculates complexity tokens based on request parameters
export function calculateTokens(request: GenerationRequest): TokenUsage {
  let tokens = 0;
  
  // Base tokens for generation
  tokens += 100;
  
  // Tokens per slide
  tokens += request.slideCount * 50;
  
  // Complexity based on prompt length
  tokens += Math.ceil(request.prompt.length / 10);
  
  // Category complexity multipliers
  const categoryMultipliers: Record<string, number> = {
    'Business': 1.0,
    'Tech': 1.2,
    'Creative': 1.3,
    'Education': 1.1,
    'Marketing': 1.2,
  };
  
  const multiplier = categoryMultipliers[request.category] || 1.0;
  tokens = Math.ceil(tokens * multiplier);
  
  // Convert tokens to credits (10 tokens = 1 credit)
  const credits = Math.ceil(tokens / 10);
  
  return { tokensUsed: tokens, creditsDeducted: credits };
}

// Layout pattern selector based on slide purpose
export function selectLayoutPattern(slideIndex: number, totalSlides: number, category: string): string {
  const patterns = [
    'title-hero',
    'split-media',
    'full-bleed-image',
    'centered-content',
    'three-column',
    'quote-emphasis',
    'data-showcase',
    'timeline',
    'comparison',
    'conclusion',
  ];
  
  if (slideIndex === 0) return 'title-hero';
  if (slideIndex === totalSlides - 1) return 'conclusion';
  
  // Distribute patterns algorithmically
  const patternIndex = slideIndex % (patterns.length - 2) + 1;
  return patterns[patternIndex];
}

// Color harmony calculator
export function calculateHarmoniousColor(baseColor: string, harmony: 'complementary' | 'analogous' | 'triadic'): string {
  // Simple HSL color harmony calculation
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  // Apply harmony transformation
  switch (harmony) {
    case 'complementary':
      h = (h + 0.5) % 1;
      break;
    case 'analogous':
      h = (h + 0.083) % 1; // 30 degrees
      break;
    case 'triadic':
      h = (h + 0.333) % 1; // 120 degrees
      break;
  }
  
  // Convert back to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return '#' + 
      Math.round(r * 255).toString(16).padStart(2, '0') +
      Math.round(g * 255).toString(16).padStart(2, '0') +
      Math.round(b * 255).toString(16).padStart(2, '0');
  };
  
  return hslToRgb(h, s, l);
}

// Element positioning algorithm using golden ratio and rule of thirds
export function calculateOptimalPosition(
  canvasWidth: number,
  canvasHeight: number,
  elementIndex: number,
  layoutPattern: string
): { x: number; y: number; width: number; height: number } {
  const GOLDEN_RATIO = 1.618;
  const margin = 56;
  
  switch (layoutPattern) {
    case 'title-hero':
      return {
        x: margin,
        y: canvasHeight / 3,
        width: canvasWidth - margin * 2,
        height: canvasHeight / 3,
      };
      
    case 'split-media':
      if (elementIndex === 0) {
        return {
          x: margin,
          y: margin,
          width: (canvasWidth - margin * 3) / 2,
          height: canvasHeight - margin * 2,
        };
      }
      return {
        x: canvasWidth / 2 + margin / 2,
        y: margin,
        width: (canvasWidth - margin * 3) / 2,
        height: canvasHeight - margin * 2,
      };
      
    case 'centered-content':
      const contentWidth = canvasWidth / GOLDEN_RATIO;
      return {
        x: (canvasWidth - contentWidth) / 2,
        y: canvasHeight / 4,
        width: contentWidth,
        height: canvasHeight / 2,
      };
      
    default:
      return {
        x: margin,
        y: margin + (elementIndex * 120),
        width: canvasWidth - margin * 2,
        height: 100,
      };
  }
}

// Generate presentation algorithmically
export function generatePresentation(request: GenerationRequest): PresentationDocument {
  const tokens = DESIGN_TOKEN_PRESETS.find(t => t.id === request.themeId) || DESIGN_TOKEN_PRESETS[0];
  const { width, height } = dimensionsForAspectRatio(request.aspectRatio as any || '16:9');
  
  const slides: Slide[] = [];
  
  for (let i = 0; i < request.slideCount; i++) {
    const layoutPattern = selectLayoutPattern(i, request.slideCount, request.category);
    const slideId = `slide-${crypto.randomUUID().slice(0, 8)}`;
    
    const elements: PresentationElement[] = [];
    
    // Generate title element for each slide
    const titlePos = calculateOptimalPosition(width, height, 0, layoutPattern);
    elements.push({
      id: `el-${crypto.randomUUID().slice(0, 8)}`,
      name: 'Title',
      type: 'text',
      x: titlePos.x,
      y: titlePos.y,
      width: titlePos.width,
      height: 80,
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      visible: true,
      locked: false,
      content: i === 0 ? request.prompt : `Slide ${i + 1}`,
      fontFamily: tokens.typography.displayFont,
      fontSize: i === 0 ? 54 : 36,
      fontWeight: tokens.typography.displayWeight,
      fontStyle: 'normal',
      lineHeight: 1.12,
      letterSpacing: -0.02,
      textAlign: 'left',
      color: tokens.colors.ink,
      borderRadius: 0,
      padding: 4,
      semanticRole: 'title',
    });
    
    // Add decorative shape based on pattern
    if (layoutPattern !== 'title-hero') {
      const accentColor = calculateHarmoniousColor(tokens.colors.accent, 'complementary');
      elements.push({
        id: `el-${crypto.randomUUID().slice(0, 8)}`,
        name: 'Accent Shape',
        type: 'shape',
        x: width - 200,
        y: 40,
        width: 120,
        height: 120,
        rotation: 0,
        zIndex: 1,
        opacity: 0.15,
        visible: true,
        locked: false,
        shapeKind: 'hexagon',
        fill: accentColor,
        stroke: tokens.colors.accent,
        strokeWidth: 2,
        strokeColor: tokens.colors.accent,
        borderRadius: 0,
      });
    }
    
    slides.push({
      id: slideId,
      order: i,
      layoutPattern,
      title: i === 0 ? request.prompt : `Slide ${i + 1}`,
      background: {
        type: 'solid',
        color: tokens.colors.background,
        vignette: 0,
      },
      speakerNotes: '',
      transition: 'fade',
      elements,
    });
  }
  
  return {
    id: `pres-${crypto.randomUUID().slice(0, 8)}`,
    title: request.prompt,
    description: `Generated presentation with ${request.slideCount} slides`,
    category: request.category,
    aspectRatio: (request.aspectRatio as any) || '16:9',
    width,
    height,
    themeId: tokens.id,
    tokens,
    slides,
    sourceRefs: [],
    version: 1,
    updatedAt: new Date().toISOString(),
  };
}

// Export utility functions
export const AlgorithmicGenerator = {
  calculateTokens,
  selectLayoutPattern,
  calculateHarmoniousColor,
  calculateOptimalPosition,
  generatePresentation,
};
