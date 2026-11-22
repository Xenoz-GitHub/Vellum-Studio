import type { ShapeElement, Slide } from './schema';
import { EXTENDED_CUTOUT_CATALOG, renderExtendedDesignSvg } from './design-elements-catalog';

export { ICON_CATALOG, renderIconSvgString, type IconCatalogDef, type IconCategory } from './brand-icon-catalog';

export function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export interface CutoutItemDef {
  kind: string;
  name: string;
  category:
    | 'Doodles & Crayon'
    | 'Characters'
    | 'Education'
    | 'Christmas & New Year'
    | 'Headers & Lines'
    | 'Borders & Edges'
    | 'Backgrounds'
    | 'Celebration'
    | 'Tech & HUD'
    | 'Vintage & Flourishes'
    | 'History & Culture'
    | 'Retro Tech'
    | 'Nature & Fauna'
    | 'Ribbons & Badges'
    | 'Sparkles & Hearts';
  keywords: string[];
  defaultWidth: number;
  defaultHeight: number;
  defaultProps: {
    stickerKind: string;
    label: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    outlineColor: string;
  };
}

export const CUTOUT_CATALOG: CutoutItemDef[] = [
  {
    kind: 'balloon',
    name: 'Glossy Balloon',
    category: 'Celebration',
    keywords: ['balloon', 'party', 'birthday', 'float', 'customizable'],
    defaultWidth: 150,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'balloon',
      label: 'PARTY',
      primaryColor: '#7D1935',
      secondaryColor: '#F48FB1',
      accentColor: '#FFFFFF',
      outlineColor: '#4A0D1E',
    },
  },
  {
    kind: 'balloon-cluster',
    name: 'Balloon Trio',
    category: 'Celebration',
    keywords: ['balloons', 'cluster', 'party', 'birthday', 'celebration'],
    defaultWidth: 210,
    defaultHeight: 230,
    defaultProps: {
      stickerKind: 'balloon-cluster',
      label: '',
      primaryColor: '#7D1935',
      secondaryColor: '#3B6FD8',
      accentColor: '#F59E0B',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'retro-camera',
    name: 'Y2K Digicam',
    category: 'Retro Tech',
    keywords: ['camera', 'digicam', 'photo', 'retro', 'lens'],
    defaultWidth: 200,
    defaultHeight: 150,
    defaultProps: {
      stickerKind: 'retro-camera',
      label: 'V-CAM 35',
      primaryColor: '#CBD5E1',
      secondaryColor: '#254C9E',
      accentColor: '#60A5FA',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'cd-disc',
    name: 'Holo CD-ROM',
    category: 'Retro Tech',
    keywords: ['cd', 'disc', 'dvd', 'music', 'holographic', 'y2k'],
    defaultWidth: 180,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'cd-disc',
      label: 'MIX VOL.1',
      primaryColor: '#A5F3FC',
      secondaryColor: '#C084FC',
      accentColor: '#F472B6',
      outlineColor: '#334155',
    },
  },
  {
    kind: 'cassette-tape',
    name: 'Cassette Tape',
    category: 'Retro Tech',
    keywords: ['tape', 'cassette', 'music', 'audio', 'retro'],
    defaultWidth: 220,
    defaultHeight: 145,
    defaultProps: {
      stickerKind: 'cassette-tape',
      label: 'SIDE A · 90M',
      primaryColor: '#1E293B',
      secondaryColor: '#F59E0B',
      accentColor: '#38BDF8',
      outlineColor: '#0F172A',
    },
  },
  {
    kind: 'gold-chain',
    name: 'Metallic Chain',
    category: 'Retro Tech',
    keywords: ['chain', 'chains', 'gold', 'silver', 'chrome', 'link'],
    defaultWidth: 260,
    defaultHeight: 100,
    defaultProps: {
      stickerKind: 'gold-chain',
      label: '',
      primaryColor: '#F59E0B',
      secondaryColor: '#FEF08A',
      accentColor: '#B45309',
      outlineColor: '#78350F',
    },
  },
  {
    kind: 'brass-trumpet',
    name: 'Brass Trumpet',
    category: 'Celebration',
    keywords: ['trumpet', 'horn', 'brass', 'music', 'fanfare'],
    defaultWidth: 240,
    defaultHeight: 130,
    defaultProps: {
      stickerKind: 'brass-trumpet',
      label: '',
      primaryColor: '#F59E0B',
      secondaryColor: '#FEF3C7',
      accentColor: '#B45309',
      outlineColor: '#78350F',
    },
  },
  {
    kind: 'golden-fish',
    name: 'Golden Koi Fish',
    category: 'Nature & Fauna',
    keywords: ['fish', 'golden fish', 'goldfish', 'koi', 'aero', 'aquatic'],
    defaultWidth: 240,
    defaultHeight: 165,
    defaultProps: {
      stickerKind: 'golden-fish',
      label: '',
      primaryColor: '#F97316',
      secondaryColor: '#FDE047',
      accentColor: '#FFFBEB',
      outlineColor: '#9A3412',
    },
  },
  {
    kind: 'flower-hibiscus',
    name: 'Hibiscus Flower',
    category: 'Nature & Fauna',
    keywords: ['flower', 'hibiscus', 'floral', 'tropical', 'bloom'],
    defaultWidth: 180,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'flower-hibiscus',
      label: '',
      primaryColor: '#EC4899',
      secondaryColor: '#FBCFE8',
      accentColor: '#FACC15',
      outlineColor: '#831843',
    },
  },
  {
    kind: 'flower-daisy',
    name: 'Y2K Daisy',
    category: 'Nature & Fauna',
    keywords: ['flower', 'daisy', 'bloom', 'petal', 'sticker'],
    defaultWidth: 165,
    defaultHeight: 165,
    defaultProps: {
      stickerKind: 'flower-daisy',
      label: '',
      primaryColor: '#FFFFFF',
      secondaryColor: '#E2E8F0',
      accentColor: '#FACC15',
      outlineColor: '#334155',
    },
  },
  {
    kind: 'flower-rose',
    name: 'Velvet Rose',
    category: 'Nature & Fauna',
    keywords: ['flower', 'rose', 'floral', 'burgundy', 'botanical'],
    defaultWidth: 170,
    defaultHeight: 185,
    defaultProps: {
      stickerKind: 'flower-rose',
      label: '',
      primaryColor: '#9F1239',
      secondaryColor: '#FDA4AF',
      accentColor: '#15803D',
      outlineColor: '#4C0519',
    },
  },
  {
    kind: 'fluffy-cloud',
    name: 'Aero Cloud',
    category: 'Nature & Fauna',
    keywords: ['cloud', 'clouds', 'sky', 'aero', 'fluffy'],
    defaultWidth: 230,
    defaultHeight: 140,
    defaultProps: {
      stickerKind: 'fluffy-cloud',
      label: '',
      primaryColor: '#FFFFFF',
      secondaryColor: '#BAE6FD',
      accentColor: '#38BDF8',
      outlineColor: '#7DD3FC',
    },
  },
  {
    kind: 'botanical-tree',
    name: 'Sculpted Tree',
    category: 'Nature & Fauna',
    keywords: ['tree', 'trees', 'plant', 'nature', 'botanical', 'leaf'],
    defaultWidth: 180,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'botanical-tree',
      label: '',
      primaryColor: '#16A34A',
      secondaryColor: '#86EFAC',
      accentColor: '#78350F',
      outlineColor: '#14532D',
    },
  },
  {
    kind: 'bubble-cluster',
    name: 'Soap Bubbles',
    category: 'Nature & Fauna',
    keywords: ['bubble', 'bubbles', 'water', 'aero', 'iridescent'],
    defaultWidth: 190,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'bubble-cluster',
      label: '',
      primaryColor: '#BAE6FD',
      secondaryColor: '#A7F3D0',
      accentColor: '#FFFFFF',
      outlineColor: '#7DD3FC',
    },
  },
  {
    kind: 'butterfly-aero',
    name: 'Aero Butterfly',
    category: 'Nature & Fauna',
    keywords: ['butterfly', 'wings', 'aero', 'y2k', 'iridescent'],
    defaultWidth: 190,
    defaultHeight: 165,
    defaultProps: {
      stickerKind: 'butterfly-aero',
      label: '',
      primaryColor: '#38BDF8',
      secondaryColor: '#818CF8',
      accentColor: '#FFFFFF',
      outlineColor: '#1E3A8A',
    },
  },
  {
    kind: 'like-zone-badge',
    name: 'Like Zone Badge',
    category: 'Ribbons & Badges',
    keywords: ['like zone', 'like', 'badge', 'heart', 'social', 'y2k'],
    defaultWidth: 240,
    defaultHeight: 96,
    defaultProps: {
      stickerKind: 'like-zone-badge',
      label: 'LIKE ZONE',
      primaryColor: '#7D1935',
      secondaryColor: '#FB7185',
      accentColor: '#FFFFFF',
      outlineColor: '#4C0519',
    },
  },
  {
    kind: 'glossy-heart',
    name: 'Glossy Heart',
    category: 'Sparkles & Hearts',
    keywords: ['heart', 'hearts', 'love', 'glossy', 'aero', '3d'],
    defaultWidth: 160,
    defaultHeight: 150,
    defaultProps: {
      stickerKind: 'glossy-heart',
      label: '',
      primaryColor: '#E11D48',
      secondaryColor: '#FDA4AF',
      accentColor: '#FFFFFF',
      outlineColor: '#881337',
    },
  },
  {
    kind: 'ribbon-bow',
    name: 'Satin Ribbon Bow',
    category: 'Ribbons & Badges',
    keywords: ['ribbon', 'bow', 'coquette', 'satin', 'gift'],
    defaultWidth: 200,
    defaultHeight: 150,
    defaultProps: {
      stickerKind: 'ribbon-bow',
      label: '',
      primaryColor: '#EC4899',
      secondaryColor: '#FBCFE8',
      accentColor: '#BE185D',
      outlineColor: '#831843',
    },
  },
  {
    kind: 'scroll-banner',
    name: 'Scroll Banner',
    category: 'Ribbons & Badges',
    keywords: ['banner', 'ribbon', 'scroll', 'title', 'pubmat'],
    defaultWidth: 290,
    defaultHeight: 95,
    defaultProps: {
      stickerKind: 'scroll-banner',
      label: 'FEATURED',
      primaryColor: '#7D1935',
      secondaryColor: '#520E21',
      accentColor: '#FFFFFF',
      outlineColor: '#3B0816',
    },
  },
  {
    kind: 'prize-ribbon',
    name: 'Award Rosette',
    category: 'Ribbons & Badges',
    keywords: ['ribbon', 'prize', 'award', 'medal', 'badge'],
    defaultWidth: 150,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'prize-ribbon',
      label: 'NO.1',
      primaryColor: '#2563EB',
      secondaryColor: '#F59E0B',
      accentColor: '#FFFFFF',
      outlineColor: '#1E3A8A',
    },
  },
  {
    kind: 'ticket-stub',
    name: 'Admit Ticket Stub',
    category: 'Ribbons & Badges',
    keywords: ['ticket', 'banner', 'pubmat', 'event', 'pass'],
    defaultWidth: 250,
    defaultHeight: 115,
    defaultProps: {
      stickerKind: 'ticket-stub',
      label: 'VIP ACCESS · 2026',
      primaryColor: '#FEF3C7',
      secondaryColor: '#7D1935',
      accentColor: '#F59E0B',
      outlineColor: '#78350F',
    },
  },
  {
    kind: 'chrome-crown',
    name: 'Chrome Crown',
    category: 'Sparkles & Hearts',
    keywords: ['crown', 'king', 'queen', 'royal', 'chrome'],
    defaultWidth: 180,
    defaultHeight: 135,
    defaultProps: {
      stickerKind: 'chrome-crown',
      label: '',
      primaryColor: '#F59E0B',
      secondaryColor: '#FEF08A',
      accentColor: '#EF4444',
      outlineColor: '#92400E',
    },
  },
  {
    kind: 'lightning-bolt',
    name: 'Neon Volt Bolt',
    category: 'Sparkles & Hearts',
    keywords: ['lightning', 'bolt', 'flash', 'energy', 'zap'],
    defaultWidth: 140,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'lightning-bolt',
      label: '',
      primaryColor: '#FACC15',
      secondaryColor: '#FEF9C3',
      accentColor: '#EA580C',
      outlineColor: '#854D0E',
    },
  },
  {
    kind: 'sparkle-cluster',
    name: 'Y2K Sparkle Cluster',
    category: 'Sparkles & Hearts',
    keywords: ['sparkle', 'star', 'glint', 'shine', 'y2k'],
    defaultWidth: 160,
    defaultHeight: 160,
    defaultProps: {
      stickerKind: 'sparkle-cluster',
      label: '',
      primaryColor: '#FFFFFF',
      secondaryColor: '#93C5FD',
      accentColor: '#3B82F6',
      outlineColor: '#1D4ED8',
    },
  },
  {
    kind: 'rainbow-arc',
    name: 'Cloud Rainbow Arc',
    category: 'Celebration',
    keywords: ['rainbow', 'cloud', 'pride', 'color', 'sky'],
    defaultWidth: 250,
    defaultHeight: 150,
    defaultProps: {
      stickerKind: 'rainbow-arc',
      label: '',
      primaryColor: '#EF4444',
      secondaryColor: '#FACC15',
      accentColor: '#3B82F6',
      outlineColor: '#FFFFFF',
    },
  },
  {
    kind: 'confetti-pop',
    name: 'Party Confetti Pop',
    category: 'Celebration',
    keywords: ['confetti', 'party', 'popper', 'celebrate', 'birthday'],
    defaultWidth: 180,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'confetti-pop',
      label: '',
      primaryColor: '#7D1935',
      secondaryColor: '#F59E0B',
      accentColor: '#38BDF8',
      outlineColor: '#1E293B',
    },
  },
  // 22 Education & Study Cutout Illustrations
  {
    kind: 'edu-book',
    name: 'Hardcover Book',
    category: 'Education',
    keywords: ['book', 'textbook', 'education', 'study', 'read', 'school', 'library'],
    defaultWidth: 165,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'edu-book',
      label: 'STUDY',
      primaryColor: '#7D1935',
      secondaryColor: '#FDE68A',
      accentColor: '#FEF3C7',
      outlineColor: '#3B0816',
    },
  },
  {
    kind: 'edu-book-stack',
    name: 'Stacked Books',
    category: 'Education',
    keywords: ['books', 'stack', 'textbooks', 'education', 'library', 'study'],
    defaultWidth: 220,
    defaultHeight: 165,
    defaultProps: {
      stickerKind: 'edu-book-stack',
      label: '',
      primaryColor: '#2563EB',
      secondaryColor: '#7D1935',
      accentColor: '#059669',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'edu-open-book',
    name: 'Open Book',
    category: 'Education',
    keywords: ['book', 'open book', 'reading', 'pages', 'literature', 'education'],
    defaultWidth: 235,
    defaultHeight: 155,
    defaultProps: {
      stickerKind: 'edu-open-book',
      label: '',
      primaryColor: '#1D4ED8',
      secondaryColor: '#FFFBEB',
      accentColor: '#EF4444',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'edu-medal',
    name: 'Gold Medal',
    category: 'Education',
    keywords: ['medal', 'award', 'prize', 'first place', 'honor', 'education', 'achievement'],
    defaultWidth: 155,
    defaultHeight: 215,
    defaultProps: {
      stickerKind: 'edu-medal',
      label: '1ST',
      primaryColor: '#F59E0B',
      secondaryColor: '#FEF08A',
      accentColor: '#DC2626',
      outlineColor: '#78350F',
    },
  },
  {
    kind: 'edu-trophy-cup',
    name: 'Trophy Cup',
    category: 'Education',
    keywords: ['cup', 'trophy', 'award', 'champion', 'winner', 'medal', 'education'],
    defaultWidth: 175,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'edu-trophy-cup',
      label: 'TOP 1',
      primaryColor: '#F59E0B',
      secondaryColor: '#FEF08A',
      accentColor: '#78350F',
      outlineColor: '#451A03',
    },
  },
  {
    kind: 'edu-coffee-cup',
    name: 'Study Cup / Mug',
    category: 'Education',
    keywords: ['cup', 'mug', 'coffee', 'tea', 'study', 'desk', 'warm'],
    defaultWidth: 175,
    defaultHeight: 165,
    defaultProps: {
      stickerKind: 'edu-coffee-cup',
      label: 'A+',
      primaryColor: '#FFFFFF',
      secondaryColor: '#7D1935',
      accentColor: '#92400E',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'edu-quill-ink',
    name: 'Feather Pen & Inkwell',
    category: 'Education',
    keywords: ['feather pen', 'quill', 'ink', 'inkwell', 'writing', 'calligraphy', 'education'],
    defaultWidth: 195,
    defaultHeight: 215,
    defaultProps: {
      stickerKind: 'edu-quill-ink',
      label: '',
      primaryColor: '#F8FAFC',
      secondaryColor: '#38BDF8',
      accentColor: '#1E293B',
      outlineColor: '#0F172A',
    },
  },
  {
    kind: 'edu-feather-pen',
    name: 'Feather Quill Pen',
    category: 'Education',
    keywords: ['feather', 'quill', 'pen', 'no ink', 'writing', 'author', 'education'],
    defaultWidth: 185,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'edu-feather-pen',
      label: '',
      primaryColor: '#F59E0B',
      secondaryColor: '#FEF3C7',
      accentColor: '#7D1935',
      outlineColor: '#451A03',
    },
  },
  {
    kind: 'edu-headphones',
    name: 'Study Headphones',
    category: 'Education',
    keywords: ['headphone', 'headphones', 'audio', 'listening', 'study', 'music', 'podcast'],
    defaultWidth: 195,
    defaultHeight: 190,
    defaultProps: {
      stickerKind: 'edu-headphones',
      label: '',
      primaryColor: '#1E293B',
      secondaryColor: '#3B82F6',
      accentColor: '#E2E8F0',
      outlineColor: '#0F172A',
    },
  },
  {
    kind: 'edu-pen',
    name: 'Fountain Pen',
    category: 'Education',
    keywords: ['pen', 'fountain pen', 'write', 'stationery', 'office', 'education'],
    defaultWidth: 180,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'edu-pen',
      label: '',
      primaryColor: '#1E3A8A',
      secondaryColor: '#F59E0B',
      accentColor: '#E2E8F0',
      outlineColor: '#0F172A',
    },
  },
  {
    kind: 'edu-pencil',
    name: 'Classic #2 Pencil',
    category: 'Education',
    keywords: ['pencil', 'pen', 'draw', 'school', 'sketch', 'education'],
    defaultWidth: 180,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'edu-pencil',
      label: '',
      primaryColor: '#FACC15',
      secondaryColor: '#FB7185',
      accentColor: '#FDE68A',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'edu-ruler',
    name: 'School Ruler',
    category: 'Education',
    keywords: ['ruler', 'measure', 'geometry', 'math', 'stationery', 'education'],
    defaultWidth: 250,
    defaultHeight: 95,
    defaultProps: {
      stickerKind: 'edu-ruler',
      label: 'CM',
      primaryColor: '#FBBF24',
      secondaryColor: '#FEF3C7',
      accentColor: '#78350F',
      outlineColor: '#451A03',
    },
  },
  {
    kind: 'edu-calculator',
    name: 'Calculator',
    category: 'Education',
    keywords: ['calculator', 'math', 'numbers', 'finance', 'stem', 'education'],
    defaultWidth: 165,
    defaultHeight: 215,
    defaultProps: {
      stickerKind: 'edu-calculator',
      label: '123.45',
      primaryColor: '#334155',
      secondaryColor: '#BEF264',
      accentColor: '#F97316',
      outlineColor: '#0F172A',
    },
  },
  {
    kind: 'edu-grad-cap',
    name: 'Graduation Cap',
    category: 'Education',
    keywords: ['graduation', 'cap', 'mortarboard', 'diploma', 'university', 'education'],
    defaultWidth: 220,
    defaultHeight: 160,
    defaultProps: {
      stickerKind: 'edu-grad-cap',
      label: '',
      primaryColor: '#1E293B',
      secondaryColor: '#334155',
      accentColor: '#F59E0B',
      outlineColor: '#0F172A',
    },
  },
  {
    kind: 'edu-diploma',
    name: 'Diploma Scroll',
    category: 'Education',
    keywords: ['diploma', 'certificate', 'scroll', 'degree', 'graduation', 'education'],
    defaultWidth: 220,
    defaultHeight: 145,
    defaultProps: {
      stickerKind: 'edu-diploma',
      label: '',
      primaryColor: '#FEF3C7',
      secondaryColor: '#FDE68A',
      accentColor: '#DC2626',
      outlineColor: '#78350F',
    },
  },
  {
    kind: 'edu-globe',
    name: 'Desk Globe',
    category: 'Education',
    keywords: ['globe', 'world', 'geography', 'earth', 'map', 'education'],
    defaultWidth: 175,
    defaultHeight: 215,
    defaultProps: {
      stickerKind: 'edu-globe',
      label: '',
      primaryColor: '#38BDF8',
      secondaryColor: '#22C55E',
      accentColor: '#D97706',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'edu-microscope',
    name: 'Lab Microscope',
    category: 'Education',
    keywords: ['microscope', 'science', 'biology', 'lab', 'stem', 'education'],
    defaultWidth: 175,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'edu-microscope',
      label: '',
      primaryColor: '#E2E8F0',
      secondaryColor: '#3B82F6',
      accentColor: '#475569',
      outlineColor: '#0F172A',
    },
  },
  {
    kind: 'edu-backpack',
    name: 'Campus Backpack',
    category: 'Education',
    keywords: ['backpack', 'bag', 'school', 'student', 'campus', 'education'],
    defaultWidth: 180,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'edu-backpack',
      label: '',
      primaryColor: '#7D1935',
      secondaryColor: '#F59E0B',
      accentColor: '#FDE68A',
      outlineColor: '#3B0816',
    },
  },
  {
    kind: 'edu-chalkboard',
    name: 'Classroom Chalkboard',
    category: 'Education',
    keywords: ['chalkboard', 'blackboard', 'classroom', 'lesson', 'teacher', 'education'],
    defaultWidth: 250,
    defaultHeight: 175,
    defaultProps: {
      stickerKind: 'edu-chalkboard',
      label: 'A + B = C',
      primaryColor: '#14532D',
      secondaryColor: '#B45309',
      accentColor: '#FFFFFF',
      outlineColor: '#451A03',
    },
  },
  {
    kind: 'edu-lightbulb',
    name: 'Idea Lightbulb',
    category: 'Education',
    keywords: ['lightbulb', 'idea', 'smart', 'brainstorm', 'learn', 'education'],
    defaultWidth: 155,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'edu-lightbulb',
      label: '',
      primaryColor: '#FDE047',
      secondaryColor: '#FEF9C3',
      accentColor: '#94A3B8',
      outlineColor: '#854D0E',
    },
  },
  {
    kind: 'edu-protractor',
    name: 'Geometry Protractor',
    category: 'Education',
    keywords: ['protractor', 'ruler', 'triangle', 'geometry', 'math', 'drafting', 'education'],
    defaultWidth: 225,
    defaultHeight: 150,
    defaultProps: {
      stickerKind: 'edu-protractor',
      label: '180°',
      primaryColor: '#BAE6FD',
      secondaryColor: '#7DD3FC',
      accentColor: '#0284C7',
      outlineColor: '#0369A1',
    },
  },
  {
    kind: 'edu-notebook',
    name: 'Spiral Notebook',
    category: 'Education',
    keywords: ['notebook', 'journal', 'notes', 'book', 'school', 'education'],
    defaultWidth: 175,
    defaultHeight: 215,
    defaultProps: {
      stickerKind: 'edu-notebook',
      label: 'NOTES',
      primaryColor: '#2563EB',
      secondaryColor: '#FFFFFF',
      accentColor: '#F59E0B',
      outlineColor: '#1E293B',
    },
  },
  // 26 Stickman & Cartoon Character Pose Stickers (12 Stickmen + 14 Cartoons)
  {
    kind: 'char-stick-presenter',
    name: 'Stickman Presenter',
    category: 'Characters',
    keywords: ['stickman', 'stick figure', 'presenter', 'pitch', 'easel', 'chart', 'character', 'pose', 'sticker'],
    defaultWidth: 210,
    defaultHeight: 195,
    defaultProps: {
      stickerKind: 'char-stick-presenter',
      label: 'PITCH',
      primaryColor: '#2563EB',
      secondaryColor: '#F59E0B',
      accentColor: '#FEF3C7',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-stick-idea',
    name: 'Stickman Eureka Idea',
    category: 'Characters',
    keywords: ['stickman', 'idea', 'lightbulb', 'eureka', 'smart', 'character', 'pose', 'sticker'],
    defaultWidth: 165,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'char-stick-idea',
      label: '',
      primaryColor: '#FACC15',
      secondaryColor: '#FEF9C3',
      accentColor: '#F97316',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-stick-thinking',
    name: 'Stickman Thinking',
    category: 'Characters',
    keywords: ['stickman', 'thinking', 'question', 'ponder', 'wonder', 'character', 'pose', 'sticker'],
    defaultWidth: 185,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'char-stick-thinking',
      label: '?',
      primaryColor: '#3B82F6',
      secondaryColor: '#DBEAFE',
      accentColor: '#F59E0B',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-stick-cheering',
    name: 'Stickman Cheering',
    category: 'Characters',
    keywords: ['stickman', 'cheer', 'celebrate', 'happy', 'win', 'jump', 'character', 'pose', 'sticker'],
    defaultWidth: 175,
    defaultHeight: 195,
    defaultProps: {
      stickerKind: 'char-stick-cheering',
      label: '',
      primaryColor: '#EC4899',
      secondaryColor: '#FACC15',
      accentColor: '#38BDF8',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-stick-pointing',
    name: 'Stickman Pointing',
    category: 'Characters',
    keywords: ['stickman', 'pointing', 'arrow', 'focus', 'direction', 'character', 'pose', 'sticker'],
    defaultWidth: 195,
    defaultHeight: 190,
    defaultProps: {
      stickerKind: 'char-stick-pointing',
      label: '',
      primaryColor: '#7D1935',
      secondaryColor: '#FDE68A',
      accentColor: '#3B82F6',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-stick-laptop',
    name: 'Stickman Working',
    category: 'Characters',
    keywords: ['stickman', 'laptop', 'desk', 'work', 'study', 'coding', 'character', 'pose', 'sticker'],
    defaultWidth: 205,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'char-stick-laptop',
      label: '',
      primaryColor: '#2563EB',
      secondaryColor: '#CBD5E1',
      accentColor: '#F59E0B',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-stick-sign',
    name: 'Stickman Holding Sign',
    category: 'Characters',
    keywords: ['stickman', 'sign', 'placard', 'banner', 'message', 'character', 'pose', 'sticker'],
    defaultWidth: 195,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'char-stick-sign',
      label: 'KEY NOTE',
      primaryColor: '#7D1935',
      secondaryColor: '#FEF3C7',
      accentColor: '#F59E0B',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-stick-climb',
    name: 'Stickman Growth Climb',
    category: 'Characters',
    keywords: ['stickman', 'climb', 'stairs', 'growth', 'goal', 'chart', 'character', 'pose', 'sticker'],
    defaultWidth: 215,
    defaultHeight: 195,
    defaultProps: {
      stickerKind: 'char-stick-climb',
      label: '',
      primaryColor: '#10B981',
      secondaryColor: '#FACC15',
      accentColor: '#3B82F6',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-stick-confused',
    name: 'Stickman Shrugging',
    category: 'Characters',
    keywords: ['stickman', 'shrug', 'confused', 'faq', 'question', 'character', 'pose', 'sticker'],
    defaultWidth: 175,
    defaultHeight: 195,
    defaultProps: {
      stickerKind: 'char-stick-confused',
      label: '?!',
      primaryColor: '#F97316',
      secondaryColor: '#FEF3C7',
      accentColor: '#3B82F6',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-stick-running',
    name: 'Stickman Sprinting',
    category: 'Characters',
    keywords: ['stickman', 'running', 'fast', 'sprint', 'deadline', 'action', 'character', 'pose', 'sticker'],
    defaultWidth: 205,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'char-stick-running',
      label: '',
      primaryColor: '#EF4444',
      secondaryColor: '#F59E0B',
      accentColor: '#38BDF8',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-stick-megaphone',
    name: 'Stickman Megaphone',
    category: 'Characters',
    keywords: ['stickman', 'megaphone', 'announce', 'promo', 'shout', 'character', 'pose', 'sticker'],
    defaultWidth: 215,
    defaultHeight: 190,
    defaultProps: {
      stickerKind: 'char-stick-megaphone',
      label: 'NEWS!',
      primaryColor: '#7D1935',
      secondaryColor: '#FACC15',
      accentColor: '#38BDF8',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-stick-team',
    name: 'Stickmen High-Five',
    category: 'Characters',
    keywords: ['stickman', 'team', 'high five', 'collab', 'partnership', 'character', 'pose', 'sticker'],
    defaultWidth: 220,
    defaultHeight: 185,
    defaultProps: {
      stickerKind: 'char-stick-team',
      label: '',
      primaryColor: '#2563EB',
      secondaryColor: '#EC4899',
      accentColor: '#FACC15',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-wave',
    name: 'Cartoon Waving Hello',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'wave', 'hello', 'welcome', 'intro', 'pose', 'sticker'],
    defaultWidth: 185,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'char-toon-wave',
      label: 'HI!',
      primaryColor: '#2563EB',
      secondaryColor: '#FDBA74',
      accentColor: '#FACC15',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-thumbsup',
    name: 'Cartoon Thumbs Up',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'thumbs up', 'approve', 'good', 'like', 'pose', 'sticker'],
    defaultWidth: 185,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'char-toon-thumbsup',
      label: '',
      primaryColor: '#10B981',
      secondaryColor: '#FDBA74',
      accentColor: '#FACC15',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-presenter',
    name: 'Cartoon Pitch Presenter',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'presenter', 'teacher', 'slide', 'pitch', 'pose', 'sticker'],
    defaultWidth: 220,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'char-toon-presenter',
      label: 'DATA',
      primaryColor: '#7D1935',
      secondaryColor: '#FDBA74',
      accentColor: '#38BDF8',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-idea',
    name: 'Cartoon Idea Spark',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'idea', 'lightbulb', 'insight', 'eureka', 'pose', 'sticker'],
    defaultWidth: 185,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'char-toon-idea',
      label: '',
      primaryColor: '#8B5CF6',
      secondaryColor: '#FDBA74',
      accentColor: '#FDE047',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-think',
    name: 'Cartoon Pondering',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'thinking', 'question', 'faq', 'consider', 'pose', 'sticker'],
    defaultWidth: 195,
    defaultHeight: 205,
    defaultProps: {
      stickerKind: 'char-toon-think',
      label: '?',
      primaryColor: '#0EA5E9',
      secondaryColor: '#FDBA74',
      accentColor: '#F59E0B',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-laptop',
    name: 'Cartoon Laptop Work',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'laptop', 'remote', 'work', 'study', 'pose', 'sticker'],
    defaultWidth: 205,
    defaultHeight: 195,
    defaultProps: {
      stickerKind: 'char-toon-laptop',
      label: '',
      primaryColor: '#F97316',
      secondaryColor: '#FDBA74',
      accentColor: '#38BDF8',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-trophy',
    name: 'Cartoon Champion',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'trophy', 'winner', 'award', 'success', 'pose', 'sticker'],
    defaultWidth: 195,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'char-toon-trophy',
      label: '',
      primaryColor: '#EC4899',
      secondaryColor: '#FDBA74',
      accentColor: '#FACC15',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-rocket',
    name: 'Cartoon Launch Hero',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'rocket', 'launch', 'startup', 'growth', 'pose', 'sticker'],
    defaultWidth: 195,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'char-toon-rocket',
      label: '',
      primaryColor: '#2563EB',
      secondaryColor: '#FDBA74',
      accentColor: '#EF4444',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-megaphone',
    name: 'Cartoon Announcer',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'megaphone', 'announce', 'marketing', 'pubmat', 'pose', 'sticker'],
    defaultWidth: 215,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'char-toon-megaphone',
      label: 'NEW!',
      primaryColor: '#7D1935',
      secondaryColor: '#FDBA74',
      accentColor: '#FACC15',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-reading',
    name: 'Cartoon Book Reader',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'book', 'reading', 'study', 'education', 'pose', 'sticker'],
    defaultWidth: 195,
    defaultHeight: 195,
    defaultProps: {
      stickerKind: 'char-toon-reading',
      label: '',
      primaryColor: '#0D9488',
      secondaryColor: '#FDBA74',
      accentColor: '#F59E0B',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-graduate',
    name: 'Cartoon Graduate',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'graduate', 'cap', 'diploma', 'education', 'pose', 'sticker'],
    defaultWidth: 195,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'char-toon-graduate',
      label: '',
      primaryColor: '#1E3A8A',
      secondaryColor: '#FDBA74',
      accentColor: '#FACC15',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-teamwork',
    name: 'Cartoon Team Fist-Bump',
    category: 'Characters',
    keywords: ['cartoon', 'characters', 'team', 'teamwork', 'fist bump', 'collab', 'pose', 'sticker'],
    defaultWidth: 230,
    defaultHeight: 190,
    defaultProps: {
      stickerKind: 'char-toon-teamwork',
      label: '',
      primaryColor: '#2563EB',
      secondaryColor: '#FDBA74',
      accentColor: '#EC4899',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-meditate',
    name: 'Cartoon Calm Focus',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'meditate', 'focus', 'calm', 'balance', 'pose', 'sticker'],
    defaultWidth: 195,
    defaultHeight: 195,
    defaultProps: {
      stickerKind: 'char-toon-meditate',
      label: '',
      primaryColor: '#6366F1',
      secondaryColor: '#FDBA74',
      accentColor: '#34D399',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'char-toon-speech',
    name: 'Cartoon Speech Callout',
    category: 'Characters',
    keywords: ['cartoon', 'character', 'speech', 'quote', 'note', 'callout', 'pose', 'sticker'],
    defaultWidth: 215,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'char-toon-speech',
      label: 'NOTE!',
      primaryColor: '#E11D48',
      secondaryColor: '#FDBA74',
      accentColor: '#FEF08A',
      outlineColor: '#1E293B',
    },
  },
  ...EXTENDED_CUTOUT_CATALOG,
];

export function renderCutoutIllustrationSvg(
  kind: string,
  rawProps: Record<string, unknown>,
  rawUid: string
): { viewBox: string; svg: string } {
  const uid = rawUid.replace(/[^a-zA-Z0-9_-]/g, '') || 'cut';
  const c1 = String(rawProps.primaryColor || '#7D1935');
  const c2 = String(rawProps.secondaryColor || '#F48FB1');
  const acc = String(rawProps.accentColor || '#FFFFFF');
  const out = String(rawProps.outlineColor || '#1E293B');
  const label = escapeXml(String(rawProps.label || '').trim());

  switch (kind) {
    case 'balloon':
      return {
        viewBox: '0 0 180 260',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 260">
  <defs>
    <radialGradient id="${uid}-bal" cx="35%" cy="28%" r="68%">
      <stop offset="0%" stop-color="${acc}" stop-opacity="0.92"/>
      <stop offset="28%" stop-color="${c2}"/>
      <stop offset="76%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${out}"/>
    </radialGradient>
  </defs>
  <path d="M90 184 C96 202 74 218 88 234 C96 244 82 252 88 258" fill="none" stroke="${out}" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M81 178 L99 178 L93 188 L87 188 Z" fill="${c1}" stroke="${out}" stroke-width="2"/>
  <path d="M90 14 C136 14 162 50 162 94 C162 138 128 176 90 180 C52 176 18 138 18 94 C18 50 44 14 90 14 Z" fill="url(#${uid}-bal)" stroke="${out}" stroke-width="2.5"/>
  <ellipse cx="58" cy="58" rx="14" ry="26" fill="#FFFFFF" opacity="0.58" transform="rotate(-24 58 58)"/>
  <circle cx="46" cy="92" r="5" fill="#FFFFFF" opacity="0.52"/>
  ${label ? `<text x="90" y="106" text-anchor="middle" fill="${acc}" font-family="Outfit, sans-serif" font-weight="800" font-size="20" letter-spacing="1.2">${label.slice(0, 10)}</text>` : ''}
</svg>`,
      };

    case 'balloon-cluster':
      return {
        viewBox: '0 0 240 260',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 260">
  <defs>
    <radialGradient id="${uid}-bc1" cx="34%" cy="28%" r="70%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="35%" stop-color="${c2}"/><stop offset="100%" stop-color="#1E3A8A"/></radialGradient>
    <radialGradient id="${uid}-bc2" cx="34%" cy="28%" r="70%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="35%" stop-color="${acc}"/><stop offset="100%" stop-color="#92400E"/></radialGradient>
    <radialGradient id="${uid}-bc3" cx="34%" cy="28%" r="70%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="32%" stop-color="${c1}"/><stop offset="100%" stop-color="#3B0816"/></radialGradient>
  </defs>
  <path d="M72 154 C84 190 105 215 118 250 M166 154 C150 190 132 215 118 250 M118 144 C118 190 118 215 118 250" fill="none" stroke="${out}" stroke-width="2.2" stroke-linecap="round"/>
  <ellipse cx="68" cy="88" rx="46" ry="58" fill="url(#${uid}-bc1)" stroke="${out}" stroke-width="2.2" transform="rotate(-12 68 88)"/>
  <ellipse cx="50" cy="64" rx="8" ry="15" fill="#FFFFFF" opacity="0.55" transform="rotate(-22 50 64)"/>
  <ellipse cx="170" cy="92" rx="45" ry="56" fill="url(#${uid}-bc2)" stroke="${out}" stroke-width="2.2" transform="rotate(14 170 92)"/>
  <ellipse cx="154" cy="68" rx="8" ry="15" fill="#FFFFFF" opacity="0.55" transform="rotate(-12 154 68)"/>
  <ellipse cx="118" cy="74" rx="52" ry="64" fill="url(#${uid}-bc3)" stroke="${out}" stroke-width="2.5"/>
  <ellipse cx="96" cy="48" rx="10" ry="18" fill="#FFFFFF" opacity="0.6" transform="rotate(-24 96 48)"/>
  <circle cx="118" cy="248" r="5" fill="${acc}"/>
</svg>`,
      };

    case 'retro-camera':
      return {
        viewBox: '0 0 240 180',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180">
  <defs>
    <linearGradient id="${uid}-body" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="52%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="#64748B"/>
    </linearGradient>
    <radialGradient id="${uid}-lens" cx="42%" cy="38%" r="60%">
      <stop offset="0%" stop-color="${acc}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect x="44" y="20" width="42" height="14" rx="5" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
  <rect x="170" y="24" width="26" height="12" rx="4" fill="#EF4444" stroke="${out}" stroke-width="2"/>
  <rect x="18" y="34" width="204" height="126" rx="22" fill="url(#${uid}-body)" stroke="${out}" stroke-width="3"/>
  <path d="M18 56 C18 42 28 34 42 34 L76 34 L76 160 L42 160 C28 160 18 150 18 138 Z" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
  <rect x="150" y="48" width="54" height="24" rx="6" fill="#0F172A" stroke="#94A3B8" stroke-width="2"/>
  <rect x="156" y="53" width="42" height="14" rx="3" fill="#BAE6FD" opacity="0.88"/>
  <circle cx="128" cy="100" r="46" fill="#334155" stroke="#F8FAFC" stroke-width="4"/>
  <circle cx="128" cy="100" r="36" fill="#0F172A" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="128" cy="100" r="24" fill="url(#${uid}-lens)"/>
  <circle cx="118" cy="89" r="7" fill="#FFFFFF" opacity="0.72"/>
  <circle cx="137" cy="110" r="3.5" fill="#FFFFFF" opacity="0.45"/>
  <circle cx="192" cy="92" r="6" fill="#EF4444"/>
  ${label ? `<text x="47" y="102" text-anchor="middle" fill="#FFFFFF" font-family="monospace" font-weight="700" font-size="9" transform="rotate(-90 47 102)">${label.slice(0, 10)}</text>` : ''}
</svg>`,
      };

    case 'cd-disc':
      return {
        viewBox: '0 0 220 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
  <defs>
    <linearGradient id="${uid}-cd" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="28%" stop-color="${c1}"/>
      <stop offset="52%" stop-color="${c2}"/>
      <stop offset="76%" stop-color="${acc}"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
  </defs>
  <circle cx="110" cy="110" r="100" fill="url(#${uid}-cd)" stroke="${out}" stroke-width="2.5"/>
  <path d="M110 110 L36 40 A100 100 0 0 1 112 10 Z" fill="#FFFFFF" opacity="0.46"/>
  <path d="M110 110 L184 180 A100 100 0 0 1 108 210 Z" fill="#FFFFFF" opacity="0.38"/>
  <circle cx="110" cy="110" r="88" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.2"/>
  <circle cx="110" cy="110" r="42" fill="rgba(255,255,255,0.45)" stroke="${out}" stroke-width="1.5"/>
  <circle cx="110" cy="110" r="22" fill="#FFFFFF" stroke="${out}" stroke-width="2"/>
  ${label ? `<text x="110" y="64" text-anchor="middle" fill="${out}" font-family="Outfit, sans-serif" font-weight="800" font-size="11" letter-spacing="1">${label.slice(0, 12)}</text>` : ''}
</svg>`,
      };

    case 'cassette-tape':
      return {
        viewBox: '0 0 250 164',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 164">
  <rect x="10" y="10" width="230" height="144" rx="14" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <rect x="24" y="24" width="202" height="86" rx="8" fill="#FEF3C7" stroke="${out}" stroke-width="2"/>
  <rect x="24" y="24" width="202" height="24" rx="6" fill="${c2}"/>
  <text x="36" y="40" fill="#0F172A" font-family="monospace" font-weight="800" font-size="11">${(label || 'SIDE A · 90M').slice(0, 20)}</text>
  <rect x="52" y="58" width="146" height="42" rx="8" fill="#0F172A" stroke="${out}" stroke-width="2"/>
  <rect x="94" y="66" width="62" height="26" rx="3" fill="${acc}" opacity="0.28"/>
  <circle cx="76" cy="79" r="15" fill="#F8FAFC" stroke="#475569" stroke-width="2"/>
  <circle cx="76" cy="79" r="6" fill="#0F172A"/>
  <circle cx="174" cy="79" r="15" fill="#F8FAFC" stroke="#475569" stroke-width="2"/>
  <circle cx="174" cy="79" r="6" fill="#0F172A"/>
  <path d="M52 154 L66 122 L184 122 L198 154 Z" fill="#334155" stroke="${out}" stroke-width="2"/>
  <circle cx="78" cy="138" r="5" fill="#0F172A"/>
  <circle cx="172" cy="138" r="5" fill="#0F172A"/>
  <circle cx="24" cy="24" r="3" fill="#94A3B8"/>
  <circle cx="226" cy="24" r="3" fill="#94A3B8"/>
  <circle cx="24" cy="140" r="3" fill="#94A3B8"/>
  <circle cx="226" cy="140" r="3" fill="#94A3B8"/>
</svg>`,
      };

    case 'gold-chain':
      return {
        viewBox: '0 0 320 110',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 110">
  <defs>
    <linearGradient id="${uid}-ch" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="48%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${acc}"/>
    </linearGradient>
  </defs>
  ${[14, 62, 110, 158, 206, 254]
    .map(
      (lx, idx) => `<g transform="rotate(${idx % 2 === 0 ? -12 : 12} ${lx + 26} 55)">
    <rect x="${lx}" y="30" width="54" height="48" rx="22" fill="none" stroke="${out}" stroke-width="16"/>
    <rect x="${lx}" y="30" width="54" height="48" rx="22" fill="none" stroke="url(#${uid}-ch)" stroke-width="11"/>
    <path d="M${lx + 14} 34 H${lx + 40}" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.65"/>
  </g>`
    )
    .join('')}
</svg>`,
      };

    case 'brass-trumpet':
      return {
        viewBox: '0 0 280 150',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 150">
  <defs>
    <linearGradient id="${uid}-tr" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="45%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${acc}"/>
    </linearGradient>
  </defs>
  <rect x="108" y="42" width="12" height="58" rx="5" fill="url(#${uid}-tr)" stroke="${out}" stroke-width="2"/>
  <rect x="128" y="42" width="12" height="58" rx="5" fill="url(#${uid}-tr)" stroke="${out}" stroke-width="2"/>
  <rect x="148" y="42" width="12" height="58" rx="5" fill="url(#${uid}-tr)" stroke="${out}" stroke-width="2"/>
  <rect x="105" y="34" width="18" height="8" rx="3" fill="${c2}" stroke="${out}" stroke-width="1.8"/>
  <rect x="125" y="34" width="18" height="8" rx="3" fill="${c2}" stroke="${out}" stroke-width="1.8"/>
  <rect x="145" y="34" width="18" height="8" rx="3" fill="${c2}" stroke="${out}" stroke-width="1.8"/>
  <path d="M22 66 L192 66 C220 66 244 42 262 24 L262 126 C244 108 220 84 192 84 L22 84 Z" fill="url(#${uid}-tr)" stroke="${out}" stroke-width="2.5"/>
  <path d="M68 84 L68 104 C68 118 82 122 102 122 L176 122 C194 122 204 112 204 98 L204 84" fill="none" stroke="url(#${uid}-tr)" stroke-width="11" stroke-linecap="round"/>
  <path d="M68 84 L68 104 C68 118 82 122 102 122 L176 122 C194 122 204 112 204 98 L204 84" fill="none" stroke="${out}" stroke-width="2" stroke-linecap="round"/>
  <polygon points="10,60 24,66 24,84 10,90" fill="${c2}" stroke="${out}" stroke-width="2"/>
  <ellipse cx="262" cy="75" rx="9" ry="51" fill="${acc}" stroke="${out}" stroke-width="2.5"/>
</svg>`,
      };

    case 'golden-fish':
      return {
        viewBox: '0 0 280 190',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 190">
  <defs>
    <linearGradient id="${uid}-koi" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="48%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${out}"/>
    </linearGradient>
    <linearGradient id="${uid}-fin" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${acc}" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <!-- Flowing veil tail -->
  <path d="M84 96 C48 64 20 34 12 18 C32 48 36 74 20 96 C38 112 34 140 16 172 C46 154 66 130 88 110 Z" fill="url(#${uid}-fin)" stroke="${out}" stroke-width="2.2" stroke-linejoin="round"/>
  <!-- Dorsal crest fin -->
  <path d="M114 54 C132 18 168 14 190 42 C172 52 150 56 114 54 Z" fill="url(#${uid}-fin)" stroke="${out}" stroke-width="2"/>
  <!-- Ventral fin -->
  <path d="M126 126 C118 158 142 174 166 164 C156 148 152 136 144 126 Z" fill="url(#${uid}-fin)" stroke="${out}" stroke-width="2"/>
  <!-- Main sculpted koi body -->
  <path d="M82 98 C108 54 168 38 222 64 C248 76 266 94 264 106 C262 120 232 138 190 138 C144 138 106 122 82 98 Z" fill="url(#${uid}-koi)" stroke="${out}" stroke-width="2.6"/>
  <!-- Metallic scale arcs -->
  <path d="M132 76 Q142 90 132 104 M150 70 Q162 88 150 108 M168 68 Q182 88 168 110 M186 72 Q198 90 186 110" fill="none" stroke="${c2}" stroke-width="2.2" stroke-linecap="round" opacity="0.78"/>
  <!-- White koi patch -->
  <path d="M196 66 C214 66 226 76 224 90 C216 98 196 94 188 82 Z" fill="${acc}" opacity="0.86"/>
  <!-- Pectoral fin -->
  <path d="M188 114 C166 132 162 158 184 168 C196 152 204 134 202 116 Z" fill="url(#${uid}-fin)" stroke="${out}" stroke-width="2"/>
  <!-- Gill & eye -->
  <path d="M216 74 C210 92 212 110 220 122" fill="none" stroke="${out}" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="240" cy="92" r="8.5" fill="#FFFFFF" stroke="${out}" stroke-width="2"/>
  <circle cx="242" cy="92" r="4.5" fill="#0F172A"/>
  <circle cx="244" cy="90" r="1.8" fill="#FFFFFF"/>
  <ellipse cx="176" cy="58" rx="22" ry="6" fill="#FFFFFF" opacity="0.45" transform="rotate(-10 176 58)"/>
</svg>`,
      };

    case 'flower-hibiscus':
      return {
        viewBox: '0 0 200 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <radialGradient id="${uid}-hib" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="${out}"/>
      <stop offset="36%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </radialGradient>
  </defs>
  ${[0, 72, 144, 216, 288]
    .map(
      (deg) => `<path d="M100 100 C74 52 72 16 100 14 C128 16 126 52 100 100 Z" fill="url(#${uid}-hib)" stroke="${out}" stroke-width="2.2" transform="rotate(${deg} 100 100)"/>`
    )
    .join('')}
  <path d="M100 100 L122 64" stroke="${acc}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="122" cy="64" r="7" fill="${acc}" stroke="${out}" stroke-width="1.8"/>
  <circle cx="114" cy="70" r="4" fill="${acc}"/>
  <circle cx="127" cy="73" r="4" fill="${acc}"/>
</svg>`,
      };

    case 'flower-daisy':
      return {
        viewBox: '0 0 200 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  ${[0, 45, 90, 135, 180, 225, 270, 315]
    .map(
      (deg) => `<ellipse cx="100" cy="44" rx="22" ry="42" fill="${c1}" stroke="${out}" stroke-width="2.5" transform="rotate(${deg} 100 100)"/>`
    )
    .join('')}
  <circle cx="100" cy="100" r="28" fill="${acc}" stroke="${out}" stroke-width="2.8"/>
  <ellipse cx="92" cy="91" rx="8" ry="5" fill="#FFFFFF" opacity="0.65" transform="rotate(-25 92 91)"/>
</svg>`,
      };

    case 'flower-rose':
      return {
        viewBox: '0 0 200 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">
  <path d="M100 112 L100 206" stroke="${acc}" stroke-width="7" stroke-linecap="round"/>
  <path d="M100 156 C68 148 52 162 56 178 C78 182 94 172 100 156 Z" fill="${acc}" stroke="${out}" stroke-width="2"/>
  <path d="M100 144 C132 136 148 150 144 166 C122 170 106 160 100 144 Z" fill="${acc}" stroke="${out}" stroke-width="2"/>
  <circle cx="100" cy="76" r="54" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
  <path d="M56 76 C56 44 144 44 144 76 C144 106 124 124 100 124 C74 124 56 104 56 76 Z" fill="${c2}" opacity="0.45"/>
  <path d="M74 72 C74 54 126 54 126 76 C126 96 106 106 90 100 C74 94 74 72 74 72 Z" fill="${c1}" stroke="${out}" stroke-width="2.2"/>
  <path d="M88 74 C88 64 114 64 114 76 C114 86 102 92 94 86" fill="none" stroke="${out}" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,
      };

    case 'fluffy-cloud':
      return {
        viewBox: '0 0 260 160',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 160">
  <defs>
    <linearGradient id="${uid}-cld" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="72%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${acc}"/>
    </linearGradient>
  </defs>
  <path d="M54 134 C30 134 14 116 14 96 C14 76 30 60 52 60 C58 34 82 18 110 18 C136 18 158 34 166 56 C172 52 182 50 192 50 C222 50 246 72 246 98 C246 120 226 134 202 134 Z" fill="url(#${uid}-cld)" stroke="${out}" stroke-width="3"/>
  <ellipse cx="96" cy="48" rx="22" ry="10" fill="#FFFFFF" opacity="0.72" transform="rotate(-14 96 48)"/>
</svg>`,
      };

    case 'botanical-tree':
      return {
        viewBox: '0 0 200 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240">
  <path d="M90 222 L92 128 L72 104 L80 96 L96 116 L96 92 L106 92 L106 118 L124 98 L132 106 L110 130 L114 222 Z" fill="${acc}" stroke="${out}" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="100" cy="64" r="46" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
  <circle cx="64" cy="96" r="36" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
  <circle cx="136" cy="96" r="36" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
  <circle cx="88" cy="54" r="24" fill="${c2}" opacity="0.52"/>
  <circle cx="128" cy="84" r="18" fill="${c2}" opacity="0.45"/>
</svg>`,
      };

    case 'bubble-cluster':
      return {
        viewBox: '0 0 220 210',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 210">
  <defs>
    <radialGradient id="${uid}-b1" cx="32%" cy="28%" r="72%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.92"/>
      <stop offset="56%" stop-color="${c1}" stop-opacity="0.28"/>
      <stop offset="88%" stop-color="${c2}" stop-opacity="0.58"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95"/>
    </radialGradient>
  </defs>
  <circle cx="86" cy="96" r="68" fill="url(#${uid}-b1)" stroke="${out}" stroke-width="2.2"/>
  <ellipse cx="60" cy="62" rx="18" ry="9" fill="#FFFFFF" opacity="0.8" transform="rotate(-32 60 62)"/>
  <circle cx="164" cy="68" r="38" fill="url(#${uid}-b1)" stroke="${out}" stroke-width="2"/>
  <ellipse cx="148" cy="50" rx="10" ry="5" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 148 50)"/>
  <circle cx="152" cy="156" r="30" fill="url(#${uid}-b1)" stroke="${out}" stroke-width="2"/>
  <circle cx="140" cy="144" r="5" fill="#FFFFFF" opacity="0.8"/>
</svg>`,
      };

    case 'butterfly-aero':
      return {
        viewBox: '0 0 220 190',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 190">
  <defs>
    <linearGradient id="${uid}-wing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="65%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${out}"/>
    </linearGradient>
  </defs>
  <path d="M108 92 C78 24 14 14 14 58 C14 88 52 104 108 98 Z" fill="url(#${uid}-wing)" stroke="${out}" stroke-width="2.5"/>
  <path d="M112 92 C142 24 206 14 206 58 C206 88 168 104 112 98 Z" fill="url(#${uid}-wing)" stroke="${out}" stroke-width="2.5"/>
  <path d="M108 102 C62 108 32 134 44 162 C56 184 94 156 108 112 Z" fill="url(#${uid}-wing)" stroke="${out}" stroke-width="2.5"/>
  <path d="M112 102 C158 108 188 134 176 162 C164 184 126 156 112 112 Z" fill="url(#${uid}-wing)" stroke="${out}" stroke-width="2.5"/>
  <circle cx="52" cy="56" r="10" fill="${acc}" opacity="0.72"/>
  <circle cx="168" cy="56" r="10" fill="${acc}" opacity="0.72"/>
  <rect x="104" y="64" width="12" height="72" rx="6" fill="${out}"/>
  <path d="M106 66 Q90 42 78 38 M114 66 Q130 42 142 38" fill="none" stroke="${out}" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,
      };

    case 'like-zone-badge':
      return {
        viewBox: '0 0 280 112',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 112">
  <defs>
    <linearGradient id="${uid}-lz" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="52%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${out}"/>
    </linearGradient>
  </defs>
  <rect x="10" y="14" width="260" height="84" rx="42" fill="url(#${uid}-lz)" stroke="${acc}" stroke-width="4"/>
  <rect x="18" y="22" width="244" height="68" rx="34" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.8" stroke-dasharray="6 4"/>
  <path d="M56 76 C56 76 34 61 34 45 C34 36 41 30 49 30 C54 30 56 34 56 36 C56 34 58 30 63 30 C71 30 78 36 78 45 C78 61 56 76 56 76 Z" fill="${acc}"/>
  <text x="160" y="64" text-anchor="middle" fill="${acc}" font-family="Outfit, sans-serif" font-weight="900" font-size="26" letter-spacing="1.5">${(label || 'LIKE ZONE').slice(0, 14)}</text>
</svg>`,
      };

    case 'glossy-heart':
      return {
        viewBox: '0 0 180 170',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 170">
  <defs>
    <radialGradient id="${uid}-gh" cx="34%" cy="28%" r="72%">
      <stop offset="0%" stop-color="${acc}"/>
      <stop offset="28%" stop-color="${c2}"/>
      <stop offset="76%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${out}"/>
    </radialGradient>
  </defs>
  <path d="M90 152 C90 152 16 106 16 54 C16 28 36 14 58 14 C74 14 84 24 90 34 C96 24 106 14 122 14 C144 14 164 28 164 54 C164 106 90 152 90 152 Z" fill="url(#${uid}-gh)" stroke="${out}" stroke-width="2.5"/>
  <ellipse cx="52" cy="44" rx="14" ry="8" fill="#FFFFFF" opacity="0.72" transform="rotate(-30 52 44)"/>
</svg>`,
      };

    case 'ribbon-bow':
      return {
        viewBox: '0 0 240 180',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180">
  <defs>
    <linearGradient id="${uid}-bow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="55%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${acc}"/>
    </linearGradient>
  </defs>
  <path d="M108 82 L54 164 L84 156 L96 170 L118 90 Z" fill="url(#${uid}-bow)" stroke="${out}" stroke-width="2.5"/>
  <path d="M132 82 L186 164 L156 156 L144 170 L122 90 Z" fill="url(#${uid}-bow)" stroke="${out}" stroke-width="2.5"/>
  <path d="M114 78 C72 24 18 30 22 72 C24 106 72 104 114 86 Z" fill="url(#${uid}-bow)" stroke="${out}" stroke-width="2.5"/>
  <path d="M126 78 C168 24 222 30 218 72 C216 106 168 104 126 86 Z" fill="url(#${uid}-bow)" stroke="${out}" stroke-width="2.5"/>
  <rect x="102" y="64" width="36" height="34" rx="12" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
  <ellipse cx="114" cy="74" rx="8" ry="4" fill="#FFFFFF" opacity="0.5"/>
</svg>`,
      };

    case 'scroll-banner':
      return {
        viewBox: '0 0 320 110',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 110">
  <path d="M14 28 L66 28 L66 86 L14 86 L34 57 Z" fill="${c2}" stroke="${out}" stroke-width="2.2"/>
  <path d="M306 28 L254 28 L254 86 L306 86 L286 57 Z" fill="${c2}" stroke="${out}" stroke-width="2.2"/>
  <polygon points="52,72 66,86 66,72" fill="${out}"/>
  <polygon points="268,72 254,86 254,72" fill="${out}"/>
  <rect x="52" y="16" width="216" height="58" rx="8" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
  <text x="160" y="53" text-anchor="middle" fill="${acc}" font-family="Outfit, sans-serif" font-weight="800" font-size="22" letter-spacing="1.8">${(label || 'FEATURED').slice(0, 18)}</text>
</svg>`,
      };

    case 'prize-ribbon':
      return {
        viewBox: '0 0 180 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 240">
  <polygon points="54,126 36,226 66,204 86,226 92,130" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
  <polygon points="126,126 144,226 114,204 94,226 88,130" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
  <circle cx="90" cy="84" r="64" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <circle cx="90" cy="84" r="46" fill="${c2}" stroke="${acc}" stroke-width="3"/>
  <text x="90" y="92" text-anchor="middle" fill="${acc}" font-family="Outfit, sans-serif" font-weight="900" font-size="24">${(label || 'NO.1').slice(0, 6)}</text>
</svg>`,
      };

    case 'ticket-stub':
      return {
        viewBox: '0 0 300 130',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 130">
  <path d="M22 14 H278 V44 A18 18 0 0 0 278 86 V116 H22 V86 A18 18 0 0 0 22 44 Z" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <line x1="214" y1="22" x2="214" y2="108" stroke="${c2}" stroke-width="2.5" stroke-dasharray="6 5"/>
  <rect x="34" y="26" width="166" height="78" rx="6" fill="none" stroke="${c2}" stroke-width="2"/>
  <text x="117" y="72" text-anchor="middle" fill="${c2}" font-family="Outfit, sans-serif" font-weight="800" font-size="16" letter-spacing="1">${(label || 'VIP ACCESS').slice(0, 18)}</text>
  <polygon points="248,46 254,58 267,60 257,69 260,82 248,76 236,82 239,69 229,60 242,58" fill="${acc}" stroke="${out}" stroke-width="1.5"/>
</svg>`,
      };

    case 'chrome-crown':
      return {
        viewBox: '0 0 220 160',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 160">
  <defs>
    <linearGradient id="${uid}-cr" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="55%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${out}"/>
    </linearGradient>
  </defs>
  <path d="M26 124 L18 52 L68 86 L110 30 L152 86 L202 52 L194 124 Z" fill="url(#${uid}-cr)" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <rect x="26" y="124" width="168" height="20" rx="6" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <circle cx="18" cy="46" r="8" fill="${acc}" stroke="${out}" stroke-width="2"/>
  <circle cx="110" cy="24" r="10" fill="${acc}" stroke="${out}" stroke-width="2"/>
  <circle cx="202" cy="46" r="8" fill="${acc}" stroke="${out}" stroke-width="2"/>
</svg>`,
      };

    case 'lightning-bolt':
      return {
        viewBox: '0 0 160 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220">
  <defs>
    <linearGradient id="${uid}-lt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="50%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${acc}"/>
    </linearGradient>
  </defs>
  <polygon points="94,12 24,116 74,116 58,208 136,96 86,96" fill="url(#${uid}-lt)" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
</svg>`,
      };

    case 'sparkle-cluster':
      return {
        viewBox: '0 0 180 180',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <path d="M74 14 L88 60 L134 74 L88 88 L74 134 L60 88 L14 74 L60 60 Z" fill="${c1}" stroke="${out}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M138 20 L144 40 L164 46 L144 52 L138 72 L132 52 L112 46 L132 40 Z" fill="${c2}" stroke="${out}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M128 112 L134 132 L154 138 L134 144 L128 164 L122 144 L102 138 L122 132 Z" fill="${acc}" stroke="${out}" stroke-width="2" stroke-linejoin="round"/>
</svg>`,
      };

    case 'rainbow-arc':
      return {
        viewBox: '0 0 280 170',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 170">
  <path d="M36 132 A104 104 0 0 1 244 132" fill="none" stroke="${c1}" stroke-width="18" stroke-linecap="round"/>
  <path d="M54 132 A86 86 0 0 1 226 132" fill="none" stroke="${c2}" stroke-width="18" stroke-linecap="round"/>
  <path d="M72 132 A68 68 0 0 1 208 132" fill="none" stroke="${acc}" stroke-width="18" stroke-linecap="round"/>
  <path d="M22 146 C12 146 6 136 12 126 C14 114 26 108 38 112 C44 102 58 102 66 112 C78 112 86 122 84 134 C82 142 74 146 64 146 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2.5"/>
  <path d="M198 146 C188 146 182 136 188 126 C190 114 202 108 214 112 C220 102 234 102 242 112 C254 112 262 122 260 134 C258 142 250 146 240 146 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2.5"/>
</svg>`,
      };

    case 'confetti-pop':
      return {
        viewBox: '0 0 200 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <polygon points="26,174 52,88 112,148" fill="${c1}" stroke="${out}" stroke-width="2.5" stroke-linejoin="round"/>
  <line x1="42" y1="122" x2="78" y2="158" stroke="${c2}" stroke-width="6"/>
  <path d="M84 84 C96 54 118 46 138 26" fill="none" stroke="${c2}" stroke-width="4" stroke-linecap="round"/>
  <path d="M110 106 C136 96 154 78 178 72" fill="none" stroke="${acc}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="96" cy="40" r="8" fill="${acc}"/>
  <circle cx="158" cy="44" r="7" fill="${c1}"/>
      <rect x="148" y="108" width="14" height="14" rx="3" fill="${c2}" transform="rotate(24 155 115)"/>
  <polygon points="122,56 128,70 142,72 132,82 134,96 122,90 110,96 112,82 102,72 116,70" fill="${c2}" stroke="${out}" stroke-width="1.5"/>
</svg>`,
      };

    // Education & Study Renderers
    case 'edu-book':
      return {
        viewBox: '0 0 180 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 220">
  <rect x="26" y="18" width="128" height="176" rx="10" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <path d="M26 30 H48 V194 H26 A10 10 0 0 1 18 184 V40 A10 10 0 0 1 26 30 Z" fill="${out}" opacity="0.24"/>
  <rect x="26" y="166" width="128" height="28" rx="6" fill="${acc}" stroke="${out}" stroke-width="2.5"/>
  <line x1="48" y1="18" x2="48" y2="166" stroke="${out}" stroke-width="2.5"/>
  <line x1="48" y1="180" x2="148" y2="180" stroke="${out}" stroke-width="1.2" opacity="0.45"/>
  <polygon points="116,188 116,214 128,204 140,214 140,188" fill="#EF4444" stroke="${out}" stroke-width="2"/>
  <rect x="64" y="46" width="72" height="44" rx="6" fill="${c2}" stroke="${out}" stroke-width="2"/>
  <text x="100" y="73" text-anchor="middle" fill="${out}" font-family="Outfit, sans-serif" font-weight="800" font-size="14" letter-spacing="1">${(label || 'STUDY').slice(0, 8)}</text>
  <line x1="68" y1="112" x2="132" y2="112" stroke="${c2}" stroke-width="3" stroke-linecap="round"/>
  <line x1="78" y1="126" x2="122" y2="126" stroke="${c2}" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
</svg>`,
      };

    case 'edu-book-stack':
      return {
        viewBox: '0 0 240 180',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180">
  <!-- Bottom book -->
  <rect x="20" y="122" width="200" height="40" rx="7" fill="${acc}" stroke="${out}" stroke-width="2.6"/>
  <rect x="34" y="128" width="176" height="28" rx="4" fill="#FEF3C7"/>
  <rect x="20" y="122" width="24" height="40" rx="5" fill="${acc}" stroke="${out}" stroke-width="2.6"/>
  <line x1="56" y1="138" x2="196" y2="138" stroke="#CBD5E1" stroke-width="2"/>
  <line x1="56" y1="148" x2="196" y2="148" stroke="#CBD5E1" stroke-width="2"/>
  <!-- Middle book -->
  <rect x="32" y="76" width="184" height="40" rx="7" fill="${c2}" stroke="${out}" stroke-width="2.6"/>
  <rect x="46" y="82" width="160" height="28" rx="4" fill="#FFFBEB"/>
  <rect x="32" y="76" width="24" height="40" rx="5" fill="${c2}" stroke="${out}" stroke-width="2.6"/>
  <line x1="68" y1="92" x2="192" y2="92" stroke="#CBD5E1" stroke-width="2"/>
  <line x1="68" y1="102" x2="192" y2="102" stroke="#CBD5E1" stroke-width="2"/>
  <!-- Top book -->
  <g transform="rotate(-4 120 50)">
    <rect x="26" y="30" width="180" height="40" rx="7" fill="${c1}" stroke="${out}" stroke-width="2.6"/>
    <rect x="40" y="36" width="156" height="28" rx="4" fill="#FFFFFF"/>
    <rect x="26" y="30" width="24" height="40" rx="5" fill="${c1}" stroke="${out}" stroke-width="2.6"/>
    <polygon points="154,64 154,88 164,80 174,88 174,64" fill="#F59E0B" stroke="${out}" stroke-width="1.8"/>
  </g>
</svg>`,
      };

    case 'edu-open-book':
      return {
        viewBox: '0 0 260 170',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 170">
  <rect x="14" y="28" width="232" height="122" rx="10" fill="${c1}" stroke="${out}" stroke-width="2.8"/>
  <path d="M24 22 C60 16 106 20 130 34 C154 20 200 16 236 22 V136 C200 130 154 134 130 148 C106 134 60 130 24 136 Z" fill="${c2}" stroke="${out}" stroke-width="2.4" stroke-linejoin="round"/>
  <line x1="130" y1="34" x2="130" y2="148" stroke="${out}" stroke-width="2.4"/>
  <path d="M40 48 H110 M40 64 H110 M40 80 H102 M40 96 H110 M40 112 H94" stroke="#94A3B8" stroke-width="2.8" stroke-linecap="round"/>
  <path d="M150 48 H220 M150 64 H220 M150 80 H212 M150 96 H220 M150 112 H198" stroke="#94A3B8" stroke-width="2.8" stroke-linecap="round"/>
  <polygon points="168,20 168,72 178,62 188,72 188,20" fill="${acc}" stroke="${out}" stroke-width="1.8"/>
</svg>`,
      };

    case 'edu-medal':
      return {
        viewBox: '0 0 180 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 240">
  <defs>
    <radialGradient id="${uid}-med" cx="38%" cy="32%" r="68%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="55%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${out}"/>
    </radialGradient>
  </defs>
  <polygon points="36,12 72,12 102,94 68,94" fill="${acc}" stroke="${out}" stroke-width="2.4" stroke-linejoin="round"/>
  <polygon points="144,12 108,12 78,94 112,94" fill="#1D4ED8" stroke="${out}" stroke-width="2.4" stroke-linejoin="round"/>
  <rect x="74" y="88" width="32" height="14" rx="5" fill="${c2}" stroke="${out}" stroke-width="2"/>
  <circle cx="90" cy="158" r="64" fill="url(#${uid}-med)" stroke="${out}" stroke-width="3"/>
  <circle cx="90" cy="158" r="50" fill="none" stroke="${c2}" stroke-width="3" stroke-dasharray="6 4"/>
  <polygon points="90,118 100,140 124,143 106,159 111,182 90,170 69,182 74,159 56,143 80,140" fill="${c2}" stroke="${out}" stroke-width="2" stroke-linejoin="round"/>
  ${label ? `<rect x="64" y="148" width="52" height="22" rx="11" fill="${out}"/><text x="90" y="164" text-anchor="middle" fill="${c2}" font-family="Outfit, sans-serif" font-weight="900" font-size="13">${label.slice(0, 5)}</text>` : ''}
</svg>`,
      };

    case 'edu-trophy-cup':
      return {
        viewBox: '0 0 200 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 230">
  <defs>
    <linearGradient id="${uid}-cup" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="40%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${acc}"/>
    </linearGradient>
  </defs>
  <path d="M46 42 H22 C12 42 12 94 42 102 L58 106" fill="none" stroke="${c1}" stroke-width="10" stroke-linecap="round"/>
  <path d="M154 42 H178 C188 42 188 94 158 102 L142 106" fill="none" stroke="${c1}" stroke-width="10" stroke-linecap="round"/>
  <path d="M46 42 H22 C12 42 12 94 42 102 L58 106 M154 42 H178 C188 42 188 94 158 102 L142 106" fill="none" stroke="${out}" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M46 26 H154 L144 98 C140 130 120 144 100 144 C80 144 60 130 56 98 Z" fill="url(#${uid}-cup)" stroke="${out}" stroke-width="2.8"/>
  <rect x="88" y="142" width="24" height="34" fill="url(#${uid}-cup)" stroke="${out}" stroke-width="2.5"/>
  <rect x="52" y="176" width="96" height="34" rx="6" fill="${acc}" stroke="${out}" stroke-width="2.8"/>
  <rect x="66" y="186" width="68" height="16" rx="3" fill="${c2}" stroke="${out}" stroke-width="1.5"/>
  <text x="100" y="198" text-anchor="middle" fill="${out}" font-family="Outfit, sans-serif" font-weight="900" font-size="10">${(label || 'TOP 1').slice(0, 8)}</text>
</svg>`,
      };

    case 'edu-coffee-cup':
      return {
        viewBox: '0 0 200 190',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 190">
  <path d="M68 42 C60 28 74 20 68 8 M94 38 C86 24 100 16 94 4 M120 42 C112 28 126 20 120 8" fill="none" stroke="#94A3B8" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse cx="94" cy="158" rx="74" ry="18" fill="#E2E8F0" stroke="${out}" stroke-width="2.5"/>
  <path d="M144 74 H164 C180 74 182 114 162 120 L140 124" fill="none" stroke="${c1}" stroke-width="14" stroke-linecap="round"/>
  <path d="M144 74 H164 C180 74 182 114 162 120 L140 124" fill="none" stroke="${out}" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M38 62 H150 L142 134 C140 150 124 158 94 158 C64 158 48 150 46 134 Z" fill="${c1}" stroke="${out}" stroke-width="2.8"/>
  <ellipse cx="94" cy="62" rx="56" ry="14" fill="#E2E8F0" stroke="${out}" stroke-width="2.5"/>
  <ellipse cx="94" cy="64" rx="46" ry="9" fill="${acc}"/>
  <circle cx="94" cy="110" r="22" fill="${c2}"/>
  ${label ? `<text x="94" y="117" text-anchor="middle" fill="#FFFFFF" font-family="Outfit, sans-serif" font-weight="900" font-size="18">${label.slice(0, 5)}</text>` : ''}
</svg>`,
      };

    case 'edu-quill-ink':
      return {
        viewBox: '0 0 210 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 230">
  <!-- Glass Inkwell -->
  <polygon points="44,148 112,148 126,174 118,214 38,214 30,174" fill="${c2}" fill-opacity="0.45" stroke="${out}" stroke-width="2.6" stroke-linejoin="round"/>
  <polygon points="36,178 120,178 114,208 42,208" fill="${acc}" opacity="0.88"/>
  <rect x="54" y="130" width="48" height="18" rx="4" fill="#94A3B8" stroke="${out}" stroke-width="2.4"/>
  <!-- Feather Quill -->
  <path d="M78 142 C96 102 122 62 184 14 C180 56 154 96 108 118 L86 144 Z" fill="${c1}" stroke="${out}" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M150 42 L134 56 M136 62 L116 74 M120 82 L102 92" stroke="${out}" stroke-width="2" stroke-linecap="round"/>
  <path d="M76 146 C104 108 140 64 184 14" fill="none" stroke="${c2}" stroke-width="3.2" stroke-linecap="round"/>
  <polygon points="74,144 84,148 72,162" fill="${c2}" stroke="${out}" stroke-width="1.8"/>
</svg>`,
      };

    case 'edu-feather-pen':
      return {
        viewBox: '0 0 200 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">
  <defs>
    <linearGradient id="${uid}-fp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="55%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${acc}"/>
    </linearGradient>
  </defs>
  <path d="M46 168 C58 114 94 56 172 16 C168 68 134 118 82 146 L56 172 Z" fill="url(#${uid}-fp)" stroke="${out}" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M138 42 L116 58 M120 66 L96 80 M102 90 L80 102 M86 114 L68 124" stroke="${out}" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
  <path d="M42 174 C76 128 120 74 172 16" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
  <polygon points="40,170 54,178 28,202" fill="#E2E8F0" stroke="${out}" stroke-width="2.2" stroke-linejoin="round"/>
  <line x1="28" y1="202" x2="43" y2="184" stroke="${out}" stroke-width="2"/>
</svg>`,
      };

    case 'edu-headphones':
      return {
        viewBox: '0 0 210 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 200">
  <path d="M36 112 V94 A69 69 0 0 1 174 94 V112" fill="none" stroke="${c1}" stroke-width="16" stroke-linecap="round"/>
  <path d="M54 40 A66 66 0 0 1 156 40" fill="none" stroke="${c2}" stroke-width="10" stroke-linecap="round"/>
  <rect x="20" y="102" width="34" height="68" rx="14" fill="${c2}" stroke="${out}" stroke-width="2.8"/>
  <rect x="44" y="108" width="16" height="56" rx="8" fill="${acc}" stroke="${out}" stroke-width="2.2"/>
  <rect x="156" y="102" width="34" height="68" rx="14" fill="${c2}" stroke="${out}" stroke-width="2.8"/>
  <rect x="150" y="108" width="16" height="56" rx="8" fill="${acc}" stroke="${out}" stroke-width="2.2"/>
  <circle cx="34" cy="136" r="8" fill="${acc}" opacity="0.7"/>
  <circle cx="176" cy="136" r="8" fill="${acc}" opacity="0.7"/>
</svg>`,
      };

    case 'edu-pen':
      return {
        viewBox: '0 0 200 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <g transform="rotate(-45 100 100)">
    <rect x="34" y="84" width="112" height="32" rx="12" fill="${c1}" stroke="${out}" stroke-width="2.6"/>
    <rect x="116" y="82" width="12" height="36" rx="3" fill="${c2}" stroke="${out}" stroke-width="2"/>
    <path d="M128 88 H162 L170 94" fill="none" stroke="${c2}" stroke-width="4" stroke-linecap="round"/>
    <polygon points="34,86 34,114 8,100" fill="${acc}" stroke="${out}" stroke-width="2.4" stroke-linejoin="round"/>
    <line x1="8" y1="100" x2="22" y2="100" stroke="${out}" stroke-width="2"/>
    <circle cx="24" cy="100" r="2.5" fill="${out}"/>
    <rect x="46" y="88" width="60" height="6" rx="3" fill="#FFFFFF" opacity="0.3"/>
  </g>
</svg>`,
      };

    case 'edu-pencil':
      return {
        viewBox: '0 0 200 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <g transform="rotate(-45 100 100)">
    <rect x="148" y="84" width="24" height="32" rx="8" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
    <rect x="132" y="84" width="18" height="32" fill="#CBD5E1" stroke="${out}" stroke-width="2.4"/>
    <rect x="44" y="84" width="88" height="32" fill="${c1}" stroke="${out}" stroke-width="2.5"/>
    <line x1="44" y1="95" x2="132" y2="95" stroke="${out}" stroke-width="1.4" opacity="0.45"/>
    <line x1="44" y1="105" x2="132" y2="105" stroke="${out}" stroke-width="1.4" opacity="0.45"/>
    <polygon points="44,84 44,116 14,100" fill="${acc}" stroke="${out}" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="24,95 24,105 14,100" fill="${out}"/>
  </g>
</svg>`,
      };

    case 'edu-ruler':
      return {
        viewBox: '0 0 280 110',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 110">
  <rect x="12" y="22" width="256" height="66" rx="8" fill="${c1}" stroke="${out}" stroke-width="2.8"/>
  <rect x="20" y="30" width="240" height="50" rx="4" fill="${c2}" opacity="0.35"/>
  ${Array.from({ length: 21 }, (_, idx) => {
    const tx = 26 + idx * 11.4;
    const th = idx % 5 === 0 ? 22 : idx % 2 === 0 ? 15 : 10;
    return `<line x1="${tx.toFixed(1)}" y1="22" x2="${tx.toFixed(1)}" y2="${22 + th}" stroke="${acc}" stroke-width="${idx % 5 === 0 ? 2.4 : 1.5}" stroke-linecap="round"/>`;
  }).join('')}
  <circle cx="246" cy="64" r="6" fill="#FFFFFF" stroke="${out}" stroke-width="2"/>
  <text x="42" y="72" fill="${acc}" font-family="monospace" font-weight="800" font-size="14">${(label || 'CM').slice(0, 6)}</text>
</svg>`,
      };

    case 'edu-calculator':
      return {
        viewBox: '0 0 180 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 230">
  <rect x="20" y="14" width="140" height="202" rx="16" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <rect x="34" y="28" width="112" height="44" rx="6" fill="${c2}" stroke="${out}" stroke-width="2.2"/>
  <text x="136" y="58" text-anchor="end" fill="${out}" font-family="monospace" font-weight="800" font-size="20">${(label || '123.45').slice(0, 8)}</text>
  ${[0, 1, 2, 3].map((row) =>
    [0, 1, 2, 3].map((col) => {
      const bx = 34 + col * 29;
      const by = 88 + row * 29;
      const isAcc = col === 3 || (row === 3 && col === 2);
      return `<rect x="${bx}" y="${by}" width="23" height="22" rx="5" fill="${isAcc ? acc : '#F8FAFC'}" stroke="${out}" stroke-width="1.6"/>`;
    }).join('')
  ).join('')}
</svg>`,
      };

    case 'edu-grad-cap':
      return {
        viewBox: '0 0 240 170',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 170">
  <path d="M62 84 V126 C62 142 178 142 178 126 V84 Z" fill="${c2}" stroke="${out}" stroke-width="2.8"/>
  <polygon points="120,18 228,64 120,110 12,64" fill="${c1}" stroke="${out}" stroke-width="2.8" stroke-linejoin="round"/>
  <path d="M120 64 L196 86 V128" fill="none" stroke="${acc}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="120" cy="64" r="6" fill="${acc}" stroke="${out}" stroke-width="1.8"/>
  <polygon points="188,128 204,128 208,152 184,152" fill="${acc}" stroke="${out}" stroke-width="2" stroke-linejoin="round"/>
</svg>`,
      };

    case 'edu-diploma':
      return {
        viewBox: '0 0 240 160',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160">
  <g transform="rotate(-14 120 80)">
    <rect x="24" y="48" width="192" height="62" rx="18" fill="${c1}" stroke="${out}" stroke-width="2.8"/>
    <ellipse cx="38" cy="79" rx="14" ry="31" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
    <ellipse cx="38" cy="79" rx="6" ry="16" fill="${out}" opacity="0.28"/>
    <ellipse cx="202" cy="79" rx="14" ry="31" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
    <rect x="108" y="45" width="24" height="68" rx="4" fill="${acc}" stroke="${out}" stroke-width="2.2"/>
    <polygon points="112,112 96,144 114,132 122,146 124,112" fill="${acc}" stroke="${out}" stroke-width="2"/>
    <polygon points="128,112 144,144 126,132 118,146 116,112" fill="${acc}" stroke="${out}" stroke-width="2"/>
  </g>
</svg>`,
      };

    case 'edu-globe':
      return {
        viewBox: '0 0 190 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 230">
  <rect x="50" y="194" width="90" height="22" rx="6" fill="${acc}" stroke="${out}" stroke-width="2.6"/>
  <rect x="88" y="172" width="14" height="24" fill="${acc}" stroke="${out}" stroke-width="2.4"/>
  <path d="M95 22 A78 78 0 0 1 95 174" fill="none" stroke="${acc}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="95" cy="98" r="62" fill="${c1}" stroke="${out}" stroke-width="2.8"/>
  <path d="M58 64 C74 58 88 72 78 90 C68 108 52 104 48 86 Z" fill="${c2}"/>
  <path d="M108 56 C132 54 146 74 134 94 C122 112 102 106 104 82 Z" fill="${c2}"/>
  <path d="M88 112 C108 110 120 128 106 144 C92 154 78 134 88 112 Z" fill="${c2}"/>
  <ellipse cx="72" cy="70" rx="14" ry="8" fill="#FFFFFF" opacity="0.4" transform="rotate(-25 72 70)"/>
</svg>`,
      };

    case 'edu-microscope':
      return {
        viewBox: '0 0 190 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 230">
  <rect x="34" y="192" width="122" height="22" rx="8" fill="${acc}" stroke="${out}" stroke-width="2.6"/>
  <path d="M126 192 V102 C126 78 106 66 88 66" fill="none" stroke="${c1}" stroke-width="18" stroke-linecap="round"/>
  <path d="M126 192 V102 C126 78 106 66 88 66" fill="none" stroke="${out}" stroke-width="2.5" stroke-linecap="round"/>
  <g transform="rotate(22 80 76)">
    <rect x="64" y="24" width="32" height="92" rx="6" fill="${c1}" stroke="${out}" stroke-width="2.6"/>
    <rect x="68" y="12" width="24" height="14" rx="4" fill="${c2}" stroke="${out}" stroke-width="2.2"/>
    <rect x="70" y="114" width="20" height="16" rx="3" fill="${acc}" stroke="${out}" stroke-width="2"/>
  </g>
  <rect x="40" y="150" width="76" height="12" rx="4" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
  <circle cx="126" cy="96" r="14" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
  <circle cx="126" cy="96" r="5" fill="#FFFFFF"/>
</svg>`,
      };

    case 'edu-backpack':
      return {
        viewBox: '0 0 190 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 220">
  <path d="M72 42 V24 A23 23 0 0 1 118 24 V42" fill="none" stroke="${out}" stroke-width="8" stroke-linecap="round"/>
  <rect x="34" y="42" width="122" height="158" rx="36" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <path d="M36 96 C66 112 124 112 154 96" fill="none" stroke="${out}" stroke-width="2.5"/>
  <rect x="52" y="124" width="86" height="58" rx="14" fill="${c2}" stroke="${out}" stroke-width="2.6"/>
  <line x1="62" y1="142" x2="128" y2="142" stroke="${out}" stroke-width="2.5" stroke-dasharray="6 4"/>
  <rect x="88" y="138" width="14" height="10" rx="3" fill="${acc}" stroke="${out}" stroke-width="1.8"/>
  <rect x="70" y="68" width="50" height="20" rx="8" fill="${acc}" stroke="${out}" stroke-width="2"/>
</svg>`,
      };

    case 'edu-chalkboard':
      return {
        viewBox: '0 0 270 190',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 190">
  <rect x="12" y="14" width="246" height="156" rx="10" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <rect x="24" y="26" width="222" height="128" rx="4" fill="${c1}" stroke="${out}" stroke-width="2"/>
  <rect x="10" y="160" width="250" height="16" rx="5" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
  <rect x="46" y="150" width="38" height="10" rx="2" fill="#E2E8F0" stroke="${out}" stroke-width="1.5"/>
  <rect x="190" y="153" width="24" height="7" rx="2" fill="${acc}" stroke="${out}" stroke-width="1.2"/>
  <text x="135" y="98" text-anchor="middle" fill="${acc}" font-family="Caveat, cursive, sans-serif" font-weight="700" font-size="34">${(label || 'A + B = C').slice(0, 14)}</text>
</svg>`,
      };

    case 'edu-lightbulb':
      return {
        viewBox: '0 0 170 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 220">
  <path d="M85 8 V22 M28 32 L38 42 M142 32 L132 42 M14 84 H28 M142 84 H156" stroke="${c1}" stroke-width="5" stroke-linecap="round"/>
  <path d="M85 30 C50 30 28 56 28 88 C28 112 44 128 54 146 H116 C126 128 142 112 142 88 C142 56 120 30 85 30 Z" fill="${c1}" stroke="${out}" stroke-width="2.8"/>
  <ellipse cx="64" cy="68" rx="14" ry="22" fill="${c2}" opacity="0.72" transform="rotate(-24 64 68)"/>
  <path d="M72 146 V106 L80 96 L85 106 L90 96 L98 106 V146" fill="none" stroke="${out}" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="58" y="148" width="54" height="14" rx="5" fill="${acc}" stroke="${out}" stroke-width="2.4"/>
  <rect x="62" y="164" width="46" height="14" rx="5" fill="${acc}" stroke="${out}" stroke-width="2.4"/>
  <path d="M70 180 H100 L92 194 H78 Z" fill="#475569" stroke="${out}" stroke-width="2.2"/>
</svg>`,
      };

    case 'edu-protractor':
      return {
        viewBox: '0 0 250 165',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 165">
  <path d="M22 138 A103 103 0 0 1 228 138 Z" fill="${c1}" fill-opacity="0.82" stroke="${out}" stroke-width="2.8" stroke-linejoin="round"/>
  <path d="M62 138 A63 63 0 0 1 188 138 Z" fill="#FFFFFF" fill-opacity="0.6" stroke="${out}" stroke-width="2.2" stroke-linejoin="round"/>
  ${Array.from({ length: 13 }, (_, idx) => {
    const deg = 180 - idx * 15;
    const rad = (deg * Math.PI) / 180;
    const x1 = 125 + Math.cos(rad) * 100;
    const y1 = 138 - Math.sin(rad) * 100;
    const x2 = 125 + Math.cos(rad) * (idx % 3 === 0 ? 84 : 90);
    const y2 = 138 - Math.sin(rad) * (idx % 3 === 0 ? 84 : 90);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${acc}" stroke-width="${idx % 3 === 0 ? 2.4 : 1.5}"/>`;
  }).join('')}
  <text x="125" y="122" text-anchor="middle" fill="${out}" font-family="Outfit, sans-serif" font-weight="800" font-size="14">${(label || '180°').slice(0, 6)}</text>
</svg>`,
      };

    case 'edu-notebook':
      return {
        viewBox: '0 0 190 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 230">
  <rect x="148" y="42" width="18" height="32" rx="4" fill="${acc}" stroke="${out}" stroke-width="2"/>
  <rect x="148" y="84" width="18" height="32" rx="4" fill="#22C55E" stroke="${out}" stroke-width="2"/>
  <rect x="148" y="126" width="18" height="32" rx="4" fill="#EC4899" stroke="${out}" stroke-width="2"/>
  <rect x="34" y="18" width="122" height="194" rx="12" fill="${c1}" stroke="${out}" stroke-width="2.8"/>
  ${[38, 66, 94, 122, 150, 178].map((ry) => `<rect x="18" y="${ry}" width="26" height="10" rx="5" fill="#E2E8F0" stroke="${out}" stroke-width="2"/>`).join('')}
  <rect x="58" y="48" width="78" height="54" rx="6" fill="${c2}" stroke="${out}" stroke-width="2.2"/>
  <text x="97" y="79" text-anchor="middle" fill="${out}" font-family="Outfit, sans-serif" font-weight="800" font-size="14">${(label || 'NOTES').slice(0, 8)}</text>
  <line x1="68" y1="88" x2="126" y2="88" stroke="#94A3B8" stroke-width="2"/>
</svg>`,
      };

    // Stickman & Cartoon Character Pose Sticker Renderers
    case 'char-stick-presenter':
      return {
        viewBox: '0 0 240 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 220">
  <ellipse cx="115" cy="204" rx="88" ry="10" fill="#94A3B8" opacity="0.25"/>
  <!-- Easel Board with white sticker border -->
  <line x1="142" y1="138" x2="128" y2="196" stroke="#FFFFFF" stroke-width="11" stroke-linecap="round"/>
  <line x1="198" y1="138" x2="212" y2="196" stroke="#FFFFFF" stroke-width="11" stroke-linecap="round"/>
  <rect x="114" y="24" width="112" height="114" rx="12" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="10"/>
  <line x1="142" y1="138" x2="128" y2="196" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <line x1="198" y1="138" x2="212" y2="196" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <line x1="170" y1="138" x2="170" y2="192" stroke="${out}" stroke-width="4.5" stroke-linecap="round"/>
  <rect x="114" y="24" width="112" height="114" rx="10" fill="${acc}" stroke="${out}" stroke-width="3.5"/>
  <rect x="128" y="38" width="84" height="22" rx="5" fill="${c1}"/>
  <text x="170" y="53" text-anchor="middle" fill="#FFFFFF" font-family="Outfit, sans-serif" font-weight="800" font-size="12">${(label || 'PITCH').slice(0, 10)}</text>
  <rect x="132" y="96" width="14" height="28" rx="3" fill="${c1}"/>
  <rect x="156" y="82" width="14" height="42" rx="3" fill="${c2}"/>
  <rect x="180" y="68" width="14" height="56" rx="3" fill="${c1}"/>
  <!-- Stickman Sticker Halo -->
  <g stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="62" cy="54" r="22" fill="#FFFFFF"/>
    <line x1="62" y1="76" x2="62" y2="136"/>
    <path d="M62 94 L34 118 L44 134"/>
    <path d="M62 94 L104 88 L142 74"/>
    <path d="M62 136 L40 194"/>
    <path d="M62 136 L84 194"/>
  </g>
  <!-- Stickman Crisp Ink -->
  <circle cx="62" cy="54" r="21" fill="#FFFFFF" stroke="${out}" stroke-width="4.5"/>
  <circle cx="56" cy="51" r="2.6" fill="${out}"/>
  <circle cx="70" cy="51" r="2.6" fill="${out}"/>
  <path d="M55 61 Q63 67 71 61" fill="none" stroke="${out}" stroke-width="2.6" stroke-linecap="round"/>
  <line x1="62" y1="75" x2="62" y2="136" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <polygon points="62,78 57,96 62,104 67,96" fill="${c1}"/>
  <path d="M62 94 L34 118 L44 134" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M62 94 L104 88" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round"/>
  <line x1="104" y1="88" x2="144" y2="73" stroke="${c2}" stroke-width="3.6" stroke-linecap="round"/>
  <circle cx="145" cy="73" r="4" fill="${c1}"/>
  <path d="M62 136 L40 194 M62 136 L84 194" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-stick-idea':
      return {
        viewBox: '0 0 190 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 230">
  <ellipse cx="95" cy="214" rx="52" ry="9" fill="#94A3B8" opacity="0.25"/>
  <!-- Idea Lightbulb -->
  <path d="M95 16 C75 16 62 30 62 46 C62 59 71 67 76 76 H114 C119 67 128 59 128 46 C128 30 115 16 95 16 Z" fill="${c1}" stroke="#FFFFFF" stroke-width="10"/>
  <path d="M44 44 H54 M136 44 H146 M54 20 L62 28 M136 20 L128 28 M95 4 V12" stroke="${c3Fallback(acc)}" stroke-width="4" stroke-linecap="round"/>
  <path d="M95 16 C75 16 62 30 62 46 C62 59 71 67 76 76 H114 C119 67 128 59 128 46 C128 30 115 16 95 16 Z" fill="${c1}" stroke="${out}" stroke-width="3.2"/>
  <ellipse cx="83" cy="36" rx="7" ry="12" fill="${c2}" opacity="0.8" transform="rotate(-20 83 36)"/>
  <rect x="80" y="76" width="30" height="10" rx="4" fill="#94A3B8" stroke="${out}" stroke-width="2.5"/>
  <!-- Stickman Halo -->
  <g stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="95" cy="112" r="20" fill="#FFFFFF"/>
    <line x1="95" y1="132" x2="95" y2="174"/>
    <path d="M95 144 L54 114 L52 92"/>
    <path d="M95 144 L132 158 L124 176"/>
    <path d="M95 174 L72 210"/>
    <path d="M95 174 L118 210"/>
  </g>
  <circle cx="95" cy="112" r="20" fill="#FFFFFF" stroke="${out}" stroke-width="4.5"/>
  <circle cx="88" cy="108" r="2.5" fill="${out}"/>
  <circle cx="102" cy="108" r="2.5" fill="${out}"/>
  <circle cx="95" cy="119" r="3.5" fill="${acc}"/>
  <line x1="95" y1="132" x2="95" y2="174" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <path d="M95 144 L54 114 L52 92" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M95 144 L132 158 L124 176" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M95 174 L72 210 M95 174 L118 210" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-stick-thinking':
      return {
        viewBox: '0 0 210 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 230">
  <ellipse cx="86" cy="214" rx="54" ry="9" fill="#94A3B8" opacity="0.25"/>
  <!-- Thought Cloud -->
  <circle cx="118" cy="86" r="6" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
  <circle cx="132" cy="72" r="9" fill="${c2}" stroke="${out}" stroke-width="2.5"/>
  <path d="M134 56 C122 56 116 46 122 36 C124 24 136 16 150 20 C160 12 178 16 184 28 C196 30 200 44 192 54 C188 60 176 62 164 60 Z" fill="${c2}" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"/>
  <path d="M134 56 C122 56 116 46 122 36 C124 24 136 16 150 20 C160 12 178 16 184 28 C196 30 200 44 192 54 C188 60 176 62 164 60 Z" fill="${c2}" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <text x="158" y="47" text-anchor="middle" fill="${c1}" font-family="Outfit, sans-serif" font-weight="900" font-size="24">${(label || '?').slice(0, 4)}</text>
  <!-- Stickman Halo -->
  <g stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="82" cy="88" r="22" fill="#FFFFFF"/>
    <line x1="82" y1="110" x2="82" y2="164"/>
    <path d="M82 124 L52 140 L68 158"/>
    <path d="M82 124 L112 126 L94 106"/>
    <path d="M82 164 L62 210"/>
    <path d="M82 164 L106 210"/>
  </g>
  <circle cx="82" cy="88" r="21" fill="#FFFFFF" stroke="${out}" stroke-width="4.5"/>
  <circle cx="76" cy="85" r="2.5" fill="${out}"/>
  <circle cx="90" cy="85" r="2.5" fill="${out}"/>
  <line x1="76" y1="96" x2="90" y2="95" stroke="${out}" stroke-width="2.6" stroke-linecap="round"/>
  <line x1="82" y1="109" x2="82" y2="164" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <path d="M82 124 L52 140 L68 158" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M82 124 L112 126 L94 106" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="94" cy="105" r="4.5" fill="${acc}"/>
  <path d="M82 164 L62 210 M82 164 L106 210" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-stick-cheering':
      return {
        viewBox: '0 0 200 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">
  <ellipse cx="100" cy="204" rx="56" ry="9" fill="#94A3B8" opacity="0.25"/>
  <!-- Celebration bursts -->
  <polygon points="36,36 41,47 53,48 44,56 46,68 36,62 26,68 28,56 19,48 31,47" fill="${c2}" stroke="${out}" stroke-width="2"/>
  <polygon points="164,34 168,44 179,45 171,52 173,63 164,57 155,63 157,52 149,45 160,44" fill="${c1}" stroke="${out}" stroke-width="2"/>
  <circle cx="100" cy="22" r="6" fill="${acc}"/>
  <circle cx="52" cy="84" r="5" fill="${c1}"/>
  <circle cx="150" cy="82" r="5" fill="${c2}"/>
  <!-- Jumping Stickman Halo -->
  <g stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="100" cy="68" r="22" fill="#FFFFFF"/>
    <line x1="100" y1="90" x2="100" y2="142"/>
    <path d="M100 104 L60 72 L52 46"/>
    <path d="M100 104 L140 72 L148 46"/>
    <path d="M100 142 L68 170 L58 192"/>
    <path d="M100 142 L132 170 L142 192"/>
  </g>
  <circle cx="100" cy="68" r="21" fill="#FFFFFF" stroke="${out}" stroke-width="4.5"/>
  <path d="M89 64 Q93 59 97 64 M103 64 Q107 59 111 64" fill="none" stroke="${out}" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M89 72 Q100 84 111 72 Z" fill="${c1}" stroke="${out}" stroke-width="2"/>
  <line x1="100" y1="89" x2="100" y2="142" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <path d="M100 104 L60 72 L52 46 M100 104 L140 72 L148 46" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M100 142 L68 170 L58 192 M100 142 L132 170 L142 192" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      };

    case 'char-stick-pointing':
      return {
        viewBox: '0 0 220 210',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 210">
  <ellipse cx="92" cy="196" rx="64" ry="9" fill="#94A3B8" opacity="0.25"/>
  <!-- Target Arrow Badge -->
  <polygon points="154,68 188,68 188,54 214,80 188,106 188,92 154,92" fill="${c1}" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"/>
  <polygon points="154,68 188,68 188,54 214,80 188,106 188,92 154,92" fill="${c1}" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <!-- Stickman Halo -->
  <g stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="80" cy="52" r="22" fill="#FFFFFF"/>
    <path d="M80 74 L74 132"/>
    <path d="M78 90 L44 108 L52 128"/>
    <path d="M78 90 L146 80"/>
    <path d="M74 132 L46 188"/>
    <path d="M74 132 L108 188"/>
  </g>
  <circle cx="80" cy="52" r="21" fill="#FFFFFF" stroke="${out}" stroke-width="4.5"/>
  <circle cx="76" cy="49" r="2.6" fill="${out}"/>
  <circle cx="90" cy="49" r="2.6" fill="${out}"/>
  <path d="M76 59 Q85 65 92 58" fill="none" stroke="${out}" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M80 73 L74 132" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <path d="M78 90 L44 108 L52 128" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M78 90 L146 80" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round"/>
  <circle cx="146" cy="80" r="5" fill="${c2}" stroke="${out}" stroke-width="2"/>
  <path d="M74 132 L46 188 M74 132 L108 188" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-stick-laptop':
      return {
        viewBox: '0 0 230 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 200">
  <ellipse cx="115" cy="184" rx="90" ry="10" fill="#94A3B8" opacity="0.25"/>
  <!-- Stickman Behind Desk -->
  <g stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="74" cy="52" r="20" fill="#FFFFFF"/>
    <path d="M74 72 L70 124 L42 134 L42 176"/>
    <path d="M70 124 L94 176"/>
    <path d="M72 88 L112 104 L126 112"/>
  </g>
  <circle cx="74" cy="52" r="19" fill="#FFFFFF" stroke="${out}" stroke-width="4.5"/>
  <circle cx="70" cy="50" r="2.4" fill="${out}"/>
  <circle cx="82" cy="50" r="2.4" fill="${out}"/>
  <path d="M70 59 Q77 64 84 59" fill="none" stroke="${out}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M74 71 L70 124 L42 134 L42 176 M70 124 L94 176" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M72 88 L112 104 L126 112" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Desk & Laptop -->
  <rect x="86" y="116" width="128" height="12" rx="5" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <line x1="104" y1="128" x2="104" y2="178" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <line x1="196" y1="128" x2="196" y2="178" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <polygon points="122,116 154,116 172,72 140,72" fill="${c1}" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <line x1="112" y1="116" x2="154" y2="116" stroke="${out}" stroke-width="4" stroke-linecap="round"/>
  <rect x="178" y="96" width="18" height="20" rx="4" fill="${acc}" stroke="${out}" stroke-width="2.4"/>
</svg>`,
      };

    case 'char-stick-sign':
      return {
        viewBox: '0 0 220 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 230">
  <ellipse cx="110" cy="214" rx="56" ry="9" fill="#94A3B8" opacity="0.25"/>
  <!-- Signboard Halo + Card -->
  <rect x="28" y="16" width="164" height="62" rx="12" fill="${c2}" stroke="#FFFFFF" stroke-width="10"/>
  <!-- Stickman Halo -->
  <g stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="110" cy="108" r="20" fill="#FFFFFF"/>
    <line x1="110" y1="128" x2="110" y2="172"/>
    <path d="M110 140 L54 114 L54 78"/>
    <path d="M110 140 L166 114 L166 78"/>
    <path d="M110 172 L86 210"/>
    <path d="M110 172 L134 210"/>
  </g>
  <rect x="28" y="16" width="164" height="62" rx="12" fill="${c2}" stroke="${out}" stroke-width="3.5"/>
  <rect x="36" y="24" width="148" height="46" rx="8" fill="#FFFFFF" stroke="${c1}" stroke-width="2"/>
  <text x="110" y="54" text-anchor="middle" fill="${c1}" font-family="Outfit, sans-serif" font-weight="900" font-size="22" letter-spacing="0.8">${(label || 'KEY NOTE').slice(0, 12)}</text>
  <circle cx="110" cy="108" r="19" fill="#FFFFFF" stroke="${out}" stroke-width="4.5"/>
  <circle cx="103" cy="105" r="2.5" fill="${out}"/>
  <circle cx="117" cy="105" r="2.5" fill="${out}"/>
  <path d="M103 114 Q110 120 117 114" fill="none" stroke="${out}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="110" y1="127" x2="110" y2="172" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <path d="M110 140 L54 114 L54 78 M110 140 L166 114 L166 78" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M110 172 L86 210 M110 172 L134 210" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-stick-climb':
      return {
        viewBox: '0 0 240 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 220">
  <ellipse cx="122" cy="204" rx="92" ry="9" fill="#94A3B8" opacity="0.25"/>
  <!-- Rising Bar Steps -->
  <rect x="34" y="162" width="44" height="36" rx="6" fill="${acc}" stroke="${out}" stroke-width="3"/>
  <rect x="92" y="128" width="44" height="70" rx="6" fill="${acc}" stroke="${out}" stroke-width="3"/>
  <rect x="150" y="90" width="52" height="108" rx="6" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <!-- Target Star -->
  <polygon points="184,22 190,36 205,38 194,48 197,62 184,55 171,62 174,48 163,38 178,36" fill="${c2}" stroke="${out}" stroke-width="2.4" stroke-linejoin="round"/>
  <!-- Climbing Stickman -->
  <g stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="104" cy="48" r="18" fill="#FFFFFF"/>
    <path d="M104 66 L108 106"/>
    <path d="M106 82 L78 96"/>
    <path d="M106 82 L144 68"/>
    <path d="M108 106 L80 128 L66 160"/>
    <path d="M108 106 L140 100 L158 90"/>
  </g>
  <circle cx="104" cy="48" r="17" fill="#FFFFFF" stroke="${out}" stroke-width="4.2"/>
  <circle cx="101" cy="46" r="2.2" fill="${out}"/>
  <circle cx="111" cy="46" r="2.2" fill="${out}"/>
  <path d="M101 54 Q107 58 113 53" fill="none" stroke="${out}" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M104 65 L108 106" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round"/>
  <path d="M106 82 L78 96 M106 82 L144 68" fill="none" stroke="${out}" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M108 106 L80 128 L66 160 M108 106 L140 100 L158 90" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      };

    case 'char-stick-confused':
      return {
        viewBox: '0 0 200 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">
  <ellipse cx="100" cy="204" rx="54" ry="9" fill="#94A3B8" opacity="0.25"/>
  <text x="100" y="38" text-anchor="middle" fill="${c1}" stroke="#FFFFFF" stroke-width="5" paint-order="stroke" font-family="Outfit, sans-serif" font-weight="900" font-size="30">${(label || '?!').slice(0, 4)}</text>
  <g stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="100" cy="76" r="22" fill="#FFFFFF"/>
    <line x1="100" y1="98" x2="100" y2="152"/>
    <path d="M100 114 L64 122 L50 100"/>
    <path d="M100 114 L136 122 L150 100"/>
    <path d="M100 152 L78 198"/>
    <path d="M100 152 L122 198"/>
  </g>
  <circle cx="100" cy="76" r="21" fill="#FFFFFF" stroke="${out}" stroke-width="4.5"/>
  <circle cx="93" cy="73" r="2.6" fill="${out}"/>
  <circle cx="107" cy="73" r="2.6" fill="${out}"/>
  <path d="M92 85 Q97 81 101 85 Q105 89 109 85" fill="none" stroke="${out}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="100" y1="97" x2="100" y2="152" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <path d="M100 114 L64 122 L50 100 M100 114 L136 122 L150 100" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M100 152 L78 198 M100 152 L122 198" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-stick-running':
      return {
        viewBox: '0 0 230 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 200">
  <ellipse cx="122" cy="184" rx="74" ry="9" fill="#94A3B8" opacity="0.25"/>
  <!-- Speed Lines -->
  <line x1="16" y1="62" x2="62" y2="62" stroke="${acc}" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="8" y1="84" x2="52" y2="84" stroke="${c2}" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="22" y1="106" x2="58" y2="106" stroke="${c1}" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Stickman Running Halo -->
  <g stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="144" cy="46" r="20" fill="#FFFFFF"/>
    <path d="M140 66 L118 118"/>
    <path d="M132 82 L166 96 L186 80"/>
    <path d="M132 82 L94 94 L84 114"/>
    <path d="M118 118 L156 144 L172 178"/>
    <path d="M118 118 L78 144 L54 166"/>
  </g>
  <!-- Briefcase -->
  <rect x="64" y="114" width="38" height="28" rx="5" fill="${c1}" stroke="${out}" stroke-width="2.8" transform="rotate(-14 83 128)"/>
  <circle cx="144" cy="46" r="19" fill="#FFFFFF" stroke="${out}" stroke-width="4.5"/>
  <circle cx="141" cy="44" r="2.4" fill="${out}"/>
  <circle cx="153" cy="44" r="2.4" fill="${out}"/>
  <path d="M142 53 Q149 58 156 53" fill="none" stroke="${out}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M140 65 L118 118" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <path d="M132 82 L166 96 L186 80 M132 82 L94 94 L84 114" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M118 118 L156 144 L172 178 M118 118 L78 144 L54 166" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      };

    case 'char-stick-megaphone':
      return {
        viewBox: '0 0 240 210',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 210">
  <ellipse cx="104" cy="194" rx="74" ry="9" fill="#94A3B8" opacity="0.25"/>
  <!-- Acoustic Waves & Shout Tag -->
  <path d="M168 62 Q182 76 168 90 M182 52 Q202 76 182 100" fill="none" stroke="${acc}" stroke-width="4" stroke-linecap="round"/>
  <rect x="150" y="18" width="76" height="30" rx="15" fill="${c2}" stroke="${out}" stroke-width="2.6"/>
  <text x="188" y="38" text-anchor="middle" fill="${out}" font-family="Outfit, sans-serif" font-weight="900" font-size="14">${(label || 'NEWS!').slice(0, 8)}</text>
  <!-- Stickman Halo -->
  <g stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="72" cy="58" r="21" fill="#FFFFFF"/>
    <line x1="72" y1="79" x2="72" y2="136"/>
    <path d="M72 96 L44 122 L54 138"/>
    <path d="M72 96 L112 88"/>
    <path d="M72 136 L52 188"/>
    <path d="M72 136 L94 188"/>
  </g>
  <!-- Megaphone -->
  <polygon points="104,78 156,56 156,100 104,88" fill="${c1}" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="round"/>
  <polygon points="104,78 156,56 156,100 104,88" fill="${c1}" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <line x1="114" y1="90" x2="114" y2="104" stroke="${out}" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="72" cy="58" r="20" fill="#FFFFFF" stroke="${out}" stroke-width="4.5"/>
  <circle cx="68" cy="55" r="2.5" fill="${out}"/>
  <circle cx="80" cy="55" r="2.5" fill="${out}"/>
  <circle cx="76" cy="66" r="4" fill="${c1}"/>
  <line x1="72" y1="78" x2="72" y2="136" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
  <path d="M72 96 L44 122 L54 138 M72 96 L112 88" fill="none" stroke="${out}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M72 136 L52 188 M72 136 L94 188" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-stick-team':
      return {
        viewBox: '0 0 250 210',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 210">
  <ellipse cx="125" cy="194" rx="94" ry="10" fill="#94A3B8" opacity="0.25"/>
  <!-- High-five Spark -->
  <polygon points="125,18 131,32 146,34 135,44 138,58 125,51 112,58 115,44 104,34 119,32" fill="${acc}" stroke="${out}" stroke-width="2.2" stroke-linejoin="round"/>
  <!-- Two Stickmen Halo -->
  <g stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="66" cy="70" r="19" fill="#FFFFFF"/>
    <path d="M68 89 L76 138"/>
    <path d="M70 104 L42 122"/>
    <path d="M70 104 L122 52"/>
    <path d="M76 138 L52 186"/>
    <path d="M76 138 L94 186"/>
    <circle cx="184" cy="70" r="19" fill="#FFFFFF"/>
    <path d="M182 89 L174 138"/>
    <path d="M180 104 L208 122"/>
    <path d="M180 104 L128 52"/>
    <path d="M174 138 L156 186"/>
    <path d="M174 138 L198 186"/>
  </g>
  <!-- Left Stickman -->
  <circle cx="66" cy="70" r="18" fill="#FFFFFF" stroke="${c1}" stroke-width="4.5"/>
  <circle cx="63" cy="67" r="2.2" fill="${out}"/>
  <circle cx="73" cy="67" r="2.2" fill="${out}"/>
  <path d="M62 76 Q69 81 75 75" fill="none" stroke="${out}" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M68 88 L76 138 M70 104 L42 122 M70 104 L122 52 M76 138 L52 186 M76 138 L94 186" fill="none" stroke="${c1}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Right Stickman -->
  <circle cx="184" cy="70" r="18" fill="#FFFFFF" stroke="${c2}" stroke-width="4.5"/>
  <circle cx="177" cy="67" r="2.2" fill="${out}"/>
  <circle cx="187" cy="67" r="2.2" fill="${out}"/>
  <path d="M175 75 Q181 81 188 76" fill="none" stroke="${out}" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M182 88 L174 138 M180 104 L208 122 M180 104 L128 52 M174 138 L156 186 M174 138 L198 186" fill="none" stroke="${c2}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      };

    // Cartoon Character Sticker Renderers (14 Poses)
    case 'char-toon-wave':
      return {
        viewBox: '0 0 210 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 230">
  <ellipse cx="96" cy="214" rx="58" ry="10" fill="#94A3B8" opacity="0.25"/>
  <!-- Speech pill -->
  <rect x="136" y="20" width="60" height="32" rx="16" fill="${acc}" stroke="${out}" stroke-width="2.8"/>
  <text x="166" y="42" text-anchor="middle" fill="${out}" font-family="Outfit, sans-serif" font-weight="900" font-size="16">${(label || 'HI!').slice(0, 6)}</text>
  <!-- Waving arm -->
  <path d="M126 116 L158 78" stroke="${c1}" stroke-width="18" stroke-linecap="round"/>
  <path d="M126 116 L158 78" stroke="${out}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="162" cy="72" r="11" fill="${c2}" stroke="${out}" stroke-width="2.8"/>
  <!-- Left arm -->
  <path d="M68 118 L48 154" stroke="${c1}" stroke-width="16" stroke-linecap="round"/>
  <circle cx="46" cy="158" r="9" fill="${c2}" stroke="${out}" stroke-width="2.6"/>
  <!-- Legs -->
  <rect x="74" y="166" width="16" height="44" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <rect x="104" y="166" width="16" height="44" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <!-- Hoodie torso -->
  <rect x="64" y="102" width="66" height="72" rx="22" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <circle cx="97" cy="134" r="10" fill="${acc}"/>
  <!-- Head & Hair -->
  <circle cx="97" cy="66" r="34" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M64 62 C64 34 130 34 130 62 C116 48 80 48 64 62 Z" fill="${out}"/>
  <circle cx="85" cy="68" r="3.5" fill="${out}"/>
  <circle cx="109" cy="68" r="3.5" fill="${out}"/>
  <circle cx="77" cy="76" r="4.5" fill="#FB7185" opacity="0.55"/>
  <circle cx="117" cy="76" r="4.5" fill="#FB7185" opacity="0.55"/>
  <path d="M87 80 Q97 90 107 80" fill="none" stroke="${out}" stroke-width="3" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-toon-thumbsup':
      return {
        viewBox: '0 0 210 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 230">
  <ellipse cx="98" cy="214" rx="60" ry="10" fill="#94A3B8" opacity="0.25"/>
  <polygon points="164,34 169,46 182,48 172,56 175,68 164,62 153,68 156,56 146,48 159,46" fill="${acc}" stroke="${out}" stroke-width="2"/>
  <rect x="74" y="166" width="16" height="44" rx="8" fill="#334155" stroke="${out}" stroke-width="2.6"/>
  <rect x="104" y="166" width="16" height="44" rx="8" fill="#334155" stroke="${out}" stroke-width="2.6"/>
  <rect x="64" y="102" width="66" height="72" rx="22" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <path d="M66 118 L44 148" stroke="${c1}" stroke-width="16" stroke-linecap="round"/>
  <circle cx="42" cy="152" r="9" fill="${c2}" stroke="${out}" stroke-width="2.6"/>
  <!-- Thumbs Up Arm -->
  <path d="M126 120 L158 106" stroke="${c1}" stroke-width="18" stroke-linecap="round"/>
  <rect x="150" y="94" width="24" height="22" rx="8" fill="${c2}" stroke="${out}" stroke-width="2.8"/>
  <rect x="156" y="76" width="11" height="22" rx="5.5" fill="${c2}" stroke="${out}" stroke-width="2.6"/>
  <!-- Head -->
  <circle cx="97" cy="64" r="34" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M64 56 C70 28 124 28 130 56 C116 44 82 44 64 56 Z" fill="${out}"/>
  <circle cx="85" cy="66" r="3.5" fill="${out}"/>
  <path d="M103 66 Q109 61 115 66" fill="none" stroke="${out}" stroke-width="3" stroke-linecap="round"/>
  <path d="M84 78 Q97 90 110 78 Z" fill="#FFFFFF" stroke="${out}" stroke-width="2.2"/>
</svg>`,
      };

    case 'char-toon-presenter':
      return {
        viewBox: '0 0 250 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 230">
  <ellipse cx="125" cy="214" rx="92" ry="10" fill="#94A3B8" opacity="0.25"/>
  <!-- Mini Presentation Board -->
  <rect x="128" y="34" width="106" height="104" rx="12" fill="#FFFFFF" stroke="${out}" stroke-width="3.2"/>
  <rect x="142" y="46" width="78" height="20" rx="5" fill="${c1}"/>
  <text x="181" y="60" text-anchor="middle" fill="#FFFFFF" font-family="Outfit, sans-serif" font-weight="800" font-size="11">${(label || 'DATA').slice(0, 10)}</text>
  <polyline points="142,118 164,96 184,106 212,78" fill="none" stroke="${acc}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="212" cy="78" r="5" fill="${c1}"/>
  <!-- Presenter Character -->
  <rect x="52" y="168" width="15" height="42" rx="7" fill="#1E293B" stroke="${out}" stroke-width="2.5"/>
  <rect x="78" y="168" width="15" height="42" rx="7" fill="#1E293B" stroke="${out}" stroke-width="2.5"/>
  <rect x="42" y="106" width="60" height="68" rx="20" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <polygon points="72,108 66,128 72,138 78,128" fill="#FFFFFF"/>
  <path d="M98 118 L138 100" stroke="${c1}" stroke-width="15" stroke-linecap="round"/>
  <line x1="138" y1="100" x2="178" y2="86" stroke="${acc}" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="138" cy="100" r="8" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
  <circle cx="72" cy="68" r="32" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M40 62 C44 34 102 34 104 62 C90 48 54 48 40 62 Z" fill="${out}"/>
  <circle cx="62" cy="70" r="3.2" fill="${out}"/>
  <circle cx="84" cy="70" r="3.2" fill="${out}"/>
  <path d="M64 81 Q73 88 82 81" fill="none" stroke="${out}" stroke-width="2.8" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-toon-idea':
      return {
        viewBox: '0 0 210 235',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 235">
  <ellipse cx="105" cy="220" rx="56" ry="9" fill="#94A3B8" opacity="0.25"/>
  <!-- Glowing Bulb -->
  <path d="M105 14 C86 14 74 27 74 43 C74 55 82 62 87 71 H123 C128 62 136 55 136 43 C136 27 124 14 105 14 Z" fill="${acc}" stroke="${out}" stroke-width="3"/>
  <rect x="91" y="71" width="28" height="9" rx="4" fill="#94A3B8" stroke="${out}" stroke-width="2.2"/>
  <path d="M56 42 H66 M144 42 H154 M66 18 L73 25 M144 18 L137 25" stroke="${acc}" stroke-width="4" stroke-linecap="round"/>
  <!-- Character -->
  <rect x="82" y="176" width="16" height="40" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <rect x="112" y="176" width="16" height="40" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <rect x="72" y="120" width="66" height="64" rx="22" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <path d="M134 134 L162 96" stroke="${c1}" stroke-width="16" stroke-linecap="round"/>
  <circle cx="164" cy="92" r="10" fill="${c2}" stroke="${out}" stroke-width="2.6"/>
  <line x1="164" y1="84" x2="164" y2="70" stroke="${c2}" stroke-width="7" stroke-linecap="round"/>
  <circle cx="105" cy="102" r="30" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M75 96 C78 72 132 72 135 96 C122 84 88 84 75 96 Z" fill="${out}"/>
  <circle cx="94" cy="103" r="3.2" fill="${out}"/>
  <circle cx="116" cy="103" r="3.2" fill="${out}"/>
  <circle cx="105" cy="115" r="4.5" fill="${c1}"/>
</svg>`,
      };

    case 'char-toon-think':
      return {
        viewBox: '0 0 220 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 230">
  <ellipse cx="96" cy="214" rx="58" ry="10" fill="#94A3B8" opacity="0.25"/>
  <!-- Thought Cloud -->
  <circle cx="132" cy="76" r="6" fill="#FFFFFF" stroke="${out}" stroke-width="2.4"/>
  <circle cx="146" cy="62" r="9" fill="#FFFFFF" stroke="${out}" stroke-width="2.4"/>
  <path d="M148 48 C136 48 130 38 136 28 C140 16 154 10 168 14 C178 8 194 14 198 26 C208 28 212 42 202 50 C196 56 178 56 164 52 Z" fill="#FFFFFF" stroke="${out}" stroke-width="2.8" stroke-linejoin="round"/>
  <text x="172" y="41" text-anchor="middle" fill="${acc}" font-family="Outfit, sans-serif" font-weight="900" font-size="22">${(label || '?').slice(0, 4)}</text>
  <!-- Character -->
  <rect x="74" y="166" width="16" height="44" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <rect x="104" y="166" width="16" height="44" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <rect x="64" y="102" width="66" height="72" rx="22" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <circle cx="97" cy="64" r="34" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M64 56 C68 28 126 28 130 56 C116 44 82 44 64 56 Z" fill="${out}"/>
  <circle cx="87" cy="64" r="3.4" fill="${out}"/>
  <circle cx="111" cy="64" r="3.4" fill="${out}"/>
  <line x1="82" y1="54" x2="94" y2="52" stroke="${out}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="106" y1="50" x2="118" y2="54" stroke="${out}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="90" y1="80" x2="106" y2="79" stroke="${out}" stroke-width="2.8" stroke-linecap="round"/>
  <!-- Chin Hand -->
  <path d="M126 124 L138 102 L106 94" fill="none" stroke="${c1}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="102" cy="94" r="9" fill="${c2}" stroke="${out}" stroke-width="2.6"/>
</svg>`,
      };

    case 'char-toon-laptop':
      return {
        viewBox: '0 0 230 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 220">
  <ellipse cx="115" cy="204" rx="88" ry="10" fill="#94A3B8" opacity="0.25"/>
  <!-- Character Torso & Head Behind Laptop -->
  <rect x="74" y="104" width="82" height="68" rx="24" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <circle cx="115" cy="64" r="34" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M81 58 C84 30 146 30 149 58 C134 44 96 44 81 58 Z" fill="${out}"/>
  <circle cx="103" cy="66" r="3.4" fill="${out}"/>
  <circle cx="127" cy="66" r="3.4" fill="${out}"/>
  <path d="M105 78 Q115 86 125 78" fill="none" stroke="${out}" stroke-width="2.8" stroke-linecap="round"/>
  <!-- Laptop Lid & Desk -->
  <rect x="48" y="128" width="134" height="68" rx="10" fill="#E2E8F0" stroke="${out}" stroke-width="3.2"/>
  <circle cx="115" cy="162" r="11" fill="${acc}" stroke="${out}" stroke-width="2"/>
  <rect x="26" y="192" width="178" height="12" rx="6" fill="#94A3B8" stroke="${out}" stroke-width="2.6"/>
  <!-- Hands gripping laptop -->
  <circle cx="64" cy="136" r="9" fill="${c2}" stroke="${out}" stroke-width="2.6"/>
  <circle cx="166" cy="136" r="9" fill="${c2}" stroke="${out}" stroke-width="2.6"/>
</svg>`,
      };

    case 'char-toon-trophy':
      return {
        viewBox: '0 0 220 235',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 235">
  <ellipse cx="110" cy="220" rx="60" ry="10" fill="#94A3B8" opacity="0.25"/>
  <!-- Trophy -->
  <path d="M84 22 H136 L130 58 C128 72 118 78 110 78 C102 78 92 72 90 58 Z" fill="${acc}" stroke="${out}" stroke-width="2.8"/>
  <rect x="104" y="76" width="12" height="14" fill="${acc}" stroke="${out}" stroke-width="2.2"/>
  <rect x="92" y="90" width="36" height="12" rx="4" fill="#78350F" stroke="${out}" stroke-width="2.2"/>
  <polygon points="44,40 48,50 59,51 50,58 53,68 44,62 35,68 38,58 29,51 40,50" fill="${acc}" stroke="${out}" stroke-width="1.8"/>
  <polygon points="176,40 180,50 191,51 182,58 185,68 176,62 167,68 170,58 161,51 172,50" fill="${acc}" stroke="${out}" stroke-width="1.8"/>
  <!-- Arms holding trophy -->
  <path d="M84 134 L62 104 L88 94" fill="none" stroke="${c1}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M136 134 L158 104 L132 94" fill="none" stroke="${c1}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Character -->
  <rect x="86" y="178" width="16" height="38" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <rect x="118" y="178" width="16" height="38" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <rect x="78" y="124" width="64" height="62" rx="22" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <circle cx="110" cy="112" r="28" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M82 106 C86 82 134 82 138 106 C126 94 94 94 82 106 Z" fill="${out}"/>
  <circle cx="99" cy="114" r="3" fill="${out}"/>
  <circle cx="121" cy="114" r="3" fill="${out}"/>
  <path d="M100 124 Q110 132 120 124" fill="none" stroke="${out}" stroke-width="2.8" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-toon-rocket':
      return {
        viewBox: '0 0 220 235',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 235">
  <ellipse cx="110" cy="220" rx="64" ry="9" fill="#94A3B8" opacity="0.25"/>
  <!-- Rocket Body Behind/Beside Hero -->
  <g transform="rotate(-14 148 112)">
    <path d="M148 28 C166 56 172 96 168 144 H128 C124 96 130 56 148 28 Z" fill="#F8FAFC" stroke="${out}" stroke-width="3"/>
    <path d="M148 28 C158 44 164 58 166 72 H130 C132 58 138 44 148 28 Z" fill="${acc}" stroke="${out}" stroke-width="2.6"/>
    <circle cx="148" cy="96" r="12" fill="#BAE6FD" stroke="${out}" stroke-width="2.5"/>
    <polygon points="128,122 110,148 128,144" fill="${acc}" stroke="${out}" stroke-width="2.4"/>
    <polygon points="168,122 186,148 168,144" fill="${acc}" stroke="${out}" stroke-width="2.4"/>
    <path d="M136 146 Q148 184 160 146 Z" fill="#FACC15" stroke="${acc}" stroke-width="2"/>
  </g>
  <!-- Hero Character -->
  <rect x="64" y="170" width="15" height="44" rx="7" fill="#1E293B" stroke="${out}" stroke-width="2.5"/>
  <rect x="92" y="170" width="15" height="44" rx="7" fill="#1E293B" stroke="${out}" stroke-width="2.5"/>
  <rect x="54" y="110" width="62" height="66" rx="22" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <path d="M112 124 L138 114" stroke="${c1}" stroke-width="15" stroke-linecap="round"/>
  <circle cx="140" cy="114" r="9" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
  <circle cx="85" cy="74" r="32" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <rect x="64" y="62" width="42" height="16" rx="8" fill="${acc}" opacity="0.82" stroke="${out}" stroke-width="2.4"/>
  <path d="M74 88 Q85 96 96 88" fill="none" stroke="${out}" stroke-width="2.8" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-toon-megaphone':
      return {
        viewBox: '0 0 240 225',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 225">
  <ellipse cx="104" cy="210" rx="68" ry="10" fill="#94A3B8" opacity="0.25"/>
  <!-- Announcement Tag -->
  <rect x="148" y="24" width="76" height="32" rx="16" fill="${acc}" stroke="${out}" stroke-width="2.8"/>
  <text x="186" y="46" text-anchor="middle" fill="${out}" font-family="Outfit, sans-serif" font-weight="900" font-size="14">${(label || 'NEW!').slice(0, 8)}</text>
  <path d="M174 72 Q190 90 174 108 M192 60 Q212 90 192 120" fill="none" stroke="${acc}" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Character -->
  <rect x="64" y="164" width="16" height="42" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <rect x="94" y="164" width="16" height="42" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <rect x="54" y="102" width="66" height="68" rx="22" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <path d="M114 114 L132 102" stroke="${c1}" stroke-width="15" stroke-linecap="round"/>
  <polygon points="122,92 170,68 170,118 122,102" fill="${acc}" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="87" cy="64" r="32" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M55 58 C59 30 115 30 119 58 C105 44 69 44 55 58 Z" fill="${out}"/>
  <circle cx="78" cy="66" r="3.4" fill="${out}"/>
  <circle cx="100" cy="66" r="3.4" fill="${out}"/>
  <circle cx="92" cy="78" r="5" fill="${c1}"/>
</svg>`,
      };

    case 'char-toon-reading':
      return {
        viewBox: '0 0 220 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
  <ellipse cx="110" cy="204" rx="70" ry="10" fill="#94A3B8" opacity="0.25"/>
  <rect x="74" y="104" width="72" height="66" rx="22" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <circle cx="110" cy="64" r="34" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M76 58 C80 30 140 30 144 58 C130 44 90 44 76 58 Z" fill="${out}"/>
  <!-- Glasses -->
  <circle cx="96" cy="66" r="9" fill="#FFFFFF" fill-opacity="0.45" stroke="${out}" stroke-width="2.6"/>
  <circle cx="124" cy="66" r="9" fill="#FFFFFF" fill-opacity="0.45" stroke="${out}" stroke-width="2.6"/>
  <line x1="105" y1="66" x2="115" y2="66" stroke="${out}" stroke-width="2.6"/>
  <circle cx="96" cy="66" r="2.8" fill="${out}"/>
  <circle cx="124" cy="66" r="2.8" fill="${out}"/>
  <path d="M102 82 Q110 88 118 82" fill="none" stroke="${out}" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Open Book Held Up -->
  <path d="M48 134 C72 126 96 130 110 140 C124 130 148 126 172 134 V192 C148 184 124 188 110 198 C96 188 72 184 48 192 Z" fill="#FFFBEB" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <line x1="110" y1="140" x2="110" y2="198" stroke="${out}" stroke-width="2.6"/>
  <rect x="44" y="186" width="132" height="12" rx="4" fill="${acc}" stroke="${out}" stroke-width="2.4"/>
  <circle cx="52" cy="160" r="9" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
  <circle cx="168" cy="160" r="9" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
</svg>`,
      };

    case 'char-toon-graduate':
      return {
        viewBox: '0 0 220 235',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 235">
  <ellipse cx="106" cy="220" rx="62" ry="10" fill="#94A3B8" opacity="0.25"/>
  <rect x="80" y="170" width="16" height="44" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <rect x="114" y="170" width="16" height="44" rx="8" fill="#1E293B" stroke="${out}" stroke-width="2.6"/>
  <!-- Gown -->
  <path d="M70 112 H140 L152 184 H58 Z" fill="${c1}" stroke="${out}" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="105,112 92,138 105,146 118,138" fill="${acc}" stroke="${out}" stroke-width="2"/>
  <!-- Diploma in hand -->
  <rect x="138" y="128" width="54" height="18" rx="7" fill="#FEF3C7" stroke="${out}" stroke-width="2.6" transform="rotate(-24 165 137)"/>
  <rect x="160" y="124" width="10" height="24" rx="2" fill="#EF4444" transform="rotate(-24 165 136)"/>
  <!-- Head + Mortarboard Cap -->
  <circle cx="105" cy="76" r="32" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <circle cx="94" cy="78" r="3.4" fill="${out}"/>
  <circle cx="116" cy="78" r="3.4" fill="${out}"/>
  <path d="M94 90 Q105 99 116 90" fill="none" stroke="${out}" stroke-width="2.8" stroke-linecap="round"/>
  <polygon points="105,14 156,36 105,58 54,36" fill="${c1}" stroke="${out}" stroke-width="2.8" stroke-linejoin="round"/>
  <path d="M78 46 V60 C78 66 132 66 132 60 V46 Z" fill="${c1}" stroke="${out}" stroke-width="2.4"/>
  <path d="M105 36 L146 48 V74" fill="none" stroke="${acc}" stroke-width="3.5" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-toon-teamwork':
      return {
        viewBox: '0 0 260 215',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 215">
  <ellipse cx="130" cy="200" rx="98" ry="10" fill="#94A3B8" opacity="0.25"/>
  <!-- Fist bump burst -->
  <polygon points="130,84 135,96 148,98 138,106 141,118 130,111 119,118 122,106 112,98 125,96" fill="#FACC15" stroke="${out}" stroke-width="2"/>
  <!-- Left Character -->
  <rect x="46" y="162" width="15" height="34" rx="7" fill="#1E293B" stroke="${out}" stroke-width="2.4"/>
  <rect x="70" y="162" width="15" height="34" rx="7" fill="#1E293B" stroke="${out}" stroke-width="2.4"/>
  <rect x="38" y="106" width="54" height="62" rx="20" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <path d="M88 122 L116 118" stroke="${c1}" stroke-width="14" stroke-linecap="round"/>
  <circle cx="120" cy="118" r="9" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
  <circle cx="65" cy="70" r="28" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M37 64 C40 40 90 40 93 64 C80 52 50 52 37 64 Z" fill="${out}"/>
  <circle cx="57" cy="72" r="3" fill="${out}"/>
  <circle cx="75" cy="72" r="3" fill="${out}"/>
  <path d="M58 82 Q66 88 74 82" fill="none" stroke="${out}" stroke-width="2.6" stroke-linecap="round"/>
  <!-- Right Character -->
  <rect x="175" y="162" width="15" height="34" rx="7" fill="#1E293B" stroke="${out}" stroke-width="2.4"/>
  <rect x="199" y="162" width="15" height="34" rx="7" fill="#1E293B" stroke="${out}" stroke-width="2.4"/>
  <rect x="168" y="106" width="54" height="62" rx="20" fill="${acc}" stroke="${out}" stroke-width="3"/>
  <path d="M172 122 L144 118" stroke="${acc}" stroke-width="14" stroke-linecap="round"/>
  <circle cx="140" cy="118" r="9" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
  <circle cx="195" cy="70" r="28" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <circle cx="195" cy="40" r="11" fill="${out}"/>
  <path d="M167 64 C170 40 220 40 223 64 C210 52 180 52 167 64 Z" fill="${out}"/>
  <circle cx="185" cy="72" r="3" fill="${out}"/>
  <circle cx="203" cy="72" r="3" fill="${out}"/>
  <path d="M186 82 Q194 88 202 82" fill="none" stroke="${out}" stroke-width="2.6" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-toon-meditate':
      return {
        viewBox: '0 0 220 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
  <ellipse cx="110" cy="202" rx="66" ry="9" fill="#94A3B8" opacity="0.25"/>
  <!-- Calm Aura -->
  <circle cx="110" cy="108" r="78" fill="${acc}" fill-opacity="0.18" stroke="${acc}" stroke-width="2.5" stroke-dasharray="8 6"/>
  <!-- Crossed Legs -->
  <ellipse cx="110" cy="172" rx="54" ry="18" fill="#1E293B" stroke="${out}" stroke-width="3"/>
  <!-- Torso & Arms -->
  <rect x="78" y="102" width="64" height="64" rx="22" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <path d="M80 122 L54 152 L72 164" fill="none" stroke="${c1}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M140 122 L166 152 L148 164" fill="none" stroke="${c1}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="72" cy="164" r="8" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
  <circle cx="148" cy="164" r="8" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
  <!-- Calm Head -->
  <circle cx="110" cy="64" r="32" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M78 58 C82 30 138 30 142 58 C128 44 92 44 78 58 Z" fill="${out}"/>
  <path d="M92 66 Q98 71 104 66 M116 66 Q122 71 128 66" fill="none" stroke="${out}" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M102 80 Q110 86 118 80" fill="none" stroke="${out}" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,
      };

    case 'char-toon-speech':
      return {
        viewBox: '0 0 240 225',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 225">
  <ellipse cx="116" cy="210" rx="82" ry="10" fill="#94A3B8" opacity="0.25"/>
  <!-- Speech Callout Bubble -->
  <path d="M108 24 H214 A18 18 0 0 1 232 42 V88 A18 18 0 0 1 214 106 H142 L118 124 L126 106 H108 A18 18 0 0 1 90 88 V42 A18 18 0 0 1 108 24 Z" fill="${acc}" stroke="${out}" stroke-width="3.2" stroke-linejoin="round"/>
  <text x="161" y="74" text-anchor="middle" fill="${out}" font-family="Outfit, sans-serif" font-weight="900" font-size="24">${(label || 'NOTE!').slice(0, 10)}</text>
  <!-- Character Peeking & Pointing to Bubble -->
  <rect x="52" y="164" width="15" height="40" rx="7" fill="#1E293B" stroke="${out}" stroke-width="2.5"/>
  <rect x="80" y="164" width="15" height="40" rx="7" fill="#1E293B" stroke="${out}" stroke-width="2.5"/>
  <rect x="42" y="110" width="60" height="60" rx="20" fill="${c1}" stroke="${out}" stroke-width="3"/>
  <path d="M98 126 L124 114" stroke="${c1}" stroke-width="14" stroke-linecap="round"/>
  <circle cx="126" cy="114" r="8" fill="${c2}" stroke="${out}" stroke-width="2.4"/>
  <circle cx="72" cy="74" r="30" fill="${c2}" stroke="${out}" stroke-width="3"/>
  <path d="M42 68 C46 42 98 42 102 68 C88 54 56 54 42 68 Z" fill="${out}"/>
  <circle cx="62" cy="76" r="3.2" fill="${out}"/>
  <circle cx="84" cy="76" r="3.2" fill="${out}"/>
  <path d="M64 87 Q73 94 82 87" fill="none" stroke="${out}" stroke-width="2.6" stroke-linecap="round"/>
</svg>`,
      };

    default: {
      const ext = renderExtendedDesignSvg(kind, c1, c2, acc, out, label, uid);
      if (ext) return ext;
      return {
        viewBox: '0 0 180 180',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><circle cx="90" cy="90" r="76" fill="${c1}" stroke="${out}" stroke-width="3"/></svg>`,
      };
    }
  }
}

function c3Fallback(v: string): string {
  return v || '#F59E0B';
}

export interface ShapeCatalogItem {
  kind: ShapeElement['shapeKind'];
  label: string;
  defaultWidth: number;
  defaultHeight: number;
}

export const SHAPE_CATALOG: ShapeCatalogItem[] = [
  { kind: 'rect', label: 'Rectangle', defaultWidth: 220, defaultHeight: 140 },
  { kind: 'rounded-rect', label: 'Rounded Card', defaultWidth: 220, defaultHeight: 140 },
  { kind: 'pill', label: 'Pill Tag', defaultWidth: 220, defaultHeight: 68 },
  { kind: 'ellipse', label: 'Circle / Oval', defaultWidth: 160, defaultHeight: 160 },
  { kind: 'triangle', label: 'Triangle', defaultWidth: 160, defaultHeight: 150 },
  { kind: 'diamond', label: 'Diamond', defaultWidth: 150, defaultHeight: 150 },
  { kind: 'star', label: '5-Point Star', defaultWidth: 160, defaultHeight: 160 },
  { kind: 'hexagon', label: 'Hexagon', defaultWidth: 160, defaultHeight: 150 },
  { kind: 'pentagon', label: 'Pentagon', defaultWidth: 160, defaultHeight: 155 },
  { kind: 'heart', label: 'Vector Heart', defaultWidth: 160, defaultHeight: 150 },
  { kind: 'badge-burst', label: '12-Point Seal', defaultWidth: 165, defaultHeight: 165 },
  { kind: 'speech-bubble', label: 'Speech Bubble', defaultWidth: 220, defaultHeight: 150 },
  { kind: 'ribbon-banner', label: 'Chevron Banner', defaultWidth: 250, defaultHeight: 88 },
  { kind: 'arrow', label: 'Block Arrow', defaultWidth: 190, defaultHeight: 68 },
  { kind: 'line', label: 'Hairline Rule', defaultWidth: 260, defaultHeight: 6 },
];

function extractGradientStops(css?: string): string[] {
  if (!css) return [];
  return css.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g) || [];
}

export function renderShapeSvgString(el: ShapeElement, uid: string): string {
  const w = Math.max(4, Math.round(el.width));
  const h = Math.max(4, Math.round(el.height));
  const stops = extractGradientStops(el.gradient);
  const hasGrad = stops.length >= 2;
  const fillAttr = hasGrad ? `url(#${uid}-shgrad)` : escapeXml(el.fill);
  const strokeAttr = el.strokeWidth > 0 ? escapeXml(el.stroke) : 'none';
  const sw = el.strokeWidth || 0;
  const defs = hasGrad
    ? `<defs><linearGradient id="${uid}-shgrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${escapeXml(stops[0])}"/><stop offset="100%" stop-color="${escapeXml(stops[stops.length - 1])}"/></linearGradient></defs>`
    : '';

  let body = '';
  switch (el.shapeKind) {
    case 'triangle':
      body = `<polygon points="${w / 2},${sw} ${w - sw},${h - sw} ${sw},${h - sw}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      break;
    case 'diamond':
      body = `<polygon points="${w / 2},${sw} ${w - sw},${h / 2} ${w / 2},${h - sw} ${sw},${h / 2}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      break;
    case 'star': {
      const cx = w / 2;
      const cy = h / 2;
      const rx = w / 2 - sw;
      const ry = h / 2 - sw;
      const pts: string[] = [];
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const rScale = i % 2 === 0 ? 1 : 0.42;
        pts.push(`${(cx + Math.cos(a) * rx * rScale).toFixed(1)},${(cy + Math.sin(a) * ry * rScale).toFixed(1)}`);
      }
      body = `<polygon points="${pts.join(' ')}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      break;
    }
    case 'hexagon':
      body = `<polygon points="${(w * 0.25).toFixed(1)},${sw} ${(w * 0.75).toFixed(1)},${sw} ${w - sw},${h / 2} ${(w * 0.75).toFixed(1)},${h - sw} ${(w * 0.25).toFixed(1)},${h - sw} ${sw},${h / 2}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      break;
    case 'pentagon':
      body = `<polygon points="${w / 2},${sw} ${w - sw},${(h * 0.38).toFixed(1)} ${(w * 0.81).toFixed(1)},${h - sw} ${(w * 0.19).toFixed(1)},${h - sw} ${sw},${(h * 0.38).toFixed(1)}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      break;
    case 'heart':
      body = `<path d="M50 88 C50 88 8 60 8 30 C8 15 20 6 33 6 C42 6 47 12 50 18 C53 12 58 6 67 6 C80 6 92 15 92 30 C92 60 50 88 50 88 Z" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw * (100 / Math.max(w, h))}" transform="scale(${w / 100} ${h / 100})"/>`;
      break;
    case 'badge-burst': {
      const cx = w / 2;
      const cy = h / 2;
      const rx = w / 2 - sw;
      const ry = h / 2 - sw;
      const pts: string[] = [];
      for (let i = 0; i < 24; i++) {
        const a = (i * Math.PI) / 12;
        const rScale = i % 2 === 0 ? 1 : 0.76;
        pts.push(`${(cx + Math.cos(a) * rx * rScale).toFixed(1)},${(cy + Math.sin(a) * ry * rScale).toFixed(1)}`);
      }
      body = `<polygon points="${pts.join(' ')}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      break;
    }
    case 'speech-bubble': {
      const r = Math.min(20, w * 0.14, h * 0.18);
      const bodyH = h * 0.78;
      body = `<path d="M${r} ${sw} H${w - r} Q${w - sw} ${sw} ${w - sw} ${r} V${bodyH - r} Q${w - sw} ${bodyH} ${w - r} ${bodyH} H${w * 0.44} L${w * 0.24} ${h - sw} L${w * 0.28} ${bodyH} H${r} Q${sw} ${bodyH} ${sw} ${bodyH - r} V${r} Q${sw} ${sw} ${r} ${sw} Z" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      break;
    }
    case 'ribbon-banner':
      body = `<polygon points="${sw},${sw} ${w - sw},${sw} ${w - Math.min(26, w * 0.12)},${h / 2} ${w - sw},${h - sw} ${sw},${h - sw} ${Math.min(26, w * 0.12)},${h / 2}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      break;
    case 'arrow':
      body = `<path d="M0 ${(h * 0.35).toFixed(1)} H${(w * 0.7).toFixed(1)} V${(h * 0.1).toFixed(1)} L${w} ${h / 2} L${(w * 0.7).toFixed(1)} ${(h * 0.9).toFixed(1)} V${(h * 0.65).toFixed(1)} H0 Z" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}"/>`;
      break;
    case 'ellipse':
      body = `<ellipse cx="${w / 2}" cy="${h / 2}" rx="${Math.max(1, w / 2 - sw)}" ry="${Math.max(1, h / 2 - sw)}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}"/>`;
      break;
    case 'pill':
      body = `<rect x="${sw / 2}" y="${sw / 2}" width="${Math.max(2, w - sw)}" height="${Math.max(2, h - sw)}" rx="${h / 2}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}"/>`;
      break;
    case 'line':
      body = `<rect x="0" y="${Math.max(0, h / 2 - 2)}" width="${w}" height="${Math.max(2, Math.min(8, h))}" fill="${fillAttr}"/>`;
      break;
    case 'rounded-rect':
      body = `<rect x="${sw / 2}" y="${sw / 2}" width="${Math.max(2, w - sw)}" height="${Math.max(2, h - sw)}" rx="${Math.min(el.borderRadius || 12, h / 2)}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}"/>`;
      break;
    case 'rect':
    default:
      body = `<rect x="${sw / 2}" y="${sw / 2}" width="${Math.max(2, w - sw)}" height="${Math.max(2, h - sw)}" rx="${Math.min(el.borderRadius || 0, h / 2)}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}"/>`;
      break;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${defs}${body}</svg>`;
}

export function renderRetroTvSvgString(props: Record<string, unknown>, rawUid: string): string {
  const uid = rawUid.replace(/[^a-zA-Z0-9_-]/g, '') || 'tv';
  const casing = escapeXml(String(props.casingColor || '#DCD9D0'));
  const bezel = escapeXml(String(props.bezelColor || '#A9B0B9'));
  const accent = escapeXml(String(props.accentColor || '#3B6FD8'));
  const brand = escapeXml(String(props.brandLabel || 'VELLUM-TV').slice(0, 14));

  const louvers = [372, 386, 400, 414, 428, 442, 456]
    .map((sy) => `<rect x="518" y="${sy}" width="90" height="7" rx="3.5" fill="#475569" opacity="0.72"/>`)
    .join('');
  const btns = [462, 492, 522, 552]
    .map((bx) => `<rect x="${bx}" y="490" width="22" height="16" rx="4" fill="#94A3B8" stroke="#64748B" stroke-width="1"/>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 540">
  <defs>
    <linearGradient id="${uid}-casing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F2F0EA"/><stop offset="45%" stop-color="${casing}"/><stop offset="100%" stop-color="#A8A49B"/>
    </linearGradient>
    <linearGradient id="${uid}-bezel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D8DEE6"/><stop offset="50%" stop-color="${bezel}"/><stop offset="100%" stop-color="#7C8592"/>
    </linearGradient>
    <linearGradient id="${uid}-chrome" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7C8594"/><stop offset="45%" stop-color="#F8FAFC"/><stop offset="100%" stop-color="#64748B"/>
    </linearGradient>
  </defs>
  <path d="M274 96 L186 18" stroke="url(#${uid}-chrome)" stroke-width="6" stroke-linecap="round"/>
  <path d="M358 96 L448 14" stroke="url(#${uid}-chrome)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="184" cy="17" r="8" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
  <circle cx="449" cy="13" r="8" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
  <rect x="248" y="82" width="136" height="18" rx="8" fill="#94A3B8" stroke="#64748B" stroke-width="1.5"/>
  <rect x="14" y="92" width="632" height="434" rx="34" fill="url(#${uid}-casing)" stroke="#8B8880" stroke-width="2.5"/>
  <rect x="70" y="524" width="68" height="12" rx="5" fill="#6B7280"/>
  <rect x="520" y="524" width="68" height="12" rx="5" fill="#6B7280"/>
  <rect x="32" y="110" width="454" height="368" rx="28" fill="url(#${uid}-bezel)" stroke="#64748B" stroke-width="2"/>
  <rect x="42" y="120" width="432" height="346" rx="24" fill="#111827" stroke="#334155" stroke-width="3"/>
  <rect x="500" y="116" width="126" height="360" rx="18" fill="rgba(15, 23, 42, 0.06)" stroke="rgba(100, 116, 139, 0.35)" stroke-width="1.5"/>
  <circle cx="563" cy="196" r="44" fill="#CBD5E1" stroke="#64748B" stroke-width="2.5"/>
  <circle cx="563" cy="196" r="34" fill="#334155" stroke="#94A3B8" stroke-width="2"/>
  <rect x="556" y="162" width="14" height="68" rx="5" fill="#94A3B8" transform="rotate(-24 563 196)"/>
  <circle cx="563" cy="196" r="9" fill="${accent}"/>
  <circle cx="563" cy="306" r="36" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/>
  <circle cx="563" cy="306" r="26" fill="#475569" stroke="#CBD5E1" stroke-width="1.5"/>
  <line x1="563" y1="283" x2="563" y2="298" stroke="#F8FAFC" stroke-width="3.5" stroke-linecap="round"/>
  ${louvers}
  <rect x="44" y="488" width="140" height="22" rx="6" fill="#1E293B"/>
  <text x="114" y="503" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="700" font-family="monospace" letter-spacing="1.6">${brand}</text>
  <circle cx="212" cy="499" r="5" fill="${accent}"/>
  ${btns}
</svg>`;
}

export function renderFlipCalendarSvgString(props: Record<string, unknown>, rawUid: string): string {
  const uid = rawUid.replace(/[^a-zA-Z0-9_-]/g, '') || 'cal';
  const month = escapeXml(String(props.month || 'JAN').toUpperCase().slice(0, 6));
  const day = escapeXml(String(props.day || '05').slice(0, 4));
  const yearNote = escapeXml(String(props.yearNote || 'BIRTHDAY').slice(0, 14));
  const headerColor = escapeXml(String(props.headerColor || '#3B6FD8'));
  const paperColor = escapeXml(String(props.paperColor || '#FFFFFF'));
  const accent = escapeXml(String(props.accentColor || '#2957B8'));

  const rings = [36, 72, 108, 144]
    .map((rx) => `<rect x="${rx}" y="4" width="10" height="26" rx="5" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184 192">
  <defs>
    <linearGradient id="${uid}-calhdr" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${headerColor}"/><stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
  </defs>
  <rect x="8" y="16" width="168" height="168" rx="18" fill="${paperColor}" stroke="#CBD5E1" stroke-width="2.5"/>
  <path d="M8 34 A18 18 0 0 1 26 16 H158 A18 18 0 0 1 176 34 V74 H8 Z" fill="url(#${uid}-calhdr)"/>
  ${rings}
  <text x="92" y="58" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="800" font-size="20" letter-spacing="3">${month}</text>
  <text x="92" y="138" text-anchor="middle" fill="${accent}" font-family="sans-serif" font-weight="900" font-size="60">${day}</text>
  <text x="92" y="164" text-anchor="middle" fill="${accent}" font-family="sans-serif" font-weight="700" font-size="11" letter-spacing="2">${yearNote}</text>
</svg>`;
}

export function renderY2kStickerSvgString(props: Record<string, unknown>, rawUid: string): string {
  const uid = rawUid.replace(/[^a-zA-Z0-9_-]/g, '') || 'y2k';
  const kind = String(props.stickerKind || 'vinyl-disc');
  const label = escapeXml(String(props.label || 'BDAY MIX').slice(0, 12));
  const tint = escapeXml(String(props.tintColor || '#254C9E'));
  const accent = escapeXml(String(props.accentColor || '#78B7FF'));

  if (kind === 'vinyl-disc') {
    const rings = [88, 76, 64, 52]
      .map((r) => `<circle cx="110" cy="110" r="${r}" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>`)
      .join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
      <defs><radialGradient id="${uid}-vn" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#1E293B"/><stop offset="72%" stop-color="#090D16"/><stop offset="100%" stop-color="#020617"/></radialGradient></defs>
      <circle cx="110" cy="110" r="102" fill="url(#${uid}-vn)" stroke="#475569" stroke-width="2"/>
      ${rings}
      <circle cx="110" cy="110" r="36" fill="${accent}" stroke="#FFFFFF" stroke-width="2"/>
      <text x="110" y="99" text-anchor="middle" fill="#0F172A" font-size="9" font-weight="800">${label}</text>
      <text x="110" y="130" text-anchor="middle" fill="#0F172A" font-size="8" font-weight="700">33 RPM</text>
      <circle cx="110" cy="110" r="7" fill="#FFFFFF" stroke="#1E293B" stroke-width="2"/>
    </svg>`;
  }
  if (kind === 'camcorder') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 170">
      <rect x="96" y="16" width="102" height="58" rx="9" fill="#1E293B" stroke="#CBD5E1" stroke-width="3" transform="rotate(-8 147 45)"/>
      <rect x="106" y="24" width="82" height="42" rx="4" fill="${accent}" opacity="0.85" transform="rotate(-8 147 45)"/>
      <rect x="46" y="54" width="166" height="92" rx="18" fill="#CBD5E1" stroke="#334155" stroke-width="2.5"/>
      <rect x="148" y="64" width="52" height="72" rx="12" fill="${tint}"/>
      <circle cx="64" cy="100" r="44" fill="#334155" stroke="#E2E8F0" stroke-width="4"/>
      <circle cx="64" cy="100" r="32" fill="#0F172A" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="64" cy="100" r="20" fill="#1E3A8A"/>
      <circle cx="55" cy="90" r="7" fill="#FFFFFF" opacity="0.7"/>
      <circle cx="182" cy="78" r="5" fill="#EF4444"/>
    </svg>`;
  }
  if (kind === 'rotary-phone') {
    const holes = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324]
      .map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return `<circle cx="${(110 + Math.cos(rad) * 30).toFixed(1)}" cy="${(132 + Math.sin(rad) * 30).toFixed(1)}" r="4.5" fill="#1E293B"/>`;
      })
      .join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200">
      <path d="M28 164 C10 144 26 126 16 108 C6 90 26 78 24 60" fill="none" stroke="#1E293B" stroke-width="6" stroke-linecap="round"/>
      <path d="M40 74 L178 74 L204 166 C206 178 196 186 184 186 L34 186 C22 186 14 176 18 164 Z" fill="${tint}" stroke="#E2E8F0" stroke-width="2"/>
      <path d="M20 50 C52 14 166 14 198 50 C208 62 198 78 182 76 L158 72 L154 56 C126 48 92 48 64 56 L60 72 L36 76 C20 78 10 62 20 50 Z" fill="${tint}" stroke="#CBD5E1" stroke-width="2.5"/>
      <circle cx="110" cy="132" r="40" fill="#E2E8F0" stroke="#475569" stroke-width="2.5"/>
      <circle cx="110" cy="132" r="20" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.5"/>
      ${holes}
    </svg>`;
  }
  if (kind === 'phone-handset') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 220">
      <path d="M120 180 C142 192 128 206 146 216" fill="none" stroke="#1E3A8A" stroke-width="5" stroke-linecap="round"/>
      <path d="M44 26 C64 16 86 24 90 46 C92 60 80 68 74 74 C66 96 76 124 96 142 C104 140 116 138 128 148 C142 162 136 186 118 194 C94 204 54 176 34 128 C14 80 20 38 44 26 Z" fill="${tint}" stroke="#FFFFFF" stroke-width="2.5"/>
    </svg>`;
  }
  if (kind === 'denim-star') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
      <polygon points="70,8 88,48 132,52 98,82 108,126 70,102 32,126 42,82 8,52 52,48" fill="${tint}" stroke="#1E3A8A" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="70,18 84,50 119,54 92,78 100,113 70,94 40,113 48,78 21,54 56,50" fill="none" stroke="#DBEAFE" stroke-width="2" stroke-dasharray="5 4"/>
    </svg>`;
  }
  if (kind === 'chrome-star') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
      <defs><linearGradient id="${uid}-cs" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="50%" stop-color="#CBD5E1"/><stop offset="100%" stop-color="#64748B"/></linearGradient></defs>
      <polygon points="70,6 88,48 134,52 99,82 110,128 70,103 30,128 41,82 6,52 52,48" fill="url(#${uid}-cs)" stroke="#FFFFFF" stroke-width="2.5" stroke-linejoin="round"/>
    </svg>`;
  }
  if (kind === 'glass-heart') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
      <path d="M70 122 C70 122 14 88 14 48 C14 27 30 14 48 14 C60 14 67 21 70 28 C73 21 80 14 92 14 C110 14 126 27 126 48 C126 88 70 122 70 122 Z" fill="${accent}" fill-opacity="0.6" stroke="#FFFFFF" stroke-width="2.5"/>
      <ellipse cx="44" cy="40" rx="12" ry="7" fill="#FFFFFF" opacity="0.7" transform="rotate(-30 44 40)"/>
    </svg>`;
  }
  if (kind === 'soap-bubble') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r="62" fill="${accent}" fill-opacity="0.25" stroke="#FFFFFF" stroke-width="2.5"/>
      <ellipse cx="46" cy="40" rx="18" ry="9" fill="#FFFFFF" opacity="0.75" transform="rotate(-32 46 40)"/>
    </svg>`;
  }
  if (kind === 'sparkle-burst') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <path d="M60 4 L72 48 L116 60 L72 72 L60 116 L48 72 L4 60 L48 48 Z" fill="#FFFFFF" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round"/>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 200" preserveAspectRatio="none">
    <defs><linearGradient id="${uid}-md" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#8CE562"/><stop offset="50%" stop-color="#52B73C"/><stop offset="100%" stop-color="#267324"/></linearGradient></defs>
    <path d="M0 90 Q240 15 500 72 T960 45 L960 200 L0 200 Z" fill="url(#${uid}-md)"/>
    <path d="M0 122 Q300 68 620 118 T960 92 L960 200 L0 200 Z" fill="rgba(255,255,255,0.14)"/>
  </svg>`;
}

export function renderSlideBackgroundSvgString(slide: Slide, width: number, height: number, fallbackBg: string): string | null {
  const hasGradient = slide.background.type === 'gradient' && slide.background.gradient;
  const hasPattern = slide.background.pattern && slide.background.pattern !== 'none';
  if (!hasGradient && !hasPattern) return null;

  const stops = extractGradientStops(slide.background.gradient);
  const cStart = stops[0] || slide.background.color || fallbackBg;
  const cEnd = stops[stops.length - 1] || slide.background.color || fallbackBg;
  const patColor = escapeXml(slide.background.patternColor || '#191B1F');
  const patOp = slide.background.patternOpacity ?? 0.16;

  let patternEl = '';
  if (slide.background.pattern === 'checkerboard') {
    patternEl = `<defs><pattern id="bgpat" width="64" height="64" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="${patColor}" fill-opacity="${patOp}"/><rect x="32" y="32" width="32" height="32" fill="${patColor}" fill-opacity="${patOp}"/></pattern></defs><rect width="${width}" height="${height}" fill="url(#bgpat)"/>`;
  } else if (slide.background.pattern === 'dots') {
    patternEl = `<defs><pattern id="bgpat" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="1.4" fill="${patColor}" fill-opacity="${patOp}"/></pattern></defs><rect width="${width}" height="${height}" fill="url(#bgpat)"/>`;
  } else if (slide.background.pattern === 'grid') {
    patternEl = `<defs><pattern id="bgpat" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="${patColor}" stroke-opacity="${patOp}" stroke-width="1"/></pattern></defs><rect width="${width}" height="${height}" fill="url(#bgpat)"/>`;
  } else if (slide.background.pattern === 'editorial-lines') {
    patternEl = `<defs><pattern id="bgpat" width="64" height="36" patternUnits="userSpaceOnUse"><line x1="0" y1="35" x2="64" y2="35" stroke="${patColor}" stroke-opacity="${patOp}" stroke-width="1"/></pattern></defs><rect width="${width}" height="${height}" fill="url(#bgpat)"/>`;
  } else if (slide.background.pattern === 'diagonal') {
    patternEl = `<defs><pattern id="bgpat" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="22" stroke="${patColor}" stroke-opacity="${patOp}" stroke-width="1.2"/></pattern></defs><rect width="${width}" height="${height}" fill="url(#bgpat)"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bggrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${escapeXml(cStart)}"/>
      <stop offset="100%" stop-color="${escapeXml(cEnd)}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="${hasGradient ? 'url(#bggrad)' : escapeXml(slide.background.color || fallbackBg)}"/>
  ${patternEl}
</svg>`;
}

export function renderRetroOsDialogSvgString(
  props: Record<string, unknown>,
  rawUid: string,
  width = 420,
  height = 220
): string {
  const uid = rawUid.replace(/[^a-zA-Z0-9_-]/g, '') || 'osdlg';
  const osStyle = String(props.osStyle || 'win98-classic');
  const variant = String(props.dialogVariant || 'error');
  const title = escapeXml(String(props.title || 'SYSTEM ERROR'));
  const message = String(props.message || 'ERROR_NOT_ENOUGH_MEMORY');
  const primaryBtn = escapeXml(String(props.primaryButton || 'OK'));
  const secondaryBtn = escapeXml(String(props.secondaryButton || '').trim());
  const progress = Math.max(0, Math.min(100, Number(props.progressPercent ?? 55)));
  const titleBarColor = escapeXml(
    String(props.titleBarColor || (osStyle === 'winxp-luna' ? '#0054E3' : '#000080'))
  );
  const bodyBg = escapeXml(
    String(props.bodyBgColor || (osStyle === 'winxp-luna' ? '#ECE9D8' : '#C0C0C0'))
  );
  const textColor = escapeXml(String(props.textColor || '#111827'));

  const w = Math.max(240, Math.round(width));
  const h = Math.max(140, Math.round(height));
  const isXp = osStyle === 'winxp-luna';
  const hdrH = 30;
  const rx = isXp ? 8 : 0;

  let badgeSvg = '';
  const iconCx = 56;
  const iconCy = Math.round(hdrH + (h - hdrH - 52) / 2);
  if (variant === 'warning') {
    badgeSvg = `
      <polygon points="${iconCx},${iconCy - 20} ${iconCx + 22},${iconCy + 18} ${iconCx - 22},${iconCy + 18}" fill="#FACC15" stroke="#111827" stroke-width="2" stroke-linejoin="round"/>
      <rect x="${iconCx - 2}" y="${iconCy - 8}" width="4" height="14" rx="1" fill="#111827"/>
      <circle cx="${iconCx}" cy="${iconCy + 12}" r="2.2" fill="#111827"/>
    `;
  } else if (variant === 'success') {
    badgeSvg = `
      <circle cx="${iconCx}" cy="${iconCy}" r="20" fill="#16A34A" stroke="#14532D" stroke-width="1.5"/>
      <path d="M${iconCx - 9} ${iconCy} L${iconCx - 2} ${iconCy + 7} L${iconCx + 10} ${iconCy - 7}" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  } else if (variant === 'info') {
    badgeSvg = `
      <circle cx="${iconCx}" cy="${iconCy}" r="20" fill="#2563EB" stroke="#1E3A8A" stroke-width="1.5"/>
      <circle cx="${iconCx}" cy="${iconCy - 8}" r="2.4" fill="#FFFFFF"/>
      <rect x="${iconCx - 2.2}" y="${iconCy - 2}" width="4.4" height="13" rx="1.5" fill="#FFFFFF"/>
    `;
  } else if (variant === 'progress') {
    const barW = Math.max(120, w - 64);
    const fillW = Math.round((barW - 4) * (progress / 100));
    badgeSvg = `
      <rect x="32" y="${iconCy + 14}" width="${barW}" height="18" fill="#FFFFFF" stroke="#808080" stroke-width="1.5"/>
      <rect x="34" y="${iconCy + 16}" width="${fillW}" height="14" fill="${titleBarColor}"/>
    `;
  } else {
    badgeSvg = `
      <circle cx="${iconCx}" cy="${iconCy}" r="20" fill="#DC2626" stroke="#7F1D1D" stroke-width="1.5"/>
      <path d="M${iconCx - 8} ${iconCy - 8} L${iconCx + 8} ${iconCy + 8} M${iconCx + 8} ${iconCy - 8} L${iconCx - 8} ${iconCy + 8}" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    `;
  }

  const msgLines = message.split('\n').slice(0, 4);
  const textX = variant === 'progress' ? 32 : 96;
  const startTextY = variant === 'progress' ? hdrH + 34 : iconCy - ((msgLines.length - 1) * 9) + 4;
  const msgSvg = msgLines
    .map(
      (line, idx) =>
        `<text x="${textX}" y="${startTextY + idx * 18}" fill="${textColor}" font-family="sans-serif" font-size="13" font-weight="500">${escapeXml(line)}</text>`
    )
    .join('');

  const btnW = 92;
  const btnH = 28;
  const btnY = h - 42;
  const hasSecondary = secondaryBtn.length > 0;
  const btn1X = hasSecondary ? Math.round(w / 2 - btnW - 8) : Math.round((w - btnW) / 2);
  const btn2X = Math.round(w / 2 + 8);

  const renderBtn = (bx: number, label: string) => `
    <rect x="${bx}" y="${btnY}" width="${btnW}" height="${btnH}" rx="${isXp ? 4 : 0}" fill="${isXp ? '#F8FAFC' : bodyBg}" stroke="#404040" stroke-width="1.5"/>
    <line x1="${bx + 1}" y1="${btnY + 1}" x2="${bx + btnW - 1}" y2="${btnY + 1}" stroke="#FFFFFF" stroke-width="1.5"/>
    <line x1="${bx + 1}" y1="${btnY + 1}" x2="${bx + 1}" y2="${btnY + btnH - 1}" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="${bx + btnW / 2}" y="${btnY + 18}" text-anchor="middle" fill="${textColor}" font-family="sans-serif" font-size="12" font-weight="600">${label}</text>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="${uid}-hdr" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${titleBarColor}"/>
      <stop offset="100%" stop-color="${isXp ? '#3B8CF7' : '#1084D0'}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="${bodyBg}" stroke="${isXp ? '#003C9D' : '#404040'}" stroke-width="2"/>
  <line x1="2" y1="2" x2="${w - 2}" y2="2" stroke="#FFFFFF" stroke-width="2"/>
  <line x1="2" y1="2" x2="2" y2="${h - 2}" stroke="#FFFFFF" stroke-width="2"/>
  <rect x="4" y="4" width="${w - 8}" height="${hdrH - 4}" rx="${isXp ? 4 : 0}" fill="url(#${uid}-hdr)"/>
  <text x="14" y="22" fill="#FFFFFF" font-family="sans-serif" font-size="12.5" font-weight="700">${title}</text>
  <rect x="${w - 50}" y="8" width="16" height="16" rx="${isXp ? 2 : 0}" fill="${isXp ? '#2563EB' : bodyBg}" stroke="${isXp ? '#FFFFFF' : '#404040'}" stroke-width="1"/>
  <line x1="${w - 46}" y1="19" x2="${w - 38}" y2="19" stroke="${isXp ? '#FFFFFF' : '#111827'}" stroke-width="2"/>
  <rect x="${w - 30}" y="8" width="18" height="16" rx="${isXp ? 2 : 0}" fill="${isXp ? '#DC2626' : bodyBg}" stroke="${isXp ? '#FFFFFF' : '#404040'}" stroke-width="1"/>
  <path d="M${w - 25} 12 L${w - 17} 20 M${w - 17} 12 L${w - 25} 20" stroke="${isXp ? '#FFFFFF' : '#111827'}" stroke-width="1.8" stroke-linecap="round"/>
  ${badgeSvg}
  ${msgSvg}
  ${renderBtn(btn1X, primaryBtn)}
  ${hasSecondary ? renderBtn(btn2X, secondaryBtn) : ''}
</svg>`;
}

