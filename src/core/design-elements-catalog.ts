import type { CutoutItemDef } from './svg-cutout-renderer';
import { CRAYON_DOODLE_CATALOG, renderCrayonDoodleSvg } from './crayon-doodle-catalog';
import { TECH_HUD_CATALOG, renderTechHudSvg } from './tech-hud-catalog';
import { HERITAGE_VINTAGE_CATALOG, renderHeritageVintageSvg } from './heritage-vintage-catalog';

function esc(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const EXTENDED_CUTOUT_CATALOG: CutoutItemDef[] = [
  ...CRAYON_DOODLE_CATALOG,
  ...TECH_HUD_CATALOG,
  ...HERITAGE_VINTAGE_CATALOG,
  // ==================== 12 HEADERS & LINES ====================
  {
    kind: 'header-editorial-masthead',
    name: 'Editorial Masthead',
    category: 'Headers & Lines',
    keywords: ['header', 'title', 'masthead', 'editorial', 'headline', 'banner'],
    defaultWidth: 580,
    defaultHeight: 110,
    defaultProps: {
      stickerKind: 'header-editorial-masthead',
      label: 'ANNUAL REVIEW',
      primaryColor: '#7D1935',
      secondaryColor: '#F3E8EB',
      accentColor: '#191B1F',
      outlineColor: '#191B1F',
    },
  },
  {
    kind: 'header-y2k-chrome',
    name: 'Y2K Window Header',
    category: 'Headers & Lines',
    keywords: ['header', 'window', 'chrome', 'y2k', 'retro', 'bar', 'title'],
    defaultWidth: 520,
    defaultHeight: 82,
    defaultProps: {
      stickerKind: 'header-y2k-chrome',
      label: 'NOW FEATURED · 2026',
      primaryColor: '#2563EB',
      secondaryColor: '#93C5FD',
      accentColor: '#FFFFFF',
      outlineColor: '#0F172A',
    },
  },
  {
    kind: 'header-ribbon-banner',
    name: 'Ribbon Title Header',
    category: 'Headers & Lines',
    keywords: ['header', 'ribbon', 'banner', 'title', 'scroll'],
    defaultWidth: 480,
    defaultHeight: 105,
    defaultProps: {
      stickerKind: 'header-ribbon-banner',
      label: 'KEY HIGHLIGHTS',
      primaryColor: '#7D1935',
      secondaryColor: '#F59E0B',
      accentColor: '#FFFFFF',
      outlineColor: '#4A0D1E',
    },
  },
  {
    kind: 'header-pill-kicker',
    name: 'Pill Kicker Header',
    category: 'Headers & Lines',
    keywords: ['header', 'pill', 'kicker', 'section', 'divider', 'title'],
    defaultWidth: 540,
    defaultHeight: 72,
    defaultProps: {
      stickerKind: 'header-pill-kicker',
      label: 'SECTION 01 · OVERVIEW',
      primaryColor: '#7D1935',
      secondaryColor: '#E2E8F0',
      accentColor: '#FFFFFF',
      outlineColor: '#191B1F',
    },
  },
  {
    kind: 'header-bracket-title',
    name: 'Bracket Callout Header',
    category: 'Headers & Lines',
    keywords: ['header', 'bracket', 'title', 'architectural', 'minimal'],
    defaultWidth: 460,
    defaultHeight: 90,
    defaultProps: {
      stickerKind: 'header-bracket-title',
      label: 'CHAPTER ONE',
      primaryColor: '#0F172A',
      secondaryColor: '#3B82F6',
      accentColor: '#F8FAFC',
      outlineColor: '#0F172A',
    },
  },
  {
    kind: 'header-tape-note',
    name: 'Washi Tape Header',
    category: 'Headers & Lines',
    keywords: ['header', 'tape', 'scrapbook', 'note', 'label', 'title'],
    defaultWidth: 440,
    defaultHeight: 104,
    defaultProps: {
      stickerKind: 'header-tape-note',
      label: 'MUST READ NOTES',
      primaryColor: '#FEF3C7',
      secondaryColor: '#F472B6',
      accentColor: '#1E293B',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'line-double-editorial',
    name: 'Double Editorial Line',
    category: 'Headers & Lines',
    keywords: ['line', 'divider', 'rule', 'editorial', 'separator', 'hr'],
    defaultWidth: 640,
    defaultHeight: 36,
    defaultProps: {
      stickerKind: 'line-double-editorial',
      label: '',
      primaryColor: '#191B1F',
      secondaryColor: '#7D1935',
      accentColor: '#D0CEC6',
      outlineColor: '#191B1F',
    },
  },
  {
    kind: 'line-ornament-diamond',
    name: 'Diamond Divider Line',
    category: 'Headers & Lines',
    keywords: ['line', 'divider', 'diamond', 'ornament', 'flourish'],
    defaultWidth: 600,
    defaultHeight: 44,
    defaultProps: {
      stickerKind: 'line-ornament-diamond',
      label: '',
      primaryColor: '#7D1935',
      secondaryColor: '#F59E0B',
      accentColor: '#FFFFFF',
      outlineColor: '#7D1935',
    },
  },
  {
    kind: 'line-gradient-glow',
    name: 'Gradient Accent Bar',
    category: 'Headers & Lines',
    keywords: ['line', 'bar', 'gradient', 'divider', 'pill'],
    defaultWidth: 620,
    defaultHeight: 28,
    defaultProps: {
      stickerKind: 'line-gradient-glow',
      label: '',
      primaryColor: '#EC4899',
      secondaryColor: '#8B5CF6',
      accentColor: '#38BDF8',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'line-dotted-bead',
    name: 'Dotted Bead Line',
    category: 'Headers & Lines',
    keywords: ['line', 'dotted', 'dots', 'divider', 'beads'],
    defaultWidth: 600,
    defaultHeight: 32,
    defaultProps: {
      stickerKind: 'line-dotted-bead',
      label: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#93C5FD',
      accentColor: '#1E3A8A',
      outlineColor: '#1E3A8A',
    },
  },
  {
    kind: 'line-zigzag-wave',
    name: 'Squiggle Wave Line',
    category: 'Headers & Lines',
    keywords: ['line', 'wave', 'squiggle', 'zigzag', 'divider'],
    defaultWidth: 580,
    defaultHeight: 42,
    defaultProps: {
      stickerKind: 'line-zigzag-wave',
      label: '',
      primaryColor: '#F97316',
      secondaryColor: '#FACC15',
      accentColor: '#FFFFFF',
      outlineColor: '#9A3412',
    },
  },
  {
    kind: 'line-arrow-callout',
    name: 'Connector Arrow Line',
    category: 'Headers & Lines',
    keywords: ['line', 'arrow', 'connector', 'divider', 'pointer'],
    defaultWidth: 520,
    defaultHeight: 44,
    defaultProps: {
      stickerKind: 'line-arrow-callout',
      label: '',
      primaryColor: '#0F172A',
      secondaryColor: '#38BDF8',
      accentColor: '#FFFFFF',
      outlineColor: '#0F172A',
    },
  },

  // ==================== 12 BORDERS & EDGES ====================
  {
    kind: 'border-corner-brackets',
    name: 'Corner L-Brackets',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'corners', 'brackets', 'frame', 'viewfinder'],
    defaultWidth: 640,
    defaultHeight: 420,
    defaultProps: {
      stickerKind: 'border-corner-brackets',
      label: '',
      primaryColor: '#191B1F',
      secondaryColor: '#7D1935',
      accentColor: '#FFFFFF',
      outlineColor: '#191B1F',
    },
  },
  {
    kind: 'border-art-deco',
    name: 'Art Deco Gold Border',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'art deco', 'gold', 'luxury', 'corners', 'frame'],
    defaultWidth: 680,
    defaultHeight: 440,
    defaultProps: {
      stickerKind: 'border-art-deco',
      label: '',
      primaryColor: '#D97706',
      secondaryColor: '#FEF08A',
      accentColor: '#92400E',
      outlineColor: '#78350F',
    },
  },
  {
    kind: 'border-double-classic',
    name: 'Classic Certificate Border',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'classic', 'certificate', 'double', 'editorial'],
    defaultWidth: 720,
    defaultHeight: 480,
    defaultProps: {
      stickerKind: 'border-double-classic',
      label: '',
      primaryColor: '#7D1935',
      secondaryColor: '#D97706',
      accentColor: '#191B1F',
      outlineColor: '#7D1935',
    },
  },
  {
    kind: 'border-postage-stamp',
    name: 'Scallop Stamp Border',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'scallop', 'stamp', 'postage', 'perforated'],
    defaultWidth: 560,
    defaultHeight: 420,
    defaultProps: {
      stickerKind: 'border-postage-stamp',
      label: '',
      primaryColor: '#E11D48',
      secondaryColor: '#FDA4AF',
      accentColor: '#FFFFFF',
      outlineColor: '#881337',
    },
  },
  {
    kind: 'border-filmstrip',
    name: '35mm Filmstrip Edge',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'film', 'filmstrip', 'cinema', 'camera'],
    defaultWidth: 720,
    defaultHeight: 460,
    defaultProps: {
      stickerKind: 'border-filmstrip',
      label: 'KODAK 400 · FRAME 01',
      primaryColor: '#111827',
      secondaryColor: '#F8FAFC',
      accentColor: '#F59E0B',
      outlineColor: '#020617',
    },
  },
  {
    kind: 'border-stitched-craft',
    name: 'Stitched Dashed Border',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'stitched', 'dashed', 'craft', 'journal'],
    defaultWidth: 640,
    defaultHeight: 440,
    defaultProps: {
      stickerKind: 'border-stitched-craft',
      label: '',
      primaryColor: '#2563EB',
      secondaryColor: '#93C5FD',
      accentColor: '#FFFFFF',
      outlineColor: '#1E3A8A',
    },
  },
  {
    kind: 'border-neon-frame',
    name: 'Neon Cyber Edge',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'neon', 'cyber', 'glow', 'y2k'],
    defaultWidth: 680,
    defaultHeight: 440,
    defaultProps: {
      stickerKind: 'border-neon-frame',
      label: '',
      primaryColor: '#EC4899',
      secondaryColor: '#22D3EE',
      accentColor: '#A855F7',
      outlineColor: '#0F172A',
    },
  },
  {
    kind: 'border-torn-edge',
    name: 'Torn Paper Edge Strip',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'torn', 'paper', 'ripped', 'scrapbook', 'strip'],
    defaultWidth: 760,
    defaultHeight: 110,
    defaultProps: {
      stickerKind: 'border-torn-edge',
      label: '',
      primaryColor: '#FFFBEB',
      secondaryColor: '#FDE68A',
      accentColor: '#D97706',
      outlineColor: '#CBD5E1',
    },
  },
  {
    kind: 'border-checker-y2k',
    name: 'Y2K Checker Edge Frame',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'checkerboard', 'y2k', 'retro', 'racing'],
    defaultWidth: 700,
    defaultHeight: 460,
    defaultProps: {
      stickerKind: 'border-checker-y2k',
      label: '',
      primaryColor: '#1E293B',
      secondaryColor: '#F8FAFC',
      accentColor: '#3B82F6',
      outlineColor: '#0F172A',
    },
  },
  {
    kind: 'border-confetti-edge',
    name: 'Party Confetti Border',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'confetti', 'party', 'celebration', 'sparkles'],
    defaultWidth: 740,
    defaultHeight: 480,
    defaultProps: {
      stickerKind: 'border-confetti-edge',
      label: '',
      primaryColor: '#EC4899',
      secondaryColor: '#FACC15',
      accentColor: '#38BDF8',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'border-xmas-holly',
    name: 'Holly & Berry Border',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'christmas', 'holly', 'berry', 'festive', 'holiday'],
    defaultWidth: 740,
    defaultHeight: 480,
    defaultProps: {
      stickerKind: 'border-xmas-holly',
      label: '',
      primaryColor: '#15803D',
      secondaryColor: '#DC2626',
      accentColor: '#FACC15',
      outlineColor: '#14532D',
    },
  },
  {
    kind: 'border-xmas-lights',
    name: 'Fairy Lights Garland Edge',
    category: 'Borders & Edges',
    keywords: ['border', 'edge', 'lights', 'fairy lights', 'christmas', 'garland', 'new year'],
    defaultWidth: 780,
    defaultHeight: 150,
    defaultProps: {
      stickerKind: 'border-xmas-lights',
      label: '',
      primaryColor: '#166534',
      secondaryColor: '#FACC15',
      accentColor: '#EF4444',
      outlineColor: '#0F172A',
    },
  },

  // ==================== 10 BACKGROUND DESIGNS ====================
  {
    kind: 'bg-sunburst-rays',
    name: 'Sunburst Rays Backdrop',
    category: 'Backgrounds',
    keywords: ['background', 'backdrop', 'sunburst', 'rays', 'radial', 'retro'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-sunburst-rays',
      label: '',
      primaryColor: '#FEF3C7',
      secondaryColor: '#FDE68A',
      accentColor: '#F59E0B',
      outlineColor: '#FFFBEB',
    },
  },
  {
    kind: 'bg-aurora-mesh',
    name: 'Aurora Mesh Backdrop',
    category: 'Backgrounds',
    keywords: ['background', 'backdrop', 'aurora', 'mesh', 'gradient', 'pastel'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-aurora-mesh',
      label: '',
      primaryColor: '#A855F7',
      secondaryColor: '#38BDF8',
      accentColor: '#F472B6',
      outlineColor: '#F8FAFC',
    },
  },
  {
    kind: 'bg-blueprint-grid',
    name: 'Blueprint Grid Backdrop',
    category: 'Backgrounds',
    keywords: ['background', 'backdrop', 'grid', 'blueprint', 'architecture', 'graph'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-blueprint-grid',
      label: '',
      primaryColor: '#1E3A8A',
      secondaryColor: '#3B82F6',
      accentColor: '#93C5FD',
      outlineColor: '#FFFFFF',
    },
  },
  {
    kind: 'bg-memphis-confetti',
    name: 'Memphis Pattern Backdrop',
    category: 'Backgrounds',
    keywords: ['background', 'backdrop', 'memphis', 'pattern', 'geometric', 'playful'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-memphis-confetti',
      label: '',
      primaryColor: '#FFFBEB',
      secondaryColor: '#EC4899',
      accentColor: '#38BDF8',
      outlineColor: '#FACC15',
    },
  },
  {
    kind: 'bg-halftone-pop',
    name: 'Halftone Pop Backdrop',
    category: 'Backgrounds',
    keywords: ['background', 'backdrop', 'halftone', 'dots', 'comic', 'pop art'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-halftone-pop',
      label: '',
      primaryColor: '#FFE4E6',
      secondaryColor: '#E11D48',
      accentColor: '#FDA4AF',
      outlineColor: '#9F1239',
    },
  },
  {
    kind: 'bg-diagonal-stripes',
    name: 'Candy Diagonal Backdrop',
    category: 'Backgrounds',
    keywords: ['background', 'backdrop', 'stripes', 'diagonal', 'candy', 'editorial'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-diagonal-stripes',
      label: '',
      primaryColor: '#EFF6FF',
      secondaryColor: '#BFDBFE',
      accentColor: '#3B82F6',
      outlineColor: '#FFFFFF',
    },
  },
  {
    kind: 'bg-starry-midnight',
    name: 'Starry Night Backdrop',
    category: 'Backgrounds',
    keywords: ['background', 'backdrop', 'stars', 'night', 'midnight', 'cosmos'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-starry-midnight',
      label: '',
      primaryColor: '#0F172A',
      secondaryColor: '#1E1B4B',
      accentColor: '#FDE047',
      outlineColor: '#38BDF8',
    },
  },
  {
    kind: 'bg-winter-snowfall',
    name: 'Winter Snowfall Backdrop',
    category: 'Backgrounds',
    keywords: ['background', 'backdrop', 'snow', 'winter', 'christmas', 'bokeh', 'frost'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-winter-snowfall',
      label: '',
      primaryColor: '#0C4A6E',
      secondaryColor: '#38BDF8',
      accentColor: '#FFFFFF',
      outlineColor: '#BAE6FD',
    },
  },
  {
    kind: 'bg-xmas-velvet',
    name: 'Holiday Velvet Glow',
    category: 'Backgrounds',
    keywords: ['background', 'backdrop', 'christmas', 'red', 'gold', 'velvet', 'holiday'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-xmas-velvet',
      label: '',
      primaryColor: '#7F1D1D',
      secondaryColor: '#DC2626',
      accentColor: '#FACC15',
      outlineColor: '#14532D',
    },
  },
  {
    kind: 'bg-newyear-fireworks',
    name: 'New Year Fireworks Sky',
    category: 'Backgrounds',
    keywords: ['background', 'backdrop', 'new year', 'fireworks', 'celebration', '2026', 'midnight'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-newyear-fireworks',
      label: '',
      primaryColor: '#090D16',
      secondaryColor: '#312E81',
      accentColor: '#FACC15',
      outlineColor: '#EC4899',
    },
  },

  // ==================== 20 CHRISTMAS & NEW YEAR ELEMENTS ====================
  {
    kind: 'xmas-tree',
    name: 'Decorated Xmas Tree',
    category: 'Christmas & New Year',
    keywords: ['christmas', 'tree', 'pine', 'ornaments', 'star', 'holiday', 'gifts'],
    defaultWidth: 195,
    defaultHeight: 245,
    defaultProps: {
      stickerKind: 'xmas-tree',
      label: '',
      primaryColor: '#15803D',
      secondaryColor: '#DC2626',
      accentColor: '#FACC15',
      outlineColor: '#14532D',
    },
  },
  {
    kind: 'xmas-santa',
    name: 'Jolly Santa Claus',
    category: 'Christmas & New Year',
    keywords: ['santa', 'claus', 'christmas', 'character', 'holiday', 'winter'],
    defaultWidth: 190,
    defaultHeight: 225,
    defaultProps: {
      stickerKind: 'xmas-santa',
      label: 'HO HO!',
      primaryColor: '#DC2626',
      secondaryColor: '#FDBA74',
      accentColor: '#FACC15',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'xmas-santa-hat',
    name: 'Cozy Santa Hat',
    category: 'Christmas & New Year',
    keywords: ['santa hat', 'christmas', 'hat', 'winter', 'sticker'],
    defaultWidth: 185,
    defaultHeight: 155,
    defaultProps: {
      stickerKind: 'xmas-santa-hat',
      label: '',
      primaryColor: '#DC2626',
      secondaryColor: '#FFFFFF',
      accentColor: '#F8FAFC',
      outlineColor: '#7F1D1D',
    },
  },
  {
    kind: 'xmas-snowman',
    name: 'Frosty Snowman',
    category: 'Christmas & New Year',
    keywords: ['snowman', 'winter', 'christmas', 'snow', 'frosty', 'character'],
    defaultWidth: 180,
    defaultHeight: 230,
    defaultProps: {
      stickerKind: 'xmas-snowman',
      label: '',
      primaryColor: '#E0F2FE',
      secondaryColor: '#DC2626',
      accentColor: '#F97316',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'xmas-reindeer',
    name: 'Rudolph Reindeer',
    category: 'Christmas & New Year',
    keywords: ['reindeer', 'rudolph', 'christmas', 'deer', 'holiday'],
    defaultWidth: 195,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'xmas-reindeer',
      label: '',
      primaryColor: '#B45309',
      secondaryColor: '#EF4444',
      accentColor: '#16A34A',
      outlineColor: '#451A03',
    },
  },
  {
    kind: 'xmas-gift-box',
    name: 'Holiday Gift Box',
    category: 'Christmas & New Year',
    keywords: ['gift', 'present', 'box', 'christmas', 'bow', 'ribbon', 'new year'],
    defaultWidth: 185,
    defaultHeight: 195,
    defaultProps: {
      stickerKind: 'xmas-gift-box',
      label: 'GIFT',
      primaryColor: '#DC2626',
      secondaryColor: '#FACC15',
      accentColor: '#16A34A',
      outlineColor: '#7F1D1D',
    },
  },
  {
    kind: 'xmas-candy-cane',
    name: 'Candy Cane Pair',
    category: 'Christmas & New Year',
    keywords: ['candy cane', 'peppermint', 'christmas', 'sweet', 'holiday'],
    defaultWidth: 175,
    defaultHeight: 195,
    defaultProps: {
      stickerKind: 'xmas-candy-cane',
      label: '',
      primaryColor: '#DC2626',
      secondaryColor: '#FFFFFF',
      accentColor: '#16A34A',
      outlineColor: '#7F1D1D',
    },
  },
  {
    kind: 'xmas-stocking',
    name: 'Christmas Stocking',
    category: 'Christmas & New Year',
    keywords: ['stocking', 'sock', 'christmas', 'fireplace', 'gift'],
    defaultWidth: 170,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'xmas-stocking',
      label: '',
      primaryColor: '#DC2626',
      secondaryColor: '#FFFFFF',
      accentColor: '#16A34A',
      outlineColor: '#7F1D1D',
    },
  },
  {
    kind: 'xmas-gingerbread',
    name: 'Gingerbread Cookie',
    category: 'Christmas & New Year',
    keywords: ['gingerbread', 'cookie', 'christmas', 'baking', 'holiday'],
    defaultWidth: 175,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'xmas-gingerbread',
      label: '',
      primaryColor: '#B45309',
      secondaryColor: '#FFFFFF',
      accentColor: '#EF4444',
      outlineColor: '#451A03',
    },
  },
  {
    kind: 'xmas-wreath',
    name: 'Festive Holly Wreath',
    category: 'Christmas & New Year',
    keywords: ['wreath', 'holly', 'christmas', 'door', 'pine', 'bow'],
    defaultWidth: 195,
    defaultHeight: 195,
    defaultProps: {
      stickerKind: 'xmas-wreath',
      label: '',
      primaryColor: '#15803D',
      secondaryColor: '#DC2626',
      accentColor: '#FACC15',
      outlineColor: '#14532D',
    },
  },
  {
    kind: 'xmas-jingle-bells',
    name: 'Golden Jingle Bells',
    category: 'Christmas & New Year',
    keywords: ['bells', 'jingle', 'gold', 'christmas', 'new year', 'holly'],
    defaultWidth: 195,
    defaultHeight: 185,
    defaultProps: {
      stickerKind: 'xmas-jingle-bells',
      label: '',
      primaryColor: '#F59E0B',
      secondaryColor: '#FEF08A',
      accentColor: '#DC2626',
      outlineColor: '#78350F',
    },
  },
  {
    kind: 'xmas-snowflake',
    name: 'Crystal Snowflake',
    category: 'Christmas & New Year',
    keywords: ['snowflake', 'snow', 'winter', 'ice', 'christmas', 'frost'],
    defaultWidth: 180,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'xmas-snowflake',
      label: '',
      primaryColor: '#38BDF8',
      secondaryColor: '#E0F2FE',
      accentColor: '#FFFFFF',
      outlineColor: '#0284C7',
    },
  },
  {
    kind: 'xmas-ornaments',
    name: 'Hanging Glass Baubles',
    category: 'Christmas & New Year',
    keywords: ['ornament', 'baubles', 'christmas', 'decor', 'gold', 'red'],
    defaultWidth: 210,
    defaultHeight: 190,
    defaultProps: {
      stickerKind: 'xmas-ornaments',
      label: '',
      primaryColor: '#DC2626',
      secondaryColor: '#F59E0B',
      accentColor: '#16A34A',
      outlineColor: '#78350F',
    },
  },
  {
    kind: 'xmas-cocoa-mug',
    name: 'Hot Cocoa & Marshmallows',
    category: 'Christmas & New Year',
    keywords: ['cocoa', 'chocolate', 'mug', 'winter', 'christmas', 'warm'],
    defaultWidth: 185,
    defaultHeight: 185,
    defaultProps: {
      stickerKind: 'xmas-cocoa-mug',
      label: 'COZY',
      primaryColor: '#DC2626',
      secondaryColor: '#78350F',
      accentColor: '#FFFFFF',
      outlineColor: '#450A0A',
    },
  },
  {
    kind: 'xmas-candle',
    name: 'Holiday Candle Glow',
    category: 'Christmas & New Year',
    keywords: ['candle', 'flame', 'christmas', 'holly', 'winter', 'cozy'],
    defaultWidth: 170,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'xmas-candle',
      label: '',
      primaryColor: '#FEF3C7',
      secondaryColor: '#F59E0B',
      accentColor: '#15803D',
      outlineColor: '#78350F',
    },
  },
  {
    kind: 'xmas-merry-banner',
    name: 'Merry Christmas Banner',
    category: 'Christmas & New Year',
    keywords: ['merry christmas', 'banner', 'ribbon', 'holiday', 'text', 'title'],
    defaultWidth: 320,
    defaultHeight: 115,
    defaultProps: {
      stickerKind: 'xmas-merry-banner',
      label: 'MERRY XMAS',
      primaryColor: '#B91C1C',
      secondaryColor: '#15803D',
      accentColor: '#FDE047',
      outlineColor: '#450A0A',
    },
  },
  {
    kind: 'ny-champagne',
    name: 'New Year Toast Flutes',
    category: 'Christmas & New Year',
    keywords: ['new year', 'champagne', 'toast', 'cheers', 'party', 'celebration'],
    defaultWidth: 195,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'ny-champagne',
      label: '',
      primaryColor: '#FDE047',
      secondaryColor: '#BAE6FD',
      accentColor: '#F59E0B',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'ny-fireworks',
    name: 'Fireworks Burst',
    category: 'Christmas & New Year',
    keywords: ['fireworks', 'new year', 'burst', 'sparkle', 'celebration', '2026'],
    defaultWidth: 215,
    defaultHeight: 215,
    defaultProps: {
      stickerKind: 'ny-fireworks',
      label: '',
      primaryColor: '#FACC15',
      secondaryColor: '#EC4899',
      accentColor: '#38BDF8',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'ny-countdown-clock',
    name: 'Midnight 12:00 Clock',
    category: 'Christmas & New Year',
    keywords: ['clock', 'midnight', 'countdown', 'new year', '12:00', '2026'],
    defaultWidth: 195,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'ny-countdown-clock',
      label: '12:00',
      primaryColor: '#F59E0B',
      secondaryColor: '#1E1B4B',
      accentColor: '#FEF08A',
      outlineColor: '#451A03',
    },
  },
  {
    kind: 'ny-2026-banner',
    name: 'Happy New Year 2026 Crest',
    category: 'Christmas & New Year',
    keywords: ['new year', '2026', 'happy new year', 'badge', 'banner', 'celebration'],
    defaultWidth: 290,
    defaultHeight: 155,
    defaultProps: {
      stickerKind: 'ny-2026-banner',
      label: '2026',
      primaryColor: '#1E1B4B',
      secondaryColor: '#FACC15',
      accentColor: '#FFFFFF',
      outlineColor: '#0F172A',
    },
  },
];

export function renderExtendedDesignSvg(
  kind: string,
  c1: string,
  c2: string,
  acc: string,
  out: string,
  label: string,
  uid: string
): { viewBox: string; svg: string } | null {
  switch (kind) {
    // ==================== HEADERS & LINES ====================
    case 'header-editorial-masthead':
      return {
        viewBox: '0 0 600 110',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 110">
  <rect x="8" y="8" width="584" height="94" rx="10" fill="${c2}" stroke="${c1}" stroke-width="2"/>
  <line x1="24" y1="22" x2="576" y2="22" stroke="${c1}" stroke-width="3"/>
  <line x1="24" y1="28" x2="576" y2="28" stroke="${c1}" stroke-width="1"/>
  <text x="300" y="68" text-anchor="middle" fill="${acc}" font-family="Fraunces, Georgia, serif" font-weight="800" font-size="34" letter-spacing="3">${esc(label || 'ANNUAL REVIEW').slice(0, 24)}</text>
  <line x1="24" y1="84" x2="576" y2="84" stroke="${c1}" stroke-width="1"/>
  <line x1="24" y1="90" x2="576" y2="90" stroke="${c1}" stroke-width="3"/>
</svg>`,
      };

    case 'header-y2k-chrome':
      return {
        viewBox: '0 0 540 84',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 84">
  <defs>
    <linearGradient id="${uid}-yh" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c1}"/>
    </linearGradient>
  </defs>
  <rect x="8" y="10" width="524" height="66" rx="14" fill="${out}" opacity="0.18" transform="translate(4,4)"/>
  <rect x="6" y="8" width="524" height="66" rx="14" fill="url(#${uid}-yh)" stroke="${out}" stroke-width="3"/>
  <rect x="12" y="12" width="512" height="22" rx="10" fill="#FFFFFF" opacity="0.24"/>
  <circle cx="30" cy="41" r="8" fill="#FB7185" stroke="${out}" stroke-width="2"/>
  <circle cx="52" cy="41" r="8" fill="#FACC15" stroke="${out}" stroke-width="2"/>
  <circle cx="74" cy="41" r="8" fill="#4ADE80" stroke="${out}" stroke-width="2"/>
  <text x="295" y="49" text-anchor="middle" fill="${acc}" font-family="Outfit, sans-serif" font-weight="900" font-size="22" letter-spacing="2">${esc(label || 'NOW FEATURED').slice(0, 26)}</text>
</svg>`,
      };

    case 'header-ribbon-banner':
      return {
        viewBox: '0 0 500 110',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 110">
  <polygon points="14,32 76,32 76,88 14,88 38,60" fill="${c2}" stroke="${out}" stroke-width="2.5" stroke-linejoin="round"/>
  <polygon points="486,32 424,32 424,88 486,88 462,60" fill="${c2}" stroke="${out}" stroke-width="2.5" stroke-linejoin="round"/>
  <polygon points="56,74 76,88 76,74" fill="${out}"/>
  <polygon points="444,74 424,88 424,74" fill="${out}"/>
  <rect x="56" y="16" width="388" height="58" rx="10" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <rect x="64" y="23" width="372" height="44" rx="6" fill="none" stroke="${c2}" stroke-width="1.6" stroke-dasharray="6 4"/>
  <text x="250" y="54" text-anchor="middle" fill="${acc}" font-family="Outfit, sans-serif" font-weight="900" font-size="25" letter-spacing="2.2">${esc(label || 'KEY HIGHLIGHTS').slice(0, 24)}</text>
</svg>`,
      };

    case 'header-pill-kicker':
      return {
        viewBox: '0 0 560 72',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 72">
  <line x1="12" y1="36" x2="140" y2="36" stroke="${c2}" stroke-width="3" stroke-linecap="round"/>
  <line x1="420" y1="36" x2="548" y2="36" stroke="${c2}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="140" cy="36" r="4.5" fill="${c1}"/>
  <circle cx="420" cy="36" r="4.5" fill="${c1}"/>
  <rect x="150" y="14" width="260" height="44" rx="22" fill="${c1}" stroke="${out}" stroke-width="2"/>
  <text x="280" y="42" text-anchor="middle" fill="${acc}" font-family="Space Grotesk, sans-serif" font-weight="800" font-size="15" letter-spacing="1.8">${esc(label || 'SECTION 01 · OVERVIEW').slice(0, 24)}</text>
</svg>`,
      };

    case 'header-bracket-title':
      return {
        viewBox: '0 0 480 92',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 92">
  <rect x="18" y="14" width="444" height="64" rx="8" fill="${acc}"/>
  <path d="M44 12 H16 V80 H44" fill="none" stroke="${c1}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M436 12 H464 V80 H436" fill="none" stroke="${c1}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="140" y="68" width="200" height="5" rx="2.5" fill="${c2}"/>
  <text x="240" y="54" text-anchor="middle" fill="${c1}" font-family="Outfit, sans-serif" font-weight="900" font-size="28" letter-spacing="3">${esc(label || 'CHAPTER ONE').slice(0, 22)}</text>
</svg>`,
      };

    case 'header-tape-note':
      return {
        viewBox: '0 0 460 110',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 110">
  <rect x="24" y="24" width="412" height="72" rx="6" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
  <rect x="12" y="12" width="76" height="24" rx="2" fill="${c2}" opacity="0.88" transform="rotate(-18 50 24)" stroke="${out}" stroke-width="1.5"/>
  <rect x="372" y="12" width="76" height="24" rx="2" fill="${c2}" opacity="0.88" transform="rotate(16 410 24)" stroke="${out}" stroke-width="1.5"/>
  <text x="230" y="68" text-anchor="middle" fill="${acc}" font-family="Outfit, sans-serif" font-weight="800" font-size="24" letter-spacing="1.5">${esc(label || 'MUST READ NOTES').slice(0, 24)}</text>
</svg>`,
      };

    case 'line-double-editorial':
      return {
        viewBox: '0 0 640 36',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 36">
  <rect x="10" y="10" width="620" height="6" rx="3" fill="${c1}"/>
  <rect x="10" y="22" width="620" height="2.5" rx="1.2" fill="${c2}"/>
</svg>`,
      };

    case 'line-ornament-diamond':
      return {
        viewBox: '0 0 600 44',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 44">
  <line x1="12" y1="22" x2="258" y2="22" stroke="${c1}" stroke-width="2.6" stroke-linecap="round"/>
  <line x1="342" y1="22" x2="588" y2="22" stroke="${c1}" stroke-width="2.6" stroke-linecap="round"/>
  <polygon points="274,22 282,14 290,22 282,30" fill="${c2}"/>
  <polygon points="300,8 314,22 300,36 286,22" fill="${c1}" stroke="${c2}" stroke-width="2"/>
  <polygon points="310,22 318,14 326,22 318,30" fill="${c2}"/>
  <circle cx="14" cy="22" r="4" fill="${c1}"/>
  <circle cx="586" cy="22" r="4" fill="${c1}"/>
</svg>`,
      };

    case 'line-gradient-glow':
      return {
        viewBox: '0 0 620 28',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 28">
  <defs>
    <linearGradient id="${uid}-lg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="50%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${acc}"/>
    </linearGradient>
  </defs>
  <rect x="10" y="8" width="600" height="12" rx="6" fill="url(#${uid}-lg)"/>
</svg>`,
      };

    case 'line-dotted-bead':
      return {
        viewBox: '0 0 600 32',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 32">
  ${Array.from({ length: 24 })
    .map((_, i) => `<circle cx="${20 + i * 24.3}" cy="16" r="${i % 3 === 0 ? 6 : 4}" fill="${i % 2 === 0 ? c1 : c2}"/>`)
    .join('')}
</svg>`,
      };

    case 'line-zigzag-wave':
      return {
        viewBox: '0 0 580 42',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 42">
  <path d="M12 21 Q30 4 48 21 T84 21 T120 21 T156 21 T192 21 T228 21 T264 21 T300 21 T336 21 T372 21 T408 21 T444 21 T480 21 T516 21 T552 21 L568 21" fill="none" stroke="${c1}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      };

    case 'line-arrow-callout':
      return {
        viewBox: '0 0 520 44',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 44">
  <line x1="28" y1="22" x2="492" y2="22" stroke="${c1}" stroke-width="4" stroke-linecap="round"/>
  <polygon points="10,22 30,11 30,33" fill="${c2}" stroke="${c1}" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="510,22 490,11 490,33" fill="${c2}" stroke="${c1}" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="260" cy="22" r="7" fill="${c2}" stroke="${c1}" stroke-width="2.5"/>
</svg>`,
      };

    // ==================== BORDERS & EDGES ====================
    case 'border-corner-brackets':
      return {
        viewBox: '0 0 640 420',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" preserveAspectRatio="none">
  <path d="M16 86 V16 H86 M554 16 H624 V86 M16 334 V404 H86 M554 404 H624 V334" fill="none" stroke="${c1}" stroke-width="8" stroke-linecap="square"/>
  <path d="M30 76 V30 H76 M564 30 H610 V76 M30 344 V390 H76 M564 390 H610 V344" fill="none" stroke="${c2}" stroke-width="3"/>
</svg>`,
      };

    case 'border-art-deco':
      return {
        viewBox: '0 0 680 440',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 440" preserveAspectRatio="none">
  <rect x="16" y="16" width="648" height="408" fill="none" stroke="${c1}" stroke-width="4"/>
  <rect x="28" y="28" width="624" height="384" fill="none" stroke="${c1}" stroke-width="1.8"/>
  <path d="M16 74 H54 V54 H74 V16 M664 74 H626 V54 H606 V16 M16 366 H54 V386 H74 V424 M664 366 H626 V386 H606 V424" fill="none" stroke="${c1}" stroke-width="4"/>
  <polygon points="340,8 352,16 340,24 328,16" fill="${c2}" stroke="${c1}" stroke-width="2"/>
  <polygon points="340,416 352,424 340,432 328,424" fill="${c2}" stroke="${c1}" stroke-width="2"/>
</svg>`,
      };

    case 'border-double-classic':
      return {
        viewBox: '0 0 720 480',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480" preserveAspectRatio="none">
  <rect x="14" y="14" width="692" height="452" rx="12" fill="none" stroke="${c1}" stroke-width="5"/>
  <rect x="28" y="28" width="664" height="424" rx="6" fill="none" stroke="${c2}" stroke-width="2"/>
  <circle cx="28" cy="28" r="8" fill="${c2}" stroke="${c1}" stroke-width="2"/>
  <circle cx="692" cy="28" r="8" fill="${c2}" stroke="${c1}" stroke-width="2"/>
  <circle cx="28" cy="452" r="8" fill="${c2}" stroke="${c1}" stroke-width="2"/>
  <circle cx="692" cy="452" r="8" fill="${c2}" stroke="${c1}" stroke-width="2"/>
</svg>`,
      };

    case 'border-postage-stamp':
      return {
        viewBox: '0 0 560 420',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 420" preserveAspectRatio="none">
  <rect x="16" y="16" width="528" height="388" rx="4" fill="none" stroke="${c1}" stroke-width="10" stroke-dasharray="14 10" stroke-linecap="round"/>
  <rect x="30" y="30" width="500" height="360" fill="none" stroke="${c2}" stroke-width="2.5"/>
</svg>`,
      };

    case 'border-filmstrip':
      return {
        viewBox: '0 0 720 460',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 460" preserveAspectRatio="none">
  <rect x="8" y="8" width="704" height="52" rx="6" fill="${c1}"/>
  <rect x="8" y="400" width="704" height="52" rx="6" fill="${c1}"/>
  <rect x="8" y="8" width="24" height="444" fill="${c1}"/>
  <rect x="688" y="8" width="24" height="444" fill="${c1}"/>
  ${Array.from({ length: 14 })
    .map((_, i) => `<rect x="${42 + i * 46}" y="20" width="26" height="20" rx="4" fill="${c2}"/><rect x="${42 + i * 46}" y="420" width="26" height="20" rx="4" fill="${c2}"/>`)
    .join('')}
  <text x="48" y="54" fill="${acc}" font-family="monospace" font-weight="700" font-size="11">${esc(label || '35MM FILM · 400').slice(0, 24)}</text>
</svg>`,
      };

    case 'border-stitched-craft':
      return {
        viewBox: '0 0 640 440',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" preserveAspectRatio="none">
  <rect x="12" y="12" width="616" height="416" rx="22" fill="none" stroke="${c2}" stroke-width="3"/>
  <rect x="22" y="22" width="596" height="396" rx="16" fill="none" stroke="${c1}" stroke-width="3.5" stroke-dasharray="12 8" stroke-linecap="round"/>
</svg>`,
      };

    case 'border-neon-frame':
      return {
        viewBox: '0 0 680 440',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 440" preserveAspectRatio="none">
  <defs>
    <linearGradient id="${uid}-nf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="50%" stop-color="${acc}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect x="14" y="14" width="652" height="412" rx="24" fill="none" stroke="url(#${uid}-nf)" stroke-width="10" opacity="0.35"/>
  <rect x="14" y="14" width="652" height="412" rx="24" fill="none" stroke="url(#${uid}-nf)" stroke-width="4.5"/>
  <rect x="26" y="26" width="628" height="388" rx="18" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.8"/>
</svg>`,
      };

    case 'border-torn-edge':
      return {
        viewBox: '0 0 760 110',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 110" preserveAspectRatio="none">
  <path d="M0 0 H760 V68 L730 82 L700 62 L668 86 L634 60 L600 84 L568 62 L532 88 L496 62 L462 84 L428 60 L394 86 L360 64 L324 88 L288 62 L252 84 L218 60 L182 86 L146 62 L112 84 L76 62 L40 86 L0 64 Z" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
  <path d="M0 64 L40 86 L76 62 L112 84 L146 62 L182 86 L218 60 L252 84 L288 62 L324 88 L360 64 L394 86 L428 60 L462 84 L496 62 L532 88 L568 62 L600 84 L634 60 L668 86 L700 62 L730 82 L760 68" fill="none" stroke="${c2}" stroke-width="4" opacity="0.65"/>
</svg>`,
      };

    case 'border-checker-y2k':
      return {
        viewBox: '0 0 700 460',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 460" preserveAspectRatio="none">
  <defs>
    <pattern id="${uid}-chk" width="28" height="28" patternUnits="userSpaceOnUse">
      <rect width="14" height="14" fill="${c1}"/>
      <rect x="14" width="14" height="14" fill="${c2}"/>
      <rect y="14" width="14" height="14" fill="${c2}"/>
      <rect x="14" y="14" width="14" height="14" fill="${c1}"/>
    </pattern>
  </defs>
  <rect x="8" y="8" width="684" height="28" fill="url(#${uid}-chk)" stroke="${out}" stroke-width="2"/>
  <rect x="8" y="424" width="684" height="28" fill="url(#${uid}-chk)" stroke="${out}" stroke-width="2"/>
  <rect x="8" y="36" width="28" height="388" fill="url(#${uid}-chk)" stroke="${out}" stroke-width="2"/>
  <rect x="664" y="36" width="28" height="388" fill="url(#${uid}-chk)" stroke="${out}" stroke-width="2"/>
</svg>`,
      };

    case 'border-confetti-edge':
      return {
        viewBox: '0 0 740 480',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 740 480">
  <rect x="18" y="18" width="704" height="444" rx="18" fill="none" stroke="${c2}" stroke-width="2.5" stroke-dasharray="10 8"/>
  <circle cx="42" cy="42" r="10" fill="${c1}"/>
  <circle cx="140" cy="24" r="6" fill="${acc}"/>
  <rect x="260" y="16" width="16" height="8" rx="3" fill="${c2}" transform="rotate(-18 268 20)"/>
  <circle cx="420" cy="24" r="7" fill="${c1}"/>
  <rect x="560" y="18" width="18" height="8" rx="3" fill="${acc}" transform="rotate(22 569 22)"/>
  <circle cx="696" cy="44" r="10" fill="${c2}"/>
  <circle cx="712" cy="180" r="7" fill="${c1}"/>
  <rect x="706" y="310" width="16" height="8" rx="3" fill="${acc}" transform="rotate(42 714 314)"/>
  <circle cx="696" cy="440" r="10" fill="${acc}"/>
  <circle cx="520" cy="456" r="7" fill="${c1}"/>
  <rect x="330" y="450" width="18" height="8" rx="3" fill="${c2}" transform="rotate(-14 339 454)"/>
  <circle cx="160" cy="454" r="7" fill="${acc}"/>
  <circle cx="42" cy="438" r="10" fill="${c2}"/>
  <circle cx="24" cy="260" r="7" fill="${acc}"/>
  <rect x="18" y="140" width="16" height="8" rx="3" fill="${c1}" transform="rotate(30 26 144)"/>
</svg>`,
      };

    case 'border-xmas-holly':
      return {
        viewBox: '0 0 740 480',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 740 480">
  <rect x="18" y="18" width="704" height="444" rx="18" fill="none" stroke="${c1}" stroke-width="6"/>
  <rect x="28" y="28" width="684" height="424" rx="12" fill="none" stroke="${acc}" stroke-width="2"/>
  ${[
    [32, 32],
    [708, 32],
    [32, 448],
    [708, 448],
  ]
    .map(
      ([cx, cy]) => `<g transform="translate(${cx},${cy})">
    <ellipse cx="-16" cy="0" rx="18" ry="9" fill="${c1}" stroke="${out}" stroke-width="1.8" transform="rotate(-25)"/>
    <ellipse cx="16" cy="0" rx="18" ry="9" fill="#22C55E" stroke="${out}" stroke-width="1.8" transform="rotate(25)"/>
    <circle cx="-5" cy="-4" r="6" fill="${c2}"/>
    <circle cx="5" cy="-4" r="6" fill="${c2}"/>
    <circle cx="0" cy="5" r="6" fill="#B91C1C"/>
  </g>`
    )
    .join('')}
</svg>`,
      };

    case 'border-xmas-lights':
      return {
        viewBox: '0 0 780 150',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 150">
  <path d="M10 26 Q105 92 200 26 T390 26 T580 26 T770 26" fill="none" stroke="${c1}" stroke-width="10" stroke-linecap="round"/>
  <path d="M10 26 Q105 92 200 26 T390 26 T580 26 T770 26" fill="none" stroke="#1E293B" stroke-width="3"/>
  ${[58, 105, 152, 248, 295, 342, 438, 485, 532, 628, 675, 722]
    .map((bx, i) => {
      const by = i % 3 === 1 ? 66 : 48;
      const col = [acc, c2, '#38BDF8', '#22C55E'][i % 4];
      return `<rect x="${bx - 5}" y="${by - 6}" width="10" height="8" rx="2" fill="#475569"/><ellipse cx="${bx}" cy="${by + 12}" rx="10" ry="14" fill="${col}" stroke="${out}" stroke-width="1.5"/><circle cx="${bx - 3}" cy="${by + 8}" r="3" fill="#FFFFFF" opacity="0.65"/>`;
    })
    .join('')}
</svg>`,
      };

    // ==================== BACKGROUND DESIGNS ====================
    case 'bg-sunburst-rays': {
      const wedges = Array.from({ length: 16 })
        .map((_, i) => {
          const a1 = ((i * 22.5) * Math.PI) / 180;
          const a2 = (((i * 22.5) + 11.25) * Math.PI) / 180;
          const r = 700;
          return `<polygon points="480,270 ${(480 + Math.cos(a1) * r).toFixed(1)},${(270 + Math.sin(a1) * r).toFixed(1)} ${(480 + Math.cos(a2) * r).toFixed(1)},${(270 + Math.sin(a2) * r).toFixed(1)}" fill="${c2}" opacity="0.65"/>`;
        })
        .join('');
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <rect width="960" height="540" fill="${c1}"/>
  ${wedges}
  <circle cx="480" cy="270" r="140" fill="${acc}" opacity="0.22"/>
</svg>`,
      };
    }

    case 'bg-aurora-mesh':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-am1" cx="20%" cy="25%" r="55%"><stop offset="0%" stop-color="${c1}" stop-opacity="0.55"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${uid}-am2" cx="80%" cy="30%" r="55%"><stop offset="0%" stop-color="${c2}" stop-opacity="0.55"/><stop offset="100%" stop-color="${c2}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${uid}-am3" cx="50%" cy="85%" r="60%"><stop offset="0%" stop-color="${acc}" stop-opacity="0.5"/><stop offset="100%" stop-color="${acc}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="960" height="540" fill="${out}"/>
  <rect width="960" height="540" fill="url(#${uid}-am1)"/>
  <rect width="960" height="540" fill="url(#${uid}-am2)"/>
  <rect width="960" height="540" fill="url(#${uid}-am3)"/>
</svg>`,
      };

    case 'bg-blueprint-grid':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <pattern id="${uid}-bp" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${acc}" stroke-opacity="0.28" stroke-width="1"/>
      <path d="M 20 0 V 60 M 40 0 V 60 M 0 20 H 60 M 0 40 H 60" fill="none" stroke="${acc}" stroke-opacity="0.12" stroke-width="0.6"/>
    </pattern>
  </defs>
  <rect width="960" height="540" fill="${c1}"/>
  <rect width="960" height="540" fill="url(#${uid}-bp)"/>
  <rect x="24" y="24" width="912" height="492" fill="none" stroke="${out}" stroke-opacity="0.4" stroke-width="2"/>
</svg>`,
      };

    case 'bg-memphis-confetti':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
  <rect width="960" height="540" fill="${c1}"/>
  <circle cx="96" cy="96" r="28" fill="${acc}" opacity="0.42"/>
  <circle cx="840" cy="430" r="42" fill="${c2}" opacity="0.32"/>
  <polygon points="180,410 220,350 250,420" fill="${out}" opacity="0.55"/>
  <polygon points="780,86 825,112 792,148" fill="${acc}" opacity="0.48"/>
  <path d="M400 70 Q425 46 450 70 T500 70" fill="none" stroke="${c2}" stroke-width="6" stroke-linecap="round"/>
  <path d="M620 460 Q645 436 670 460 T720 460" fill="none" stroke="${acc}" stroke-width="6" stroke-linecap="round"/>
  <rect x="110" y="240" width="26" height="26" rx="5" fill="${c2}" opacity="0.5" transform="rotate(24 123 253)"/>
  <rect x="820" y="230" width="24" height="24" rx="5" fill="${out}" opacity="0.65" transform="rotate(-18 832 242)"/>
</svg>`,
      };

    case 'bg-halftone-pop': {
      const dots: string[] = [];
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 18; col++) {
          const r = Math.max(2, 12 - row * 1.05);
          dots.push(`<circle cx="${28 + col * 53}" cy="${28 + row * 52}" r="${r.toFixed(1)}" fill="${c2}" opacity="${(0.18 + (10 - row) * 0.04).toFixed(2)}"/>`);
        }
      }
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
  <rect width="960" height="540" fill="${c1}"/>
  ${dots.join('')}
</svg>`,
      };
    }

    case 'bg-diagonal-stripes':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <pattern id="${uid}-ds" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="22" height="44" fill="${c1}"/>
      <rect x="22" width="22" height="44" fill="${c2}"/>
    </pattern>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-ds)"/>
</svg>`,
      };

    case 'bg-starry-midnight':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="${uid}-sn" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-sn)"/>
  ${[
    [110, 88, 12],
    [240, 160, 8],
    [410, 72, 14],
    [590, 130, 9],
    [760, 80, 15],
    [870, 210, 10],
    [150, 390, 11],
    [340, 440, 14],
    [680, 410, 12],
    [840, 470, 9],
  ]
    .map(
      ([sx, sy, sr]) =>
        `<path d="M${sx} ${sy - sr} L${sx + sr * 0.28} ${sy - sr * 0.28} L${sx + sr} ${sy} L${sx + sr * 0.28} ${sy + sr * 0.28} L${sx} ${sy + sr} L${sx - sr * 0.28} ${sy + sr * 0.28} L${sx - sr} ${sy} L${sx - sr * 0.28} ${sy - sr * 0.28} Z" fill="${acc}"/>`
    )
    .join('')}
  <circle cx="510" cy="300" r="2.5" fill="${out}" opacity="0.7"/>
  <circle cx="290" cy="280" r="2" fill="${out}" opacity="0.6"/>
  <circle cx="710" cy="250" r="2.5" fill="${out}" opacity="0.7"/>
</svg>`,
      };

    case 'bg-winter-snowfall':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="${uid}-ws" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-ws)"/>
  <circle cx="150" cy="120" r="46" fill="${acc}" opacity="0.14"/>
  <circle cx="780" cy="140" r="64" fill="${acc}" opacity="0.12"/>
  <circle cx="480" cy="280" r="82" fill="${acc}" opacity="0.1"/>
  ${[
    [80, 70, 7],
    [220, 140, 5],
    [350, 80, 9],
    [520, 110, 6],
    [680, 75, 8],
    [860, 130, 7],
    [130, 310, 8],
    [290, 390, 6],
    [470, 440, 10],
    [650, 350, 6],
    [820, 410, 9],
    [910, 290, 5],
  ]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${acc}" opacity="0.82"/>`)
    .join('')}
  <path d="M0 470 Q240 420 480 465 T960 445 V540 H0 Z" fill="${acc}" opacity="0.35"/>
</svg>`,
      };

    case 'bg-xmas-velvet':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
  <defs>
    <radialGradient id="${uid}-xv" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c1}"/>
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-xv)"/>
  <rect x="24" y="24" width="912" height="492" rx="16" fill="none" stroke="${acc}" stroke-width="2.5" opacity="0.65"/>
  ${[
    [120, 90],
    [840, 90],
    [120, 450],
    [840, 450],
    [480, 70],
  ]
    .map(
      ([sx, sy]) =>
        `<path d="M${sx} ${sy - 14} L${sx + 4} ${sy - 4} L${sx + 14} ${sy} L${sx + 4} ${sy + 4} L${sx} ${sy + 14} L${sx - 4} ${sy + 4} L${sx - 14} ${sy} L${sx - 4} ${sy - 4} Z" fill="${acc}" opacity="0.82"/>`
    )
    .join('')}
</svg>`,
      };

    case 'bg-newyear-fireworks': {
      const burst = (cx: number, cy: number, r: number, col: string) =>
        Array.from({ length: 12 })
          .map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return `<line x1="${(cx + Math.cos(a) * r * 0.25).toFixed(1)}" y1="${(cy + Math.sin(a) * r * 0.25).toFixed(1)}" x2="${(cx + Math.cos(a) * r).toFixed(1)}" y2="${(cy + Math.sin(a) * r).toFixed(1)}" stroke="${col}" stroke-width="3" stroke-linecap="round"/><circle cx="${(cx + Math.cos(a) * (r + 8)).toFixed(1)}" cy="${(cy + Math.sin(a) * (r + 8)).toFixed(1)}" r="3.5" fill="${col}"/>`;
          })
          .join('');
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="${uid}-nyb" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-nyb)"/>
  ${burst(180, 150, 74, acc)}
  ${burst(770, 130, 82, out)}
  ${burst(510, 220, 62, '#38BDF8')}
  ${burst(280, 390, 50, '#FDE047')}
  ${burst(720, 380, 56, '#A855F7')}
</svg>`,
      };
    }

    // ==================== 20 CHRISTMAS & NEW YEAR ELEMENTS ====================
    case 'xmas-tree':
      return {
        viewBox: '0 0 210 260',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 260">
  <ellipse cx="105" cy="246" rx="68" ry="10" fill="#94A3B8" opacity="0.28"/>
  <rect x="88" y="202" width="34" height="42" rx="4" fill="#78350F" stroke="${out}" stroke-width="2.5"/>
  <polygon points="105,86 184,210 26,210" fill="${c1}" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="105,58 166,158 44,158" fill="#16A34A" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="105,30 148,108 62,108" fill="#22C55E" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M68 94 Q105 112 142 94 M52 142 Q105 164 158 142 M38 192 Q105 216 172 192" fill="none" stroke="${acc}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="90" cy="86" r="7" fill="${c2}" stroke="${out}" stroke-width="1.5"/>
  <circle cx="122" cy="128" r="8" fill="${acc}" stroke="${out}" stroke-width="1.5"/>
  <circle cx="74" cy="144" r="7" fill="#38BDF8" stroke="${out}" stroke-width="1.5"/>
  <circle cx="140" cy="184" r="8" fill="${c2}" stroke="${out}" stroke-width="1.5"/>
  <circle cx="64" cy="188" r="8" fill="${acc}" stroke="${out}" stroke-width="1.5"/>
  <circle cx="104" cy="176" r="7" fill="#EC4899" stroke="${out}" stroke-width="1.5"/>
  <polygon points="105,6 112,21 128,23 116,34 119,50 105,42 91,50 94,34 82,23 98,21" fill="${acc}" stroke="#92400E" stroke-width="2" stroke-linejoin="round"/>
</svg>`,
      };

    case 'xmas-santa':
      return {
        viewBox: '0 0 210 245',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 245">
  <ellipse cx="105" cy="232" rx="64" ry="10" fill="#94A3B8" opacity="0.25"/>
  <rect x="64" y="186" width="24" height="40" rx="10" fill="#1E293B" stroke="${out}" stroke-width="2.5"/>
  <rect x="122" y="186" width="24" height="40" rx="10" fill="#1E293B" stroke="${out}" stroke-width="2.5"/>
  <rect x="52" y="114" width="106" height="82" rx="34" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <rect x="52" y="152" width="106" height="16" fill="#1E293B"/>
  <rect x="92" y="149" width="26" height="22" rx="4" fill="none" stroke="${acc}" stroke-width="4"/>
  <circle cx="105" cy="72" r="32" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M72 80 C72 122 138 122 138 80 C124 88 86 88 72 80 Z" fill="#FFFFFF" stroke="${out}" stroke-width="2.5"/>
  <circle cx="94" cy="68" r="3.4" fill="${out}"/>
  <circle cx="116" cy="68" r="3.4" fill="${out}"/>
  <circle cx="105" cy="76" r="5" fill="#F43F5E"/>
  <path d="M70 50 C76 16 142 14 152 48 Z" fill="${c1}" stroke="${out}" stroke-width="2.8"/>
  <rect x="66" y="46" width="78" height="14" rx="7" fill="#FFFFFF" stroke="${out}" stroke-width="2.4"/>
  <circle cx="154" cy="48" r="10" fill="#FFFFFF" stroke="${out}" stroke-width="2.4"/>
</svg>`,
      };

    case 'xmas-santa-hat':
      return {
        viewBox: '0 0 210 175',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 175">
  <path d="M32 128 C34 46 92 14 152 38 C176 48 188 78 184 104 L148 92 C142 66 116 56 88 68 L160 128 Z" fill="${c1}" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <rect x="20" y="114" width="148" height="36" rx="18" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <circle cx="176" cy="106" r="20" fill="${c2}" stroke="${out}" stroke-width="3"/>
</svg>`,
      };

    case 'xmas-snowman':
      return {
        viewBox: '0 0 200 250',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250">
  <ellipse cx="100" cy="236" rx="64" ry="10" fill="#94A3B8" opacity="0.28"/>
  <path d="M54 134 L20 112 M28 118 L20 100 M146 134 L180 112 M172 118 L180 100" stroke="#78350F" stroke-width="5" stroke-linecap="round"/>
  <circle cx="100" cy="182" r="48" fill="#FFFFFF" stroke="${out}" stroke-width="3"/>
  <circle cx="100" cy="120" r="36" fill="#FFFFFF" stroke="${out}" stroke-width="3"/>
  <circle cx="100" cy="68" r="27" fill="#FFFFFF" stroke="${out}" stroke-width="3"/>
  <path d="M70 92 Q100 104 130 92 V106 Q100 116 70 106 Z" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
  <rect x="114" y="96" width="16" height="36" rx="4" fill="${c2}" stroke="${out}" stroke-width="2.2"/>
  <circle cx="100" cy="122" r="4" fill="${out}"/>
  <circle cx="100" cy="140" r="4" fill="${out}"/>
  <circle cx="91" cy="64" r="3.2" fill="${out}"/>
  <circle cx="109" cy="64" r="3.2" fill="${out}"/>
  <polygon points="100,70 124,75 100,80" fill="${acc}" stroke="${out}" stroke-width="1.8" stroke-linejoin="round"/>
  <rect x="64" y="38" width="72" height="10" rx="4" fill="#1E293B"/>
  <rect x="76" y="10" width="48" height="30" rx="4" fill="#1E293B"/>
  <rect x="76" y="31" width="48" height="7" fill="${c2}"/>
</svg>`,
      };

    case 'xmas-reindeer':
      return {
        viewBox: '0 0 210 235',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 235">
  <ellipse cx="105" cy="222" rx="60" ry="9" fill="#94A3B8" opacity="0.25"/>
  <path d="M80 48 L56 12 M68 30 L48 28 M62 22 L70 10 M130 48 L154 12 M142 30 L162 28 M148 22 L140 10" fill="none" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="64" cy="58" rx="16" ry="9" fill="${c1}" stroke="${out}" stroke-width="2.5" transform="rotate(-24 64 58)"/>
  <ellipse cx="146" cy="58" rx="16" ry="9" fill="${c1}" stroke="${out}" stroke-width="2.5" transform="rotate(24 146 58)"/>
  <rect x="70" y="122" width="70" height="84" rx="28" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <ellipse cx="105" cy="168" rx="22" ry="30" fill="#FDE68A"/>
  <rect x="68" y="114" width="74" height="18" rx="8" fill="${acc}" stroke="${out}" stroke-width="2.4"/>
  <circle cx="105" cy="136" r="10" fill="#FACC15" stroke="${out}" stroke-width="2"/>
  <circle cx="105" cy="80" r="36" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <ellipse cx="105" cy="94" rx="22" ry="15" fill="#FDE68A"/>
  <circle cx="92" cy="72" r="4" fill="${out}"/>
  <circle cx="118" cy="72" r="4" fill="${out}"/>
  <circle cx="105" cy="88" r="9" fill="${c2}" stroke="${out}" stroke-width="2"/>
  <circle cx="102" cy="85" r="3" fill="#FFFFFF" opacity="0.7"/>
</svg>`,
      };

    case 'xmas-gift-box':
      return {
        viewBox: '0 0 200 210',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 210">
  <ellipse cx="100" cy="196" rx="68" ry="10" fill="#94A3B8" opacity="0.28"/>
  <path d="M100 50 C70 16 42 22 46 44 C50 60 82 58 100 52 C118 58 150 60 154 44 C158 22 130 16 100 50 Z" fill="${c2}" stroke="${out}" stroke-width="2.8"/>
  <circle cx="100" cy="52" r="10" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
  <rect x="28" y="84" width="144" height="106" rx="12" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <rect x="20" y="56" width="160" height="34" rx="8" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <rect x="86" y="56" width="28" height="134" fill="${c2}" stroke="${out}" stroke-width="2"/>
  <rect x="28" y="124" width="144" height="24" fill="${acc}" stroke="${out}" stroke-width="2"/>
  ${label ? `<rect x="54" y="124" width="92" height="24" rx="6" fill="#FFFFFF" stroke="${out}" stroke-width="1.8"/><text x="100" y="141" text-anchor="middle" fill="${out}" font-family="Outfit, sans-serif" font-weight="900" font-size="13">${label.slice(0, 8)}</text>` : ''}
</svg>`,
      };

    case 'xmas-candy-cane':
      return {
        viewBox: '0 0 200 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">
  <g transform="rotate(-18 100 110)">
    <path d="M74 184 V68 A28 28 0 0 1 130 68 V82" fill="none" stroke="${out}" stroke-width="28" stroke-linecap="round"/>
    <path d="M74 184 V68 A28 28 0 0 1 130 68 V82" fill="none" stroke="${c2}" stroke-width="22" stroke-linecap="round"/>
    <path d="M74 184 V68 A28 28 0 0 1 130 68 V82" fill="none" stroke="${c1}" stroke-width="22" stroke-dasharray="14 14"/>
  </g>
  <g transform="rotate(18 100 110)">
    <path d="M126 184 V68 A28 28 0 0 0 70 68 V82" fill="none" stroke="${out}" stroke-width="28" stroke-linecap="round"/>
    <path d="M126 184 V68 A28 28 0 0 0 70 68 V82" fill="none" stroke="${c2}" stroke-width="22" stroke-linecap="round"/>
    <path d="M126 184 V68 A28 28 0 0 0 70 68 V82" fill="none" stroke="${c1}" stroke-width="22" stroke-dasharray="14 14"/>
  </g>
  <path d="M100 112 C76 94 56 102 60 118 C64 132 86 126 100 118 C114 126 136 132 140 118 C144 102 124 94 100 112 Z" fill="${acc}" stroke="${out}" stroke-width="2.5"/>
  <circle cx="100" cy="116" r="9" fill="${acc}" stroke="${out}" stroke-width="2.5"/>
</svg>`,
      };

    case 'xmas-stocking':
      return {
        viewBox: '0 0 190 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 240">
  <path d="M62 66 V136 L34 162 C18 176 22 206 44 216 C64 226 92 214 114 190 C128 174 134 156 134 132 V66 Z" fill="${c1}" stroke="${out}" stroke-width="3.2" stroke-linejoin="round"/>
  <path d="M40 162 C26 176 30 202 48 210 C60 216 74 210 82 200 C66 196 50 180 40 162 Z" fill="${acc}"/>
  <rect x="52" y="24" width="92" height="46" rx="14" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <circle cx="98" cy="112" r="14" fill="#FACC15" opacity="0.85"/>
</svg>`,
      };

    case 'xmas-gingerbread':
      return {
        viewBox: '0 0 200 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 230">
  <ellipse cx="100" cy="218" rx="58" ry="8" fill="#94A3B8" opacity="0.24"/>
  <path d="M74 96 H34 A16 16 0 0 0 34 128 H68 L58 190 A16 16 0 0 0 88 198 L100 160 L112 198 A16 16 0 0 0 142 190 L132 128 H166 A16 16 0 0 0 166 96 H126 Z" fill="${c1}" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="100" cy="60" r="36" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <circle cx="86" cy="54" r="5" fill="${c2}"/>
  <circle cx="114" cy="54" r="5" fill="${c2}"/>
  <circle cx="78" cy="68" r="5" fill="#FB7185"/>
  <circle cx="122" cy="68" r="5" fill="#FB7185"/>
  <path d="M88 74 Q100 84 112 74" fill="none" stroke="${c2}" stroke-width="3.5" stroke-linecap="round"/>
  <polygon points="100,98 84,90 84,106" fill="${acc}" stroke="${out}" stroke-width="1.8"/>
  <polygon points="100,98 116,90 116,106" fill="${acc}" stroke="${out}" stroke-width="1.8"/>
  <circle cx="100" cy="122" r="6" fill="#22C55E"/>
  <circle cx="100" cy="142" r="6" fill="${acc}"/>
  <path d="M40 100 V124 M160 100 V124" stroke="${c2}" stroke-width="4" stroke-linecap="round"/>
</svg>`,
      };

    case 'xmas-wreath':
      return {
        viewBox: '0 0 220 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
  <circle cx="110" cy="110" r="66" fill="none" stroke="${out}" stroke-width="42"/>
  <circle cx="110" cy="110" r="66" fill="none" stroke="${c1}" stroke-width="36"/>
  <circle cx="110" cy="110" r="66" fill="none" stroke="#22C55E" stroke-width="22" stroke-dasharray="14 10"/>
  <circle cx="62" cy="70" r="7" fill="${c2}"/>
  <circle cx="158" cy="70" r="7" fill="${c2}"/>
  <circle cx="52" cy="134" r="7" fill="${acc}"/>
  <circle cx="168" cy="134" r="7" fill="${acc}"/>
  <circle cx="110" cy="176" r="7" fill="${c2}"/>
  <path d="M110 40 C86 16 58 22 62 42 C66 56 94 52 110 44 C126 52 154 56 158 42 C162 22 134 16 110 40 Z" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
  <path d="M102 46 L82 78 L98 74 Z M118 46 L138 78 L122 74 Z" fill="#B91C1C" stroke="${out}" stroke-width="2"/>
  <circle cx="110" cy="44" r="9" fill="#EF4444" stroke="${out}" stroke-width="2"/>
</svg>`,
      };

    case 'xmas-jingle-bells':
      return {
        viewBox: '0 0 210 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 200">
  <defs>
    <linearGradient id="${uid}-jb" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="55%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${out}"/>
    </linearGradient>
  </defs>
  <g transform="rotate(-18 76 116)">
    <path d="M52 68 C52 46 100 46 100 68 L112 136 H40 Z" fill="url(#${uid}-jb)" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="76" cy="136" rx="36" ry="8" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
    <circle cx="76" cy="146" r="9" fill="${out}"/>
  </g>
  <g transform="rotate(18 134 116)">
    <path d="M110 68 C110 46 158 46 158 68 L170 136 H98 Z" fill="url(#${uid}-jb)" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="134" cy="136" rx="36" ry="8" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
    <circle cx="134" cy="146" r="9" fill="${out}"/>
  </g>
  <path d="M105 46 C80 22 54 28 58 48 C62 62 90 58 105 50 C120 58 148 62 152 48 C156 28 130 22 105 46 Z" fill="${acc}" stroke="${out}" stroke-width="2.5"/>
  <circle cx="105" cy="50" r="9" fill="${acc}" stroke="${out}" stroke-width="2"/>
</svg>`,
      };

    case 'xmas-snowflake':
      return {
        viewBox: '0 0 200 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="84" fill="${c2}" opacity="0.45"/>
  ${[0, 60, 120]
    .map(
      (deg) => `<g transform="rotate(${deg} 100 100)">
    <line x1="100" y1="16" x2="100" y2="184" stroke="${c1}" stroke-width="10" stroke-linecap="round"/>
    <line x1="100" y1="16" x2="100" y2="184" stroke="${acc}" stroke-width="4" stroke-linecap="round"/>
    <path d="M84 40 L100 56 L116 40 M84 160 L100 144 L116 160" fill="none" stroke="${c1}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`
    )
    .join('')}
  <circle cx="100" cy="100" r="16" fill="${acc}" stroke="${out}" stroke-width="4"/>
</svg>`,
      };

    case 'xmas-ornaments':
      return {
        viewBox: '0 0 220 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200">
  <line x1="56" y1="8" x2="56" y2="60" stroke="${c2}" stroke-width="3"/>
  <line x1="112" y1="8" x2="112" y2="88" stroke="${c2}" stroke-width="3"/>
  <line x1="168" y1="8" x2="168" y2="52" stroke="${c2}" stroke-width="3"/>
  <rect x="46" y="54" width="20" height="12" rx="3" fill="${c2}" stroke="${out}" stroke-width="1.5"/>
  <circle cx="56" cy="102" r="36" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
  <ellipse cx="44" cy="88" rx="9" ry="5" fill="#FFFFFF" opacity="0.55" transform="rotate(-30 44 88)"/>
  <rect x="102" y="84" width="20" height="12" rx="3" fill="${c2}" stroke="${out}" stroke-width="1.5"/>
  <circle cx="112" cy="136" r="40" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
  <ellipse cx="98" cy="120" rx="10" ry="6" fill="#FFFFFF" opacity="0.55" transform="rotate(-30 98 120)"/>
  <rect x="158" y="48" width="20" height="12" rx="3" fill="${c2}" stroke="${out}" stroke-width="1.5"/>
  <circle cx="168" cy="96" r="34" fill="${acc}" stroke="${out}" stroke-width="2.5"/>
  <ellipse cx="156" cy="84" rx="8" ry="5" fill="#FFFFFF" opacity="0.55" transform="rotate(-30 156 84)"/>
</svg>`,
      };

    case 'xmas-cocoa-mug':
      return {
        viewBox: '0 0 200 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <path d="M74 36 Q66 22 76 12 M100 32 Q92 18 102 8 M126 36 Q118 22 128 12" fill="none" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>
  <path d="M148 92 H168 A20 20 0 0 1 168 136 H148" fill="none" stroke="${c1}" stroke-width="14" stroke-linecap="round"/>
  <path d="M40 72 H148 V146 C148 172 126 184 94 184 C62 184 40 172 40 146 Z" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <ellipse cx="94" cy="72" rx="54" ry="15" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <rect x="64" y="56" width="18" height="16" rx="5" fill="${acc}" stroke="#CBD5E1" stroke-width="1.5"/>
  <rect x="88" y="52" width="18" height="16" rx="5" fill="${acc}" stroke="#CBD5E1" stroke-width="1.5"/>
  <rect x="110" y="58" width="18" height="16" rx="5" fill="${acc}" stroke="#CBD5E1" stroke-width="1.5"/>
  ${label ? `<text x="94" y="138" text-anchor="middle" fill="${acc}" font-family="Outfit, sans-serif" font-weight="900" font-size="22">${label.slice(0, 8)}</text>` : ''}
</svg>`,
      };

    case 'xmas-candle':
      return {
        viewBox: '0 0 190 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 220">
  <circle cx="95" cy="46" r="32" fill="${c2}" opacity="0.22"/>
  <path d="M95 16 C112 38 112 58 95 62 C78 58 78 38 95 16 Z" fill="${c2}" stroke="#EA580C" stroke-width="2"/>
  <path d="M95 34 C102 44 102 54 95 56 C88 54 88 44 95 34 Z" fill="#FEF08A"/>
  <line x1="95" y1="62" x2="95" y2="72" stroke="#1E293B" stroke-width="3"/>
  <rect x="62" y="72" width="66" height="108" rx="10" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <path d="M62 84 Q76 104 86 84 Q96 108 106 84 Q118 98 128 84" fill="${c1}" stroke="#FDE68A" stroke-width="3"/>
  <ellipse cx="48" cy="176" rx="22" ry="11" fill="${acc}" stroke="#14532D" stroke-width="2" transform="rotate(-18 48 176)"/>
  <ellipse cx="142" cy="176" rx="22" ry="11" fill="${acc}" stroke="#14532D" stroke-width="2" transform="rotate(18 142 176)"/>
  <rect x="42" y="180" width="106" height="16" rx="8" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
  <circle cx="88" cy="174" r="6" fill="#DC2626"/>
  <circle cx="102" cy="174" r="6" fill="#DC2626"/>
</svg>`,
      };

    case 'xmas-merry-banner':
      return {
        viewBox: '0 0 340 120',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 120">
  <polygon points="10,42 54,42 54,96 10,96 28,69" fill="${c2}" stroke="${out}" stroke-width="2.5" stroke-linejoin="round"/>
  <polygon points="330,42 286,42 286,96 330,96 312,69" fill="${c2}" stroke="${out}" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="38" y="22" width="264" height="64" rx="14" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <rect x="46" y="30" width="248" height="48" rx="10" fill="none" stroke="${acc}" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="170" y="63" text-anchor="middle" fill="#FFFFFF" font-family="Outfit, sans-serif" font-weight="900" font-size="24" letter-spacing="1.8">${esc(label || 'MERRY XMAS').slice(0, 18)}</text>
</svg>`,
      };

    case 'ny-champagne':
      return {
        viewBox: '0 0 210 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 220">
  <g transform="rotate(-14 78 124)">
    <path d="M56 44 H100 L92 114 C90 128 66 128 64 114 Z" fill="${c2}" fill-opacity="0.6" stroke="${out}" stroke-width="2.8"/>
    <path d="M60 72 H96 L92 114 C90 126 66 126 64 114 Z" fill="${c1}"/>
    <line x1="78" y1="126" x2="78" y2="188" stroke="${out}" stroke-width="4"/>
    <ellipse cx="78" cy="190" rx="24" ry="7" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
  </g>
  <g transform="rotate(14 132 124)">
    <path d="M110 44 H154 L146 114 C144 128 120 128 118 114 Z" fill="${c2}" fill-opacity="0.6" stroke="${out}" stroke-width="2.8"/>
    <path d="M114 72 H150 L146 114 C144 126 120 126 118 114 Z" fill="${c1}"/>
    <line x1="132" y1="126" x2="132" y2="188" stroke="${out}" stroke-width="4"/>
    <ellipse cx="132" cy="190" rx="24" ry="7" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
  </g>
  <path d="M105 14 L110 28 L124 33 L110 38 L105 52 L100 38 L86 33 L100 28 Z" fill="${acc}"/>
  <circle cx="88" cy="24" r="4" fill="#FFFFFF"/>
  <circle cx="124" cy="26" r="4" fill="${c1}"/>
</svg>`,
      };

    case 'ny-fireworks': {
      const rays1 = Array.from({ length: 12 })
        .map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return `<line x1="${(110 + Math.cos(a) * 18).toFixed(1)}" y1="${(110 + Math.sin(a) * 18).toFixed(1)}" x2="${(110 + Math.cos(a) * 86).toFixed(1)}" y2="${(110 + Math.sin(a) * 86).toFixed(1)}" stroke="${i % 2 === 0 ? c1 : c2}" stroke-width="5" stroke-linecap="round"/><circle cx="${(110 + Math.cos(a) * 96).toFixed(1)}" cy="${(110 + Math.sin(a) * 96).toFixed(1)}" r="5" fill="${i % 2 === 0 ? c1 : acc}"/>`;
        })
        .join('');
      return {
        viewBox: '0 0 220 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
  ${rays1}
  <circle cx="110" cy="110" r="14" fill="${acc}" stroke="${out}" stroke-width="2"/>
  <circle cx="110" cy="110" r="6" fill="#FFFFFF"/>
</svg>`,
      };
    }

    case 'ny-countdown-clock':
      return {
        viewBox: '0 0 210 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 220">
  <circle cx="105" cy="24" r="12" fill="none" stroke="${c1}" stroke-width="6"/>
  <rect x="93" y="32" width="24" height="14" rx="4" fill="${c1}" stroke="${out}" stroke-width="2"/>
  <circle cx="105" cy="122" r="82" fill="${c1}" stroke="${out}" stroke-width="3.5"/>
  <circle cx="105" cy="122" r="68" fill="${c2}" stroke="${acc}" stroke-width="2.5"/>
  <line x1="105" y1="122" x2="105" y2="70" stroke="${acc}" stroke-width="6" stroke-linecap="round"/>
  <line x1="105" y1="122" x2="101" y2="82" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
  <circle cx="105" cy="122" r="7" fill="${acc}"/>
  <text x="105" y="166" text-anchor="middle" fill="${acc}" font-family="Outfit, sans-serif" font-weight="900" font-size="18" letter-spacing="1.5">${esc(label || '12:00').slice(0, 8)}</text>
</svg>`,
      };

    case 'ny-2026-banner':
      return {
        viewBox: '0 0 300 160',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160">
  <rect x="12" y="16" width="276" height="128" rx="22" fill="${c1}" stroke="${c2}" stroke-width="4"/>
  <rect x="22" y="26" width="256" height="108" rx="16" fill="none" stroke="${c2}" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="150" y="54" text-anchor="middle" fill="${acc}" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="13" letter-spacing="3.5">HAPPY NEW YEAR</text>
  <text x="150" y="116" text-anchor="middle" fill="${c2}" font-family="Outfit, sans-serif" font-weight="900" font-size="54" letter-spacing="4">${esc(label || '2026').slice(0, 8)}</text>
</svg>`,
      };

    default:
      return (
        renderTechHudSvg(kind, c1, c2, acc, out, label, uid) ??
        renderHeritageVintageSvg(kind, c1, c2, acc, out, label, uid) ??
        renderCrayonDoodleSvg(kind, c1, c2, acc, out, uid)
      );
  }
}
