export type PhotoFrameCategory = 'Device & Editorial' | 'Basic Shapes' | 'Organic & Badges' | 'Christmas & New Year';

export interface PhotoFrameDef {
  kind: string;
  name: string;
  category: PhotoFrameCategory;
  viewBoxW: number;
  viewBoxH: number;
  /** SVG path defining the clipped photo cavity in viewBox coordinates */
  clipPathD: string;
  /** Photo cavity box inside viewBox coordinates (used for pan/zoom calculation) */
  cavity: { x: number; y: number; width: number; height: number };
  /** Optional stroke outline path around the shape when empty */
  outlineD?: string;
  /** Optional decorative frame bezel/chrome rendered behind the photo */
  underlaySvg?: (uid: string, tintColor: string, accentColor: string) => string;
  /** Optional decorative frame bezel/chrome rendered on top of the photo */
  overlaySvg?: (uid: string, tintColor: string, accentColor: string) => string;
  defaultWidth: number;
  defaultHeight: number;
}

export interface FreedrawFrameResult {
  x: number;
  y: number;
  width: number;
  height: number;
  viewBoxW: number;
  viewBoxH: number;
  clipPathD: string;
}

/**
 * Converts a user's freehand pointer stroke in slide coordinates into a smooth closed SVG clipPath.
 */
export function buildFreedrawPathFromPoints(
  rawPoints: Array<{ x: number; y: number }>
): FreedrawFrameResult | null {
  if (!rawPoints || rawPoints.length < 3) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const pt of rawPoints) {
    if (pt.x < minX) minX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y > maxY) maxY = pt.y;
  }

  const rawW = maxX - minX;
  const rawH = maxY - minY;
  if (rawW < 24 || rawH < 24) return null;

  const pad = 6;
  const viewBoxW = Math.max(80, Math.round(rawW + pad * 2));
  const viewBoxH = Math.max(80, Math.round(rawH + pad * 2));

  // Subsample dense strokes so quadratic bezier segments stay smooth and compact
  const filtered: Array<{ x: number; y: number }> = [];
  const minStep = Math.max(6, Math.min(rawW, rawH) * 0.045);
  for (const pt of rawPoints) {
    const local = {
      x: pt.x - minX + pad,
      y: pt.y - minY + pad,
    };
    const prev = filtered[filtered.length - 1];
    if (!prev || Math.hypot(local.x - prev.x, local.y - prev.y) >= minStep) {
      filtered.push(local);
    }
  }
  if (filtered.length < 3) return null;

  const pts = filtered;
  const n = pts.length;
  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const firstMid = mid(pts[n - 1], pts[0]);
  let d = `M ${firstMid.x.toFixed(1)} ${firstMid.y.toFixed(1)} `;
  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const m = mid(cur, next);
    d += `Q ${cur.x.toFixed(1)} ${cur.y.toFixed(1)} ${m.x.toFixed(1)} ${m.y.toFixed(1)} `;
  }
  d += 'Z';

  return {
    x: Math.round(minX - pad),
    y: Math.round(minY - pad),
    width: Math.round(viewBoxW),
    height: Math.round(viewBoxH),
    viewBoxW,
    viewBoxH,
    clipPathD: d,
  };
}

// Helper to create regular polygon path centered at (100,100)
function regularPolyPath(sides: number, rx: number, ry: number, offsetDeg = -90): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const a = ((offsetDeg + (360 / sides) * i) * Math.PI) / 180;
    pts.push(`${(100 + rx * Math.cos(a)).toFixed(2)} ${(100 + ry * Math.sin(a)).toFixed(2)}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

// Helper to create star/burst polygon path centered at (100,100)
function starBurstPath(points: number, outerR: number, innerR: number, offsetDeg = -90): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = ((offsetDeg + (180 / points) * i) * Math.PI) / 180;
    pts.push(`${(100 + r * Math.cos(a)).toFixed(2)} ${(100 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

// Helper to create scalloped seal / wavy badge path
function scallopSealPath(lobes: number, baseR: number, amp: number): string {
  const steps = lobes * 2;
  let d = '';
  for (let i = 0; i < steps; i++) {
    const a1 = ((i * 360) / steps) * (Math.PI / 180);
    const aMid = (((i + 0.5) * 360) / steps) * (Math.PI / 180);
    const a2 = (((i + 1) * 360) / steps) * (Math.PI / 180);
    const rOuter = baseR + (i % 2 === 0 ? amp : -amp * 0.4);
    const x1 = 100 + baseR * Math.cos(a1);
    const y1 = 100 + baseR * Math.sin(a1);
    const cx = 100 + rOuter * Math.cos(aMid);
    const cy = 100 + rOuter * Math.sin(aMid);
    const x2 = 100 + baseR * Math.cos(a2);
    const y2 = 100 + baseR * Math.sin(a2);
    if (i === 0) d += `M ${x1.toFixed(2)} ${y1.toFixed(2)} `;
    d += `Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)} `;
  }
  return d + 'Z';
}

export const PHOTO_FRAME_CATALOG: PhotoFrameDef[] = [
  // ================= DEVICE & EDITORIAL FRAMES (10) =================
  {
    kind: 'polaroid-classic',
    name: 'Polaroid Print',
    category: 'Device & Editorial',
    viewBoxW: 200,
    viewBoxH: 230,
    clipPathD: 'M 18 18 H 182 V 178 H 18 Z',
    cavity: { x: 18, y: 18, width: 164, height: 160 },
    defaultWidth: 300,
    defaultHeight: 345,
    underlaySvg: () => `
      <rect x="4" y="4" width="192" height="222" rx="6" fill="#FFFFFF" stroke="#D6D3CD" stroke-width="2" />
      <rect x="18" y="18" width="164" height="160" fill="#E5E7EB" />
    `,
    overlaySvg: (_uid, _tint, accent) => `
      <rect x="18" y="18" width="164" height="160" fill="none" stroke="rgba(15,23,42,0.12)" stroke-width="1.5" />
      <line x1="58" y1="204" x2="142" y2="204" stroke="${accent}" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round" />
    `,
  },
  {
    kind: 'smartphone-modern',
    name: 'Smartphone Screen',
    category: 'Device & Editorial',
    viewBoxW: 160,
    viewBoxH: 300,
    clipPathD:
      'M 14 26 Q 14 14 26 14 H 134 Q 146 14 146 26 V 274 Q 146 286 134 286 H 26 Q 14 286 14 274 Z',
    cavity: { x: 14, y: 14, width: 132, height: 272 },
    defaultWidth: 220,
    defaultHeight: 412,
    underlaySvg: () => `
      <rect x="4" y="4" width="152" height="292" rx="24" fill="#18181B" stroke="#52525B" stroke-width="2.5" />
    `,
    overlaySvg: () => `
      <rect x="56" y="21" width="48" height="10" rx="5" fill="#09090B" />
      <circle cx="94" cy="26" r="2.2" fill="#3F3F46" />
      <rect x="56" y="275" width="48" height="3.5" rx="1.75" fill="rgba(255,255,255,0.65)" />
    `,
  },
  {
    kind: 'laptop-studio',
    name: 'Studio Laptop',
    category: 'Device & Editorial',
    viewBoxW: 280,
    viewBoxH: 185,
    clipPathD: 'M 32 20 H 248 V 146 H 32 Z',
    cavity: { x: 32, y: 20, width: 216, height: 126 },
    defaultWidth: 460,
    defaultHeight: 304,
    underlaySvg: () => `
      <rect x="22" y="10" width="236" height="148" rx="10" fill="#1E293B" stroke="#64748B" stroke-width="2" />
      <circle cx="140" cy="15" r="2" fill="#475569" />
      <path d="M 6 158 H 274 L 266 174 Q 262 178 254 178 H 26 Q 18 178 14 174 Z" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1.5" />
      <rect x="112" y="158" width="56" height="5" rx="2.5" fill="#94A3B8" />
    `,
  },
  {
    kind: 'browser-window',
    name: 'Browser Window',
    category: 'Device & Editorial',
    viewBoxW: 260,
    viewBoxH: 190,
    clipPathD: 'M 10 38 H 250 V 180 Q 250 184 246 184 H 14 Q 10 184 10 180 Z',
    cavity: { x: 10, y: 38, width: 240, height: 146 },
    defaultWidth: 440,
    defaultHeight: 322,
    underlaySvg: (_uid, tint) => `
      <rect x="8" y="8" width="244" height="178" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
      <path d="M 8 18 Q 8 8 18 8 H 242 Q 252 8 252 18 V 38 H 8 Z" fill="#F1F5F9" />
      <circle cx="24" cy="23" r="4.5" fill="#F87171" />
      <circle cx="38" cy="23" r="4.5" fill="#FBBF24" />
      <circle cx="52" cy="23" r="4.5" fill="#34D399" />
      <rect x="72" y="15" width="124" height="16" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
      <line x1="8" y1="38" x2="252" y2="38" stroke="${tint}" stroke-opacity="0.25" stroke-width="1.5" />
    `,
  },
  {
    kind: 'vintage-monitor',
    name: '90s Desktop CRT',
    category: 'Device & Editorial',
    viewBoxW: 220,
    viewBoxH: 210,
    clipPathD:
      'M 30 30 Q 30 24 38 24 H 182 Q 190 24 190 30 V 136 Q 190 144 182 144 H 38 Q 30 144 30 136 Z',
    cavity: { x: 30, y: 24, width: 160, height: 120 },
    defaultWidth: 360,
    defaultHeight: 344,
    underlaySvg: (_uid, _tint, accent) => `
      <rect x="12" y="10" width="196" height="154" rx="14" fill="#E4DFD3" stroke="#9A9486" stroke-width="2.5" />
      <rect x="24" y="18" width="172" height="132" rx="10" fill="#B8B2A5" stroke="#8C867A" stroke-width="1.5" />
      <rect x="78" y="164" width="64" height="16" fill="#C7C1B5" stroke="#9A9486" stroke-width="1.5" />
      <rect x="34" y="178" width="152" height="22" rx="5" fill="#DCD6C8" stroke="#9A9486" stroke-width="2" />
      <rect x="148" y="185" width="26" height="6" rx="2" fill="#475569" />
      <circle cx="170" cy="155" r="3" fill="${accent}" />
    `,
  },
  {
    kind: 'film-strip',
    name: '35mm Film Frame',
    category: 'Device & Editorial',
    viewBoxW: 240,
    viewBoxH: 180,
    clipPathD: 'M 20 34 H 220 V 146 H 20 Z',
    cavity: { x: 20, y: 34, width: 200, height: 112 },
    defaultWidth: 420,
    defaultHeight: 315,
    underlaySvg: () => {
      const holes = [18, 44, 70, 96, 122, 148, 174, 200]
        .map(
          (hx) =>
            `<rect x="${hx}" y="12" width="14" height="12" rx="2.5" fill="#F8FAFC" />` +
            `<rect x="${hx}" y="156" width="14" height="12" rx="2.5" fill="#F8FAFC" />`
        )
        .join('');
      return `
        <rect x="4" y="4" width="232" height="172" rx="6" fill="#18181B" />
        ${holes}
      `;
    },
  },
  {
    kind: 'postage-stamp',
    name: 'Postage Stamp',
    category: 'Device & Editorial',
    viewBoxW: 200,
    viewBoxH: 230,
    clipPathD: 'M 22 22 H 178 V 208 H 22 Z',
    cavity: { x: 22, y: 22, width: 156, height: 186 },
    defaultWidth: 290,
    defaultHeight: 334,
    underlaySvg: () => {
      const teethTop = [20, 40, 60, 80, 100, 120, 140, 160, 180]
        .map(
          (cx) =>
            `<circle cx="${cx}" cy="6" r="6" fill="#FFFFFF" />` +
            `<circle cx="${cx}" cy="224" r="6" fill="#FFFFFF" />`
        )
        .join('');
      const teethSide = [25, 50, 75, 100, 125, 150, 175, 200]
        .map(
          (cy) =>
            `<circle cx="6" cy="${cy}" r="6" fill="#FFFFFF" />` +
            `<circle cx="194" cy="${cy}" r="6" fill="#FFFFFF" />`
        )
        .join('');
      return `
        <rect x="8" y="8" width="184" height="214" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="1.5" />
        ${teethTop}
        ${teethSide}
      `;
    },
  },
  {
    kind: 'vinyl-sleeve',
    name: 'Vinyl Album Sleeve',
    category: 'Device & Editorial',
    viewBoxW: 250,
    viewBoxH: 200,
    clipPathD: 'M 10 10 H 184 V 190 H 10 Z',
    cavity: { x: 10, y: 10, width: 174, height: 180 },
    defaultWidth: 380,
    defaultHeight: 304,
    underlaySvg: (_uid, _tint, accent) => `
      <circle cx="176" cy="100" r="66" fill="#111827" stroke="#334155" stroke-width="2" />
      <circle cx="176" cy="100" r="52" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1.2" />
      <circle cx="176" cy="100" r="38" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1.2" />
      <circle cx="176" cy="100" r="22" fill="${accent}" />
      <circle cx="176" cy="100" r="5" fill="#FFFFFF" />
      <rect x="8" y="8" width="178" height="184" rx="4" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="1.5" />
    `,
  },
  {
    kind: 'ticket-stub',
    name: 'Cinema Ticket',
    category: 'Device & Editorial',
    viewBoxW: 260,
    viewBoxH: 150,
    clipPathD:
      'M 22 10 H 238 A 14 14 0 0 0 250 22 V 128 A 14 14 0 0 0 238 140 H 22 A 14 14 0 0 0 10 128 V 22 A 14 14 0 0 0 22 10 Z',
    cavity: { x: 10, y: 10, width: 240, height: 130 },
    defaultWidth: 420,
    defaultHeight: 242,
    overlaySvg: () => `
      <line x1="196" y1="16" x2="196" y2="134" stroke="rgba(255,255,255,0.75)" stroke-width="2" stroke-dasharray="5 4" />
    `,
  },
  {
    kind: 'camera-viewfinder',
    name: 'Camera Viewfinder',
    category: 'Device & Editorial',
    viewBoxW: 240,
    viewBoxH: 170,
    clipPathD: 'M 12 12 H 228 V 158 H 12 Z',
    cavity: { x: 12, y: 12, width: 216, height: 146 },
    defaultWidth: 400,
    defaultHeight: 284,
    underlaySvg: () => `
      <rect x="4" y="4" width="232" height="162" rx="10" fill="#111827" stroke="#475569" stroke-width="2" />
    `,
    overlaySvg: () => `
      <path d="M 24 42 V 24 H 42 M 198 24 H 216 V 42 M 24 128 V 146 H 42 M 198 146 H 216 V 128" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="34" cy="34" r="4" fill="#EF4444" />
    `,
  },
  {
    kind: 'xp-webcam-frame',
    name: 'Windows XP Camera',
    category: 'Device & Editorial',
    viewBoxW: 260,
    viewBoxH: 220,
    clipPathD: 'M 14 54 H 246 V 188 H 14 Z',
    cavity: { x: 14, y: 54, width: 232, height: 134 },
    defaultWidth: 420,
    defaultHeight: 355,
    underlaySvg: (uid) => `
      <defs>
        <linearGradient id="${uid}-xptitle" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3B8CF7" />
          <stop offset="18%" stop-color="#0054E3" />
          <stop offset="88%" stop-color="#0046C7" />
          <stop offset="100%" stop-color="#00359E" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="252" height="212" rx="8" fill="#ECE9D8" stroke="#003C9D" stroke-width="3" />
      <path d="M 4 12 Q 4 4 12 4 H 248 Q 256 4 256 12 V 32 H 4 Z" fill="url(#${uid}-xptitle)" />
      <circle cx="17" cy="18" r="6" fill="#93C5FD" stroke="#FFFFFF" stroke-width="1.2" />
      <text x="29" y="22" fill="#FFFFFF" font-family="sans-serif" font-size="11" font-weight="700">XP-Cam Capture</text>
      <rect x="200" y="10" width="14" height="14" rx="2" fill="#2563EB" stroke="#FFFFFF" stroke-width="1.2" />
      <line x1="203" y1="20" x2="211" y2="20" stroke="#FFFFFF" stroke-width="2" />
      <rect x="217" y="10" width="14" height="14" rx="2" fill="#2563EB" stroke="#FFFFFF" stroke-width="1.2" />
      <rect x="220" y="13" width="8" height="8" fill="none" stroke="#FFFFFF" stroke-width="1.5" />
      <rect x="234" y="10" width="15" height="14" rx="2" fill="#DC2626" stroke="#FFFFFF" stroke-width="1.2" />
      <path d="M 238 14 L 245 21 M 245 14 L 238 21" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" />
      <rect x="6" y="32" width="248" height="18" fill="#F5F3E8" />
      <text x="14" y="44" fill="#334155" font-family="sans-serif" font-size="9.5">File   Camera   Effects   Help</text>
      <rect x="14" y="193" width="232" height="17" rx="3" fill="#DDD9C8" stroke="#ACA899" stroke-width="1" />
      <circle cx="25" cy="201.5" r="3.5" fill="#EF4444" />
      <text x="34" y="205" fill="#1E293B" font-family="monospace" font-size="8.5" font-weight="700">REC  640x480  USB-CAM</text>
      <rect x="196" y="195" width="44" height="13" rx="3" fill="#F8FAFC" stroke="#7F9DB9" stroke-width="1" />
      <text x="218" y="204.5" text-anchor="middle" fill="#0F172A" font-family="sans-serif" font-size="8" font-weight="700">SNAP</text>
    `,
    overlaySvg: () => `
      <rect x="14" y="54" width="232" height="134" fill="none" stroke="#7F9DB9" stroke-width="1.5" />
    `,
  },
  {
    kind: 'old-digicam-frame',
    name: '2000s Old Digicam',
    category: 'Device & Editorial',
    viewBoxW: 280,
    viewBoxH: 190,
    clipPathD: 'M 24 44 H 204 V 164 H 24 Z',
    cavity: { x: 24, y: 44, width: 180, height: 120 },
    defaultWidth: 440,
    defaultHeight: 298,
    underlaySvg: (uid) => `
      <defs>
        <linearGradient id="${uid}-digicam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F1F5F9" />
          <stop offset="48%" stop-color="#CBD5E1" />
          <stop offset="100%" stop-color="#94A3B8" />
        </linearGradient>
      </defs>
      <rect x="202" y="4" width="48" height="12" rx="4" fill="#94A3B8" stroke="#475569" stroke-width="1.5" />
      <rect x="8" y="14" width="264" height="168" rx="18" fill="url(#${uid}-digicam)" stroke="#475569" stroke-width="2.5" />
      <rect x="24" y="22" width="42" height="14" rx="4" fill="#1E293B" stroke="#64748B" stroke-width="1.2" />
      <rect x="34" y="25" width="22" height="8" rx="2" fill="#475569" />
      <circle cx="80" cy="29" r="3.5" fill="#22C55E" />
      <text x="144" y="32" text-anchor="middle" fill="#334155" font-family="sans-serif" font-size="9" font-weight="800" letter-spacing="1.2">CYBER-XP 5.0MP</text>
      <rect x="19" y="39" width="190" height="130" rx="6" fill="#0F172A" stroke="#64748B" stroke-width="2" />
      <circle cx="242" cy="54" r="14" fill="#94A3B8" stroke="#475569" stroke-width="1.5" />
      <circle cx="242" cy="54" r="7" fill="#1E293B" />
      <circle cx="242" cy="108" r="22" fill="#E2E8F0" stroke="#64748B" stroke-width="1.8" />
      <circle cx="242" cy="108" r="9" fill="#64748B" />
      <rect x="220" y="144" width="20" height="12" rx="4" fill="#475569" />
      <rect x="245" y="144" width="20" height="12" rx="4" fill="#475569" />
    `,
    overlaySvg: () => `
      <text x="32" y="57" fill="#22C55E" font-family="monospace" font-size="8.5" font-weight="700">[AF] 5.0M</text>
      <text x="150" y="158" fill="#F97316" font-family="monospace" font-size="9" font-weight="700">'04 11 21</text>
    `,
  },

  // ================= BASIC EMPTY SHAPE FRAMES (15) =================
  {
    kind: 'circle',
    name: 'Circle Frame',
    category: 'Basic Shapes',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: 'M 100 6 A 94 94 0 1 0 100 194 A 94 94 0 1 0 100 6 Z',
    cavity: { x: 6, y: 6, width: 188, height: 188 },
    defaultWidth: 280,
    defaultHeight: 280,
  },
  {
    kind: 'oval-portrait',
    name: 'Editorial Oval',
    category: 'Basic Shapes',
    viewBoxW: 160,
    viewBoxH: 220,
    clipPathD: 'M 80 6 A 74 104 0 1 0 80 214 A 74 104 0 1 0 80 6 Z',
    cavity: { x: 6, y: 6, width: 148, height: 208 },
    defaultWidth: 240,
    defaultHeight: 330,
  },
  {
    kind: 'squircle',
    name: 'Squircle Frame',
    category: 'Basic Shapes',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD:
      'M 100 6 C 168 6 194 32 194 100 C 194 168 168 194 100 194 C 32 194 6 168 6 100 C 6 32 32 6 100 6 Z',
    cavity: { x: 6, y: 6, width: 188, height: 188 },
    defaultWidth: 280,
    defaultHeight: 280,
  },
  {
    kind: 'rounded-rect',
    name: 'Soft Rectangle',
    category: 'Basic Shapes',
    viewBoxW: 220,
    viewBoxH: 170,
    clipPathD:
      'M 28 8 H 192 Q 212 8 212 28 V 142 Q 212 162 192 162 H 28 Q 8 162 8 142 V 28 Q 8 8 28 8 Z',
    cavity: { x: 8, y: 8, width: 204, height: 154 },
    defaultWidth: 360,
    defaultHeight: 278,
  },
  {
    kind: 'pill-horizontal',
    name: 'Capsule Pill',
    category: 'Basic Shapes',
    viewBoxW: 260,
    viewBoxH: 130,
    clipPathD: 'M 65 8 H 195 A 57 57 0 0 1 195 122 H 65 A 57 57 0 0 1 65 8 Z',
    cavity: { x: 8, y: 8, width: 244, height: 114 },
    defaultWidth: 400,
    defaultHeight: 200,
  },
  {
    kind: 'arch-dome',
    name: 'Archway Dome',
    category: 'Basic Shapes',
    viewBoxW: 180,
    viewBoxH: 220,
    clipPathD: 'M 10 92 A 80 82 0 0 1 170 92 V 210 H 10 Z',
    cavity: { x: 10, y: 10, width: 160, height: 200 },
    defaultWidth: 270,
    defaultHeight: 330,
  },
  {
    kind: 'arch-inverted',
    name: 'Inverted Arch',
    category: 'Basic Shapes',
    viewBoxW: 180,
    viewBoxH: 220,
    clipPathD: 'M 10 10 H 170 V 128 A 80 82 0 0 1 10 128 Z',
    cavity: { x: 10, y: 10, width: 160, height: 200 },
    defaultWidth: 270,
    defaultHeight: 330,
  },
  {
    kind: 'window-gothic',
    name: 'Pointed Arch',
    category: 'Basic Shapes',
    viewBoxW: 180,
    viewBoxH: 220,
    clipPathD: 'M 90 8 C 142 36 170 76 170 124 V 210 H 10 V 124 C 10 76 38 36 90 8 Z',
    cavity: { x: 10, y: 8, width: 160, height: 202 },
    defaultWidth: 270,
    defaultHeight: 330,
  },
  {
    kind: 'triangle',
    name: 'Triangle Frame',
    category: 'Basic Shapes',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: 'M 100 12 L 190 184 L 10 184 Z',
    cavity: { x: 10, y: 12, width: 180, height: 172 },
    defaultWidth: 280,
    defaultHeight: 280,
  },
  {
    kind: 'diamond',
    name: 'Diamond Frame',
    category: 'Basic Shapes',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: 'M 100 8 L 192 100 L 100 192 L 8 100 Z',
    cavity: { x: 8, y: 8, width: 184, height: 184 },
    defaultWidth: 280,
    defaultHeight: 280,
  },
  {
    kind: 'pentagon',
    name: 'Pentagon Frame',
    category: 'Basic Shapes',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: regularPolyPath(5, 92, 92),
    cavity: { x: 8, y: 8, width: 184, height: 184 },
    defaultWidth: 280,
    defaultHeight: 280,
  },
  {
    kind: 'hexagon',
    name: 'Hexagon Frame',
    category: 'Basic Shapes',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: regularPolyPath(6, 92, 92),
    cavity: { x: 8, y: 8, width: 184, height: 184 },
    defaultWidth: 280,
    defaultHeight: 280,
  },
  {
    kind: 'octagon',
    name: 'Octagon Frame',
    category: 'Basic Shapes',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: regularPolyPath(8, 92, 92, -67.5),
    cavity: { x: 8, y: 8, width: 184, height: 184 },
    defaultWidth: 280,
    defaultHeight: 280,
  },
  {
    kind: 'parallelogram',
    name: 'Slanted Frame',
    category: 'Basic Shapes',
    viewBoxW: 220,
    viewBoxH: 170,
    clipPathD: 'M 42 10 H 212 L 178 160 H 8 Z',
    cavity: { x: 8, y: 10, width: 204, height: 150 },
    defaultWidth: 360,
    defaultHeight: 278,
  },
  {
    kind: 'semicircle-top',
    name: 'Half-Circle Dome',
    category: 'Basic Shapes',
    viewBoxW: 220,
    viewBoxH: 130,
    clipPathD: 'M 10 120 A 100 100 0 0 1 210 120 Z',
    cavity: { x: 10, y: 20, width: 200, height: 100 },
    defaultWidth: 360,
    defaultHeight: 212,
  },

  // ================= ORGANIC, Y2K & BADGE FRAMES (11) =================
  {
    kind: 'heart',
    name: 'Heart Frame',
    category: 'Organic & Badges',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD:
      'M 100 182 C 100 182 14 128 14 68 C 14 36 39 16 66 16 C 84 16 95 27 100 38 C 105 27 116 16 134 16 C 161 16 186 36 186 68 C 186 128 100 182 100 182 Z',
    cavity: { x: 14, y: 16, width: 172, height: 166 },
    defaultWidth: 290,
    defaultHeight: 290,
  },
  {
    kind: 'star-5',
    name: '5-Point Star',
    category: 'Organic & Badges',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: starBurstPath(5, 94, 42),
    cavity: { x: 6, y: 6, width: 188, height: 188 },
    defaultWidth: 290,
    defaultHeight: 290,
  },
  {
    kind: 'starburst-8',
    name: '8-Point Starburst',
    category: 'Organic & Badges',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: starBurstPath(8, 94, 58),
    cavity: { x: 6, y: 6, width: 188, height: 188 },
    defaultWidth: 290,
    defaultHeight: 290,
  },
  {
    kind: 'seal-12',
    name: 'Scallop Seal',
    category: 'Organic & Badges',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: scallopSealPath(12, 82, 16),
    cavity: { x: 6, y: 6, width: 188, height: 188 },
    defaultWidth: 290,
    defaultHeight: 290,
  },
  {
    kind: 'flower-4',
    name: '4-Petal Clover',
    category: 'Organic & Badges',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: scallopSealPath(4, 72, 34),
    cavity: { x: 8, y: 8, width: 184, height: 184 },
    defaultWidth: 280,
    defaultHeight: 280,
  },
  {
    kind: 'flower-6',
    name: '6-Petal Bloom',
    category: 'Organic & Badges',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: scallopSealPath(6, 76, 26),
    cavity: { x: 8, y: 8, width: 184, height: 184 },
    defaultWidth: 280,
    defaultHeight: 280,
  },
  {
    kind: 'cloud',
    name: 'Cloud Frame',
    category: 'Organic & Badges',
    viewBoxW: 220,
    viewBoxH: 160,
    clipPathD:
      'M 52 142 H 168 A 36 36 0 0 0 174 72 A 44 44 0 0 0 92 44 A 38 38 0 0 0 38 78 A 34 34 0 0 0 52 142 Z',
    cavity: { x: 10, y: 20, width: 200, height: 122 },
    defaultWidth: 350,
    defaultHeight: 254,
  },
  {
    kind: 'blob-organic',
    name: 'Organic Pebble',
    category: 'Organic & Badges',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD:
      'M 104 12 C 152 10 188 44 190 92 C 192 146 154 190 98 188 C 42 186 10 148 12 96 C 14 48 52 14 104 12 Z',
    cavity: { x: 12, y: 12, width: 178, height: 176 },
    defaultWidth: 290,
    defaultHeight: 290,
  },
  {
    kind: 'blob-wave',
    name: 'Liquid Blob',
    category: 'Organic & Badges',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD:
      'M 86 14 C 132 4 182 32 188 78 C 194 122 162 142 144 166 C 122 194 70 194 40 166 C 10 138 6 92 22 58 C 36 28 54 21 86 14 Z',
    cavity: { x: 10, y: 10, width: 180, height: 180 },
    defaultWidth: 290,
    defaultHeight: 290,
  },
  {
    kind: 'shield',
    name: 'Crest Shield',
    category: 'Organic & Badges',
    viewBoxW: 180,
    viewBoxH: 210,
    clipPathD:
      'M 16 24 Q 90 8 164 24 V 104 C 164 156 90 198 90 198 C 90 198 16 156 16 104 Z',
    cavity: { x: 16, y: 12, width: 148, height: 186 },
    defaultWidth: 260,
    defaultHeight: 304,
  },
  {
    kind: 'teardrop',
    name: 'Droplet Frame',
    category: 'Organic & Badges',
    viewBoxW: 180,
    viewBoxH: 220,
    clipPathD:
      'M 90 10 C 90 10 164 96 164 142 A 74 70 0 0 1 16 142 C 16 96 90 10 90 10 Z',
    cavity: { x: 16, y: 10, width: 148, height: 202 },
    defaultWidth: 250,
    defaultHeight: 305,
  },
  // ================= CLOUDS, BUBBLES & CREATIVE MASKS (10) =================
  {
    kind: 'cloud-cumulus',
    name: 'Cumulus Cloud',
    category: 'Organic & Badges',
    viewBoxW: 220,
    viewBoxH: 170,
    clipPathD:
      'M 50 148 H 172 A 34 34 0 0 0 184 84 A 38 38 0 0 0 132 38 A 42 42 0 0 0 60 44 A 36 36 0 0 0 28 84 A 34 34 0 0 0 50 148 Z',
    cavity: { x: 14, y: 14, width: 192, height: 136 },
    defaultWidth: 350,
    defaultHeight: 270,
  },
  {
    kind: 'cloud-thought',
    name: 'Thought Cloud',
    category: 'Organic & Badges',
    viewBoxW: 220,
    viewBoxH: 200,
    clipPathD:
      'M 54 132 H 168 A 34 34 0 0 0 174 68 A 42 42 0 0 0 94 40 A 38 38 0 0 0 40 72 A 32 32 0 0 0 54 132 Z M 56 154 A 12 12 0 1 0 56 178 A 12 12 0 1 0 56 154 Z M 30 178 A 7 7 0 1 0 30 192 A 7 7 0 1 0 30 178 Z',
    cavity: { x: 14, y: 18, width: 194, height: 174 },
    defaultWidth: 320,
    defaultHeight: 290,
  },
  {
    kind: 'bubble-speech',
    name: 'Speech Bubble',
    category: 'Organic & Badges',
    viewBoxW: 220,
    viewBoxH: 180,
    clipPathD:
      'M 34 12 H 186 Q 210 12 210 36 V 114 Q 210 138 186 138 H 84 L 44 170 L 54 138 H 34 Q 10 138 10 114 V 36 Q 10 12 34 12 Z',
    cavity: { x: 10, y: 12, width: 200, height: 158 },
    defaultWidth: 350,
    defaultHeight: 286,
  },
  {
    kind: 'bubble-speech-right',
    name: 'Chat Bubble',
    category: 'Organic & Badges',
    viewBoxW: 220,
    viewBoxH: 170,
    clipPathD:
      'M 48 12 H 172 A 38 38 0 0 1 210 50 V 96 A 38 38 0 0 1 172 134 H 164 L 188 160 L 136 134 H 48 A 38 38 0 0 1 10 96 V 50 A 38 38 0 0 1 48 12 Z',
    cavity: { x: 10, y: 12, width: 200, height: 148 },
    defaultWidth: 350,
    defaultHeight: 270,
  },
  {
    kind: 'bubble-soap-gloss',
    name: 'Soap Bubble',
    category: 'Organic & Badges',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD: 'M 100 8 A 92 92 0 1 0 100 192 A 92 92 0 1 0 100 8 Z',
    cavity: { x: 8, y: 8, width: 184, height: 184 },
    defaultWidth: 280,
    defaultHeight: 280,
    overlaySvg: () => `
      <circle cx="100" cy="100" r="91" fill="none" stroke="rgba(255,255,255,0.88)" stroke-width="3" />
      <ellipse cx="64" cy="54" rx="24" ry="11" fill="rgba(255,255,255,0.52)" transform="rotate(-32 64 54)" />
      <circle cx="142" cy="146" r="8" fill="rgba(255,255,255,0.42)" />
    `,
  },
  {
    kind: 'bubble-cluster',
    name: 'Bubble Cluster',
    category: 'Organic & Badges',
    viewBoxW: 220,
    viewBoxH: 200,
    clipPathD:
      'M 86 18 A 68 68 0 1 0 86 154 A 68 68 0 1 0 86 18 Z M 166 84 A 42 42 0 1 0 166 168 A 42 42 0 1 0 166 84 Z M 114 134 A 28 28 0 1 0 114 190 A 28 28 0 1 0 114 134 Z',
    cavity: { x: 16, y: 18, width: 192, height: 172 },
    defaultWidth: 320,
    defaultHeight: 290,
    overlaySvg: () => `
      <ellipse cx="62" cy="52" rx="18" ry="8" fill="rgba(255,255,255,0.5)" transform="rotate(-28 62 52)" />
      <ellipse cx="152" cy="106" rx="11" ry="5" fill="rgba(255,255,255,0.48)" transform="rotate(-28 152 106)" />
    `,
  },
  {
    kind: 'paint-splatter',
    name: 'Paint Splatter',
    category: 'Organic & Badges',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD:
      'M 102 18 C 122 18 128 38 144 36 C 164 34 176 50 166 68 C 158 82 186 90 184 110 C 182 130 156 126 154 146 C 152 168 134 182 116 170 C 102 160 88 186 68 176 C 50 166 62 146 44 138 C 22 128 18 106 34 94 C 50 82 28 64 44 46 C 60 28 78 46 90 28 C 94 21 98 18 102 18 Z M 176 34 A 10 10 0 1 0 176 54 A 10 10 0 1 0 176 34 Z M 26 152 A 9 9 0 1 0 26 170 A 9 9 0 1 0 26 152 Z',
    cavity: { x: 18, y: 18, width: 168, height: 166 },
    defaultWidth: 290,
    defaultHeight: 290,
  },
  {
    kind: 'torn-paper',
    name: 'Torn Journal Scrap',
    category: 'Organic & Badges',
    viewBoxW: 220,
    viewBoxH: 180,
    clipPathD:
      'M 14 18 L 36 12 L 58 20 L 82 10 L 106 19 L 132 11 L 158 18 L 182 10 L 206 16 L 202 48 L 210 78 L 200 108 L 209 138 L 202 166 L 178 160 L 154 169 L 128 159 L 104 169 L 78 160 L 52 168 L 28 159 L 12 166 L 18 134 L 10 104 L 18 72 L 10 42 Z',
    cavity: { x: 10, y: 10, width: 200, height: 160 },
    defaultWidth: 350,
    defaultHeight: 286,
  },
  {
    kind: 'brush-stroke',
    name: 'Brush Stroke',
    category: 'Organic & Badges',
    viewBoxW: 240,
    viewBoxH: 150,
    clipPathD:
      'M 22 26 Q 76 12 132 22 T 222 18 Q 234 38 214 58 Q 232 82 216 106 Q 228 128 206 136 Q 146 144 92 132 T 18 134 Q 8 112 24 90 Q 10 66 22 26 Z',
    cavity: { x: 10, y: 14, width: 220, height: 124 },
    defaultWidth: 380,
    defaultHeight: 238,
  },
  {
    kind: 'crescent-moon',
    name: 'Crescent Moon',
    category: 'Organic & Badges',
    viewBoxW: 200,
    viewBoxH: 200,
    clipPathD:
      'M 122 14 A 86 86 0 1 0 182 144 A 66 66 0 1 1 122 14 Z',
    cavity: { x: 18, y: 14, width: 164, height: 172 },
    defaultWidth: 280,
    defaultHeight: 280,
  },
  // ================= CHRISTMAS & NEW YEAR FRAMES (8) =================
  {
    kind: 'xmas-snowglobe-frame',
    name: 'Snowglobe Frame',
    category: 'Christmas & New Year',
    viewBoxW: 220,
    viewBoxH: 250,
    clipPathD: 'M 110 22 A 84 84 0 1 0 110 190 A 84 84 0 1 0 110 22 Z',
    cavity: { x: 26, y: 22, width: 168, height: 168 },
    defaultWidth: 290,
    defaultHeight: 330,
    underlaySvg: (uid) => `
      <defs>
        <linearGradient id="${uid}-sgbase" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#7F1D1D" />
          <stop offset="45%" stop-color="#B91C1C" />
          <stop offset="100%" stop-color="#450A0A" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="106" r="90" fill="#E0F2FE" stroke="#93C5FD" stroke-width="3" />
      <path d="M 48 182 L 172 182 L 186 226 Q 110 240 34 226 Z" fill="url(#${uid}-sgbase)" stroke="#450A0A" stroke-width="2.5" />
      <rect x="74" y="198" width="72" height="18" rx="5" fill="#FDE68A" stroke="#92400E" stroke-width="1.5" />
      <text x="110" y="211" text-anchor="middle" fill="#78350F" font-family="sans-serif" font-weight="800" font-size="9" letter-spacing="1.2">WINTER</text>
    `,
    overlaySvg: () => `
      <circle cx="110" cy="106" r="84" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="3.5" />
      <ellipse cx="72" cy="56" rx="22" ry="9" fill="rgba(255,255,255,0.52)" transform="rotate(-32 72 56)" />
      <circle cx="62" cy="138" r="3.5" fill="#FFFFFF" opacity="0.88" />
      <circle cx="154" cy="126" r="4" fill="#FFFFFF" opacity="0.88" />
      <circle cx="142" cy="64" r="3" fill="#FFFFFF" opacity="0.88" />
      <circle cx="88" cy="154" r="3" fill="#FFFFFF" opacity="0.82" />
    `,
  },
  {
    kind: 'xmas-wreath-frame',
    name: 'Holly Wreath Frame',
    category: 'Christmas & New Year',
    viewBoxW: 240,
    viewBoxH: 240,
    clipPathD: 'M 120 44 A 76 76 0 1 0 120 196 A 76 76 0 1 0 120 44 Z',
    cavity: { x: 44, y: 44, width: 152, height: 152 },
    defaultWidth: 310,
    defaultHeight: 310,
    underlaySvg: () => `
      <circle cx="120" cy="120" r="102" fill="none" stroke="#14532D" stroke-width="30" />
      <circle cx="120" cy="120" r="98" fill="none" stroke="#16A34A" stroke-width="20" stroke-dasharray="16 8" />
      <circle cx="120" cy="120" r="84" fill="none" stroke="#22C55E" stroke-width="8" stroke-dasharray="10 10" />
    `,
    overlaySvg: () => `
      <circle cx="120" cy="120" r="76" fill="none" stroke="#FDE047" stroke-width="2.5" />
      <circle cx="48" cy="84" r="5.5" fill="#DC2626" />
      <circle cx="56" cy="92" r="4.5" fill="#EF4444" />
      <circle cx="192" cy="84" r="5.5" fill="#DC2626" />
      <circle cx="184" cy="92" r="4.5" fill="#EF4444" />
      <circle cx="56" cy="168" r="5.5" fill="#DC2626" />
      <circle cx="184" cy="168" r="5.5" fill="#DC2626" />
      <circle cx="120" cy="212" r="6" fill="#FACC15" />
      <path d="M 120 34 C 102 18 82 22 82 36 C 82 48 104 46 120 38 C 136 46 158 48 158 36 C 158 22 138 18 120 34 Z" fill="#DC2626" stroke="#7F1D1D" stroke-width="2" />
      <path d="M 114 38 L 96 60 L 108 58 Z M 126 38 L 144 60 L 132 58 Z" fill="#B91C1C" stroke="#7F1D1D" stroke-width="1.5" />
      <circle cx="120" cy="36" r="7" fill="#EF4444" stroke="#7F1D1D" stroke-width="1.8" />
    `,
  },
  {
    kind: 'xmas-bauble-frame',
    name: 'Ornament Bauble',
    category: 'Christmas & New Year',
    viewBoxW: 200,
    viewBoxH: 236,
    clipPathD: 'M 100 50 A 80 80 0 1 0 100 210 A 80 80 0 1 0 100 50 Z',
    cavity: { x: 20, y: 50, width: 160, height: 160 },
    defaultWidth: 270,
    defaultHeight: 318,
    underlaySvg: (uid) => `
      <defs>
        <linearGradient id="${uid}-cap" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#D97706" />
          <stop offset="50%" stop-color="#FDE047" />
          <stop offset="100%" stop-color="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="22" r="10" fill="none" stroke="#D97706" stroke-width="4" />
      <rect x="80" y="30" width="40" height="22" rx="4" fill="url(#${uid}-cap)" stroke="#92400E" stroke-width="2" />
      <circle cx="100" cy="130" r="85" fill="#DC2626" stroke="#991B1B" stroke-width="3" />
    `,
    overlaySvg: () => `
      <circle cx="100" cy="130" r="80" fill="none" stroke="#FACC15" stroke-width="4" />
      <ellipse cx="64" cy="92" rx="16" ry="8" fill="rgba(255,255,255,0.45)" transform="rotate(-35 64 92)" />
    `,
  },
  {
    kind: 'xmas-gift-frame',
    name: 'Holiday Gift Box',
    category: 'Christmas & New Year',
    viewBoxW: 220,
    viewBoxH: 240,
    clipPathD: 'M 30 56 H 190 A 14 14 0 0 1 204 70 V 210 A 14 14 0 0 1 190 224 H 30 A 14 14 0 0 1 16 210 V 70 A 14 14 0 0 1 30 56 Z',
    cavity: { x: 16, y: 56, width: 188, height: 168 },
    defaultWidth: 300,
    defaultHeight: 328,
    underlaySvg: () => `
      <rect x="10" y="50" width="200" height="180" rx="16" fill="#B91C1C" stroke="#7F1D1D" stroke-width="3" />
    `,
    overlaySvg: () => `
      <rect x="16" y="56" width="188" height="168" rx="14" fill="none" stroke="#FACC15" stroke-width="4" />
      <rect x="98" y="56" width="24" height="20" fill="#DC2626" stroke="#FACC15" stroke-width="2" />
      <rect x="98" y="204" width="24" height="20" fill="#DC2626" stroke="#FACC15" stroke-width="2" />
      <path d="M 110 46 C 84 18 54 22 58 42 C 62 56 90 54 110 48 C 130 54 158 56 162 42 C 166 22 136 18 110 46 Z" fill="#FACC15" stroke="#B45309" stroke-width="2" />
      <circle cx="110" cy="48" r="9" fill="#EF4444" stroke="#B45309" stroke-width="2" />
    `,
  },
  {
    kind: 'xmas-candycane-frame',
    name: 'Candy Cane Frame',
    category: 'Christmas & New Year',
    viewBoxW: 220,
    viewBoxH: 220,
    clipPathD: 'M 40 24 H 180 A 16 16 0 0 1 196 40 V 180 A 16 16 0 0 1 180 196 H 40 A 16 16 0 0 1 24 180 V 40 A 16 16 0 0 1 40 24 Z',
    cavity: { x: 24, y: 24, width: 172, height: 172 },
    defaultWidth: 300,
    defaultHeight: 300,
    underlaySvg: (uid) => `
      <defs>
        <pattern id="${uid}-ccpat" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="11" height="22" fill="#DC2626" />
          <rect x="11" width="11" height="22" fill="#FFFFFF" />
        </pattern>
      </defs>
      <rect x="10" y="10" width="200" height="200" rx="26" fill="url(#${uid}-ccpat)" stroke="#991B1B" stroke-width="3" />
    `,
    overlaySvg: () => `
      <rect x="24" y="24" width="172" height="172" rx="16" fill="none" stroke="#FFFFFF" stroke-width="4" />
      <rect x="24" y="24" width="172" height="172" rx="16" fill="none" stroke="#16A34A" stroke-width="1.5" />
    `,
  },
  {
    kind: 'xmas-snowflake-frame',
    name: 'Snowflake Crystal',
    category: 'Christmas & New Year',
    viewBoxW: 220,
    viewBoxH: 220,
    clipPathD: 'M 110 14 L 136 52 L 182 44 L 166 88 L 204 110 L 166 132 L 182 176 L 136 168 L 110 206 L 84 168 L 38 176 L 54 132 L 16 110 L 54 88 L 38 44 L 84 52 Z',
    cavity: { x: 16, y: 14, width: 188, height: 192 },
    defaultWidth: 300,
    defaultHeight: 300,
    overlaySvg: () => `
      <path d="M 110 14 L 136 52 L 182 44 L 166 88 L 204 110 L 166 132 L 182 176 L 136 168 L 110 206 L 84 168 L 38 176 L 54 132 L 16 110 L 54 88 L 38 44 L 84 52 Z" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linejoin="round" />
      <path d="M 110 14 L 136 52 L 182 44 L 166 88 L 204 110 L 166 132 L 182 176 L 136 168 L 110 206 L 84 168 L 38 176 L 54 132 L 16 110 L 54 88 L 38 44 L 84 52 Z" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round" />
    `,
  },
  {
    kind: 'ny-fireworks-frame',
    name: 'Midnight 2026 Frame',
    category: 'Christmas & New Year',
    viewBoxW: 220,
    viewBoxH: 250,
    clipPathD: 'M 28 110 A 82 82 0 0 1 192 110 V 214 A 12 12 0 0 1 180 226 H 40 A 12 12 0 0 1 28 214 Z',
    cavity: { x: 28, y: 28, width: 164, height: 198 },
    defaultWidth: 286,
    defaultHeight: 325,
    underlaySvg: (uid) => `
      <defs>
        <linearGradient id="${uid}-nygrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0F172A" />
          <stop offset="50%" stop-color="#1E1B4B" />
          <stop offset="100%" stop-color="#312E81" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="204" height="234" rx="22" fill="url(#${uid}-nygrad)" stroke="#FACC15" stroke-width="3" />
    `,
    overlaySvg: () => `
      <path d="M 28 110 A 82 82 0 0 1 192 110 V 214 A 12 12 0 0 1 180 226 H 40 A 12 12 0 0 1 28 214 Z" fill="none" stroke="#FACC15" stroke-width="3.5" />
      <rect x="66" y="14" width="88" height="24" rx="12" fill="#FACC15" stroke="#92400E" stroke-width="1.5" />
      <text x="110" y="30" text-anchor="middle" fill="#0F172A" font-family="sans-serif" font-weight="900" font-size="13" letter-spacing="1.5">2026</text>
      <path d="M 32 36 L 36 26 L 40 36 L 50 40 L 40 44 L 36 54 L 32 44 L 22 40 Z" fill="#FDE047" />
      <path d="M 184 36 L 187 28 L 190 36 L 198 39 L 190 42 L 187 50 L 184 42 L 176 39 Z" fill="#38BDF8" />
    `,
  },
  {
    kind: 'xmas-polaroid-frame',
    name: 'Holiday Polaroid',
    category: 'Christmas & New Year',
    viewBoxW: 220,
    viewBoxH: 260,
    clipPathD: 'M 22 24 H 198 V 196 H 22 Z',
    cavity: { x: 22, y: 24, width: 176, height: 172 },
    defaultWidth: 290,
    defaultHeight: 342,
    underlaySvg: () => `
      <rect x="6" y="6" width="208" height="248" rx="10" fill="#FFFBEB" stroke="#DC2626" stroke-width="4" />
      <rect x="12" y="12" width="196" height="236" rx="7" fill="none" stroke="#16A34A" stroke-width="1.5" stroke-dasharray="6 4" />
    `,
    overlaySvg: () => `
      <rect x="22" y="24" width="176" height="172" fill="none" stroke="#E2E8F0" stroke-width="1.5" />
      <text x="110" y="228" text-anchor="middle" fill="#991B1B" font-family="sans-serif" font-weight="800" font-size="12" letter-spacing="2">MERRY &amp; BRIGHT</text>
      <circle cx="34" cy="224" r="5" fill="#16A34A" />
      <circle cx="40" cy="218" r="3.5" fill="#DC2626" />
      <circle cx="186" cy="224" r="5" fill="#16A34A" />
      <circle cx="180" cy="218" r="3.5" fill="#DC2626" />
    `,
  },
  {
    kind: 'hud-visor-frame',
    name: 'Cyber HUD Visor',
    category: 'Device & Editorial',
    viewBoxW: 260,
    viewBoxH: 200,
    clipPathD: 'M 42 26 H 218 L 236 44 V 156 L 218 174 H 42 L 24 156 V 44 Z',
    cavity: { x: 24, y: 26, width: 212, height: 148 },
    defaultWidth: 340,
    defaultHeight: 262,
    underlaySvg: () => `
      <polygon points="34,16 226,16 248,38 248,162 226,184 34,184 12,162 12,38" fill="#071329" stroke="#00E5FF" stroke-width="2.5" />
    `,
    overlaySvg: () => `
      <polyline points="8,8 26,26 76,26" fill="none" stroke="#00E5FF" stroke-width="3" stroke-linecap="round" />
      <polyline points="252,8 234,26 184,26" fill="none" stroke="#00E5FF" stroke-width="3" stroke-linecap="round" />
      <polyline points="8,192 26,174 76,174" fill="none" stroke="#00E5FF" stroke-width="3" stroke-linecap="round" />
      <polyline points="252,192 234,174 184,174" fill="none" stroke="#00E5FF" stroke-width="3" stroke-linecap="round" />
      <rect x="92" y="10" width="76" height="12" rx="3" fill="#00E5FF" />
      <text x="130" y="19" text-anchor="middle" fill="#041226" font-family="monospace" font-weight="900" font-size="8" letter-spacing="1.2">VISOR // 01</text>
    `,
  },
  {
    kind: 'hud-radar-scope-frame',
    name: 'Sonar Target Scope',
    category: 'Device & Editorial',
    viewBoxW: 240,
    viewBoxH: 240,
    clipPathD: 'M 120 44 A 76 76 0 1 1 119.9 44 Z',
    cavity: { x: 44, y: 44, width: 152, height: 152 },
    defaultWidth: 280,
    defaultHeight: 280,
    underlaySvg: () => `
      <circle cx="120" cy="120" r="108" fill="#06142A" stroke="#0E7490" stroke-width="2" />
    `,
    overlaySvg: () => `
      <circle cx="120" cy="120" r="92" fill="none" stroke="#00E5FF" stroke-width="2" stroke-dasharray="14 8" />
      <path d="M 48 64 A 98 98 0 0 1 192 64" fill="none" stroke="#38BDF8" stroke-width="5" stroke-linecap="round" />
      <path d="M 192 176 A 98 98 0 0 1 48 176" fill="none" stroke="#A855F7" stroke-width="5" stroke-linecap="round" />
      <line x1="18" y1="120" x2="36" y2="120" stroke="#00E5FF" stroke-width="2.5" />
      <line x1="204" y1="120" x2="222" y2="120" stroke="#00E5FF" stroke-width="2.5" />
    `,
  },
  {
    kind: 'hud-hex-core-frame',
    name: 'Hexagon Reactor Frame',
    category: 'Device & Editorial',
    viewBoxW: 240,
    viewBoxH: 240,
    clipPathD: 'M 120 26 L 202 73 V 167 L 120 214 L 38 167 V 73 Z',
    cavity: { x: 38, y: 26, width: 164, height: 188 },
    defaultWidth: 270,
    defaultHeight: 270,
    underlaySvg: () => `
      <polygon points="120,12 214,66 214,174 120,228 26,174 26,66" fill="#07152D" stroke="#22D3EE" stroke-width="3" />
    `,
    overlaySvg: () => `
      <polygon points="120,26 202,73 202,167 120,214 38,167 38,73" fill="none" stroke="#00E5FF" stroke-width="2.5" />
      <circle cx="120" cy="12" r="4.5" fill="#00E5FF" />
      <circle cx="120" cy="228" r="4.5" fill="#A855F7" />
      <circle cx="26" cy="120" r="4" fill="#22D3EE" />
      <circle cx="214" cy="120" r="4" fill="#22D3EE" />
    `,
  },
  {
    kind: 'hud-holo-card-frame',
    name: 'Holo Interface Card',
    category: 'Device & Editorial',
    viewBoxW: 260,
    viewBoxH: 220,
    clipPathD: 'M 28 38 H 232 V 178 H 28 Z',
    cavity: { x: 28, y: 38, width: 204, height: 140 },
    defaultWidth: 320,
    defaultHeight: 270,
    underlaySvg: () => `
      <polygon points="24,14 236,14 248,26 248,194 236,206 24,206 12,194 12,26" fill="#08142B" stroke="#22D3EE" stroke-width="2.5" />
    `,
    overlaySvg: () => `
      <rect x="28" y="38" width="204" height="140" fill="none" stroke="#38BDF8" stroke-width="1.8" />
      <circle cx="32" cy="24" r="3.5" fill="#22D3EE" />
      <circle cx="44" cy="24" r="3.5" fill="#A855F7" />
      <text x="232" y="27" text-anchor="end" fill="#38BDF8" font-family="monospace" font-weight="800" font-size="9" letter-spacing="1.4">HOLO-CAM</text>
      <line x1="28" y1="191" x2="112" y2="191" stroke="#22D3EE" stroke-width="3" stroke-linecap="round" />
      <line x1="122" y1="191" x2="152" y2="191" stroke="#A855F7" stroke-width="3" stroke-linecap="round" />
    `,
  },
  {
    kind: 'vintage-ornate-oval',
    name: 'Baroque Oval Cameo',
    category: 'Organic & Badges',
    viewBoxW: 220,
    viewBoxH: 260,
    clipPathD: 'M 110 34 A 68 96 0 1 1 109.9 34 Z',
    cavity: { x: 42, y: 34, width: 136, height: 192 },
    defaultWidth: 250,
    defaultHeight: 295,
    underlaySvg: () => `
      <ellipse cx="110" cy="130" rx="92" ry="114" fill="#FAF5EB" stroke="#B48A4E" stroke-width="4" />
    `,
    overlaySvg: () => `
      <ellipse cx="110" cy="130" rx="74" ry="100" fill="none" stroke="#4A372B" stroke-width="2.2" />
      <ellipse cx="110" cy="130" rx="84" ry="108" fill="none" stroke="#B48A4E" stroke-width="2" stroke-dasharray="3 6" />
      <circle cx="110" cy="18" r="6" fill="#B48A4E" />
      <circle cx="110" cy="242" r="6" fill="#B48A4E" />
    `,
  },
  {
    kind: 'vintage-wax-stamp',
    name: 'Heritage Postage Stamp',
    category: 'Device & Editorial',
    viewBoxW: 220,
    viewBoxH: 250,
    clipPathD: 'M 32 32 H 188 V 206 H 32 Z',
    cavity: { x: 32, y: 32, width: 156, height: 174 },
    defaultWidth: 260,
    defaultHeight: 295,
    underlaySvg: () => `
      <rect x="14" y="14" width="192" height="222" rx="6" fill="#F5ECD8" stroke="#7C5836" stroke-width="3" stroke-dasharray="6 4" />
    `,
    overlaySvg: () => `
      <rect x="32" y="32" width="156" height="174" fill="none" stroke="#7C5836" stroke-width="1.8" />
      <circle cx="170" cy="192" r="14" fill="#991B1B" stroke="#4A3525" stroke-width="1.5" />
      <text x="100" y="226" text-anchor="middle" fill="#4A3525" font-family="Georgia, serif" font-weight="700" font-size="11" letter-spacing="2">ARCHIVE 50</text>
    `,
  },
  {
    kind: 'classical-arch-pillar',
    name: 'Classical Stone Arch',
    category: 'Basic Shapes',
    viewBoxW: 220,
    viewBoxH: 260,
    clipPathD: 'M 42 110 A 68 68 0 0 1 178 110 V 222 H 42 Z',
    cavity: { x: 42, y: 42, width: 136, height: 180 },
    defaultWidth: 260,
    defaultHeight: 308,
    underlaySvg: () => `
      <rect x="16" y="16" width="188" height="228" rx="6" fill="#EFEAE0" stroke="#8B7355" stroke-width="3" />
    `,
    overlaySvg: () => `
      <path d="M 42 110 A 68 68 0 0 1 178 110 V 222 H 42 Z" fill="none" stroke="#4A3B2C" stroke-width="3" />
      <rect x="24" y="222" width="172" height="12" fill="#D6CEBE" stroke="#4A3B2C" stroke-width="2" />
    `,
  },
  {
    kind: 'islamic-mihrab-arch',
    name: 'Arabesque Pointed Arch',
    category: 'Organic & Badges',
    viewBoxW: 220,
    viewBoxH: 260,
    clipPathD: 'M 110 34 Q 176 74 176 132 V 226 H 44 V 132 Q 44 74 110 34 Z',
    cavity: { x: 44, y: 34, width: 132, height: 192 },
    defaultWidth: 260,
    defaultHeight: 308,
    underlaySvg: () => `
      <rect x="12" y="12" width="196" height="236" rx="14" fill="#0B4635" stroke="#E5B85B" stroke-width="3.5" />
    `,
    overlaySvg: () => `
      <path d="M 110 34 Q 176 74 176 132 V 226 H 44 V 132 Q 44 74 110 34 Z" fill="none" stroke="#E5B85B" stroke-width="3.5" />
      <polygon points="110,16 116,24 110,32 104,24" fill="#E5B85B" />
    `,
  },
];

export function getPhotoFrameDef(kind: unknown, props?: Record<string, unknown>): PhotoFrameDef {
  const key = typeof kind === 'string' ? kind : 'circle';
  if (key === 'custom-freedraw' && props && typeof props.customClipPathD === 'string' && props.customClipPathD) {
    const vw = Math.max(40, Number(props.customViewBoxW) || 200);
    const vh = Math.max(40, Number(props.customViewBoxH) || 200);
    return {
      kind: 'custom-freedraw',
      name: String(props.customFrameName || 'Freedraw Frame'),
      category: 'Organic & Badges',
      viewBoxW: vw,
      viewBoxH: vh,
      clipPathD: props.customClipPathD,
      cavity: { x: 0, y: 0, width: vw, height: vh },
      defaultWidth: vw,
      defaultHeight: vh,
    };
  }
  return PHOTO_FRAME_CATALOG.find((f) => f.kind === key) || PHOTO_FRAME_CATALOG[0];
}

/**
 * Renders a Canva-style empty landscape placeholder (sky + cloud + rolling hills) clipped inside any shape frame.
 * Also supports embedding a real raster data URI when exporting to PPTX!
 */
export function renderPhotoFrameSvgString(
  props: Record<string, unknown>,
  uid: string,
  embeddedImageDataUri?: string
): string {
  const def = getPhotoFrameDef(props.frameKind, props);
  const tint = String(props.tintColor || '#CBD5E1');
  const accent = String(props.accentColor || '#3B82F6');
  const { viewBoxW: vw, viewBoxH: vh, clipPathD, cavity } = def;
  const clipId = `${uid}-clip`;
  const skyId = `${uid}-sky`;

  const underlay = def.underlaySvg ? def.underlaySvg(uid, tint, accent) : '';
  const overlay = def.overlaySvg ? def.overlaySvg(uid, tint, accent) : '';

  const emptyPlaceholder = `
    <rect x="0" y="0" width="${vw}" height="${vh}" fill="url(#${skyId})" />
    <circle cx="${(cavity.x + cavity.width * 0.28).toFixed(1)}" cy="${(cavity.y + cavity.height * 0.30).toFixed(1)}" r="${Math.min(cavity.width, cavity.height) * 0.12}" fill="rgba(255,255,255,0.88)" />
    <circle cx="${(cavity.x + cavity.width * 0.36).toFixed(1)}" cy="${(cavity.y + cavity.height * 0.27).toFixed(1)}" r="${Math.min(cavity.width, cavity.height) * 0.15}" fill="rgba(255,255,255,0.94)" />
    <circle cx="${(cavity.x + cavity.width * 0.44).toFixed(1)}" cy="${(cavity.y + cavity.height * 0.31).toFixed(1)}" r="${Math.min(cavity.width, cavity.height) * 0.11}" fill="rgba(255,255,255,0.88)" />
    <path d="M ${cavity.x} ${cavity.y + cavity.height * 0.72} Q ${cavity.x + cavity.width * 0.28} ${cavity.y + cavity.height * 0.48} ${cavity.x + cavity.width * 0.62} ${cavity.y + cavity.height * 0.68} T ${cavity.x + cavity.width} ${cavity.y + cavity.height * 0.62} V ${vh} H 0 Z" fill="#9ED18B" />
    <path d="M ${cavity.x} ${cavity.y + cavity.height * 0.80} Q ${cavity.x + cavity.width * 0.55} ${cavity.y + cavity.height * 0.54} ${cavity.x + cavity.width} ${cavity.y + cavity.height * 0.78} V ${vh} H 0 Z" fill="#6BB35C" />
  `;

  const innerContent = embeddedImageDataUri
    ? `<image href="${embeddedImageDataUri}" x="${cavity.x}" y="${cavity.y}" width="${cavity.width}" height="${cavity.height}" preserveAspectRatio="xMidYMid slice" />`
    : emptyPlaceholder;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="none">
    <defs>
      <clipPath id="${clipId}">
        <path d="${clipPathD}" />
      </clipPath>
      <linearGradient id="${skyId}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#CBE4FA" />
        <stop offset="100%" stop-color="#EBF5FF" />
      </linearGradient>
    </defs>
    ${underlay}
    <g clip-path="url(#${clipId})">
      ${innerContent}
    </g>
    <path d="${clipPathD}" fill="none" stroke="rgba(100,116,139,0.28)" stroke-width="1.5" />
    ${overlay}
  </svg>`;
}
