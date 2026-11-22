import type { TextElement } from './schema';

export interface RansomTileStyle {
  bg: string;
  fg: string;
  fontFamily: string;
  rotate: number;
  clipPath: string;
  polygonPoints: string;
  fontStyle?: 'normal' | 'italic';
}

export const RANSOM_LETTER_STYLES: RansomTileStyle[] = [
  {
    bg: '#D9773B',
    fg: '#432344',
    fontFamily: 'Abril Fatface, Fraunces, serif',
    rotate: -8,
    clipPath: 'polygon(6% 4%, 92% 0%, 100% 24%, 94% 96%, 8% 100%, 0% 34%)',
    polygonPoints: '3,2 44,0 48,12 45,48 4,50 0,17',
  },
  {
    bg: '#F7EFDA',
    fg: '#D64227',
    fontFamily: 'Courier Prime, JetBrains Mono, monospace',
    rotate: 5,
    clipPath: 'polygon(0% 8%, 94% 0%, 100% 88%, 82% 100%, 4% 94%)',
    polygonPoints: '0,4 45,0 48,44 39,50 2,47',
  },
  {
    bg: '#8C9FC6',
    fg: '#17191C',
    fontFamily: 'Anton, Impact, sans-serif',
    rotate: -3,
    clipPath: 'polygon(2% 0%, 96% 4%, 100% 96%, 4% 100%)',
    polygonPoints: '1,0 46,2 48,48 2,50',
  },
  {
    bg: '#14C8C4',
    fg: '#E92E5C',
    fontFamily: 'Fraunces, Playfair Display, serif',
    rotate: 4,
    clipPath: 'polygon(0% 3%, 98% 0%, 96% 97%, 3% 98%)',
    polygonPoints: '0,1.5 47,0 46,48.5 1.5,49',
  },
  {
    bg: '#F5DCBD',
    fg: '#968122',
    fontFamily: 'Fredoka, Outfit, sans-serif',
    rotate: -6,
    clipPath: 'polygon(10% 0%, 88% 4%, 100% 52%, 90% 98%, 6% 94%, 0% 42%)',
    polygonPoints: '5,0 42,2 48,26 43,49 3,47 0,21',
  },
  {
    bg: '#F7D73C',
    fg: '#9D174D',
    fontFamily: 'Playfair Display, Fraunces, serif',
    fontStyle: 'italic',
    rotate: 7,
    clipPath: 'polygon(4% 6%, 96% 0%, 100% 92%, 6% 100%)',
    polygonPoints: '2,3 46,0 48,46 3,50',
  },
];

export function getRansomTileStyle(index: number): RansomTileStyle {
  return RANSOM_LETTER_STYLES[((index % RANSOM_LETTER_STYLES.length) + RANSOM_LETTER_STYLES.length) % RANSOM_LETTER_STYLES.length];
}

function escXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function renderStyledTextSvgString(el: TextElement): string {
  const w = Math.max(40, Math.round(el.width));
  const h = Math.max(30, Math.round(el.height));

  if (el.textEffect === 'ransom-cutout') {
    const chars = Array.from(el.content ?? '');
    const visibleChars = chars.filter((c) => c !== '\n');
    const count = Math.max(1, visibleChars.length);
    const tileW = Math.min(el.fontSize * 1.08, (w - 16) / count);
    const tileH = Math.min(h - 10, el.fontSize * 1.28);
    const totalW = count * tileW;
    const startX = el.textAlign === 'center' ? (w - totalW) / 2 : el.textAlign === 'right' ? w - totalW - 6 : 6;
    const startY = Math.max(4, (h - tileH) / 2);

    let tiles = '';
    let colorIdx = 0;
    visibleChars.forEach((ch, idx) => {
      if (ch === ' ') {
        return;
      }
      const st = getRansomTileStyle(colorIdx++);
      const tx = startX + idx * tileW;
      const sx = tileW / 48;
      const sy = tileH / 50;
      const cx = tx + tileW / 2;
      const cy = startY + tileH / 2;
      tiles += `<g transform="translate(${tx.toFixed(1)}, ${startY.toFixed(1)}) rotate(${st.rotate} ${(tileW / 2).toFixed(1)} ${(tileH / 2).toFixed(1)})">
        <polygon points="${st.polygonPoints}" transform="scale(${sx.toFixed(3)}, ${sy.toFixed(3)})" fill="${st.bg}" stroke="rgba(15,23,42,0.18)" stroke-width="1"/>
        <text x="${(tileW / 2).toFixed(1)}" y="${(tileH * 0.72).toFixed(1)}" text-anchor="middle" fill="${st.fg}" font-family="${escXml(st.fontFamily)}" font-weight="900" font-style="${st.fontStyle || 'normal'}" font-size="${Math.round(el.fontSize * 0.88)}">${escXml(ch)}</text>
      </g>`;
      void cx;
      void cy;
    });

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${tiles}</svg>`;
  }

  // sticker-outline
  const outlineCol = el.outlineColor || '#1B365D';
  const strokeW = Math.max(4, (el.outlineWidth ?? 12) * 0.85);
  const lines = String(el.content || '').split('\n');
  const linePx = el.fontSize * (el.lineHeight || 1.05);
  const startY = el.fontSize * 0.92 + (el.padding || 4);
  const anchor = el.textAlign === 'center' ? 'middle' : el.textAlign === 'right' ? 'end' : 'start';
  const tx = el.textAlign === 'center' ? w / 2 : el.textAlign === 'right' ? w - 8 : 8;

  const textLines = lines
    .map((ln, idx) => {
      const ly = startY + idx * linePx;
      return `<text x="${tx}" y="${ly.toFixed(1)}" text-anchor="${anchor}" fill="${escXml(el.color)}" stroke="${escXml(outlineCol)}" stroke-width="${strokeW}" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke fill" font-family="${escXml(el.fontFamily)}" font-weight="${el.fontWeight}" font-size="${el.fontSize}">${escXml(ln)}</text>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${textLines}</svg>`;
}
