import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Frame,
  Group,
  Image as ImageIcon,
  Layers,
  Maximize,
  PenTool,
  Plus,
  Scissors,
  Search,
  Shapes,
  Smile,
  Sparkles,
  Table as TableIcon,
  Trash2,
  Type as TypeIcon,
  Ungroup,
  UploadCloud,
} from 'lucide-react';
import type { PresentationDocument, ShapeElement } from '../../core/schema';
import {
  CUTOUT_CATALOG,
  ICON_CATALOG,
  SHAPE_CATALOG,
  renderCutoutIllustrationSvg,
  renderIconSvgString,
  renderRetroOsDialogSvgString,
  renderRetroTvSvgString,
  renderShapeSvgString,
  type CutoutItemDef,
} from '../../core/svg-cutout-renderer';
import {
  PHOTO_FRAME_CATALOG,
  renderPhotoFrameSvgString,
  type PhotoFrameDef,
} from '../../core/frame-catalog';
import {
  CHART_PRESETS,
  TABLE_PRESETS,
  type ChartPresetDef,
  type TablePresetDef,
} from '../../core/data-presets';
import { getRansomTileStyle } from '../../core/text-effects';
import type { TextPresetInput, UploadedAssetItem } from './StudioLeftDrawer';

const RETRO_DIALOG_PRESETS: Array<Record<string, unknown> & { name: string; id: string }> = [
  {
    id: 'sys-err',
    name: 'System Error (!)',
    osStyle: 'win98-classic',
    dialogVariant: 'warning',
    title: 'SYSTEM ERROR',
    message: 'ERROR_NOT_ENOUGH_MEMORY',
    primaryButton: 'OK',
    secondaryButton: '',
    titleBarColor: '#000080',
    bodyBgColor: '#C0C0C0',
    textColor: '#111827',
  },
  {
    id: 'crit-err',
    name: 'Error Alert (×)',
    osStyle: 'win98-classic',
    dialogVariant: 'error',
    title: 'ERROR',
    message: 'Click "Fix" to fix error.',
    primaryButton: 'Fix',
    secondaryButton: '',
    titleBarColor: '#000080',
    bodyBgColor: '#C0C0C0',
    textColor: '#111827',
  },
  {
    id: 'xp-alert',
    name: 'Windows XP Alert',
    osStyle: 'winxp-luna',
    dialogVariant: 'error',
    title: 'Windows XP Error',
    message: 'Double-click any text to customize this dialog.',
    primaryButton: 'OK',
    secondaryButton: 'Cancel',
    titleBarColor: '#0054E3',
    bodyBgColor: '#ECE9D8',
    textColor: '#111827',
  },
  {
    id: 'install-ok',
    name: 'Install / Setup',
    osStyle: 'win98-classic',
    dialogVariant: 'success',
    title: 'INSTALL',
    message: 'DO YOU WANT TO CONTINUE?',
    primaryButton: 'Yes/Y',
    secondaryButton: 'No/N',
    titleBarColor: '#000080',
    bodyBgColor: '#C0C0C0',
    textColor: '#111827',
  },
];

const ELEMENT_CATEGORIES = [
  'All',
  'Tech & HUD',
  'Vintage & Flourishes',
  'History & Culture',
  'Backgrounds',
  'Doodles & Crayon',
  'Christmas & New Year',
  'Headers & Lines',
  'Borders & Edges',
  'Characters',
  'Education',
  'Celebration',
  'Retro Tech',
  'Nature & Fauna',
  'Ribbons & Badges',
  'Sparkles & Hearts',
  'Shapes',
];

const FRAME_CATEGORIES = [
  'All',
  'Christmas & New Year',
  'Device & Editorial',
  'Basic Shapes',
  'Organic & Badges',
];

const ICON_CATEGORIES = [
  'All',
  'Social Platforms',
  'Awards & Status',
  'Creative & UI',
  'Media & Tech',
  'Education',
  'Characters',
];

export type MobileBrowseTab = 'elements' | 'frames' | 'icons' | 'text' | 'uploads';
export type MobileInsertView = 'menu' | 'charts' | 'tables';

interface MobileElementsBrowserProps {
  doc: PresentationDocument;
  fontCatalog: Array<{ family: string; displayName: string }>;
  initialTab?: MobileBrowseTab;
  initialElemCat?: string;
  uploads: UploadedAssetItem[];
  uploadingAssets: boolean;
  isDrawingFrame: boolean;
  onUploadAssets: (files: FileList | File[]) => void;
  onDeleteUpload: (id: string) => void;
  onInsertUploadedImage: (url: string, name: string) => void;
  onInsertCutout: (def: CutoutItemDef) => void;
  onInsertShape: (kind: ShapeElement['shapeKind'], w?: number, h?: number) => void;
  onInsertIcon: (iconId: string, label: string, color: string, colorMode?: 'brand' | 'mono') => void;
  onInsertTextPreset: (preset: TextPresetInput) => void;
  onInsertRetroTv: () => void;
  onInsertPhotoFrame: (def: PhotoFrameDef) => void;
  onStartFreedrawFrame: () => void;
  onInsertRetroDialog: (preset: Record<string, unknown> & { name: string }) => void;
}

export function MobileElementsBrowser({
  doc,
  fontCatalog,
  initialTab = 'elements',
  initialElemCat = 'All',
  uploads,
  uploadingAssets,
  isDrawingFrame,
  onUploadAssets,
  onDeleteUpload,
  onInsertUploadedImage,
  onInsertCutout,
  onInsertShape,
  onInsertIcon,
  onInsertTextPreset,
  onInsertRetroTv,
  onInsertPhotoFrame,
  onStartFreedrawFrame,
  onInsertRetroDialog,
}: MobileElementsBrowserProps) {
  const [subTab, setSubTab] = useState<MobileBrowseTab>(initialTab);
  const [elemQuery, setElemQuery] = useState('');
  const [elemCat, setElemCat] = useState<string>(initialElemCat);
  const [showElemFilters, setShowElemFilters] = useState(false);
  const [showElemFramesSection, setShowElemFramesSection] = useState(true);
  const [showElemRetroSection, setShowElemRetroSection] = useState(true);
  const [frameQuery, setFrameQuery] = useState('');
  const [frameCat, setFrameCat] = useState<string>('All');
  const [showFrameFilters, setShowFrameFilters] = useState(false);
  const [iconQuery, setIconQuery] = useState('');
  const [iconCat, setIconCat] = useState<string>('All');
  const [showIconFilters, setShowIconFilters] = useState(false);
  const [iconColorMode, setIconColorMode] = useState<'brand' | 'mono'>('brand');
  const [iconColor, setIconColor] = useState<string>(doc.tokens.colors.accent || '#7D1935');

  const filteredCutouts = useMemo(() => {
    const q = elemQuery.trim().toLowerCase();
    return CUTOUT_CATALOG.filter((item) => {
      const catOk = elemCat === 'All' || item.category === elemCat;
      const qOk =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q));
      return catOk && qOk;
    });
  }, [elemQuery, elemCat]);

  const filteredShapes = useMemo(() => {
    const q = elemQuery.trim().toLowerCase();
    if (elemCat !== 'All' && elemCat !== 'Shapes') return [];
    return SHAPE_CATALOG.filter(
      (s) => !q || s.label.toLowerCase().includes(q) || s.kind.includes(q)
    );
  }, [elemQuery, elemCat]);

  const filteredFrames = useMemo(() => {
    const q = frameQuery.trim().toLowerCase();
    return PHOTO_FRAME_CATALOG.filter((f) => {
      const catOk = frameCat === 'All' || f.category === frameCat;
      const qOk =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.kind.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [frameQuery, frameCat]);

  const filteredIcons = useMemo(() => {
    const q = iconQuery.trim().toLowerCase();
    return ICON_CATALOG.filter((ic) => {
      const catOk = iconCat === 'All' || ic.category === iconCat;
      const qOk =
        !q ||
        ic.label.toLowerCase().includes(q) ||
        ic.id.toLowerCase().includes(q) ||
        ic.category.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [iconQuery, iconCat]);

  const textPresets: TextPresetInput[] = [
    {
      name: 'Sticker Bold Outline',
      previewText: 'STICKER BOLD',
      content: 'TEXT HERE',
      fontFamily: 'Anton',
      fontSize: 64,
      fontWeight: 800,
      color: '#FFFFFF',
      textEffect: 'sticker-outline',
      outlineColor: '#1B365D',
      outlineWidth: 14,
      rotation: -6,
      lineHeight: 0.94,
    },
    {
      name: 'Ransom Cutout',
      previewText: 'CUTOUT',
      content: 'TEXT HERE',
      fontFamily: 'Abril Fatface',
      fontSize: 52,
      fontWeight: 900,
      color: '#191B1F',
      textEffect: 'ransom-cutout',
    },
    {
      name: 'Y2K Outline Display',
      previewText: 'Y2K OUTLINE',
      content: 'TEXT HERE',
      fontFamily: 'Outfit',
      fontSize: 54,
      fontWeight: 900,
      color: '#FFFFFF',
      textShadow:
        '0 5px 0 #1D4ED8, 0 12px 24px rgba(15,23,42,0.35), -2px -2px 0 #1D4ED8, 2px -2px 0 #1D4ED8, -2px 2px 0 #1D4ED8, 2px 2px 0 #1D4ED8',
    },
    {
      name: 'Editorial Headline',
      previewText: 'Editorial Headline',
      content: 'TEXT HERE',
      fontFamily: 'Fraunces',
      fontSize: 44,
      fontWeight: 700,
      color: doc.tokens.colors.ink,
    },
    {
      name: 'Body Paragraph',
      previewText: 'Body Paragraph',
      content: 'TEXT HERE',
      fontFamily: doc.tokens.typography.bodyFont,
      fontSize: 20,
      fontWeight: 400,
      color: doc.tokens.colors.ink,
    },
  ];

  const subTabs: Array<{ id: MobileBrowseTab; label: string; icon: React.ReactNode }> = [
    { id: 'elements', label: 'Elements', icon: <Shapes className="w-3.5 h-3.5" /> },
    { id: 'frames', label: 'Frames', icon: <Frame className="w-3.5 h-3.5" /> },
    { id: 'icons', label: 'Icons', icon: <Smile className="w-3.5 h-3.5" /> },
    { id: 'text', label: 'Text', icon: <TypeIcon className="w-3.5 h-3.5" /> },
    { id: 'uploads', label: 'Uploads', icon: <UploadCloud className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-3 text-xs">
      {/* Sub-navigation bar */}
      <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
        {subTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubTab(t.id)}
            className={`min-h-[38px] rounded-lg flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
              subTab === t.id
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ELEMENTS & SHAPES */}
      {subTab === 'elements' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
            <input
              type="text"
              value={elemQuery}
              onChange={(e) => setElemQuery(e.target.value)}
              placeholder="Search shapes, doodles, christmas, xp error, border..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowElemFilters((v) => !v)}
              aria-expanded={showElemFilters}
              className="flex-1 h-8 px-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] flex items-center justify-between text-[11px] font-medium"
            >
              <span className="truncate text-[var(--text-secondary)]">
                Category: <strong className="text-[var(--text-primary)]">{elemCat}</strong>
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[var(--accent)] shrink-0 ml-1">
                {showElemFilters ? (
                  <>
                    Close <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Filter <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </span>
            </button>
            {elemCat !== 'All' && (
              <button
                type="button"
                onClick={() => setElemCat('All')}
                className="h-8 px-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[10px] font-semibold text-[var(--text-secondary)] shrink-0"
              >
                Reset
              </button>
            )}
          </div>

          {showElemFilters && (
            <div className="grid grid-cols-2 gap-1.5">
              {ELEMENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setElemCat(cat);
                    setShowElemFilters(false);
                  }}
                  className={`h-8 px-2.5 rounded-lg text-[11px] font-medium truncate text-left border ${
                    elemCat === cat
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] text-[var(--text-secondary)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Vector Shapes (shown first when Shapes filter is active, or below cutouts on All) */}
          {elemCat === 'Shapes' && filteredShapes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Vector Shapes ({filteredShapes.length})
                </span>
                <button
                  type="button"
                  onClick={() => setElemCat('All')}
                  className="text-[11px] font-semibold text-[var(--accent)]"
                >
                  Browse All Elements →
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {filteredShapes.map((sh) => {
                  const previewEl: ShapeElement = {
                    id: `mprev-${sh.kind}`,
                    name: sh.label,
                    type: 'shape',
                    x: 0,
                    y: 0,
                    width: 60,
                    height: sh.kind === 'line' ? 12 : sh.kind === 'pill' || sh.kind === 'ribbon-banner' ? 32 : 52,
                    rotation: 0,
                    zIndex: 1,
                    opacity: 1,
                    visible: true,
                    locked: false,
                    shapeKind: sh.kind,
                    fill: doc.tokens.colors.accent,
                    stroke: doc.tokens.colors.ink,
                    strokeWidth: 0,
                    borderRadius: 10,
                  };
                  return (
                    <button
                      key={sh.kind}
                      type="button"
                      onClick={() => onInsertShape(sh.kind, sh.defaultWidth, sh.defaultHeight)}
                      className="p-2.5 min-h-[68px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex flex-col items-center justify-center gap-1"
                    >
                      <div
                        className="w-10 h-9 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
                        dangerouslySetInnerHTML={{
                          __html: renderShapeSvgString(previewEl, `msh-${sh.kind}`),
                        }}
                      />
                      <span className="text-[10px] font-medium truncate w-full text-center">
                        {sh.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Retro TV & Freedraw Frame inside Elements */}
          {(elemCat === 'All' || elemCat === 'Retro Tech') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowElemFramesSection((v) => !v)}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                >
                  {showElemFramesSection ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronUp className="w-3 h-3 rotate-90" />
                  )}
                  <span>Photo Frames ({1 + PHOTO_FRAME_CATALOG.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubTab('frames')}
                  className="text-[11px] font-semibold text-[var(--accent)]"
                >
                  See all →
                </button>
              </div>
              {showElemFramesSection && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onInsertRetroTv}
                    className="p-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] flex items-center gap-2.5 text-left min-h-[54px]"
                  >
                    <div
                      className="w-10 h-9 shrink-0 [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: renderRetroTvSvgString({}, 'mob-tv-icon') }}
                    />
                    <span className="text-[11px] font-semibold leading-tight">Retro CRT TV Frame</span>
                  </button>
                  <button
                    type="button"
                    onClick={onStartFreedrawFrame}
                    className={`p-2.5 rounded-xl border border-dashed flex items-center justify-center gap-1.5 text-[11px] font-semibold min-h-[54px] ${
                      isDrawingFrame
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]/35'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>{isDrawingFrame ? 'Drawing...' : 'Freedraw Frame'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Retro Windows UI & Error Modals inside Elements */}
          {(elemCat === 'All' || elemCat === 'Retro Tech') &&
            (!elemQuery.trim() ||
              'windows xp 98 error modal system alert dialog setup install'.includes(
                elemQuery.trim().toLowerCase()
              )) && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowElemRetroSection((v) => !v)}
                  className="w-full flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                >
                  <span>Retro Windows UI &amp; Error Modals</span>
                  {showElemRetroSection ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
                {showElemRetroSection && (
                  <div className="grid grid-cols-2 gap-2">
                    {RETRO_DIALOG_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => onInsertRetroDialog(preset)}
                        className="p-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] flex flex-col items-center gap-1.5 text-center"
                      >
                        <div
                          className="w-full h-14 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                          dangerouslySetInnerHTML={{
                            __html: renderRetroOsDialogSvgString(preset, `mob-dlg-${preset.id}`, 360, 195),
                          }}
                        />
                        <span className="text-[10px] font-medium">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* Cutout Elements */}
          {filteredCutouts.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Elements &amp; Stickers ({filteredCutouts.length})
              </div>
              <div className="grid grid-cols-3 gap-2">
                {filteredCutouts.map((item) => {
                  const { svg } = renderCutoutIllustrationSvg(
                    item.kind,
                    item.defaultProps,
                    `mob-${item.kind}`
                  );
                  return (
                    <button
                      key={item.kind}
                      type="button"
                      onClick={() => onInsertCutout(item)}
                      className="p-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex flex-col items-center gap-1 text-center"
                    >
                      <div
                        className="w-14 h-12 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
                        dangerouslySetInnerHTML={{ __html: svg }}
                      />
                      <span className="text-[10px] font-medium leading-tight line-clamp-2">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vector Shapes on All */}
          {elemCat === 'All' && filteredShapes.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Vector Shapes ({filteredShapes.length})
              </div>
              <div className="grid grid-cols-3 gap-2">
                {filteredShapes.map((sh) => {
                  const previewEl: ShapeElement = {
                    id: `mprev2-${sh.kind}`,
                    name: sh.label,
                    type: 'shape',
                    x: 0,
                    y: 0,
                    width: 60,
                    height: sh.kind === 'line' ? 12 : sh.kind === 'pill' || sh.kind === 'ribbon-banner' ? 32 : 52,
                    rotation: 0,
                    zIndex: 1,
                    opacity: 1,
                    visible: true,
                    locked: false,
                    shapeKind: sh.kind,
                    fill: doc.tokens.colors.accent,
                    stroke: doc.tokens.colors.ink,
                    strokeWidth: 0,
                    borderRadius: 10,
                  };
                  return (
                    <button
                      key={sh.kind}
                      type="button"
                      onClick={() => onInsertShape(sh.kind, sh.defaultWidth, sh.defaultHeight)}
                      className="p-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-10 h-9 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
                        dangerouslySetInnerHTML={{
                          __html: renderShapeSvgString(previewEl, `msh2-${sh.kind}`),
                        }}
                      />
                      <span className="text-[10px] truncate w-full text-center">{sh.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FRAMES */}
      {subTab === 'frames' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
            <input
              type="text"
              value={frameQuery}
              onChange={(e) => setFrameQuery(e.target.value)}
              placeholder="Search christmas, polaroid, circle, cloud..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowFrameFilters((v) => !v)}
              aria-expanded={showFrameFilters}
              className="flex-1 h-8 px-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] flex items-center justify-between text-[11px] font-medium"
            >
              <span className="truncate text-[var(--text-secondary)]">
                Category: <strong className="text-[var(--text-primary)]">{frameCat}</strong>
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[var(--accent)] shrink-0 ml-1">
                {showFrameFilters ? (
                  <>
                    Close <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Filter <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </span>
            </button>
            {frameCat !== 'All' && (
              <button
                type="button"
                onClick={() => setFrameCat('All')}
                className="h-8 px-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[10px] font-semibold text-[var(--text-secondary)] shrink-0"
              >
                Reset
              </button>
            )}
          </div>
          {showFrameFilters && (
            <div className="grid grid-cols-2 gap-1.5">
              {FRAME_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFrameCat(cat);
                    setShowFrameFilters(false);
                  }}
                  className={`h-8 px-2.5 rounded-lg text-[11px] font-medium truncate text-left border ${
                    idx === 0 ? 'col-span-2 text-center' : ''
                  } ${
                    frameCat === cat
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] text-[var(--text-secondary)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onInsertRetroTv}
              className="p-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] flex items-center gap-2 text-left"
            >
              <div
                className="w-10 h-9 shrink-0 [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: renderRetroTvSvgString({}, 'mob-f-tv') }}
              />
              <span className="text-[11px] font-semibold">Retro CRT TV</span>
            </button>
            <button
              type="button"
              onClick={onStartFreedrawFrame}
              className="p-2.5 rounded-xl border border-dashed border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]/35 flex items-center justify-center gap-1.5 text-[11px] font-semibold"
            >
              <PenTool className="w-3.5 h-3.5" /> Freedraw Frame
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {filteredFrames.map((pf) => (
              <button
                key={pf.kind}
                type="button"
                onClick={() => onInsertPhotoFrame(pf)}
                className="p-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] flex flex-col items-center gap-1 text-center"
              >
                <div
                  className="w-14 h-12 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
                  dangerouslySetInnerHTML={{
                    __html: renderPhotoFrameSvgString({ frameKind: pf.kind }, `mpf-${pf.kind}`),
                  }}
                />
                <span className="text-[10px] font-medium line-clamp-2">{pf.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ICONS */}
      {subTab === 'icons' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
              <input
                type="text"
                value={iconQuery}
                onChange={(e) => setIconQuery(e.target.value)}
                placeholder="Search social, medal, wifi..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
              />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIconColorMode(iconColorMode === 'brand' ? 'mono' : 'brand')}
                className="h-9 px-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[11px] font-semibold"
              >
                {iconColorMode === 'brand' ? 'Brand' : 'Tint'}
              </button>
              <input
                type="color"
                value={iconColor}
                onChange={(e) => {
                  setIconColor(e.target.value);
                  setIconColorMode('mono');
                }}
                className="w-9 h-9 rounded-xl border border-[var(--border-hairline)] cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowIconFilters((v) => !v)}
              aria-expanded={showIconFilters}
              className="flex-1 h-8 px-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] flex items-center justify-between text-[11px] font-medium"
            >
              <span className="truncate text-[var(--text-secondary)]">
                Category: <strong className="text-[var(--text-primary)]">{iconCat}</strong>
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[var(--accent)] shrink-0 ml-1">
                {showIconFilters ? (
                  <>
                    Close <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Filter <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </span>
            </button>
            {iconCat !== 'All' && (
              <button
                type="button"
                onClick={() => setIconCat('All')}
                className="h-8 px-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[10px] font-semibold text-[var(--text-secondary)] shrink-0"
              >
                Reset
              </button>
            )}
          </div>
          {showIconFilters && (
            <div className="grid grid-cols-2 gap-1.5">
              {ICON_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setIconCat(cat);
                    setShowIconFilters(false);
                  }}
                  className={`h-8 px-2.5 rounded-lg text-[11px] font-medium truncate text-left border ${
                    idx === 0 ? 'col-span-2 text-center' : ''
                  } ${
                    iconCat === cat
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] text-[var(--text-secondary)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-4 gap-2">
            {filteredIcons.map((ic) => (
              <button
                key={ic.id}
                type="button"
                onClick={() =>
                  onInsertIcon(
                    ic.id,
                    ic.label,
                    iconColorMode === 'brand' ? ic.defaultColor : iconColor,
                    iconColorMode
                  )
                }
                className="p-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] flex flex-col items-center gap-1"
              >
                <div
                  className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{
                    __html: renderIconSvgString(ic.id, iconColor, 1.9, iconColorMode, `mic-${ic.id}`),
                  }}
                />
                <span className="text-[10px] truncate w-full text-center">{ic.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TEXT & FONTS */}
      {subTab === 'text' && (
        <div className="space-y-3">
          <div className="space-y-2">
            {textPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onInsertTextPreset(preset)}
                className="w-full text-left p-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] space-y-1"
              >
                <div className="text-[10px] font-mono-tabular text-[var(--text-muted)]">{preset.name}</div>
                {preset.textEffect === 'sticker-outline' ? (
                  <div
                    className="inline-block text-xl leading-[0.95] uppercase"
                    style={{
                      fontFamily: preset.fontFamily,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      WebkitTextStroke: `5px ${preset.outlineColor || '#1B365D'}`,
                      paintOrder: 'stroke fill',
                    }}
                  >
                    {(preset.previewText || preset.name).replace('\n', ' ')}
                  </div>
                ) : preset.textEffect === 'ransom-cutout' ? (
                  <div className="flex items-center gap-0.5 py-0.5">
                    {Array.from(preset.previewText || preset.name).map((ch, idx) => {
                      const st = getRansomTileStyle(idx);
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center justify-center px-1.5 py-0.5 text-sm font-black leading-none"
                          style={{
                            backgroundColor: st.bg,
                            color: st.fg,
                            fontFamily: st.fontFamily,
                            fontStyle: st.fontStyle || 'normal',
                            clipPath: st.clipPath,
                            transform: `rotate(${st.rotate}deg)`,
                          }}
                        >
                          {ch}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className="truncate text-base"
                    style={{ fontFamily: preset.fontFamily, fontWeight: preset.fontWeight }}
                  >
                    {preset.previewText || preset.name}
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[var(--border-hairline)]">
            {fontCatalog.map((font) => (
              <button
                key={font.family}
                type="button"
                onClick={() =>
                  onInsertTextPreset({
                    name: `${font.displayName} Heading`,
                    content: 'TEXT HERE',
                    fontFamily: font.family,
                    fontSize: 32,
                    fontWeight: 700,
                    color: doc.tokens.colors.ink,
                  })
                }
                className="px-2.5 py-2 min-h-[40px] rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-left flex items-center justify-between"
              >
                <span className="text-xs truncate" style={{ fontFamily: font.family }}>
                  {font.displayName}
                </span>
                <Plus className="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* UPLOADS */}
      {subTab === 'uploads' && (
        <div className="space-y-3">
          <label className="flex flex-col items-center justify-center gap-1 p-4 rounded-xl border-2 border-dashed border-[var(--accent)]/60 bg-[var(--accent-soft)]/30 cursor-pointer text-center">
            <UploadCloud className="w-5 h-5 text-[var(--accent)]" />
            <span className="font-semibold text-[var(--accent)]">
              {uploadingAssets ? 'Uploading images...' : 'Upload Images (Batch)'}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)]">
              Tap to choose photos from your device
            </span>
            <input
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.webp,.svg,.gif,image/*"
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.length) onUploadAssets(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
          {uploads.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {uploads.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => onInsertUploadedImage(item.publicUrl, item.filename)}
                    className="w-full text-left block"
                  >
                    <div className="aspect-[4/3] bg-neutral-100">
                      <img src={item.publicUrl} alt={item.filename} className="w-full h-full object-cover" />
                    </div>
                    <div className="px-2 py-1 text-[10px] truncate font-medium">{item.filename}</div>
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${item.filename}`}
                    onClick={() => onDeleteUpload(item.id)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-md bg-white/90 text-red-600 flex items-center justify-center shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface MobileInsertHubProps {
  canGroup: boolean;
  canUngroup: boolean;
  onInsertTextBox: () => void;
  onOpenShapesBrowser: () => void;
  onOpenElementsBrowser: () => void;
  onInsertChart: (preset: ChartPresetDef) => void;
  onInsertTable: (preset: TablePresetDef) => void;
  onOpenCutoutStudio: () => void;
  onUploadRawImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartFreedrawFrame: () => void;
  onOpenComponentsModal: () => void;
  onOpenPageSetup: () => void;
  onSelectAll: () => void;
  onGroup: () => void;
  onUngroup: () => void;
}

export function MobileInsertHub({
  canGroup,
  canUngroup,
  onInsertTextBox,
  onOpenShapesBrowser,
  onOpenElementsBrowser,
  onInsertChart,
  onInsertTable,
  onOpenCutoutStudio,
  onUploadRawImage,
  onStartFreedrawFrame,
  onOpenComponentsModal,
  onOpenPageSetup,
  onSelectAll,
  onGroup,
  onUngroup,
}: MobileInsertHubProps) {
  const [view, setView] = useState<MobileInsertView>('menu');

  if (view === 'charts') {
    return (
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setView('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Add
          </button>
          <span className="font-semibold">Choose Chart ({CHART_PRESETS.length})</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {CHART_PRESETS.map((cp) => (
            <button
              key={cp.id}
              type="button"
              onClick={() => onInsertChart(cp)}
              className="p-3 min-h-[72px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] text-left flex flex-col justify-between gap-1"
            >
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <BarChart3 className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span className="truncate">{cp.name}</span>
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] line-clamp-2">{cp.subtitle}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'tables') {
    return (
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setView('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Add
          </button>
          <span className="font-semibold">Choose Table ({TABLE_PRESETS.length})</span>
        </div>
        <div className="space-y-2">
          {TABLE_PRESETS.map((tp) => (
            <button
              key={tp.id}
              type="button"
              onClick={() => onInsertTable(tp)}
              className="w-full p-3 min-h-[58px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <TableIcon className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-xs truncate">{tp.name}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] truncate">{tp.subtitle}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono-tabular text-[var(--text-muted)] shrink-0">
                {tp.rows.length}×{tp.headers.length}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onInsertTextBox}
          className="min-h-[48px] p-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs font-semibold flex items-center justify-center gap-2"
        >
          <TypeIcon className="w-4 h-4 text-[var(--accent)]" /> Add Text Box
        </button>
        <button
          type="button"
          onClick={onOpenShapesBrowser}
          className="min-h-[48px] p-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs font-semibold flex items-center justify-center gap-2"
        >
          <Shapes className="w-4 h-4 text-[var(--accent)]" /> Add Shape
        </button>
        <button
          type="button"
          onClick={() => setView('charts')}
          className="min-h-[48px] p-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs font-semibold flex items-center justify-center gap-2"
        >
          <BarChart3 className="w-4 h-4 text-[var(--accent)]" /> Add Chart ({CHART_PRESETS.length})
        </button>
        <button
          type="button"
          onClick={() => setView('tables')}
          className="min-h-[48px] p-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs font-semibold flex items-center justify-center gap-2"
        >
          <TableIcon className="w-4 h-4 text-[var(--accent)]" /> Add Table ({TABLE_PRESETS.length})
        </button>

        <button
          type="button"
          onClick={onOpenElementsBrowser}
          className="col-span-2 min-h-[48px] p-3 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-soft)]/50 text-[var(--accent)] text-xs font-semibold flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Browse All Elements, Frames &amp; Icons
        </button>

        <button
          type="button"
          onClick={onOpenCutoutStudio}
          className="col-span-2 min-h-[46px] p-3 rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold flex items-center justify-center gap-2"
        >
          <Scissors className="w-4 h-4" /> Photo Cutout Studio (Auto / Manual)
        </button>

        <label className="col-span-2 min-h-[46px] p-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs font-medium flex items-center justify-center gap-2 cursor-pointer">
          <ImageIcon className="w-4 h-4" />
          <span aria-hidden="true">Upload &amp; Insert Raw Image</span>
          <input
            type="file"
            aria-label="Upload and insert image"
            accept=".png,.jpg,.jpeg,.webp,.svg"
            onChange={onUploadRawImage}
            className="sr-only"
          />
        </label>

        <button
          type="button"
          onClick={onStartFreedrawFrame}
          className="min-h-[46px] p-3 rounded-xl border border-dashed border-[var(--accent)] text-[var(--accent)] text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <PenTool className="w-3.5 h-3.5" /> Freedraw Frame
        </button>
        <button
          type="button"
          onClick={onOpenPageSetup}
          className="min-h-[46px] p-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Maximize className="w-3.5 h-3.5 text-[var(--accent)]" /> Page Size &amp; Margins
        </button>

        <button
          type="button"
          onClick={onOpenComponentsModal}
          className="col-span-2 min-h-[44px] p-3 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold flex items-center justify-center gap-2"
        >
          <Layers className="w-4 h-4" /> Insert Smart Component
        </button>
      </div>

      {/* Quick Mobile Selection & Grouping Strip */}
      <div className="pt-2 border-t border-[var(--border-hairline)] flex items-center gap-2">
        <button
          type="button"
          onClick={onSelectAll}
          className="flex-1 min-h-[40px] px-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[11px] font-medium inline-flex items-center justify-center gap-1.5"
        >
          <CheckSquare className="w-3.5 h-3.5" /> Select All
        </button>
        {canGroup && (
          <button
            type="button"
            onClick={onGroup}
            className="flex-1 min-h-[40px] px-2.5 rounded-xl bg-[var(--accent)] text-white text-[11px] font-semibold inline-flex items-center justify-center gap-1.5"
          >
            <Group className="w-3.5 h-3.5" /> Group
          </button>
        )}
        {canUngroup && (
          <button
            type="button"
            onClick={onUngroup}
            className="flex-1 min-h-[40px] px-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[11px] font-semibold inline-flex items-center justify-center gap-1.5"
          >
            <Ungroup className="w-3.5 h-3.5" /> Ungroup
          </button>
        )}
      </div>
    </div>
  );
}
