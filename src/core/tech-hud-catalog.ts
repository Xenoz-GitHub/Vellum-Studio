import type { CutoutItemDef } from './svg-cutout-renderer';

function esc(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const TECH_HUD_CATALOG: CutoutItemDef[] = [
  // ==================== 22 TECH & HUD ELEMENTS ====================
  {
    kind: 'hud-cyber-frame-bracket',
    name: 'Cyber HUD Frame',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'frame', 'bracket', 'cyber', 'futuristic', 'sci-fi', 'box'],
    defaultWidth: 340,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'hud-cyber-frame-bracket',
      label: 'SYS // 01',
      primaryColor: '#00E5FF',
      secondaryColor: '#082F49',
      accentColor: '#38BDF8',
      outlineColor: '#0C4A6E',
    },
  },
  {
    kind: 'hud-hex-progress-bar',
    name: 'Hex Segment Meter',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'hex', 'progress', 'bar', 'loading', 'meter', 'cyber'],
    defaultWidth: 380,
    defaultHeight: 96,
    defaultProps: {
      stickerKind: 'hud-hex-progress-bar',
      label: '70%',
      primaryColor: '#00E5FF',
      secondaryColor: '#0F172A',
      accentColor: '#38BDF8',
      outlineColor: '#164E63',
    },
  },
  {
    kind: 'hud-angled-slash-bar',
    name: 'Slash Charge Gauge',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'slash', 'progress', 'loading', 'bar', 'charge', 'cyber'],
    defaultWidth: 380,
    defaultHeight: 84,
    defaultProps: {
      stickerKind: 'hud-angled-slash-bar',
      label: 'CHARGE 80%',
      primaryColor: '#22D3EE',
      secondaryColor: '#0F172A',
      accentColor: '#818CF8',
      outlineColor: '#1E293B',
    },
  },
  {
    kind: 'hud-modular-panel',
    name: 'Tactical Data Panel',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'panel', 'box', 'card', 'terminal', 'container', 'cyber'],
    defaultWidth: 380,
    defaultHeight: 210,
    defaultProps: {
      stickerKind: 'hud-modular-panel',
      label: 'NODE // ACTIVE',
      primaryColor: '#00E5FF',
      secondaryColor: '#0B162C',
      accentColor: '#A855F7',
      outlineColor: '#1E3A5F',
    },
  },
  {
    kind: 'hud-split-corner-frame',
    name: 'Viewport Corner Lock',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'corner', 'bracket', 'viewport', 'camera', 'reticle'],
    defaultWidth: 300,
    defaultHeight: 240,
    defaultProps: {
      stickerKind: 'hud-split-corner-frame',
      label: 'REC',
      primaryColor: '#00E5FF',
      secondaryColor: '#0F172A',
      accentColor: '#F43F5E',
      outlineColor: '#0369A1',
    },
  },
  {
    kind: 'hud-target-ring',
    name: 'Precision Target Ring',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'target', 'ring', 'dial', 'reticle', 'crosshair', 'circle'],
    defaultWidth: 240,
    defaultHeight: 240,
    defaultProps: {
      stickerKind: 'hud-target-ring',
      label: 'LOCK',
      primaryColor: '#00E5FF',
      secondaryColor: '#0B162C',
      accentColor: '#38BDF8',
      outlineColor: '#0E7490',
    },
  },
  {
    kind: 'hud-radar-dial',
    name: 'Sonar Radar Sweep',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'radar', 'sonar', 'scan', 'dial', 'telemetry', 'circle'],
    defaultWidth: 250,
    defaultHeight: 250,
    defaultProps: {
      stickerKind: 'hud-radar-dial',
      label: 'SCAN',
      primaryColor: '#22D3EE',
      secondaryColor: '#08142B',
      accentColor: '#EC4899',
      outlineColor: '#155E75',
    },
  },
  {
    kind: 'hud-orbital-core',
    name: 'Orbital Reactor Core',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'orbital', 'core', 'reactor', 'ring', 'futuristic', 'sci-fi'],
    defaultWidth: 260,
    defaultHeight: 260,
    defaultProps: {
      stickerKind: 'hud-orbital-core',
      label: 'CORE',
      primaryColor: '#00E5FF',
      secondaryColor: '#0B152A',
      accentColor: '#A855F7',
      outlineColor: '#1E40AF',
    },
  },
  {
    kind: 'hud-globe-meridian',
    name: 'Cyber Globe Wireframe',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'globe', 'earth', 'wireframe', 'network', 'world', 'global'],
    defaultWidth: 260,
    defaultHeight: 260,
    defaultProps: {
      stickerKind: 'hud-globe-meridian',
      label: 'GLOBAL',
      primaryColor: '#22D3EE',
      secondaryColor: '#0A1936',
      accentColor: '#D946EF',
      outlineColor: '#0369A1',
    },
  },
  {
    kind: 'hud-biometric-scan',
    name: 'Biometric Ring Scan',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'biometric', 'fingerprint', 'security', 'auth', 'scan'],
    defaultWidth: 250,
    defaultHeight: 250,
    defaultProps: {
      stickerKind: 'hud-biometric-scan',
      label: 'VERIFIED',
      primaryColor: '#00E5FF',
      secondaryColor: '#081834',
      accentColor: '#34D399',
      outlineColor: '#1D4ED8',
    },
  },
  {
    kind: 'hud-equalizer-rack',
    name: 'Twin LED Level Rack',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'equalizer', 'bars', 'meter', 'level', 'spectrum', 'audio'],
    defaultWidth: 210,
    defaultHeight: 260,
    defaultProps: {
      stickerKind: 'hud-equalizer-rack',
      label: 'SIGNAL',
      primaryColor: '#22D3EE',
      secondaryColor: '#0B172E',
      accentColor: '#D946EF',
      outlineColor: '#1E3A8A',
    },
  },
  {
    kind: 'hud-waveform-telemetry',
    name: 'Telemetry Wave Graph',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'waveform', 'graph', 'chart', 'telemetry', 'analytics', 'data'],
    defaultWidth: 380,
    defaultHeight: 180,
    defaultProps: {
      stickerKind: 'hud-waveform-telemetry',
      label: 'TELEMETRY',
      primaryColor: '#00E5FF',
      secondaryColor: '#0B152B',
      accentColor: '#EC4899',
      outlineColor: '#1E3A5F',
    },
  },
  {
    kind: 'hud-radial-gauge-donut',
    name: 'Radial Data Ring',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'radial', 'donut', 'gauge', 'ring', 'percent', 'infographic'],
    defaultWidth: 250,
    defaultHeight: 250,
    defaultProps: {
      stickerKind: 'hud-radial-gauge-donut',
      label: '94%',
      primaryColor: '#00E5FF',
      secondaryColor: '#0A1730',
      accentColor: '#D946EF',
      outlineColor: '#1D4ED8',
    },
  },
  {
    kind: 'hud-radial-equalizer',
    name: 'Radial Spectrum Ring',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'radial', 'equalizer', 'spectrum', 'music', 'ai', 'ring'],
    defaultWidth: 250,
    defaultHeight: 250,
    defaultProps: {
      stickerKind: 'hud-radial-equalizer',
      label: 'FREQ',
      primaryColor: '#38BDF8',
      secondaryColor: '#0B1528',
      accentColor: '#818CF8',
      outlineColor: '#0284C7',
    },
  },
  {
    kind: 'hud-circuit-chip',
    name: 'Quantum IC Processor',
    category: 'Tech & HUD',
    keywords: ['tech', 'chip', 'cpu', 'processor', 'ai', 'circuit', 'microchip', 'hardware'],
    defaultWidth: 240,
    defaultHeight: 240,
    defaultProps: {
      stickerKind: 'hud-circuit-chip',
      label: 'AI CORE',
      primaryColor: '#00E5FF',
      secondaryColor: '#0B162C',
      accentColor: '#A855F7',
      outlineColor: '#1E3A8A',
    },
  },
  {
    kind: 'hud-network-mesh',
    name: 'Cyber Node Network',
    category: 'Tech & HUD',
    keywords: ['tech', 'network', 'nodes', 'mesh', 'constellation', 'ai', 'connect', 'graph'],
    defaultWidth: 320,
    defaultHeight: 220,
    defaultProps: {
      stickerKind: 'hud-network-mesh',
      label: 'MESH',
      primaryColor: '#22D3EE',
      secondaryColor: '#0A162C',
      accentColor: '#EC4899',
      outlineColor: '#0284C7',
    },
  },
  {
    kind: 'hud-status-pill-tag',
    name: 'HUD Status Tag',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'badge', 'tag', 'status', 'online', 'label', 'cyber'],
    defaultWidth: 310,
    defaultHeight: 74,
    defaultProps: {
      stickerKind: 'hud-status-pill-tag',
      label: 'SYSTEM ONLINE · V4',
      primaryColor: '#00E5FF',
      secondaryColor: '#0B172A',
      accentColor: '#10B981',
      outlineColor: '#0E7490',
    },
  },
  {
    kind: 'hud-corner-circuit-left',
    name: 'Vertical PCB Bus',
    category: 'Tech & HUD',
    keywords: ['tech', 'circuit', 'pcb', 'trace', 'corner', 'lines', 'hardware'],
    defaultWidth: 160,
    defaultHeight: 340,
    defaultProps: {
      stickerKind: 'hud-corner-circuit-left',
      label: 'BUS-A',
      primaryColor: '#FFFFFF',
      secondaryColor: '#0EA5E9',
      accentColor: '#38BDF8',
      outlineColor: '#0369A1',
    },
  },
  {
    kind: 'hud-corner-circuit-right',
    name: 'Horizontal PCB Bus',
    category: 'Tech & HUD',
    keywords: ['tech', 'circuit', 'pcb', 'trace', 'lines', 'bus', 'electronic'],
    defaultWidth: 360,
    defaultHeight: 150,
    defaultProps: {
      stickerKind: 'hud-corner-circuit-right',
      label: 'BUS-B',
      primaryColor: '#FFFFFF',
      secondaryColor: '#0EA5E9',
      accentColor: '#22D3EE',
      outlineColor: '#0369A1',
    },
  },
  {
    kind: 'hud-orbital-arc-cluster',
    name: 'Orbital HUD Arc Wing',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'arc', 'orbital', 'turbine', 'ring', 'cyber', 'frame'],
    defaultWidth: 260,
    defaultHeight: 360,
    defaultProps: {
      stickerKind: 'hud-orbital-arc-cluster',
      label: 'ARC',
      primaryColor: '#00E5FF',
      secondaryColor: '#0284C7',
      accentColor: '#BAE6FD',
      outlineColor: '#0369A1',
    },
  },
  {
    kind: 'hud-data-pie-donut',
    name: 'Cyber Analytics Ring',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'pie', 'donut', 'analytics', 'infographic', 'ring', 'data'],
    defaultWidth: 240,
    defaultHeight: 240,
    defaultProps: {
      stickerKind: 'hud-data-pie-donut',
      label: '42%',
      primaryColor: '#00E5FF',
      secondaryColor: '#09152B',
      accentColor: '#EC4899',
      outlineColor: '#1D4ED8',
    },
  },
  {
    kind: 'hud-matrix-scanner-bar',
    name: 'Matrix Telemetry Header',
    category: 'Tech & HUD',
    keywords: ['tech', 'hud', 'header', 'divider', 'scanner', 'bar', 'cyber'],
    defaultWidth: 420,
    defaultHeight: 72,
    defaultProps: {
      stickerKind: 'hud-matrix-scanner-bar',
      label: 'DATA STREAM',
      primaryColor: '#00E5FF',
      secondaryColor: '#0B162B',
      accentColor: '#C084FC',
      outlineColor: '#1E3A8A',
    },
  },

  // ==================== 10 TECH BACKGROUNDS ====================
  {
    kind: 'bg-tech-pcb-dark',
    name: 'Obsidian Cyber PCB BG',
    category: 'Backgrounds',
    keywords: ['tech', 'background', 'pcb', 'circuit', 'dark', 'cyber', 'matrix', 'grid'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-tech-pcb-dark',
      label: 'PCB',
      primaryColor: '#040C1D',
      secondaryColor: '#0C244E',
      accentColor: '#00E5FF',
      outlineColor: '#3B82F6',
    },
  },
  {
    kind: 'bg-tech-cyan-arc',
    name: 'Azure Orbital Arc BG',
    category: 'Backgrounds',
    keywords: ['tech', 'background', 'cyan', 'blue', 'arc', 'circuit', 'futuristic', 'orbital'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-tech-cyan-arc',
      label: 'ARC',
      primaryColor: '#022047',
      secondaryColor: '#00A8E8',
      accentColor: '#FFFFFF',
      outlineColor: '#38BDF8',
    },
  },
  {
    kind: 'bg-tech-hud-command',
    name: 'HUD Command Grid BG',
    category: 'Backgrounds',
    keywords: ['tech', 'background', 'hud', 'grid', 'command', 'blueprint', 'tactical'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-tech-hud-command',
      label: 'COMMAND',
      primaryColor: '#071124',
      secondaryColor: '#0F2547',
      accentColor: '#22D3EE',
      outlineColor: '#1D4ED8',
    },
  },
  {
    kind: 'bg-tech-neon-hex',
    name: 'Cyber Honeycomb BG',
    category: 'Backgrounds',
    keywords: ['tech', 'background', 'hex', 'honeycomb', 'neon', 'cyber', 'mesh'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-tech-neon-hex',
      label: 'HEX',
      primaryColor: '#050B1C',
      secondaryColor: '#12224A',
      accentColor: '#00E5FF',
      outlineColor: '#6366F1',
    },
  },
  {
    kind: 'bg-tech-magenta-pulse',
    name: 'Dual-Tone Cyber Pulse BG',
    category: 'Backgrounds',
    keywords: ['tech', 'background', 'magenta', 'cyan', 'neon', 'circuit', 'synth'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-tech-magenta-pulse',
      label: 'PULSE',
      primaryColor: '#07091B',
      secondaryColor: '#1A1142',
      accentColor: '#00E5FF',
      outlineColor: '#EC4899',
    },
  },
  {
    kind: 'bg-tech-clean-blueprint',
    name: 'Ice Tech Blueprint BG',
    category: 'Backgrounds',
    keywords: ['tech', 'background', 'light', 'white', 'blueprint', 'clean', 'circuit', 'minimal'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-tech-clean-blueprint',
      label: 'BLUEPRINT',
      primaryColor: '#F8FBFF',
      secondaryColor: '#E0F2FE',
      accentColor: '#0284C7',
      outlineColor: '#38BDF8',
    },
  },
  {
    kind: 'bg-tech-perspective-grid',
    name: 'Cyber Horizon Grid BG',
    category: 'Backgrounds',
    keywords: ['tech', 'background', 'horizon', 'perspective', 'grid', 'synth', 'space'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-tech-perspective-grid',
      label: 'HORIZON',
      primaryColor: '#030816',
      secondaryColor: '#0D2149',
      accentColor: '#22D3EE',
      outlineColor: '#818CF8',
    },
  },
  {
    kind: 'bg-tech-fiber-stream',
    name: 'Optical Fiber Stream BG',
    category: 'Backgrounds',
    keywords: ['tech', 'background', 'fiber', 'data', 'stream', 'speed', 'lines', 'network'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-tech-fiber-stream',
      label: 'STREAM',
      primaryColor: '#040C1E',
      secondaryColor: '#0A2552',
      accentColor: '#38BDF8',
      outlineColor: '#A855F7',
    },
  },
  {
    kind: 'bg-tech-radar-sonar',
    name: 'Deep Sonar Telemetry BG',
    category: 'Backgrounds',
    keywords: ['tech', 'background', 'sonar', 'radar', 'rings', 'telemetry', 'hud'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-tech-radar-sonar',
      label: 'SONAR',
      primaryColor: '#041222',
      secondaryColor: '#092B3E',
      accentColor: '#2DD4BF',
      outlineColor: '#0EA5E9',
    },
  },
  {
    kind: 'bg-tech-emerald-terminal',
    name: 'Matrix Terminal PCB BG',
    category: 'Backgrounds',
    keywords: ['tech', 'background', 'emerald', 'green', 'matrix', 'terminal', 'circuit'],
    defaultWidth: 960,
    defaultHeight: 540,
    defaultProps: {
      stickerKind: 'bg-tech-emerald-terminal',
      label: 'TERMINAL',
      primaryColor: '#031210',
      secondaryColor: '#092B24',
      accentColor: '#10B981',
      outlineColor: '#34D399',
    },
  },
];

export function renderTechHudSvg(
  kind: string,
  c1: string,
  c2: string,
  acc: string,
  out: string,
  label: string,
  uid: string
): { viewBox: string; svg: string } | null {
  switch (kind) {
    case 'hud-cyber-frame-bracket': {
      const txt = esc((label || 'SYS // 01').slice(0, 18));
      return {
        viewBox: '0 0 340 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 220">
  <defs>
    <linearGradient id="${uid}-cf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c2}" stop-opacity="0.78" />
      <stop offset="100%" stop-color="${out}" stop-opacity="0.58" />
    </linearGradient>
    <filter id="${uid}-gl" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="b" />
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <polygon points="48,26 292,26 314,48 314,172 292,194 48,194 26,172 26,48" fill="url(#${uid}-cf)" />
  <polyline points="14,10 38,34 86,34 94,26 154,26" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#${uid}-gl)" />
  <polyline points="326,10 302,34 254,34 246,26 186,26" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#${uid}-gl)" />
  <polyline points="14,210 38,186 86,186 94,194 154,194" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#${uid}-gl)" />
  <polyline points="326,210 302,186 254,186 246,194 186,194" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#${uid}-gl)" />
  <polyline points="38,34 24,48 24,94" fill="none" stroke="${acc}" stroke-width="2.5" stroke-linecap="round" />
  <polyline points="302,34 316,48 316,94" fill="none" stroke="${acc}" stroke-width="2.5" stroke-linecap="round" />
  <polyline points="38,186 24,172 24,126" fill="none" stroke="${acc}" stroke-width="2.5" stroke-linecap="round" />
  <polyline points="302,186 316,172 316,126" fill="none" stroke="${acc}" stroke-width="2.5" stroke-linecap="round" />
  <polyline points="30,72 138,72 162,50 310,50" fill="none" stroke="${c1}" stroke-width="1.6" opacity="0.65" />
  <line x1="158" y1="26" x2="182" y2="26" stroke="${acc}" stroke-width="2" stroke-dasharray="4 3" />
  <line x1="158" y1="194" x2="182" y2="194" stroke="${acc}" stroke-width="2" stroke-dasharray="4 3" />
  <rect x="44" y="40" width="76" height="16" rx="3" fill="${c1}" fill-opacity="0.16" stroke="${c1}" stroke-width="1" />
  <text x="82" y="51" text-anchor="middle" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="700" font-size="8.5" letter-spacing="1.2">${txt}</text>
  <circle cx="300" cy="48" r="2.8" fill="${c1}" />
  <circle cx="40" cy="172" r="2.8" fill="${acc}" />
</svg>`,
      };
    }

    case 'hud-hex-progress-bar': {
      const cells = Array.from({ length: 10 }, (_, i) => {
        const cx = 56 + i * 28;
        const active = i < 7;
        const fill = active ? c1 : c2;
        const op = active ? 0.92 : 0.45;
        return `<polygon points="${cx - 10},36 ${cx + 4},36 ${cx + 12},48 ${cx + 4},60 ${cx - 10},60 ${cx - 2},48" fill="${fill}" fill-opacity="${op}" stroke="${active ? acc : out}" stroke-width="1.4" />`;
      }).join('');
      return {
        viewBox: '0 0 380 96',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 96">
  <polygon points="36,24 334,24 352,48 334,72 36,72 18,48" fill="${c2}" fill-opacity="0.72" stroke="${out}" stroke-width="1.5" />
  <polyline points="6,48 18,48 36,24 114,24" fill="none" stroke="${c1}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="374,48 352,48 334,72 252,72" fill="none" stroke="${c1}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="18,48 36,72 104,72 114,78 212,78" fill="none" stroke="${acc}" stroke-width="1.8" stroke-linecap="round" />
  <circle cx="6" cy="48" r="3" fill="${c1}" />
  <circle cx="374" cy="48" r="3" fill="${c1}" />
  ${cells}
  <polyline points="236,16 244,24 252,16" fill="none" stroke="${c1}" stroke-width="2" stroke-linecap="round" />
  <text x="334" y="17" text-anchor="end" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="700" font-size="11" letter-spacing="1.4">${esc((label || '70%').slice(0, 12))}</text>
</svg>`,
      };
    }

    case 'hud-angled-slash-bar': {
      const slashes = Array.from({ length: 16 }, (_, i) => {
        const sx = 46 + i * 18;
        const active = i < 11;
        return `<polygon points="${sx},52 ${sx + 9},32 ${sx + 18},32 ${sx + 9},52" fill="${active ? c1 : acc}" fill-opacity="${active ? 0.92 : 0.2}" />`;
      }).join('');
      return {
        viewBox: '0 0 380 84',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 84">
  <polygon points="36,22 344,22 362,42 344,62 36,62 18,42" fill="${c2}" fill-opacity="0.8" stroke="${c1}" stroke-width="2.2" />
  <line x1="4" y1="42" x2="18" y2="42" stroke="${c1}" stroke-width="2" />
  <line x1="362" y1="42" x2="376" y2="42" stroke="${c1}" stroke-width="2" />
  <polyline points="38,22 66,22 72,15 170,15" fill="none" stroke="${acc}" stroke-width="2" />
  ${slashes}
  <text x="344" y="15" text-anchor="end" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="700" font-size="9.5" letter-spacing="1.5">${esc((label || 'CHARGE 80%').slice(0, 16))}</text>
</svg>`,
      };
    }

    case 'hud-modular-panel': {
      const txt = esc((label || 'NODE // ACTIVE').slice(0, 20));
      return {
        viewBox: '0 0 380 210',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 210">
  <polygon points="36,20 156,20 172,34 208,34 224,20 344,20 364,40 364,170 344,190 224,190 208,176 172,176 156,190 36,190 16,170 16,40" fill="${c2}" fill-opacity="0.82" stroke="${out}" stroke-width="1.6" />
  <polyline points="16,96 16,40 36,20 156,20 172,34 208,34 224,20 344,20 364,40 364,96" fill="none" stroke="${c1}" stroke-width="2.5" stroke-linejoin="round" />
  <polyline points="16,114 16,170 36,190 156,190 172,176 208,176 224,190 344,190 364,170 364,114" fill="none" stroke="${c1}" stroke-width="2.5" stroke-linejoin="round" />
  <line x1="112" y1="12" x2="152" y2="12" stroke="${c1}" stroke-width="3" stroke-linecap="round" />
  <line x1="228" y1="12" x2="268" y2="12" stroke="${acc}" stroke-width="3" stroke-linecap="round" />
  <polyline points="208,176 254,132 346,132" fill="none" stroke="${c1}" stroke-width="2.4" stroke-linecap="round" />
  <rect x="34" y="36" width="124" height="20" rx="3" fill="${c1}" fill-opacity="0.14" stroke="${c1}" stroke-width="1" />
  <circle cx="45" cy="46" r="3" fill="${acc}" />
  <text x="55" y="49.5" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="700" font-size="9" letter-spacing="1.1">${txt}</text>
  <line x1="34" y1="168" x2="136" y2="168" stroke="${c1}" stroke-width="1.2" opacity="0.45" stroke-dasharray="6 4" />
</svg>`,
      };
    }

    case 'hud-split-corner-frame':
      return {
        viewBox: '0 0 300 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240">
  <rect x="22" y="18" width="256" height="204" rx="14" fill="${c2}" fill-opacity="0.22" />
  <polyline points="82,18 36,18 22,32 22,86" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="218,18 264,18 278,32 278,86" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="82,222 36,222 22,208 22,154" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="218,222 264,222 278,208 278,154" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  <line x1="142" y1="120" x2="158" y2="120" stroke="${c1}" stroke-width="1.8" opacity="0.7" />
  <line x1="150" y1="112" x2="150" y2="128" stroke="${c1}" stroke-width="1.8" opacity="0.7" />
  <circle cx="42" cy="36" r="4" fill="${acc}" />
  <text x="52" y="39.5" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="700" font-size="10" letter-spacing="1.4">${esc((label || 'REC').slice(0, 10))}</text>
  <line x1="22" y1="104" x2="22" y2="136" stroke="${acc}" stroke-width="2" />
  <line x1="278" y1="104" x2="278" y2="136" stroke="${acc}" stroke-width="2" />
</svg>`,
      };

    case 'hud-target-ring': {
      const ticks = Array.from({ length: 36 }, (_, i) => {
        const a = (i * 10 * Math.PI) / 180;
        const r1 = i % 3 === 0 ? 92 : 98;
        const r2 = 108;
        return `<line x1="${(120 + Math.cos(a) * r1).toFixed(1)}" y1="${(120 + Math.sin(a) * r1).toFixed(1)}" x2="${(120 + Math.cos(a) * r2).toFixed(1)}" y2="${(120 + Math.sin(a) * r2).toFixed(1)}" stroke="${i % 3 === 0 ? c1 : acc}" stroke-width="${i % 3 === 0 ? 2.4 : 1.4}" stroke-linecap="round" />`;
      }).join('');
      return {
        viewBox: '0 0 240 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <circle cx="120" cy="120" r="88" fill="${c2}" fill-opacity="0.45" />
  ${ticks}
  <path d="M 120 34 A 86 86 0 0 1 206 120" fill="none" stroke="${c1}" stroke-width="5" stroke-linecap="round" />
  <path d="M 120 206 A 86 86 0 0 1 34 120" fill="none" stroke="${acc}" stroke-width="5" stroke-linecap="round" />
  <circle cx="120" cy="120" r="64" fill="none" stroke="${c1}" stroke-width="1.6" stroke-dasharray="14 8" />
  <circle cx="120" cy="120" r="36" fill="none" stroke="${out}" stroke-width="1.8" />
  <line x1="102" y1="120" x2="112" y2="120" stroke="${c1}" stroke-width="2" />
  <line x1="128" y1="120" x2="138" y2="120" stroke="${c1}" stroke-width="2" />
  <line x1="120" y1="102" x2="120" y2="112" stroke="${c1}" stroke-width="2" />
  <line x1="120" y1="128" x2="120" y2="138" stroke="${c1}" stroke-width="2" />
  <circle cx="120" cy="120" r="4" fill="${acc}" />
  <text x="120" y="168" text-anchor="middle" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="700" font-size="9.5" letter-spacing="2">${esc((label || 'LOCK').slice(0, 10))}</text>
</svg>`,
      };
    }

    case 'hud-radar-dial': {
      const outerDots = Array.from({ length: 32 }, (_, i) => {
        const a = (i * 11.25 * Math.PI) / 180;
        const x1 = 125 + Math.cos(a) * 108;
        const y1 = 125 + Math.sin(a) * 108;
        const x2 = 125 + Math.cos(a) * 114;
        const y2 = 125 + Math.sin(a) * 114;
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c1}" stroke-width="${i % 4 === 0 ? 3 : 1.5}" opacity="${i % 4 === 0 ? 0.95 : 0.45}" />`;
      }).join('');
      return {
        viewBox: '0 0 250 250',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250">
  <defs>
    <radialGradient id="${uid}-rad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.22" />
      <stop offset="100%" stop-color="${c2}" stop-opacity="0.92" />
    </radialGradient>
    <linearGradient id="${uid}-sw" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.52" />
      <stop offset="100%" stop-color="${c1}" stop-opacity="0.0" />
    </linearGradient>
  </defs>
  <circle cx="125" cy="125" r="102" fill="url(#${uid}-rad)" stroke="${out}" stroke-width="2" />
  ${outerDots}
  <path d="M 125 125 L 125 27 A 98 98 0 0 1 215 86 Z" fill="url(#${uid}-sw)" />
  <circle cx="125" cy="125" r="78" fill="none" stroke="${c1}" stroke-width="1" opacity="0.45" />
  <circle cx="125" cy="125" r="54" fill="none" stroke="${c1}" stroke-width="1" opacity="0.45" />
  <circle cx="125" cy="125" r="30" fill="none" stroke="${c1}" stroke-width="1" opacity="0.5" />
  <line x1="25" y1="125" x2="225" y2="125" stroke="${c1}" stroke-width="1" opacity="0.4" />
  <line x1="125" y1="25" x2="125" y2="225" stroke="${c1}" stroke-width="1" opacity="0.4" />
  <line x1="54" y1="54" x2="196" y2="196" stroke="${c1}" stroke-width="0.9" opacity="0.25" />
  <line x1="196" y1="54" x2="54" y2="196" stroke="${c1}" stroke-width="0.9" opacity="0.25" />
  <line x1="125" y1="125" x2="194" y2="62" stroke="${c1}" stroke-width="2.2" />
  <circle cx="164" cy="76" r="5" fill="${acc}" />
  <circle cx="164" cy="76" r="9" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.7" />
  <circle cx="88" cy="158" r="4" fill="${c1}" />
  <circle cx="154" cy="166" r="3.5" fill="${acc}" />
  <circle cx="125" cy="125" r="4.5" fill="${c1}" />
  <text x="125" y="216" text-anchor="middle" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="700" font-size="9" letter-spacing="1.6">${esc((label || 'SCAN').slice(0, 10))}</text>
</svg>`,
      };
    }

    case 'hud-orbital-core': {
      const dots = Array.from({ length: 24 }, (_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        return `<circle cx="${(130 + Math.cos(a) * 108).toFixed(1)}" cy="${(130 + Math.sin(a) * 108).toFixed(1)}" r="${i % 6 === 0 ? 3.2 : 1.8}" fill="${i % 2 === 0 ? c1 : acc}" />`;
      }).join('');
      return {
        viewBox: '0 0 260 260',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260">
  <circle cx="130" cy="130" r="96" fill="${c2}" fill-opacity="0.65" />
  ${dots}
  <path d="M 48 92 A 90 90 0 0 1 174 52" fill="none" stroke="${c1}" stroke-width="7" stroke-linecap="round" />
  <path d="M 212 168 A 90 90 0 0 1 86 208" fill="none" stroke="${c1}" stroke-width="7" stroke-linecap="round" />
  <path d="M 196 66 A 92 92 0 0 1 218 142" fill="none" stroke="${acc}" stroke-width="4.5" stroke-linecap="round" />
  <circle cx="130" cy="130" r="68" fill="none" stroke="${c1}" stroke-width="2" stroke-dasharray="24 10" />
  <circle cx="130" cy="130" r="48" fill="${c2}" stroke="${acc}" stroke-width="3" />
  <circle cx="130" cy="130" r="34" fill="none" stroke="${c1}" stroke-width="1.5" opacity="0.6" />
  <text x="130" y="134" text-anchor="middle" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="800" font-size="13" letter-spacing="1.8">${esc((label || 'CORE').slice(0, 8))}</text>
</svg>`,
      };
    }

    case 'hud-globe-meridian': {
      const collarDots = Array.from({ length: 28 }, (_, i) => {
        const a = (i * (360 / 28) * Math.PI) / 180;
        return `<circle cx="${(130 + Math.cos(a) * 102).toFixed(1)}" cy="${(130 + Math.sin(a) * 102).toFixed(1)}" r="2.5" fill="${i % 3 === 0 ? acc : c1}" />`;
      }).join('');
      return {
        viewBox: '0 0 260 260',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260">
  <circle cx="130" cy="130" r="92" fill="${c2}" fill-opacity="0.72" />
  ${collarDots}
  <path d="M 54 68 A 104 104 0 0 1 206 68" fill="none" stroke="${c1}" stroke-width="4.5" stroke-linecap="round" />
  <path d="M 206 192 A 104 104 0 0 1 54 192" fill="none" stroke="${c1}" stroke-width="4.5" stroke-linecap="round" />
  <circle cx="130" cy="130" r="68" fill="${c2}" stroke="${c1}" stroke-width="2.4" />
  <ellipse cx="130" cy="130" rx="46" ry="68" fill="none" stroke="${c1}" stroke-width="1.4" opacity="0.75" />
  <ellipse cx="130" cy="130" rx="22" ry="68" fill="none" stroke="${c1}" stroke-width="1.4" opacity="0.75" />
  <line x1="130" y1="62" x2="130" y2="198" stroke="${c1}" stroke-width="1.4" opacity="0.75" />
  <line x1="62" y1="130" x2="198" y2="130" stroke="${c1}" stroke-width="1.6" opacity="0.85" />
  <path d="M 70 100 Q 130 112 190 100" fill="none" stroke="${c1}" stroke-width="1.3" opacity="0.7" />
  <path d="M 70 160 Q 130 148 190 160" fill="none" stroke="${c1}" stroke-width="1.3" opacity="0.7" />
  <line x1="14" y1="54" x2="36" y2="54" stroke="${c1}" stroke-width="2" />
  <line x1="224" y1="54" x2="246" y2="54" stroke="${c1}" stroke-width="2" />
  <line x1="14" y1="206" x2="36" y2="206" stroke="${acc}" stroke-width="2" />
  <line x1="224" y1="206" x2="246" y2="206" stroke="${acc}" stroke-width="2" />
  <circle cx="164" cy="108" r="4" fill="${acc}" />
  <circle cx="96" cy="148" r="3.5" fill="${c1}" />
</svg>`,
      };
    }

    case 'hud-biometric-scan':
      return {
        viewBox: '0 0 250 250',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250">
  <circle cx="125" cy="125" r="106" fill="${c2}" fill-opacity="0.78" stroke="${out}" stroke-width="1.8" />
  <path d="M 125 18 A 107 107 0 0 1 226 90" fill="none" stroke="${c1}" stroke-width="6" stroke-linecap="round" />
  <path d="M 125 232 A 107 107 0 0 1 24 160" fill="none" stroke="${c1}" stroke-width="6" stroke-linecap="round" />
  <circle cx="125" cy="125" r="88" fill="none" stroke="${c1}" stroke-width="1.6" stroke-dasharray="10 7" />
  <circle cx="125" cy="125" r="64" fill="${out}" fill-opacity="0.28" stroke="${c1}" stroke-width="1.4" />
  <path d="M 94 142 C 94 106 106 86 125 86 C 144 86 156 106 156 140" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round" />
  <path d="M 103 148 C 103 114 112 97 125 97 C 138 97 147 114 147 146" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round" />
  <path d="M 112 152 C 112 124 118 109 125 109 C 132 109 138 124 138 150" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round" />
  <path d="M 121 154 C 121 134 123 121 125 121 C 127 121 129 134 129 152" fill="none" stroke="${acc}" stroke-width="3" stroke-linecap="round" />
  <line x1="76" y1="126" x2="174" y2="126" stroke="${acc}" stroke-width="2.4" stroke-linecap="round" />
  <text x="125" y="205" text-anchor="middle" fill="${acc}" font-family="Space Grotesk, monospace" font-weight="700" font-size="9" letter-spacing="1.6">${esc((label || 'VERIFIED').slice(0, 12))}</text>
</svg>`,
      };

    case 'hud-equalizer-rack': {
      const leftBars = Array.from({ length: 14 }, (_, i) => {
        const y = 34 + i * 14;
        const active = i >= 2;
        const fill = i < 6 ? acc : c1;
        return `<rect x="46" y="${y}" width="44" height="8" rx="1.5" fill="${fill}" opacity="${active ? 0.92 : 0.24}" />`;
      }).join('');
      const rightBars = Array.from({ length: 14 }, (_, i) => {
        const y = 34 + i * 14;
        const active = i >= 4;
        return `<rect x="120" y="${y}" width="44" height="8" rx="1.5" fill="${c1}" opacity="${active ? 0.92 : 0.24}" />`;
      }).join('');
      return {
        viewBox: '0 0 210 260',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 260">
  <rect x="34" y="18" width="68" height="222" rx="4" fill="${c2}" fill-opacity="0.72" stroke="${out}" stroke-width="2" />
  <rect x="108" y="18" width="68" height="222" rx="4" fill="${c2}" fill-opacity="0.72" stroke="${out}" stroke-width="2" />
  <polyline points="34,42 34,18 60,18" fill="none" stroke="${c1}" stroke-width="3" />
  <polyline points="176,42 176,18 150,18" fill="none" stroke="${c1}" stroke-width="3" />
  <polyline points="34,216 34,240 60,240" fill="none" stroke="${c1}" stroke-width="3" />
  <polyline points="176,216 176,240 150,240" fill="none" stroke="${c1}" stroke-width="3" />
  ${leftBars}
  ${rightBars}
</svg>`,
      };
    }

    case 'hud-waveform-telemetry': {
      const ptsA: [number, number][] = [
        [24, 134], [58, 92], [94, 114], [132, 48], [170, 96], [208, 42], [248, 86], [286, 56], [322, 102], [356, 134],
      ];
      const ptsB: [number, number][] = [
        [24, 134], [62, 112], [102, 58], [142, 108], [182, 66], [224, 98], [262, 52], [302, 118], [336, 78], [356, 134],
      ];
      const polyA = ptsA.map((p) => p.join(',')).join(' ');
      const polyB = ptsB.map((p) => p.join(',')).join(' ');
      const nodesA = ptsA.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${c1}" />`).join('');
      const nodesB = ptsB.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${acc}" />`).join('');
      const baseDots = ptsA.map(([x], i) => `<circle cx="${x}" cy="156" r="3" fill="${i % 2 === 0 ? acc : c1}" />`).join('');
      return {
        viewBox: '0 0 380 180',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180">
  <rect x="10" y="12" width="360" height="156" rx="14" fill="${c2}" fill-opacity="0.72" stroke="${out}" stroke-width="1.6" />
  <line x1="24" y1="60" x2="356" y2="60" stroke="${c1}" stroke-width="0.8" opacity="0.2" stroke-dasharray="4 4" />
  <line x1="24" y1="98" x2="356" y2="98" stroke="${c1}" stroke-width="0.8" opacity="0.2" stroke-dasharray="4 4" />
  <line x1="24" y1="134" x2="356" y2="134" stroke="${c1}" stroke-width="1.2" opacity="0.4" />
  <polyline points="${polyB}" fill="none" stroke="${acc}" stroke-width="2.4" stroke-linejoin="round" />
  <polyline points="${polyA}" fill="none" stroke="${c1}" stroke-width="2.6" stroke-linejoin="round" />
  ${nodesB}
  ${nodesA}
  ${baseDots}
  <text x="26" y="30" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="700" font-size="9.5" letter-spacing="1.6">${esc((label || 'TELEMETRY').slice(0, 16))}</text>
</svg>`,
      };
    }

    case 'hud-radial-gauge-donut': {
      const segs = Array.from({ length: 18 }, (_, i) => {
        const a0 = (-90 + i * 20) * (Math.PI / 180);
        const a1 = (-90 + i * 20 + 14) * (Math.PI / 180);
        const rIn = 82;
        const rOut = 104;
        const x1 = 125 + Math.cos(a0) * rIn;
        const y1 = 125 + Math.sin(a0) * rIn;
        const x2 = 125 + Math.cos(a0) * rOut;
        const y2 = 125 + Math.sin(a0) * rOut;
        const x3 = 125 + Math.cos(a1) * rOut;
        const y3 = 125 + Math.sin(a1) * rOut;
        const x4 = 125 + Math.cos(a1) * rIn;
        const y4 = 125 + Math.sin(a1) * rIn;
        const active = i < 14;
        return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} A ${rOut} ${rOut} 0 0 1 ${x3.toFixed(1)} ${y3.toFixed(1)} L ${x4.toFixed(1)} ${y4.toFixed(1)} A ${rIn} ${rIn} 0 0 0 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${active ? (i % 4 === 0 ? acc : c1) : out}" opacity="${active ? 0.92 : 0.3}" />`;
      }).join('');
      return {
        viewBox: '0 0 250 250',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250">
  <circle cx="125" cy="125" r="108" fill="${c2}" fill-opacity="0.72" />
  ${segs}
  <circle cx="125" cy="125" r="68" fill="none" stroke="${acc}" stroke-width="5" stroke-dasharray="14 6" />
  <circle cx="125" cy="125" r="52" fill="${c2}" stroke="${c1}" stroke-width="2" />
  <text x="125" y="133" text-anchor="middle" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="800" font-size="24">${esc((label || '94%').slice(0, 8))}</text>
</svg>`,
      };
    }

    case 'hud-radial-equalizer': {
      const bars = Array.from({ length: 24 }, (_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const h = 14 + ((i * 7) % 18);
        const r1 = 80;
        const r2 = r1 + h;
        return `<line x1="${(125 + Math.cos(a) * r1).toFixed(1)}" y1="${(125 + Math.sin(a) * r1).toFixed(1)}" x2="${(125 + Math.cos(a) * r2).toFixed(1)}" y2="${(125 + Math.sin(a) * r2).toFixed(1)}" stroke="${i % 3 === 0 ? acc : c1}" stroke-width="5.5" stroke-linecap="round" />`;
      }).join('');
      const mini = [26, 44, 62, 38, 54, 30].map((val, idx) => {
        const bx = 93 + idx * 11;
        return `<rect x="${bx}" y="${154 - val}" width="7" height="${val}" rx="2" fill="${idx % 2 === 0 ? c1 : acc}" />`;
      }).join('');
      return {
        viewBox: '0 0 250 250',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250">
  <circle cx="125" cy="125" r="76" fill="${c2}" fill-opacity="0.72" stroke="${out}" stroke-width="1.5" />
  ${bars}
  ${mini}
  <text x="125" y="176" text-anchor="middle" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="700" font-size="9.5" letter-spacing="1.8">${esc((label || 'FREQ').slice(0, 10))}</text>
</svg>`,
      };
    }

    case 'hud-circuit-chip': {
      const pinsH = [76, 98, 120, 142, 164]
        .map(
          (pos) => `
        <line x1="${pos}" y1="28" x2="${pos}" y2="54" stroke="${c1}" stroke-width="4" stroke-linecap="round" />
        <line x1="${pos}" y1="186" x2="${pos}" y2="212" stroke="${c1}" stroke-width="4" stroke-linecap="round" />
        <line x1="28" y1="${pos}" x2="54" y2="${pos}" stroke="${acc}" stroke-width="4" stroke-linecap="round" />
        <line x1="186" y1="${pos}" x2="212" y2="${pos}" stroke="${acc}" stroke-width="4" stroke-linecap="round" />`
        )
        .join('');
      return {
        viewBox: '0 0 240 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  ${pinsH}
  <rect x="54" y="54" width="132" height="132" rx="18" fill="${c2}" stroke="${c1}" stroke-width="3.5" />
  <rect x="70" y="70" width="100" height="100" rx="12" fill="none" stroke="${acc}" stroke-width="1.8" stroke-dasharray="6 4" />
  <rect x="86" y="86" width="68" height="68" rx="10" fill="${out}" fill-opacity="0.55" stroke="${c1}" stroke-width="2" />
  <circle cx="64" cy="64" r="3" fill="${c1}" />
  <circle cx="176" cy="64" r="3" fill="${c1}" />
  <circle cx="64" cy="176" r="3" fill="${acc}" />
  <circle cx="176" cy="176" r="3" fill="${acc}" />
  <text x="120" y="125" text-anchor="middle" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="800" font-size="14" letter-spacing="1">${esc((label || 'AI CORE').slice(0, 8))}</text>
</svg>`,
      };
    }

    case 'hud-network-mesh': {
      const pts: [number, number][] = [
        [44, 152], [92, 54], [156, 108], [218, 44], [274, 118], [210, 174], [124, 176],
      ];
      const edges: [number, number][] = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [0, 2], [2, 4], [2, 5], [1, 3],
      ];
      const lines = edges
        .map(([a, b], i) => `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="${i % 3 === 0 ? acc : c1}" stroke-width="2" opacity="0.78" />`)
        .join('');
      const nodes = pts
        .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="9" fill="${c2}" stroke="${i % 2 === 0 ? c1 : acc}" stroke-width="3" /><circle cx="${x}" cy="${y}" r="3.5" fill="${i % 2 === 0 ? c1 : acc}" />`)
        .join('');
      return {
        viewBox: '0 0 320 220',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
  ${lines}
  ${nodes}
  <rect x="16" y="12" width="70" height="20" rx="4" fill="${c2}" stroke="${c1}" stroke-width="1.2" />
  <text x="51" y="25.5" text-anchor="middle" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="700" font-size="9" letter-spacing="1.4">${esc((label || 'MESH').slice(0, 10))}</text>
</svg>`,
      };
    }

    case 'hud-status-pill-tag':
      return {
        viewBox: '0 0 310 74',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 74">
  <polygon points="24,14 286,14 300,37 286,60 24,60 10,37" fill="${c2}" fill-opacity="0.92" stroke="${c1}" stroke-width="2.5" />
  <polygon points="28,20 40,20 34,54 22,54" fill="${c1}" fill-opacity="0.32" />
  <circle cx="52" cy="37" r="6" fill="${acc}" />
  <circle cx="52" cy="37" r="10" fill="none" stroke="${acc}" stroke-width="1.4" opacity="0.6" />
  <text x="72" y="41.5" fill="#FFFFFF" font-family="Space Grotesk, monospace" font-weight="700" font-size="14" letter-spacing="1.5">${esc((label || 'SYSTEM ONLINE · V4').slice(0, 22))}</text>
</svg>`,
      };

    case 'hud-corner-circuit-left':
      return {
        viewBox: '0 0 160 340',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 340">
  <polyline points="20,14 20,238 78,296" fill="none" stroke="${c1}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="42,14 42,188 94,240" fill="none" stroke="${acc}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="64,14 64,126 112,174 112,216" fill="none" stroke="${c2}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  <line x1="88" y1="14" x2="88" y2="86" stroke="${c1}" stroke-width="2" opacity="0.8" />
  <circle cx="88" cy="92" r="5" fill="${c1}" />
  <circle cx="112" cy="222" r="7" fill="${c2}" stroke="${c1}" stroke-width="3" />
  <circle cx="94" cy="240" r="6" fill="${acc}" />
  <circle cx="82" cy="300" r="11" fill="none" stroke="${c1}" stroke-width="3.5" />
  <circle cx="82" cy="300" r="4.5" fill="${c1}" />
</svg>`,
      };

    case 'hud-corner-circuit-right':
      return {
        viewBox: '0 0 360 150',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 150">
  <polyline points="348,24 148,24 118,54 44,54" fill="none" stroke="${c1}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="348,54 196,54 170,80 96,80" fill="none" stroke="${acc}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="348,86 242,86 208,120 72,120" fill="none" stroke="${c1}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="34" cy="54" r="10" fill="none" stroke="${c1}" stroke-width="3.5" />
  <circle cx="34" cy="54" r="4" fill="${c1}" />
  <circle cx="92" cy="80" r="5" fill="${acc}" />
  <circle cx="62" cy="120" r="11" fill="${c1}" />
</svg>`,
      };

    case 'hud-orbital-arc-cluster':
      return {
        viewBox: '0 0 260 360',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 360">
  <path d="M 32 38 A 164 164 0 0 1 196 202 L 154 202 A 122 122 0 0 0 32 80 Z" fill="${c1}" fill-opacity="0.22" stroke="${c1}" stroke-width="2" />
  <path d="M 32 76 A 126 126 0 0 1 158 202 L 128 202 A 96 96 0 0 0 32 106 Z" fill="${c2}" fill-opacity="0.34" />
  <path d="M 32 18 A 184 184 0 0 1 216 202" fill="none" stroke="${acc}" stroke-width="3" stroke-dasharray="28 10 8 10" />
  <path d="M 48 312 A 144 144 0 0 0 192 168" fill="none" stroke="${c1}" stroke-width="5" stroke-linecap="round" opacity="0.7" />
  <path d="M 78 330 A 160 160 0 0 0 232 198" fill="none" stroke="${acc}" stroke-width="2" opacity="0.6" />
</svg>`,
      };

    case 'hud-data-pie-donut':
      return {
        viewBox: '0 0 240 240',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <circle cx="120" cy="120" r="96" fill="${c2}" fill-opacity="0.78" stroke="${out}" stroke-width="2" />
  <circle cx="120" cy="120" r="76" fill="none" stroke="${out}" stroke-width="24" opacity="0.35" />
  <circle cx="120" cy="120" r="76" fill="none" stroke="${c1}" stroke-width="24" stroke-dasharray="200 478" stroke-dashoffset="0" transform="rotate(-90 120 120)" />
  <circle cx="120" cy="120" r="76" fill="none" stroke="${acc}" stroke-width="24" stroke-dasharray="145 478" stroke-dashoffset="-208" transform="rotate(-90 120 120)" />
  <circle cx="120" cy="120" r="52" fill="${c2}" stroke="${c1}" stroke-width="1.8" />
  <text x="120" y="128" text-anchor="middle" fill="#FFFFFF" font-family="Space Grotesk, monospace" font-weight="800" font-size="22">${esc((label || '42%').slice(0, 8))}</text>
</svg>`,
      };

    case 'hud-matrix-scanner-bar': {
      const dashes = Array.from({ length: 14 }, (_, i) => {
        const dx = 190 + i * 15;
        return `<polygon points="${dx},48 ${dx + 7},34 ${dx + 12},34 ${dx + 5},48" fill="${i < 9 ? acc : c1}" opacity="${i < 9 ? 0.9 : 0.35}" />`;
      }).join('');
      return {
        viewBox: '0 0 420 72',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 72">
  <polyline points="14,52 94,52 126,20 406,20" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round" />
  <circle cx="14" cy="52" r="4.5" fill="${c1}" />
  <circle cx="406" cy="20" r="4.5" fill="${acc}" />
  <polygon points="18,16 120,16 106,40 18,40" fill="${c2}" stroke="${c1}" stroke-width="1.6" />
  <text x="64" y="32" text-anchor="middle" fill="${c1}" font-family="Space Grotesk, monospace" font-weight="700" font-size="9.5" letter-spacing="1.2">${esc((label || 'DATA STREAM').slice(0, 12))}</text>
  ${dashes}
</svg>`,
      };
    }

    // ==================== 10 TECH BACKGROUNDS ====================
    case 'bg-tech-pcb-dark': {
      const grid = Array.from({ length: 17 }, (_, i) => {
        const x = 160 + i * 40;
        return `<line x1="${x}" y1="90" x2="${x}" y2="450" stroke="${acc}" stroke-width="0.6" opacity="0.14" />`;
      })
        .concat(
          Array.from({ length: 10 }, (_, j) => {
            const y = 90 + j * 40;
            return `<line x1="160" y1="${y}" x2="800" y2="${y}" stroke="${acc}" stroke-width="0.6" opacity="0.14" />`;
          })
        )
        .join('');
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-bg" cx="50%" cy="50%" r="72%">
      <stop offset="0%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c1}" />
    </radialGradient>
    <filter id="${uid}-ng" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="b" />
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-bg)" />
  ${grid}
  <!-- Left & Right Perimeter Circuit Matrix -->
  <g stroke="${out}" stroke-width="1.6" fill="none" opacity="0.72">
    <polyline points="0,42 180,42 220,76 340,76" />
    <polyline points="0,84 112,84 148,118 264,118" />
    <polyline points="0,164 96,164 134,202 226,202" />
    <polyline points="0,270 120,270 154,236 218,236" />
    <polyline points="0,368 106,368 144,330 232,330" />
    <polyline points="0,468 176,468 214,432 362,432" />
    <polyline points="960,42 780,42 740,76 620,76" />
    <polyline points="960,84 848,84 812,118 696,118" />
    <polyline points="960,164 864,164 826,202 734,202" />
    <polyline points="960,270 840,270 806,236 742,236" />
    <polyline points="960,368 854,368 816,330 728,330" />
    <polyline points="960,468 784,468 746,432 598,432" />
  </g>
  <!-- Hex Clusters -->
  <g fill="none" stroke="${acc}" stroke-width="1" opacity="0.28">
    <polygon points="140,144 156,134 172,144 172,162 156,172 140,162" />
    <polygon points="172,162 188,152 204,162 204,180 188,190 172,180" />
    <polygon points="788,144 804,134 820,144 820,162 804,172 788,162" />
    <polygon points="756,162 772,152 788,162 788,180 772,190 756,180" />
  </g>
  <!-- Glowing Solder Nodes -->
  <g filter="url(#${uid}-ng)">
    <circle cx="340" cy="76" r="4" fill="${acc}" />
    <circle cx="264" cy="118" r="3.5" fill="${acc}" />
    <circle cx="226" cy="202" r="4.5" fill="${acc}" />
    <circle cx="218" cy="236" r="3.5" fill="${acc}" />
    <circle cx="232" cy="330" r="4" fill="${acc}" />
    <circle cx="362" cy="432" r="4.5" fill="${acc}" />
    <circle cx="620" cy="76" r="4" fill="${acc}" />
    <circle cx="696" cy="118" r="3.5" fill="${acc}" />
    <circle cx="734" cy="202" r="4.5" fill="${acc}" />
    <circle cx="742" cy="236" r="3.5" fill="${acc}" />
    <circle cx="728" cy="330" r="4" fill="${acc}" />
    <circle cx="598" cy="432" r="4.5" fill="${acc}" />
  </g>
  <circle cx="156" cy="270" r="14" fill="none" stroke="${acc}" stroke-width="1.6" opacity="0.55" />
  <circle cx="804" cy="270" r="14" fill="none" stroke="${acc}" stroke-width="1.6" opacity="0.55" />
</svg>`,
      };
    }

    case 'bg-tech-cyan-arc':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <linearGradient id="${uid}-sky" x1="0%" y1="65%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="48%" stop-color="#01538E" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-sky)" />
  <!-- Layered Orbital HUD Arc on Left -->
  <circle cx="150" cy="340" r="300" fill="none" stroke="${out}" stroke-width="1.8" opacity="0.32" />
  <path d="M 150 96 A 244 244 0 0 1 394 340 L 326 340 A 176 176 0 0 0 150 164 Z" fill="${out}" fill-opacity="0.22" stroke="${out}" stroke-width="1.6" />
  <path d="M 150 132 A 208 208 0 0 1 348 274 L 288 294 A 146 146 0 0 0 150 194 Z" fill="${c2}" fill-opacity="0.38" />
  <path d="M 150 220 A 120 120 0 0 1 270 340" fill="none" stroke="${acc}" stroke-width="3" opacity="0.35" stroke-dasharray="18 10" />
  <!-- Left Vertical White Circuit Bus -->
  <polyline points="20,0 20,256 64,300" fill="none" stroke="${acc}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="42,0 42,208 98,264" fill="none" stroke="${acc}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="68,0 68,162 120,214 120,350" fill="none" stroke="${acc}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
  <line x1="92" y1="0" x2="92" y2="128" stroke="${acc}" stroke-width="2" />
  <circle cx="20" cy="140" r="8" fill="${acc}" />
  <circle cx="66" cy="306" r="12" fill="none" stroke="${acc}" stroke-width="4" />
  <circle cx="66" cy="306" r="5" fill="${acc}" />
  <circle cx="120" cy="358" r="14" fill="none" stroke="${acc}" stroke-width="4.5" />
  <circle cx="120" cy="358" r="6" fill="${acc}" />
  <!-- Top Right Horizontal White Circuit Bus -->
  <polyline points="960,54 786,54 756,84 624,84" fill="none" stroke="${acc}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="960,96 822,96 792,126 672,126" fill="none" stroke="${acc}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <polyline points="960,136 782,136 738,180 546,180" fill="none" stroke="${acc}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="614" cy="84" r="12" fill="none" stroke="${acc}" stroke-width="4" />
  <circle cx="614" cy="84" r="5" fill="${acc}" />
  <circle cx="666" cy="126" r="6" fill="${acc}" />
  <circle cx="534" cy="180" r="16" fill="${acc}" />
</svg>`,
      };

    case 'bg-tech-hud-command': {
      const gridLines = Array.from({ length: 19 }, (_, i) => {
        const x = i * 52;
        return `<line x1="${x}" y1="0" x2="${x}" y2="540" stroke="${acc}" stroke-width="0.6" opacity="0.14" />`;
      })
        .concat(
          Array.from({ length: 11 }, (_, j) => {
            const y = j * 52;
            return `<line x1="0" y1="${y}" x2="960" y2="${y}" stroke="${acc}" stroke-width="0.6" opacity="0.14" />`;
          })
        )
        .join('');
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-cmd" cx="50%" cy="50%" r="68%">
      <stop offset="0%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c1}" />
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-cmd)" />
  ${gridLines}
  <circle cx="480" cy="270" r="210" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.22" stroke-dasharray="16 10" />
  <circle cx="480" cy="270" r="154" fill="none" stroke="${out}" stroke-width="1.4" opacity="0.25" />
  <polyline points="28,72 28,28 72,28" fill="none" stroke="${acc}" stroke-width="3.5" />
  <polyline points="932,72 932,28 888,28" fill="none" stroke="${acc}" stroke-width="3.5" />
  <polyline points="28,468 28,512 72,512" fill="none" stroke="${acc}" stroke-width="3.5" />
  <polyline points="932,468 932,512 888,512" fill="none" stroke="${acc}" stroke-width="3.5" />
  <line x1="20" y1="270" x2="60" y2="270" stroke="${acc}" stroke-width="2" opacity="0.65" />
  <line x1="900" y1="270" x2="940" y2="270" stroke="${acc}" stroke-width="2" opacity="0.65" />
</svg>`,
      };
    }

    case 'bg-tech-neon-hex': {
      const hexes: string[] = [];
      const r = 38;
      const dx = r * 1.5;
      const dy = r * Math.sqrt(3);
      for (let col = 0; col < 18; col++) {
        for (let row = 0; row < 10; row++) {
          const cx = col * dx;
          const cy = row * dy + (col % 2 === 1 ? dy / 2 : 0);
          const pts = Array.from({ length: 6 }, (_, k) => {
            const a = (k * 60 * Math.PI) / 180;
            return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
          }).join(' ');
          const lit = (col + row) % 7 === 0;
          hexes.push(
            `<polygon points="${pts}" fill="${lit ? acc : 'none'}" fill-opacity="${lit ? 0.08 : 0}" stroke="${lit ? acc : out}" stroke-width="${lit ? 1.4 : 0.7}" opacity="${lit ? 0.45 : 0.2}" />`
          );
        }
      }
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-hx" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c1}" />
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-hx)" />
  ${hexes.join('')}
  <circle cx="171" cy="132" r="5" fill="${acc}" opacity="0.85" />
  <circle cx="798" cy="395" r="5" fill="${acc}" opacity="0.85" />
</svg>`,
      };
    }

    case 'bg-tech-magenta-pulse':
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <linearGradient id="${uid}-mp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="52%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c1}" />
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-mp)" />
  <circle cx="140" cy="420" r="240" fill="${acc}" fill-opacity="0.06" />
  <circle cx="820" cy="110" r="240" fill="${out}" fill-opacity="0.08" />
  <polyline points="0,78 210,78 256,124 380,124" fill="none" stroke="${acc}" stroke-width="2.5" opacity="0.7" />
  <polyline points="0,124 148,124 196,172 308,172" fill="none" stroke="${out}" stroke-width="2" opacity="0.65" />
  <polyline points="960,462 742,462 696,416 574,416" fill="none" stroke="${out}" stroke-width="2.5" opacity="0.7" />
  <polyline points="960,418 812,418 764,370 650,370" fill="none" stroke="${acc}" stroke-width="2" opacity="0.65" />
  <circle cx="380" cy="124" r="5.5" fill="${acc}" />
  <circle cx="308" cy="172" r="4.5" fill="${out}" />
  <circle cx="574" cy="416" r="5.5" fill="${out}" />
  <circle cx="650" cy="370" r="4.5" fill="${acc}" />
  <path d="M 860 190 A 140 140 0 0 0 860 350" fill="none" stroke="${out}" stroke-width="3" opacity="0.45" />
  <path d="M 100 190 A 140 140 0 0 1 100 350" fill="none" stroke="${acc}" stroke-width="3" opacity="0.45" />
</svg>`,
      };

    case 'bg-tech-clean-blueprint': {
      const lines = Array.from({ length: 24 }, (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="540" stroke="${out}" stroke-width="0.8" opacity="0.28" />`)
        .concat(Array.from({ length: 14 }, (_, j) => `<line x1="0" y1="${j * 40}" x2="960" y2="${j * 40}" stroke="${out}" stroke-width="0.8" opacity="0.28" />`))
        .join('');
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <linearGradient id="${uid}-cb" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-cb)" />
  ${lines}
  <polyline points="0,68 136,68 172,104 282,104" fill="none" stroke="${acc}" stroke-width="2.6" opacity="0.7" />
  <polyline points="960,472 824,472 788,436 678,436" fill="none" stroke="${acc}" stroke-width="2.6" opacity="0.7" />
  <circle cx="282" cy="104" r="6" fill="#FFFFFF" stroke="${acc}" stroke-width="2.5" />
  <circle cx="678" cy="436" r="6" fill="#FFFFFF" stroke="${acc}" stroke-width="2.5" />
  <rect x="24" y="24" width="912" height="492" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.26" />
</svg>`,
      };
    }

    case 'bg-tech-perspective-grid': {
      const rays = Array.from({ length: 17 }, (_, i) => {
        const bx = -160 + i * 80;
        return `<line x1="480" y1="230" x2="${bx}" y2="540" stroke="${acc}" stroke-width="1" opacity="0.34" />`;
      }).join('');
      const horz = [242, 260, 286, 322, 370, 434, 514]
        .map((y, idx) => `<line x1="0" y1="${y}" x2="960" y2="${y}" stroke="${idx < 2 ? out : acc}" stroke-width="1" opacity="${0.22 + idx * 0.06}" />`)
        .join('');
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <linearGradient id="${uid}-pg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="45%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c1}" />
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-pg)" />
  <circle cx="480" cy="230" r="96" fill="none" stroke="${out}" stroke-width="1.5" opacity="0.35" stroke-dasharray="12 8" />
  <line x1="0" y1="230" x2="960" y2="230" stroke="${acc}" stroke-width="2.4" opacity="0.72" />
  ${rays}
  ${horz}
</svg>`,
      };
    }

    case 'bg-tech-fiber-stream': {
      const streams = [76, 134, 198, 270, 344, 412, 470]
        .map((y, idx) => {
          const col = idx % 2 === 0 ? acc : out;
          return `<line x1="0" y1="${y}" x2="960" y2="${y}" stroke="${col}" stroke-width="1" opacity="0.22" />
            <line x1="${60 + idx * 70}" y1="${y}" x2="${260 + idx * 80}" y2="${y}" stroke="${col}" stroke-width="3.2" stroke-linecap="round" opacity="0.75" />
            <circle cx="${260 + idx * 80}" cy="${y}" r="4.5" fill="${col}" />`;
        })
        .join('');
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <linearGradient id="${uid}-fs" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-fs)" />
  ${streams}
</svg>`,
      };
    }

    case 'bg-tech-radar-sonar': {
      const ticks = Array.from({ length: 36 }, (_, i) => {
        const a = (i * 10 * Math.PI) / 180;
        return `<line x1="${(480 + Math.cos(a) * 212).toFixed(1)}" y1="${(270 + Math.sin(a) * 212).toFixed(1)}" x2="${(480 + Math.cos(a) * 224).toFixed(1)}" y2="${(270 + Math.sin(a) * 224).toFixed(1)}" stroke="${acc}" stroke-width="${i % 3 === 0 ? 2.2 : 1}" opacity="0.48" />`;
      }).join('');
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-sn" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c1}" />
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-sn)" />
  <circle cx="480" cy="270" r="245" fill="none" stroke="${out}" stroke-width="1" opacity="0.22" />
  <circle cx="480" cy="270" r="185" fill="none" stroke="${acc}" stroke-width="1.3" opacity="0.32" />
  <circle cx="480" cy="270" r="125" fill="none" stroke="${acc}" stroke-width="1" opacity="0.28" stroke-dasharray="10 8" />
  <circle cx="480" cy="270" r="65" fill="none" stroke="${out}" stroke-width="1" opacity="0.3" />
  <line x1="0" y1="270" x2="960" y2="270" stroke="${acc}" stroke-width="0.9" opacity="0.22" />
  <line x1="480" y1="0" x2="480" y2="540" stroke="${acc}" stroke-width="0.9" opacity="0.22" />
  ${ticks}
  <circle cx="628" cy="182" r="5" fill="${acc}" />
  <circle cx="348" cy="348" r="4" fill="${out}" />
</svg>`,
      };
    }

    case 'bg-tech-emerald-terminal': {
      const dotCols = Array.from({ length: 16 }, (_, c) =>
        Array.from({ length: 9 }, (_, r) => `<circle cx="${36 + c * 60}" cy="${36 + r * 60}" r="1.4" fill="${out}" opacity="0.2" />`).join('')
      ).join('');
      return {
        viewBox: '0 0 960 540',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="none">
  <defs>
    <radialGradient id="${uid}-et" cx="50%" cy="50%" r="72%">
      <stop offset="0%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c1}" />
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#${uid}-et)" />
  ${dotCols}
  <polyline points="0,56 178,56 218,96 340,96" fill="none" stroke="${acc}" stroke-width="2.2" opacity="0.7" />
  <polyline points="0,484 196,484 242,438 386,438" fill="none" stroke="${out}" stroke-width="2" opacity="0.65" />
  <polyline points="960,56 782,56 742,96 620,96" fill="none" stroke="${out}" stroke-width="2.2" opacity="0.7" />
  <polyline points="960,484 764,484 718,438 574,438" fill="none" stroke="${acc}" stroke-width="2" opacity="0.65" />
  <circle cx="340" cy="96" r="5" fill="${acc}" />
  <circle cx="386" cy="438" r="5" fill="${out}" />
  <circle cx="620" cy="96" r="5" fill="${out}" />
  <circle cx="574" cy="438" r="5" fill="${acc}" />
</svg>`,
      };
    }

    default:
      return null;
  }
}
