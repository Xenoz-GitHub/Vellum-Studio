import React, { useEffect, useRef, useState } from 'react';
import {
  Eraser,
  Paintbrush,
  RotateCcw,
  Scissors,
  Sparkles,
  Upload,
  Wand2,
  X,
} from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface ImageCutoutModalProps {
  isOpen: boolean;
  initialSrc?: string;
  initialOriginalSrc?: string;
  title?: string;
  onClose: () => void;
  onComplete: (publicUrl: string, meta: { originalSrc?: string; cutoutMode: 'auto' | 'manual'; alt?: string }) => void;
}

const MAX_DIM = 720;

export function ImageCutoutModal({
  isOpen,
  initialSrc,
  initialOriginalSrc,
  title = 'Upload & Cutout Studio',
  onClose,
  onComplete,
}: ImageCutoutModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const origCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskHistoryRef = useRef<ImageData[]>([]);
  const drawingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);

  const [sourceUrl, setSourceUrl] = useState<string>(initialOriginalSrc || initialSrc || '');
  const [fileName, setFileName] = useState<string>('cutout-element.png');
  const [hasImage, setHasImage] = useState(false);
  const [imgDims, setImgDims] = useState({ w: 0, h: 0 });

  const [toolMode, setToolMode] = useState<'auto' | 'erase' | 'keep'>('auto');
  const [pickedRgb, setPickedRgb] = useState<{ r: number; g: number; b: number }>({ r: 255, g: 255, b: 255 });
  const [tolerance, setTolerance] = useState(38);
  const [feather, setFeather] = useState(2);
  const [connectedOnly, setConnectedOnly] = useState(true);
  const [brushSize, setBrushSize] = useState(24);
  const [stickerBorder, setStickerBorder] = useState(0);
  const [cutoutUsedMode, setCutoutUsedMode] = useState<'auto' | 'manual'>('auto');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const target = initialOriginalSrc || initialSrc || '';
    setSourceUrl(target);
    setError(null);
    maskHistoryRef.current = [];
    if (target) {
      loadImageOntoCanvases(target);
    } else {
      setHasImage(false);
    }
  }, [isOpen, initialSrc, initialOriginalSrc]);

  const loadImageOntoCanvases = (src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
      const w = Math.max(16, Math.round(img.width * scale));
      const h = Math.max(16, Math.round(img.height * scale));
      setImgDims({ w, h });

      const orig = document.createElement('canvas');
      orig.width = w;
      orig.height = h;
      const oCtx = orig.getContext('2d');
      oCtx?.drawImage(img, 0, 0, w, h);
      origCanvasRef.current = orig;

      const vis = canvasRef.current;
      if (vis) {
        vis.width = w;
        vis.height = h;
        const vCtx = vis.getContext('2d');
        vCtx?.clearRect(0, 0, w, h);
        vCtx?.drawImage(orig, 0, 0);
        // Sample corner pixel for one-click auto removal
        const px = oCtx?.getImageData(1, 1, 1, 1).data;
        if (px) {
          setPickedRgb({ r: px[0], g: px[1], b: px[2] });
        }
      }
      maskHistoryRef.current = [];
      setHasImage(true);
    };
    img.onerror = () => {
      setError('Could not load image into Cutout Lab (try uploading directly from your device).');
      setHasImage(false);
    };
    img.src = src;
  };

  const pushHistorySnapshot = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, c.width, c.height);
    maskHistoryRef.current = [...maskHistoryRef.current.slice(-14), snap];
  };

  const handleUndo = () => {
    const c = canvasRef.current;
    const prev = maskHistoryRef.current.pop();
    if (!c || !prev) return;
    const ctx = c.getContext('2d');
    ctx?.putImageData(prev, 0, 0);
  };

  const handleResetOriginal = () => {
    const c = canvasRef.current;
    const orig = origCanvasRef.current;
    if (!c || !orig) return;
    pushHistorySnapshot();
    const ctx = c.getContext('2d');
    ctx?.clearRect(0, 0, c.width, c.height);
    ctx?.drawImage(orig, 0, 0);
  };

  const runAutoCutout = (targetRgb = pickedRgb, seedPt?: { x: number; y: number }) => {
    const c = canvasRef.current;
    const orig = origCanvasRef.current;
    if (!c || !orig) return;
    const ctx = c.getContext('2d');
    const oCtx = orig.getContext('2d');
    if (!ctx || !oCtx) return;

    pushHistorySnapshot();
    const w = c.width;
    const h = c.height;
    const srcData = oCtx.getImageData(0, 0, w, h);
    const outData = ctx.getImageData(0, 0, w, h);
    const s = srcData.data;
    const d = outData.data;
    // Restore original RGB first
    for (let i = 0; i < s.length; i++) d[i] = s[i];

    const maxDist = tolerance * 1.75;
    const softBand = Math.max(4, feather * 12);

    const colorDist = (idx: number) => {
      const dr = s[idx] - targetRgb.r;
      const dg = s[idx + 1] - targetRgb.g;
      const db = s[idx + 2] - targetRgb.b;
      return Math.sqrt(dr * dr + dg * dg + db * db);
    };

    if (connectedOnly) {
      const visited = new Uint8Array(w * h);
      const queue = new Int32Array(w * h);
      let head = 0;
      let tail = 0;

      const enqueue = (px: number, py: number) => {
        if (px < 0 || py < 0 || px >= w || py >= h) return;
        const pos = py * w + px;
        if (visited[pos]) return;
        const dist = colorDist(pos * 4);
        if (dist <= maxDist) {
          visited[pos] = 1;
          queue[tail++] = pos;
        }
      };

      if (seedPt) {
        enqueue(seedPt.x, seedPt.y);
      } else {
        // Seed all 4 edges for background flood-fill
        for (let x = 0; x < w; x += 2) {
          enqueue(x, 0);
          enqueue(x, h - 1);
        }
        for (let y = 0; y < h; y += 2) {
          enqueue(0, y);
          enqueue(w - 1, y);
        }
      }

      while (head < tail) {
        const pos = queue[head++];
        const px = pos % w;
        const py = (pos - px) / w;
        const dist = colorDist(pos * 4);
        if (dist <= maxDist - softBand) {
          d[pos * 4 + 3] = 0;
        } else {
          const ratio = (dist - (maxDist - softBand)) / softBand;
          d[pos * 4 + 3] = Math.min(d[pos * 4 + 3], Math.round(ratio * 255));
        }
        enqueue(px + 1, py);
        enqueue(px - 1, py);
        enqueue(px, py + 1);
        enqueue(px, py - 1);
      }
    } else {
      for (let i = 0; i < w * h; i++) {
        const idx = i * 4;
        const dist = colorDist(idx);
        if (dist <= maxDist - softBand) {
          d[idx + 3] = 0;
        } else if (dist <= maxDist) {
          const ratio = (dist - (maxDist - softBand)) / softBand;
          d[idx + 3] = Math.min(d[idx + 3], Math.round(ratio * 255));
        }
      }
    }

    ctx.putImageData(outData, 0, 0);
    setCutoutUsedMode('auto');
  };

  const getCanvasPt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const rect = c.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * c.width);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * c.height);
    return {
      x: Math.max(0, Math.min(c.width - 1, x)),
      y: Math.max(0, Math.min(c.height - 1, y)),
    };
  };

  const paintBrushStroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const c = canvasRef.current;
    const orig = origCanvasRef.current;
    if (!c || !orig) return;
    const ctx = c.getContext('2d');
    const oCtx = orig.getContext('2d');
    if (!ctx || !oCtx) return;

    const r = Math.max(2, Math.round(brushSize / 2));
    const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / Math.max(2, r * 0.3)));

    if (toolMode === 'erase') {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
      for (let i = 0; i <= steps; i++) {
        const px = from.x + ((to.x - from.x) * i) / steps;
        const py = from.y + ((to.y - from.y) * i) / steps;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (toolMode === 'keep') {
      ctx.save();
      for (let i = 0; i <= steps; i++) {
        const px = from.x + ((to.x - from.x) * i) / steps;
        const py = from.y + ((to.y - from.y) * i) / steps;
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(orig, 0, 0);
        ctx.restore();
      }
      ctx.restore();
    }
    setCutoutUsedMode('manual');
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!hasImage) return;
    const pt = getCanvasPt(e);
    if (toolMode === 'auto') {
      const oCtx = origCanvasRef.current?.getContext('2d');
      if (!oCtx) return;
      const px = oCtx.getImageData(pt.x, pt.y, 1, 1).data;
      const nextRgb = { r: px[0], g: px[1], b: px[2] };
      setPickedRgb(nextRgb);
      runAutoCutout(nextRgb, pt);
      return;
    }
    pushHistorySnapshot();
    drawingRef.current = true;
    lastPtRef.current = pt;
    paintBrushStroke(pt, pt);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || toolMode === 'auto' || !lastPtRef.current) return;
    const pt = getCanvasPt(e);
    paintBrushStroke(lastPtRef.current, pt);
    lastPtRef.current = pt;
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
    lastPtRef.current = null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.replace(/\.[^.]+$/, '') + '-cutout.png');
    setError(null);
    const localUrl = URL.createObjectURL(file);
    loadImageOntoCanvases(localUrl);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiFetch<{ publicUrl: string }>('/api/uploads', { method: 'POST', body: form });
      setSourceUrl(res.publicUrl);
    } catch {
      // Keep local object URL for cutout editing; final PNG will upload cleanly
    } finally {
      e.target.value = '';
    }
  };

  const handleExportCutout = async () => {
    const c = canvasRef.current;
    if (!c || !hasImage) return;
    setSaving(true);
    setError(null);
    try {
      const exportCanvas = document.createElement('canvas');
      const pad = stickerBorder > 0 ? stickerBorder * 2 : 0;
      exportCanvas.width = c.width + pad * 2;
      exportCanvas.height = c.height + pad * 2;
      const eCtx = exportCanvas.getContext('2d');
      if (!eCtx) throw new Error('Canvas 2D context unavailable');

      if (stickerBorder > 0) {
        // Die-cut white sticker silhouette outline using crisp radial stamps
        const sil = document.createElement('canvas');
        sil.width = c.width;
        sil.height = c.height;
        const sCtx = sil.getContext('2d');
        if (sCtx) {
          sCtx.drawImage(c, 0, 0);
          sCtx.globalCompositeOperation = 'source-in';
          sCtx.fillStyle = '#FFFFFF';
          sCtx.fillRect(0, 0, c.width, c.height);
          const steps = 16;
          for (let i = 0; i < steps; i++) {
            const ang = (i / steps) * Math.PI * 2;
            eCtx.drawImage(
              sil,
              pad + Math.cos(ang) * stickerBorder,
              pad + Math.sin(ang) * stickerBorder
            );
          }
        }
      }
      eCtx.drawImage(c, pad, pad);

      const blob = await new Promise<Blob>((resolve, reject) => {
        exportCanvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to encode PNG'))), 'image/png');
      });
      const form = new FormData();
      form.append('file', new File([blob], fileName, { type: 'image/png' }));
      const res = await apiFetch<{ publicUrl: string }>('/api/uploads', { method: 'POST', body: form });
      onComplete(res.publicUrl, {
        originalSrc: sourceUrl || undefined,
        cutoutMode: cutoutUsedMode,
        alt: fileName,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Could not save cutout image.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[var(--shadow-float)]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[var(--border-hairline)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base">{title}</h2>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Auto Background Removal or Manual Shade Brush · Exports transparent PNG for Slide &amp; PowerPoint
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close cutout studio"
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 grid md:grid-cols-[1fr_290px] min-h-0 overflow-hidden">
          {/* Interactive Checkerboard Canvas Stage */}
          <div
            className="relative flex flex-col items-center justify-center p-5 overflow-auto min-h-[340px]"
            style={{
              backgroundColor: '#E5E7EB',
              backgroundImage:
                'linear-gradient(45deg, #CBD5E1 25%, transparent 25%), linear-gradient(-45deg, #CBD5E1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #CBD5E1 75%), linear-gradient(-45deg, transparent 75%, #CBD5E1 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
            }}
          >
            {!hasImage ? (
              <label className="cursor-pointer bg-[var(--bg-surface)] border-2 border-dashed border-[var(--accent)] rounded-2xl p-8 text-center max-w-sm space-y-3 shadow-md hover:scale-[1.01] transition-transform">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="font-display font-bold text-base text-[var(--text-primary)]">
                  Upload Photo to Cut Out
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  PNG, JPG, or WebP. Remove any solid or studio backdrop automatically or paint manual masks.
                </p>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold">
                  Choose Image File
                </span>
                <input type="file" accept="image/*" onChange={handleFileSelect} className="sr-only" />
              </label>
            ) : (
              <div className="relative flex flex-col items-center gap-2">
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  className="max-w-full max-h-[54vh] rounded-lg shadow-lg touch-none"
                  style={{
                    cursor: toolMode === 'auto' ? 'crosshair' : 'cell',
                    outline: stickerBorder > 0 ? `${Math.min(6, stickerBorder)}px solid rgba(255,255,255,0.85)` : undefined,
                  }}
                />
                <div className="px-3 py-1 rounded-full bg-black/75 text-white text-[11px] font-mono-tabular">
                  {toolMode === 'auto'
                    ? 'Click anywhere on the background color to remove it'
                    : toolMode === 'erase'
                    ? `Drag to erase background (${brushSize}px)`
                    : `Drag to restore foreground (${brushSize}px)`}
                </div>
              </div>
            )}
          </div>

          {/* Controls Sidebar */}
          <div className="border-t md:border-t-0 md:border-l border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 overflow-y-auto space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <label className="flex-1 h-9 px-3 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)] inline-flex items-center justify-center gap-1.5 font-medium cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> {hasImage ? 'Swap Photo' : 'Upload Photo'}
                <input type="file" accept="image/*" onChange={handleFileSelect} className="sr-only" />
              </label>
              <button
                type="button"
                onClick={handleUndo}
                disabled={!hasImage}
                className="h-9 px-2.5 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)] disabled:opacity-40"
                title="Undo stroke"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
              <button
                type="button"
                onClick={() => setToolMode('auto')}
                className={`py-2 rounded-md font-medium flex flex-col items-center gap-1 ${
                  toolMode === 'auto'
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto Cut</span>
              </button>
              <button
                type="button"
                onClick={() => setToolMode('erase')}
                className={`py-2 rounded-md font-medium flex flex-col items-center gap-1 ${
                  toolMode === 'erase'
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Shade Erase</span>
              </button>
              <button
                type="button"
                onClick={() => setToolMode('keep')}
                className={`py-2 rounded-md font-medium flex flex-col items-center gap-1 ${
                  toolMode === 'keep'
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>
            </div>

            {toolMode === 'auto' ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Sampled Key Color</span>
                  <span
                    className="w-7 h-7 rounded-md border border-[var(--border-strong)]"
                    style={{ backgroundColor: `rgb(${pickedRgb.r}, ${pickedRgb.g}, ${pickedRgb.b})` }}
                  />
                </div>
                <label className="block">
                  <div className="flex justify-between mb-1">
                    <span className="text-[var(--text-secondary)]">Color Tolerance</span>
                    <span className="font-mono-tabular font-semibold">{tolerance}</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={140}
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                </label>
                <label className="block">
                  <div className="flex justify-between mb-1">
                    <span className="text-[var(--text-secondary)]">Edge Feather</span>
                    <span className="font-mono-tabular font-semibold">{feather}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={8}
                    value={feather}
                    onChange={(e) => setFeather(Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={connectedOnly}
                    onChange={(e) => setConnectedOnly(e.target.checked)}
                    className="accent-[var(--accent)]"
                  />
                  <span>Edge-connected flood fill (protects inner details)</span>
                </label>
                <button
                  type="button"
                  disabled={!hasImage}
                  onClick={() => runAutoCutout()}
                  className="w-full h-9 rounded-lg bg-[var(--accent)] text-white font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Auto Remove Background
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <label className="block">
                  <div className="flex justify-between mb-1">
                    <span className="text-[var(--text-secondary)]">Brush Size</span>
                    <span className="font-mono-tabular font-semibold">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={72}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                </label>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Paint directly over the canvas to refine hair, collars, or shadows cleanly.
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-[var(--border-hairline)] space-y-3">
              <label className="block">
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--text-secondary)]">Die-Cut Sticker Border</span>
                  <span className="font-mono-tabular font-semibold">{stickerBorder}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={14}
                  value={stickerBorder}
                  onChange={(e) => setStickerBorder(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
              </label>

              {hasImage && (
                <button
                  type="button"
                  onClick={handleResetOriginal}
                  className="w-full h-8 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)] text-[11px] font-medium"
                >
                  Restore Original Image ({imgDims.w}×{imgDims.h})
                </button>
              )}
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px]">
                {error}
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 rounded-lg border border-[var(--border-hairline)] font-medium hover:bg-[var(--bg-subtle)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!hasImage || saving}
                onClick={handleExportCutout}
                className="flex-1 h-10 rounded-lg bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-45"
              >
                {saving ? 'Saving PNG...' : 'Apply Cutout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
