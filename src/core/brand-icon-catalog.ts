function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export type IconCategory =
  | 'Social Platforms'
  | 'Awards & Status'
  | 'Creative & UI'
  | 'Media & Tech'
  | 'Education'
  | 'Characters';

export interface IconCatalogDef {
  id: string;
  label: string;
  category: IconCategory;
  defaultColor: string;
  mode: 'fill' | 'stroke';
  paths: string[];
  brandMarkup: (uid: string) => string;
}

export const ICON_CATALOG: IconCatalogDef[] = [
  // ==================== 20 AUTHENTIC BRAND SOCIAL & PLATFORM ICONS ====================
  {
    id: 'social-instagram',
    label: 'Instagram',
    category: 'Social Platforms',
    defaultColor: '#E1306C',
    mode: 'fill',
    paths: [
      'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.4A4.6 4.6 0 1 0 16.6 12 4.6 4.6 0 0 0 12 7.4zm0 7.4A2.8 2.8 0 1 1 14.8 12 2.8 2.8 0 0 1 12 14.8zm5-7.9a1.1 1.1 0 1 0 1.1-1.1A1.1 1.1 0 0 0 17 6.9z',
    ],
    brandMarkup: (uid) => `
      <defs>
        <radialGradient id="${uid}-ig" cx="28%" cy="100%" r="120%">
          <stop offset="0%" stop-color="#FDF497"/>
          <stop offset="12%" stop-color="#FDF497"/>
          <stop offset="42%" stop-color="#FD5949"/>
          <stop offset="72%" stop-color="#D6249F"/>
          <stop offset="100%" stop-color="#285AEB"/>
        </radialGradient>
      </defs>
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#${uid}-ig)"/>
      <rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#FFFFFF" stroke-width="1.75"/>
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="#FFFFFF" stroke-width="1.75"/>
      <circle cx="16.4" cy="7.6" r="1.15" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'social-tiktok',
    label: 'TikTok',
    category: 'Social Platforms',
    defaultColor: '#111827',
    mode: 'fill',
    paths: [
      'M16.6 5.8A4.8 4.8 0 0 1 14 2h-3.1v13.2a2.6 2.6 0 1 1-1.8-2.5V9.5a5.8 5.8 0 1 0 4.9 5.7V8.4a7.8 7.8 0 0 0 4.6 1.5V6.8a4.7 4.7 0 0 1-2-.9z',
    ],
    brandMarkup: () => `
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#0F0F12"/>
      <g transform="translate(-0.7, -0.5)">
        <path d="M15.4 6.4A4.2 4.2 0 0 1 13.1 4h-2.5v10.6a2.2 2.2 0 1 1-1.6-2.1V9.9a4.8 4.8 0 1 0 4.1 4.7V9.1a6.4 6.4 0 0 0 3.9 1.3V7.9a4 4 0 0 1-1.6-1.5z" fill="#25F4EE"/>
      </g>
      <g transform="translate(0.7, 0.5)">
        <path d="M15.4 6.4A4.2 4.2 0 0 1 13.1 4h-2.5v10.6a2.2 2.2 0 1 1-1.6-2.1V9.9a4.8 4.8 0 1 0 4.1 4.7V9.1a6.4 6.4 0 0 0 3.9 1.3V7.9a4 4 0 0 1-1.6-1.5z" fill="#FE2C55"/>
      </g>
      <path d="M15.4 6.4A4.2 4.2 0 0 1 13.1 4h-2.5v10.6a2.2 2.2 0 1 1-1.6-2.1V9.9a4.8 4.8 0 1 0 4.1 4.7V9.1a6.4 6.4 0 0 0 3.9 1.3V7.9a4 4 0 0 1-1.6-1.5z" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'social-youtube',
    label: 'YouTube',
    category: 'Social Platforms',
    defaultColor: '#FF0000',
    mode: 'fill',
    paths: [
      'M22.5 6.5a2.8 2.8 0 0 0-2-2C18.8 4 12 4 12 4s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.5 2.8 2.8 0 0 0 2 2C5.2 20 12 20 12 20s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.5zM9.8 15.3V8.7L15.6 12l-5.8 3.3z',
    ],
    brandMarkup: () => `
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="#FF0000"/>
      <polygon points="9.75,15.35 15.85,12 9.75,8.65" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'social-x',
    label: 'X / Twitter',
    category: 'Social Platforms',
    defaultColor: '#0F172A',
    mode: 'fill',
    paths: [
      'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    ],
    brandMarkup: () => `
      <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="#0F172A"/>
      <path d="M16.9 5.5h2.3l-5.05 5.77L20.1 18.5h-4.65l-3.64-4.76L7.64 18.5H5.33l5.4-6.17L4.9 5.5h4.77l3.29 4.35L16.9 5.5zm-.81 11.68h1.28L8.96 6.75H7.58l8.51 10.43z" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'social-facebook',
    label: 'Facebook',
    category: 'Social Platforms',
    defaultColor: '#1877F2',
    mode: 'fill',
    paths: [
      'M12 1.5A10.5 10.5 0 1 0 13.6 22.4v-7.4h2.5l.5-3.1h-3v-2c0-.9.4-1.7 1.8-1.7h1.4V5.6s-1.2-.2-2.4-.2c-2.5 0-4.1 1.5-4.1 4.2v2.3H7.7V15h2.6v7.4A10.5 10.5 0 0 0 12 1.5z',
    ],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10.5" fill="#1877F2"/>
      <path d="M15.8 15.1l.5-3.1h-2.9v-2c0-.85.42-1.68 1.76-1.68h1.36V5.68s-1.24-.21-2.42-.21c-2.47 0-4.08 1.5-4.08 4.2v2.33H7.4v3.1h2.62v7.28a10.6 10.6 0 0 0 3.38 0V15.1h2.4z" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'social-linkedin',
    label: 'LinkedIn',
    category: 'Social Platforms',
    defaultColor: '#0A66C2',
    mode: 'fill',
    paths: [
      'M19.5 2h-15A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2zM8.2 18.8H5.4V9.8h2.8v9zM6.8 8.6a1.65 1.65 0 1 1 0-3.3 1.65 1.65 0 0 1 0 3.3zm12 10.2h-2.8v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.7H9.9V9.8h2.7V11h.1a3 3 0 0 1 2.7-1.5c2.9 0 3.4 1.9 3.4 4.4v4.9z',
    ],
    brandMarkup: () => `
      <rect x="1.5" y="1.5" width="21" height="21" rx="4.2" fill="#0A66C2"/>
      <rect x="5.4" y="9.8" width="2.8" height="8.7" rx="0.4" fill="#FFFFFF"/>
      <circle cx="6.8" cy="6.9" r="1.65" fill="#FFFFFF"/>
      <path d="M18.6 18.5h-2.8v-4.4c0-1.08-.02-2.46-1.5-2.46-1.5 0-1.73 1.17-1.73 2.38v4.48H9.78V9.8h2.68v1.18h.04a2.94 2.94 0 0 1 2.65-1.45c2.83 0 3.45 1.86 3.45 4.28v4.69z" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'social-discord',
    label: 'Discord',
    category: 'Social Platforms',
    defaultColor: '#5865F2',
    mode: 'fill',
    paths: [
      'M19.3 5.3a15.3 15.3 0 0 0-3.8-1.2l-.5 1.1a14 14 0 0 0-6 0l-.5-1.1a15.3 15.3 0 0 0-3.8 1.2C2.2 9 1.6 12.6 1.9 16.2a15.4 15.4 0 0 0 4.6 2.3l1-1.6c-.5-.2-1-.5-1.5-.8l.4-.3a11 11 0 0 0 9.2 0l.4.3c-.5.3-1 .6-1.5.8l1 1.6a15.4 15.4 0 0 0 4.6-2.3c.4-4.2-.6-7.8-2.8-10.9zM9.2 14c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8zm5.6 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8z',
    ],
    brandMarkup: () => `
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#5865F2"/>
      <path d="M17.3 7.5a11.7 11.7 0 0 0-2.9-.9l-.4.8a10.8 10.8 0 0 0-4 0l-.4-.8a11.7 11.7 0 0 0-2.9.9c-1.8 2.8-2.3 5.5-2.1 8.1a11.8 11.8 0 0 0 3.5 1.8l.7-1.2c-.4-.2-.8-.4-1.1-.6l.3-.2a8.4 8.4 0 0 0 7.2 0l.3.2c-.3.2-.7.4-1.1.6l.7 1.2a11.8 11.8 0 0 0 3.5-1.8c.3-3.1-.5-5.8-2.2-8.1z" fill="#FFFFFF"/>
      <ellipse cx="9.6" cy="12.6" rx="1.2" ry="1.45" fill="#5865F2"/>
      <ellipse cx="14.4" cy="12.6" rx="1.2" ry="1.45" fill="#5865F2"/>
    `,
  },
  {
    id: 'social-twitch',
    label: 'Twitch',
    category: 'Social Platforms',
    defaultColor: '#9146FF',
    mode: 'fill',
    paths: [
      'M3.5 2L2 5.8V19h4.8v2.8l2.8-2.8h4.2l6.2-6.2V2H3.5zm14.6 9.8l-3.2 3.2h-4.6l-2.8 2.8V15H4.4V3.8h13.7v8zM14.2 6.4v4.4h1.9V6.4h-1.9zm-4.4 0v4.4h1.9V6.4H9.8z',
    ],
    brandMarkup: () => `
      <path d="M4.2 2L2 5.6V19h5v3l3-3h4l6.5-6.5V2H4.2z" fill="#9146FF"/>
      <polygon points="5.8,3.8 18.7,3.8 18.7,11.6 15.5,14.8 11.2,14.8 8.6,17.4 8.6,14.8 5.8,14.8" fill="#FFFFFF"/>
      <rect x="10.2" y="6.6" width="1.9" height="4.8" rx="0.4" fill="#9146FF"/>
      <rect x="14.2" y="6.6" width="1.9" height="4.8" rx="0.4" fill="#9146FF"/>
    `,
  },
  {
    id: 'social-spotify',
    label: 'Spotify',
    category: 'Social Platforms',
    defaultColor: '#1DB954',
    mode: 'fill',
    paths: [
      'M12 1.5A10.5 10.5 0 1 0 22.5 12 10.5 10.5 0 0 0 12 1.5zm4.8 15.1a.7.7 0 0 1-.95.23c-2.6-1.6-5.88-1.96-9.73-1.08a.7.7 0 1 1-.31-1.36c4.22-.96 7.84-.55 10.76 1.24a.7.7 0 0 1 .23.97zm1.28-2.85a.87.87 0 0 1-1.2.29c-2.98-1.83-7.52-2.36-11.04-1.29a.87.87 0 1 1-.51-1.67c4.02-1.22 9.02-.63 12.46 1.48a.87.87 0 0 1 .29 1.19zm.11-2.96c-3.57-2.12-9.46-2.32-12.87-1.28a1.05 1.05 0 1 1-.61-2.01c3.92-1.19 10.42-.96 14.53 1.48a1.05 1.05 0 0 1-1.05 1.81z',
    ],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10.5" fill="#1DB954"/>
      <path d="M6.6 9.3c3.4-1.02 8.7-.82 11.7 1.02" fill="none" stroke="#FFFFFF" stroke-width="1.85" stroke-linecap="round"/>
      <path d="M7.4 12.6c2.9-.86 7.2-.48 9.8 1.12" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M8.2 15.7c2.3-.54 5.5-.32 7.7.98" fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
    `,
  },
  {
    id: 'social-github',
    label: 'GitHub',
    category: 'Social Platforms',
    defaultColor: '#181717',
    mode: 'fill',
    paths: [
      'M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.84c.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z',
    ],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10.5" fill="#181717"/>
      <path d="M12 4.3a7.7 7.7 0 0 0-2.43 15c.39.07.53-.17.53-.37v-1.4c-2.14.47-2.6-1.03-2.6-1.03-.35-.9-.86-1.13-.86-1.13-.7-.48.05-.47.05-.47.78.05 1.19.8 1.19.8.69 1.18 1.81.84 2.25.64.07-.5.27-.84.49-1.04-1.71-.2-3.51-.85-3.51-3.8 0-.84.3-1.53.79-2.07-.08-.2-.34-.98.08-2.04 0 0 .65-.21 2.12.79a7.3 7.3 0 0 1 3.86 0c1.47-1 2.12-.79 2.12-.79.42 1.06.16 1.84.08 2.04.49.54.79 1.23.79 2.07 0 2.96-1.8 3.6-3.52 3.8.28.24.53.71.53 1.43v2.12c0 .21.14.45.53.37A7.7 7.7 0 0 0 12 4.3z" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'social-pinterest',
    label: 'Pinterest',
    category: 'Social Platforms',
    defaultColor: '#E60023',
    mode: 'fill',
    paths: [
      'M12 1.5A10.5 10.5 0 0 0 8.17 21.8c-.05-.83-.1-2.11.02-3.02l.95-4.05s-.24-.49-.24-1.21c0-1.13.66-1.98 1.48-1.98.7 0 1.03.52 1.03 1.15 0 .7-.45 1.75-.68 2.72-.19.81.41 1.47 1.21 1.47 1.46 0 2.58-1.54 2.58-3.75 0-1.96-1.41-3.33-3.42-3.33-2.33 0-3.7 1.75-3.7 3.55 0 .7.27 1.46.61 1.87.07.08.08.15.06.24l-.23.92c-.04.15-.12.18-.28.11-1.05-.49-1.7-2.02-1.7-3.25 0-2.64 1.92-5.07 5.54-5.07 2.91 0 5.17 2.07 5.17 4.84 0 2.89-1.82 5.21-4.35 5.21-.85 0-1.65-.44-1.92-.96l-.52 1.99c-.19.73-.7 1.64-1.04 2.2A10.5 10.5 0 1 0 12 1.5z',
    ],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10.5" fill="#E60023"/>
      <path d="M12.3 5.5c-3.7 0-5.7 2.45-5.7 5.1 0 1.24.67 2.8 1.75 3.3.16.07.25.04.29-.11l.23-.93c.02-.09.01-.16-.06-.25-.35-.42-.62-1.19-.62-1.9 0-1.84 1.4-3.61 3.77-3.61 2.05 0 3.49 1.39 3.49 3.38 0 2.25-1.14 3.82-2.62 3.82-.82 0-1.43-.68-1.24-1.5.24-.99.69-2.06.69-2.77 0-.64-.34-1.17-1.05-1.17-.83 0-1.5.86-1.5 2.01 0 .74.25 1.24.25 1.24l-.98 4.13c-.12.92-.07 2.2-.02 3.04a10 10 0 0 0 1.38.45c.35-.57.88-1.49 1.07-2.23l.53-2.02c.28.53 1.09.98 1.96.98 2.57 0 4.43-2.36 4.43-5.3 0-2.82-2.3-4.92-5.26-4.92z" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'social-threads',
    label: 'Threads',
    category: 'Social Platforms',
    defaultColor: '#111827',
    mode: 'fill',
    paths: [
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.8 11.4c-.2 2.4-1.8 3.9-4.1 3.9-2.7 0-4.6-2-4.6-5.2s2-5.4 4.8-5.4c2.1 0 3.7 1.1 4.2 2.9l-1.7.5c-.3-1.1-1.2-1.7-2.5-1.7-1.8 0-3 1.4-3 3.7 0 2.1 1.1 3.5 2.8 3.5 1.3 0 2.2-.7 2.4-1.8-.8.2-1.7.2-2.5-.1-1.3-.5-2-1.6-1.8-2.9.2-1.4 1.4-2.3 2.9-2.2 1.2.1 2.2.8 2.6 1.9.7.3 1.2.9 1.2 1.7 0 .4-.2.8-.7 1.2z',
    ],
    brandMarkup: () => `
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#111827"/>
      <path d="M12.2 5.4c-3.6 0-6.2 2.6-6.2 6.6s2.6 6.6 6.2 6.6c2.2 0 4-.9 5.1-2.5l-1.4-1c-.8 1.2-2 1.8-3.6 1.8-2.6 0-4.4-1.9-4.4-4.9s1.8-4.9 4.3-4.9c2 0 3.4 1 3.9 2.7-.6-.4-1.4-.6-2.3-.7-2-.1-3.6 1.1-3.8 2.9-.2 1.7.8 3.1 2.4 3.6 1 .3 2 .2 2.9-.2-.2 1.1-1 1.8-2.2 1.8l.2 1.6c2.3 0 3.8-1.5 3.9-4 .7-.4 1.1-1.1 1-2-.2-1.1-.9-1.9-1.9-2.3-.7-2.5-2.6-4.2-5.1-4.2zm-.2 5.5c1.1 0 1.9.7 2 1.7-.7.4-1.6.5-2.3.3-.7-.2-1.1-.8-1-1.4.1-.4.6-.6 1.3-.6z" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'social-whatsapp',
    label: 'WhatsApp',
    category: 'Social Platforms',
    defaultColor: '#25D366',
    mode: 'fill',
    paths: [
      'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1.1.1-3.7-.9-3.1-1.2-5.1-4.3-5.2-4.5-.2-.2-1.2-1.6-1.2-3.1s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.5.8 1.9.8 2 .1.1.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.4-.5.5-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.6 2.8 1.7.3.1.5.1.7-.1.2-.2.8-.9 1-1.3.2-.3.5-.3.8-.2.3.1 1.9.9 2.2 1.1.3.2.5.2.6.4.1.2.1.8-.1 1.4z',
    ],
    brandMarkup: () => `
      <path d="M12 2a10 10 0 0 0-8.62 15.07L2 22l5.06-1.33A10 10 0 1 0 12 2z" fill="#25D366"/>
      <path d="M12 3.7a8.3 8.3 0 0 0-7.18 12.46l.28.44-.83 3.04 3.12-.82.43.25A8.3 8.3 0 1 0 12 3.7z" fill="none" stroke="#FFFFFF" stroke-width="1.35"/>
      <path d="M16.2 14.5c-.22-.11-1.34-.66-1.55-.74-.2-.07-.36-.11-.51.11-.15.22-.58.74-.71.89-.13.15-.26.17-.49.06-.22-.11-.95-.35-1.8-1.11-.67-.6-1.12-1.33-1.25-1.56-.13-.22-.01-.34.1-.45.1-.1.22-.26.34-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.51-1.23-.7-1.69-.18-.44-.37-.38-.51-.39h-.43c-.15 0-.39.06-.6.28-.2.22-.79.77-.79 1.88s.81 2.18.92 2.33c.11.15 1.59 2.43 3.86 3.41.54.23.96.37 1.29.47.54.17 1.03.15 1.42.09.43-.06 1.34-.55 1.53-1.08.19-.53.19-.98.13-1.08-.06-.09-.21-.15-.43-.26z" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'social-telegram',
    label: 'Telegram',
    category: 'Social Platforms',
    defaultColor: '#26A5E4',
    mode: 'fill',
    paths: [
      'M12 1.5A10.5 10.5 0 1 0 22.5 12 10.5 10.5 0 0 0 12 1.5zm4.9 7.2l-1.6 7.7c-.1.5-.4.7-.9.4l-2.5-1.9-1.2 1.2c-.1.1-.3.3-.6.3l.2-2.6 4.7-4.3c.2-.2 0-.3-.3-.1l-5.8 3.7-2.5-.8c-.5-.2-.6-.5.1-.8l9.8-3.8c.5-.2.9.1.7.9z',
    ],
    brandMarkup: (uid) => `
      <defs>
        <linearGradient id="${uid}-tg" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#37AEE2"/>
          <stop offset="100%" stop-color="#1E96C8"/>
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10.5" fill="url(#${uid}-tg)"/>
      <path d="M16.95 7.42l-1.92 9.04c-.14.64-.52.8-1.06.5l-2.92-2.16-1.41 1.36c-.16.16-.29.29-.59.29l.21-2.98 5.42-4.9c.24-.21-.05-.33-.37-.12l-6.7 4.22-2.88-.9c-.63-.2-.64-.63.13-.93l11.27-4.34c.52-.19.98.12.82.92z" fill="#FFFFFF"/>
      <polygon points="9.8,14.5 9.6,17.2 11.4,15.4" fill="#C8DAEA"/>
    `,
  },
  {
    id: 'social-snapchat',
    label: 'Snapchat',
    category: 'Social Platforms',
    defaultColor: '#FACC15',
    mode: 'fill',
    paths: [
      'M12 3a5 5 0 0 0-5 5v3c-1 .4-2 .5-2 1.3s1 .9 1.5 1.1c-.4 1.4-2 2.4-3.5 2.8.8.8 2 1.2 3 1.4.4.8 1.2 1.4 2 1.4 1.3 0 2.2-.8 4-.8s2.7.8 4 .8c.8 0 1.6-.6 2-1.4 1-.2 2.2-.6 3-1.4-1.5-.4-3.1-1.4-3.5-2.8.5-.2 1.5-.3 1.5-1.1s-1-.9-2-1.3V8a5 5 0 0 0-5-5z',
    ],
    brandMarkup: () => `
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#FFFC00"/>
      <path d="M12 5.2a3.8 3.8 0 0 0-3.8 3.8v2.2c-.8.3-1.5.4-1.5 1s.8.7 1.2.9c-.3 1.1-1.5 1.8-2.6 2.1.6.6 1.5.9 2.3 1.1.3.6.9 1.1 1.5 1.1 1 0 1.7-.6 2.9-.6s1.9.6 2.9.6c.6 0 1.2-.5 1.5-1.1.8-.2 1.7-.5 2.3-1.1-1.1-.3-2.3-1-2.6-2.1.4-.2 1.2-.3 1.2-.9s-.7-.7-1.5-1V9A3.8 3.8 0 0 0 12 5.2z" fill="#FFFFFF" stroke="#111827" stroke-width="1.25" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'social-dribbble',
    label: 'Dribbble',
    category: 'Social Platforms',
    defaultColor: '#EA4C89',
    mode: 'fill',
    paths: [
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
    ],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10.5" fill="#EA4C89"/>
      <circle cx="12" cy="12" r="9.3" fill="none" stroke="#C32361" stroke-width="1.45"/>
      <path d="M18.8 5.2C15.1 9.2 10.3 10.6 2.6 11" fill="none" stroke="#C32361" stroke-width="1.45"/>
      <path d="M21.4 12.9C15.1 11.5 9.7 13.7 5.5 18.8" fill="none" stroke="#C32361" stroke-width="1.45"/>
      <path d="M8.6 3.1c4.1 5.6 5.9 9.2 7.8 17.5" fill="none" stroke="#C32361" stroke-width="1.45"/>
    `,
  },
  {
    id: 'social-google',
    label: 'Google',
    category: 'Social Platforms',
    defaultColor: '#4285F4',
    mode: 'fill',
    paths: [
      'M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.6z',
      'M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.6c-.9.6-2.1 1-3.4 1-2.6 0-4.9-1.8-5.7-4.2H3v2.7A10 10 0 0 0 12 22z',
    ],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10.5" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
      <path d="M19.6 12.2c0-.58-.05-1.14-.15-1.67H12v3.16h4.26a3.64 3.64 0 0 1-1.58 2.39v1.98h2.56c1.5-1.38 2.36-3.41 2.36-5.86z" fill="#4285F4"/>
      <path d="M12 19.9c2.14 0 3.93-.71 5.24-1.92l-2.56-1.98c-.71.47-1.62.76-2.68.76-2.06 0-3.81-1.39-4.43-3.26H4.92v2.05A7.9 7.9 0 0 0 12 19.9z" fill="#34A853"/>
      <path d="M7.57 13.5a4.74 4.74 0 0 1 0-3V8.45H4.92a7.9 7.9 0 0 0 0 7.1l2.65-2.05z" fill="#FBBC05"/>
      <path d="M12 7.24c1.16 0 2.21.4 3.03 1.18l2.27-2.27A7.88 7.88 0 0 0 4.92 8.45l2.65 2.05C8.19 8.63 9.94 7.24 12 7.24z" fill="#EA4335"/>
    `,
  },
  {
    id: 'social-figma',
    label: 'Figma',
    category: 'Social Platforms',
    defaultColor: '#A259FF',
    mode: 'fill',
    paths: [
      'M8.5 2h7a3.5 3.5 0 0 1 0 7h-7a3.5 3.5 0 0 1 0-7zm0 7H12v7H8.5a3.5 3.5 0 0 1 0-7zm0 7H12v3.5A3.5 3.5 0 1 1 8.5 16zm7-7a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z',
    ],
    brandMarkup: () => `
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#1E1E1E"/>
      <path d="M9.5 19a2.5 2.5 0 0 0 2.5-2.5V14H9.5a2.5 2.5 0 0 0 0 5z" fill="#0ACF83"/>
      <path d="M7 11.5A2.5 2.5 0 0 1 9.5 9H12v5H9.5A2.5 2.5 0 0 1 7 11.5z" fill="#A259FF"/>
      <path d="M7 6.5A2.5 2.5 0 0 1 9.5 4H12v5H9.5A2.5 2.5 0 0 1 7 6.5z" fill="#F24E1E"/>
      <path d="M12 4h2.5a2.5 2.5 0 0 1 0 5H12V4z" fill="#FF7262"/>
      <circle cx="14.5" cy="11.5" r="2.5" fill="#1ABCFE"/>
    `,
  },
  {
    id: 'social-slack',
    label: 'Slack',
    category: 'Social Platforms',
    defaultColor: '#4A154B',
    mode: 'fill',
    paths: [
      'M6 15a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5zM9 6a2 2 0 1 1 2-2v2H9zm0 1a2 2 0 1 1 0 4H4a2 2 0 1 1 0-4h5zm9 2a2 2 0 1 1 2 2h-2V9zm-1 0a2 2 0 1 1-4 0V4a2 2 0 1 1 4 0v5zm-2 9a2 2 0 1 1-2 2v-2h2zm0-1a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4h-5z',
    ],
    brandMarkup: () => `
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
      <path d="M7.2 13.7a1.5 1.5 0 1 1-1.5-1.5h1.5v1.5zm.75 0a1.5 1.5 0 1 1 3 0v3.8a1.5 1.5 0 1 1-3 0v-3.8z" fill="#E01E5A"/>
      <path d="M10.3 7.2a1.5 1.5 0 1 1 1.5-1.5v1.5h-1.5zm0 .75a1.5 1.5 0 1 1 0 3H6.5a1.5 1.5 0 1 1 0-3h3.8z" fill="#36C5F0"/>
      <path d="M16.8 10.3a1.5 1.5 0 1 1 1.5 1.5h-1.5v-1.5zm-.75 0a1.5 1.5 0 1 1-3 0V6.5a1.5 1.5 0 1 1 3 0v3.8z" fill="#2EB67D"/>
      <path d="M13.7 16.8a1.5 1.5 0 1 1-1.5 1.5v-1.5h1.5zm0-.75a1.5 1.5 0 1 1 0-3h3.8a1.5 1.5 0 1 1 0 3h-3.8z" fill="#ECB22E"/>
    `,
  },
  {
    id: 'social-reddit',
    label: 'Reddit',
    category: 'Social Platforms',
    defaultColor: '#FF4500',
    mode: 'fill',
    paths: [
      'M12 1.5A10.5 10.5 0 1 0 22.5 12 10.5 10.5 0 0 0 12 1.5zm6.1 11.4c0 .4-.2.8-.6 1 0 2.3-2.5 4.2-5.5 4.2s-5.5-1.9-5.5-4.2c-.4-.2-.6-.6-.6-1 0-.7.6-1.3 1.3-1.3.4 0 .7.2 1 .4 1-.7 2.2-1.1 3.6-1.2l.7-3.2 2.3.5a1 1 0 1 1-.2.7l-1.5-.3-.5 2.4c1.3.1 2.6.5 3.5 1.2.3-.2.6-.4 1-.4.7 0 1.3.6 1.3 1.2z',
    ],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10.5" fill="#FF4500"/>
      <ellipse cx="12" cy="13.8" rx="5.5" ry="4.1" fill="#FFFFFF"/>
      <circle cx="6.8" cy="12.1" r="1.4" fill="#FFFFFF"/>
      <circle cx="17.2" cy="12.1" r="1.4" fill="#FFFFFF"/>
      <path d="M12 9.7l1-3.3 2.5.6" fill="none" stroke="#FFFFFF" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="16.2" cy="7.2" r="1.15" fill="#FFFFFF"/>
      <circle cx="9.9" cy="13.1" r="1" fill="#FF4500"/>
      <circle cx="14.1" cy="13.1" r="1" fill="#FF4500"/>
      <path d="M9.8 15.4c.7.6 1.5.8 2.2.8s1.5-.2 2.2-.8" fill="none" stroke="#FF4500" stroke-width="1" stroke-linecap="round"/>
    `,
  },

  // ==================== AWARDS & STATUS (FULL SOLID / MULTI-COLOR) ====================
  {
    id: 'star',
    label: 'Star',
    category: 'Awards & Status',
    defaultColor: '#F59E0B',
    mode: 'fill',
    paths: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
    brandMarkup: (uid) => `
      <defs>
        <linearGradient id="${uid}-st" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="55%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
      </defs>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#${uid}-st)" stroke="#B45309" stroke-width="0.7" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'sparkles',
    label: 'Sparkles',
    category: 'Creative & UI',
    defaultColor: '#8B5CF6',
    mode: 'fill',
    paths: [
      'M12 2l2.1 6.2L20 10.3l-5.9 2.1L12 18.6l-2.1-6.2L4 10.3l5.9-2.1L12 2z',
      'M19 15l1.1 2.9L23 19l-2.9 1.1L19 23l-1.1-2.9L15 19l2.9-1.1L19 15z',
      'M5 2l.8 2.2L8 5l-2.2.8L5 8l-.8-2.2L2 5l2.2-.8L5 2z',
    ],
    brandMarkup: () => `
      <path d="M12 2.5l2.1 6.1 6.1 2.1-6.1 2.1L12 18.9l-2.1-6.1-6.1-2.1 6.1-2.1L12 2.5z" fill="#FACC15" stroke="#D97706" stroke-width="0.6" stroke-linejoin="round"/>
      <path d="M19 15l1 2.6 2.6 1-2.6 1L19 22.2l-1-2.6-2.6-1 2.6-1L19 15z" fill="#A855F7"/>
      <path d="M5 2.5l.8 2.1 2.1.8-2.1.8L5 8.3l-.8-2.1-2.1-.8 2.1-.8L5 2.5z" fill="#38BDF8"/>
    `,
  },
  {
    id: 'heart',
    label: 'Heart',
    category: 'Creative & UI',
    defaultColor: '#E11D48',
    mode: 'fill',
    paths: ['M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'],
    brandMarkup: (uid) => `
      <defs>
        <linearGradient id="${uid}-ht" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FB7185"/>
          <stop offset="55%" stop-color="#E11D48"/>
          <stop offset="100%" stop-color="#9F1239"/>
        </linearGradient>
      </defs>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#${uid}-ht)"/>
      <ellipse cx="7.4" cy="7.2" rx="1.7" ry="0.95" fill="#FFFFFF" opacity="0.55" transform="rotate(-30 7.4 7.2)"/>
    `,
  },
  {
    id: 'flame',
    label: 'Flame',
    category: 'Awards & Status',
    defaultColor: '#F97316',
    mode: 'fill',
    paths: ['M13.5 2.2c.4 2.4 1.9 4.5 3.7 6.1 1.7 1.5 2.8 3.5 2.8 5.7a8 8 0 1 1-16 0c0-1.6.6-3.1 1.6-4.3.2 1.3.9 2.4 2 3 .3-2.5 1.5-5.6 5.9-10.5z'],
    brandMarkup: (uid) => `
      <defs>
        <linearGradient id="${uid}-fl" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#FACC15"/>
          <stop offset="55%" stop-color="#F97316"/>
          <stop offset="100%" stop-color="#DC2626"/>
        </linearGradient>
      </defs>
      <path d="M13 2c.6 2.8 2.3 4.8 4.1 6.5 1.6 1.5 2.7 3.4 2.7 5.6a7.8 7.8 0 1 1-15.6 0c0-1.5.5-3 1.4-4.2.2 1.2.9 2.2 2 2.7.2-2.6 1.6-5.9 5.4-10.6z" fill="url(#${uid}-fl)"/>
      <path d="M12.3 10.5c1.5 1.6 2.7 3 2.7 5a3.3 3.3 0 1 1-6.6 0c0-1.4.8-2.5 1.8-3.4.1.8.5 1.4 1.1 1.7.2-1.1.5-2.2 1-3.3z" fill="#FEF08A"/>
    `,
  },
  {
    id: 'zap',
    label: 'Bolt',
    category: 'Creative & UI',
    defaultColor: '#EAB308',
    mode: 'fill',
    paths: ['M13.5 2L4 13.5h6.5L9.5 22 19 10.5h-6.5L13.5 2z'],
    brandMarkup: () => `
      <polygon points="13.5,2 4,13.5 10.5,13.5 9.5,22 19.5,10 13,10" fill="#FACC15" stroke="#CA8A04" stroke-width="0.8" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'crown',
    label: 'Crown',
    category: 'Awards & Status',
    defaultColor: '#F59E0B',
    mode: 'fill',
    paths: ['M2.5 6l4.5 6 5-7 5 7 4.5-6-2 11h-15L2.5 6zm2.5 13h14v2.2H5V19z'],
    brandMarkup: () => `
      <polygon points="2.5,6.5 7,12 12,4.5 17,12 21.5,6.5 19.5,17 4.5,17" fill="#F59E0B" stroke="#B45309" stroke-width="0.8" stroke-linejoin="round"/>
      <rect x="4.5" y="18.2" width="15" height="2.6" rx="1.2" fill="#D97706"/>
      <circle cx="12" cy="13.2" r="1.35" fill="#EF4444"/>
      <circle cx="7.8" cy="14" r="1.05" fill="#3B82F6"/>
      <circle cx="16.2" cy="14" r="1.05" fill="#10B981"/>
    `,
  },
  {
    id: 'award',
    label: 'Award',
    category: 'Awards & Status',
    defaultColor: '#D97706',
    mode: 'fill',
    paths: ['M12 14.5a6.2 6.2 0 1 0 0-12.4 6.2 6.2 0 0 0 0 12.4zm-3.8-.5L7 22.5l5-2.7 5 2.7-1.2-8.5a7.2 7.2 0 0 1-7.6 0z'],
    brandMarkup: () => `
      <polygon points="7.5,13.5 6.5,22.5 12,19.5 17.5,22.5 16.5,13.5" fill="#2563EB"/>
      <circle cx="12" cy="8.8" r="6.5" fill="#F59E0B" stroke="#B45309" stroke-width="0.8"/>
      <circle cx="12" cy="8.8" r="4.3" fill="#FDE047"/>
      <polygon points="12,5.8 12.9,7.7 15,8 13.5,9.4 13.8,11.5 12,10.5 10.2,11.5 10.5,9.4 9,8 11.1,7.7" fill="#D97706"/>
    `,
  },
  {
    id: 'trophy',
    label: 'Trophy',
    category: 'Awards & Status',
    defaultColor: '#D97706',
    mode: 'fill',
    paths: [
      'M19 4h-2V2.5H7V4H5a2.5 2.5 0 0 0-2.5 2.5C2.5 9.2 4.3 11 7 11.4a5.5 5.5 0 0 0 4 3v3.1H8v2.5h8v-2.5h-3v-3.1a5.5 5.5 0 0 0 4-3c2.7-.4 4.5-2.2 4.5-4.9A2.5 2.5 0 0 0 19 4zM4.5 6.5A1 1 0 0 1 5.5 5.5H7v4a3 3 0 0 1-2.5-3zm15 0a3 3 0 0 1-2.5 3v-4h1.5a1 1 0 0 1 1 1z',
    ],
    brandMarkup: () => `
      <path d="M7 5H4.5a2 2 0 0 0 0 4.2H7M17 5h2.5a2 2 0 0 1 0 4.2H17" fill="none" stroke="#D97706" stroke-width="1.8"/>
      <path d="M6.8 3h10.4v6.2a5.2 5.2 0 0 1-10.4 0V3z" fill="#F59E0B" stroke="#B45309" stroke-width="0.8"/>
      <rect x="10.6" y="14" width="2.8" height="4.2" fill="#D97706"/>
      <rect x="7" y="18" width="10" height="3" rx="1" fill="#78350F"/>
      <polygon points="12,5.6 12.7,7.2 14.4,7.4 13.1,8.5 13.5,10.2 12,9.3 10.5,10.2 10.9,8.5 9.6,7.4 11.3,7.2" fill="#FEF08A"/>
    `,
  },
  {
    id: 'check-badge',
    label: 'Verified Badge',
    category: 'Awards & Status',
    defaultColor: '#1D9BF0',
    mode: 'fill',
    paths: [
      'M22.25 12l-1.9 2.2.3 2.9-2.85.65-1.5 2.5-2.75-1.15L12 21.25l-1.55-2.15-2.75 1.15-1.5-2.5-2.85-.65.3-2.9L1.75 12l1.9-2.2-.3-2.9 2.85-.65 1.5-2.5 2.75 1.15L12 2.75l1.55 2.15 2.75-1.15 1.5 2.5 2.85.65-.3 2.9L22.25 12zm-11.5 3.6l5.4-5.4-1.4-1.4-4 4-1.9-1.9-1.4 1.4 3.3 3.3z',
    ],
    brandMarkup: () => `
      <path d="M22 12l-1.85 2.15.3 2.85-2.8.65-1.45 2.45-2.7-1.1L12 21.1l-1.5-2.1-2.7 1.1-1.45-2.45-2.8-.65.3-2.85L2 12l1.85-2.15-.3-2.85 2.8-.65L7.8 3.9l2.7 1.1L12 2.9l1.5 2.1 2.7-1.1 1.45 2.45 2.8.65-.3 2.85L22 12z" fill="#1D9BF0"/>
      <path d="M8.7 12.2l2.15 2.15 4.55-4.55" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'bell',
    label: 'Bell',
    category: 'Creative & UI',
    defaultColor: '#F59E0B',
    mode: 'fill',
    paths: ['M18 9a6 6 0 1 0-12 0c0 5.5-2.5 7.5-2.5 7.5h17S18 14.5 18 9zm-4.2 10.5h-3.6a2 2 0 0 0 3.6 0z'],
    brandMarkup: () => `
      <path d="M17.8 9.2a5.8 5.8 0 1 0-11.6 0c0 4.8-2.2 6.8-2.2 6.8h16s-2.2-2-2.2-6.8z" fill="#F59E0B" stroke="#B45309" stroke-width="0.8"/>
      <circle cx="12" cy="18.6" r="2.2" fill="#D97706"/>
      <circle cx="17.5" cy="5.5" r="2.6" fill="#EF4444" stroke="#FFFFFF" stroke-width="1"/>
    `,
  },
  {
    id: 'megaphone',
    label: 'Megaphone',
    category: 'Creative & UI',
    defaultColor: '#EF4444',
    mode: 'fill',
    paths: ['M20 4L4.5 9.2A2 2 0 0 0 3 11.1v1.8a2 2 0 0 0 1.5 1.9L7 15.6V20a1.5 1.5 0 0 0 3 0v-3.4l10 3.4V4z'],
    brandMarkup: () => `
      <path d="M7.5 14.5l1.2 5.2a1.3 1.3 0 0 0 2.5-.5l-.8-3.8" fill="#1E293B"/>
      <path d="M3 10a2 2 0 0 1 2-2h4v7H5a2 2 0 0 1-2-2v-3z" fill="#334155"/>
      <path d="M9 8l11-4v15L9 15V8z" fill="#EF4444" stroke="#991B1B" stroke-width="0.7" stroke-linejoin="round"/>
      <rect x="20" y="3.5" width="2" height="16" rx="1" fill="#F59E0B"/>
    `,
  },
  {
    id: 'music',
    label: 'Music Note',
    category: 'Media & Tech',
    defaultColor: '#8B5CF6',
    mode: 'fill',
    paths: ['M19.5 3L9 5.1v10.1a3.2 3.2 0 1 0 1.8 2.9V9.3l7-1.4v5.3a3.2 3.2 0 1 0 1.7 2.8V3z'],
    brandMarkup: (uid) => `
      <defs>
        <linearGradient id="${uid}-mu" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A855F7"/>
          <stop offset="100%" stop-color="#EC4899"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#${uid}-mu)"/>
      <path d="M16.5 6.2L9.5 7.7v6.6a2.1 2.1 0 1 0 1.4 2v-5.7l4.2-.9v3.7a2.1 2.1 0 1 0 1.4 2V6.2z" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'headphones',
    label: 'Headphones',
    category: 'Media & Tech',
    defaultColor: '#3B82F6',
    mode: 'fill',
    paths: ['M12 3a9 9 0 0 0-9 9v6a3 3 0 0 0 3 3h1.5v-7H5v-2a7 7 0 0 1 14 0v2h-2.5v7H18a3 3 0 0 0 3-3v-6a9 9 0 0 0-9-9z'],
    brandMarkup: () => `
      <path d="M4.2 13v-1a7.8 7.8 0 0 1 15.6 0v1" fill="none" stroke="#1E293B" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="2.5" y="12" width="4.4" height="7.5" rx="2.2" fill="#3B82F6"/>
      <rect x="17.1" y="12" width="4.4" height="7.5" rx="2.2" fill="#3B82F6"/>
      <rect x="6" y="13" width="1.8" height="5.5" rx="0.9" fill="#0F172A"/>
      <rect x="16.2" y="13" width="1.8" height="5.5" rx="0.9" fill="#0F172A"/>
    `,
  },
  {
    id: 'camera',
    label: 'Camera',
    category: 'Media & Tech',
    defaultColor: '#334155',
    mode: 'fill',
    paths: ['M9.2 4L7.4 6.5H4A2.5 2.5 0 0 0 1.5 9v9.5A2.5 2.5 0 0 0 4 21h16a2.5 2.5 0 0 0 2.5-2.5V9A2.5 2.5 0 0 0 20 6.5h-3.4L14.8 4H9.2zM12 17.2a3.8 3.8 0 1 1 0-7.6 3.8 3.8 0 0 1 0 7.6z'],
    brandMarkup: () => `
      <path d="M9.2 4.2L7.4 6.5H4A2.5 2.5 0 0 0 1.5 9v9.5A2.5 2.5 0 0 0 4 21h16a2.5 2.5 0 0 0 2.5-2.5V9A2.5 2.5 0 0 0 20 6.5h-3.4l-1.8-2.3H9.2z" fill="#334155"/>
      <circle cx="12" cy="13.4" r="4.3" fill="#0F172A" stroke="#CBD5E1" stroke-width="1.2"/>
      <circle cx="12" cy="13.4" r="2.6" fill="#38BDF8"/>
      <circle cx="11" cy="12.4" r="0.9" fill="#FFFFFF"/>
      <circle cx="18.2" cy="9.2" r="0.9" fill="#FACC15"/>
    `,
  },
  {
    id: 'film',
    label: 'Film Frame',
    category: 'Media & Tech',
    defaultColor: '#475569',
    mode: 'fill',
    paths: ['M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm3 3v3H4v2h3v4H4v2h3v3h10v-3h3v-2h-3v-4h3V8h-3V5H7z'],
    brandMarkup: () => `
      <rect x="2" y="2.5" width="20" height="19" rx="3" fill="#1E293B"/>
      <rect x="6.5" y="4.5" width="11" height="6.5" rx="1" fill="#38BDF8"/>
      <rect x="6.5" y="13" width="11" height="6.5" rx="1" fill="#F472B6"/>
      <rect x="3.2" y="5" width="2" height="2" rx="0.4" fill="#F8FAFC"/>
      <rect x="3.2" y="9" width="2" height="2" rx="0.4" fill="#F8FAFC"/>
      <rect x="3.2" y="13" width="2" height="2" rx="0.4" fill="#F8FAFC"/>
      <rect x="3.2" y="17" width="2" height="2" rx="0.4" fill="#F8FAFC"/>
      <rect x="18.8" y="5" width="2" height="2" rx="0.4" fill="#F8FAFC"/>
      <rect x="18.8" y="9" width="2" height="2" rx="0.4" fill="#F8FAFC"/>
      <rect x="18.8" y="13" width="2" height="2" rx="0.4" fill="#F8FAFC"/>
      <rect x="18.8" y="17" width="2" height="2" rx="0.4" fill="#F8FAFC"/>
    `,
  },
  {
    id: 'mic',
    label: 'Microphone',
    category: 'Media & Tech',
    defaultColor: '#6366F1',
    mode: 'fill',
    paths: ['M12 2a3.5 3.5 0 0 0-3.5 3.5v6a3.5 3.5 0 0 0 7 0v-6A3.5 3.5 0 0 0 12 2zm6 9.5a6 6 0 0 1-12 0H4.3a7.7 7.7 0 0 0 6.8 7.6V22h1.8v-2.9a7.7 7.7 0 0 0 6.8-7.6H18z'],
    brandMarkup: () => `
      <rect x="8.5" y="2" width="7" height="12" rx="3.5" fill="#6366F1"/>
      <line x1="9.8" y1="6" x2="14.2" y2="6" stroke="#E0E7FF" stroke-width="1"/>
      <line x1="9.8" y1="9" x2="14.2" y2="9" stroke="#E0E7FF" stroke-width="1"/>
      <path d="M5.5 11.2a6.5 6.5 0 0 0 13 0" fill="none" stroke="#1E293B" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 17.7v3.3M8.5 21h7" fill="none" stroke="#1E293B" stroke-width="2" stroke-linecap="round"/>
    `,
  },
  {
    id: 'globe',
    label: 'Globe',
    category: 'Media & Tech',
    defaultColor: '#2563EB',
    mode: 'fill',
    paths: [
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.4 6h-3a14 14 0 0 0-1.4-3.6A8 8 0 0 1 19.4 8zM12 4.1c.9 1.2 1.6 2.5 2 3.9H10c.4-1.4 1.1-2.7 2-3.9zM4.2 14a8.1 8.1 0 0 1 0-4h3.4a15 15 0 0 0 0 4H4.2zm.4 2h3a14 14 0 0 0 1.4 3.6A8 8 0 0 1 4.6 16zm3-8h-3A8 8 0 0 1 9 4.4 14 14 0 0 0 7.6 8zM12 19.9c-.9-1.2-1.6-2.5-2-3.9h4c-.4 1.4-1.1 2.7-2 3.9zm2.3-5.9H9.7a13 13 0 0 1 0-4h4.6a13 13 0 0 1 0 4zm.7 5.6A14 14 0 0 0 16.4 16h3a8 8 0 0 1-4.4 3.6zM16.4 14a15 15 0 0 0 0-4h3.4a8.1 8.1 0 0 1 0 4h-3.4z',
    ],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10" fill="#2563EB"/>
      <path d="M6.5 6.5c1.5-.8 3.2-.5 3.8.8.6 1.2-.8 2.6-1.5 3.6-.7 1 .8 2.4 0 3.8-.7 1.2-2.6 1.2-3.4.3A8.8 8.8 0 0 1 6.5 6.5z" fill="#22C55E"/>
      <path d="M14.2 5.2c1.8.4 4.2 2.2 4.8 4.4.5 1.8-.9 3.6-2.2 4.2-1.3.6-1.8 2.4-3.1 2.4-1.4 0-1.4-2-.5-3.4.8-1.4.2-3.2-.5-4.3-.7-1.2.1-3.6 1.5-3.3z" fill="#22C55E"/>
      <circle cx="12" cy="12" r="10" fill="none" stroke="#1D4ED8" stroke-width="0.9"/>
    `,
  },
  {
    id: 'map-pin',
    label: 'Location Pin',
    category: 'Creative & UI',
    defaultColor: '#EF4444',
    mode: 'fill',
    paths: ['M12 2a7.5 7.5 0 0 0-7.5 7.5c0 5.3 7.5 12.5 7.5 12.5s7.5-7.2 7.5-12.5A7.5 7.5 0 0 0 12 2zm0 10.2a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4z'],
    brandMarkup: () => `
      <path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 5.4 7.5 12.5 7.5 12.5s7.5-7.1 7.5-12.5A7.5 7.5 0 0 0 12 2z" fill="#EF4444"/>
      <circle cx="12" cy="9.5" r="3" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    category: 'Creative & UI',
    defaultColor: '#2563EB',
    mode: 'fill',
    paths: ['M19 4h-2V2h-2v2H9V2H7v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10z'],
    brandMarkup: () => `
      <rect x="3" y="4" width="18" height="17" rx="3" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
      <path d="M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H3V7z" fill="#EF4444"/>
      <rect x="7" y="2" width="2" height="3.8" rx="1" fill="#475569"/>
      <rect x="15" y="2" width="2" height="3.8" rx="1" fill="#475569"/>
      <rect x="6.5" y="12.5" width="3" height="2.6" rx="0.6" fill="#2563EB"/>
      <rect x="10.5" y="12.5" width="3" height="2.6" rx="0.6" fill="#94A3B8"/>
      <rect x="14.5" y="12.5" width="3" height="2.6" rx="0.6" fill="#94A3B8"/>
      <rect x="6.5" y="16.2" width="3" height="2.6" rx="0.6" fill="#94A3B8"/>
      <rect x="10.5" y="16.2" width="3" height="2.6" rx="0.6" fill="#94A3B8"/>
    `,
  },
  {
    id: 'clock',
    label: 'Clock',
    category: 'Creative & UI',
    defaultColor: '#0EA5E9',
    mode: 'fill',
    paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.6l3.5 2-.9 1.6L11 13.5V6h2v6.6z'],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10" fill="#0EA5E9"/>
      <circle cx="12" cy="12" r="7.8" fill="#FFFFFF"/>
      <path d="M12 6.8v5.4l3.6 2.1" fill="none" stroke="#0F172A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="1.2" fill="#EF4444"/>
    `,
  },
  {
    id: 'mail',
    label: 'Envelope',
    category: 'Creative & UI',
    defaultColor: '#3B82F6',
    mode: 'fill',
    paths: ['M4 4h16a2 2 0 0 1 2 2v.4l-10 6.2L2 6.4V6a2 2 0 0 1 2-2zm-2 4.6v9.4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.6l-10 6.2-10-6.2z'],
    brandMarkup: () => `
      <rect x="2" y="4.5" width="20" height="15" rx="3" fill="#3B82F6"/>
      <path d="M3.2 5.7L12 12.2l8.8-6.5" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'send',
    label: 'Paper Plane',
    category: 'Creative & UI',
    defaultColor: '#0EA5E9',
    mode: 'fill',
    paths: ['M21.8 2.2L2.4 10.4l6.8 3.2L18 6.4l-5.6 9.3 6.2 3 3.2-16.5z'],
    brandMarkup: () => `
      <polygon points="22,2 2,11 9.5,14 19,6 12,15.5 18.5,19" fill="#0EA5E9"/>
      <polygon points="9.5,14 12,19.5 13.8,16.4" fill="#0369A1"/>
    `,
  },
  {
    id: 'link',
    label: 'Chain Link',
    category: 'Creative & UI',
    defaultColor: '#4F46E5',
    mode: 'stroke',
    paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
    brandMarkup: () => `
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#4F46E5"/>
      <path d="M10.5 13.2a3.5 3.5 0 0 0 5.3.38l2-2a3.5 3.5 0 0 0-4.95-4.95l-1.1 1.1" fill="none" stroke="#FFFFFF" stroke-width="1.9" stroke-linecap="round"/>
      <path d="M13.5 10.8a3.5 3.5 0 0 0-5.3-.38l-2 2a3.5 3.5 0 0 0 4.95 4.95l1.1-1.1" fill="none" stroke="#C7D2FE" stroke-width="1.9" stroke-linecap="round"/>
    `,
  },
  {
    id: 'qr-code',
    label: 'QR Matrix',
    category: 'Media & Tech',
    defaultColor: '#0F172A',
    mode: 'fill',
    paths: [
      'M3 3h7v7H3V3zm2 2v3h3V5H5zm9-2h7v7h-7V3zm2 2v3h3V5h-3zM3 14h7v7H3v-7zm2 2v3h3v-3H5zm9-2h2v2h-2v-2zm3 0h4v2h-4v-2zm-3 3h2v4h-2v-4zm3 2h4v2h-4v-2zm2-2h2v2h-2v-2z',
    ],
    brandMarkup: () => `
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
      <path d="M4.5 4.5h6v6h-6v-6zm1.5 1.5v3h3V6H6zm7.5-1.5h6v6h-6v-6zm1.5 1.5v3h3V6h-3zM4.5 13.5h6v6h-6v-6zm1.5 1.5v3h3v-3H6zm7.5-1.5h2v2h-2v-2zm3 0h3v2h-3v-2zm-3 3h2v3h-2v-3zm3 1.5h3v1.5h-3V18zm1.5-1.5h1.5v1.5H18v-1.5z" fill="#0F172A"/>
    `,
  },
  {
    id: 'lock',
    label: 'Lock',
    category: 'Creative & UI',
    defaultColor: '#F59E0B',
    mode: 'fill',
    paths: ['M17 10V7.5a5 5 0 0 0-10 0V10H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2zm-8-2.5a3 3 0 0 1 6 0V10H9V7.5zm3 10a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6z'],
    brandMarkup: () => `
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="#64748B" stroke-width="2.2"/>
      <rect x="4" y="10" width="16" height="11.5" rx="2.5" fill="#F59E0B"/>
      <circle cx="12" cy="15.2" r="1.5" fill="#78350F"/>
      <rect x="11.2" y="15.8" width="1.6" height="2.6" rx="0.6" fill="#78350F"/>
    `,
  },
  {
    id: 'shield',
    label: 'Shield',
    category: 'Awards & Status',
    defaultColor: '#10B981',
    mode: 'fill',
    paths: ['M12 2L4 5.5v6c0 5.3 3.4 9.9 8 11 4.6-1.1 8-5.7 8-11v-6L12 2zm-1.1 12.8l-3-3 1.4-1.4 1.6 1.6 3.8-3.8 1.4 1.4-5.2 5.2z'],
    brandMarkup: () => `
      <path d="M12 2L4 5.4v5.9c0 5.2 3.4 9.7 8 10.8 4.6-1.1 8-5.6 8-10.8V5.4L12 2z" fill="#10B981"/>
      <path d="M8.8 12.1l2.1 2.1 4.4-4.4" fill="none" stroke="#FFFFFF" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'rocket',
    label: 'Rocket',
    category: 'Awards & Status',
    defaultColor: '#EF4444',
    mode: 'fill',
    paths: ['M13.5 2.3C17.8 2.3 21 3 21 3s.7 3.2.7 7.5c0 4.5-3.4 8-7.4 9.5l-1.5-2.6-2.9 1.6-3.9-3.9 1.6-2.9-2.6-1.5C6.5 6.7 10 2.3 13.5 2.3zM15.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z'],
    brandMarkup: () => `
      <path d="M6.5 15L3 18.5l2.5 2.5L9 17.5z" fill="#F97316"/>
      <path d="M7.5 11.5H4.2l2.3-3.2 2.8.4M12.5 16.5v3.3l3.2-2.3-.4-2.8" fill="#EF4444"/>
      <path d="M14.2 3c4.2 0 6.8.5 6.8.5s.5 2.6.5 6.8c0 4-3.1 7.2-6.8 8.6L8.1 12.3C9.5 8.6 12.7 3 14.2 3z" fill="#E2E8F0" stroke="#334155" stroke-width="0.9"/>
      <path d="M17.2 3.2c2.2.2 3.8.5 3.8.5s.3 1.6.5 3.8l-4.3-4.3z" fill="#EF4444"/>
      <circle cx="15" cy="9" r="1.8" fill="#38BDF8" stroke="#1E293B" stroke-width="0.8"/>
    `,
  },
  {
    id: 'compass',
    label: 'Compass',
    category: 'Creative & UI',
    defaultColor: '#0284C7',
    mode: 'fill',
    paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.8 6.2l-2.3 5.3-5.3 2.3 2.3-5.3 5.3-2.3z'],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10" fill="#0284C7"/>
      <circle cx="12" cy="12" r="7.5" fill="#F8FAFC"/>
      <polygon points="15.8,8.2 13.4,13.4 10.6,10.6" fill="#EF4444"/>
      <polygon points="8.2,15.8 10.6,10.6 13.4,13.4" fill="#334155"/>
      <circle cx="12" cy="12" r="1" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'target',
    label: 'Target',
    category: 'Awards & Status',
    defaultColor: '#EF4444',
    mode: 'fill',
    paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 3.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm0 3.2a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6z'],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10" fill="#EF4444"/>
      <circle cx="12" cy="12" r="6.8" fill="#FFFFFF"/>
      <circle cx="12" cy="12" r="3.8" fill="#EF4444"/>
      <circle cx="12" cy="12" r="1.4" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'trending-up',
    label: 'Growth Curve',
    category: 'Awards & Status',
    defaultColor: '#16A34A',
    mode: 'stroke',
    paths: ['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6'],
    brandMarkup: () => `
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#DCFCE7" stroke="#86EFAC" stroke-width="1"/>
      <path d="M4.5 16.5l4.8-4.8 3.4 3.4L19 8.5" fill="none" stroke="#16A34A" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14.8 8.5H19v4.2" fill="none" stroke="#16A34A" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'gift',
    label: 'Gift Box',
    category: 'Creative & UI',
    defaultColor: '#EC4899',
    mode: 'fill',
    paths: ['M20 7h-2.2A3 3 0 0 0 12 4.3 3 3 0 0 0 6.2 7H4a1.5 1.5 0 0 0-1.5 1.5V11h8.5V7h2v4h8.5V8.5A1.5 1.5 0 0 0 20 7zM4 12.5V20a1.5 1.5 0 0 0 1.5 1.5H11v-9H4zm9 0v9h5.5A1.5 1.5 0 0 0 20 20v-7.5h-7z'],
    brandMarkup: () => `
      <rect x="3.5" y="11" width="17" height="10" rx="1.8" fill="#EC4899"/>
      <rect x="2.5" y="7.5" width="19" height="4" rx="1.2" fill="#F43F5E"/>
      <rect x="10.6" y="7.5" width="2.8" height="13.5" fill="#FACC15"/>
      <path d="M12 7.5C9.5 4 6.5 4.6 7 6.5c.4 1.3 3 1.2 5 1zm0 0c2.5-3.5 5.5-2.9 5-1-.4 1.3-3 1.2-5 1z" fill="#FACC15"/>
    `,
  },
  {
    id: 'party',
    label: 'Confetti Cone',
    category: 'Creative & UI',
    defaultColor: '#F59E0B',
    mode: 'fill',
    paths: ['M4.5 20.5l5-12.5 7.5 7.5-12.5 5z'],
    brandMarkup: () => `
      <polygon points="3.5,20.5 8.5,8.5 15.5,15.5" fill="#F59E0B" stroke="#B45309" stroke-width="0.7" stroke-linejoin="round"/>
      <line x1="6.8" y1="12.5" x2="11.5" y2="17.2" stroke="#FEF08A" stroke-width="1.5"/>
      <circle cx="15" cy="6" r="1.4" fill="#EC4899"/>
      <circle cx="19.5" cy="11" r="1.4" fill="#38BDF8"/>
      <circle cx="11" cy="4.5" r="1.2" fill="#22C55E"/>
      <rect x="17.5" y="4.5" width="2.4" height="2.4" rx="0.5" fill="#8B5CF6" transform="rotate(25 18.7 5.7)"/>
    `,
  },
  {
    id: 'sun',
    label: 'Sunburst',
    category: 'Creative & UI',
    defaultColor: '#F59E0B',
    mode: 'fill',
    paths: ['M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5l1.3 3h-2.6L12 2zm0 20l-1.3-3h2.6L12 22zM2 12l3-1.3v2.6L2 12zm20 0l-3 1.3v-2.6L22 12zM4.9 4.9l3 1.2-1.8 1.8-1.2-3zm14.2 14.2l-3-1.2 1.8-1.8 1.2 3zm0-14.2l-1.2 3-1.8-1.8 3-1.2zM4.9 19.1l1.2-3 1.8 1.8-3 1.2z'],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="5" fill="#FACC15" stroke="#F59E0B" stroke-width="0.8"/>
      <g stroke="#F59E0B" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="2.2" x2="12" y2="4.6"/>
        <line x1="12" y1="19.4" x2="12" y2="21.8"/>
        <line x1="2.2" y1="12" x2="4.6" y2="12"/>
        <line x1="19.4" y1="12" x2="21.8" y2="12"/>
        <line x1="5.1" y1="5.1" x2="6.8" y2="6.8"/>
        <line x1="17.2" y1="17.2" x2="18.9" y2="18.9"/>
        <line x1="18.9" y1="5.1" x2="17.2" y2="6.8"/>
        <line x1="6.8" y1="17.2" x2="5.1" y2="18.9"/>
      </g>
    `,
  },
  {
    id: 'moon',
    label: 'Crescent Moon',
    category: 'Creative & UI',
    defaultColor: '#F59E0B',
    mode: 'fill',
    paths: ['M12.5 3a9 9 0 1 0 8.5 11.9 7 7 0 0 1-8.5-11.9z'],
    brandMarkup: () => `
      <path d="M13 3.2a8.8 8.8 0 1 0 7.8 12.8 7 7 0 0 1-7.8-12.8z" fill="#FACC15" stroke="#D97706" stroke-width="0.7"/>
      <path d="M18.5 4.5l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6z" fill="#FDE047"/>
    `,
  },
  {
    id: 'cloud',
    label: 'Cloud',
    category: 'Creative & UI',
    defaultColor: '#38BDF8',
    mode: 'fill',
    paths: ['M17.5 19H7a5 5 0 0 1-.4-10A6.5 6.5 0 0 1 19 10.2a4.5 4.5 0 0 1-1.5 8.8z'],
    brandMarkup: (uid) => `
      <defs>
        <linearGradient id="${uid}-cl" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#E0F2FE"/>
          <stop offset="100%" stop-color="#38BDF8"/>
        </linearGradient>
      </defs>
      <path d="M17.5 19H7a5 5 0 0 1-.4-10A6.5 6.5 0 0 1 19 10.2a4.5 4.5 0 0 1-1.5 8.8z" fill="url(#${uid}-cl)" stroke="#0284C7" stroke-width="0.7"/>
    `,
  },
  {
    id: 'leaf',
    label: 'Botanical Leaf',
    category: 'Creative & UI',
    defaultColor: '#16A34A',
    mode: 'fill',
    paths: ['M20 3C11 3 5 7.5 5 14c0 2.3.8 4.2 2.2 5.6L3 21l1.4 1.4 4.2-4.2A7.8 7.8 0 0 0 13 19.5C18.5 19.5 21 14 21 3h-1z'],
    brandMarkup: () => `
      <path d="M20 3C11 3 5.2 7.5 5.2 13.8c0 2.4.9 4.2 2.4 5.5 1.8.6 3.5.7 5.4.7 5.2 0 7.6-5.2 7-17z" fill="#22C55E"/>
      <path d="M3.5 20.5C7 17 11.5 13 17 8.5" fill="none" stroke="#14532D" stroke-width="1.6" stroke-linecap="round"/>
    `,
  },
  {
    id: 'coffee',
    label: 'Coffee Cup',
    category: 'Creative & UI',
    defaultColor: '#92400E',
    mode: 'fill',
    paths: ['M18 8h-1V7H3v7a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5v-.2h1a3 3 0 0 0 0-5.8zm0 4h-1V9.8h1a1.1 1.1 0 0 1 0 2.2zM6.5 2.5h1.6v3H6.5zm3.4 0h1.6v3H9.9zm3.4 0h1.6v3h-1.6z'],
    brandMarkup: () => `
      <path d="M16.5 9.5H18a2.5 2.5 0 0 1 0 5h-1.5" fill="none" stroke="#D97706" stroke-width="2"/>
      <path d="M3.5 8.5h13V14a5.5 5.5 0 0 1-5.5 5.5H9A5.5 5.5 0 0 1 3.5 14V8.5z" fill="#92400E"/>
      <rect x="3.5" y="7.5" width="13" height="2" rx="1" fill="#FDE68A"/>
      <path d="M7 2.8v2.8M10 2.4v3.2M13 2.8v2.8" fill="none" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
    `,
  },
  {
    id: 'smile',
    label: 'Smiley Face',
    category: 'Creative & UI',
    defaultColor: '#FACC15',
    mode: 'fill',
    paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM9 10a1.2 1.2 0 1 1 0-2.4A1.2 1.2 0 0 1 9 10zm6 0a1.2 1.2 0 1 1 0-2.4A1.2 1.2 0 0 1 15 10zm-3 7.2c-2.2 0-4-1.4-4.7-3.2h1.8c.5 1 1.6 1.7 2.9 1.7s2.4-.7 2.9-1.7h1.8c-.7 1.8-2.5 3.2-4.7 3.2z'],
    brandMarkup: () => `
      <circle cx="12" cy="12" r="10" fill="#FACC15" stroke="#CA8A04" stroke-width="0.7"/>
      <circle cx="8.8" cy="9.6" r="1.35" fill="#1E293B"/>
      <circle cx="15.2" cy="9.6" r="1.35" fill="#1E293B"/>
      <path d="M8 14.2c1 1.7 2.5 2.4 4 2.4s3-.7 4-2.4" fill="none" stroke="#1E293B" stroke-width="1.9" stroke-linecap="round"/>
    `,
  },

  // ==================== 10 EDUCATION ICONS (SOLID / FULL COLOR) ====================
  {
    id: 'edu-grad-cap-icon',
    label: 'Graduation Cap',
    category: 'Education',
    defaultColor: '#1E3A8A',
    mode: 'fill',
    paths: ['M12 3L1 8.5 12 14l9-4.5V16h2V8.5L12 3zm-6.5 9.3V16c0 2.2 3 4 6.5 4s6.5-1.8 6.5-4v-3.7L12 15.6l-6.5-3.3z'],
    brandMarkup: () => `
      <path d="M6 12v4.5c2 2.4 10 2.4 12 0V12" fill="#1E3A8A"/>
      <polygon points="12,3.5 1.5,8.8 12,14 22.5,8.8" fill="#2563EB"/>
      <path d="M21 9.5v6.5" fill="none" stroke="#FACC15" stroke-width="1.7" stroke-linecap="round"/>
      <circle cx="21" cy="16.4" r="1.3" fill="#F59E0B"/>
    `,
  },
  {
    id: 'edu-book-open-icon',
    label: 'Open Book',
    category: 'Education',
    defaultColor: '#2563EB',
    mode: 'fill',
    paths: ['M2 4.5h6.5A3.5 3.5 0 0 1 12 8v12a3 3 0 0 0-3-3H2V4.5zm20 0h-6.5A3.5 3.5 0 0 0 12 8v12a3 3 0 0 1 3-3h7V4.5z'],
    brandMarkup: () => `
      <path d="M2 5h6.5A3.5 3.5 0 0 1 12 8.5V20a3 3 0 0 0-3-2.6H2V5z" fill="#3B82F6"/>
      <path d="M22 5h-6.5A3.5 3.5 0 0 0 12 8.5V20a3 3 0 0 1 3-2.6h7V5z" fill="#1D4ED8"/>
      <path d="M4.5 8.5h4.2M4.5 11.5h4.2M15.3 8.5h4.2M15.3 11.5h4.2" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
    `,
  },
  {
    id: 'edu-notebook-icon',
    label: 'Textbook',
    category: 'Education',
    defaultColor: '#7D1935',
    mode: 'fill',
    paths: ['M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2zM6.5 17a1 1 0 0 0 0 2H18v-2H6.5z'],
    brandMarkup: () => `
      <rect x="4" y="2" width="16" height="20" rx="2.5" fill="#7D1935"/>
      <rect x="4" y="16.5" width="16" height="5.5" rx="2" fill="#FEF3C7"/>
      <rect x="8" y="6" width="8.5" height="3" rx="0.8" fill="#FDE68A"/>
      <rect x="4" y="2" width="3" height="20" rx="1" fill="#4C0519"/>
    `,
  },
  {
    id: 'edu-pencil-icon',
    label: 'Pencil',
    category: 'Education',
    defaultColor: '#F59E0B',
    mode: 'fill',
    paths: ['M16.8 3.2a2.5 2.5 0 0 1 3.5 3.5L8.2 18.8 3 21l2.2-5.2L16.8 3.2z'],
    brandMarkup: () => `
      <polygon points="15.2,4.8 19.2,8.8 8.2,19.8 4.2,15.8" fill="#F59E0B"/>
      <path d="M16.8 3.2a2.6 2.6 0 0 1 3.7 3.7l-1.3 1.3-3.7-3.7 1.3-1.3z" fill="#FB7185"/>
      <polygon points="4.2,15.8 8.2,19.8 3,21" fill="#FDE68A"/>
      <polygon points="3.5,18.6 5.4,20.5 3,21" fill="#1E293B"/>
    `,
  },
  {
    id: 'edu-feather-icon',
    label: 'Feather Quill',
    category: 'Education',
    defaultColor: '#6366F1',
    mode: 'fill',
    paths: ['M20.2 3.8C16 2.8 11.4 5.5 8 10L5.5 16.5 3 21l4.5-2.5L14 16c4.5-3.4 7.2-8 6.2-12.2z'],
    brandMarkup: () => `
      <path d="M20.5 3.5C15.8 2.8 11 5.6 8 10.3L6 16.8 12.5 15c4.7-3 7.5-7.8 8-11.5z" fill="#6366F1"/>
      <path d="M3 21L17 7" stroke="#FDE047" stroke-width="1.6" stroke-linecap="round"/>
    `,
  },
  {
    id: 'edu-ruler-icon',
    label: 'Ruler',
    category: 'Education',
    defaultColor: '#F59E0B',
    mode: 'fill',
    paths: ['M21 6.5L17.5 3a1.5 1.5 0 0 0-2.1 0L3 15.4a1.5 1.5 0 0 0 0 2.1L6.5 21a1.5 1.5 0 0 0 2.1 0L21 8.6a1.5 1.5 0 0 0 0-2.1z'],
    brandMarkup: () => `
      <path d="M21 6.5L17.5 3a1.5 1.5 0 0 0-2.1 0L3 15.4a1.5 1.5 0 0 0 0 2.1L6.5 21a1.5 1.5 0 0 0 2.1 0L21 8.6a1.5 1.5 0 0 0 0-2.1z" fill="#F59E0B"/>
      <path d="M14.5 7l2 2M12 9.5l1.5 1.5M9.5 12l2 2M7 14.5l1.5 1.5" stroke="#78350F" stroke-width="1.5" stroke-linecap="round"/>
    `,
  },
  {
    id: 'edu-calculator-icon',
    label: 'Calculator',
    category: 'Education',
    defaultColor: '#1E293B',
    mode: 'fill',
    paths: ['M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2 3v3h10V5H7zm0 5v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2zm-8 4v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v6h2v-6h-2zm-8 4v2h2v-2H7zm4 0v2h2v-2h-2z'],
    brandMarkup: () => `
      <rect x="4" y="2" width="16" height="20" rx="2.5" fill="#1E293B"/>
      <rect x="6.5" y="4.2" width="11" height="3.8" rx="1" fill="#A7F3D0"/>
      <rect x="6.5" y="10" width="2.5" height="2.2" rx="0.5" fill="#94A3B8"/>
      <rect x="10.7" y="10" width="2.5" height="2.2" rx="0.5" fill="#94A3B8"/>
      <rect x="15" y="10" width="2.5" height="2.2" rx="0.5" fill="#F59E0B"/>
      <rect x="6.5" y="13.8" width="2.5" height="2.2" rx="0.5" fill="#94A3B8"/>
      <rect x="10.7" y="13.8" width="2.5" height="2.2" rx="0.5" fill="#94A3B8"/>
      <rect x="15" y="13.8" width="2.5" height="5.8" rx="0.6" fill="#EF4444"/>
      <rect x="6.5" y="17.4" width="2.5" height="2.2" rx="0.5" fill="#94A3B8"/>
      <rect x="10.7" y="17.4" width="2.5" height="2.2" rx="0.5" fill="#94A3B8"/>
    `,
  },
  {
    id: 'edu-medal-icon',
    label: 'Medal',
    category: 'Education',
    defaultColor: '#D97706',
    mode: 'fill',
    paths: ['M7 2h10l-3 7.5A5.5 5.5 0 1 1 10 9.5L7 2zm5 9.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z'],
    brandMarkup: () => `
      <polygon points="6.5,2 10.5,2 12,8.5 8.5,10" fill="#DC2626"/>
      <polygon points="17.5,2 13.5,2 12,8.5 15.5,10" fill="#2563EB"/>
      <circle cx="12" cy="15" r="6" fill="#F59E0B" stroke="#B45309" stroke-width="0.8"/>
      <circle cx="12" cy="15" r="3.8" fill="#FEF08A"/>
    `,
  },
  {
    id: 'edu-lightbulb-icon',
    label: 'Idea Bulb',
    category: 'Education',
    defaultColor: '#FACC15',
    mode: 'fill',
    paths: ['M12 2a6.5 6.5 0 0 0-3.8 11.8c.7.5 1.3 1.4 1.3 2.4V17h5v-.8c0-1 .6-1.9 1.3-2.4A6.5 6.5 0 0 0 12 2zm-2.5 17v1.5h5V19h-5zm1 3h3v1h-3v-1z'],
    brandMarkup: () => `
      <path d="M12 2.2a6.2 6.2 0 0 0-3.6 11.2c.7.5 1.2 1.3 1.2 2.2v1h4.8v-1c0-.9.5-1.7 1.2-2.2A6.2 6.2 0 0 0 12 2.2z" fill="#FACC15" stroke="#CA8A04" stroke-width="0.6"/>
      <rect x="9.5" y="17.4" width="5" height="2" rx="0.8" fill="#64748B"/>
      <rect x="10.2" y="20" width="3.6" height="1.8" rx="0.8" fill="#475569"/>
      <path d="M10.2 8.5c0-1 .8-1.8 1.8-1.8" fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
    `,
  },
  {
    id: 'edu-backpack-icon',
    label: 'Backpack',
    category: 'Education',
    defaultColor: '#DC2626',
    mode: 'fill',
    paths: ['M9 4V3a3 3 0 0 1 6 0v1h1a4 4 0 0 1 4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a4 4 0 0 1 4-4h1zm2 0h2V3a1 1 0 0 0-2 0v1zm-3 9v5h8v-5H8z'],
    brandMarkup: () => `
      <path d="M9.2 5V3.6a2.8 2.8 0 0 1 5.6 0V5" fill="none" stroke="#7F1D1D" stroke-width="1.8"/>
      <rect x="4.5" y="5" width="15" height="16.5" rx="4" fill="#DC2626"/>
      <rect x="7" y="13" width="10" height="6.5" rx="2" fill="#991B1B"/>
      <rect x="9" y="9" width="6" height="1.6" rx="0.8" fill="#FACC15"/>
    `,
  },

  // ==================== 8 CHARACTER & POSE ICONS (SOLID / FULL COLOR) ====================
  {
    id: 'char-user-icon',
    label: 'Person Figure',
    category: 'Characters',
    defaultColor: '#2563EB',
    mode: 'fill',
    paths: ['M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4.4 0-8 2.4-8 5.5V21h16v-2.5c0-3.1-3.6-5.5-8-5.5z'],
    brandMarkup: () => `
      <circle cx="12" cy="7.2" r="4" fill="#FDBA74" stroke="#1E293B" stroke-width="0.9"/>
      <path d="M4.5 21v-2c0-3.2 3.3-5.2 7.5-5.2s7.5 2 7.5 5.2v2H4.5z" fill="#2563EB"/>
    `,
  },
  {
    id: 'char-team-icon',
    label: 'Team Group',
    category: 'Characters',
    defaultColor: '#4F46E5',
    mode: 'fill',
    paths: ['M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.5 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 13c-3.6 0-6.5 2-6.5 4.8V20h13v-2.2c0-2.8-2.9-4.8-6.5-4.8zm7.5.5c-.6 0-1.2.1-1.7.3 1.4 1 2.2 2.4 2.2 4V20h4.5v-2.2c0-2.4-2.2-4.3-5-4.3z'],
    brandMarkup: () => `
      <circle cx="16.5" cy="8.2" r="3" fill="#F97316"/>
      <path d="M13 20v-1.8c0-2.2 1.8-3.7 4.2-3.7s4.3 1.5 4.3 3.7V20H13z" fill="#FB923C"/>
      <circle cx="8.8" cy="7.5" r="3.6" fill="#4F46E5"/>
      <path d="M2.5 20v-2c0-2.7 2.8-4.5 6.3-4.5s6.3 1.8 6.3 4.5v2H2.5z" fill="#4F46E5"/>
    `,
  },
  {
    id: 'char-presenter-icon',
    label: 'Speaker Pose',
    category: 'Characters',
    defaultColor: '#0D9488',
    mode: 'fill',
    paths: ['M12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 5.5c0-2.2 2.2-3.5 5-3.5l5.5-3 1.2 2-4.2 2.5V21h-2.5v-5.5h-1.8V21H7v-8.5z'],
    brandMarkup: () => `
      <circle cx="10.5" cy="5.2" r="3" fill="#0D9488"/>
      <path d="M5.5 21v-7.5a3.5 3.5 0 0 1 3.5-3.5h3.5l5-3.5 1.4 1.8-4.4 3.4V21h-2.4v-5h-1.8v5H5.5z" fill="#0F766E"/>
      <rect x="16.5" y="3" width="5" height="4" rx="0.8" fill="#FACC15"/>
    `,
  },
  {
    id: 'char-thumbs-up-icon',
    label: 'Thumbs Up',
    category: 'Characters',
    defaultColor: '#2563EB',
    mode: 'fill',
    paths: ['M2 10h4v11H2V10zm18.5 0H14l1-4.8V4a1.8 1.8 0 0 0-1.8-1.8l-.6.3-4.6 7V21h10a2.2 2.2 0 0 0 2.1-1.6l1.7-6.5A2 2 0 0 0 20.5 10z'],
    brandMarkup: () => `
      <rect x="2" y="10.5" width="4.2" height="10.5" rx="1" fill="#1E3A8A"/>
      <path d="M8 10.5L12.5 3.2A1.6 1.6 0 0 1 15 4.4l-.8 4.8h5.3a2 2 0 0 1 1.9 2.5l-1.8 7a2.2 2.2 0 0 1-2.1 1.7H8V10.5z" fill="#FDBA74" stroke="#EA580C" stroke-width="0.7"/>
    `,
  },
  {
    id: 'char-hand-wave-icon',
    label: 'Waving Hand',
    category: 'Characters',
    defaultColor: '#F59E0B',
    mode: 'fill',
    paths: ['M18.5 8a1.4 1.4 0 0 0-1.4 1.4V12h-.6V5.4a1.4 1.4 0 1 0-2.8 0V11h-.6V4a1.4 1.4 0 1 0-2.8 0v7h-.6V6.2a1.4 1.4 0 1 0-2.8 0v7.5l-1.9-1.7a1.5 1.5 0 1 0-2 2.2l4.4 4.4A6.5 6.5 0 0 0 19.9 14V9.4A1.4 1.4 0 0 0 18.5 8z'],
    brandMarkup: () => `
      <path d="M18.5 8.2a1.35 1.35 0 0 0-1.35 1.35v2.7h-.6V5.5a1.35 1.35 0 1 0-2.7 0v5.7h-.6V4.1a1.35 1.35 0 1 0-2.7 0v7.1H10V6.3a1.35 1.35 0 1 0-2.7 0v7.4L5.4 12a1.45 1.45 0 1 0-1.9 2.1l4.3 4.3a6.2 6.2 0 0 0 12.1-4.3V9.55A1.35 1.35 0 0 0 18.5 8.2z" fill="#FACC15" stroke="#CA8A04" stroke-width="0.7"/>
      <path d="M3.5 6.5c1-1.5 2-2.2 3-2.5M19 3.5c1 .5 1.8 1.3 2.2 2.5" fill="none" stroke="#F59E0B" stroke-width="1.4" stroke-linecap="round"/>
    `,
  },
  {
    id: 'char-speech-icon',
    label: 'Speech Bubble',
    category: 'Characters',
    defaultColor: '#3B82F6',
    mode: 'fill',
    paths: ['M20 3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3v3.8L12 18h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z'],
    brandMarkup: () => `
      <path d="M20 3.5H4a2.2 2.2 0 0 0-2.2 2.2v10.2A2.2 2.2 0 0 0 4 18.1h3v3.5l4.8-3.5H20a2.2 2.2 0 0 0 2.2-2.2V5.7A2.2 2.2 0 0 0 20 3.5z" fill="#3B82F6"/>
      <circle cx="8" cy="10.8" r="1.3" fill="#FFFFFF"/>
      <circle cx="12" cy="10.8" r="1.3" fill="#FFFFFF"/>
      <circle cx="16" cy="10.8" r="1.3" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'char-thinking-icon',
    label: 'Thought Cloud',
    category: 'Characters',
    defaultColor: '#8B5CF6',
    mode: 'fill',
    paths: ['M18 9.5h-.8A6.2 6.2 0 0 0 5.3 11a4.2 4.2 0 0 0 .9 8.3H18a4.9 4.9 0 0 0 0-9.8z', 'M5 20.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z'],
    brandMarkup: () => `
      <path d="M17.8 9h-.6A5.6 5.6 0 0 0 6.5 10.4a3.9 3.9 0 0 0 .8 7.7h10.5A4.5 4.5 0 0 0 17.8 9z" fill="#8B5CF6"/>
      <circle cx="5.2" cy="19.5" r="1.6" fill="#A78BFA"/>
      <circle cx="2.8" cy="21.8" r="1" fill="#C4B5FD"/>
      <circle cx="9.2" cy="12.5" r="1" fill="#FFFFFF"/>
      <circle cx="12.2" cy="12.5" r="1" fill="#FFFFFF"/>
      <circle cx="15.2" cy="12.5" r="1" fill="#FFFFFF"/>
    `,
  },
  {
    id: 'char-run-icon',
    label: 'Runner Pose',
    category: 'Characters',
    defaultColor: '#10B981',
    mode: 'fill',
    paths: ['M15.5 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM13 7.5l-4 1-2.5 2.5 1.5 1.3 1.8-1.8 2-.5-2.6 5.5-4.7 1 .5 2.1 5.8-1.2 1.8-3.8 2.4 2.1v5.3h2.2V14l-3.1-2.8 1-2.1 2.7 1.9 1.2-1.8L13 7.5z'],
    brandMarkup: () => `
      <circle cx="15.2" cy="4.2" r="2.1" fill="#10B981"/>
      <path d="M13.2 7.2l-4.1.9-2.4 2.4 1.5 1.4 1.8-1.8 2-.5-2.5 5.4-4.7.9.5 2.1 5.9-1.2 1.7-3.6 2.5 2.1V21h2.2v-6.8l-3.2-2.7 1-2.1 2.7 1.8 1.2-1.7-3.9-2.3z" fill="#059669"/>
    `,
  },
];

export function renderIconSvgString(
  iconName: string,
  color: string,
  strokeWidth = 1.9,
  colorMode: 'brand' | 'mono' = 'brand',
  rawUid = 'ic'
): string {
  const uid = rawUid.replace(/[^a-zA-Z0-9_-]/g, '') || 'ic';
  const def = ICON_CATALOG.find(
    (ic) => ic.id === iconName || ic.label.toLowerCase() === iconName.toLowerCase()
  );

  if (def && colorMode !== 'mono') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${def.brandMarkup(uid)}</svg>`;
  }

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
