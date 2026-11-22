import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Crop,
  ImagePlus,
  Lock,
  Maximize2,
  MoreVertical,
  RotateCw,
  Scissors,
  Sparkles,
  Trash2,
  Ungroup,
  Group,
  CheckSquare,
  Unlink,
  Unlock,
} from 'lucide-react';
import type { PresentationElement } from '../../core/schema';
import { normalizeAngleDeg } from '../../core/crop-utils';
import { apiFetch } from '../../lib/api';

interface FloatingElementToolbarProps {
  element: PresentationElement;
  selectedElements?: PresentationElement[];
  slideWidth: number;
  slideHeight: number;
  scale: number;
  isCropping?: boolean;
  canGroup?: boolean;
  canUngroup?: boolean;
  onPatch: (patch: Partial<PresentationElement>) => void;
  onLivePatch?: (patch: Partial<PresentationElement>) => void;
  onCommitSnapshot?: () => void;
  onToggleCrop?: () => void;
  onDetachFrameMedia?: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onLayer: (dir: 'up' | 'down') => void;
  onToggleLock: () => void;
  onGroup?: () => void;
  onUngroup?: () => void;
  onSelectAll?: () => void;
  onOpenCutout: () => void;
  onOpenAnimate: () => void;
  onError: (msg: string) => void;
}

const QUICK_COLORS = ['#7D1935', '#2563EB', '#F59E0B', '#EC4899', '#10B981', '#111827', '#FFFFFF'];

export function FloatingElementToolbar({
  element,
  selectedElements,
  slideWidth,
  slideHeight,
  scale,
  isCropping = false,
  canGroup = false,
  canUngroup = false,
  onPatch,
  onLivePatch,
  onCommitSnapshot,
  onToggleCrop,
  onDetachFrameMedia,
  onDuplicate,
  onDelete,
  onLayer,
  onToggleLock,
  onGroup,
  onUngroup,
  onSelectAll,
  onOpenCutout,
  onOpenAnimate,
  onError,
}: FloatingElementToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [draggingRotate, setDraggingRotate] = useState<{ deg: number; snapped: boolean } | null>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [element.id]);

  const stageW = slideWidth * scale;
  const stageH = slideHeight * scale;
  const leftEdge = element.x * scale;
  const rightEdge = (element.x + element.width) * scale;
  const topEdge = element.y * scale;

  // Place Canva-style vertical quick rail beside the selected element (prefer right, fall back to left or inset right)
  let railLeft = rightEdge + 12;
  if (railLeft + 44 > stageW - 4) {
    if (leftEdge - 54 >= 4) {
      railLeft = leftEdge - 52;
    } else {
      railLeft = Math.max(8, stageW - 50);
    }
  }
  const railTop = Math.max(8, Math.min(Math.max(8, stageH - 220), topEdge));
  const openMenuOnLeft = railLeft + 44 + 236 > stageW;

  const isMediaFrame =
    element.type === 'custom' &&
    (element.componentKey === 'retro-tv-frame' || element.componentKey === 'photo-frame');
  const hasFrameMedia =
    isMediaFrame && typeof element.props.mediaSrc === 'string' && Boolean(element.props.mediaSrc);
  const frameFit: 'cover' | 'contain' =
    isMediaFrame && element.props.mediaFit === 'contain' ? 'contain' : 'cover';

  const currentColor =
    element.type === 'text'
      ? element.color
      : element.type === 'shape'
      ? element.fill
      : element.type === 'icon'
      ? element.color
      : element.type === 'custom'
      ? String(element.props.primaryColor || element.props.tintColor || element.props.accentColor || '#7D1935')
      : '#7D1935';

  const applyQuickColor = (hex: string) => {
    if (element.type === 'text') {
      onPatch({ color: hex } as any);
    } else if (element.type === 'shape') {
      onPatch({ fill: hex, gradient: undefined } as any);
    } else if (element.type === 'icon') {
      onPatch({ color: hex } as any);
    } else if (element.type === 'custom') {
      const props = { ...element.props };
      if ('primaryColor' in props) props.primaryColor = hex;
      else if ('tintColor' in props) props.tintColor = hex;
      else if ('headerColor' in props) props.headerColor = hex;
      else props.accentColor = hex;
      onPatch({ props } as any);
    }
  };

  const handleImageFileUpload = async (file: File) => {
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiFetch<{ publicUrl: string }>('/api/uploads', {
        method: 'POST',
        body: form,
      });

      if (element.type === 'image') {
        onPatch({
          src: res.publicUrl,
          originalSrc: res.publicUrl,
          cutoutMode: 'none',
          alt: file.name,
          cropX: 50,
          cropY: 50,
          cropZoom: 1,
        } as any);
      } else if (isMediaFrame) {
        onPatch({
          props: {
            ...element.props,
            mediaSrc: res.publicUrl,
            mediaOriginalSrc: res.publicUrl,
            mediaAlt: file.name,
            mediaFit: 'cover',
            mediaCropX: 50,
            mediaCropY: 50,
            mediaZoom: 1,
          },
        } as any);
      }
      setMenuOpen(false);
    } catch (err: any) {
      onError(err.message || 'Photo upload failed.');
    }
  };

  const handleRotatePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (element.locked) return;
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const origRot = element.rotation || 0;
    let moved = false;

    setDraggingRotate({ deg: normalizeAngleDeg(origRot), snapped: false });

    const handleMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!moved && Math.hypot(dx, dy) > 3) {
        moved = true;
        onCommitSnapshot?.();
      }
      if (!moved) return;

      const delta = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
      const raw = origRot + delta * 0.85;
      let nextDeg = normalizeAngleDeg(raw);
      let snapped = false;

      if (ev.shiftKey) {
        nextDeg = normalizeAngleDeg(Math.round(raw / 15) * 15);
        snapped = true;
      } else {
        for (const c of [-180, -90, 0, 90, 180]) {
          if (Math.abs(nextDeg - c) <= 3) {
            nextDeg = c;
            snapped = true;
            break;
          }
        }
      }

      setDraggingRotate({ deg: nextDeg, snapped });
      if (onLivePatch) {
        onLivePatch({ rotation: nextDeg });
      } else {
        onPatch({ rotation: nextDeg });
      }
    };

    const handleUp = () => {
      setDraggingRotate(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);

      if (!moved) {
        onPatch({ rotation: normalizeAngleDeg((element.rotation || 0) + 15) });
      }
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const multiList = selectedElements && selectedElements.length > 1 ? selectedElements : null;
  if (multiList) {
    const stageW = slideWidth * scale;
    const minX = Math.min(...multiList.map((e) => e.x)) * scale;
    const minY = Math.min(...multiList.map((e) => e.y)) * scale;
    const maxX = Math.max(...multiList.map((e) => e.x + e.width)) * scale;
    const barTop = Math.max(8, minY - 48);
    const barLeft = Math.max(8, Math.min(Math.max(8, stageW - 310), (minX + maxX) / 2 - 150));

    return (
      <div
        role="toolbar"
        aria-label="Multi-selection actions"
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute z-40 flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-strong)] shadow-[var(--shadow-float)] text-xs max-w-[calc(100%-16px)] overflow-x-auto"
        style={{ left: `${barLeft}px`, top: `${barTop}px` }}
      >
        <span className="px-2 py-1 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] font-mono-tabular font-semibold whitespace-nowrap">
          {multiList.length} selected
        </span>
        {canGroup && onGroup && (
          <button
            type="button"
            onClick={onGroup}
            title="Group selected elements (Ctrl+G)"
            className="h-8 px-2.5 rounded-lg inline-flex items-center gap-1.5 font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] whitespace-nowrap"
          >
            <Group className="w-3.5 h-3.5" />
            <span>Group</span>
            <kbd className="hidden sm:inline text-[9px] font-mono-tabular opacity-85 bg-black/20 px-1 rounded">
              Ctrl+G
            </kbd>
          </button>
        )}
        {canUngroup && onUngroup && (
          <button
            type="button"
            onClick={onUngroup}
            title="Ungroup elements (Ctrl+Shift+G)"
            className="h-8 px-2.5 rounded-lg inline-flex items-center gap-1.5 font-semibold border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)] whitespace-nowrap"
          >
            <Ungroup className="w-3.5 h-3.5" />
            <span>Ungroup</span>
          </button>
        )}
        {onSelectAll && (
          <button
            type="button"
            onClick={onSelectAll}
            title="Select all elements (Ctrl+A)"
            className="h-8 px-2 rounded-lg inline-flex items-center gap-1 hover:bg-[var(--bg-subtle)] whitespace-nowrap"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All</span>
          </button>
        )}
        <button
          type="button"
          onClick={onDuplicate}
          title="Duplicate selection (Ctrl+D)"
          className="w-8 h-8 rounded-lg inline-flex items-center justify-center hover:bg-[var(--bg-subtle)] shrink-0"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          title="Delete selection (Del)"
          className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-red-600 hover:bg-red-50 shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const railBtnCls =
    'w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors';
  const menuRowCls =
    'w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors font-medium';
  const kbdCls =
    'text-[9px] font-mono-tabular text-[var(--text-muted)] bg-[var(--bg-canvas)] border border-[var(--border-hairline)] px-1.5 py-0.5 rounded shrink-0';

  return (
    <div
      role="toolbar"
      aria-label="Quick element actions"
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute z-40 flex flex-col items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-strong)] shadow-[var(--shadow-float)] text-xs"
      style={{ left: `${railLeft}px`, top: `${railTop}px` }}
    >
      {/* 1. Canva-style Vertical Menu Button */}
      <button
        type="button"
        aria-label="Toggle element menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className={`w-8 h-8 rounded-lg inline-flex items-center justify-center transition-colors ${
          menuOpen
            ? 'bg-[var(--accent)] text-white'
            : 'text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
        }`}
        title="More element options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <div className="w-6 h-px bg-[var(--border-hairline)]" />

      {/* 2. Primary Contextual Action */}
      {(element.type === 'image' || hasFrameMedia) && (
        <button
          type="button"
          onClick={onToggleCrop}
          aria-label={isCropping ? 'Finish crop' : 'Crop and pan'}
          className={`w-8 h-8 rounded-lg inline-flex items-center justify-center transition-colors ${
            isCropping
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--accent-soft)] text-[var(--accent)] hover:opacity-90'
          }`}
          title={isCropping ? 'Done Cropping' : 'Crop & Pan Photo'}
        >
          <Crop className="w-4 h-4" />
        </button>
      )}

      {isMediaFrame && !hasFrameMedia && (
        <label
          className="w-8 h-8 rounded-lg inline-flex items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)] hover:opacity-90 cursor-pointer"
          title="Insert photo into frame"
        >
          <ImagePlus className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await handleImageFileUpload(file);
              e.target.value = '';
            }}
          />
        </label>
      )}

      {element.type !== 'image' && !isMediaFrame && (
        <button
          type="button"
          onClick={onOpenAnimate}
          aria-label="Animate element"
          className={railBtnCls}
          title="Animate"
        >
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
        </button>
      )}

      {/* 3. Drag-to-Rotate Icon Button */}
      <div className="relative">
        <button
          type="button"
          aria-label="Drag to rotate element or click to step 15 degrees"
          onPointerDown={handleRotatePointerDown}
          className={`w-8 h-8 rounded-lg inline-flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none transition-colors ${
            draggingRotate
              ? draggingRotate.snapped
                ? 'bg-emerald-600 text-white'
                : 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
          }`}
          title="Drag to rotate smoothly (click +15°, hold Shift to snap)"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        {draggingRotate && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${
              openMenuOnLeft ? 'right-full mr-2' : 'left-full ml-2'
            } px-2 py-0.5 rounded-full text-[11px] font-mono-tabular font-semibold text-white shadow-md whitespace-nowrap pointer-events-none ${
              draggingRotate.snapped ? 'bg-emerald-600' : 'bg-neutral-900'
            }`}
          >
            {draggingRotate.deg}°
          </div>
        )}
      </div>

      {/* 4. Duplicate */}
      <button
        type="button"
        aria-label="Duplicate selected element"
        onClick={onDuplicate}
        className={railBtnCls}
        title="Duplicate (Ctrl+D)"
      >
        <Copy className="w-4 h-4" />
      </button>

      {/* 5. Delete */}
      <button
        type="button"
        aria-label="Delete selected element"
        onClick={onDelete}
        className="w-8 h-8 rounded-lg inline-flex items-center justify-center hover:bg-red-50 text-red-600 transition-colors"
        title="Delete (Del)"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Expandable Canva-Style Vertical Menu Dropdown */}
      {menuOpen && (
        <div
          role="menu"
          aria-label="Element actions menu"
          className={`absolute top-0 ${
            openMenuOnLeft ? 'right-full mr-2' : 'left-full ml-2'
          } w-64 flex flex-col gap-0.5 p-1.5 rounded-xl bg-[var(--bg-surface)]/98 backdrop-blur-md border border-[var(--border-strong)] shadow-[var(--shadow-float)] text-xs z-50 max-h-[390px] overflow-y-auto`}
        >
          {/* Image Actions */}
          {element.type === 'image' && (
            <>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onToggleCrop?.();
                  setMenuOpen(false);
                }}
                className={menuRowCls}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Crop className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span className="truncate">{isCropping ? 'Done Cropping' : 'Crop & Pan'}</span>
                </span>
              </button>
              <label className={`${menuRowCls} cursor-pointer`}>
                <span className="flex items-center gap-2.5 min-w-0">
                  <ImagePlus className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span className="truncate">Replace Photo</span>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleImageFileUpload(file);
                    e.target.value = '';
                  }}
                />
              </label>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onOpenCutout();
                  setMenuOpen(false);
                }}
                className={menuRowCls}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Scissors className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span className="truncate">Cutout Background</span>
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onPatch({ objectFit: element.objectFit === 'cover' ? 'contain' : 'cover' } as any);
                  setMenuOpen(false);
                }}
                className={menuRowCls}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Maximize2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    Fit: {element.objectFit === 'cover' ? 'Cover → Contain' : 'Contain → Cover'}
                  </span>
                </span>
              </button>
              <div className="my-1 h-px bg-[var(--border-hairline)]" />
            </>
          )}

          {/* Media Frame Actions */}
          {isMediaFrame && (
            <>
              <label className={`${menuRowCls} cursor-pointer`}>
                <span className="flex items-center gap-2.5 min-w-0">
                  <ImagePlus className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span className="truncate">{hasFrameMedia ? 'Replace Frame Photo' : 'Insert Photo into Frame'}</span>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleImageFileUpload(file);
                    e.target.value = '';
                  }}
                />
              </label>
              {hasFrameMedia && (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onToggleCrop?.();
                      setMenuOpen(false);
                    }}
                    className={menuRowCls}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Crop className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <span className="truncate">{isCropping ? 'Done Cropping' : 'Crop & Pan Frame'}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onPatch({
                        props: {
                          ...element.props,
                          mediaFit: frameFit === 'cover' ? 'contain' : 'cover',
                        },
                      } as any);
                      setMenuOpen(false);
                    }}
                    className={menuRowCls}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Maximize2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        Fit: {frameFit === 'cover' ? 'Cover → Contain' : 'Contain → Cover'}
                      </span>
                    </span>
                  </button>
                  {onDetachFrameMedia && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onDetachFrameMedia();
                        setMenuOpen(false);
                      }}
                      className={menuRowCls}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Unlink className="w-4 h-4 shrink-0" />
                        <span className="truncate">Detach Photo to Layer</span>
                      </span>
                    </button>
                  )}
                </>
              )}
              <div className="my-1 h-px bg-[var(--border-hairline)]" />
            </>
          )}

          {/* Text Quick Controls */}
          {element.type === 'text' && (
            <>
              <div className="px-2 py-1.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] overflow-hidden">
                    <button
                      type="button"
                      aria-label="Decrease font size"
                      onClick={() => onPatch({ fontSize: Math.max(10, element.fontSize - 4) } as any)}
                      className="px-2 py-1 hover:bg-[var(--bg-subtle)] font-mono-tabular font-semibold"
                    >
                      A-
                    </button>
                    <span className="font-mono-tabular text-[11px] px-2 border-x border-[var(--border-hairline)]">
                      {Math.round(element.fontSize)}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase font size"
                      onClick={() => onPatch({ fontSize: Math.min(160, element.fontSize + 4) } as any)}
                      className="px-2 py-1 hover:bg-[var(--bg-subtle)] font-mono-tabular font-semibold"
                    >
                      A+
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onPatch({
                        textEffect: element.textEffect === 'sticker-outline' ? 'none' : 'sticker-outline',
                        outlineColor: element.outlineColor || '#1B365D',
                        outlineWidth: element.outlineWidth ?? 12,
                      } as any)
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                      element.textEffect === 'sticker-outline'
                        ? 'bg-[var(--accent)] text-white'
                        : 'border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)]'
                    }`}
                  >
                    Sticker
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onPatch({
                        textEffect: element.textEffect === 'ransom-cutout' ? 'none' : 'ransom-cutout',
                      } as any)
                    }
                    className={`py-1 px-2 rounded-lg text-[11px] font-semibold ${
                      element.textEffect === 'ransom-cutout'
                        ? 'bg-[var(--accent)] text-white'
                        : 'border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)]'
                    }`}
                  >
                    Ransom Cutout
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onPatch({
                        textShadow: element.textShadow
                          ? undefined
                          : '0 4px 0 #1D4ED8, -2px -2px 0 #1D4ED8, 2px -2px 0 #1D4ED8, -2px 2px 0 #1D4ED8, 2px 2px 0 #1D4ED8',
                      } as any)
                    }
                    className={`py-1 px-2 rounded-lg text-[11px] font-semibold ${
                      element.textShadow
                        ? 'bg-[var(--accent)] text-white'
                        : 'border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)]'
                    }`}
                  >
                    Y2K Shadow
                  </button>
                </div>
              </div>
              <div className="my-1 h-px bg-[var(--border-hairline)]" />
            </>
          )}

          {/* Color Swatches */}
          {(element.type === 'text' ||
            element.type === 'shape' ||
            element.type === 'icon' ||
            element.type === 'custom') && (
            <>
              <div className="px-2.5 py-1.5 space-y-1.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Quick Color
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {QUICK_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      aria-label={`Color ${hex}`}
                      onClick={() => applyQuickColor(hex)}
                      className={`w-5 h-5 rounded-full border ${
                        currentColor.toLowerCase() === hex.toLowerCase()
                          ? 'ring-2 ring-[var(--accent)] ring-offset-1 border-white'
                          : 'border-black/20'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
              <div className="my-1 h-px bg-[var(--border-hairline)]" />
            </>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onOpenAnimate();
              setMenuOpen(false);
            }}
            className={menuRowCls}
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <span>Animate</span>
            </span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onLayer('up');
              setMenuOpen(false);
            }}
            className={menuRowCls}
          >
            <span className="flex items-center gap-2.5">
              <ArrowUp className="w-4 h-4 shrink-0" />
              <span>Bring Forward</span>
            </span>
            <kbd className={kbdCls}>]</kbd>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onLayer('down');
              setMenuOpen(false);
            }}
            className={menuRowCls}
          >
            <span className="flex items-center gap-2.5">
              <ArrowDown className="w-4 h-4 shrink-0" />
              <span>Send Backward</span>
            </span>
            <kbd className={kbdCls}>[</kbd>
          </button>

          {canUngroup && onUngroup && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onUngroup();
                setMenuOpen(false);
              }}
              className={menuRowCls}
            >
              <span className="flex items-center gap-2.5">
                <Ungroup className="w-4 h-4 shrink-0" />
                <span>Ungroup</span>
              </span>
              <kbd className={kbdCls}>Ctrl+Shift+G</kbd>
            </button>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onDuplicate();
              setMenuOpen(false);
            }}
            className={menuRowCls}
          >
            <span className="flex items-center gap-2.5">
              <Copy className="w-4 h-4 shrink-0" />
              <span>Duplicate</span>
            </span>
            <kbd className={kbdCls}>Ctrl+D</kbd>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onToggleLock();
              setMenuOpen(false);
            }}
            className={menuRowCls}
          >
            <span className="flex items-center gap-2.5">
              {element.locked ? (
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <Unlock className="w-4 h-4 shrink-0" />
              )}
              <span>{element.locked ? 'Unlock Element' : 'Lock Position'}</span>
            </span>
          </button>

          <div className="my-1 h-px bg-[var(--border-hairline)]" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onDelete();
              setMenuOpen(false);
            }}
            className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <span className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>Delete</span>
            </span>
            <kbd className="text-[9px] font-mono-tabular text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded shrink-0">
              Del
            </kbd>
          </button>
        </div>
      )}
    </div>
  );
}
