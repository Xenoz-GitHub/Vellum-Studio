import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import type {
  ChartElement,
  DesignTokens,
  PresentationElement,
  Slide,
} from '../../core/schema';
import { ICON_CATALOG, renderShapeSvgString } from '../../core/svg-cutout-renderer';
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
  onSelectElements?: (ids: string[]) => void;
  onUpdateElementLive?: (elementId: string, patch: Partial<PresentationElement>) => void;
  onCommitSnapshot?: () => void;
  onCommitElementPatch?: (elementId: string, patch: Partial<PresentationElement>) => void;
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
        <span className="text-sm font-semibold">{element.title}</span>
        <span className="text-xs opacity-60 tabular-nums font-mono">{element.chartKind.toUpperCase()}</span>
      </div>

      {element.chartKind === 'pie' ? (
        <div className="flex items-center justify-around flex-1 gap-4">
          <svg viewBox="0 0 120 120" className="w-36 h-36 shrink-0">
            {(() => {
              const total = Math.max(1, element.data.reduce((a, b) => a + b.value, 0));
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
                    opacity={0.92 - i * 0.12}
                  />
                );
              });
            })()}
          </svg>
          <div className="space-y-1.5 text-xs">
            {element.data.map((d, i) => (
              <div key={i} className="flex items-center gap-2 tabular-nums">
                <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: d.color || element.accentColor }} />
                <span className="font-medium">{d.label}</span>
                <span className="opacity-70">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : element.chartKind === 'line' ? (
        <div className="flex-1 flex flex-col justify-end">
          <svg viewBox="0 0 400 180" className="w-full h-full overflow-visible">
            <line x1="20" y1="150" x2="380" y2="150" stroke="currentColor" strokeOpacity="0.15" />
            <polyline
              fill="none"
              stroke={element.accentColor}
              strokeWidth="3"
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
                  <circle cx={x} cy={y} r="4.5" fill={element.accentColor} />
                  {element.showValues && (
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="11" fill="currentColor">
                      {d.value}
                    </text>
                  )}
                  <text x={x} y="168" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.7">
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        <div className="flex-1 flex items-end gap-4 pt-4 pb-1 px-2">
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
  src,
  alt,
  objectFit,
  borderRadius,
}: {
  src: string;
  alt: string;
  objectFit: 'cover' | 'contain';
  borderRadius: number;
}) {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
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

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className="w-full h-full block select-none pointer-events-none"
      style={{ objectFit, borderRadius: `${borderRadius}px` }}
    />
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
  onSelectElements,
  onUpdateElementLive,
  onCommitSnapshot,
  onCommitElementPatch,
}: SlideCanvasProps) {
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [guides, setGuides] = useState<{ x?: number; y?: number }>({});
  const dragRef = useRef<{ active: boolean }>({ active: false });
  const shouldAnimate = animated ?? scale >= 0.2;

  const sortedElements = [...slide.elements].filter((e) => e.visible).sort((a, b) => a.zIndex - b.zIndex);

  const snap = (val: number) => (snapToGrid ? Math.round(val / gridSize) * gridSize : Math.round(val));

  const startDrag = (e: React.PointerEvent, el: PresentationElement) => {
    if (!interactive || el.locked || editingTextId === el.id) return;
    e.stopPropagation();
    onSelectElements?.([el.id]);

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = el.x;
    const origY = el.y;
    let moved = false;

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

      onUpdateElementLive?.(el.id, {
        x: Math.max(-el.width + 24, Math.min(width - 24, nextX)),
        y: Math.max(-el.height + 24, Math.min(height - 24, nextY)),
      });
    };

    const handleUp = () => {
      dragRef.current.active = false;
      setGuides({});
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
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

  const bgStyle: React.CSSProperties =
    slide.background.type === 'gradient' && slide.background.gradient
      ? { background: slide.background.gradient }
      : { backgroundColor: slide.background.color || tokens.colors.background };

  const patternStyle = getPatternStyle(
    slide.background.pattern,
    slide.background.patternColor || tokens.colors.ink,
    slide.background.patternOpacity ?? 0.16
  );

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        width: `${width * scale}px`,
        height: `${height * scale}px`,
        boxShadow: '0 14px 36px -10px rgba(17, 19, 24, 0.22)',
        borderRadius: scale < 0.35 ? '6px' : '8px',
      }}
      onPointerDown={() => {
        if (interactive) {
          setEditingTextId(null);
          onSelectElements?.([]);
        }
      }}
    >
      <div
        className="origin-top-left relative overflow-hidden"
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
                if (interactive && el.type === 'text' && !el.locked) {
                  e.stopPropagation();
                  setEditingTextId(el.id);
                }
              }}
              className={`absolute ${interactive ? 'touch-none' : ''} ${
                interactive && !el.locked ? 'cursor-move' : ''
              }`}
              style={{
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                height: `${el.height}px`,
                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                opacity: el.opacity,
                zIndex: el.zIndex,
                borderRadius: el.type === 'custom' || el.type === 'chart' || el.type === 'table' ? `${tokens.radius.card}px` : undefined,
                outline: isSelected ? '2px solid #7D1935' : undefined,
                outlineOffset: isSelected ? '2px' : undefined,
              }}
            >
              <div
                className={`w-full h-full ${animClass}`}
                style={{
                  animationDelay: animClass && el.animationDelay ? `${el.animationDelay}ms` : undefined,
                  boxShadow: el.type !== 'text' ? shadowCss : undefined,
                  backdropFilter: el.backdropBlur ? `blur(${el.backdropBlur}px)` : undefined,
                  WebkitBackdropFilter: el.backdropBlur ? `blur(${el.backdropBlur}px)` : undefined,
                  borderRadius: el.type === 'custom' || el.type === 'chart' || el.type === 'table' ? `${tokens.radius.card}px` : undefined,
                }}
              >
              {el.type === 'text' && (
                isEditingText ? (
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
                      color: el.color,
                      backgroundColor: el.backgroundColor || 'transparent',
                      padding: `${el.padding}px`,
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full whitespace-pre-wrap break-words overflow-hidden"
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
                      textShadow: el.textShadow || undefined,
                      backgroundColor: el.backgroundColor || 'transparent',
                      borderRadius: `${el.borderRadius}px`,
                      padding: `${el.padding}px`,
                    }}
                  >
                    {el.content}
                  </div>
                )
              )}

              {el.type === 'shape' && (
                ['rect', 'rounded-rect', 'ellipse', 'line', 'pill'].includes(el.shapeKind) ? (
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
                )
              )}

              {el.type === 'image' && (
                <ImageBox
                  src={el.src}
                  alt={el.alt}
                  objectFit={el.objectFit}
                  borderRadius={el.borderRadius}
                />
              )}

              {el.type === 'icon' && (() => {
                const catalogIcon = ICON_CATALOG.find(
                  (ic) => ic.id === el.iconName || ic.label.toLowerCase() === el.iconName.toLowerCase()
                );
                if (catalogIcon) {
                  return (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-[82%] h-[82%] overflow-visible">
                        {catalogIcon.paths.map((d, idx) =>
                          catalogIcon.mode === 'fill' ? (
                            <path key={idx} d={d} fill={el.color} />
                          ) : (
                            <path
                              key={idx}
                              d={d}
                              fill="none"
                              stroke={el.color}
                              strokeWidth={el.strokeWidth}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )
                        )}
                      </svg>
                    </div>
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
                  className="w-full h-full overflow-hidden rounded-md border"
                  style={{ borderColor: el.borderColor }}
                >
                  <table className="w-full h-full border-collapse text-xs tabular-nums">
                    <thead>
                      <tr>
                        {el.headers.map((h, hi) => (
                          <th
                            key={hi}
                            className="px-3 py-2 text-left font-semibold"
                            style={{
                              backgroundColor: el.headerBg,
                              color: el.headerColor,
                              borderBottom: `1px solid ${el.borderColor}`,
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {el.rows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className="px-3 py-2"
                              style={{
                                backgroundColor: el.cellBg,
                                color: el.textColor,
                                borderBottom: `1px solid ${el.borderColor}`,
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {el.type === 'custom' && <CustomComponentView element={el} tokens={tokens} />}
              </div>

              {isSelected && !el.locked && (
                <>
                  {(['nw', 'ne', 'sw', 'se'] as const).map((corner) => (
                    <button
                      key={corner}
                      type="button"
                      aria-label={`Resize ${corner}`}
                      onPointerDown={(e) => startResize(e, el, corner)}
                      className="absolute w-4 h-4 bg-white border-2 border-[#7D1935] rounded-xs shadow-xs touch-none"
                      style={{
                        top: corner.includes('n') ? '-8px' : undefined,
                        bottom: corner.includes('s') ? '-8px' : undefined,
                        left: corner.includes('w') ? '-8px' : undefined,
                        right: corner.includes('e') ? '-8px' : undefined,
                        cursor: corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize',
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          );
        })}

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
      </div>
    </div>
  );
}
