import React, { useEffect, useState } from 'react';
import { ArrowLeftRight, BookOpen, Check, Maximize, Ruler, X } from 'lucide-react';
import type { AspectRatio, PresentationDocument } from '../../core/schema';
import { PAGE_MARGIN_PRESETS, PAGE_SIZE_PRESETS } from '../../core/data-presets';

interface PageSetupModalProps {
  isOpen: boolean;
  doc: PresentationDocument;
  onClose: () => void;
  onApplyResize: (
    width: number,
    height: number,
    aspectRatio: AspectRatio,
    scaleElements: boolean
  ) => void;
  onUpdateMargin: (margin: number, showMargins: boolean) => void;
  onOpenBookPreview?: () => void;
}

export function PageSetupModal({
  isOpen,
  doc,
  onClose,
  onApplyResize,
  onUpdateMargin,
  onOpenBookPreview,
}: PageSetupModalProps) {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(doc.aspectRatio);
  const [customW, setCustomW] = useState<number>(doc.width);
  const [customH, setCustomH] = useState<number>(doc.height);
  const [scaleElements, setScaleElements] = useState<boolean>(true);
  const [marginVal, setMarginVal] = useState<number>(
    doc.pageMargin ?? doc.tokens.spacing.slidePadding ?? 48
  );
  const [showMargins, setShowMargins] = useState<boolean>(Boolean(doc.showMargins));

  useEffect(() => {
    if (isOpen) {
      setSelectedRatio(doc.aspectRatio);
      setCustomW(doc.width);
      setCustomH(doc.height);
      setMarginVal(doc.pageMargin ?? doc.tokens.spacing.slidePadding ?? 48);
      setShowMargins(Boolean(doc.showMargins));
    }
  }, [isOpen, doc.aspectRatio, doc.width, doc.height, doc.pageMargin, doc.showMargins]);

  if (!isOpen) return null;

  const categories: Array<'Presentation' | 'Social Media' | 'Print & Document' | 'Interactive Book'> = [
    'Presentation',
    'Social Media',
    'Print & Document',
    'Interactive Book',
  ];

  const handleSelectPreset = (presetId: AspectRatio, w: number, h: number) => {
    setSelectedRatio(presetId);
    setCustomW(w);
    setCustomH(h);
  };

  const handleSwapOrientation = () => {
    setCustomW(customH);
    setCustomH(customW);
    setSelectedRatio((cur) => (cur === '16:9' ? '9:16' : cur === '9:16' ? '16:9' : cur));
  };

  const handleApplyAll = () => {
    const clampedW = Math.max(240, Math.min(3200, Number(customW) || 1280));
    const clampedH = Math.max(240, Math.min(3200, Number(customH) || 720));
    if (clampedW !== doc.width || clampedH !== doc.height || selectedRatio !== doc.aspectRatio) {
      onApplyResize(clampedW, clampedH, selectedRatio, scaleElements);
    }
    onUpdateMargin(marginVal, showMargins);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Page Size and Margins"
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
              <Maximize className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold leading-tight">Page Size &amp; Margins</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Resize for slides, social media, print (A4, Letter, A5), or animated Book Flip
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close page setup"
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presets by Category */}
        <div className="space-y-4">
          {categories.map((cat) => {
            const list = PAGE_SIZE_PRESETS.filter((p) => p.category === cat);
            return (
              <div key={cat} className="space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {cat}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {list.map((p) => {
                    const active =
                      selectedRatio === p.id &&
                      Math.abs(customW - p.width) <= 2 &&
                      Math.abs(customH - p.height) <= 2;
                    const boxMax = 26;
                    const ratioScale = Math.min(boxMax / p.width, boxMax / p.height);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPreset(p.id, p.width, p.height)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                          active
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                            : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                          <div
                            className={`rounded-xs border-2 ${
                              active ? 'border-[var(--accent)] bg-white' : 'border-[var(--text-muted)] bg-[var(--bg-surface)]'
                            }`}
                            style={{
                              width: `${Math.max(10, Math.round(p.width * ratioScale))}px`,
                              height: `${Math.max(10, Math.round(p.height * ratioScale))}px`,
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold truncate">{p.label}</span>
                            {p.badge && (
                              <span className="px-1.5 py-0.5 rounded bg-[var(--accent)] text-white text-[9px] font-semibold shrink-0">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--text-secondary)] truncate">
                            {p.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Size Controls */}
        <div className="p-4 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Custom Dimensions (px)</span>
            <button
              type="button"
              onClick={handleSwapOrientation}
              className="px-2.5 py-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--accent)] text-[11px] font-medium inline-flex items-center gap-1.5"
            >
              <ArrowLeftRight className="w-3 h-3" /> Swap Portrait / Landscape
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Width (px)</span>
              <input
                type="number"
                min={240}
                max={3200}
                value={customW}
                onChange={(e) => {
                  setCustomW(Number(e.target.value));
                  setSelectedRatio('custom');
                }}
                className="w-full h-9 px-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-xs font-mono-tabular"
              />
            </label>
            <label className="block">
              <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Height (px)</span>
              <input
                type="number"
                min={240}
                max={3200}
                value={customH}
                onChange={(e) => {
                  setCustomH(Number(e.target.value));
                  setSelectedRatio('custom');
                }}
                className="w-full h-9 px-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-xs font-mono-tabular"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-xs cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={scaleElements}
              onChange={(e) => setScaleElements(e.target.checked)}
              className="rounded accent-[var(--accent)]"
            />
            <span>Scale &amp; reposition existing elements proportionally to fit new size</span>
          </label>
        </div>

        {/* Page Margins & Guides */}
        <div className="p-4 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-[var(--accent)]" /> Page Margin &amp; Guides
            </span>
            <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={showMargins}
                onChange={(e) => setShowMargins(e.target.checked)}
                className="rounded accent-[var(--accent)]"
              />
              <span>Show Margin Guides</span>
            </label>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {PAGE_MARGIN_PRESETS.map((mp) => (
              <button
                key={mp.label}
                type="button"
                onClick={() => {
                  setMarginVal(mp.value);
                  if (mp.value > 0) setShowMargins(true);
                }}
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium ${
                  marginVal === mp.value
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--accent)]'
                }`}
              >
                {mp.label} ({mp.value}px)
              </button>
            ))}
          </div>

          <label className="block">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
              <span>Custom Margin Inset</span>
              <span className="font-mono-tabular font-semibold">{marginVal}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={140}
              step={4}
              value={marginVal}
              onChange={(e) => {
                setMarginVal(Number(e.target.value));
                if (Number(e.target.value) > 0) setShowMargins(true);
              }}
              className="w-full accent-[var(--accent)]"
            />
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-hairline)]">
          {onOpenBookPreview && (
            <button
              type="button"
              onClick={() => {
                handleApplyAll();
                onOpenBookPreview();
              }}
              className="px-3.5 py-2 min-h-[40px] rounded-xl border border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]/50 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[var(--accent-soft)]"
            >
              <BookOpen className="w-4 h-4" /> Preview Animated Book Flip
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 min-h-[40px] rounded-xl border border-[var(--border-hairline)] text-xs font-medium hover:bg-[var(--bg-subtle)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyAll}
              className="px-4 py-2 min-h-[40px] rounded-xl bg-[var(--accent)] text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[var(--accent-hover)]"
            >
              <Check className="w-4 h-4" /> Apply Page Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
