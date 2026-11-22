import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Copy,
  Frame,
  Image as ImageIcon,
  Layers,
  PenTool,
  Play,
  Plus,
  Scissors,
  Search,
  Shapes,
  Smile,
  Sparkles,
  Table as TableIcon,
  Trash2,
  Type as TypeIcon,
  UploadCloud,
} from 'lucide-react';
import type {
  DesignTokens,
  ElementAnimation,
  PresentationDocument,
  PresentationElement,
  ShapeElement,
  Slide,
} from '../../core/schema';
import { getRansomTileStyle } from '../../core/text-effects';
import {
  PHOTO_FRAME_CATALOG,
  renderPhotoFrameSvgString,
  type PhotoFrameDef,
} from '../../core/frame-catalog';
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
  CHART_PRESETS,
  TABLE_PRESETS,
  type ChartPresetDef,
  type TablePresetDef,
} from '../../core/data-presets';
import { SlideCanvas } from '../renderer/SlideCanvas';

export type StudioRailTab =
  | 'slides'
  | 'elements'
  | 'frames'
  | 'icons'
  | 'uploads'
  | 'cutout'
  | 'text'
  | 'motion'
  | null;

export interface UploadedAssetItem {
  id: string;
  filename: string;
  mimeType: string;
  publicUrl: string;
  createdAt?: string;
}

export interface TextPresetInput {
  name: string;
  previewText?: string;
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textShadow?: string;
  backgroundColor?: string;
  borderRadius?: number;
  textEffect?: 'none' | 'sticker-outline' | 'ransom-cutout';
  outlineColor?: string;
  outlineWidth?: number;
  rotation?: number;
  lineHeight?: number;
}

interface StudioLeftDrawerProps {
  activeTab: StudioRailTab;
  onSelectTab: (tab: StudioRailTab) => void;
  doc: PresentationDocument;
  activeSlide: Slide;
  selectedElement: PresentationElement | null;
  fontCatalog: Array<{ family: string; displayName: string }>;
  uploads?: UploadedAssetItem[];
  uploadingAssets?: boolean;
  onUploadAssets?: (files: FileList | File[]) => void;
  onDeleteUpload?: (id: string) => void;
  onInsertUploadedImage?: (url: string, name: string) => void;
  onSelectSlide: (slideId: string) => void;
  onAddSlide: () => void;
  onMoveSlide: (slideId: string, dir: -1 | 1) => void;
  onDuplicateSlide: (slideId: string) => void;
  onDeleteSlide: (slideId: string) => void;
  onInsertCutout: (def: CutoutItemDef) => void;
  onInsertShape: (kind: ShapeElement['shapeKind'], w?: number, h?: number) => void;
  onInsertIcon: (iconId: string, label: string, color: string, colorMode?: 'brand' | 'mono') => void;
  onInsertTextPreset: (preset: TextPresetInput) => void;
  onInsertChart: (preset?: ChartPresetDef) => void;
  onInsertTable: (preset?: TablePresetDef) => void;
  onUploadRawImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenCutoutStudio: () => void;
  onOpenComponentsModal: () => void;
  onInsertRetroTv?: () => void;
  onInsertPhotoFrame?: (def: PhotoFrameDef) => void;
  isDrawingFrame?: boolean;
  onStartFreedrawFrame?: () => void;
  onInsertRetroDialog?: (preset: Record<string, unknown> & { name: string }) => void;
  onApplyAnimation: (animation: ElementAnimation) => void;
  onReplayAnimations: () => void;
}

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

const ANIMATION_PRESETS: Array<{ id: ElementAnimation; label: string; desc: string }> = [
  { id: 'none', label: 'None', desc: 'Static layer' },
  { id: 'fade-up', label: 'Fade Up', desc: 'Editorial rise' },
  { id: 'fade-in', label: 'Fade In', desc: 'Gentle dissolve' },
  { id: 'slide-left', label: 'Slide Left', desc: 'Right-to-left glide' },
  { id: 'slide-right', label: 'Slide Right', desc: 'Left-to-right glide' },
  { id: 'scale-in', label: 'Scale In', desc: 'Optical zoom' },
  { id: 'pop', label: 'Sticker Pop', desc: 'Elastic bounce-in' },
  { id: 'float', label: 'Float Loop', desc: 'Zero-G hover' },
  { id: 'bounce', label: 'Bounce Loop', desc: 'Playful hop' },
  { id: 'pulse', label: 'Pulse Loop', desc: 'Heartbeat glow' },
  { id: 'spin-slow', label: 'Spin Slow', desc: 'Vinyl / disc turn' },
  { id: 'wiggle', label: 'Wiggle Loop', desc: 'Sticker tilt' },
];

export function StudioLeftDrawer({
  activeTab,
  onSelectTab,
  doc,
  activeSlide,
  selectedElement,
  fontCatalog,
  uploads = [],
  uploadingAssets = false,
  onUploadAssets,
  onDeleteUpload,
  onInsertUploadedImage,
  onSelectSlide,
  onAddSlide,
  onMoveSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onInsertCutout,
  onInsertShape,
  onInsertIcon,
  onInsertTextPreset,
  onInsertChart,
  onInsertTable,
  onUploadRawImage,
  onOpenCutoutStudio,
  onOpenComponentsModal,
  onInsertRetroTv,
  onInsertPhotoFrame,
  isDrawingFrame = false,
  onStartFreedrawFrame,
  onInsertRetroDialog,
  onApplyAnimation,
  onReplayAnimations,
}: StudioLeftDrawerProps) {
  const [elemQuery, setElemQuery] = useState('');
  const [elemCat, setElemCat] = useState<string>('All');
  const [showElemFilters, setShowElemFilters] = useState(false);
  const [showElemFramesSection, setShowElemFramesSection] = useState(true);
  const [showElemRetroSection, setShowElemRetroSection] = useState(true);
  const [frameQuery, setFrameQuery] = useState('');
  const [frameCat, setFrameCat] = useState<string>('All');
  const [showFrameFilters, setShowFrameFilters] = useState(false);
  const [showFeaturedTvInFrames, setShowFeaturedTvInFrames] = useState(true);
  const [iconQuery, setIconQuery] = useState('');
  const [iconCat, setIconCat] = useState<string>('All');
  const [showIconFilters, setShowIconFilters] = useState(false);
  const [iconColor, setIconColor] = useState<string>(doc.tokens.colors.accent || '#7D1935');
  const [iconColorMode, setIconColorMode] = useState<'brand' | 'mono'>('brand');
  const [uploadDropActive, setUploadDropActive] = useState(false);

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
    return SHAPE_CATALOG.filter((s) => !q || s.label.toLowerCase().includes(q) || s.kind.includes(q));
  }, [elemQuery, elemCat]);

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

  const showRetroTvInFrames =
    (frameCat === 'All' || frameCat === 'Device & Editorial') &&
    (!frameQuery.trim() ||
      'retro crt television tv frame photo'.includes(frameQuery.trim().toLowerCase()));

  const railItems: Array<{ id: Exclude<StudioRailTab, null>; label: string; icon: React.ReactNode }> = [
    { id: 'slides', label: 'Slides', icon: <Layers className="w-4 h-4" /> },
    { id: 'elements', label: 'Elements', icon: <Shapes className="w-4 h-4" /> },
    { id: 'frames', label: 'Frames', icon: <Frame className="w-4 h-4" /> },
    { id: 'icons', label: 'Icons', icon: <Smile className="w-4 h-4" /> },
    { id: 'uploads', label: 'Uploads', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'cutout', label: 'Cutout', icon: <Scissors className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <TypeIcon className="w-4 h-4" /> },
    { id: 'motion', label: 'Motion', icon: <Sparkles className="w-4 h-4" /> },
  ];

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
      name: 'PubMat Impact Title',
      previewText: 'PUBMAT IMPACT',
      content: 'TEXT HERE',
      fontFamily: 'Archivo Black',
      fontSize: 42,
      fontWeight: 800,
      color: doc.tokens.colors.accent,
    },
    {
      name: 'Pill Badge Kicker',
      previewText: 'PILL BADGE',
      content: 'TEXT HERE',
      fontFamily: 'Space Grotesk',
      fontSize: 16,
      fontWeight: 700,
      color: '#FFFFFF',
      backgroundColor: doc.tokens.colors.accent,
      borderRadius: 999,
    },
    {
      name: 'Retro Brush Script',
      previewText: 'Retro Brush',
      content: 'TEXT HERE',
      fontFamily: 'Pacifico',
      fontSize: 38,
      fontWeight: 400,
      color: doc.tokens.colors.accent,
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

  return (
    <div className="hidden lg:flex shrink-0 h-full bg-[var(--bg-surface)] border-r border-[var(--border-hairline)]">
      {/* Vertical Studio Rail */}
      <nav
        aria-label="Studio tool rail"
        className="w-[68px] border-r border-[var(--border-hairline)] bg-[var(--bg-canvas)]/70 flex flex-col items-center py-2.5 gap-1.5"
      >
        {railItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(active ? null : item.id)}
              aria-pressed={active}
              className={`w-14 py-2 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${
                active
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Collapsible Contextual Drawer */}
      {activeTab && (
        <aside className="w-72 flex flex-col h-full overflow-hidden bg-[var(--bg-surface)]">
          {/* SLIDES TAB */}
          {activeTab === 'slides' && (
            <>
              <div className="p-3 border-b border-[var(--border-hairline)] flex items-center justify-between">
                <span className="text-xs font-semibold">Slides ({doc.slides.length})</span>
                <button
                  type="button"
                  onClick={onAddSlide}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--accent)] text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {doc.slides.map((sl, idx) => {
                  const active = sl.id === activeSlide.id;
                  return (
                    <div
                      key={sl.id}
                      className={`rounded-lg border p-2 transition-colors ${
                        active
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectSlide(sl.id)}
                        className="w-full text-left"
                        aria-label={`Select slide ${idx + 1}: ${sl.title}`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono-tabular mb-1.5">
                          <span>{String(idx + 1).padStart(2, '0')}</span>
                          <span className="truncate ml-2 text-[var(--text-secondary)]">{sl.layoutPattern}</span>
                        </div>
                        <div className="pointer-events-none flex justify-center">
                          <SlideCanvas
                            slide={sl}
                            tokens={doc.tokens}
                            width={doc.width}
                            height={doc.height}
                            scale={Number(Math.min(200 / doc.width, 120 / doc.height).toFixed(3))}
                          />
                        </div>
                      </button>
                      <div className="flex items-center justify-end gap-1 mt-1.5 pt-1.5 border-t border-[var(--border-hairline)]">
                        <button
                          type="button"
                          aria-label={`Move slide ${idx + 1} up`}
                          onClick={() => onMoveSlide(sl.id, -1)}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-[var(--bg-subtle)] disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Move slide ${idx + 1} down`}
                          onClick={() => onMoveSlide(sl.id, 1)}
                          disabled={idx === doc.slides.length - 1}
                          className="p-1 rounded hover:bg-[var(--bg-subtle)] disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Duplicate slide ${idx + 1}`}
                          onClick={() => onDuplicateSlide(sl.id)}
                          className="p-1 rounded hover:bg-[var(--bg-subtle)]"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete slide ${idx + 1}`}
                          onClick={() => onDeleteSlide(sl.id)}
                          disabled={doc.slides.length <= 1}
                          className="p-1 rounded hover:bg-[var(--bg-subtle)] text-red-600 disabled:opacity-30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ELEMENTS TAB (Cutouts & Vector Shapes) */}
          {activeTab === 'elements' && (
            <>
              <div className="p-3 border-b border-[var(--border-hairline)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Cutouts &amp; Shapes</span>
                  <span className="text-[10px] font-mono-tabular text-[var(--text-muted)]">
                    {CUTOUT_CATALOG.length + SHAPE_CATALOG.length} assets
                  </span>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={elemQuery}
                    onChange={(e) => setElemQuery(e.target.value)}
                    placeholder="Search tech, hud, circuit, christmas, bg..."
                    aria-label="Search elements"
                    className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowElemFilters((v) => !v)}
                    aria-expanded={showElemFilters}
                    className="flex-1 h-8 px-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex items-center justify-between text-[11px] font-medium transition-colors"
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
                      className="h-8 px-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] text-[10px] font-semibold text-[var(--text-secondary)] shrink-0"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {showElemFilters && (
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    {[
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
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setElemCat(cat);
                          setShowElemFilters(false);
                        }}
                        title={cat}
                        className={`h-7 px-2 rounded-lg text-[10px] font-medium truncate text-left border transition-colors ${
                          elemCat === cat
                            ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                            : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {onInsertRetroTv &&
                  (elemCat === 'All' || elemCat === 'Retro Tech') &&
                  (!elemQuery.trim() ||
                    'retro crt television tv frame photo'.includes(elemQuery.trim().toLowerCase())) && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => setShowElemFramesSection((v) => !v)}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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
                          onClick={() => onSelectTab('frames')}
                          className="text-[10px] font-semibold text-[var(--accent)] hover:underline"
                        >
                          See all {1 + PHOTO_FRAME_CATALOG.length} →
                        </button>
                      </div>
                      {showElemFramesSection && (
                        <>
                          <button
                            type="button"
                            onClick={onInsertRetroTv}
                            className="w-full p-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30 transition-colors flex items-center gap-3 text-left"
                          >
                            <div
                              className="w-12 h-10 flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full"
                              dangerouslySetInnerHTML={{ __html: renderRetroTvSvgString({}, 'drawer-tv-icon') }}
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold leading-tight">Retro CRT TV Frame</div>
                              <div className="text-[10px] text-[var(--text-secondary)] truncate">
                                Drag any photo onto screen to fit
                              </div>
                            </div>
                          </button>

                          {onStartFreedrawFrame && (
                            <button
                              type="button"
                              onClick={onStartFreedrawFrame}
                              aria-pressed={isDrawingFrame}
                              className={`w-full px-3 py-2 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                                isDrawingFrame
                                  ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                                  : 'border-[var(--accent)]/60 bg-[var(--accent-soft)]/35 text-[var(--accent)] hover:bg-[var(--accent-soft)]'
                              }`}
                            >
                              <PenTool className="w-3.5 h-3.5" />
                              <span>{isDrawingFrame ? 'Drawing on Slide... (Click to Cancel)' : 'Draw Freedraw Frame'}</span>
                            </button>
                          )}

                          {onInsertPhotoFrame && (
                            <div className="grid grid-cols-4 gap-1.5">
                              {PHOTO_FRAME_CATALOG.slice(0, 4).map((pf) => (
                                <button
                                  key={pf.kind}
                                  type="button"
                                  onClick={() => onInsertPhotoFrame(pf)}
                                  title={`Insert ${pf.name}`}
                                  className="p-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex items-center justify-center"
                                >
                                  <div
                                    className="w-10 h-10 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
                                    dangerouslySetInnerHTML={{
                                      __html: renderPhotoFrameSvgString({ frameKind: pf.kind }, `el-pf-${pf.kind}`),
                                    }}
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                {onInsertRetroDialog &&
                  (elemCat === 'All' || elemCat === 'Retro Tech') &&
                  (!elemQuery.trim() ||
                    'windows xp 98 error modal system alert dialog setup install'.includes(
                      elemQuery.trim().toLowerCase()
                    )) && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setShowElemRetroSection((v) => !v)}
                        className="w-full flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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
                              className="p-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30 transition-colors flex flex-col items-center gap-1.5 text-center"
                            >
                              <div
                                className="w-full h-14 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                                dangerouslySetInnerHTML={{
                                  __html: renderRetroOsDialogSvgString(preset, `el-dlg-${preset.id}`, 360, 195),
                                }}
                              />
                              <span className="text-[10px] font-medium leading-tight">{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                {filteredCutouts.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                      Customizable Cutouts ({filteredCutouts.length})
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {filteredCutouts.map((item) => {
                        const { svg } = renderCutoutIllustrationSvg(item.kind, item.defaultProps, `prev-${item.kind}`);
                        return (
                          <button
                            key={item.kind}
                            type="button"
                            onClick={() => onInsertCutout(item)}
                            className="p-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30 transition-colors flex flex-col items-center gap-1.5 text-center"
                          >
                            <div
                              className="w-16 h-14 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
                              dangerouslySetInnerHTML={{ __html: svg }}
                            />
                            <span className="text-[11px] font-medium leading-tight">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {filteredShapes.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                      Vector Shapes ({filteredShapes.length})
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {filteredShapes.map((sh) => {
                        const previewEl: ShapeElement = {
                          id: `prev-${sh.kind}`,
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
                            className="p-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex flex-col items-center gap-1"
                          >
                            <div
                              className="w-10 h-9 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
                              dangerouslySetInnerHTML={{ __html: renderShapeSvgString(previewEl, `shprev-${sh.kind}`) }}
                            />
                            <span className="text-[10px] truncate w-full text-center">{sh.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* FRAMES TAB (Retro CRT TV + 36 Empty Photo & Shape Frames) */}
          {activeTab === 'frames' && (
            <>
              <div className="p-3 border-b border-[var(--border-hairline)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Photo &amp; Shape Frames</span>
                  <span className="text-[10px] font-mono-tabular text-[var(--text-muted)]">
                    {1 + PHOTO_FRAME_CATALOG.length} frames
                  </span>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={frameQuery}
                    onChange={(e) => setFrameQuery(e.target.value)}
                    placeholder="Search christmas, snowglobe, circle, polaroid..."
                    aria-label="Search photo frames"
                    className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowFrameFilters((v) => !v)}
                    aria-expanded={showFrameFilters}
                    className="flex-1 h-8 px-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex items-center justify-between text-[11px] font-medium transition-colors"
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
                      className="h-8 px-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] text-[10px] font-semibold text-[var(--text-secondary)] shrink-0"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {showFrameFilters && (
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    {['All', 'Christmas & New Year', 'Device & Editorial', 'Basic Shapes', 'Organic & Badges'].map(
                      (cat, idx) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setFrameCat(cat);
                            setShowFrameFilters(false);
                          }}
                          title={cat}
                          className={`h-7 px-2 rounded-lg text-[10px] font-medium truncate text-left border transition-colors ${
                            idx === 0 ? 'col-span-2 text-center' : ''
                          } ${
                            frameCat === cat
                              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                              : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {onStartFreedrawFrame && (
                  <button
                    type="button"
                    onClick={onStartFreedrawFrame}
                    aria-pressed={isDrawingFrame}
                    className={`w-full p-2.5 rounded-xl border border-dashed transition-colors flex items-center gap-2.5 text-left ${
                      isDrawingFrame
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-xs'
                        : 'border-[var(--accent)]/60 bg-[var(--accent-soft)]/40 text-[var(--accent)] hover:bg-[var(--accent-soft)]'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isDrawingFrame ? 'bg-white/20 text-white' : 'bg-white text-[var(--accent)] border border-[var(--accent)]/25'
                      }`}
                    >
                      <PenTool className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold leading-tight">
                        {isDrawingFrame ? 'Drawing Freedraw Frame...' : 'Draw Custom Frame (Freedraw)'}
                      </div>
                      <div className={`text-[10px] truncate ${isDrawingFrame ? 'text-white/85' : 'text-[var(--text-secondary)]'}`}>
                        {isDrawingFrame ? 'Sketch a closed shape on slide' : 'Sketch any outline & drop a photo in'}
                      </div>
                    </div>
                  </button>
                )}

                {showRetroTvInFrames && onInsertRetroTv && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowFeaturedTvInFrames((v) => !v)}
                      className="w-full flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-2"
                    >
                      <span>Featured Frame</span>
                      {showFeaturedTvInFrames ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {showFeaturedTvInFrames && (
                      <button
                        type="button"
                        onClick={onInsertRetroTv}
                        className="w-full p-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30 transition-colors flex items-center gap-3 text-left"
                      >
                        <div
                          className="w-14 h-12 flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full"
                          dangerouslySetInnerHTML={{ __html: renderRetroTvSvgString({}, 'frames-tv-icon') }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold leading-tight">Retro CRT TV Frame</div>
                          <div className="text-[10px] text-[var(--text-secondary)] truncate">
                            Drop photo inside CRT screen
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                )}

                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Empty Photo &amp; Shape Frames ({filteredFrames.length})
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {filteredFrames.map((pf) => (
                      <button
                        key={pf.kind}
                        type="button"
                        onClick={() => onInsertPhotoFrame?.(pf)}
                        className="p-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30 transition-colors flex flex-col items-center gap-1.5 text-center"
                      >
                        <div
                          className="w-14 h-12 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
                          dangerouslySetInnerHTML={{
                            __html: renderPhotoFrameSvgString({ frameKind: pf.kind }, `pf-prev-${pf.kind}`),
                          }}
                        />
                        <span className="text-[10px] font-medium leading-tight line-clamp-2">{pf.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ICONS TAB (76 Brand & Solid Icons) */}
          {activeTab === 'icons' && (
            <>
              <div className="p-3 border-b border-[var(--border-hairline)] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">Icons &amp; Social ({ICON_CATALOG.length})</span>
                  <div className="flex items-center gap-1.5">
                    <div className="inline-flex rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-0.5 text-[10px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setIconColorMode('brand')}
                        className={`px-1.5 py-0.5 rounded ${
                          iconColorMode === 'brand'
                            ? 'bg-[var(--accent)] text-white'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        Brand
                      </button>
                      <button
                        type="button"
                        onClick={() => setIconColorMode('mono')}
                        className={`px-1.5 py-0.5 rounded ${
                          iconColorMode === 'mono'
                            ? 'bg-[var(--accent)] text-white'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        Tint
                      </button>
                    </div>
                    <input
                      type="color"
                      aria-label="Icon insert color"
                      title="Pick custom tint color"
                      value={iconColor}
                      onChange={(e) => {
                        setIconColor(e.target.value);
                        setIconColorMode('mono');
                      }}
                      className="w-6 h-6 rounded border border-[var(--border-hairline)] cursor-pointer"
                    />
                  </div>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={iconQuery}
                    onChange={(e) => setIconQuery(e.target.value)}
                    placeholder="Search instagram, spotify, youtube, medal..."
                    aria-label="Search icons"
                    className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowIconFilters((v) => !v)}
                    aria-expanded={showIconFilters}
                    className="flex-1 h-8 px-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex items-center justify-between text-[11px] font-medium transition-colors"
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
                      className="h-8 px-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] text-[10px] font-semibold text-[var(--text-secondary)] shrink-0"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {showIconFilters && (
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    {[
                      'All',
                      'Social Platforms',
                      'Awards & Status',
                      'Creative & UI',
                      'Media & Tech',
                      'Education',
                      'Characters',
                    ].map((cat, idx) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setIconCat(cat);
                          setShowIconFilters(false);
                        }}
                        title={cat}
                        className={`h-7 px-2 rounded-lg text-[10px] font-medium truncate text-left border transition-colors ${
                          idx === 0 ? 'col-span-2 text-center' : ''
                        } ${
                          iconCat === cat
                            ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                            : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-3 gap-2">
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
                      className="p-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex flex-col items-center gap-1.5"
                    >
                      <div
                        className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{
                          __html: renderIconSvgString(
                            ic.id,
                            iconColor,
                            1.9,
                            iconColorMode,
                            `drw-${ic.id}`
                          ),
                        }}
                      />
                      <span className="text-[10px] truncate w-full text-center">{ic.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* UPLOADS MANAGER TAB */}
          {activeTab === 'uploads' && (
            <div className="flex-1 flex flex-col overflow-hidden text-xs">
              <div className="p-3 border-b border-[var(--border-hairline)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Image Uploads Manager</span>
                  <span className="text-[10px] font-mono-tabular text-[var(--text-muted)]">
                    {uploads.length} files
                  </span>
                </div>

                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setUploadDropActive(true);
                  }}
                  onDragLeave={() => setUploadDropActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setUploadDropActive(false);
                    if (e.dataTransfer.files?.length && onUploadAssets) {
                      onUploadAssets(e.dataTransfer.files);
                    }
                  }}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl border-2 border-dashed cursor-pointer transition-colors text-center ${
                    uploadDropActive
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)]/60'
                      : 'border-[var(--accent)]/50 bg-[var(--accent-soft)]/30 hover:bg-[var(--accent-soft)]/50'
                  }`}
                >
                  <UploadCloud className="w-5 h-5 text-[var(--accent)]" />
                  <span className="font-semibold text-[var(--accent)]">
                    {uploadingAssets ? 'Uploading images...' : 'Upload Images (Batch Supported)'}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    Click to pick or drag PNG, JPG, WebP, SVG here
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.webp,.svg,.gif,image/*"
                    className="sr-only"
                    onChange={(e) => {
                      if (e.target.files?.length && onUploadAssets) {
                        onUploadAssets(e.target.files);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {uploads.length === 0 ? (
                  <div className="p-4 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-center text-[11px] text-[var(--text-secondary)] space-y-1">
                    <div className="font-semibold text-[var(--text-primary)]">No uploaded assets yet</div>
                    <p>Upload photos once, then click to insert or drag directly onto slides &amp; TV/photo frames.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Click to Insert or Drag onto Frame
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {uploads.map((item) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              'application/x-vellum-image',
                              JSON.stringify({ src: item.publicUrl, alt: item.filename })
                            );
                            e.dataTransfer.effectAllowed = 'copy';
                          }}
                          className="group relative rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] overflow-hidden transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => onInsertUploadedImage?.(item.publicUrl, item.filename)}
                            className="w-full text-left block"
                            title={`Click to add ${item.filename} or drag onto frame`}
                          >
                            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
                              <img
                                src={item.publicUrl}
                                alt={item.filename}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="px-2 py-1 text-[10px] font-medium truncate">
                              {item.filename}
                            </div>
                          </button>
                          {onDeleteUpload && (
                            <button
                              type="button"
                              aria-label={`Delete ${item.filename}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteUpload(item.id);
                              }}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-white/90 text-red-600 shadow-xs flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CUTOUT & UPLOADS TAB */}
          {activeTab === 'cutout' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)]/50 space-y-2.5">
                <div className="flex items-center gap-2 font-display font-bold text-sm text-[var(--accent)]">
                  <Scissors className="w-4 h-4" /> Photo Cutout Studio
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Upload any photo and strip its background with Auto Flood-Fill or Manual Keep/Erase Shading, plus die-cut sticker outlines.
                </p>
                <button
                  type="button"
                  onClick={onOpenCutoutStudio}
                  className="w-full h-9 rounded-lg bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)]"
                >
                  Open Cutout Lab
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--border-hairline)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Quick Media &amp; Data Modules
                </div>
                <label className="w-full h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex items-center gap-2.5 font-medium cursor-pointer">
                  <ImageIcon className="w-4 h-4 text-[var(--accent)]" />
                  <span>Insert Raw Photo</span>
                  <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={onUploadRawImage} className="sr-only" />
                </label>

                <div className="pt-2 space-y-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Charts ({CHART_PRESETS.length})
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CHART_PRESETS.map((cp) => (
                      <button
                        key={cp.id}
                        type="button"
                        onClick={() => onInsertChart(cp)}
                        className="p-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] text-left space-y-0.5"
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                          <BarChart3 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                          <span className="truncate">{cp.name}</span>
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)] truncate">{cp.subtitle}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 space-y-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Tables ({TABLE_PRESETS.length})
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {TABLE_PRESETS.map((tp) => (
                      <button
                        key={tp.id}
                        type="button"
                        onClick={() => onInsertTable(tp)}
                        className="p-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex items-center gap-2.5 text-left"
                      >
                        <TableIcon className="w-4 h-4 text-[var(--accent)] shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-[11px] truncate">{tp.name}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] truncate">{tp.subtitle}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenComponentsModal}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex items-center gap-2.5 font-medium"
                >
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                  <span>Smart Layout Components</span>
                </button>
              </div>
            </div>
          )}

          {/* TEXT & FONTS TAB */}
          {activeTab === 'text' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
              <div className="space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Curated Type Lockups
                </div>
                {textPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => onInsertTextPreset(preset)}
                    className="w-full text-left p-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] space-y-1.5 overflow-hidden"
                  >
                    <div className="text-[10px] font-mono-tabular text-[var(--text-muted)]">{preset.name}</div>
                    {preset.textEffect === 'sticker-outline' ? (
                      <div
                        className="inline-block text-xl leading-[0.95] uppercase tracking-tight"
                        style={{
                          fontFamily: preset.fontFamily,
                          fontWeight: 800,
                          color: '#FFFFFF',
                          WebkitTextStroke: `5px ${preset.outlineColor || '#1B365D'}`,
                          paintOrder: 'stroke fill',
                          transform: `rotate(${preset.rotation ?? -4}deg)`,
                          transformOrigin: 'left center',
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
                        style={{
                          fontFamily: preset.fontFamily,
                          fontWeight: preset.fontWeight,
                          color: preset.backgroundColor ? preset.backgroundColor : doc.tokens.colors.ink,
                        }}
                      >
                        {preset.previewText || preset.name}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[var(--border-hairline)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Font Library ({fontCatalog.length})
                </div>
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
                    className="w-full text-left px-3 py-2 rounded-lg border border-[var(--border-hairline)] hover:border-[var(--accent)] flex items-center justify-between"
                  >
                    <span className="text-sm truncate" style={{ fontFamily: font.family }}>
                      {font.displayName}
                    </span>
                    <Plus className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MOTION & ANIMATIONS TAB */}
          {activeTab === 'motion' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Layer Animations</span>
                <button
                  type="button"
                  onClick={onReplayAnimations}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] font-semibold"
                >
                  <Play className="w-3 h-3" /> Replay
                </button>
              </div>
              {!selectedElement ? (
                <div className="p-3 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[11px] text-[var(--text-secondary)]">
                  Select any element on the canvas first, then pick a motion preset below.
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-[var(--accent-soft)]/50 border border-[var(--accent)]/40 text-[11px]">
                  Applying to: <span className="font-semibold">{selectedElement.name}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {ANIMATION_PRESETS.map((anim) => {
                  const active = selectedElement?.animation === anim.id;
                  return (
                    <button
                      key={anim.id}
                      type="button"
                      disabled={!selectedElement}
                      onClick={() => onApplyAnimation(anim.id)}
                      className={`p-2.5 rounded-xl border text-left transition-colors disabled:opacity-45 ${
                        active
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)]'
                      }`}
                    >
                      <div className="font-semibold text-xs">{anim.label}</div>
                      <div className="text-[10px] text-[var(--text-secondary)]">{anim.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
