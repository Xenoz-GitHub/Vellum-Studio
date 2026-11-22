import type { AspectRatio, ChartElement, DesignTokens, TableElement } from './schema';

export interface PageSizePreset {
  id: AspectRatio;
  label: string;
  subtitle: string;
  category: 'Presentation' | 'Social Media' | 'Print & Document' | 'Interactive Book';
  width: number;
  height: number;
  badge?: string;
}

export const PAGE_SIZE_PRESETS: PageSizePreset[] = [
  {
    id: '16:9',
    label: '16:9 Widescreen',
    subtitle: '1280 × 720 px · Slides & YouTube',
    category: 'Presentation',
    width: 1280,
    height: 720,
  },
  {
    id: '4:3',
    label: '4:3 Classic',
    subtitle: '1024 × 768 px · Editorial Deck',
    category: 'Presentation',
    width: 1024,
    height: 768,
  },
  {
    id: '1:1',
    label: '1:1 Square',
    subtitle: '960 × 960 px · Instagram & PubMat',
    category: 'Social Media',
    width: 960,
    height: 960,
    badge: 'Social',
  },
  {
    id: '9:16',
    label: '9:16 Vertical Story',
    subtitle: '720 × 1280 px · Reels, TikTok & Stories',
    category: 'Social Media',
    width: 720,
    height: 1280,
    badge: 'Social',
  },
  {
    id: 'a4',
    label: 'A4 Document',
    subtitle: '794 × 1123 px · 210 × 297 mm',
    category: 'Print & Document',
    width: 794,
    height: 1123,
  },
  {
    id: 'letter',
    label: 'US Letter',
    subtitle: '816 × 1056 px · 8.5 × 11 in',
    category: 'Print & Document',
    width: 816,
    height: 1056,
  },
  {
    id: 'a5',
    label: 'A5 Booklet',
    subtitle: '559 × 794 px · 148 × 210 mm',
    category: 'Print & Document',
    width: 559,
    height: 794,
  },
  {
    id: 'book',
    label: 'Book (Flip Mode)',
    subtitle: '720 × 1020 px · Animated 3D Page Flip',
    category: 'Interactive Book',
    width: 720,
    height: 1020,
    badge: '3D Flip',
  },
];

export const PAGE_MARGIN_PRESETS: Array<{ label: string; value: number }> = [
  { label: 'None', value: 0 },
  { label: 'Narrow', value: 24 },
  { label: 'Normal', value: 48 },
  { label: 'Wide', value: 72 },
];

export interface ChartPresetDef {
  id: string;
  chartKind: ChartElement['chartKind'];
  name: string;
  subtitle: string;
  title: string;
  data: Array<{ label: string; value: number; color?: string }>;
  showValues: boolean;
  showLegend: boolean;
}

export const CHART_PRESETS: ChartPresetDef[] = [
  {
    id: 'chart-bar',
    chartKind: 'bar',
    name: 'Vertical Bar',
    subtitle: 'Compare quarterly or category totals',
    title: 'Quarterly Growth',
    data: [
      { label: 'Q1', value: 42 },
      { label: 'Q2', value: 64 },
      { label: 'Q3', value: 78 },
      { label: 'Q4', value: 94 },
    ],
    showValues: true,
    showLegend: false,
  },
  {
    id: 'chart-hbar',
    chartKind: 'horizontal-bar',
    name: 'Horizontal Bar',
    subtitle: 'Rankings & channel share comparison',
    title: 'Channel Attribution',
    data: [
      { label: 'Organic', value: 86 },
      { label: 'Referral', value: 68 },
      { label: 'Social', value: 54 },
      { label: 'Direct', value: 41 },
    ],
    showValues: true,
    showLegend: false,
  },
  {
    id: 'chart-line',
    chartKind: 'line',
    name: 'Line Trend',
    subtitle: 'Track momentum across time',
    title: 'Monthly Active Velocity',
    data: [
      { label: 'Jan', value: 28 },
      { label: 'Feb', value: 45 },
      { label: 'Mar', value: 52 },
      { label: 'Apr', value: 76 },
      { label: 'May', value: 92 },
    ],
    showValues: true,
    showLegend: false,
  },
  {
    id: 'chart-area',
    chartKind: 'area',
    name: 'Area Spark Curve',
    subtitle: 'Shaded growth & cumulative trend',
    title: 'Revenue Expansion',
    data: [
      { label: 'W1', value: 30 },
      { label: 'W2', value: 48 },
      { label: 'W3', value: 60 },
      { label: 'W4', value: 84 },
      { label: 'W5', value: 96 },
    ],
    showValues: true,
    showLegend: false,
  },
  {
    id: 'chart-pie',
    chartKind: 'pie',
    name: 'Pie Split',
    subtitle: 'Budget or audience breakdown',
    title: 'Budget Allocation',
    data: [
      { label: 'Product', value: 40 },
      { label: 'Brand', value: 28 },
      { label: 'Growth', value: 20 },
      { label: 'Ops', value: 12 },
    ],
    showValues: true,
    showLegend: true,
  },
  {
    id: 'chart-donut',
    chartKind: 'donut',
    name: 'Donut Ring',
    subtitle: 'Modern ring chart with center total',
    title: 'Project Completion',
    data: [
      { label: 'Shipped', value: 58 },
      { label: 'In Review', value: 27 },
      { label: 'Planned', value: 15 },
    ],
    showValues: true,
    showLegend: true,
  },
  {
    id: 'chart-metric-bars',
    chartKind: 'metric-bars',
    name: 'KPI Metric Bars',
    subtitle: 'Progress bars & scorecards',
    title: 'Core KPI Benchmarks',
    data: [
      { label: 'Adoption', value: 88 },
      { label: 'Retention', value: 76 },
      { label: 'NPS Score', value: 94 },
    ],
    showValues: true,
    showLegend: false,
  },
];

export interface TablePresetDef {
  id: string;
  tableStyle: NonNullable<TableElement['tableStyle']>;
  name: string;
  subtitle: string;
  headers: string[];
  rows: string[][];
  customColors?: {
    headerBg: string;
    headerColor: string;
    cellBg: string;
    stripeBg?: string;
    textColor: string;
    borderColor: string;
  };
}

export const TABLE_PRESETS: TablePresetDef[] = [
  {
    id: 'table-classic',
    tableStyle: 'classic',
    name: 'Classic Header Table',
    subtitle: 'Bold top header · Metric vs target',
    headers: ['Metric', 'Baseline', 'Target'],
    rows: [
      ['Adoption Rate', '42%', '78%'],
      ['Cycle Time', '6.4 hrs', '1.2 hrs'],
      ['Contrast Score', '84%', '100%'],
    ],
  },
  {
    id: 'table-striped',
    tableStyle: 'striped',
    name: 'Striped Schedule',
    subtitle: 'Alternating row bands for easy reading',
    headers: ['Phase', 'Deliverable', 'Owner', 'Due'],
    rows: [
      ['01 Research', 'Audit & Interviews', 'Design', 'Week 1'],
      ['02 Concept', 'Storyboard & Flow', 'Product', 'Week 2'],
      ['03 Craft', 'Visual System', 'Studio', 'Week 3'],
      ['04 Launch', 'Release Deck', 'Growth', 'Week 4'],
    ],
    customColors: {
      headerBg: '#1E293B',
      headerColor: '#FFFFFF',
      cellBg: '#FFFFFF',
      stripeBg: '#F1F5F9',
      textColor: '#0F172A',
      borderColor: '#CBD5E1',
    },
  },
  {
    id: 'table-comparison',
    tableStyle: 'comparison',
    name: 'Comparison Matrix',
    subtitle: 'Feature tiers with clean checkmarks',
    headers: ['Capability', 'Starter', 'Studio Pro'],
    rows: [
      ['Custom Page Sizes', '✓', '✓'],
      ['3D Book Flip View', '—', '✓'],
      ['Brand Kit & Cutouts', '—', '✓'],
      ['PPTX Export', '✓', '✓'],
    ],
    customColors: {
      headerBg: '#7D1935',
      headerColor: '#FFFFFF',
      cellBg: '#FFFFFF',
      stripeBg: '#FFF1F2',
      textColor: '#191B1F',
      borderColor: '#FECDD3',
    },
  },
  {
    id: 'table-minimal',
    tableStyle: 'minimal',
    name: 'Editorial Minimal',
    subtitle: 'Hairline dividers · High-contrast magazine grid',
    headers: ['Quarter', 'Milestone', 'Status'],
    rows: [
      ['Q1 2026', 'Foundation System', 'Complete'],
      ['Q2 2026', 'Mobile Studio Parity', 'Active'],
      ['Q3 2026', 'Book Publishing Kit', 'Planned'],
    ],
    customColors: {
      headerBg: '#F7F6F2',
      headerColor: '#191B1F',
      cellBg: '#FFFFFF',
      stripeBg: '#FAF9F6',
      textColor: '#191B1F',
      borderColor: '#D0CEC6',
    },
  },
  {
    id: 'table-dark',
    tableStyle: 'dark',
    name: 'Dark Tech Spec',
    subtitle: 'Slate surface · Specs & benchmarks',
    headers: ['Parameter', 'Standard', 'Peak Spec'],
    rows: [
      ['Canvas Engine', 'Vector SVG', '4K Export'],
      ['Render Target', '60 fps', '120 fps'],
      ['Color Space', 'sRGB', 'Display P3'],
    ],
    customColors: {
      headerBg: '#0F172A',
      headerColor: '#F8FAFC',
      cellBg: '#1E293B',
      stripeBg: '#273549',
      textColor: '#F1F5F9',
      borderColor: '#334155',
    },
  },
];

export function buildChartElementFromPreset(
  preset: ChartPresetDef,
  docWidth: number,
  docHeight: number,
  zIndex: number,
  tokens: DesignTokens
): ChartElement {
  const palette = [
    tokens.colors.accent,
    tokens.colors.chartPalette[0] || '#2563EB',
    tokens.colors.chartPalette[1] || '#10B981',
    tokens.colors.chartPalette[2] || '#F59E0B',
    '#8B5CF6',
  ];
  const width = Math.min(Math.max(280, docWidth - 80), 520);
  const height = Math.min(Math.max(220, docHeight - 120), 320);
  return {
    id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name: preset.name,
    type: 'chart',
    x: Math.max(20, Math.round(docWidth / 2 - width / 2)),
    y: Math.max(20, Math.round(docHeight / 2 - height / 2)),
    width,
    height,
    rotation: 0,
    zIndex,
    opacity: 1,
    visible: true,
    locked: false,
    chartKind: preset.chartKind,
    title: preset.title,
    data: preset.data.map((d, idx) => ({
      ...d,
      color: d.color || palette[idx % palette.length],
    })),
    showValues: preset.showValues,
    showLegend: preset.showLegend,
    accentColor: tokens.colors.accent,
    textColor: tokens.colors.ink,
    surfaceColor: tokens.colors.surface,
  };
}

export function buildTableElementFromPreset(
  preset: TablePresetDef,
  docWidth: number,
  docHeight: number,
  zIndex: number,
  tokens: DesignTokens
): TableElement {
  const width = Math.min(Math.max(280, docWidth - 64), 640);
  const height = Math.min(Math.max(180, docHeight - 120), 250);
  return {
    id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name: preset.name,
    type: 'table',
    tableStyle: preset.tableStyle,
    x: Math.max(16, Math.round(docWidth / 2 - width / 2)),
    y: Math.max(16, Math.round(docHeight / 2 - height / 2)),
    width,
    height,
    rotation: 0,
    zIndex,
    opacity: 1,
    visible: true,
    locked: false,
    headers: [...preset.headers],
    rows: preset.rows.map((r) => [...r]),
    headerBg: preset.customColors?.headerBg || tokens.colors.ink,
    headerColor: preset.customColors?.headerColor || tokens.colors.surface,
    cellBg: preset.customColors?.cellBg || tokens.colors.surface,
    stripeBg: preset.customColors?.stripeBg,
    textColor: preset.customColors?.textColor || tokens.colors.ink,
    borderColor: preset.customColors?.borderColor || tokens.colors.border,
  };
}
