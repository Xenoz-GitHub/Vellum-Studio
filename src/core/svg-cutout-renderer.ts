import type { ShapeElement, Slide } from './schema';

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
    | 'Celebration'
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
    default:
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
  }
}

export interface IconCatalogDef {
  id: string;
  label: string;
  category: 'Social Platforms' | 'Creative & UI' | 'Awards & Status' | 'Media & Tech';
  viewBox?: string;
  fillRule?: 'evenodd' | 'nonzero';
  mode: 'stroke' | 'fill';
  paths: string[];
}

export const ICON_CATALOG: IconCatalogDef[] = [
  // 16 Social Platforms
  {
    id: 'social-instagram',
    label: 'Instagram',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: [
      'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z',
      'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z',
      'M17.5 6.5h.01',
    ],
  },
  {
    id: 'social-tiktok',
    label: 'TikTok',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: ['M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5'],
  },
  {
    id: 'social-youtube',
    label: 'YouTube',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: [
      'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z',
      'M9.75 15.02 15.5 12 9.75 8.98v6.04z',
    ],
  },
  {
    id: 'social-x',
    label: 'X / Twitter',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: ['M4 4l16 16', 'M20 4L4 20', 'M4 4h4l12 16h-4'],
  },
  {
    id: 'social-facebook',
    label: 'Facebook',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: ['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'],
  },
  {
    id: 'social-linkedin',
    label: 'LinkedIn',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: [
      'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z',
      'M2 9h4v12H2z',
      'M4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
    ],
  },
  {
    id: 'social-discord',
    label: 'Discord',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: [
      'M9 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
      'M15 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
      'M7.5 7.5c3.5-1 5.5-1 9 0',
      'M7 16.5c3.5 1 6.5 1 10 0',
      'M15.5 17c0 1 1.5 3 2 3 1.5 0 2.8-1.7 3.5-3.5 0-4-1.5-8.5-3.5-10.5-1.3-.7-2.7-1-4-1l-.5 1.5',
      'M8.5 17c0 1-1.5 3-2 3-1.5 0-2.8-1.7-3.5-3.5 0-4 1.5-8.5 3.5-10.5 1.3-.7 2.7-1 4-1l.5 1.5',
    ],
  },
  {
    id: 'social-twitch',
    label: 'Twitch',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: ['M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7'],
  },
  {
    id: 'social-spotify',
    label: 'Spotify',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: [
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
      'M7.5 9.5c3-.8 6.5-.6 9.5.6',
      'M8 12.8c2.6-.6 5.4-.4 7.8.6',
      'M8.8 15.8c2-.4 4.2-.2 6 .5',
    ],
  },
  {
    id: 'social-github',
    label: 'GitHub',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: [
      'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
    ],
  },
  {
    id: 'social-pinterest',
    label: 'Pinterest',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: [
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
      'M8 20l4-9',
      'M10.7 14c.437 1.263 1.43 2 2.55 2 2.071 0 3.75-1.554 3.75-4a5 5 0 1 0-9.7 1.7',
    ],
  },
  {
    id: 'social-threads',
    label: 'Threads',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: [
      'M19 12a7 7 0 1 0-7 7c2.8 0 5-1.2 6-3',
      'M15.5 11.5c0-2-1.5-3.5-3.5-3.5s-3.5 1.5-3.5 3.5S10 15 12 15s3.5-1.5 3.5-3.5zm0 0v2a2 2 0 0 0 4 0v-1.5',
    ],
  },
  {
    id: 'social-whatsapp',
    label: 'WhatsApp',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: [
      'M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21',
      'M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1',
    ],
  },
  {
    id: 'social-telegram',
    label: 'Telegram',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: ['M21 5L2 12.5l7 1.5M21 5l-2.5 15L9 14m12-9L9 14m0 0v5l3.5-3'],
  },
  {
    id: 'social-snapchat',
    label: 'Snapchat',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: [
      'M12 3a5 5 0 0 0-5 5v3c-1 .4-2 .5-2 1.3s1 .9 1.5 1.1c-.4 1.4-2 2.4-3.5 2.8.8.8 2 1.2 3 1.4.4.8 1.2 1.4 2 1.4 1.3 0 2.2-.8 4-.8s2.7.8 4 .8c.8 0 1.6-.6 2-1.4 1-.2 2.2-.6 3-1.4-1.5-.4-3.1-1.4-3.5-2.8.5-.2 1.5-.3 1.5-1.1s-1-.9-2-1.3V8a5 5 0 0 0-5-5z',
    ],
  },
  {
    id: 'social-dribbble',
    label: 'Dribbble',
    category: 'Social Platforms',
    mode: 'stroke',
    paths: [
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
      'M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94',
      'M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32',
      'M8.56 2.75c4.37 6 6 9.42 8 17.72',
    ],
  },

  // 38 Creative, Award & UI Symbols (Total: 54 icons)
  {
    id: 'star',
    label: 'Star',
    category: 'Awards & Status',
    mode: 'stroke',
    paths: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  },
  {
    id: 'sparkles',
    label: 'Sparkles',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: [
      'M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z',
      'M5 3v4M3 5h4M19 17v4M17 19h4',
    ],
  },
  {
    id: 'heart',
    label: 'Heart',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'],
  },
  {
    id: 'flame',
    label: 'Flame',
    category: 'Awards & Status',
    mode: 'stroke',
    paths: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'],
  },
  {
    id: 'zap',
    label: 'Bolt',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  },
  {
    id: 'crown',
    label: 'Crown',
    category: 'Awards & Status',
    mode: 'stroke',
    paths: ['M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14'],
  },
  {
    id: 'award',
    label: 'Award',
    category: 'Awards & Status',
    mode: 'stroke',
    paths: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'trophy',
    label: 'Trophy',
    category: 'Awards & Status',
    mode: 'stroke',
    paths: [
      'M6 9H4.5a2.5 2.5 0 0 1 0-5H6',
      'M18 9h1.5a2.5 2.5 0 0 0 0-5H18',
      'M4 22h16',
      'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22',
      'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22',
      'M18 2H6v7a6 6 0 0 0 12 0V2Z',
    ],
  },
  {
    id: 'check-badge',
    label: 'Verified Badge',
    category: 'Awards & Status',
    mode: 'stroke',
    paths: [
      'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z',
      'M9 12l2 2 4-4',
    ],
  },
  {
    id: 'bell',
    label: 'Bell',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
  },
  {
    id: 'megaphone',
    label: 'Megaphone',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M3 11l18-5v12L3 14v-3z', 'M11.6 16.8a3 3 0 1 1-5.8-1.6'],
  },
  {
    id: 'music',
    label: 'Music Note',
    category: 'Media & Tech',
    mode: 'stroke',
    paths: ['M9 18V5l12-2v13', 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', 'M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'],
  },
  {
    id: 'headphones',
    label: 'Headphones',
    category: 'Media & Tech',
    mode: 'stroke',
    paths: ['M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3'],
  },
  {
    id: 'camera',
    label: 'Camera',
    category: 'Media & Tech',
    mode: 'stroke',
    paths: [
      'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z',
      'M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    ],
  },
  {
    id: 'film',
    label: 'Film Frame',
    category: 'Media & Tech',
    mode: 'stroke',
    paths: [
      'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z',
      'M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5',
    ],
  },
  {
    id: 'mic',
    label: 'Microphone',
    category: 'Media & Tech',
    mode: 'stroke',
    paths: ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v3'],
  },
  {
    id: 'globe',
    label: 'Globe',
    category: 'Media & Tech',
    mode: 'stroke',
    paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M2 12h20', 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20'],
  },
  {
    id: 'map-pin',
    label: 'Location Pin',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  },
  {
    id: 'calendar',
    label: 'Calendar',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z', 'M16 2v4M8 2v4M3 10h18'],
  },
  {
    id: 'clock',
    label: 'Clock',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 6v6l4 2'],
  },
  {
    id: 'mail',
    label: 'Envelope',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'M22 6l-10 7L2 6'],
  },
  {
    id: 'send',
    label: 'Paper Plane',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M22 2L11 13', 'M22 2l-7 20-4-9-9-4 20-7z'],
  },
  {
    id: 'link',
    label: 'Chain Link',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
  },
  {
    id: 'qr-code',
    label: 'QR Matrix',
    category: 'Media & Tech',
    mode: 'stroke',
    paths: [
      'M3 3h5v5H3zM16 3h5v5h-5zM3 16h5v5H3z',
      'M21 16h-3a2 2 0 0 0-2 2v3',
      'M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1',
    ],
  },
  {
    id: 'lock',
    label: 'Lock',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z', 'M7 11V7a5 5 0 0 1 10 0v4'],
  },
  {
    id: 'shield',
    label: 'Shield',
    category: 'Awards & Status',
    mode: 'stroke',
    paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M9 12l2 2 4-4'],
  },
  {
    id: 'rocket',
    label: 'Rocket',
    category: 'Awards & Status',
    mode: 'stroke',
    paths: [
      'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
      'M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
      'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
    ],
  },
  {
    id: 'compass',
    label: 'Compass',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z'],
  },
  {
    id: 'target',
    label: 'Target',
    category: 'Awards & Status',
    mode: 'stroke',
    paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z', 'M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'],
  },
  {
    id: 'trending-up',
    label: 'Growth Curve',
    category: 'Awards & Status',
    mode: 'stroke',
    paths: ['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6'],
  },
  {
    id: 'gift',
    label: 'Gift Box',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: [
      'M20 12v10H4V12M2 7h20v5H2zM12 22V7',
      'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z',
      'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
    ],
  },
  {
    id: 'party',
    label: 'Confetti Cone',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M5.8 11.3L2 22l10.7-3.79', 'M4 3h.01M22 8h.01M15 2h.01M22 20h.01', 'M14 10l-4.5 4.5M9 5l5 5'],
  },
  {
    id: 'sun',
    label: 'Sunburst',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: [
      'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
      'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41',
    ],
  },
  {
    id: 'moon',
    label: 'Crescent Moon',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z'],
  },
  {
    id: 'leaf',
    label: 'Botanical Leaf',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z', 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'],
  },
  {
    id: 'coffee',
    label: 'Coffee Cup',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M17 8h1a4 4 0 1 1 0 8h-1', 'M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z', 'M6 2v2M10 2v2M14 2v2'],
  },
  {
    id: 'smile',
    label: 'Smiley Face',
    category: 'Creative & UI',
    mode: 'stroke',
    paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M8 14s1.5 2 4 2 4-2 4-2', 'M9 9h.01M15 9h.01'],
  },
];

export function renderIconSvgString(iconName: string, color: string, strokeWidth = 1.9): string {
  const def = ICON_CATALOG.find((ic) => ic.id === iconName || ic.label.toLowerCase() === iconName.toLowerCase());
  const paths = def?.paths || [
    'M12 2l9 4.5v11L12 22l-9-4.5v-11L12 2z',
    'M12 22V11',
    'M21 6.5L12 11 3 6.5',
  ];
  const pathEls = paths
    .map((d) =>
      def?.mode === 'fill'
        ? `<path d="${d}" fill="${escapeXml(color)}"/>`
        : `<path d="${d}" fill="none" stroke="${escapeXml(color)}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${pathEls}</svg>`;
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
