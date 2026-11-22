import type { CutoutItemDef } from './svg-cutout-renderer';

function esc(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const HERITAGE_VINTAGE_CATALOG: CutoutItemDef[] = [
  // ==================== 16 VINTAGE & FLOURISHES ====================
  {
    kind: 'vint-ribbon-scroll-arch',
    name: 'Engraved Arched Ribbon',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'ribbon', 'banner', 'scroll', 'calligraphy', 'engraved', 'header'],
    defaultWidth: 360,
    defaultHeight: 140,
    defaultProps: {
      stickerKind: 'vint-ribbon-scroll-arch',
      label: 'HERITAGE',
      primaryColor: '#F5EFE2',
      secondaryColor: '#D6C7AE',
      accentColor: '#7C5836',
      outlineColor: '#3E2C1E',
    },
  },
  {
    kind: 'vint-curled-manuscript',
    name: 'Curled Parchment Scroll',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'scroll', 'parchment', 'manuscript', 'paper', 'history', 'ribbon'],
    defaultWidth: 260,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'vint-curled-manuscript',
      label: 'PROCLAMATION',
      primaryColor: '#F5ECD8',
      secondaryColor: '#D9C39E',
      accentColor: '#8B2635',
      outlineColor: '#4A3525',
    },
  },
  {
    kind: 'vint-tied-scroll',
    name: 'Tied Red-Ribbon Scroll',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'scroll', 'tied', 'ribbon', 'history', 'antique', 'academia'],
    defaultWidth: 240,
    defaultHeight: 140,
    defaultProps: {
      stickerKind: 'vint-tied-scroll',
      label: 'SCROLL',
      primaryColor: '#F3E5C8',
      secondaryColor: '#D4B788',
      accentColor: '#991B1B',
      outlineColor: '#4A3525',
    },
  },
  {
    kind: 'vint-heraldic-shield',
    name: 'Heraldic Crest Shield',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'shield', 'crest', 'heraldic', 'royal', 'emblem', 'badge'],
    defaultWidth: 200,
    defaultHeight: 230,
    defaultProps: {
      stickerKind: 'vint-heraldic-shield',
      label: 'EST. 1890',
      primaryColor: '#4A372B',
      secondaryColor: '#D4AF37',
      accentColor: '#F7EFE2',
      outlineColor: '#2B1E16',
    },
  },
  {
    kind: 'vint-ornate-cartouche',
    name: 'Baroque Cartouche Plaque',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'frame', 'cartouche', 'plaque', 'ornate', 'label', 'baroque'],
    defaultWidth: 360,
    defaultHeight: 170,
    defaultProps: {
      stickerKind: 'vint-ornate-cartouche',
      label: 'INVITATION',
      primaryColor: '#FAF5EB',
      secondaryColor: '#5C4332',
      accentColor: '#B48A4E',
      outlineColor: '#3B2A1E',
    },
  },
  {
    kind: 'vint-invitation-frame',
    name: 'Calligraphic Invitation Box',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'invitation', 'frame', 'calligraphy', 'menu', 'border', 'ornate'],
    defaultWidth: 360,
    defaultHeight: 240,
    defaultProps: {
      stickerKind: 'vint-invitation-frame',
      label: 'ROMANTIC EVENT',
      primaryColor: '#FCF8F0',
      secondaryColor: '#4B3A2E',
      accentColor: '#A67C52',
      outlineColor: '#3A2B21',
    },
  },
  {
    kind: 'vint-flourish-divider-1',
    name: 'Calligraphic Swash Divider',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'flourish', 'divider', 'line', 'calligraphy', 'swash', 'ornament'],
    defaultWidth: 400,
    defaultHeight: 90,
    defaultProps: {
      stickerKind: 'vint-flourish-divider-1',
      label: 'DIVIDER',
      primaryColor: '#4A372B',
      secondaryColor: '#8B684C',
      accentColor: '#B48A4E',
      outlineColor: '#2B1E16',
    },
  },
  {
    kind: 'vint-flourish-divider-2',
    name: 'Fleur-de-Lis Filigree Rule',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'flourish', 'divider', 'fleur', 'filigree', 'line', 'ornament'],
    defaultWidth: 420,
    defaultHeight: 96,
    defaultProps: {
      stickerKind: 'vint-flourish-divider-2',
      label: 'CHAPTER',
      primaryColor: '#3E2C1E',
      secondaryColor: '#A67C52',
      accentColor: '#7C5836',
      outlineColor: '#2A1D13',
    },
  },
  {
    kind: 'vint-flourish-crest',
    name: 'Symmetric Swash Crest',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'flourish', 'crest', 'calligraphy', 'swash', 'scrollwork'],
    defaultWidth: 280,
    defaultHeight: 160,
    defaultProps: {
      stickerKind: 'vint-flourish-crest',
      label: 'SWASH',
      primaryColor: '#4A372B',
      secondaryColor: '#B48A4E',
      accentColor: '#7C5836',
      outlineColor: '#2B1E16',
    },
  },
  {
    kind: 'vint-beaded-oval',
    name: 'Pearl Oval Label Frame',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'oval', 'pearl', 'beaded', 'frame', 'label', 'menu'],
    defaultWidth: 320,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'vint-beaded-oval',
      label: 'SPECIALTY',
      primaryColor: '#FAF5EB',
      secondaryColor: '#4A372B',
      accentColor: '#9A7448',
      outlineColor: '#3A2B21',
    },
  },
  {
    kind: 'vint-compass-rose',
    name: 'Antique Cartographer Rose',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'compass', 'rose', 'map', 'nautical', 'history', 'explorer'],
    defaultWidth: 220,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'vint-compass-rose',
      label: 'N',
      primaryColor: '#4A372B',
      secondaryColor: '#D4AF37',
      accentColor: '#F5EFE2',
      outlineColor: '#2E2016',
    },
  },
  {
    kind: 'vint-crossed-arrows',
    name: 'Crossed Heritage Arrows',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'arrows', 'crossed', 'emblem', 'crest', 'rustic', 'classic'],
    defaultWidth: 220,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'vint-crossed-arrows',
      label: 'EST',
      primaryColor: '#4A372B',
      secondaryColor: '#B48A4E',
      accentColor: '#7C5836',
      outlineColor: '#2B1E16',
    },
  },
  {
    kind: 'vint-wax-seal-letter',
    name: 'Wax-Sealed Antique Letter',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'letter', 'envelope', 'wax', 'seal', 'dark academia', 'mail'],
    defaultWidth: 250,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'vint-wax-seal-letter',
      label: 'SEAL',
      primaryColor: '#F2E4C8',
      secondaryColor: '#D6BE96',
      accentColor: '#991B1B',
      outlineColor: '#4A3525',
    },
  },
  {
    kind: 'vint-pocket-watch',
    name: 'Antique Brass Pocket Watch',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'watch', 'clock', 'pocket', 'time', 'brass', 'academia'],
    defaultWidth: 200,
    defaultHeight: 230,
    defaultProps: {
      stickerKind: 'vint-pocket-watch',
      label: 'XII',
      primaryColor: '#D4AF37',
      secondaryColor: '#FAF2DF',
      accentColor: '#8B5A2B',
      outlineColor: '#3E2C1E',
    },
  },
  {
    kind: 'vint-fleur-de-lis',
    name: 'Royal Fleur-de-Lis',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'fleur', 'royal', 'crown', 'crest', 'ornament', 'france'],
    defaultWidth: 180,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'vint-fleur-de-lis',
      label: 'ROYAL',
      primaryColor: '#4A372B',
      secondaryColor: '#D4AF37',
      accentColor: '#7C5836',
      outlineColor: '#2B1E16',
    },
  },
  {
    kind: 'vint-calligraphy-header',
    name: 'Editorial Banner & Florals',
    category: 'Vintage & Flourishes',
    keywords: ['vintage', 'header', 'banner', 'floral', 'calligraphy', 'menu', 'title'],
    defaultWidth: 420,
    defaultHeight: 130,
    defaultProps: {
      stickerKind: 'vint-calligraphy-header',
      label: 'MENU & GALLERY',
      primaryColor: '#4A372B',
      secondaryColor: '#FAF5EB',
      accentColor: '#9A7448',
      outlineColor: '#3A2B21',
    },
  },

  // ==================== 18 HISTORY & CULTURE ====================
  {
    kind: 'hist-parthenon-temple',
    name: 'Classical Greek Temple',
    category: 'History & Culture',
    keywords: ['history', 'temple', 'parthenon', 'greece', 'classical', 'architecture', 'roman'],
    defaultWidth: 320,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'hist-parthenon-temple',
      label: 'CLASSICAL',
      primaryColor: '#E7DCC6',
      secondaryColor: '#C5B08C',
      accentColor: '#9A7B4F',
      outlineColor: '#3E2F23',
    },
  },
  {
    kind: 'hist-giza-pyramids',
    name: 'Ancient Giza Pyramids',
    category: 'History & Culture',
    keywords: ['history', 'pyramid', 'egypt', 'ancient', 'desert', 'wonder'],
    defaultWidth: 320,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'hist-giza-pyramids',
      label: 'EGYPT',
      primaryColor: '#E8C587',
      secondaryColor: '#B58441',
      accentColor: '#FDE68A',
      outlineColor: '#4A3520',
    },
  },
  {
    kind: 'hist-ionic-column',
    name: 'Ionic Marble Pillar',
    category: 'History & Culture',
    keywords: ['history', 'pillar', 'column', 'ionic', 'marble', 'greek', 'academia'],
    defaultWidth: 160,
    defaultHeight: 260,
    defaultProps: {
      stickerKind: 'hist-ionic-column',
      label: 'IONIC',
      primaryColor: '#F4F1EA',
      secondaryColor: '#D6D0C4',
      accentColor: '#A8A29E',
      outlineColor: '#44403C',
    },
  },
  {
    kind: 'hist-colosseum-arch',
    name: 'Roman Colosseum Tiers',
    category: 'History & Culture',
    keywords: ['history', 'colosseum', 'rome', 'arch', 'architecture', 'ancient', 'italy'],
    defaultWidth: 300,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'hist-colosseum-arch',
      label: 'ROME',
      primaryColor: '#DFD2B8',
      secondaryColor: '#B39B73',
      accentColor: '#6B553B',
      outlineColor: '#3E2F23',
    },
  },
  {
    kind: 'hist-marble-bust',
    name: 'Classical Marble Bust',
    category: 'History & Culture',
    keywords: ['history', 'bust', 'statue', 'sculpture', 'academia', 'philosophy', 'greek'],
    defaultWidth: 200,
    defaultHeight: 240,
    defaultProps: {
      stickerKind: 'hist-marble-bust',
      label: 'PHILOSOPHY',
      primaryColor: '#E7E5E4',
      secondaryColor: '#A8A29E',
      accentColor: '#D6D3D1',
      outlineColor: '#292524',
    },
  },
  {
    kind: 'hist-golden-hourglass',
    name: 'Sand Timer Hourglass',
    category: 'History & Culture',
    keywords: ['history', 'hourglass', 'time', 'sand', 'ancient', 'timer'],
    defaultWidth: 170,
    defaultHeight: 230,
    defaultProps: {
      stickerKind: 'hist-golden-hourglass',
      label: 'TIME',
      primaryColor: '#C59B6D',
      secondaryColor: '#E0F2FE',
      accentColor: '#EAB308',
      outlineColor: '#4A3520',
    },
  },
  {
    kind: 'hist-sailing-galleon',
    name: 'Explorer Galleon Ship',
    category: 'History & Culture',
    keywords: ['history', 'ship', 'galleon', 'sail', 'voyage', 'ocean', 'explorer'],
    defaultWidth: 280,
    defaultHeight: 240,
    defaultProps: {
      stickerKind: 'hist-sailing-galleon',
      label: 'VOYAGE',
      primaryColor: '#8B5A2B',
      secondaryColor: '#FAF5E8',
      accentColor: '#0284C7',
      outlineColor: '#2B1E16',
    },
  },
  {
    kind: 'hist-brass-spyglass',
    name: 'Nautical Brass Telescope',
    category: 'History & Culture',
    keywords: ['history', 'telescope', 'spyglass', 'brass', 'explorer', 'astronomy'],
    defaultWidth: 260,
    defaultHeight: 140,
    defaultProps: {
      stickerKind: 'hist-brass-spyglass',
      label: 'DISCOVERY',
      primaryColor: '#D97706',
      secondaryColor: '#FDE68A',
      accentColor: '#475569',
      outlineColor: '#292524',
    },
  },
  {
    kind: 'hist-royal-crown',
    name: 'Sovereign Jeweled Crown',
    category: 'History & Culture',
    keywords: ['history', 'crown', 'royal', 'monarchy', 'king', 'queen', 'gold'],
    defaultWidth: 230,
    defaultHeight: 170,
    defaultProps: {
      stickerKind: 'hist-royal-crown',
      label: 'CROWN',
      primaryColor: '#F59E0B',
      secondaryColor: '#FDE047',
      accentColor: '#9333EA',
      outlineColor: '#451A03',
    },
  },
  {
    kind: 'hist-knight-helmet',
    name: 'Medieval Knight Helm',
    category: 'History & Culture',
    keywords: ['history', 'knight', 'helmet', 'armor', 'medieval', 'shield'],
    defaultWidth: 200,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'hist-knight-helmet',
      label: 'ARMOR',
      primaryColor: '#94A3B8',
      secondaryColor: '#CBD5E1',
      accentColor: '#EAB308',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'hist-medieval-sword',
    name: 'Chivalric Broadsword',
    category: 'History & Culture',
    keywords: ['history', 'sword', 'medieval', 'blade', 'knight', 'weapon'],
    defaultWidth: 220,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'hist-medieval-sword',
      label: 'BLADE',
      primaryColor: '#CBD5E1',
      secondaryColor: '#92400E',
      accentColor: '#EAB308',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'hist-stacked-tomes',
    name: 'Leather History Tomes',
    category: 'History & Culture',
    keywords: ['history', 'books', 'stack', 'library', 'academia', 'tomes'],
    defaultWidth: 260,
    defaultHeight: 190,
    defaultProps: {
      stickerKind: 'hist-stacked-tomes',
      label: 'HISTORY',
      primaryColor: '#991B1B',
      secondaryColor: '#1E40AF',
      accentColor: '#F59E0B',
      outlineColor: '#292524',
    },
  },
  {
    kind: 'hist-antique-globe',
    name: 'Old-World Brass Globe',
    category: 'History & Culture',
    keywords: ['history', 'globe', 'world', 'map', 'antique', 'geography'],
    defaultWidth: 210,
    defaultHeight: 240,
    defaultProps: {
      stickerKind: 'hist-antique-globe',
      label: 'WORLD',
      primaryColor: '#E6D2A7',
      secondaryColor: '#A67C52',
      accentColor: '#92400E',
      outlineColor: '#3E2C1E',
    },
  },
  {
    kind: 'hist-crescent-emblem',
    name: 'Crescent & 8-Point Star',
    category: 'History & Culture',
    keywords: ['religion', 'culture', 'islam', 'crescent', 'star', 'heritage', 'geometric'],
    defaultWidth: 210,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'hist-crescent-emblem',
      label: 'PEACE',
      primaryColor: '#10B981',
      secondaryColor: '#FBBF24',
      accentColor: '#064E3B',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'hist-celtic-triquetra',
    name: 'Celtic Triquetra Knot',
    category: 'History & Culture',
    keywords: ['culture', 'celtic', 'knot', 'triquetra', 'heritage', 'symbol'],
    defaultWidth: 210,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'hist-celtic-triquetra',
      label: 'KNOT',
      primaryColor: '#34D399',
      secondaryColor: '#F59E0B',
      accentColor: '#FEF3C7',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'hist-torii-gate',
    name: 'Shinto Torii Sanctuary Gate',
    category: 'History & Culture',
    keywords: ['culture', 'religion', 'torii', 'japan', 'temple', 'heritage', 'gate'],
    defaultWidth: 220,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'hist-torii-gate',
      label: 'TORII',
      primaryColor: '#DC2626',
      secondaryColor: '#334155',
      accentColor: '#FCA5A5',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'hist-golden-menorah',
    name: 'Ceremonial Candelabra',
    category: 'History & Culture',
    keywords: ['culture', 'religion', 'menorah', 'candle', 'heritage', 'gold'],
    defaultWidth: 210,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'hist-golden-menorah',
      label: 'LIGHT',
      primaryColor: '#F59E0B',
      secondaryColor: '#FEF08A',
      accentColor: '#EF4444',
      outlineColor: '#292524',
    },
  },
  {
    kind: 'hist-harmony-bagua',
    name: 'Yin-Yang Harmony Octagon',
    category: 'History & Culture',
    keywords: ['culture', 'philosophy', 'yin', 'yang', 'harmony', 'octagon', 'bagua'],
    defaultWidth: 210,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'hist-harmony-bagua',
      label: 'HARMONY',
      primaryColor: '#EF4444',
      secondaryColor: '#F8FAFC',
      accentColor: '#0F172A',
      outlineColor: '#1E293B',
    },
  },

  // ==================== 8 HERITAGE, MAP & GEOMETRIC BACKGROUNDS ====================
  {
    kind: 'bg-vintage-nautical-map',
    name: 'Antique Nautical Map BG',
    category: 'Backgrounds',
    keywords: ['vintage', 'map', 'parchment', 'compass', 'nautical', 'history', 'background'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-vintage-nautical-map',
      label: 'MAP',
      primaryColor: '#FBF0D6',
      secondaryColor: '#D6A66A',
      accentColor: '#8B5A2B',
      outlineColor: '#69411D',
    },
  },
  {
    kind: 'bg-vintage-parchment-scroll',
    name: 'Dark Academia Parchment BG',
    category: 'Backgrounds',
    keywords: ['vintage', 'parchment', 'academia', 'paper', 'flourish', 'background', 'antique'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-vintage-parchment-scroll',
      label: 'PARCHMENT',
      primaryColor: '#F6EBD4',
      secondaryColor: '#DFC79F',
      accentColor: '#5C4028',
      outlineColor: '#3E2C1E',
    },
  },
  {
    kind: 'bg-islamic-emerald-lanterns',
    name: 'Emerald Arabesque & Lanterns BG',
    category: 'Backgrounds',
    keywords: ['islamic', 'ramadan', 'eid', 'emerald', 'lantern', 'gold', 'arabesque', 'background'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-islamic-emerald-lanterns',
      label: 'RAMADAN',
      primaryColor: '#0B4635',
      secondaryColor: '#062D22',
      accentColor: '#F5D073',
      outlineColor: '#D9A74A',
    },
  },
  {
    kind: 'bg-islamic-star-border',
    name: 'Green & Gold Star Border BG',
    category: 'Backgrounds',
    keywords: ['islamic', 'geometric', 'star', 'green', 'gold', 'border', 'background'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-islamic-star-border',
      label: 'GEOMETRIC',
      primaryColor: '#2E8B47',
      secondaryColor: '#206834',
      accentColor: '#FACC15',
      outlineColor: '#FDE047',
    },
  },
  {
    kind: 'bg-heritage-arabesque-navy',
    name: 'Indigo & Gold Lattice BG',
    category: 'Backgrounds',
    keywords: ['arabesque', 'lattice', 'geometric', 'navy', 'gold', 'heritage', 'background'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-heritage-arabesque-navy',
      label: 'LATTICE',
      primaryColor: '#0B1B3B',
      secondaryColor: '#061126',
      accentColor: '#E5B85B',
      outlineColor: '#B88933',
    },
  },
  {
    kind: 'bg-classical-marble-arch',
    name: 'Classical Marble Colonnade BG',
    category: 'Backgrounds',
    keywords: ['classical', 'marble', 'arch', 'rome', 'history', 'academia', 'background'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-classical-marble-arch',
      label: 'MARBLE',
      primaryColor: '#F5F2EB',
      secondaryColor: '#E4DDD0',
      accentColor: '#8B7355',
      outlineColor: '#4A3B2C',
    },
  },
  {
    kind: 'bg-calligraphy-ivory-frame',
    name: 'Calligraphic Ivory Frame BG',
    category: 'Backgrounds',
    keywords: ['calligraphy', 'invitation', 'ivory', 'flourish', 'wedding', 'vintage', 'background'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-calligraphy-ivory-frame',
      label: 'INVITE',
      primaryColor: '#FAF4E8',
      secondaryColor: '#EFE4D0',
      accentColor: '#4A372B',
      outlineColor: '#8B684C',
    },
  },
  {
    kind: 'bg-royal-burgundy-crest',
    name: 'Burgundy & Gold Crest BG',
    category: 'Backgrounds',
    keywords: ['royal', 'burgundy', 'gold', 'crest', 'vintage', 'gala', 'background'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-royal-burgundy-crest',
      label: 'ROYAL',
      primaryColor: '#4A0F1D',
      secondaryColor: '#2B0710',
      accentColor: '#E5B85B',
      outlineColor: '#B88933',
    },
  },
];

function drawCompassRosePaths(cx: number, cy: number, r: number, color: string, fillLight: string): string {
  const outer = r;
  const inner = r * 0.24;
  const diag = r * 0.68;
  return `
    <circle cx="${cx}" cy="${cy}" r="${(r * 0.94).toFixed(1)}" fill="none" stroke="${color}" stroke-width="2" />
    <circle cx="${cx}" cy="${cy}" r="${(r * 0.78).toFixed(1)}" fill="none" stroke="${color}" stroke-width="1.2" stroke-dasharray="4 3" />
    <polygon points="${cx},${cy - diag} ${cx + inner * 0.7},${cy - inner * 0.7} ${cx + diag},${cy} ${cx + inner * 0.7},${cy + inner * 0.7} ${cx},${cy + diag} ${cx - inner * 0.7},${cy + inner * 0.7} ${cx - diag},${cy} ${cx - inner * 0.7},${cy - inner * 0.7}" fill="${fillLight}" stroke="${color}" stroke-width="1.4" />
    <polygon points="${cx},${cy - outer} ${cx + inner},${cy - inner} ${cx},${cy}" fill="${color}" />
    <polygon points="${cx},${cy - outer} ${cx - inner},${cy - inner} ${cx},${cy}" fill="${fillLight}" stroke="${color}" stroke-width="1.2" />
    <polygon points="${cx + outer},${cy} ${cx + inner},${cy + inner} ${cx},${cy}" fill="${color}" />
    <polygon points="${cx + outer},${cy} ${cx + inner},${cy - inner} ${cx},${cy}" fill="${fillLight}" stroke="${color}" stroke-width="1.2" />
    <polygon points="${cx},${cy + outer} ${cx - inner},${cy + inner} ${cx},${cy}" fill="${color}" />
    <polygon points="${cx},${cy + outer} ${cx + inner},${cy + inner} ${cx},${cy}" fill="${fillLight}" stroke="${color}" stroke-width="1.2" />
    <polygon points="${cx - outer},${cy} ${cx - inner},${cy - inner} ${cx},${cy}" fill="${color}" />
    <polygon points="${cx - outer},${cy} ${cx - inner},${cy + inner} ${cx},${cy}" fill="${fillLight}" stroke="${color}" stroke-width="1.2" />
    <circle cx="${cx}" cy="${cy}" r="${(r * 0.1).toFixed(1)}" fill="${fillLight}" stroke="${color}" stroke-width="1.8" />
  `;
}

export function renderHeritageVintageSvg(
  kind: string,
  c1: string,
  c2: string,
  acc: string,
  out: string,
  label: string,
  uid: string
): { viewBox: string; svg: string } | null {
  switch (kind) {
    // ==================== VINTAGE & FLOURISHES ====================
    case 'vint-ribbon-scroll-arch':
      return {
        viewBox: '0 0 360 140',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 140">
  <path d="M 16 112 Q 44 126 76 102 L 96 62 L 64 56 Q 38 78 24 88 L 42 94 Z" fill="${c2}" stroke="${out}" stroke-width="2.2" stroke-linejoin="round" />
  <path d="M 344 112 Q 316 126 284 102 L 264 62 L 296 56 Q 322 78 336 88 L 318 94 Z" fill="${c2}" stroke="${out}" stroke-width="2.2" stroke-linejoin="round" />
  <path d="M 88 94 Q 180 62 272 94 L 288 46 Q 180 12 72 46 Z" fill="${c1}" stroke="${out}" stroke-width="2.6" stroke-linejoin="round" />
  <path d="M 84 82 Q 180 50 276 82" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.55" />
  <path d="M 78 52 Q 180 20 282 52" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.55" />
  <text x="180" y="61" text-anchor="middle" fill="${out}" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="22" letter-spacing="3">${esc((label || 'HERITAGE').slice(0, 14))}</text>
</svg>`,
      };

    case 'vint-curled-manuscript':
      return {
        viewBox: '0 0 260 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 200">
  <path d="M 52 24 C 36 24 28 38 28 54 L 28 148 C 28 164 40 176 56 176 L 198 176 C 216 176 226 164 226 146 L 226 52 C 226 36 212 24 196 24 Z" fill="${c1}" stroke="${out}" stroke-width="2.6" />
  <ellipse cx="44" cy="40" rx="16" ry="16" fill="${c2}" stroke="${out}" stroke-width="2.4" />
  <circle cx="44" cy="40" r="6" fill="${out}" />
  <path d="M 210 144 C 224 144 234 154 234 166 C 234 178 220 184 206 184 L 190 184 L 190 160 Z" fill="${c2}" stroke="${out}" stroke-width="2.4" />
  <line x1="64" y1="74" x2="196" y2="74" stroke="${acc}" stroke-width="2" opacity="0.45" />
  <line x1="64" y1="98" x2="188" y2="98" stroke="${out}" stroke-width="1.4" opacity="0.45" />
  <line x1="64" y1="118" x2="192" y2="118" stroke="${out}" stroke-width="1.4" opacity="0.45" />
  <line x1="64" y1="138" x2="160" y2="138" stroke="${out}" stroke-width="1.4" opacity="0.45" />
  <text x="132" y="54" text-anchor="middle" fill="${out}" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="13" letter-spacing="1.5">${esc((label || 'PROCLAMATION').slice(0, 14))}</text>
</svg>`,
      };

    case 'vint-tied-scroll':
      return {
        viewBox: '0 0 240 140',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140">
  <g transform="rotate(-14 120 70)">
    <rect x="28" y="34" width="184" height="72" rx="14" fill="${c1}" stroke="${out}" stroke-width="2.4" />
    <ellipse cx="38" cy="70" rx="12" ry="36" fill="${c2}" stroke="${out}" stroke-width="2.2" />
    <ellipse cx="202" cy="70" rx="12" ry="36" fill="${c2}" stroke="${out}" stroke-width="2.2" />
    <ellipse cx="202" cy="70" rx="5" ry="20" fill="${out}" opacity="0.55" />
    <rect x="108" y="31" width="16" height="78" fill="${acc}" stroke="${out}" stroke-width="1.8" />
    <path d="M 116 68 Q 92 50 86 64 Q 82 78 116 70 Q 150 54 146 70 Q 142 84 116 70 Z" fill="${acc}" stroke="${out}" stroke-width="1.8" />
    <path d="M 112 72 L 96 106 L 106 102 Z" fill="${acc}" stroke="${out}" stroke-width="1.5" />
    <path d="M 122 72 L 138 106 L 128 102 Z" fill="${acc}" stroke="${out}" stroke-width="1.5" />
  </g>
</svg>`,
      };

    case 'vint-heraldic-shield':
      return {
        viewBox: '0 0 200 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 230">
  <path d="M 100 14 L 106 24 L 116 20 L 110 30 L 90 30 L 84 20 L 94 24 Z" fill="${c2}" stroke="${out}" stroke-width="1.8" />
  <path d="M 32 42 Q 100 26 168 42 L 164 118 Q 160 176 100 212 Q 40 176 36 118 Z" fill="${c1}" stroke="${c2}" stroke-width="4" />
  <path d="M 44 52 Q 100 38 156 52 L 152 116 Q 148 164 100 196 Q 52 164 48 116 Z" fill="none" stroke="${acc}" stroke-width="1.6" stroke-dasharray="5 3" />
  <text x="100" y="122" text-anchor="middle" fill="${acc}" font-family="Cinzel, Georgia, serif" font-weight="800" font-size="18" letter-spacing="2">${esc((label || 'EST. 1890').slice(0, 10))}</text>
</svg>`,
      };

    case 'vint-ornate-cartouche':
      return {
        viewBox: '0 0 360 170',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 170">
  <path d="M 46 34 Q 180 18 314 34 L 332 54 L 332 116 L 314 136 Q 180 152 46 136 L 28 116 L 28 54 Z" fill="${c1}" stroke="${c2}" stroke-width="4.5" />
  <path d="M 54 44 Q 180 30 306 44 L 320 58 L 320 112 L 306 126 Q 180 140 54 126 L 40 112 L 40 58 Z" fill="none" stroke="${acc}" stroke-width="1.6" />
  <circle cx="180" cy="24" r="6" fill="${c2}" />
  <circle cx="180" cy="146" r="6" fill="${c2}" />
  <circle cx="24" cy="85" r="7" fill="${c2}" />
  <circle cx="336" cy="85" r="7" fill="${c2}" />
  <text x="180" y="93" text-anchor="middle" fill="${out}" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="22" letter-spacing="3">${esc((label || 'INVITATION').slice(0, 16))}</text>
</svg>`,
      };

    case 'vint-invitation-frame':
      return {
        viewBox: '0 0 360 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">
  <path d="M 22 46 Q 46 46 46 22 H 136 Q 156 8 180 8 Q 204 8 224 22 H 314 Q 314 46 338 46 V 194 Q 314 194 314 218 H 224 Q 204 232 180 232 Q 156 232 136 218 H 46 Q 46 194 22 194 Z" fill="${c1}" stroke="${c2}" stroke-width="3.5" />
  <path d="M 32 54 Q 54 54 54 32 H 142 Q 160 18 180 18 Q 200 18 218 32 H 306 Q 306 54 328 54 V 186 Q 306 186 306 208 H 218 Q 200 222 180 222 Q 160 222 142 208 H 54 Q 54 186 32 186 Z" fill="none" stroke="${acc}" stroke-width="1.4" />
  <text x="180" y="106" text-anchor="middle" fill="${acc}" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="13" letter-spacing="2.8">${esc((label || 'ROMANTIC EVENT').slice(0, 20))}</text>
  <text x="180" y="138" text-anchor="middle" fill="${out}" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="24" letter-spacing="3.5">INVITATION</text>
  <line x1="86" y1="154" x2="274" y2="154" stroke="${c2}" stroke-width="1.4" opacity="0.7" />
</svg>`,
      };

    case 'vint-flourish-divider-1':
      return {
        viewBox: '0 0 400 90',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 90">
  <path d="M 16 45 C 60 14 114 14 152 42 C 168 54 178 68 200 68 C 222 68 232 54 248 42 C 286 14 340 14 384 45" fill="none" stroke="${c1}" stroke-width="2.6" stroke-linecap="round" />
  <path d="M 28 54 C 66 76 116 64 146 38 C 164 22 182 14 200 26 C 218 14 236 22 254 38 C 284 64 334 76 372 54" fill="none" stroke="${c2}" stroke-width="1.8" stroke-linecap="round" />
  <circle cx="200" cy="45" r="7" fill="${acc}" stroke="${out}" stroke-width="1.8" />
  <circle cx="176" cy="45" r="3" fill="${c1}" />
  <circle cx="224" cy="45" r="3" fill="${c1}" />
</svg>`,
      };

    case 'vint-flourish-divider-2':
      return {
        viewBox: '0 0 420 96',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 96">
  <line x1="48" y1="48" x2="184" y2="48" stroke="${c1}" stroke-width="3" stroke-linecap="round" />
  <line x1="236" y1="48" x2="372" y2="48" stroke="${c1}" stroke-width="3" stroke-linecap="round" />
  <path d="M 210 22 C 218 32 222 44 210 54 C 198 44 202 32 210 22 Z" fill="${c1}" />
  <path d="M 192 48 C 192 38 202 38 206 48 C 202 58 192 58 192 48 Z" fill="${c2}" />
  <path d="M 228 48 C 228 38 218 38 214 48 C 218 58 228 58 228 48 Z" fill="${c2}" />
  <path d="M 48 48 C 32 34 18 38 18 48 C 18 58 32 62 48 48 Z" fill="${acc}" stroke="${out}" stroke-width="1.5" />
  <path d="M 372 48 C 388 34 402 38 402 48 C 402 58 388 62 372 48 Z" fill="${acc}" stroke="${out}" stroke-width="1.5" />
  <circle cx="116" cy="48" r="4" fill="${c2}" />
  <circle cx="304" cy="48" r="4" fill="${c2}" />
</svg>`,
      };

    case 'vint-flourish-crest':
      return {
        viewBox: '0 0 280 160',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160">
  <path d="M 140 132 C 110 92 52 84 42 54 C 34 30 62 18 88 30 C 116 44 134 78 140 108 C 146 78 164 44 192 30 C 218 18 246 30 238 54 C 228 84 170 92 140 132 Z" fill="none" stroke="${c1}" stroke-width="2.6" stroke-linecap="round" />
  <path d="M 68 62 C 98 44 128 52 140 76 C 152 52 182 44 212 62" fill="none" stroke="${c2}" stroke-width="2" />
  <polygon points="140,18 152,30 140,42 128,30" fill="none" stroke="${acc}" stroke-width="2" />
  <circle cx="140" cy="30" r="3" fill="${c1}" />
</svg>`,
      };

    case 'vint-beaded-oval': {
      const beads = Array.from({ length: 34 }, (_, i) => {
        const a = (i * (360 / 34) * Math.PI) / 180;
        const bx = 160 + Math.cos(a) * 136;
        const by = 100 + Math.sin(a) * 78;
        return `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="4.2" fill="${i % 2 === 0 ? c2 : acc}" />`;
      }).join('');
      return {
        viewBox: '0 0 320 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
  <ellipse cx="160" cy="100" rx="126" ry="68" fill="${c1}" stroke="${c2}" stroke-width="2.2" />
  ${beads}
  <line x1="48" y1="82" x2="272" y2="82" stroke="${c2}" stroke-width="1.5" />
  <line x1="48" y1="118" x2="272" y2="118" stroke="${c2}" stroke-width="1.5" />
  <text x="160" y="106" text-anchor="middle" fill="${out}" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="18" letter-spacing="2.8">${esc((label || 'SPECIALTY').slice(0, 14))}</text>
</svg>`,
      };
    }

    case 'vint-compass-rose':
      return {
        viewBox: '0 0 220 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
  ${drawCompassRosePaths(110, 110, 92, c1, acc)}
  <text x="110" y="16" text-anchor="middle" fill="${out}" font-family="Cinzel, Georgia, serif" font-weight="800" font-size="12">N</text>
  <text x="110" y="214" text-anchor="middle" fill="${out}" font-family="Cinzel, Georgia, serif" font-weight="800" font-size="12">S</text>
  <text x="12" y="114" text-anchor="middle" fill="${out}" font-family="Cinzel, Georgia, serif" font-weight="800" font-size="12">W</text>
  <text x="208" y="114" text-anchor="middle" fill="${out}" font-family="Cinzel, Georgia, serif" font-weight="800" font-size="12">E</text>
</svg>`,
      };

    case 'vint-crossed-arrows':
      return {
        viewBox: '0 0 220 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
  <line x1="36" y1="184" x2="184" y2="36" stroke="${c1}" stroke-width="4" stroke-linecap="round" />
  <polygon points="188,32 164,38 182,56" fill="${c1}" />
  <path d="M 32 188 L 22 172 M 40 180 L 30 164 M 32 188 L 48 198 M 40 180 L 56 190" stroke="${c2}" stroke-width="2.6" stroke-linecap="round" />
  <line x1="184" y1="184" x2="36" y2="36" stroke="${c1}" stroke-width="4" stroke-linecap="round" />
  <polygon points="32,32 56,38 38,56" fill="${c1}" />
  <path d="M 188 188 L 198 172 M 180 180 L 190 164 M 188 188 L 172 198 M 180 180 L 164 190" stroke="${c2}" stroke-width="2.6" stroke-linecap="round" />
  <circle cx="110" cy="66" r="4" fill="${acc}" />
  <circle cx="110" cy="154" r="4" fill="${acc}" />
  <circle cx="66" cy="110" r="4" fill="${acc}" />
  <circle cx="154" cy="110" r="4" fill="${acc}" />
</svg>`,
      };

    case 'vint-wax-seal-letter':
      return {
        viewBox: '0 0 250 180',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180">
  <rect x="20" y="24" width="210" height="132" rx="8" fill="${c1}" stroke="${out}" stroke-width="2.6" />
  <polygon points="20,24 125,104 230,24" fill="${c2}" stroke="${out}" stroke-width="2.2" stroke-linejoin="round" />
  <line x1="20" y1="156" x2="94" y2="86" stroke="${out}" stroke-width="2" />
  <line x1="230" y1="156" x2="156" y2="86" stroke="${out}" stroke-width="2" />
  <circle cx="125" cy="96" r="18" fill="${acc}" stroke="${out}" stroke-width="2" />
  <circle cx="125" cy="96" r="12" fill="none" stroke="#FDE68A" stroke-width="1.4" opacity="0.7" />
</svg>`,
      };

    case 'vint-pocket-watch':
      return {
        viewBox: '0 0 200 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 230">
  <circle cx="100" cy="24" r="14" fill="none" stroke="${c1}" stroke-width="5" />
  <rect x="90" y="34" width="20" height="14" rx="4" fill="${c1}" stroke="${out}" stroke-width="2" />
  <circle cx="100" cy="130" r="78" fill="${c1}" stroke="${out}" stroke-width="3.5" />
  <circle cx="100" cy="130" r="64" fill="${c2}" stroke="${acc}" stroke-width="2" />
  <circle cx="100" cy="130" r="56" fill="none" stroke="${out}" stroke-width="1" stroke-dasharray="2 11" />
  <line x1="100" y1="130" x2="100" y2="82" stroke="${out}" stroke-width="3.5" stroke-linecap="round" />
  <line x1="100" y1="130" x2="134" y2="112" stroke="${out}" stroke-width="3" stroke-linecap="round" />
  <circle cx="100" cy="130" r="5" fill="${acc}" />
  <text x="100" y="80" text-anchor="middle" fill="${out}" font-family="Cinzel, Georgia, serif" font-weight="800" font-size="11">${esc((label || 'XII').slice(0, 6))}</text>
</svg>`,
      };

    case 'vint-fleur-de-lis':
      return {
        viewBox: '0 0 180 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 200">
  <path d="M 90 16 C 110 46 112 92 90 126 C 68 92 70 46 90 16 Z" fill="${c1}" stroke="${out}" stroke-width="2.4" />
  <path d="M 86 126 C 54 120 26 94 34 62 C 42 46 66 56 64 78 C 62 92 74 106 86 116 Z" fill="${c1}" stroke="${out}" stroke-width="2.4" />
  <path d="M 94 126 C 126 120 154 94 146 62 C 138 46 114 56 116 78 C 118 92 106 106 94 116 Z" fill="${c1}" stroke="${out}" stroke-width="2.4" />
  <rect x="46" y="122" width="88" height="14" rx="7" fill="${c2}" stroke="${out}" stroke-width="2.2" />
  <path d="M 90 182 L 72 136 H 108 Z" fill="${c1}" stroke="${out}" stroke-width="2.2" />
</svg>`,
      };

    case 'vint-calligraphy-header':
      return {
        viewBox: '0 0 420 130',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 130">
  <line x1="24" y1="42" x2="396" y2="42" stroke="${c1}" stroke-width="1.8" />
  <line x1="24" y1="88" x2="396" y2="88" stroke="${c1}" stroke-width="1.8" />
  <path d="M 180 34 C 180 14 210 10 210 26 C 210 10 240 14 240 34" fill="none" stroke="${acc}" stroke-width="2.4" />
  <circle cx="210" cy="18" r="5" fill="${c1}" />
  <path d="M 180 96 C 180 116 210 120 210 104 C 210 120 240 116 240 96" fill="none" stroke="${acc}" stroke-width="2.4" />
  <circle cx="210" cy="112" r="5" fill="${c1}" />
  <text x="210" y="72" text-anchor="middle" fill="${out}" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="22" letter-spacing="3.5">${esc((label || 'MENU & GALLERY').slice(0, 22))}</text>
</svg>`,
      };

    // ==================== HISTORY & CULTURE ====================
    case 'hist-parthenon-temple': {
      const cols = [56, 88, 120, 152, 184, 216, 248]
        .map((cx) => `<rect x="${cx}" y="76" width="16" height="96" fill="${c1}" stroke="${out}" stroke-width="2" /><line x1="${cx + 5}" y1="80" x2="${cx + 5}" y2="168" stroke="${c2}" stroke-width="1.2" /><line x1="${cx + 11}" y1="80" x2="${cx + 11}" y2="168" stroke="${c2}" stroke-width="1.2" />`)
        .join('');
      return {
        viewBox: '0 0 320 210',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 210">
  <polygon points="32,64 160,16 288,64" fill="${c2}" stroke="${out}" stroke-width="2.6" stroke-linejoin="round" />
  <polygon points="58,56 160,26 262,56" fill="${acc}" opacity="0.45" />
  <rect x="38" y="64" width="244" height="14" fill="${c1}" stroke="${out}" stroke-width="2.2" />
  ${cols}
  <rect x="34" y="172" width="252" height="12" fill="${c2}" stroke="${out}" stroke-width="2.2" />
  <rect x="22" y="184" width="276" height="14" fill="${c1}" stroke="${out}" stroke-width="2.4" />
</svg>`,
      };
    }

    case 'hist-giza-pyramids':
      return {
        viewBox: '0 0 320 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
  <polygon points="22,164 102,52 178,164" fill="${c1}" stroke="${out}" stroke-width="2.4" stroke-linejoin="round" />
  <polygon points="102,52 178,164 116,164" fill="${c2}" stroke="${out}" stroke-width="2" />
  <polygon points="108,168 188,28 274,168" fill="${c1}" stroke="${out}" stroke-width="2.6" stroke-linejoin="round" />
  <polygon points="188,28 274,168 206,168" fill="${c2}" stroke="${out}" stroke-width="2.2" />
  <polygon points="212,170 260,96 304,170" fill="${c1}" stroke="${out}" stroke-width="2.2" stroke-linejoin="round" />
  <line x1="16" y1="172" x2="306" y2="172" stroke="${out}" stroke-width="2.5" stroke-linecap="round" />
</svg>`,
      };

    case 'hist-ionic-column':
      return {
        viewBox: '0 0 160 260',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 260">
  <rect x="30" y="20" width="100" height="14" rx="3" fill="${c1}" stroke="${out}" stroke-width="2.2" />
  <rect x="38" y="34" width="84" height="14" fill="${c2}" stroke="${out}" stroke-width="2" />
  <circle cx="38" cy="48" r="14" fill="${c1}" stroke="${out}" stroke-width="2.2" />
  <circle cx="38" cy="48" r="5" fill="${acc}" />
  <circle cx="122" cy="48" r="14" fill="${c1}" stroke="${out}" stroke-width="2.2" />
  <circle cx="122" cy="48" r="5" fill="${acc}" />
  <rect x="48" y="56" width="64" height="162" fill="${c1}" stroke="${out}" stroke-width="2.4" />
  <line x1="64" y1="62" x2="64" y2="212" stroke="${acc}" stroke-width="2" />
  <line x1="80" y1="62" x2="80" y2="212" stroke="${acc}" stroke-width="2" />
  <line x1="96" y1="62" x2="96" y2="212" stroke="${acc}" stroke-width="2" />
  <rect x="36" y="218" width="88" height="12" rx="3" fill="${c2}" stroke="${out}" stroke-width="2.2" />
  <rect x="26" y="230" width="108" height="14" rx="3" fill="${c1}" stroke="${out}" stroke-width="2.4" />
</svg>`,
      };

    case 'hist-colosseum-arch': {
      const arches = (y: number, count: number) =>
        Array.from({ length: count }, (_, i) => {
          const ax = 46 + i * 38;
          return `<path d="M ${ax} ${y + 34} V ${y + 12} A 11 11 0 0 1 ${ax + 22} ${y + 12} V ${y + 34} Z" fill="${acc}" stroke="${out}" stroke-width="1.8" />`;
        }).join('');
      return {
        viewBox: '0 0 300 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
  <path d="M 28 32 H 196 L 210 74 H 272 V 176 H 28 Z" fill="${c1}" stroke="${out}" stroke-width="2.6" stroke-linejoin="round" />
  <rect x="28" y="74" width="244" height="10" fill="${c2}" stroke="${out}" stroke-width="1.8" />
  <rect x="28" y="124" width="244" height="10" fill="${c2}" stroke="${out}" stroke-width="1.8" />
  ${arches(38, 4)}
  ${arches(86, 6)}
  ${arches(136, 6)}
</svg>`,
      };
    }

    case 'hist-marble-bust':
      return {
        viewBox: '0 0 200 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240">
  <path d="M 60 220 L 66 196 H 134 L 140 220 Z" fill="${c2}" stroke="${out}" stroke-width="2.4" />
  <path d="M 46 196 C 50 162 72 152 84 146 L 84 124 H 116 L 116 146 C 128 152 150 162 154 196 Z" fill="${c1}" stroke="${out}" stroke-width="2.4" />
  <path d="M 70 86 C 70 46 84 30 102 30 C 124 30 134 50 132 82 C 132 108 118 128 100 128 C 82 128 70 112 70 86 Z" fill="${c1}" stroke="${out}" stroke-width="2.4" />
  <path d="M 68 68 C 68 38 92 22 118 28 C 136 32 140 50 134 62 C 122 50 96 48 76 66 Z" fill="${c2}" stroke="${out}" stroke-width="2" />
  <line x1="92" y1="78" x2="104" y2="78" stroke="${out}" stroke-width="2" stroke-linecap="round" />
  <line x1="114" y1="78" x2="124" y2="78" stroke="${out}" stroke-width="2" stroke-linecap="round" />
</svg>`,
      };

    case 'hist-golden-hourglass':
      return {
        viewBox: '0 0 170 230',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 230">
  <rect x="26" y="18" width="118" height="14" rx="4" fill="${c1}" stroke="${out}" stroke-width="2.4" />
  <rect x="26" y="198" width="118" height="14" rx="4" fill="${c1}" stroke="${out}" stroke-width="2.4" />
  <path d="M 42 32 C 42 86 78 104 78 115 C 78 126 42 144 42 198 H 128 C 128 144 92 126 92 115 C 92 104 128 86 128 32 Z" fill="${c2}" stroke="${out}" stroke-width="2.4" />
  <path d="M 54 68 Q 85 84 116 68 Q 106 96 85 112 Q 64 96 54 68 Z" fill="${acc}" />
  <path d="M 48 194 Q 85 152 122 194 Z" fill="${acc}" />
  <line x1="85" y1="115" x2="85" y2="168" stroke="${acc}" stroke-width="2.5" stroke-dasharray="3 3" />
</svg>`,
      };

    case 'hist-sailing-galleon':
      return {
        viewBox: '0 0 280 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 240">
  <line x1="134" y1="24" x2="134" y2="162" stroke="${out}" stroke-width="4" />
  <line x1="82" y1="54" x2="82" y2="162" stroke="${out}" stroke-width="3.5" />
  <path d="M 134 32 Q 186 58 176 92 L 134 92 Z" fill="${c2}" stroke="${out}" stroke-width="2" />
  <path d="M 134 100 Q 198 120 188 152 L 134 152 Z" fill="${c2}" stroke="${out}" stroke-width="2" />
  <path d="M 82 62 Q 124 84 118 116 L 82 116 Z" fill="${c2}" stroke="${out}" stroke-width="2" />
  <path d="M 36 154 H 236 L 210 194 H 56 Z" fill="${c1}" stroke="${out}" stroke-width="2.8" stroke-linejoin="round" />
  <path d="M 20 202 Q 60 190 100 202 T 180 202 T 260 202" fill="none" stroke="${acc}" stroke-width="4" stroke-linecap="round" />
</svg>`,
      };

    case 'hist-brass-spyglass':
      return {
        viewBox: '0 0 260 140',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 140">
  <g transform="rotate(-24 130 70)">
    <rect x="26" y="54" width="66" height="32" rx="4" fill="${c1}" stroke="${out}" stroke-width="2.2" />
    <rect x="92" y="58" width="60" height="24" fill="${c2}" stroke="${out}" stroke-width="2" />
    <rect x="152" y="61" width="54" height="18" fill="${c1}" stroke="${out}" stroke-width="2" />
    <rect x="206" y="63" width="24" height="14" rx="3" fill="${acc}" stroke="${out}" stroke-width="2" />
    <ellipse cx="26" cy="70" rx="6" ry="16" fill="${acc}" stroke="${out}" stroke-width="2" />
  </g>
</svg>`,
      };

    case 'hist-royal-crown':
      return {
        viewBox: '0 0 230 170',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 170">
  <path d="M 28 124 L 18 48 L 66 84 L 115 28 L 164 84 L 212 48 L 202 124 Z" fill="${c1}" stroke="${out}" stroke-width="3" stroke-linejoin="round" />
  <rect x="28" y="124" width="174" height="24" rx="6" fill="${c2}" stroke="${out}" stroke-width="3" />
  <circle cx="18" cy="44" r="7" fill="${c2}" stroke="${out}" stroke-width="2" />
  <circle cx="115" cy="24" r="8" fill="${acc}" stroke="${out}" stroke-width="2" />
  <circle cx="212" cy="44" r="7" fill="${c2}" stroke="${out}" stroke-width="2" />
  <circle cx="115" cy="136" r="6" fill="${acc}" />
  <circle cx="66" cy="136" r="5" fill="${c1}" />
  <circle cx="164" cy="136" r="5" fill="${c1}" />
</svg>`,
      };

    case 'hist-knight-helmet':
      return {
        viewBox: '0 0 200 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">
  <path d="M 44 108 C 44 50 74 26 108 26 C 142 26 164 56 164 112 L 154 188 L 96 178 L 88 122 L 44 108 Z" fill="${c1}" stroke="${out}" stroke-width="3" stroke-linejoin="round" />
  <path d="M 46 82 H 158 V 96 H 46 Z" fill="${acc}" stroke="${out}" stroke-width="2" />
  <line x1="56" y1="108" x2="108" y2="108" stroke="${out}" stroke-width="5" stroke-linecap="round" />
  <line x1="116" y1="128" x2="144" y2="128" stroke="${c2}" stroke-width="3" />
  <line x1="116" y1="142" x2="144" y2="142" stroke="${c2}" stroke-width="3" />
</svg>`,
      };

    case 'hist-medieval-sword':
      return {
        viewBox: '0 0 220 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
  <g transform="rotate(45 110 110)">
    <polygon points="110,16 122,38 120,148 100,148 98,38" fill="${c1}" stroke="${out}" stroke-width="2.6" stroke-linejoin="round" />
    <line x1="110" y1="36" x2="110" y2="142" stroke="${out}" stroke-width="1.8" opacity="0.5" />
    <rect x="76" y="148" width="68" height="12" rx="6" fill="${acc}" stroke="${out}" stroke-width="2.4" />
    <rect x="103" y="160" width="14" height="32" fill="${c2}" stroke="${out}" stroke-width="2.2" />
    <circle cx="110" cy="198" r="10" fill="${acc}" stroke="${out}" stroke-width="2.4" />
  </g>
</svg>`,
      };

    case 'hist-stacked-tomes':
      return {
        viewBox: '0 0 260 190',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 190">
  <rect x="28" y="128" width="204" height="38" rx="6" fill="${c1}" stroke="${out}" stroke-width="2.6" />
  <rect x="52" y="136" width="168" height="22" rx="3" fill="#FAF5EB" stroke="${out}" stroke-width="1.6" />
  <rect x="40" y="84" width="192" height="38" rx="6" fill="${c2}" stroke="${out}" stroke-width="2.6" />
  <rect x="64" y="92" width="156" height="22" rx="3" fill="#FAF5EB" stroke="${out}" stroke-width="1.6" />
  <rect x="34" y="40" width="186" height="38" rx="6" fill="${c1}" stroke="${out}" stroke-width="2.6" />
  <rect x="44" y="48" width="156" height="22" rx="3" fill="#FAF5EB" stroke="${out}" stroke-width="1.6" />
  <text x="122" y="63" text-anchor="middle" fill="${out}" font-family="Cinzel, Georgia, serif" font-weight="800" font-size="11" letter-spacing="1.6">${esc((label || 'HISTORY').slice(0, 12))}</text>
</svg>`,
      };

    case 'hist-antique-globe':
      return {
        viewBox: '0 0 210 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 240">
  <path d="M 105 26 A 80 80 0 0 1 105 186" fill="none" stroke="${c2}" stroke-width="6" />
  <circle cx="105" cy="106" r="66" fill="${c1}" stroke="${out}" stroke-width="2.6" />
  <ellipse cx="105" cy="106" rx="34" ry="66" fill="none" stroke="${out}" stroke-width="1.4" opacity="0.5" />
  <line x1="39" y1="106" x2="171" y2="106" stroke="${out}" stroke-width="1.4" opacity="0.5" />
  <path d="M 68 84 Q 88 70 104 88 Q 112 104 92 118 Q 72 114 68 84 Z" fill="${c2}" opacity="0.7" />
  <path d="M 118 76 Q 144 82 146 112 Q 134 134 118 118 Z" fill="${c2}" opacity="0.7" />
  <line x1="105" y1="186" x2="105" y2="210" stroke="${acc}" stroke-width="8" />
  <rect x="64" y="210" width="82" height="14" rx="6" fill="${acc}" stroke="${out}" stroke-width="2.4" />
</svg>`,
      };

    case 'hist-crescent-emblem':
      return {
        viewBox: '0 0 210 210',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 210">
  <polygon points="105,18 134,42 172,38 168,76 192,105 168,134 172,172 134,168 105,192 76,168 38,172 42,134 18,105 42,76 38,38 76,42" fill="${c1}" stroke="${out}" stroke-width="3" stroke-linejoin="round" />
  <circle cx="105" cy="105" r="56" fill="${acc}" stroke="${out}" stroke-width="2.2" />
  <path d="M 118 68 A 38 38 0 1 0 118 142 A 28 28 0 1 1 118 68 Z" fill="${c2}" />
  <polygon points="134,88 138,98 148,98 140,104 143,114 134,108 125,114 128,104 120,98 130,98" fill="${c2}" />
</svg>`,
      };

    case 'hist-celtic-triquetra':
      return {
        viewBox: '0 0 210 210',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 210">
  <circle cx="105" cy="105" r="84" fill="${c1}" fill-opacity="0.24" stroke="${out}" stroke-width="3" />
  <circle cx="105" cy="105" r="56" fill="none" stroke="${c1}" stroke-width="12" />
  <circle cx="105" cy="105" r="56" fill="none" stroke="${out}" stroke-width="2.2" />
  <path d="M 105 32 C 138 76 138 134 105 168 C 72 134 72 76 105 32 Z" fill="none" stroke="${c2}" stroke-width="10" />
  <path d="M 42 142 C 62 94 114 70 168 142 C 122 154 78 154 42 142 Z" fill="none" stroke="${c2}" stroke-width="10" />
  <path d="M 168 142 C 114 70 62 94 42 142" fill="none" stroke="${out}" stroke-width="2.2" />
  <path d="M 105 32 C 138 76 138 134 105 168 C 72 134 72 76 105 32 Z" fill="none" stroke="${out}" stroke-width="2.2" />
</svg>`,
      };

    case 'hist-torii-gate':
      return {
        viewBox: '0 0 220 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200">
  <path d="M 18 32 Q 110 52 202 32 L 194 48 Q 110 64 26 48 Z" fill="${c2}" stroke="${out}" stroke-width="2.4" />
  <rect x="34" y="48" width="152" height="12" fill="${c1}" stroke="${out}" stroke-width="2.2" />
  <rect x="44" y="76" width="132" height="12" fill="${c1}" stroke="${out}" stroke-width="2.2" />
  <rect x="62" y="60" width="16" height="114" fill="${c1}" stroke="${out}" stroke-width="2.4" />
  <rect x="142" y="60" width="16" height="114" fill="${c1}" stroke="${out}" stroke-width="2.4" />
  <rect x="102" y="60" width="16" height="16" fill="${c1}" stroke="${out}" stroke-width="2" />
  <rect x="54" y="166" width="32" height="16" rx="2" fill="${c2}" stroke="${out}" stroke-width="2.2" />
  <rect x="134" y="166" width="32" height="16" rx="2" fill="${c2}" stroke="${out}" stroke-width="2.2" />
</svg>`,
      };

    case 'hist-golden-menorah':
      return {
        viewBox: '0 0 210 210',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 210">
  <path d="M 40 62 A 65 65 0 0 0 170 62" fill="none" stroke="${c1}" stroke-width="10" stroke-linecap="round" />
  <path d="M 64 62 A 41 41 0 0 0 146 62" fill="none" stroke="${c1}" stroke-width="9" stroke-linecap="round" />
  <line x1="105" y1="56" x2="105" y2="176" stroke="${c1}" stroke-width="10" stroke-linecap="round" />
  <rect x="64" y="172" width="82" height="16" rx="5" fill="${c1}" stroke="${out}" stroke-width="2.4" />
  <circle cx="40" cy="46" r="6" fill="${acc}" />
  <circle cx="64" cy="46" r="6" fill="${acc}" />
  <circle cx="105" cy="40" r="6.5" fill="${acc}" />
  <circle cx="146" cy="46" r="6" fill="${acc}" />
  <circle cx="170" cy="46" r="6" fill="${acc}" />
</svg>`,
      };

    case 'hist-harmony-bagua':
      return {
        viewBox: '0 0 210 210',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 210">
  <polygon points="70,22 140,22 188,70 188,140 140,188 70,188 22,140 22,70" fill="${c1}" stroke="${out}" stroke-width="3" />
  <circle cx="105" cy="105" r="52" fill="${c2}" stroke="${out}" stroke-width="2.6" />
  <path d="M 105 53 A 52 52 0 0 1 105 157 A 26 26 0 0 1 105 105 A 26 26 0 0 0 105 53 Z" fill="${acc}" />
  <circle cx="105" cy="79" r="7" fill="${c2}" />
  <circle cx="105" cy="131" r="7" fill="${acc}" />
</svg>`,
      };

    // ==================== 8 HERITAGE, MAP & GEOMETRIC BACKGROUNDS ====================
    case 'bg-vintage-nautical-map':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-nm" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-nm)" />
  <g opacity="0.22">
    ${drawCompassRosePaths(130, 270, 210, acc, c1)}
    ${drawCompassRosePaths(830, 270, 210, acc, c1)}
  </g>
  <g opacity="0.16">
    ${drawCompassRosePaths(480, 270, 120, out, c1)}
  </g>
  <rect x="18" y="18" width="924" height="504" fill="none" stroke="${out}" stroke-width="5" />
  <rect x="28" y="28" width="904" height="484" fill="none" stroke="${out}" stroke-width="1.5" stroke-dasharray="28 28" />
  <line x1="28" y1="270" x2="932" y2="270" stroke="${acc}" stroke-width="1" opacity="0.35" />
  <line x1="480" y1="28" x2="480" y2="512" stroke="${acc}" stroke-width="1" opacity="0.35" />
</svg>`,
      };

    case 'bg-vintage-parchment-scroll':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-ps" cx="50%" cy="50%" r="72%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-ps)" />
  <rect x="26" y="26" width="908" height="488" fill="none" stroke="${out}" stroke-width="2.5" />
  <rect x="36" y="36" width="888" height="468" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.65" />
  <path d="M 36 86 Q 86 86 86 36" fill="none" stroke="${out}" stroke-width="2.5" />
  <path d="M 924 86 Q 874 86 874 36" fill="none" stroke="${out}" stroke-width="2.5" />
  <path d="M 36 454 Q 86 454 86 504" fill="none" stroke="${out}" stroke-width="2.5" />
  <path d="M 924 454 Q 874 454 874 504" fill="none" stroke="${out}" stroke-width="2.5" />
</svg>`,
      };

    case 'bg-islamic-emerald-lanterns': {
      const lattice: string[] = [];
      for (let gx = 0; gx <= 480; gx += 46) {
        for (let gy = 260; gy <= 540; gy += 46) {
          lattice.push(
            `<polygon points="${gx},${gy - 22} ${gx + 22},${gy} ${gx},${gy + 22} ${gx - 22},${gy}" fill="none" stroke="${acc}" stroke-width="1.4" opacity="0.52" />`
          );
          lattice.push(`<circle cx="${gx}" cy="${gy}" r="4.5" fill="none" stroke="${out}" stroke-width="1.2" opacity="0.48" />`);
        }
      }
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-em" cx="35%" cy="35%" r="75%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </radialGradient>
    <clipPath id="${uid}-sw">
      <path d="M 0 120 Q 160 440 960 510 V 540 H 0 Z" />
    </clipPath>
    <radialGradient id="${uid}-lg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.7" />
      <stop offset="100%" stop-color="${acc}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-em)" />
  <g clip-path="url(#${uid}-sw)">
    ${lattice.join('')}
  </g>
  <path d="M 0 120 Q 160 440 960 510" fill="none" stroke="${acc}" stroke-width="5" />
  <path d="M 0 132 Q 156 448 960 522" fill="none" stroke="${out}" stroke-width="2" />
  <!-- Hanging Glowing Lanterns -->
  <line x1="170" y1="0" x2="170" y2="128" stroke="${acc}" stroke-width="2" />
  <circle cx="170" cy="176" r="46" fill="url(#${uid}-lg)" />
  <polygon points="146,144 194,144 186,204 154,204" fill="${acc}" stroke="${out}" stroke-width="2" />
  <polygon points="154,144 170,128 186,144" fill="${out}" />
  <polygon points="154,204 170,218 186,204" fill="${out}" />
  <rect x="160" y="154" width="20" height="38" rx="4" fill="#FFFBEB" opacity="0.88" />
  <line x1="296" y1="0" x2="296" y2="82" stroke="${acc}" stroke-width="1.8" />
  <circle cx="296" cy="118" r="34" fill="url(#${uid}-lg)" />
  <polygon points="278,94 314,94 308,138 284,138" fill="${acc}" stroke="${out}" stroke-width="1.8" />
  <polygon points="284,94 296,82 308,94" fill="${out}" />
  <rect x="289" y="102" width="14" height="26" rx="3" fill="#FFFBEB" opacity="0.85" />
</svg>`,
      };
    }

    case 'bg-islamic-star-border': {
      const renderRow = (yBase: number, flip: boolean) =>
        Array.from({ length: 8 }, (_, i) => {
          const cx = 60 + i * 120;
          const tip = flip ? yBase - 38 : yBase + 38;
          return `
            <polyline points="${cx - 60},${yBase} ${cx - 32},${yBase} ${cx},${tip} ${cx + 32},${yBase} ${cx + 60},${yBase}" fill="none" stroke="${acc}" stroke-width="6" stroke-linejoin="round" />
            <circle cx="${cx}" cy="${flip ? yBase - 14 : yBase + 14}" r="14" fill="none" stroke="${out}" stroke-width="3.5" />
            <polygon points="${cx},${(flip ? yBase - 24 : yBase + 4)} ${cx + 8},${(flip ? yBase - 14 : yBase + 14)} ${cx},${(flip ? yBase - 4 : yBase + 24)} ${cx - 8},${(flip ? yBase - 14 : yBase + 14)}" fill="${acc}" />
          `;
        }).join('');
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <linearGradient id="${uid}-sb" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-sb)" />
  ${renderRow(40, false)}
  ${renderRow(500, true)}
</svg>`,
      };
    }

    case 'bg-heritage-arabesque-navy': {
      const stars = Array.from({ length: 12 }, (_, c) =>
        Array.from({ length: 7 }, (_, r) => {
          const cx = 40 + c * 80;
          const cy = 40 + r * 80;
          return `<polygon points="${cx},${cy - 24} ${cx + 24},${cy} ${cx},${cy + 24} ${cx - 24},${cy}" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.24" /><rect x="${cx - 17}" y="${cy - 17}" width="34" height="34" fill="none" stroke="${out}" stroke-width="1" opacity="0.22" />`;
        }).join('')
      ).join('');
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-an" cx="50%" cy="50%" r="72%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-an)" />
  ${stars}
  <rect x="28" y="28" width="904" height="484" fill="none" stroke="${acc}" stroke-width="3" opacity="0.6" />
</svg>`,
      };
    }

    case 'bg-classical-marble-arch':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <linearGradient id="${uid}-ma" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-ma)" />
  <rect x="34" y="34" width="892" height="472" fill="none" stroke="${acc}" stroke-width="2.5" opacity="0.55" />
  <path d="M 100 506 V 220 A 380 180 0 0 1 860 220 V 506" fill="none" stroke="${out}" stroke-width="2" opacity="0.22" />
  <line x1="76" y1="34" x2="76" y2="506" stroke="${acc}" stroke-width="10" opacity="0.16" />
  <line x1="884" y1="34" x2="884" y2="506" stroke="${acc}" stroke-width="10" opacity="0.16" />
</svg>`,
      };

    case 'bg-calligraphy-ivory-frame':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-ci" cx="50%" cy="50%" r="72%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-ci)" />
  <path d="M 40 80 Q 80 80 80 40 H 880 Q 880 80 920 80 V 460 Q 880 460 880 500 H 80 Q 80 460 40 460 Z" fill="none" stroke="${acc}" stroke-width="3" />
  <path d="M 52 90 Q 90 90 90 52 H 870 Q 870 90 908 90 V 450 Q 870 450 870 488 H 90 Q 90 450 52 450 Z" fill="none" stroke="${out}" stroke-width="1.2" opacity="0.7" />
  <circle cx="480" cy="40" r="7" fill="${acc}" />
  <circle cx="480" cy="500" r="7" fill="${acc}" />
</svg>`,
      };

    case 'bg-royal-burgundy-crest':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-rb" cx="50%" cy="50%" r="72%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-rb)" />
  <rect x="28" y="28" width="904" height="484" rx="14" fill="none" stroke="${acc}" stroke-width="4" />
  <rect x="40" y="40" width="880" height="460" rx="8" fill="none" stroke="${out}" stroke-width="1.5" stroke-dasharray="10 6" />
  <circle cx="480" cy="28" r="10" fill="${acc}" />
  <circle cx="480" cy="512" r="10" fill="${acc}" />
</svg>`,
      };

    default:
      return null;
  }
}
