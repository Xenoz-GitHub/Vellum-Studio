import type { CutoutItemDef } from './svg-cutout-renderer';

export const CRAYON_DOODLE_CATALOG: CutoutItemDef[] = [
  {
    kind: 'crayon-sun',
    name: 'Crayon Chalk Sun',
    category: 'Doodles & Crayon',
    keywords: ['crayon', 'chalk', 'sun', 'pastel', 'summer', 'sketch', 'yellow', 'rays'],
    defaultWidth: 260,
    defaultHeight: 260,
    defaultProps: {
      stickerKind: 'crayon-sun',
      label: '',
      primaryColor: '#FDE068',
      secondaryColor: '#FACC15',
      accentColor: '#FEF08A',
      outlineColor: '#EAB308',
    },
  },
  {
    kind: 'crayon-cloud',
    name: 'Crayon Pastel Cloud',
    category: 'Doodles & Crayon',
    keywords: ['crayon', 'chalk', 'cloud', 'pastel', 'cyan', 'blue', 'sketch', 'sky'],
    defaultWidth: 270,
    defaultHeight: 195,
    defaultProps: {
      stickerKind: 'crayon-cloud',
      label: '',
      primaryColor: '#00D4FF',
      secondaryColor: '#7CEEFF',
      accentColor: '#BAE6FD',
      outlineColor: '#00B8E6',
    },
  },
  {
    kind: 'doodle-megaphone',
    name: 'Ink Doodle Megaphone',
    category: 'Doodles & Crayon',
    keywords: ['doodle', 'ink', 'megaphone', 'announcement', 'speaker', 'sketch', 'shout'],
    defaultWidth: 250,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'doodle-megaphone',
      label: '',
      primaryColor: '#163A5F',
      secondaryColor: '#FFFFFF',
      accentColor: '#38BDF8',
      outlineColor: '#163A5F',
    },
  },
  {
    kind: 'doodle-butterfly',
    name: 'Ink Doodle Butterfly',
    category: 'Doodles & Crayon',
    keywords: ['doodle', 'ink', 'butterfly', 'sketch', 'nature', 'spring'],
    defaultWidth: 220,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'doodle-butterfly',
      label: '',
      primaryColor: '#163A5F',
      secondaryColor: '#FFFFFF',
      accentColor: '#163A5F',
      outlineColor: '#163A5F',
    },
  },
  {
    kind: 'doodle-stars-cluster',
    name: 'Ink Doodle Stars',
    category: 'Doodles & Crayon',
    keywords: ['doodle', 'ink', 'stars', 'sketch', 'sparkle', 'cluster'],
    defaultWidth: 210,
    defaultHeight: 190,
    defaultProps: {
      stickerKind: 'doodle-stars-cluster',
      label: '',
      primaryColor: '#163A5F',
      secondaryColor: '#FFFFFF',
      accentColor: '#163A5F',
      outlineColor: '#163A5F',
    },
  },
  {
    kind: 'doodle-cat-face',
    name: 'Ink Doodle Cat',
    category: 'Doodles & Crayon',
    keywords: ['doodle', 'ink', 'cat', 'kitty', 'face', 'sketch', 'cute'],
    defaultWidth: 200,
    defaultHeight: 160,
    defaultProps: {
      stickerKind: 'doodle-cat-face',
      label: '',
      primaryColor: '#163A5F',
      secondaryColor: '#FFFFFF',
      accentColor: '#163A5F',
      outlineColor: '#163A5F',
    },
  },
  {
    kind: 'doodle-needle-sparkles',
    name: 'Needle Starbursts',
    category: 'Doodles & Crayon',
    keywords: ['doodle', 'ink', 'sparkles', 'starburst', 'needle', 'shine', 'twinkle'],
    defaultWidth: 220,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'doodle-needle-sparkles',
      label: '',
      primaryColor: '#163A5F',
      secondaryColor: '#FFFFFF',
      accentColor: '#163A5F',
      outlineColor: '#163A5F',
    },
  },
  {
    kind: 'doodle-starfish',
    name: 'Ink Doodle Starfish',
    category: 'Doodles & Crayon',
    keywords: ['doodle', 'ink', 'starfish', 'ocean', 'beach', 'summer', 'sketch'],
    defaultWidth: 220,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'doodle-starfish',
      label: '',
      primaryColor: '#163A5F',
      secondaryColor: '#FFFFFF',
      accentColor: '#163A5F',
      outlineColor: '#163A5F',
    },
  },
  {
    kind: 'crayon-star',
    name: 'Crayon Chalk Star',
    category: 'Doodles & Crayon',
    keywords: ['crayon', 'chalk', 'star', 'pastel', 'sketch', 'yellow'],
    defaultWidth: 200,
    defaultHeight: 200,
    defaultProps: {
      stickerKind: 'crayon-star',
      label: '',
      primaryColor: '#FDE047',
      secondaryColor: '#FB923C',
      accentColor: '#FEF9C3',
      outlineColor: '#F59E0B',
    },
  },
  {
    kind: 'doodle-crown',
    name: 'Ink Doodle Crown',
    category: 'Doodles & Crayon',
    keywords: ['doodle', 'ink', 'crown', 'sketch', 'king', 'queen', 'royal'],
    defaultWidth: 210,
    defaultHeight: 160,
    defaultProps: {
      stickerKind: 'doodle-crown',
      label: '',
      primaryColor: '#163A5F',
      secondaryColor: '#FACC15',
      accentColor: '#163A5F',
      outlineColor: '#163A5F',
    },
  },
];

// Deterministic PRNG for organic crayon grain stipples
function makeRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function renderCrayonDoodleSvg(
  kind: string,
  c1: string,
  c2: string,
  _acc: string,
  out: string,
  uid: string
): { viewBox: string; svg: string } | null {
  switch (kind) {
    case 'crayon-sun': {
      const rng = makeRng(4011);
      // Organic chalk stipple clusters inside circle (cx=130, cy=130, r=52)
      let speckles = '';
      for (let i = 0; i < 210; i++) {
        const angle = rng() * Math.PI * 2;
        const rad = Math.sqrt(rng()) * 51;
        const px = 130 + Math.cos(angle) * rad;
        const py = 130 + Math.sin(angle) * rad;
        const sr = 1.1 + rng() * 3.1;
        const op = (0.38 + rng() * 0.6).toFixed(2);
        speckles += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${sr.toFixed(1)}" fill="${c1}" opacity="${op}"/>`;
      }
      // Subtle chalky background holes/grain contrast dots
      for (let i = 0; i < 65; i++) {
        const angle = rng() * Math.PI * 2;
        const rad = Math.sqrt(rng()) * 47;
        const px = 130 + Math.cos(angle) * rad;
        const py = 130 + Math.sin(angle) * rad;
        const sr = 1.0 + rng() * 2.2;
        speckles += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${sr.toFixed(1)}" fill="#FFFFFF" opacity="${(0.28 + rng() * 0.42).toFixed(2)}"/>`;
      }
      // 11 hand-drawn chalk rays with broken textured strokes
      let rays = '';
      const rayCount = 11;
      for (let i = 0; i < rayCount; i++) {
        const baseAng = (i / rayCount) * Math.PI * 2 - Math.PI / 2 + (rng() - 0.5) * 0.12;
        const r1 = 62 + rng() * 4;
        const r2 = 104 + rng() * 14;
        const x1 = 130 + Math.cos(baseAng) * r1;
        const y1 = 130 + Math.sin(baseAng) * r1;
        const x2 = 130 + Math.cos(baseAng) * r2;
        const y2 = 130 + Math.sin(baseAng) * r2;
        rays += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c1}" stroke-width="${(4.4 + rng() * 1.8).toFixed(1)}" stroke-linecap="round" stroke-dasharray="${(7 + rng() * 6).toFixed(1)} ${(2 + rng() * 2.5).toFixed(1)} ${(12 + rng() * 8).toFixed(1)} ${(1.8 + rng() * 2).toFixed(1)}"/>`;
        // Extra chalk texture dots along each ray
        for (let k = 0; k < 5; k++) {
          const t = 0.15 + rng() * 0.8;
          const dx = x1 + (x2 - x1) * t + (rng() - 0.5) * 4.5;
          const dy = y1 + (y2 - y1) * t + (rng() - 0.5) * 4.5;
          rays += `<circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="${(1.1 + rng() * 1.6).toFixed(1)}" fill="${c1}" opacity="0.82"/>`;
        }
      }

      return {
        viewBox: '0 0 260 260',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260">
  <circle cx="130" cy="130" r="50" fill="${c1}" opacity="0.58"/>
  <circle cx="130" cy="130" r="51" fill="none" stroke="${c1}" stroke-width="4.5" stroke-dasharray="9 4 14 3 6 4" stroke-linecap="round"/>
  <circle cx="130" cy="130" r="46" fill="none" stroke="${c2}" stroke-width="3" stroke-dasharray="5 5 11 4" stroke-linecap="round" opacity="0.72"/>
  ${speckles}
  ${rays}
</svg>`,
      };
    }

    case 'crayon-cloud': {
      const rng = makeRng(8821);
      const cloudPath =
        'M66 154 C36 154 20 132 28 106 C34 86 54 78 72 82 C82 48 118 30 152 44 C170 52 182 68 186 84 C210 80 236 96 238 122 C240 144 220 156 194 156 C164 156 102 154 66 154 Z';
      let hatches = '';
      // Diagonal hand-drawn crayon hatch lines clipped to cloud
      for (let x = 18; x <= 246; x += 9) {
        const y1 = 166;
        const y2 = 28 + (rng() - 0.5) * 8;
        const xOff = 36 + (rng() - 0.5) * 6;
        hatches += `<line x1="${x}" y1="${y1}" x2="${x + xOff}" y2="${y2.toFixed(1)}" stroke="${c1}" stroke-width="${(2.6 + rng() * 2.2).toFixed(1)}" stroke-linecap="round" stroke-dasharray="${(8 + rng() * 9).toFixed(1)} ${(2.5 + rng() * 3).toFixed(1)}" opacity="${(0.52 + rng() * 0.38).toFixed(2)}"/>`;
      }
      // Chalky edge dots around contour
      let speckles = '';
      for (let i = 0; i < 95; i++) {
        const px = 32 + rng() * 202;
        const py = 46 + rng() * 108;
        speckles += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(1.1 + rng() * 2.2).toFixed(1)}" fill="${c2}" opacity="${(0.35 + rng() * 0.45).toFixed(2)}"/>`;
      }
      return {
        viewBox: '0 0 270 195',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 195">
  <defs>
    <clipPath id="${uid}-cld-clip"><path d="${cloudPath}"/></clipPath>
  </defs>
  <g clip-path="url(#${uid}-cld-clip)">
    <path d="${cloudPath}" fill="${c2}" opacity="0.28"/>
    ${hatches}
    ${speckles}
  </g>
  <path d="${cloudPath}" fill="none" stroke="${c1}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="14 3 9 2.5 18 3"/>
  <path d="M68 151 C40 151 24 130 32 106 C38 88 57 81 74 85 C84 52 119 34 151 47 C168 55 180 70 183 86 C206 82 232 98 234 122 C236 141 217 153 192 153 Z" fill="none" stroke="${out}" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4 12 3" opacity="0.88"/>
</svg>`,
      };
    }

    case 'doodle-megaphone':
      return {
        viewBox: '0 0 250 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 220">
  <!-- Jagged Lightning Sound Waves -->
  <path d="M84 114 L52 126 L60 132 L26 148" fill="none" stroke="${c1}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M98 136 L76 164 L84 170 L66 196" fill="none" stroke="${c1}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M80 96 L46 92 L52 84 L22 76" fill="none" stroke="${c1}" stroke-width="3.0" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- 4-point Doodle Sparkles -->
  <path d="M74 28 Q76 42 90 44 Q76 46 74 60 Q72 46 58 44 Q72 42 74 28 Z" fill="none" stroke="${c1}" stroke-width="2.8" stroke-linejoin="round"/>
  <path d="M112 162 Q114 172 124 174 Q114 176 112 186 Q110 176 100 174 Q110 172 112 162 Z" fill="none" stroke="${c1}" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M22 108 Q24 116 32 118 Q24 120 22 128 Q20 120 12 118 Q20 116 22 108 Z" fill="none" stroke="${c1}" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Hand-drawn Megaphone Body -->
  <g transform="rotate(-12 152 104)">
    <!-- Solid Horn Front Fill -->
    <polygon points="88,72 152,82 152,126 88,136" fill="${c1}" opacity="0.92"/>
    <path d="M88 72 L152 82 L152 126 L88 136 Z" fill="none" stroke="${c1}" stroke-width="3.6" stroke-linejoin="round"/>
    <!-- Rim Oval -->
    <ellipse cx="88" cy="104" rx="10" ry="33" fill="${c2}" stroke="${c1}" stroke-width="3.4"/>
    <ellipse cx="88" cy="104" rx="4.5" ry="17" fill="${c1}"/>
    <!-- Rear Barrel -->
    <path d="M152 82 L202 84 C210 84 214 92 214 104 C214 116 210 124 202 124 L152 126 Z" fill="${c2}" stroke="${c1}" stroke-width="3.6" stroke-linejoin="round"/>
    <!-- Top Sight / Hinge -->
    <rect x="166" y="72" width="16" height="10" rx="2" fill="${c2}" stroke="${c1}" stroke-width="3"/>
    <!-- Back Cap -->
    <path d="M214 96 L222 98 L222 110 L214 112" fill="none" stroke="${c1}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Handle & Trigger -->
    <path d="M174 125 L190 162 L176 168 L158 126" fill="${c2}" stroke="${c1}" stroke-width="3.6" stroke-linejoin="round"/>
    <path d="M164 134 C156 140 158 148 166 150" fill="none" stroke="${c1}" stroke-width="2.8" stroke-linecap="round"/>
  </g>
</svg>`,
      };

    case 'doodle-butterfly':
      return {
        viewBox: '0 0 220 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200">
  <!-- Antennae -->
  <path d="M104 72 C96 48 82 38 68 40" fill="none" stroke="${c1}" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M116 72 C124 48 138 38 152 40" fill="none" stroke="${c1}" stroke-width="3.2" stroke-linecap="round"/>
  <!-- Left Upper & Lower Sketch Wings -->
  <path d="M104 88 C74 44 26 42 24 76 C22 104 62 114 102 104" fill="${c2}" stroke="${c1}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M100 91 C74 54 34 52 32 78 C30 98 64 107 98 100" fill="none" stroke="${c1}" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
  <path d="M102 108 C64 112 36 134 44 156 C52 178 90 166 104 126" fill="${c2}" stroke="${c1}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M98 114 C68 118 46 136 52 152" fill="none" stroke="${c1}" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
  <!-- Right Upper & Lower Sketch Wings -->
  <path d="M116 88 C146 44 194 42 196 76 C198 104 158 114 118 104" fill="${c2}" stroke="${c1}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M120 91 C146 54 186 52 188 78 C190 98 156 107 122 100" fill="none" stroke="${c1}" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
  <path d="M118 108 C156 112 184 134 176 156 C168 178 130 166 116 126" fill="${c2}" stroke="${c1}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M122 114 C152 118 174 136 168 152" fill="none" stroke="${c1}" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
  <!-- Central Body -->
  <ellipse cx="110" cy="108" rx="8" ry="38" fill="${c2}" stroke="${c1}" stroke-width="3.6"/>
  <circle cx="110" cy="70" r="6" fill="${c1}"/>
</svg>`,
      };

    case 'doodle-stars-cluster':
      return {
        viewBox: '0 0 210 190',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 190">
  <!-- Top-Left 7-pt Doodle Star -->
  <path d="M58 24 L65 44 L86 38 L72 56 L92 68 L68 72 L70 94 L55 76 L34 86 L44 65 L24 54 L46 48 Z" fill="none" stroke="${c1}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M59 27 L66 46 L84 40" fill="none" stroke="${c1}" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
  <!-- Right 6-pt Doodle Star -->
  <path d="M150 62 L159 80 L180 78 L166 94 L182 112 L158 108 L152 128 L142 108 L120 112 L134 94 L120 76 L142 80 Z" fill="none" stroke="${c1}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M165 95 L180 111 L157 107" fill="none" stroke="${c1}" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
  <!-- Bottom-Left 7-pt Doodle Star -->
  <path d="M74 114 L82 132 L104 128 L88 144 L104 162 L82 158 L76 178 L66 160 L44 168 L54 148 L36 138 L58 134 Z" fill="none" stroke="${c1}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`,
      };

    case 'doodle-cat-face':
      return {
        viewBox: '0 0 200 160',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160">
  <!-- Ears with Open Top Forehead Gap -->
  <path d="M56 76 L62 38 L86 58" fill="none" stroke="${c1}" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M114 58 L138 38 L144 76" fill="none" stroke="${c1}" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Curved Jawline -->
  <path d="M58 104 C66 132 134 132 142 104" fill="none" stroke="${c1}" stroke-width="5.2" stroke-linecap="round"/>
  <!-- Eyes -->
  <circle cx="82" cy="78" r="5.5" fill="${c1}"/>
  <circle cx="118" cy="78" r="5.5" fill="${c1}"/>
  <!-- Nose + W Mouth -->
  <polygon points="95,88 105,88 100,95" fill="${c1}"/>
  <path d="M100 94 L100 99 M92 100 Q96 105 100 99 Q104 105 108 100" fill="none" stroke="${c1}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Left & Right Whiskers -->
  <path d="M56 80 L24 72 M54 91 L20 91 M56 101 L26 110" fill="none" stroke="${c1}" stroke-width="4.4" stroke-linecap="round"/>
  <path d="M144 80 L176 72 M146 91 L180 91 M144 101 L174 110" fill="none" stroke="${c1}" stroke-width="4.4" stroke-linecap="round"/>
</svg>`,
      };

    case 'doodle-needle-sparkles':
      return {
        viewBox: '0 0 220 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200">
  <!-- Left Sharp Needle Starburst -->
  <g transform="translate(64, 64)">
    <line x1="0" y1="-42" x2="0" y2="42" stroke="${c1}" stroke-width="3.2" stroke-linecap="round"/>
    <line x1="-38" y1="0" x2="38" y2="0" stroke="${c1}" stroke-width="3.2" stroke-linecap="round"/>
    <line x1="-18" y1="-18" x2="18" y2="18" stroke="${c1}" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="18" y1="-18" x2="-18" y2="18" stroke="${c1}" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="3.5" fill="${c1}"/>
  </g>
  <!-- Right Larger Needle Starburst -->
  <g transform="translate(154, 126)">
    <line x1="0" y1="-54" x2="0" y2="54" stroke="${c1}" stroke-width="3.4" stroke-linecap="round"/>
    <line x1="-46" y1="0" x2="46" y2="0" stroke="${c1}" stroke-width="3.4" stroke-linecap="round"/>
    <line x1="-22" y1="-22" x2="22" y2="22" stroke="${c1}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="22" y1="-22" x2="-22" y2="22" stroke="${c1}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="4" fill="${c1}"/>
  </g>
  <!-- Tiny Plus & Circle Accents -->
  <path d="M148 36 V54 M139 45 H157" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
  <path d="M98 144 V160 M90 152 H106" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="52" cy="134" r="5" fill="none" stroke="${c1}" stroke-width="2.8"/>
  <circle cx="118" cy="84" r="4.5" fill="none" stroke="${c1}" stroke-width="2.6"/>
  <circle cx="192" cy="170" r="4.5" fill="none" stroke="${c1}" stroke-width="2.6"/>
</svg>`,
      };

    case 'doodle-starfish':
      return {
        viewBox: '0 0 220 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
  <!-- Organic Hand-Drawn Coastal Starfish Outline -->
  <path d="M110 20 C118 20 124 62 134 76 C148 80 194 64 198 76 C202 88 158 108 150 124 C156 142 184 182 174 190 C164 198 130 162 114 156 C96 164 62 200 50 190 C40 182 68 142 74 124 C64 108 22 92 24 80 C26 68 74 82 88 76 C98 62 102 20 110 20 Z" fill="none" stroke="${c1}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>
  <!-- Central Ring & Arm Rib Lines -->
  <circle cx="112" cy="112" r="9" fill="none" stroke="${c1}" stroke-width="2.8"/>
  <path d="M112 102 C111 78 111 52 110 30" fill="none" stroke="${c1}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M121 108 C142 98 164 88 186 79" fill="none" stroke="${c1}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M118 120 C134 140 150 160 166 180" fill="none" stroke="${c1}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M105 120 C90 140 74 160 58 180" fill="none" stroke="${c1}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M102 109 C80 100 58 91 36 83" fill="none" stroke="${c1}" stroke-width="2.4" stroke-linecap="round"/>
</svg>`,
      };

    case 'crayon-star': {
      const rng = makeRng(5521);
      const pts = '100,18 124,70 180,76 138,114 150,170 100,142 50,170 62,114 20,76 76,70';
      let speckles = '';
      for (let i = 0; i < 120; i++) {
        const px = 38 + rng() * 124;
        const py = 36 + rng() * 124;
        speckles += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(1.2 + rng() * 2.4).toFixed(1)}" fill="${c1}" opacity="${(0.45 + rng() * 0.5).toFixed(2)}"/>`;
      }
      return {
        viewBox: '0 0 200 200',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <clipPath id="${uid}-cst-clip"><polygon points="${pts}"/></clipPath>
  </defs>
  <g clip-path="url(#${uid}-cst-clip)">
    <polygon points="${pts}" fill="${c1}" opacity="0.52"/>
    ${speckles}
  </g>
  <polygon points="${pts}" fill="none" stroke="${c1}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="14 4 9 3"/>
  <polygon points="${pts}" fill="none" stroke="${out}" stroke-width="2.8" stroke-linejoin="round" stroke-dasharray="8 4" opacity="0.85"/>
</svg>`,
      };
    }

    case 'doodle-crown':
      return {
        viewBox: '0 0 210 160',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 160">
  <path d="M26 122 L20 52 L66 86 L105 32 L144 86 L190 52 L184 122 Z" fill="none" stroke="${c1}" stroke-width="4.2" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M30 118 L24 58 L67 90 L105 38 L143 90 L186 58 L180 118" fill="none" stroke="${c1}" stroke-width="1.8" stroke-linejoin="round" opacity="0.72"/>
  <line x1="28" y1="136" x2="182" y2="136" stroke="${c1}" stroke-width="4.2" stroke-linecap="round"/>
  <circle cx="20" cy="46" r="5" fill="${c1}"/>
  <circle cx="105" cy="24" r="6" fill="${c1}"/>
  <circle cx="190" cy="46" r="5" fill="${c1}"/>
</svg>`,
      };

    default:
      return null;
  }
}
