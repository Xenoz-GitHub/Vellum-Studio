import type { PresentationDocument, Slide, PresentationElement } from '../core/schema';
import { dimensionsForAspectRatio } from '../core/schema';
import { DESIGN_TOKEN_PRESETS } from '../core/seed-data';
import crypto from 'node:crypto';

/**
 * ADVANCED Algorithmic Design Generation System
 * Comprehensive pattern-based generation with intelligent design rules
 */

export interface AdvancedGenerationRequest {
  prompt: string;
  slideCount: number;
  category: string;
  themeId?: string;
  aspectRatio?: string;
  designPreferences?: {
    useBorders?: boolean;
    useBackgrounds?: boolean;
    useElements?: boolean;
    fontStyle?: 'modern' | 'classic' | 'creative';
    colorScheme?: 'vibrant' | 'muted' | 'monochrome';
  };
}

export interface TokenUsage {
  tokensUsed: number;
  creditsDeducted: number;
}

// Enhanced tokenizer with more factors
export function calculateAdvancedTokens(request: AdvancedGenerationRequest): TokenUsage {
  let tokens = 0;
  
  // Base tokens
  tokens += 150;
  
  // Tokens per slide (more accurate)
  tokens += request.slideCount * 75;
  
  // Prompt complexity (words + special requirements)
  const words = request.prompt.split(/\s+/).length;
  tokens += words * 2;
  
  // Design complexity
  if (request.designPreferences?.useBorders) tokens += 25;
  if (request.designPreferences?.useBackgrounds) tokens += 30;
  if (request.designPreferences?.useElements) tokens += 40;
  
  // Category complexity
  const categoryMultipliers: Record<string, number> = {
    'Business': 1.0,
    'Tech': 1.3,
    'Creative': 1.5,
    'Education': 1.1,
    'Marketing': 1.3,
    'Science': 1.2,
    'Arts': 1.4,
  };
  
  const multiplier = categoryMultipliers[request.category] || 1.0;
  tokens = Math.ceil(tokens * multiplier);
  
  // Convert to credits (8 tokens = 1 credit)
  const credits = Math.ceil(tokens / 8);
  
  return { tokensUsed: tokens, creditsDeducted: credits };
}

// Intelligent layout selection based on content and position
export function selectIntelligentLayout(
  slideIndex: number,
  totalSlides: number,
  category: string,
  prompt: string
): string {
  const layouts = {
    opening: ['title-hero', 'full-bleed-image', 'centered-content'],
    body: ['split-media', 'three-column', 'data-showcase', 'comparison', 'quote-emphasis'],
    closing: ['conclusion', 'centered-content', 'quote-emphasis'],
  };
  
  // First slide - opening
  if (slideIndex === 0) {
    return layouts.opening[0]; // Always title-hero for first
  }
  
  // Last slide - closing
  if (slideIndex === totalSlides - 1) {
    return layouts.closing[0]; // Always conclusion
  }
  
  // Middle slides - intelligent selection
  const middleLayouts = layouts.body;
  
  // Detect content type from prompt
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('history') || lowerPrompt.includes('timeline')) {
    return 'timeline';
  }
  if (lowerPrompt.includes('compare') || lowerPrompt.includes('vs')) {
    return 'comparison';
  }
  if (lowerPrompt.includes('data') || lowerPrompt.includes('statistics')) {
    return 'data-showcase';
  }
  if (lowerPrompt.includes('quote') || lowerPrompt.includes('testimony')) {
    return 'quote-emphasis';
  }
  
  // Distribute remaining layouts
  return middleLayouts[slideIndex % middleLayouts.length];
}

// Advanced color harmony with multiple schemes
export function generateColorPalette(
  baseColor: string,
  scheme: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic'
): string[] {
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // RGB to HSL
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
  
  // Generate palette based on scheme
  const hues: number[] = [];
  
  switch (scheme) {
    case 'monochromatic':
      hues.push(h, h, h, h);
      break;
    case 'analogous':
      hues.push(h, (h + 0.083) % 1, (h - 0.083 + 1) % 1, h);
      break;
    case 'complementary':
      hues.push(h, (h + 0.5) % 1, h, (h + 0.5) % 1);
      break;
    case 'triadic':
      hues.push(h, (h + 0.333) % 1, (h + 0.666) % 1, h);
      break;
    case 'tetradic':
      hues.push(h, (h + 0.25) % 1, (h + 0.5) % 1, (h + 0.75) % 1);
      break;
  }
  
  // Convert back to hex
  return hues.map(hue => hslToHex(hue, s, l));
}

function hslToHex(h: number, s: number, l: number): string {
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
}

// Generate content for slides based on prompt analysis
export function generateSlideContent(
  slideIndex: number,
  totalSlides: number,
  prompt: string,
  category: string
): { title: string; subtitle: string; body: string[] } {
  const words = prompt.split(/\s+/);
  const mainTopic = words.slice(0, Math.min(5, words.length)).join(' ');
  
  if (slideIndex === 0) {
    return {
      title: prompt,
      subtitle: `A comprehensive ${category.toLowerCase()} presentation`,
      body: []
    };
  }
  
  if (slideIndex === totalSlides - 1) {
    return {
      title: 'Conclusion',
      subtitle: `Key takeaways from ${mainTopic}`,
      body: [
        'Summary of main points',
        'Actionable insights',
        'Future considerations'
      ]
    };
  }
  
  // Middle slides - generate contextual content
  const sectionTopics = [
    'Introduction & Overview',
    'Historical Context',
    'Key Developments',
    'Current Situation',
    'Impact & Significance',
    'Challenges & Opportunities',
    'Future Outlook',
    'Recommendations'
  ];
  
  const topic = sectionTopics[Math.min(slideIndex - 1, sectionTopics.length - 1)];
  
  return {
    title: topic,
    subtitle: `${topic} of ${mainTopic}`,
    body: [
      `Key aspect of ${topic.toLowerCase()}`,
      `Important details regarding ${mainTopic}`,
      `Significance in the broader context`
    ]
  };
}

// Generate comprehensive presentation
export function generateAdvancedPresentation(request: AdvancedGenerationRequest): PresentationDocument {
  const tokens = DESIGN_TOKEN_PRESETS.find(t => t.id === request.themeId) || DESIGN_TOKEN_PRESETS[0];
  const { width, height } = dimensionsForAspectRatio(request.aspectRatio as any || '16:9');
  
  // Generate color palette
  const colorPalette = generateColorPalette(tokens.colors.accent, 'triadic');
  
  const slides: Slide[] = [];
  
  for (let i = 0; i < request.slideCount; i++) {
    const layoutPattern = selectIntelligentLayout(i, request.slideCount, request.category, request.prompt);
    const content = generateSlideContent(i, request.slideCount, request.prompt, request.category);
    const slideId = `slide-${crypto.randomUUID().slice(0, 8)}`;
    
    const elements: PresentationElement[] = [];
    
    // Title element
    elements.push({
      id: `el-${crypto.randomUUID().slice(0, 8)}`,
      name: 'Title',
      type: 'text',
      x: 56,
      y: i === 0 ? height / 3 : 80,
      width: width - 112,
      height: i === 0 ? 120 : 80,
      rotation: 0,
      zIndex: 3,
      opacity: 1,
      visible: true,
      locked: false,
      content: content.title,
      fontFamily: tokens.typography.displayFont,
      fontSize: i === 0 ? 64 : 44,
      fontWeight: tokens.typography.displayWeight,
      fontStyle: 'normal',
      lineHeight: 1.1,
      letterSpacing: -0.02,
      textAlign: i === 0 ? 'center' : 'left',
      color: tokens.colors.ink,
      stroke: request.designPreferences?.useBorders ? tokens.colors.background : undefined,
      strokeWidth: request.designPreferences?.useBorders ? 1 : 0,
      strokeColor: request.designPreferences?.useBorders ? tokens.colors.background : undefined,
      borderRadius: 0,
      padding: 8,
      semanticRole: 'title',
    });
    
    // Subtitle/body content
    if (content.subtitle) {
      elements.push({
        id: `el-${crypto.randomUUID().slice(0, 8)}`,
        name: 'Subtitle',
        type: 'text',
        x: 56,
        y: i === 0 ? height / 2 + 20 : 180,
        width: width - 112,
        height: 60,
        rotation: 0,
        zIndex: 2,
        opacity: 0.9,
        visible: true,
        locked: false,
        content: content.subtitle,
        fontFamily: tokens.typography.bodyFont,
        fontSize: i === 0 ? 24 : 20,
        fontWeight: 400,
        fontStyle: 'normal',
        lineHeight: 1.5,
        letterSpacing: 0,
        textAlign: i === 0 ? 'center' : 'left',
        color: tokens.colors.muted,
        borderRadius: 0,
        padding: 4,
        semanticRole: 'subtitle',
      });
    }
    
    // Decorative elements if requested
    if (request.designPreferences?.useElements && i > 0) {
      // Add decorative shape
      elements.push({
        id: `el-${crypto.randomUUID().slice(0, 8)}`,
        name: 'Decorative Shape',
        type: 'shape',
        x: width - 180,
        y: 40,
        width: 120,
        height: 120,
        rotation: 15,
        zIndex: 1,
        opacity: 0.12,
        visible: true,
        locked: false,
        shapeKind: ['hexagon', 'star', 'diamond'][i % 3] as any,
        fill: colorPalette[i % colorPalette.length],
        stroke: tokens.colors.accent,
        strokeWidth: 3,
        strokeColor: tokens.colors.accent,
        strokeDashArray: '8 4',
        borderRadius: 0,
      });
    }
    
    // Add border frame if requested
    if (request.designPreferences?.useBorders) {
      elements.push({
        id: `el-${crypto.randomUUID().slice(0, 8)}`,
        name: 'Border Frame',
        type: 'shape',
        x: 24,
        y: 24,
        width: width - 48,
        height: height - 48,
        rotation: 0,
        zIndex: 0,
        opacity: 0.3,
        visible: true,
        locked: false,
        shapeKind: 'rounded-rect',
        fill: 'transparent',
        stroke: tokens.colors.accent,
        strokeWidth: 4,
        strokeColor: tokens.colors.accent,
        strokeDashArray: '20 10',
        borderRadius: 16,
      });
    }
    
    // Create slide
    slides.push({
      id: slideId,
      order: i,
      layoutPattern,
      title: content.title,
      background: {
        type: request.designPreferences?.useBackgrounds ? 'gradient' : 'solid',
        color: tokens.colors.background,
        gradient: request.designPreferences?.useBackgrounds 
          ? `linear-gradient(135deg, ${tokens.colors.background} 0%, ${tokens.colors.surface} 100%)`
          : undefined,
        pattern: request.designPreferences?.useBackgrounds ? 'dots' : 'none',
        patternOpacity: 0.08,
        patternColor: tokens.colors.accent,
        vignette: request.designPreferences?.useBackgrounds ? 20 : 0,
        vignetteColor: '#000000',
      },
      speakerNotes: `Speaker notes for ${content.title}`,
      transition: 'fade',
      elements,
    });
  }
  
  return {
    id: `pres-${crypto.randomUUID().slice(0, 8)}`,
    title: request.prompt,
    description: `Comprehensive presentation about ${request.prompt}`,
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

export const AdvancedAlgorithmicGenerator = {
  calculateAdvancedTokens,
  selectIntelligentLayout,
  generateColorPalette,
  generateSlideContent,
  generateAdvancedPresentation,
};
