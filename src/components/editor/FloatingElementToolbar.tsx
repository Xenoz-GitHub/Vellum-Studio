import React from 'react';
import {
  ArrowDown,
  ArrowUp,
  Copy,
  ImagePlus,
  Lock,
  Maximize2,
  RotateCw,
  Scissors,
  Sparkles,
  Trash2,
  Unlock,
} from 'lucide-react';
import type { PresentationElement } from '../../core/schema';
import { apiFetch } from '../../lib/api';

interface FloatingElementToolbarProps {
  element: PresentationElement;
  slideWidth: number;
  slideHeight: number;
  scale: number;
  onPatch: (patch: Partial<PresentationElement>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onLayer: (dir: 'up' | 'down') => void;
  onToggleLock: () => void;
  onOpenCutout: () => void;
  onOpenAnimate: () => void;
  onError: (msg: string) => void;
}

const QUICK_COLORS = ['#7D1935', '#2563EB', '#F59E0B', '#EC4899', '#10B981', '#111827', '#FFFFFF'];

export function FloatingElementToolbar({
  element,
  slideWidth,
  slideHeight,
  scale,
  onPatch,
  onDuplicate,
  onDelete,
  onLayer,
  onToggleLock,
  onOpenCutout,
  onOpenAnimate,
  onError,
}: FloatingElementToolbarProps) {
  const stageW = slideWidth * scale;
  const stageH = slideHeight * scale;
  const centerX = (element.x + element.width / 2) * scale;
  const topY = element.y * scale;
  const bottomY = (element.y + element.height) * scale;

  // Place above element if space permits, else below element; clamp horizontally
  const placeBelow = topY < 56 && bottomY + 52 < stageH;
  const yPx = placeBelow ? Math.min(stageH - 44, bottomY + 10) : Math.max(8, topY - 48);
  const xPx = Math.max(150, Math.min(stageW - 150, centerX));

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

  return (
    <div
      role="toolbar"
      aria-label="Quick element actions"
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute z-40 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-strong)] shadow-[var(--shadow-float)] text-xs whitespace-nowrap max-w-[96%] overflow-x-auto"
      style={{ left: `${xPx}px`, top: `${yPx}px` }}
    >
      {/* Image Quick Controls */}
      {element.type === 'image' && (
        <>
          <label className="px-2 py-1 rounded-lg hover:bg-[var(--bg-subtle)] font-medium inline-flex items-center gap-1 cursor-pointer text-[var(--text-primary)]">
            <ImagePlus className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Replace</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const form = new FormData();
                  form.append('file', file);
                  const res = await apiFetch<{ publicUrl: string }>('/api/uploads', {
                    method: 'POST',
                    body: form,
                  });
                  onPatch({ src: res.publicUrl, originalSrc: res.publicUrl, cutoutMode: 'none', alt: file.name } as any);
                } catch (err: any) {
                  onError(err.message || 'Image replace failed.');
                } finally {
                  e.target.value = '';
                }
              }}
            />
          </label>
          <button
            type="button"
            onClick={onOpenCutout}
            className="px-2 py-1 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] font-semibold inline-flex items-center gap-1 hover:opacity-90"
          >
            <Scissors className="w-3.5 h-3.5" /> Cutout BG
          </button>
          <button
            type="button"
            onClick={() => onPatch({ objectFit: element.objectFit === 'cover' ? 'contain' : 'cover' } as any)}
            className="px-2 py-1 rounded-lg hover:bg-[var(--bg-subtle)] inline-flex items-center gap-1"
            title="Toggle Cover / Contain"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{element.objectFit === 'cover' ? 'Cover' : 'Contain'}</span>
          </button>
          <span className="w-px h-4 bg-[var(--border-hairline)] mx-0.5" />
        </>
      )}

      {/* Text Quick Controls */}
      {element.type === 'text' && (
        <>
          <button
            type="button"
            aria-label="Decrease font size"
            onClick={() => onPatch({ fontSize: Math.max(10, element.fontSize - 4) } as any)}
            className="px-1.5 py-1 rounded-lg hover:bg-[var(--bg-subtle)] font-mono-tabular font-semibold"
          >
            A-
          </button>
          <span className="font-mono-tabular text-[11px] px-1">{Math.round(element.fontSize)}</span>
          <button
            type="button"
            aria-label="Increase font size"
            onClick={() => onPatch({ fontSize: Math.min(160, element.fontSize + 4) } as any)}
            className="px-1.5 py-1 rounded-lg hover:bg-[var(--bg-subtle)] font-mono-tabular font-semibold"
          >
            A+
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
            className={`px-2 py-1 rounded-lg text-[11px] font-medium ${
              element.textShadow ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'hover:bg-[var(--bg-subtle)]'
            }`}
          >
            Outline
          </button>
          <span className="w-px h-4 bg-[var(--border-hairline)] mx-0.5" />
        </>
      )}

      {/* Quick Color Swatches for Colorable Elements */}
      {(element.type === 'text' ||
        element.type === 'shape' ||
        element.type === 'icon' ||
        element.type === 'custom') && (
        <>
          <div className="flex items-center gap-1 px-1">
            {QUICK_COLORS.slice(0, 5).map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={`Color ${hex}`}
                onClick={() => applyQuickColor(hex)}
                className={`w-4 h-4 rounded-full border ${
                  currentColor.toLowerCase() === hex.toLowerCase()
                    ? 'ring-2 ring-[var(--accent)] ring-offset-1 border-white'
                    : 'border-black/20'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          <span className="w-px h-4 bg-[var(--border-hairline)] mx-0.5" />
        </>
      )}

      <button
        type="button"
        onClick={onOpenAnimate}
        className="px-2 py-1 rounded-lg hover:bg-[var(--bg-subtle)] inline-flex items-center gap-1 font-medium"
        title="Animate element"
      >
        <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
        <span>Animate</span>
      </button>

      <button
        type="button"
        aria-label="Rotate 15 degrees"
        onClick={() => onPatch({ rotation: ((element.rotation || 0) + 15) % 360 })}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)]"
        title="Rotate +15°"
      >
        <RotateCw className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        aria-label="Bring forward"
        onClick={() => onLayer('up')}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)]"
        title="Bring forward"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        aria-label="Send backward"
        onClick={() => onLayer('down')}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)]"
        title="Send backward"
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        aria-label="Duplicate selected element"
        onClick={onDuplicate}
        className="px-2 py-1 rounded-lg hover:bg-[var(--bg-subtle)] inline-flex items-center gap-1 font-medium"
        title="Duplicate"
      >
        <Copy className="w-3.5 h-3.5" />
        <span>Duplicate</span>
      </button>

      <button
        type="button"
        aria-label={element.locked ? 'Unlock element' : 'Lock element'}
        onClick={onToggleLock}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)]"
        title={element.locked ? 'Unlock' : 'Lock'}
      >
        {element.locked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5" />}
      </button>

      <button
        type="button"
        aria-label="Delete selected element"
        onClick={onDelete}
        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
