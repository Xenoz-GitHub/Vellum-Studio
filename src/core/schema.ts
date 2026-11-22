import { z } from 'zod';

export const PX_PER_INCH = 96;

export function pxToInches(px: number): number {
  return Number((px / PX_PER_INCH).toFixed(4));
}

export function inchesToPx(inches: number): number {
  return Math.round(inches * PX_PER_INCH);
}

export const AspectRatioSchema = z.enum([
  '16:9',
  '4:3',
  '1:1',
  '9:16',
  'a4',
  'letter',
  'a5',
  'book',
  'custom',
]);
export type AspectRatio = z.infer<typeof AspectRatioSchema>;

export function dimensionsForAspectRatio(ratio: AspectRatio): { width: number; height: number } {
  switch (ratio) {
    case '4:3':
      return { width: 1024, height: 768 };
    case '1:1':
      return { width: 960, height: 960 };
    case '9:16':
      return { width: 720, height: 1280 };
    case 'a4':
      return { width: 794, height: 1123 };
    case 'letter':
      return { width: 816, height: 1056 };
    case 'a5':
      return { width: 559, height: 794 };
    case 'book':
      return { width: 720, height: 1020 };
    case 'custom':
    case '16:9':
    default:
      return { width: 1280, height: 720 };
  }
}

export const DesignTokensSchema = z.object({
  id: z.string(),
  name: z.string(),
  colors: z.object({
    background: z.string(),
    surface: z.string(),
    ink: z.string(),
    muted: z.string(),
    accent: z.string(),
    accentSoft: z.string(),
    border: z.string(),
    chartPalette: z.array(z.string()).min(3),
  }),
  typography: z.object({
    displayFont: z.string(),
    bodyFont: z.string(),
    monoFont: z.string(),
    displayWeight: z.number().default(700),
    bodyWeight: z.number().default(400),
  }),
  spacing: z.object({
    slidePadding: z.number().default(56),
    gridGutter: z.number().default(24),
  }),
  radius: z.object({
    card: z.number().default(8),
    control: z.number().default(6),
  }),
});
export type DesignTokens = z.infer<typeof DesignTokensSchema>;

export const ElementAnimationSchema = z.enum([
  'none',
  'fade-up',
  'fade-in',
  'slide-left',
  'slide-right',
  'scale-in',
  'pop',
  'float',
  'bounce',
  'pulse',
  'spin-slow',
  'wiggle',
]);
export type ElementAnimation = z.infer<typeof ElementAnimationSchema>;

export const ElementShadowSchema = z.enum(['none', 'soft', 'elevated', 'glow']);
export type ElementShadow = z.infer<typeof ElementShadowSchema>;

const BaseElementSchema = z.object({
  id: z.string(),
  name: z.string().default('Element'),
  x: z.number(),
  y: z.number(),
  width: z.number().min(2),
  height: z.number().min(2),
  rotation: z.number().default(0),
  zIndex: z.number().default(1),
  opacity: z.number().min(0).max(1).default(1),
  visible: z.boolean().default(true),
  locked: z.boolean().default(false),
  groupId: z.string().optional(),
  animation: ElementAnimationSchema.default('none').optional(),
  animationDelay: z.number().min(0).max(3000).default(0).optional(),
  shadow: ElementShadowSchema.default('none').optional(),
  backdropBlur: z.number().min(0).max(40).default(0).optional(),
});

export const TextElementSchema = BaseElementSchema.extend({
  type: z.literal('text'),
  content: z.string(),
  fontFamily: z.string().default('Plus Jakarta Sans'),
  fontSize: z.number().min(8).max(180).default(20),
  fontWeight: z.number().min(300).max(900).default(400),
  fontStyle: z.enum(['normal', 'italic']).default('normal'),
  lineHeight: z.number().min(0.8).max(3).default(1.35),
  letterSpacing: z.number().min(-0.1).max(0.5).default(0),
  textAlign: z.enum(['left', 'center', 'right']).default('left'),
  color: z.string().default('#191B1F'),
  backgroundColor: z.string().optional(),
  gradientText: z.string().optional(),
  textShadow: z.string().optional(),
  textEffect: z.enum(['none', 'sticker-outline', 'ransom-cutout']).default('none').optional(),
  outlineColor: z.string().optional(),
  outlineWidth: z.number().min(0).max(24).optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().min(0).max(10).default(0).optional(),
  strokeColor: z.string().optional(),
  borderRadius: z.number().default(0),
  padding: z.number().default(4),
  semanticRole: z.enum(['title', 'subtitle', 'kicker', 'body', 'caption', 'quote', 'metric']).optional(),
});

export const ShapeElementSchema = BaseElementSchema.extend({
  type: z.literal('shape'),
  shapeKind: z
    .enum([
      'rect',
      'rounded-rect',
      'ellipse',
      'line',
      'arrow',
      'triangle',
      'diamond',
      'star',
      'hexagon',
      'pentagon',
      'heart',
      'pill',
      'badge-burst',
      'speech-bubble',
      'ribbon-banner',
    ])
    .default('rect'),
  fill: z.string().default('#EFEDE7'),
  gradient: z.string().optional(),
  stroke: z.string().default('#D0CEC6'),
  strokeWidth: z.number().min(0).max(20).default(0),
  strokeColor: z.string().optional(),
  strokeDashArray: z.string().optional(),
  strokeLineCap: z.enum(['butt', 'round', 'square']).default('butt').optional(),
  strokeLineJoin: z.enum(['miter', 'round', 'bevel']).default('miter').optional(),
  borderRadius: z.number().min(0).max(9999).default(8),
  blur: z.number().min(0).max(160).default(0).optional(),
  blendMode: z.enum(['normal', 'multiply', 'screen', 'overlay']).default('normal').optional(),
});

export const ImageElementSchema = BaseElementSchema.extend({
  type: z.literal('image'),
  src: z.string(),
  originalSrc: z.string().optional(),
  cutoutMode: z.enum(['none', 'auto', 'manual']).optional(),
  alt: z.string().default('Slide visual'),
  objectFit: z.enum(['cover', 'contain']).default('cover'),
  borderRadius: z.number().min(0).max(9999).default(8),
  stroke: z.string().optional(),
  strokeWidth: z.number().min(0).max(20).default(0).optional(),
  strokeColor: z.string().optional(),
  cropX: z.number().min(0).max(100).optional(),
  cropY: z.number().min(0).max(100).optional(),
  cropZoom: z.number().min(1).max(4).optional(),
  brightness: z.number().min(20).max(200).optional(),
  contrast: z.number().min(20).max(200).optional(),
  saturation: z.number().min(0).max(250).optional(),
  hueRotate: z.number().min(-180).max(180).optional(),
  blur: z.number().min(0).max(20).optional(),
  grayscale: z.number().min(0).max(100).optional(),
  sepia: z.number().min(0).max(100).optional(),
  vignette: z.number().min(0).max(100).default(0).optional(),
  mask: z.enum(['none', 'circle', 'rounded', 'star', 'hexagon', 'custom']).default('none').optional(),
  maskPath: z.string().optional(),
  caption: z.string().optional(),
});

export const IconElementSchema = BaseElementSchema.extend({
  type: z.literal('icon'),
  iconName: z.string().default('Layers'),
  color: z.string().default('#7D1935'),
  strokeWidth: z.number().default(1.75),
  colorMode: z.enum(['brand', 'mono']).default('brand').optional(),
});

export const ChartDatumSchema = z.object({
  label: z.string(),
  value: z.number(),
  color: z.string().optional(),
});

export const ChartElementSchema = BaseElementSchema.extend({
  type: z.literal('chart'),
  chartKind: z
    .enum(['bar', 'horizontal-bar', 'line', 'area', 'pie', 'donut', 'metric-bars'])
    .default('bar'),
  title: z.string().default('Chart'),
  data: z.array(ChartDatumSchema).min(1),
  showValues: z.boolean().default(true),
  showLegend: z.boolean().default(false),
  accentColor: z.string().default('#7D1935'),
  textColor: z.string().default('#191B1F'),
  surfaceColor: z.string().default('#FFFFFF'),
});

export const TableElementSchema = BaseElementSchema.extend({
  type: z.literal('table'),
  tableStyle: z.enum(['classic', 'striped', 'minimal', 'comparison', 'dark']).default('classic').optional(),
  headers: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())),
  headerBg: z.string().default('#191B1F'),
  headerColor: z.string().default('#FFFFFF'),
  cellBg: z.string().default('#FFFFFF'),
  stripeBg: z.string().optional(),
  textColor: z.string().default('#191B1F'),
  borderColor: z.string().default('#E6E4DE'),
});

export const CustomComponentElementSchema = BaseElementSchema.extend({
  type: z.literal('custom'),
  componentKey: z.string(),
  componentVersion: z.string().default('1.0.0'),
  props: z.record(z.string(), z.unknown()).default({}),
});

export const PresentationElementSchema = z.discriminatedUnion('type', [
  TextElementSchema,
  ShapeElementSchema,
  ImageElementSchema,
  IconElementSchema,
  ChartElementSchema,
  TableElementSchema,
  CustomComponentElementSchema,
]);

export type TextElement = z.infer<typeof TextElementSchema>;
export type ShapeElement = z.infer<typeof ShapeElementSchema>;
export type ImageElement = z.infer<typeof ImageElementSchema>;
export type IconElement = z.infer<typeof IconElementSchema>;
export type ChartElement = z.infer<typeof ChartElementSchema>;
export type TableElement = z.infer<typeof TableElementSchema>;
export type CustomComponentElement = z.infer<typeof CustomComponentElementSchema>;
export type PresentationElement = z.infer<typeof PresentationElementSchema>;

export const SlidePatternSchema = z.enum([
  'none',
  'dots',
  'grid',
  'editorial-lines',
  'diagonal',
  'noise-mesh',
  'checkerboard',
]);
export type SlidePattern = z.infer<typeof SlidePatternSchema>;

export const SlideBackgroundSchema = z.object({
  type: z.enum(['solid', 'gradient', 'image']).default('solid'),
  color: z.string().default('#FFFFFF'),
  gradient: z.string().optional(),
  imageSrc: z.string().optional(),
  pattern: SlidePatternSchema.default('none').optional(),
  patternOpacity: z.number().min(0).max(1).default(0.18).optional(),
  patternColor: z.string().optional(),
  overlay: z.string().optional(),
  vignette: z.number().min(0).max(100).default(0).optional(),
  vignetteColor: z.string().default('#000000').optional(),
  mask: z.enum(['none', 'radial', 'linear', 'custom']).default('none').optional(),
  maskOpacity: z.number().min(0).max(1).default(1).optional(),
});

export const SlideSchema = z.object({
  id: z.string(),
  order: z.number().int().min(0),
  layoutPattern: z.string().default('freeform'),
  title: z.string().default('Untitled Slide'),
  background: SlideBackgroundSchema.default({ type: 'solid', color: '#FFFFFF' }),
  speakerNotes: z.string().default(''),
  transition: z.enum(['none', 'fade', 'slide']).default('fade'),
  elements: z.array(PresentationElementSchema).default([]),
});
export type Slide = z.infer<typeof SlideSchema>;

export const SourceReferenceSchema = z.object({
  sourceId: z.string(),
  filename: z.string(),
  excerpt: z.string(),
  slideIds: z.array(z.string()).default([]),
});
export type SourceReference = z.infer<typeof SourceReferenceSchema>;

export const PresentationDocumentSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().default(''),
  category: z.string().default('Business'),
  aspectRatio: AspectRatioSchema.default('16:9'),
  width: z.number().default(1280),
  height: z.number().default(720),
  pageMargin: z.number().min(0).max(200).default(48).optional(),
  showMargins: z.boolean().default(false).optional(),
  themeId: z.string().default('gallery-alabaster'),
  tokens: DesignTokensSchema,
  slides: z.array(SlideSchema).min(1),
  sourceRefs: z.array(SourceReferenceSchema).default([]),
  version: z.number().int().min(1).default(1),
  updatedAt: z.string(),
});
export type PresentationDocument = z.infer<typeof PresentationDocumentSchema>;

export const SlideOutlineItemSchema = z.object({
  id: z.string(),
  order: z.number().int().min(0),
  title: z.string().min(1),
  purpose: z.string().default(''),
  layoutPattern: z.string().default('split-media'),
  keyPoints: z.array(z.string()).default([]),
  semanticType: z.enum([
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
  ]).default('argument'),
  sourceRef: z.string().optional(),
});
export type SlideOutlineItem = z.infer<typeof SlideOutlineItemSchema>;
