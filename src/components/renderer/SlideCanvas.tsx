import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import type {
  ChartElement,
  DesignTokens,
  ImageElement,
  PresentationElement,
  Slide,
} from '../../core/schema';
import {
  buildImageFilterCss,
  clamp,
  computeCropBoxLayout,
  isPointInElement,
  normalizeAngleDeg,
} from '../../core/crop-utils';
import { ICON_CATALOG, renderIconSvgString, renderShapeSvgString } from '../../core/svg-cutout-renderer';
import { getRansomTileStyle } from '../../core/text-effects';
import { CustomComponentView } from './CustomComponentView';

interface SlideCanvasProps {
  slide: Slide;
  tokens: DesignTokens;
  width: number;
  height: number;
  scale: number;
  interactive?: boolean;
  animated?: boolean;
  animationKey?: number;
  selectedIds?: string[];
  snapToGrid?: boolean;
  gridSize?: number;
  croppingElementId?: string | null;
  onSelectElements?: (ids: string[]) => void;
  onUpdateElementLive?: (elementId: string, patch: Partial<PresentationElement>) => void;
  onUpdateElementsLiveBatch?: (patches: Record<string, Partial<PresentationElement>>) => void;
  onCommitSnapshot?: () => void;
  onCommitElementPatch?: (elementId: string, patch: Partial<PresentationElement>) => void;
  onEnterCropMode?: (elementId: string) => void;
  onExitCropMode?: () => void;
  onSlotImageIntoFrame?: (imageElementId: string, frameElementId: string) => void;
  onDropImageFile?: (file: File, canvasX: number, canvasY: number, targetFrameId?: string) => void;
  onDropGalleryImage?: (
    payload: { src: string; alt?: string },
    canvasX: number,
    canvasY: number,
    targetFrameId?: string
  ) => void;
  isDrawingFrame?: boolean;
  onCompleteFreedrawFrame?: (points: Array<{ x: number; y: number }>) => void;
  pageMargin?: number;
  showMargins?: boolean;
  backdropRef?: React.RefObject<HTMLElement | null>;
}

function getPatternStyle(
  pattern: Slide['background']['pattern'],
  color: string,
  opacity: number
): React.CSSProperties | null {
  if (!pattern || pattern === 'none') return null;
  if (pattern === 'dots') {
    return {
      backgroundImage: `radial-gradient(${color} 1.35px, transparent 1.35px)`,
      backgroundSize: '26px 26px',
      opacity,
    };
  }
  if (pattern === 'grid') {
    return {
      backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
      backgroundSize: '48px 48px',
      opacity,
    };
  }
  if (pattern === 'editorial-lines') {
    return {
      backgroundImage: `linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
      backgroundSize: '100% 36px',
      opacity,
    };
  }
  if (pattern === 'diagonal') {
    return {
      backgroundImage: `repeating-linear-gradient(135deg, ${color} 0, ${color} 1px, transparent 1px, transparent 22px)`,
      opacity,
    };
  }
  if (pattern === 'noise-mesh') {
    return {
      backgroundImage: `radial-gradient(at 18% 22%, ${color} 0px, transparent 52%), radial-gradient(at 84% 76%, ${color} 0px, transparent 48%)`,
      opacity,
    };
  }
  if (pattern === 'checkerboard') {
    return {
      backgroundImage: `linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(-45deg, ${color} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${color} 75%), linear-gradient(-45deg, transparent 75%, ${color} 75%)`,
      backgroundSize: '64px 64px',
      backgroundPosition: '0 0, 0 32px, 32px -32px, -32px 0',
      opacity,
    };
  }
  return null;
}

function getShadowValue(shadow: PresentationElement['shadow'], accent: string): string | undefined {
  switch (shadow) {
    case 'soft':
      return '0 10px 28px -8px rgba(15, 18, 25, 0.14)';
    case 'elevated':
      return '0 24px 54px -14px rgba(10, 12, 18, 0.34)';
    case 'glow':
      return `0 0 38px -6px ${accent}55, 0 12px 28px -8px rgba(10, 12, 18, 0.25)`;
    default:
      return undefined;
  }
}

function ChartSvg({ element }: { element: ChartElement }) {
  const maxVal = Math.max(1, ...element.data.map((d) => d.value));
  const total = Math.max(1, element.data.reduce((a, b) => a + b.value, 0));

  return (
    <div
      className="w-full h-full p-5 flex flex-col justify-between"
      style={{
        backgroundColor: element.surfaceColor || '#FFFFFF',
        border: '1px solid rgba(25,27,31,0.1)',
        borderRadius: '8px',
        color: element.textColor,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold truncate">{element.title}</span>
        <span className="text-[11px] opacity-60 tabular-nums font-mono shrink-0 ml-2">
          {element.chartKind.toUpperCase()}
        </span>
      </div>

      {element.chartKind === 'pie' || element.chartKind === 'donut' ? (
        <div className="flex items-center justify-around flex-1 gap-4 min-h-0">
          <svg viewBox="0 0 120 120" className="w-36 h-36 shrink-0">
            {(() => {
              let acc = 0;
              return element.data.map((d, i) => {
                const startAngle = (acc / total) * Math.PI * 2 - Math.PI / 2;
                acc += d.value;
                const endAngle = (acc / total) * Math.PI * 2 - Math.PI / 2;
                const x1 = 60 + 50 * Math.cos(startAngle);
                const y1 = 60 + 50 * Math.sin(startAngle);
                const x2 = 60 + 50 * Math.cos(endAngle);
                const y2 = 60 + 50 * Math.sin(endAngle);
                const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
                return (
                  <path
                    key={i}
                    d={`M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={d.color || element.accentColor}
                    opacity={0.94 - i * 0.1}
                  />
                );
              });
            })()}
            {element.chartKind === 'donut' && (
              <>
                <circle cx="60" cy="60" r="28" fill={element.surfaceColor || '#FFFFFF'} />
                <text
                  x="60"
                  y="58"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill={element.textColor}
                >
                  {total}
                </text>
                <text
                  x="60"
                  y="71"
                  textAnchor="middle"
                  fontSize="8"
                  fill={element.textColor}
                  opacity="0.65"
                >
                  TOTAL
                </text>
              </>
            )}
          </svg>
          {(element.showLegend || element.showValues) && (
            <div className="space-y-1.5 text-xs">
              {element.data.map((d, i) => (
                <div key={i} className="flex items-center gap-2 tabular-nums">
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: d.color || element.accentColor }}
                  />
                  <span className="font-medium">{d.label}</span>
                  {element.showValues && <span className="opacity-70">{d.value}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : element.chartKind === 'line' || element.chartKind === 'area' ? (
        <div className="flex-1 flex flex-col justify-end min-h-0">
          <svg viewBox="0 0 400 180" className="w-full h-full overflow-visible">
            <line x1="20" y1="150" x2="380" y2="150" stroke="currentColor" strokeOpacity="0.15" />
            {element.chartKind === 'area' && element.data.length > 1 && (
              <polygon
                fill={element.accentColor}
                fillOpacity="0.18"
                points={[
                  '35,150',
                  ...element.data.map((d, idx) => {
                    const x = 35 + (idx * 330) / Math.max(1, element.data.length - 1);
                    const y = 145 - (d.value / maxVal) * 115;
                    return `${x},${y}`;
                  }),
                  `${35 + 330},150`,
                ].join(' ')}
              />
            )}
            <polyline
              fill="none"
              stroke={element.accentColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={element.data
                .map((d, idx) => {
                  const x = 35 + (idx * 330) / Math.max(1, element.data.length - 1);
                  const y = 145 - (d.value / maxVal) * 115;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
            {element.data.map((d, idx) => {
              const x = 35 + (idx * 330) / Math.max(1, element.data.length - 1);
              const y = 145 - (d.value / maxVal) * 115;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="4.5" fill={d.color || element.accentColor} />
                  {element.showValues && (
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor">
                      {d.value}
                    </text>
                  )}
                  <text x={x} y="168" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.72">
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : element.chartKind === 'horizontal-bar' || element.chartKind === 'metric-bars' ? (
        <div className="flex-1 flex flex-col justify-center gap-2.5 min-h-0">
          {element.data.map((d, i) => {
            const pct = Math.max(6, Math.round((d.value / maxVal) * 100));
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs tabular-nums">
                  <span className="font-medium truncate">{d.label}</span>
                  {element.showValues && <span className="font-semibold">{d.value}</span>}
                </div>
                <div
                  className="w-full h-3.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'rgba(128,128,128,0.14)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: d.color || element.accentColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-end gap-4 pt-4 pb-1 px-2 min-h-0">
          {element.data.map((d, i) => {
            const pct = Math.max(6, Math.round((d.value / maxVal) * 100));
            return (
              <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5">
                {element.showValues && (
                  <span className="text-xs font-semibold tabular-nums">{d.value}</span>
                )}
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${pct}%`,
                    backgroundColor: d.color || element.accentColor,
                  }}
                />
                <span className="text-xs opacity-75 truncate max-w-full">{d.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ImageBox({
  element,
  scale,
  interactive,
  isCropping,
  onCommitSnapshot,
  onUpdateCropLive,
  onNaturalSize,
}: {
  element: ImageElement;
  scale: number;
  interactive: boolean;
  isCropping: boolean;
  onCommitSnapshot?: () => void;
  onUpdateCropLive?: (patch: Partial<ImageElement>) => void;
  onNaturalSize?: (id: string, nat: { w: number; h: number }) => void;
}) {
  const { src, alt, objectFit, borderRadius } = element;
  const cropX = element.cropX ?? 50;
  const cropY = element.cropY ?? 50;
  const cropZoom = element.cropZoom ?? 1;

  const [errored, setErrored] = useState(false);
  const [natSize, setNatSize] = useState<{ w: number; h: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    setErrored(false);
    setNatSize(null);
  }, [src]);

  if (errored || !src) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-neutral-100 text-neutral-500 border border-neutral-200"
        style={{ borderRadius: `${borderRadius}px` }}
      >
        <LucideIcons.Image className="w-7 h-7 mb-1.5 opacity-60" />
        <span className="text-xs font-medium truncate max-w-full">{alt || 'Visual frame'}</span>
      </div>
    );
  }

  const layout = natSize
    ? computeCropBoxLayout(element.width, element.height, natSize.w, natSize.h, objectFit, cropX, cropY, cropZoom)
    : null;
  const filterCss = buildImageFilterCss(element);

  const imgStyle: React.CSSProperties = layout
    ? {
        position: 'absolute',
        left: `${layout.left}px`,
        top: `${layout.top}px`,
        width: `${layout.scaledW}px`,
        height: `${layout.scaledH}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        filter: filterCss,
      }
    : {
        width: '100%',
        height: '100%',
        objectFit,
        objectPosition: `${cropX}% ${cropY}%`,
        transform: cropZoom !== 1 ? `scale(${cropZoom})` : undefined,
        transformOrigin: `${cropX}% ${cropY}%`,
        filter: filterCss,
      };

  const startPan = (e: React.PointerEvent) => {
    if (!isCropping || !interactive) return;
    e.stopPropagation();
    e.preventDefault();

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const origCropX = cropX;
    const origCropY = cropY;
    const rotRad = -((element.rotation || 0) * Math.PI) / 180;
    let moved = false;

    const handleMove = (ev: PointerEvent) => {
      const dxStage = (ev.clientX - startClientX) / scale;
      const dyStage = (ev.clientY - startClientY) / scale;
      const localDx = dxStage * Math.cos(rotRad) - dyStage * Math.sin(rotRad);
      const localDy = dxStage * Math.sin(rotRad) + dyStage * Math.cos(rotRad);

      if (!moved && (Math.abs(localDx) > 1.5 || Math.abs(localDy) > 1.5)) {
        moved = true;
        setIsPanning(true);
        onCommitSnapshot?.();
      }
      if (!moved) return;

      let nextX = origCropX;
      let nextY = origCropY;

      if (layout) {
        if (Math.abs(layout.slackX) > 0.5) {
          nextX = clamp(origCropX + (localDx / layout.slackX) * 100, 0, 100);
        }
        if (Math.abs(layout.slackY) > 0.5) {
          nextY = clamp(origCropY + (localDy / layout.slackY) * 100, 0, 100);
        }
      } else {
        nextX = clamp(origCropX - (localDx / Math.max(40, element.width)) * 100, 0, 100);
        nextY = clamp(origCropY - (localDy / Math.max(40, element.height)) * 100, 0, 100);
      }

      onUpdateCropLive?.({
        cropX: Number(nextX.toFixed(2)),
        cropY: Number(nextY.toFixed(2)),
      });
    };

    const handleUp = () => {
      setIsPanning(false);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  return (
    <div className="relative w-full h-full">
      {/* Ghosted uncropped image preview behind crop frame */}
      {isCropping && layout && (
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="select-none pointer-events-none"
            style={{
              ...imgStyle,
              opacity: 0.34,
            }}
          />
        </div>
      )}

      {/* Clipped Crop Frame */}
      <div
        onPointerDown={startPan}
        className={`relative w-full h-full overflow-hidden ${
          isCropping ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
        }`}
        style={{ borderRadius: `${borderRadius}px` }}
      >
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onLoad={(e) => {
            const t = e.currentTarget;
            if (t.naturalWidth && t.naturalHeight) {
              const nat = { w: t.naturalWidth, h: t.naturalHeight };
              setNatSize(nat);
              onNaturalSize?.(element.id, nat);
            }
          }}
          onError={() => setErrored(true)}
          className="block select-none pointer-events-none"
          style={imgStyle}
        />

        {/* Crop Mode Rule-of-Thirds Gridlines */}
        {isCropping && (
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-y-0 left-1/3 w-px bg-white/60 shadow-xs" />
            <div className="absolute inset-y-0 left-2/3 w-px bg-white/60 shadow-xs" />
            <div className="absolute inset-x-0 top-1/3 h-px bg-white/60 shadow-xs" />
            <div className="absolute inset-x-0 top-2/3 h-px bg-white/60 shadow-xs" />
          </div>
        )}
      </div>
    </div>
  );
}

export function SlideCanvas({
  slide,
  tokens,
  width,
  height,
  scale,
  interactive = false,
  animated,
  animationKey = 0,
  selectedIds = [],
  snapToGrid = true,
  gridSize = 16,
  croppingElementId = null,
  onSelectElements,
  onUpdateElementLive,
  onUpdateElementsLiveBatch,
  onCommitSnapshot,
  onCommitElementPatch,
  onEnterCropMode,
  onExitCropMode,
  onSlotImageIntoFrame,
  onDropImageFile,
  onDropGalleryImage,
  isDrawingFrame = false,
  onCompleteFreedrawFrame,
  pageMargin = 0,
  showMargins = false,
  backdropRef,
}: SlideCanvasProps) {
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [guides, setGuides] = useState<{ x?: number; y?: number }>({});
  const [dropTargetFrameId, setDropTargetFrameId] = useState<string | null>(null);
  const [isStageFileDrag, setIsStageFileDrag] = useState(false);
  const [rotatingState, setRotatingState] = useState<{ id: string; deg: number; snapped: boolean } | null>(null);
  const [freedrawPoints, setFreedrawPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [marqueeRect, setMarqueeRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [touchMarqueeActive, setTouchMarqueeActive] = useState(false);

  useEffect(() => {
    if (!isDrawingFrame) setFreedrawPoints([]);
  }, [isDrawingFrame]);

  const dragRef = useRef<{ active: boolean }>({ active: false });
  const stageRef = useRef<HTMLDivElement>(null);
  const selOverlayRef = useRef<HTMLDivElement>(null);
  const imageNatMapRef = useRef<Map<string, { w: number; h: number }>>(new Map());

  const shouldAnimate = animated ?? scale >= 0.2;
  const sortedElements = [...slide.elements].filter((e) => e.visible).sort((a, b) => a.zIndex - b.zIndex);

  const snap = (val: number) => (snapToGrid ? Math.round(val / gridSize) * gridSize : Math.round(val));

  const clientToCanvas = (clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return { cx: width / 2, cy: height / 2 };
    return {
      cx: (clientX - rect.left) / scale,
      cy: (clientY - rect.top) / scale,
    };
  };

  const findTvFrameAtCanvasPoint = (cx: number, cy: number, excludeId?: string) => {
    const candidates = [...sortedElements].reverse();
    return (
      candidates.find(
        (candidate) =>
          candidate.id !== excludeId &&
          !candidate.locked &&
          candidate.type === 'custom' &&
          (candidate.componentKey === 'retro-tv-frame' || candidate.componentKey === 'photo-frame') &&
          isPointInElement(cx, cy, candidate, 12)
      ) || null
    );
  };

  const resolveSelectionIdsForElement = (el: PresentationElement, shiftKey: boolean, altKey: boolean): string[] => {
    const memberIds =
      el.groupId && !altKey
        ? sortedElements.filter((cand) => cand.groupId === el.groupId).map((cand) => cand.id)
        : [el.id];

    if (shiftKey) {
      const current = new Set(selectedIds);
      const allSelected = memberIds.every((id) => current.has(id));
      if (allSelected) {
        memberIds.forEach((id) => current.delete(id));
      } else {
        memberIds.forEach((id) => current.add(id));
      }
      return Array.from(current);
    }

    if (selectedIds.includes(el.id) && selectedIds.length > 1) {
      return selectedIds;
    }
    return memberIds;
  };

  const startDrag = (e: React.PointerEvent, el: PresentationElement) => {
    if (!interactive || editingTextId === el.id || croppingElementId === el.id) return;
    e.stopPropagation();
    if (croppingElementId && croppingElementId !== el.id) {
      onExitCropMode?.();
    }

    const nextSelection = resolveSelectionIdsForElement(el, e.shiftKey, e.altKey);
    onSelectElements?.(nextSelection);

    if (el.locked || e.shiftKey) return;

    const dragIds = nextSelection.length > 0 ? nextSelection : [el.id];
    const dragItems = sortedElements
      .filter((item) => dragIds.includes(item.id) && !item.locked)
      .map((item) => ({ id: item.id, origX: item.x, origY: item.y, width: item.width, height: item.height }));

    if (dragItems.length === 0) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = el.x;
    const origY = el.y;
    let moved = false;
    let activeTargetFrameId: string | null = null;

    const handleMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;
      if (!moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
        moved = true;
        onCommitSnapshot?.();
      }
      if (!moved) return;

      let nextX = snap(origX + dx);
      let nextY = snap(origY + dy);

      // Alignment guides to slide center
      const elCenterX = nextX + el.width / 2;
      const elCenterY = nextY + el.height / 2;
      const nextGuides: { x?: number; y?: number } = {};

      if (Math.abs(elCenterX - width / 2) < 10) {
        nextX = Math.round(width / 2 - el.width / 2);
        nextGuides.x = width / 2;
      }
      if (Math.abs(elCenterY - height / 2) < 10) {
        nextY = Math.round(height / 2 - el.height / 2);
        nextGuides.y = height / 2;
      }
      setGuides(nextGuides);

      const clampedX = Math.max(-el.width + 24, Math.min(width - 24, nextX));
      const clampedY = Math.max(-el.height + 24, Math.min(height - 24, nextY));

      if (dragItems.length > 1 && onUpdateElementsLiveBatch) {
        const appliedDx = clampedX - origX;
        const appliedDy = clampedY - origY;
        const patches: Record<string, Partial<PresentationElement>> = {};
        for (const item of dragItems) {
          patches[item.id] = {
            x: Math.max(-item.width + 24, Math.min(width - 24, Math.round(item.origX + appliedDx))),
            y: Math.max(-item.height + 24, Math.min(height - 24, Math.round(item.origY + appliedDy))),
          };
        }
        onUpdateElementsLiveBatch(patches);
      } else {
        onUpdateElementLive?.(el.id, {
          x: clampedX,
          y: clampedY,
        });
      }

      // Canva-style drop-into-frame hit testing when dragging a single image element
      if (dragItems.length === 1 && el.type === 'image' && onSlotImageIntoFrame) {
        const ptr = clientToCanvas(ev.clientX, ev.clientY);
        const frameByPointer = findTvFrameAtCanvasPoint(ptr.cx, ptr.cy, el.id);
        const frameByCenter = findTvFrameAtCanvasPoint(
          clampedX + el.width / 2,
          clampedY + el.height / 2,
          el.id
        );
        const hitFrame = frameByPointer || frameByCenter;
        activeTargetFrameId = hitFrame ? hitFrame.id : null;
        setDropTargetFrameId(activeTargetFrameId);
      }
    };

    const handleUp = () => {
      dragRef.current.active = false;
      setGuides({});
      setDropTargetFrameId(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);

      if (moved && dragItems.length === 1 && el.type === 'image' && activeTargetFrameId && onSlotImageIntoFrame) {
        onSlotImageIntoFrame(el.id, activeTargetFrameId);
      }
    };

    dragRef.current.active = true;
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const startResize = (
    e: React.PointerEvent,
    el: PresentationElement,
    corner: 'nw' | 'ne' | 'sw' | 'se'
  ) => {
    if (!interactive || el.locked) return;
    e.stopPropagation();
    onCommitSnapshot?.();

    const startX = e.clientX;
    const startY = e.clientY;
    const orig = { x: el.x, y: el.y, w: el.width, h: el.height };

    const handleMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;

      let x = orig.x;
      let y = orig.y;
      let w = orig.w;
      let h = orig.h;

      if (corner.includes('e')) w = Math.max(32, snap(orig.w + dx));
      if (corner.includes('s')) h = Math.max(24, snap(orig.h + dy));
      if (corner.includes('w')) {
        const nextW = Math.max(32, snap(orig.w - dx));
        x = orig.x + (orig.w - nextW);
        w = nextW;
      }
      if (corner.includes('n')) {
        const nextH = Math.max(24, snap(orig.h - dy));
        y = orig.y + (orig.h - nextH);
        h = nextH;
      }

      onUpdateElementLive?.(el.id, { x, y, width: w, height: h });
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const startCropEdgeTrim = (
    e: React.PointerEvent,
    el: ImageElement,
    edge: 'n' | 's' | 'e' | 'w'
  ) => {
    if (!interactive || el.locked) return;
    e.stopPropagation();
    e.preventDefault();
    onCommitSnapshot?.();

    const startX = e.clientX;
    const startY = e.clientY;
    const orig = {
      x: el.x,
      y: el.y,
      w: el.width,
      h: el.height,
      cropX: el.cropX ?? 50,
      cropY: el.cropY ?? 50,
      cropZoom: el.cropZoom ?? 1,
    };

    const nat = imageNatMapRef.current.get(el.id);
    const curLayout = nat
      ? computeCropBoxLayout(orig.w, orig.h, nat.w, nat.h, el.objectFit, orig.cropX, orig.cropY, orig.cropZoom)
      : null;
    const oldImgX = curLayout ? orig.x + curLayout.left : orig.x;
    const oldImgY = curLayout ? orig.y + curLayout.top : orig.y;
    const oldScaledW = curLayout ? curLayout.scaledW : orig.w;

    const rotRad = -((el.rotation || 0) * Math.PI) / 180;

    const handleMove = (ev: PointerEvent) => {
      const dxStage = (ev.clientX - startX) / scale;
      const dyStage = (ev.clientY - startY) / scale;
      const dx = dxStage * Math.cos(rotRad) - dyStage * Math.sin(rotRad);
      const dy = dxStage * Math.sin(rotRad) + dyStage * Math.cos(rotRad);

      let nextX = orig.x;
      let nextY = orig.y;
      let nextW = orig.w;
      let nextH = orig.h;

      if (edge === 'e') nextW = Math.max(40, Math.round(orig.w + dx));
      if (edge === 's') nextH = Math.max(40, Math.round(orig.h + dy));
      if (edge === 'w') {
        const wClamped = Math.max(40, Math.round(orig.w - dx));
        nextX = orig.x + (orig.w - wClamped);
        nextW = wClamped;
      }
      if (edge === 'n') {
        const hClamped = Math.max(40, Math.round(orig.h - dy));
        nextY = orig.y + (orig.h - hClamped);
        nextH = hClamped;
      }

      if (nat && curLayout) {
        const nextBase =
          el.objectFit === 'cover'
            ? Math.max(nextW / nat.w, nextH / nat.h)
            : Math.min(nextW / nat.w, nextH / nat.h);
        const nextZoom = clamp(oldScaledW / (nat.w * nextBase), 1, 4);
        const actualScaledW = nat.w * nextBase * nextZoom;
        const actualScaledH = nat.h * nextBase * nextZoom;
        const slackX = nextW - actualScaledW;
        const slackY = nextH - actualScaledH;
        const targetLeft = oldImgX - nextX;
        const targetTop = oldImgY - nextY;
        const nextCropX = Math.abs(slackX) > 0.5 ? clamp((targetLeft / slackX) * 100, 0, 100) : orig.cropX;
        const nextCropY = Math.abs(slackY) > 0.5 ? clamp((targetTop / slackY) * 100, 0, 100) : orig.cropY;

        onUpdateElementLive?.(el.id, {
          x: nextX,
          y: nextY,
          width: nextW,
          height: nextH,
          cropZoom: Number(nextZoom.toFixed(2)),
          cropX: Number(nextCropX.toFixed(2)),
          cropY: Number(nextCropY.toFixed(2)),
        } as Partial<PresentationElement>);
      } else {
        onUpdateElementLive?.(el.id, {
          x: nextX,
          y: nextY,
          width: nextW,
          height: nextH,
        });
      }
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const startRotate = (e: React.PointerEvent, el: PresentationElement) => {
    if (!interactive || el.locked) return;
    e.stopPropagation();
    e.preventDefault();

    const box = selOverlayRef.current?.getBoundingClientRect();
    const cx = box ? box.left + box.width / 2 : e.clientX;
    const cy = box ? box.top + box.height / 2 : e.clientY - 40;

    let lastAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    let accumDelta = 0;
    const origRot = el.rotation || 0;
    let moved = false;

    setRotatingState({ id: el.id, deg: normalizeAngleDeg(origRot), snapped: false });

    const handleMove = (ev: PointerEvent) => {
      const curAngle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI);
      const step = ((curAngle - lastAngle + 540) % 360) - 180;
      lastAngle = curAngle;
      accumDelta += step;

      if (!moved && Math.abs(accumDelta) > 0.5) {
        moved = true;
        onCommitSnapshot?.();
      }
      if (!moved) return;

      const raw = origRot + accumDelta;
      let finalDeg = normalizeAngleDeg(raw);
      let snapped = false;

      if (ev.shiftKey) {
        finalDeg = normalizeAngleDeg(Math.round(raw / 15) * 15);
        snapped = true;
      } else {
        const cardinals = [-180, -90, 0, 90, 180];
        for (const c of cardinals) {
          if (Math.abs(finalDeg - c) <= 3) {
            finalDeg = c === 180 ? 180 : c;
            snapped = true;
            break;
          }
        }
      }

      setRotatingState({ id: el.id, deg: finalDeg, snapped });
      onUpdateElementLive?.(el.id, { rotation: finalDeg });
    };

    const handleUp = () => {
      setRotatingState(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const handleDragOverStage = (e: React.DragEvent) => {
    if (!interactive) return;
    const types = Array.from(e.dataTransfer.types || []);
    const hasImageDrag =
      types.includes('Files') || types.includes('application/x-vellum-image');
    if (!hasImageDrag) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsStageFileDrag(true);

    const ptr = clientToCanvas(e.clientX, e.clientY);
    const tvHit = findTvFrameAtCanvasPoint(ptr.cx, ptr.cy);
    setDropTargetFrameId(tvHit ? tvHit.id : null);
  };

  const handleDragLeaveStage = (e: React.DragEvent) => {
    if (!interactive) return;
    if (stageRef.current && !stageRef.current.contains(e.relatedTarget as Node)) {
      setIsStageFileDrag(false);
      setDropTargetFrameId(null);
    }
  };

  const handleDropOnStage = (e: React.DragEvent) => {
    if (!interactive) return;
    e.preventDefault();
    setIsStageFileDrag(false);

    const ptr = clientToCanvas(e.clientX, e.clientY);
    const tvHit = findTvFrameAtCanvasPoint(ptr.cx, ptr.cy);
    setDropTargetFrameId(null);

    const galleryRaw = e.dataTransfer.getData('application/x-vellum-image');
    if (galleryRaw && onDropGalleryImage) {
      try {
        const payload = JSON.parse(galleryRaw) as { src: string; alt?: string };
        if (payload?.src) {
          onDropGalleryImage(payload, ptr.cx, ptr.cy, tvHit?.id);
          return;
        }
      } catch {
        // Ignore malformed custom drag payload
      }
    }

    const file = e.dataTransfer.files?.[0];
    if (file && onDropImageFile) {
      onDropImageFile(file, ptr.cx, ptr.cy, tvHit?.id);
    }
  };

  const bgStyle: React.CSSProperties =
    slide.background.type === 'gradient' && slide.background.gradient
      ? { background: slide.background.gradient }
      : { backgroundColor: slide.background.color || tokens.colors.background };

  const patternStyle = getPatternStyle(
    slide.background.pattern,
    slide.background.patternColor || tokens.colors.ink,
    slide.background.patternOpacity ?? 0.16
  );

  const primarySelected =
    interactive && selectedIds.length === 1
      ? sortedElements.find((e) => e.id === selectedIds[0]) || null
      : null;

  const selectedElementsList = interactive
    ? sortedElements.filter((e) => selectedIds.includes(e.id))
    : [];

  const multiBounds =
    selectedElementsList.length > 1
      ? (() => {
          const minX = Math.min(...selectedElementsList.map((e) => e.x));
          const minY = Math.min(...selectedElementsList.map((e) => e.y));
          const maxX = Math.max(...selectedElementsList.map((e) => e.x + e.width));
          const maxY = Math.max(...selectedElementsList.map((e) => e.y + e.height));
          return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
        })()
      : null;

  const beginMarqueeSelection = (
    startClientX: number,
    startClientY: number,
    pointerType: string,
    shiftKey: boolean
  ) => {
    if (!interactive) return;
    setEditingTextId(null);
    if (croppingElementId) onExitCropMode?.();
    if (!shiftKey) onSelectElements?.([]);
    if (isDrawingFrame) return;

    const startCanvas = clientToCanvas(startClientX, startClientY);
    const isTouch = pointerType === 'touch';
    let marqueeActive = false;
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;

    const updateMarqueeSelection = (evClientX: number, evClientY: number) => {
      const curCanvas = clientToCanvas(evClientX, evClientY);
      const minX = Math.min(startCanvas.cx, curCanvas.cx);
      const maxX = Math.max(startCanvas.cx, curCanvas.cx);
      const minY = Math.min(startCanvas.cy, curCanvas.cy);
      const maxY = Math.max(startCanvas.cy, curCanvas.cy);
      setMarqueeRect({ x: minX, y: minY, width: maxX - minX, height: maxY - minY });

      const hitIds = new Set<string>();
      for (const el of sortedElements) {
        const overlaps =
          el.x < maxX && el.x + el.width > minX && el.y < maxY && el.y + el.height > minY;
        if (overlaps) {
          hitIds.add(el.id);
          if (el.groupId) {
            sortedElements.forEach((m) => {
              if (m.groupId === el.groupId) hitIds.add(m.id);
            });
          }
        }
      }
      onSelectElements?.(Array.from(hitIds));
    };

    if (isTouch) {
      longPressTimer = setTimeout(() => {
        marqueeActive = true;
        setTouchMarqueeActive(true);
        try {
          navigator.vibrate?.(18);
        } catch {
          // Ignore environments without vibration API
        }
        setMarqueeRect({ x: startCanvas.cx, y: startCanvas.cy, width: 4, height: 4 });
      }, 360);
    }

    const handleMove = (ev: PointerEvent) => {
      const dist = Math.hypot(ev.clientX - startClientX, ev.clientY - startClientY);
      if (isTouch && !marqueeActive) {
        if (dist > 8 && longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
        return;
      }
      if (!isTouch && !marqueeActive) {
        if (dist > 5) {
          marqueeActive = true;
        } else {
          return;
        }
      }
      if (marqueeActive) {
        updateMarqueeSelection(ev.clientX, ev.clientY);
      }
    };

    const handleUp = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      setTouchMarqueeActive(false);
      setMarqueeRect(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
  };

  const beginMarqueeRef = useRef(beginMarqueeSelection);
  beginMarqueeRef.current = beginMarqueeSelection;

  useEffect(() => {
    const host = backdropRef?.current;
    if (!interactive || !host) return;
    const onBackdropPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (stageRef.current?.contains(target)) return;
      if (target?.closest('button, input, textarea, select, [role="region"], [data-stop-marquee="true"]')) return;
      const rect = host.getBoundingClientRect();
      if (e.clientX > rect.left + host.clientWidth || e.clientY > rect.top + host.clientHeight) return;
      beginMarqueeRef.current(e.clientX, e.clientY, e.pointerType, e.shiftKey);
    };
    host.addEventListener('pointerdown', onBackdropPointerDown);
    return () => host.removeEventListener('pointerdown', onBackdropPointerDown);
  }, [interactive, backdropRef]);

  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    beginMarqueeSelection(e.clientX, e.clientY, e.pointerType, e.shiftKey);
  };

  return (
    <div
      className={`relative select-none overflow-visible ${touchMarqueeActive ? 'touch-none' : ''}`}
      style={{
        width: `${width * scale}px`,
        height: `${height * scale}px`,
      }}
      onPointerDown={handleStagePointerDown}
      onDragOver={handleDragOverStage}
      onDragLeave={handleDragLeaveStage}
      onDrop={handleDropOnStage}
    >
      {/* Clipped Slide Surface Card */}
      <div
        ref={stageRef}
        className="w-full h-full relative overflow-hidden"
        style={{
          boxShadow: isStageFileDrag
            ? '0 0 0 3px #7D1935, 0 14px 36px -10px rgba(17, 19, 24, 0.28)'
            : '0 14px 36px -10px rgba(17, 19, 24, 0.22)',
          borderRadius: scale < 0.35 ? '6px' : '8px',
        }}
      >
        <div
          className="origin-top-left relative"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${scale})`,
            ...bgStyle,
          }}
        >
          {/* Background Image Layer */}
          {slide.background.imageSrc && (
            <img
              src={slide.background.imageSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              style={{ opacity: 0.24 }}
            />
          )}

          {/* Background Architectural / Geometric Pattern Layer */}
          {patternStyle && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={patternStyle}
            />
          )}

          {/* Background Radial Vignette / Atmospheric Overlay */}
          {slide.background.overlay && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: slide.background.overlay }}
            />
          )}

          {sortedElements.map((el) => {
            const isSelected = interactive && selectedIds.includes(el.id);
            const isEditingText = interactive && editingTextId === el.id && el.type === 'text';
            const isCropping = interactive && croppingElementId === el.id;
            const isDropTarget = interactive && dropTargetFrameId === el.id;
            const isHoveringTargetWithImage =
              interactive && Boolean(dropTargetFrameId) && isSelected && el.type === 'image';
            const animClass =
              shouldAnimate && el.animation && el.animation !== 'none'
                ? `vellum-anim-${el.animation}`
                : '';
            const shadowCss = getShadowValue(el.shadow, tokens.colors.accent);

            return (
              <div
                key={`${slide.id}-${el.id}-${animationKey}`}
                data-element-id={el.id}
                onPointerDown={(e) => startDrag(e, el)}
                onDoubleClick={(e) => {
                  if (!interactive || el.locked) return;
                  if (el.type === 'text') {
                    e.stopPropagation();
                    setEditingTextId(el.id);
                  } else if (el.type === 'image') {
                    e.stopPropagation();
                    onSelectElements?.([el.id]);
                    onEnterCropMode?.(el.id);
                  } else if (
                    el.type === 'custom' &&
                    (el.componentKey === 'retro-tv-frame' || el.componentKey === 'photo-frame') &&
                    el.props.mediaSrc
                  ) {
                    e.stopPropagation();
                    onSelectElements?.([el.id]);
                    onEnterCropMode?.(el.id);
                  }
                }}
                className={`absolute ${interactive ? 'touch-none' : ''} ${
                  interactive && !el.locked && !isCropping ? 'cursor-move' : ''
                }`}
                style={{
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                  opacity: isHoveringTargetWithImage ? Math.min(el.opacity, 0.55) : el.opacity,
                  zIndex: isCropping ? Math.max(el.zIndex, 40) : el.zIndex,
                  borderRadius:
                    el.type === 'custom' || el.type === 'chart' || el.type === 'table'
                      ? `${tokens.radius.card}px`
                      : undefined,
                }}
              >
                <div
                  className={`w-full h-full ${animClass}`}
                  style={{
                    animationDelay: animClass && el.animationDelay ? `${el.animationDelay}ms` : undefined,
                    boxShadow: el.type !== 'text' ? shadowCss : undefined,
                    backdropFilter: el.backdropBlur ? `blur(${el.backdropBlur}px)` : undefined,
                    WebkitBackdropFilter: el.backdropBlur ? `blur(${el.backdropBlur}px)` : undefined,
                    borderRadius:
                      el.type === 'custom' || el.type === 'chart' || el.type === 'table'
                        ? `${tokens.radius.card}px`
                        : undefined,
                  }}
                >
                  {el.type === 'text' &&
                    (isEditingText ? (
                      <textarea
                        autoFocus
                        value={el.content}
                        onPointerDown={(e) => e.stopPropagation()}
                        onChange={(e) => onUpdateElementLive?.(el.id, { content: e.target.value })}
                        onBlur={(e) => {
                          setEditingTextId(null);
                          onCommitElementPatch?.(el.id, { content: e.target.value });
                        }}
                        className="w-full h-full resize-none bg-transparent outline-none"
                        style={{
                          fontFamily: el.fontFamily,
                          fontSize: `${el.fontSize}px`,
                          fontWeight: el.fontWeight,
                          fontStyle: el.fontStyle,
                          lineHeight: el.lineHeight,
                          letterSpacing: `${el.letterSpacing}em`,
                          textAlign: el.textAlign,
                          color: el.textEffect === 'ransom-cutout' ? '#191B1F' : el.color,
                          backgroundColor: el.backgroundColor || 'transparent',
                          padding: `${el.padding}px`,
                        }}
                      />
                    ) : el.textEffect === 'ransom-cutout' ? (
                      <div
                        className="w-full h-full flex flex-col justify-center overflow-visible"
                        style={{
                          alignItems:
                            el.textAlign === 'center'
                              ? 'center'
                              : el.textAlign === 'right'
                              ? 'flex-end'
                              : 'flex-start',
                          backgroundColor: el.backgroundColor || 'transparent',
                          borderRadius: `${el.borderRadius}px`,
                          padding: `${el.padding}px`,
                        }}
                      >
                        {(() => {
                          let tileIdx = 0;
                          return String(el.content ?? '')
                            .split('\n')
                            .map((line, li) => (
                              <div
                                key={li}
                                className="flex flex-wrap items-center gap-[3px]"
                                style={{
                                  justifyContent:
                                    el.textAlign === 'center'
                                      ? 'center'
                                      : el.textAlign === 'right'
                                      ? 'flex-end'
                                      : 'flex-start',
                                }}
                              >
                                {Array.from(line).map((ch, ci) => {
                                  if (ch === ' ') {
                                    return (
                                      <span
                                        key={ci}
                                        style={{ width: `${Math.max(10, el.fontSize * 0.35)}px` }}
                                      />
                                    );
                                  }
                                  const st = getRansomTileStyle(tileIdx++);
                                  return (
                                    <span
                                      key={ci}
                                      className="inline-flex items-center justify-center select-none"
                                      style={{
                                        minWidth: `${Math.round(el.fontSize * 0.92)}px`,
                                        height: `${Math.round(el.fontSize * 1.18)}px`,
                                        padding: `0 ${Math.round(el.fontSize * 0.14)}px`,
                                        backgroundColor: st.bg,
                                        color: st.fg,
                                        fontFamily: st.fontFamily,
                                        fontStyle: st.fontStyle || 'normal',
                                        fontWeight: 900,
                                        fontSize: `${Math.round(el.fontSize * 0.92)}px`,
                                        lineHeight: 1,
                                        clipPath: st.clipPath,
                                        transform: `rotate(${st.rotate}deg)`,
                                        filter: 'drop-shadow(0 3px 5px rgba(15, 23, 42, 0.28))',
                                      }}
                                    >
                                      {ch}
                                    </span>
                                  );
                                })}
                              </div>
                            ));
                        })()}
                      </div>
                    ) : (
                      <div
                        className="w-full h-full whitespace-pre-wrap break-words overflow-visible"
                        style={{
                          fontFamily: el.fontFamily,
                          fontSize: `${el.fontSize}px`,
                          fontWeight: el.fontWeight,
                          fontStyle: el.fontStyle,
                          lineHeight: el.lineHeight,
                          letterSpacing: `${el.letterSpacing}em`,
                          textAlign: el.textAlign,
                          color: el.gradientText ? 'transparent' : el.color,
                          backgroundImage: el.gradientText || undefined,
                          WebkitBackgroundClip: el.gradientText ? 'text' : undefined,
                          backgroundClip: el.gradientText ? 'text' : undefined,
                          textShadow:
                            el.textEffect === 'sticker-outline'
                              ? el.textShadow || '0 4px 10px rgba(15, 23, 42, 0.25)'
                              : el.textShadow || undefined,
                          WebkitTextStroke:
                            el.textEffect === 'sticker-outline'
                              ? `${el.outlineWidth ?? 12}px ${el.outlineColor || '#1B365D'}`
                              : undefined,
                          paintOrder: el.textEffect === 'sticker-outline' ? 'stroke fill' : undefined,
                          backgroundColor: el.backgroundColor || 'transparent',
                          borderRadius: `${el.borderRadius}px`,
                          padding: `${el.padding}px`,
                        }}
                      >
                        {el.content}
                      </div>
                    ))}

                  {el.type === 'shape' &&
                    (['rect', 'rounded-rect', 'ellipse', 'line', 'pill'].includes(el.shapeKind) ? (
                      <div
                        className="w-full h-full"
                        style={{
                          background: el.gradient || el.fill,
                          border: el.strokeWidth > 0 ? `${el.strokeWidth}px solid ${el.stroke}` : undefined,
                          filter: el.blur ? `blur(${el.blur}px)` : undefined,
                          mixBlendMode: el.blendMode && el.blendMode !== 'normal' ? el.blendMode : undefined,
                          borderRadius:
                            el.shapeKind === 'ellipse' || el.shapeKind === 'pill'
                              ? '9999px'
                              : el.shapeKind === 'rounded-rect'
                              ? `${el.borderRadius}px`
                              : '0px',
                        }}
                      />
                    ) : (
                      <div
                        className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:overflow-visible"
                        style={{
                          filter: el.blur ? `blur(${el.blur}px)` : undefined,
                          mixBlendMode: el.blendMode && el.blendMode !== 'normal' ? el.blendMode : undefined,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: renderShapeSvgString(el, `sh-${el.id.replace(/[^a-zA-Z0-9_-]/g, '')}`),
                        }}
                      />
                    ))}

                  {el.type === 'image' && (
                    <ImageBox
                      element={el}
                      scale={scale}
                      interactive={interactive}
                      isCropping={isCropping}
                      onCommitSnapshot={onCommitSnapshot}
                      onUpdateCropLive={(patch) => onUpdateElementLive?.(el.id, patch)}
                      onNaturalSize={(id, nat) => {
                        imageNatMapRef.current.set(id, nat);
                      }}
                    />
                  )}

                  {el.type === 'icon' &&
                    (() => {
                      const catalogIcon = ICON_CATALOG.find(
                        (ic) => ic.id === el.iconName || ic.label.toLowerCase() === el.iconName.toLowerCase()
                      );
                      if (catalogIcon) {
                        return (
                          <div
                            className="w-full h-full flex items-center justify-center [&>svg]:w-[82%] [&>svg]:h-[82%] [&>svg]:overflow-visible"
                            dangerouslySetInnerHTML={{
                              __html: renderIconSvgString(
                                el.iconName,
                                el.color,
                                el.strokeWidth,
                                el.colorMode ?? 'brand',
                                el.id
                              ),
                            }}
                          />
                        );
                      }
                      const IconComp =
                        (LucideIcons as unknown as Record<string, React.ComponentType<any>>)[el.iconName] ||
                        LucideIcons.Layers;
                      return (
                        <div className="w-full h-full flex items-center justify-center">
                          <IconComp
                            style={{ width: '80%', height: '80%', color: el.color }}
                            strokeWidth={el.strokeWidth}
                          />
                        </div>
                      );
                    })()}

                  {el.type === 'chart' && <ChartSvg element={el} />}

                  {el.type === 'table' && (
                    <div
                      className={`w-full h-full overflow-hidden rounded-md ${
                        el.tableStyle === 'minimal' ? 'border-y' : 'border'
                      }`}
                      style={{ borderColor: el.borderColor }}
                    >
                      <table className="w-full h-full border-collapse text-xs tabular-nums">
                        <thead>
                          <tr>
                            {el.headers.map((h, hi) => (
                              <th
                                key={hi}
                                className={`px-3 py-2 font-semibold ${
                                  el.tableStyle === 'comparison' && hi > 0 ? 'text-center' : 'text-left'
                                }`}
                                style={{
                                  backgroundColor: el.headerBg,
                                  color: el.headerColor,
                                  borderBottom: `1px solid ${el.borderColor}`,
                                  borderRight:
                                    el.tableStyle !== 'minimal' && hi < el.headers.length - 1
                                      ? `1px solid ${el.borderColor}55`
                                      : undefined,
                                }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {el.rows.map((row, ri) => {
                            const rowBg =
                              (el.tableStyle === 'striped' || el.tableStyle === 'comparison' || el.stripeBg) &&
                              ri % 2 === 1
                                ? el.stripeBg || 'rgba(128,128,128,0.06)'
                                : el.cellBg;
                            return (
                              <tr key={ri}>
                                {row.map((cell, ci) => (
                                  <td
                                    key={ci}
                                    className={`px-3 py-2 ${
                                      el.tableStyle === 'comparison' && ci > 0
                                        ? 'text-center font-semibold'
                                        : 'text-left'
                                    }`}
                                    style={{
                                      backgroundColor: rowBg,
                                      color: el.textColor,
                                      borderBottom:
                                        ri < el.rows.length - 1 ? `1px solid ${el.borderColor}` : undefined,
                                      borderRight:
                                        el.tableStyle !== 'minimal' && ci < row.length - 1
                                          ? `1px solid ${el.borderColor}44`
                                          : undefined,
                                    }}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {el.type === 'custom' && (
                    <CustomComponentView
                      element={el}
                      tokens={tokens}
                      scale={scale}
                      interactive={interactive}
                      isDropTarget={isDropTarget}
                      isCropping={isCropping}
                      onCommitSnapshot={onCommitSnapshot}
                      onUpdateMediaCropLive={(cropX, cropY) =>
                        onUpdateElementLive?.(el.id, {
                          props: { ...el.props, mediaCropX: cropX, mediaCropY: cropY },
                        } as Partial<PresentationElement>)
                      }
                      onCommitPropsPatch={(propsPatch) =>
                        onCommitElementPatch?.(el.id, {
                          props: { ...el.props, ...propsPatch },
                        } as Partial<PresentationElement>)
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* Page Margin Guides */}
          {interactive && showMargins && pageMargin > 0 && width > pageMargin * 2 && height > pageMargin * 2 && (
            <div
              aria-hidden="true"
              className="absolute pointer-events-none z-20"
              style={{
                left: `${pageMargin}px`,
                top: `${pageMargin}px`,
                width: `${width - pageMargin * 2}px`,
                height: `${height - pageMargin * 2}px`,
                border: '1.5px dashed rgba(99, 102, 241, 0.55)',
              }}
            >
              <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-indigo-600/85 text-white text-[10px] font-mono-tabular whitespace-nowrap">
                Margin {pageMargin}px
              </span>
            </div>
          )}

          {/* Alignment Guides */}
          {interactive && guides.x !== undefined && (
            <div
              className="absolute top-0 bottom-0 w-px bg-[#7D1935] pointer-events-none z-50"
              style={{ left: `${guides.x}px` }}
            />
          )}
          {interactive && guides.y !== undefined && (
            <div
              className="absolute left-0 right-0 h-px bg-[#7D1935] pointer-events-none z-50"
              style={{ top: `${guides.y}px` }}
            />
          )}

          {/* On-Canvas Freedraw Custom Frame Overlay */}
          {interactive && isDrawingFrame && (
            <svg
              viewBox={`0 0 ${width} ${height}`}
              aria-label="Draw custom photo frame"
              className="absolute inset-0 w-full h-full cursor-crosshair z-50 touch-none"
              onPointerDown={(e) => {
                e.stopPropagation();
                e.currentTarget.setPointerCapture(e.pointerId);
                const { cx, cy } = clientToCanvas(e.clientX, e.clientY);
                setFreedrawPoints([{ x: cx, y: cy }]);
              }}
              onPointerMove={(e) => {
                if (freedrawPoints.length === 0) return;
                e.stopPropagation();
                const { cx, cy } = clientToCanvas(e.clientX, e.clientY);
                setFreedrawPoints((prev) => {
                  if (prev.length === 0) return prev;
                  const last = prev[prev.length - 1];
                  if (Math.hypot(cx - last.x, cy - last.y) < 4) return prev;
                  return [...prev, { x: cx, y: cy }];
                });
              }}
              onPointerUp={(e) => {
                if (freedrawPoints.length === 0) return;
                e.stopPropagation();
                const pts = freedrawPoints;
                setFreedrawPoints([]);
                onCompleteFreedrawFrame?.(pts);
              }}
              onPointerCancel={() => setFreedrawPoints([])}
            >
              <rect x={0} y={0} width={width} height={height} fill="rgba(125, 25, 53, 0.04)" />
              {freedrawPoints.length >= 2 && (
                <>
                  <polygon
                    points={freedrawPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                    fill="rgba(125, 25, 53, 0.14)"
                    stroke="#7D1935"
                    strokeWidth={3 / Math.max(0.35, scale)}
                    strokeDasharray={`${8 / Math.max(0.35, scale)} ${5 / Math.max(0.35, scale)}`}
                    strokeLinejoin="round"
                  />
                  <line
                    x1={freedrawPoints[freedrawPoints.length - 1].x}
                    y1={freedrawPoints[freedrawPoints.length - 1].y}
                    x2={freedrawPoints[0].x}
                    y2={freedrawPoints[0].y}
                    stroke="#7D1935"
                    strokeOpacity={0.45}
                    strokeWidth={2 / Math.max(0.35, scale)}
                    strokeDasharray={`${5 / Math.max(0.35, scale)} ${5 / Math.max(0.35, scale)}`}
                  />
                  <circle
                    cx={freedrawPoints[0].x}
                    cy={freedrawPoints[0].y}
                    r={6 / Math.max(0.35, scale)}
                    fill="#FFFFFF"
                    stroke="#7D1935"
                    strokeWidth={2.5 / Math.max(0.35, scale)}
                  />
                </>
              )}
            </svg>
          )}
        </div>
      </div>

      {/* Marquee Selection Box & Touch Hint */}
      {interactive && touchMarqueeActive && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded-full bg-[#7D1935] text-white text-[11px] font-semibold shadow-md pointer-events-none whitespace-nowrap">
          Drag to select elements
        </div>
      )}

      {interactive && marqueeRect && (
        <div
          aria-hidden="true"
          className="absolute pointer-events-none z-40 rounded-xs"
          style={{
            left: `${marqueeRect.x * scale}px`,
            top: `${marqueeRect.y * scale}px`,
            width: `${marqueeRect.width * scale}px`,
            height: `${marqueeRect.height * scale}px`,
            border: '1.5px dashed #7D1935',
            backgroundColor: 'rgba(125, 25, 53, 0.1)',
          }}
        />
      )}

      {/* Multi-Selection Individual Outlines + Combined Bounding Frame */}
      {interactive && selectedElementsList.length > 1 && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-visible z-30">
          {selectedElementsList.map((sel) => (
            <div
              key={sel.id}
              className="absolute"
              style={{
                left: `${sel.x * scale}px`,
                top: `${sel.y * scale}px`,
                width: `${sel.width * scale}px`,
                height: `${sel.height * scale}px`,
                transform: sel.rotation ? `rotate(${sel.rotation}deg)` : undefined,
                border: '1.5px dashed #7D1935',
              }}
            />
          ))}
          {multiBounds && (
            <div
              className="absolute"
              style={{
                left: `${multiBounds.x * scale}px`,
                top: `${multiBounds.y * scale}px`,
                width: `${multiBounds.width * scale}px`,
                height: `${multiBounds.height * scale}px`,
                border: '2px solid #7D1935',
                borderRadius: '2px',
              }}
            >
              <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-[#7D1935] text-white text-[10px] font-mono-tabular font-semibold whitespace-nowrap shadow-xs">
                {selectedElementsList.length} selected
                {selectedElementsList.every((e) => e.groupId && e.groupId === selectedElementsList[0].groupId)
                  ? ' · Grouped'
                  : ''}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Unclipped Selection, Crop Trim & Canva-Style Drag Rotation Overlay */}
      {interactive && primarySelected && (
        <div
          aria-hidden="false"
          className="absolute inset-0 pointer-events-none overflow-visible z-30"
        >
          <div
            ref={selOverlayRef}
            className="absolute pointer-events-none"
            style={{
              left: `${primarySelected.x * scale}px`,
              top: `${primarySelected.y * scale}px`,
              width: `${primarySelected.width * scale}px`,
              height: `${primarySelected.height * scale}px`,
              transform: primarySelected.rotation ? `rotate(${primarySelected.rotation}deg)` : undefined,
              outline:
                croppingElementId === primarySelected.id
                  ? '2px dashed #7D1935'
                  : '2px solid #7D1935',
              outlineOffset: '2px',
            }}
          >
            {!primarySelected.locked && croppingElementId !== primarySelected.id && (
              <>
                {(['nw', 'ne', 'sw', 'se'] as const).map((corner) => (
                  <button
                    key={corner}
                    type="button"
                    aria-label={`Resize ${corner}`}
                    onPointerDown={(e) => startResize(e, primarySelected, corner)}
                    className="pointer-events-auto absolute w-3.5 h-3.5 bg-white border-2 border-[#7D1935] rounded-xs shadow-xs touch-none"
                    style={{
                      top: corner.includes('n') ? '-7px' : undefined,
                      bottom: corner.includes('s') ? '-7px' : undefined,
                      left: corner.includes('w') ? '-7px' : undefined,
                      right: corner.includes('e') ? '-7px' : undefined,
                      cursor: corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize',
                    }}
                  />
                ))}

                {/* Canva-Style On-Canvas Drag Rotation Handle */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-9 flex flex-col items-center pointer-events-none">
                  <div className="w-[2px] h-4 bg-[#7D1935]" />
                  <button
                    type="button"
                    aria-label="Drag to rotate element"
                    title="Drag around element to rotate (hold Shift for 15° snap)"
                    onPointerDown={(e) => startRotate(e, primarySelected)}
                    className="pointer-events-auto w-7 h-7 rounded-full bg-white border-2 border-[#7D1935] text-[#7D1935] shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform touch-none"
                  >
                    <LucideIcons.RotateCw className="w-3.5 h-3.5" />
                  </button>
                  {rotatingState?.id === primarySelected.id && (
                    <div
                      className={`mt-1 px-2 py-0.5 rounded-full text-[11px] font-mono-tabular font-semibold text-white shadow-md whitespace-nowrap ${
                        rotatingState.snapped ? 'bg-emerald-600' : 'bg-neutral-900'
                      }`}
                    >
                      {rotatingState.deg}°
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Standalone Image Edge Crop Trim Handles */}
            {!primarySelected.locked &&
              croppingElementId === primarySelected.id &&
              primarySelected.type === 'image' && (
                <>
                  <button
                    type="button"
                    aria-label="Trim top crop edge"
                    onPointerDown={(e) => startCropEdgeTrim(e, primarySelected, 'n')}
                    className="pointer-events-auto absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-2.5 rounded-full bg-white border-2 border-[#7D1935] shadow-sm cursor-ns-resize touch-none"
                  />
                  <button
                    type="button"
                    aria-label="Trim bottom crop edge"
                    onPointerDown={(e) => startCropEdgeTrim(e, primarySelected, 's')}
                    className="pointer-events-auto absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-2.5 rounded-full bg-white border-2 border-[#7D1935] shadow-sm cursor-ns-resize touch-none"
                  />
                  <button
                    type="button"
                    aria-label="Trim left crop edge"
                    onPointerDown={(e) => startCropEdgeTrim(e, primarySelected, 'w')}
                    className="pointer-events-auto absolute -left-2 top-1/2 -translate-y-1/2 w-2.5 h-10 rounded-full bg-white border-2 border-[#7D1935] shadow-sm cursor-ew-resize touch-none"
                  />
                  <button
                    type="button"
                    aria-label="Trim right crop edge"
                    onPointerDown={(e) => startCropEdgeTrim(e, primarySelected, 'e')}
                    className="pointer-events-auto absolute -right-2 top-1/2 -translate-y-1/2 w-2.5 h-10 rounded-full bg-white border-2 border-[#7D1935] shadow-sm cursor-ew-resize touch-none"
                  />
                </>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
