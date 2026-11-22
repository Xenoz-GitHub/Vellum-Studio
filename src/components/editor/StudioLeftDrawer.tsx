import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Copy,
  Image as ImageIcon,
  Layers,
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
} from 'lucide-react';
import type {
  DesignTokens,
  ElementAnimation,
  PresentationDocument,
  PresentationElement,
  ShapeElement,
  Slide,
} from '../../core/schema';
import {
  CUTOUT_CATALOG,
  ICON_CATALOG,
  SHAPE_CATALOG,
  renderCutoutIllustrationSvg,
  renderShapeSvgString,
  type CutoutItemDef,
} from '../../core/svg-cutout-renderer';
import { SlideCanvas } from '../renderer/SlideCanvas';

export type StudioRailTab = 'slides' | 'elements' | 'icons' | 'cutout' | 'text' | 'motion' | null;

interface StudioLeftDrawerProps {
  activeTab: StudioRailTab;
  onSelectTab: (tab: StudioRailTab) => void;
  doc: PresentationDocument;
  activeSlide: Slide;
  selectedElement: PresentationElement | null;
  fontCatalog: Array<{ family: string; displayName: string }>;
  onSelectSlide: (slideId: string) => void;
  onAddSlide: () => void;
  onMoveSlide: (slideId: string, dir: -1 | 1) => void;
  onDuplicateSlide: (slideId: string) => void;
  onDeleteSlide: (slideId: string) => void;
  onInsertCutout: (def: CutoutItemDef) => void;
  onInsertShape: (kind: ShapeElement['shapeKind'], w?: number, h?: number) => void;
  onInsertIcon: (iconId: string, label: string, color: string) => void;
  onInsertTextPreset: (preset: {
    name: string;
    content: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    color: string;
    textShadow?: string;
    backgroundColor?: string;
    borderRadius?: number;
  }) => void;
  onInsertChart: () => void;
  onInsertTable: () => void;
  onUploadRawImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenCutoutStudio: () => void;
  onOpenComponentsModal: () => void;
  onApplyAnimation: (animation: ElementAnimation) => void;
  onReplayAnimations: () => void;
}

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
  onApplyAnimation,
  onReplayAnimations,
}: StudioLeftDrawerProps) {
  const [elemQuery, setElemQuery] = useState('');
  const [elemCat, setElemCat] = useState<string>('All');
  const [iconQuery, setIconQuery] = useState('');
  const [iconCat, setIconCat] = useState<string>('All');
  const [iconColor, setIconColor] = useState<string>(doc.tokens.colors.accent || '#7D1935');

  const filteredCutouts = useMemo(() => {
    const q = elemQuery.trim().toLowerCase();
    return CUTOUT_CATALOG.filter((item) => {
      const catOk = elemCat === 'All' || item.category === elemCat;
      const qOk =
        !q ||
        item.name.toLowerCase().includes(q) ||
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
      const qOk = !q || ic.label.toLowerCase().includes(q) || ic.id.includes(q);
      return catOk && qOk;
    });
  }, [iconQuery, iconCat]);

  const railItems: Array<{ id: Exclude<StudioRailTab, null>; label: string; icon: React.ReactNode }> = [
    { id: 'slides', label: 'Slides', icon: <Layers className="w-4 h-4" /> },
    { id: 'elements', label: 'Elements', icon: <Shapes className="w-4 h-4" /> },
    { id: 'icons', label: 'Icons', icon: <Smile className="w-4 h-4" /> },
    { id: 'cutout', label: 'Cutout', icon: <Scissors className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <TypeIcon className="w-4 h-4" /> },
    { id: 'motion', label: 'Motion', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const textPresets = [
    {
      name: 'Y2K Outline Display',
      content: 'HAPPY BIRTHDAY',
      fontFamily: 'Outfit',
      fontSize: 54,
      fontWeight: 900,
      color: '#FFFFFF',
      textShadow:
        '0 5px 0 #1D4ED8, 0 12px 24px rgba(15,23,42,0.35), -2px -2px 0 #1D4ED8, 2px -2px 0 #1D4ED8, -2px 2px 0 #1D4ED8, 2px 2px 0 #1D4ED8',
    },
    {
      name: 'Editorial Headline',
      content: 'Design With Conviction',
      fontFamily: 'Fraunces',
      fontSize: 44,
      fontWeight: 700,
      color: doc.tokens.colors.ink,
    },
    {
      name: 'PubMat Impact Title',
      content: 'NOW STREAMING',
      fontFamily: 'Archivo Black',
      fontSize: 42,
      fontWeight: 800,
      color: doc.tokens.colors.accent,
    },
    {
      name: 'Pill Badge Kicker',
      content: 'LIMITED EDITION · 2026',
      fontFamily: 'Space Grotesk',
      fontSize: 16,
      fontWeight: 700,
      color: '#FFFFFF',
      backgroundColor: doc.tokens.colors.accent,
      borderRadius: 999,
    },
    {
      name: 'Retro Brush Script',
      content: 'Celebrate Today',
      fontFamily: 'Pacifico',
      fontSize: 38,
      fontWeight: 400,
      color: doc.tokens.colors.accent,
    },
    {
      name: 'Body Paragraph',
      content: 'Double-click to edit this copy block with your presentation story.',
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
                    placeholder="Search balloons, fish, flowers..."
                    aria-label="Search elements"
                    className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {['All', 'Celebration', 'Retro Tech', 'Nature & Fauna', 'Ribbons & Badges', 'Sparkles & Hearts', 'Shapes'].map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setElemCat(cat)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                          elemCat === cat
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-4">
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

          {/* ICONS TAB (54 Social & Symbol Icons) */}
          {activeTab === 'icons' && (
            <>
              <div className="p-3 border-b border-[var(--border-hairline)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Icons &amp; Social ({ICON_CATALOG.length})</span>
                  <input
                    type="color"
                    aria-label="Icon insert color"
                    value={iconColor}
                    onChange={(e) => setIconColor(e.target.value)}
                    className="w-6 h-6 rounded border border-[var(--border-hairline)] cursor-pointer"
                  />
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={iconQuery}
                    onChange={(e) => setIconQuery(e.target.value)}
                    placeholder="Search Instagram, star, QR..."
                    aria-label="Search icons"
                    className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {['All', 'Social Platforms', 'Creative & UI', 'Awards & Status', 'Media & Tech'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setIconCat(cat)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                        iconCat === cat
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-3 gap-2">
                  {filteredIcons.map((ic) => (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => onInsertIcon(ic.id, ic.label, iconColor)}
                      className="p-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex flex-col items-center gap-1.5"
                    >
                      <svg viewBox="0 0 24 24" className="w-6 h-6">
                        {ic.paths.map((d, idx) =>
                          ic.mode === 'fill' ? (
                            <path key={idx} d={d} fill={iconColor} />
                          ) : (
                            <path
                              key={idx}
                              d={d}
                              fill="none"
                              stroke={iconColor}
                              strokeWidth={1.85}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )
                        )}
                      </svg>
                      <span className="text-[10px] truncate w-full text-center">{ic.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
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
                <button
                  type="button"
                  onClick={onInsertChart}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex items-center gap-2.5 font-medium"
                >
                  <BarChart3 className="w-4 h-4 text-[var(--accent)]" />
                  <span>Insert Data Chart</span>
                </button>
                <button
                  type="button"
                  onClick={onInsertTable}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] flex items-center gap-2.5 font-medium"
                >
                  <TableIcon className="w-4 h-4 text-[var(--accent)]" />
                  <span>Insert Data Table</span>
                </button>
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
                    className="w-full text-left p-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] space-y-1"
                  >
                    <div className="text-[10px] font-mono-tabular text-[var(--text-muted)]">{preset.name}</div>
                    <div
                      className="truncate text-base"
                      style={{
                        fontFamily: preset.fontFamily,
                        fontWeight: preset.fontWeight,
                        color: preset.backgroundColor ? preset.backgroundColor : doc.tokens.colors.ink,
                      }}
                    >
                      {preset.content}
                    </div>
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
                        content: font.displayName,
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
