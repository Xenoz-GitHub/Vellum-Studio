import React, { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import type { CustomComponentElement } from '../../core/schema';
import {
  buildImageFilterCss,
  clamp,
  computeCropBoxLayout,
  extractFrameMediaAdjustments,
} from '../../core/crop-utils';
import { getPhotoFrameDef, renderPhotoFrameSvgString } from '../../core/frame-catalog';
import { renderCutoutIllustrationSvg } from '../../core/svg-cutout-renderer';

interface Props {
  element: CustomComponentElement;
  scale?: number;
  interactive?: boolean;
  isDropTarget?: boolean;
  isCropping?: boolean;
  onCommitSnapshot?: () => void;
  onUpdateMediaCropLive?: (cropX: number, cropY: number) => void;
}

export function Y2KStickerRenderer({
  element,
  scale = 1,
  interactive = false,
  isDropTarget = false,
  isCropping = false,
  onCommitSnapshot,
  onUpdateMediaCropLive,
}: Props) {
  const { componentKey, props } = element;
  const uid = element.id.replace(/[^a-zA-Z0-9_-]/g, '');

  const mediaSrc = typeof props.mediaSrc === 'string' ? props.mediaSrc : '';
  const mediaFilterCss = buildImageFilterCss(extractFrameMediaAdjustments(props));
  const [natSize, setNatSize] = useState<{ w: number; h: number } | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    setNatSize(null);
    setImgError(false);
  }, [mediaSrc]);

  if (componentKey === 'cutout-illustration') {
    const kind = String(props.stickerKind || 'balloon');
    const { svg } = renderCutoutIllustrationSvg(kind, props, uid);
    return (
      <div
        className="w-full h-full select-none [&>svg]:w-full [&>svg]:h-full [&>svg]:overflow-visible"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  if (componentKey === 'photo-frame') {
    const def = getPhotoFrameDef(props.frameKind, props);
    const tint = String(props.tintColor || '#CBD5E1');
    const accent = String(props.accentColor || '#3B82F6');

    const mediaAlt = typeof props.mediaAlt === 'string' ? props.mediaAlt : def.name;
    const mediaFit: 'cover' | 'contain' = props.mediaFit === 'contain' ? 'contain' : 'cover';
    const cropX = typeof props.mediaCropX === 'number' ? props.mediaCropX : 50;
    const cropY = typeof props.mediaCropY === 'number' ? props.mediaCropY : 50;
    const cropZoom = typeof props.mediaZoom === 'number' ? props.mediaZoom : 1;

    const { viewBoxW: vw, viewBoxH: vh, cavity } = def;
    const cavityW = Math.max(32, element.width * (cavity.width / vw));
    const cavityH = Math.max(32, element.height * (cavity.height / vh));
    const layout =
      natSize && mediaSrc && !imgError
        ? computeCropBoxLayout(cavityW, cavityH, natSize.w, natSize.h, mediaFit, cropX, cropY, cropZoom)
        : null;

    const startFramePan = (e: React.PointerEvent) => {
      if (!isCropping || !interactive || !mediaSrc || imgError) return;
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
          nextX = clamp(origCropX - (localDx / cavityW) * 100, 0, 100);
          nextY = clamp(origCropY - (localDy / cavityH) * 100, 0, 100);
        }

        onUpdateMediaCropLive?.(Number(nextX.toFixed(2)), Number(nextY.toFixed(2)));
      };

      const handleUp = () => {
        setIsPanning(false);
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    };

    if (!mediaSrc || imgError) {
      return (
        <div className="relative w-full h-full select-none">
          <div
            className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:overflow-visible"
            dangerouslySetInnerHTML={{ __html: renderPhotoFrameSvgString(props, uid) }}
          />
          {isDropTarget && (
            <svg
              viewBox={`0 0 ${vw} ${vh}`}
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
            >
              <path
                d={def.clipPathD}
                fill="rgba(125, 25, 53, 0.24)"
                stroke="#7D1935"
                strokeWidth="5"
              />
            </svg>
          )}
          {isDropTarget && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div className="px-3 py-1.5 rounded-full bg-[#7D1935] text-white text-xs font-semibold shadow-lg">
                Drop into Frame
              </div>
            </div>
          )}
        </div>
      );
    }

    const imgElementStyle: React.CSSProperties = layout
      ? {
          position: 'absolute',
          left: `${layout.left}px`,
          top: `${layout.top}px`,
          width: `${layout.scaledW}px`,
          height: `${layout.scaledH}px`,
          maxWidth: 'none',
          maxHeight: 'none',
          filter: mediaFilterCss,
        }
      : {
          width: '100%',
          height: '100%',
          objectFit: mediaFit,
          objectPosition: `${cropX}% ${cropY}%`,
          transform: cropZoom !== 1 ? `scale(${cropZoom})` : undefined,
          transformOrigin: `${cropX}% ${cropY}%`,
          filter: mediaFilterCss,
        };

    const underlayMarkup = def.underlaySvg ? def.underlaySvg(uid, tint, accent) : '';
    const overlayMarkup = def.overlaySvg ? def.overlaySvg(uid, tint, accent) : '';
    const clipId = `${uid}-pf-clip`;
    const cavLeftPct = `${(cavity.x / vw) * 100}%`;
    const cavTopPct = `${(cavity.y / vh) * 100}%`;
    const cavWidthPct = `${(cavity.width / vw) * 100}%`;
    const cavHeightPct = `${(cavity.height / vh) * 100}%`;

    return (
      <div className="relative w-full h-full select-none">
        <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path d={def.clipPathD} transform={`scale(${1 / vw}, ${1 / vh})`} />
            </clipPath>
          </defs>
        </svg>

        {underlayMarkup && (
          <svg
            viewBox={`0 0 ${vw} ${vh}`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            dangerouslySetInnerHTML={{ __html: underlayMarkup }}
          />
        )}

        {/* Ghosted overflow preview when editing crop inside shape frame */}
        {isCropping && layout && (
          <div
            className="absolute overflow-visible pointer-events-none z-10"
            style={{ left: cavLeftPct, top: cavTopPct, width: cavWidthPct, height: cavHeightPct }}
          >
            <img
              src={mediaSrc}
              alt=""
              aria-hidden="true"
              className="select-none pointer-events-none"
              style={{ ...imgElementStyle, opacity: 0.34 }}
            />
          </div>
        )}

        {/* Shape-clipped photo slot */}
        <div
          className="absolute inset-0 z-20"
          style={{ clipPath: `url(#${clipId})`, WebkitClipPath: `url(#${clipId})` }}
        >
          <div
            onPointerDown={startFramePan}
            className={`absolute overflow-hidden ${
              isCropping ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
            }`}
            style={{ left: cavLeftPct, top: cavTopPct, width: cavWidthPct, height: cavHeightPct }}
          >
            <img
              src={mediaSrc}
              alt={mediaAlt}
              referrerPolicy="no-referrer"
              onLoad={(e) => {
                const t = e.currentTarget;
                if (t.naturalWidth && t.naturalHeight) {
                  setNatSize({ w: t.naturalWidth, h: t.naturalHeight });
                }
              }}
              onError={() => setImgError(true)}
              className="block select-none pointer-events-none"
              style={imgElementStyle}
            />

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

        <svg
          viewBox={`0 0 ${vw} ${vh}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
          dangerouslySetInnerHTML={{
            __html:
              (isDropTarget
                ? `<path d="${def.clipPathD}" fill="rgba(125,25,53,0.24)" stroke="#7D1935" stroke-width="5" />`
                : isCropping
                ? `<path d="${def.clipPathD}" fill="none" stroke="#7D1935" stroke-width="3" />`
                : `<path d="${def.clipPathD}" fill="none" stroke="rgba(100,116,139,0.22)" stroke-width="1.5" />`) +
              overlayMarkup,
          }}
        />

        {isDropTarget && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <div className="px-3 py-1.5 rounded-full bg-[#7D1935] text-white text-xs font-semibold shadow-lg">
              Drop into Frame
            </div>
          </div>
        )}
      </div>
    );
  }

  if (componentKey === 'retro-tv-frame') {
    const casing = String(props.casingColor || '#DCD9D0');
    const bezel = String(props.bezelColor || '#A9B0B9');
    const accent = String(props.accentColor || '#3B6FD8');
    const brand = String(props.brandLabel || 'VELLUM-TV');

    const mediaAlt = typeof props.mediaAlt === 'string' ? props.mediaAlt : 'TV Screen Photo';
    const mediaFit: 'cover' | 'contain' = props.mediaFit === 'contain' ? 'contain' : 'cover';
    const cropX = typeof props.mediaCropX === 'number' ? props.mediaCropX : 50;
    const cropY = typeof props.mediaCropY === 'number' ? props.mediaCropY : 50;
    const cropZoom = typeof props.mediaZoom === 'number' ? props.mediaZoom : 1;

    const screenW = Math.max(40, element.width * (432 / 660));
    const screenH = Math.max(40, element.height * (346 / 540));
    const layout =
      natSize && mediaSrc && !imgError
        ? computeCropBoxLayout(screenW, screenH, natSize.w, natSize.h, mediaFit, cropX, cropY, cropZoom)
        : null;

    const startScreenPan = (e: React.PointerEvent) => {
      if (!isCropping || !interactive || !mediaSrc || imgError) return;
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
          nextX = clamp(origCropX - (localDx / screenW) * 100, 0, 100);
          nextY = clamp(origCropY - (localDy / screenH) * 100, 0, 100);
        }

        onUpdateMediaCropLive?.(Number(nextX.toFixed(2)), Number(nextY.toFixed(2)));
      };

      const handleUp = () => {
        setIsPanning(false);
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    };

    const imgElementStyle: React.CSSProperties = layout
      ? {
          position: 'absolute',
          left: `${layout.left}px`,
          top: `${layout.top}px`,
          width: `${layout.scaledW}px`,
          height: `${layout.scaledH}px`,
          maxWidth: 'none',
          maxHeight: 'none',
          filter: mediaFilterCss,
        }
      : {
          width: '100%',
          height: '100%',
          objectFit: mediaFit,
          objectPosition: `${cropX}% ${cropY}%`,
          transform: cropZoom !== 1 ? `scale(${cropZoom})` : undefined,
          transformOrigin: `${cropX}% ${cropY}%`,
          filter: mediaFilterCss,
        };

    return (
      <div className="relative w-full h-full select-none">
        <svg
          viewBox="0 0 660 540"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`${uid}-casing`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F2F0EA" />
              <stop offset="45%" stopColor={casing} />
              <stop offset="100%" stopColor="#A8A49B" />
            </linearGradient>
            <linearGradient id={`${uid}-bezel`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D8DEE6" />
              <stop offset="50%" stopColor={bezel} />
              <stop offset="100%" stopColor="#7C8592" />
            </linearGradient>
            <linearGradient id={`${uid}-chrome`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C8594" />
              <stop offset="45%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <filter id={`${uid}-tv-shadow`} x="-6%" y="-6%" width="112%" height="114%">
              <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Rabbit-ear chrome V-antennas */}
          <g>
            <path d="M274 96 L186 18" stroke={`url(#${uid}-chrome)`} strokeWidth="6" strokeLinecap="round" />
            <path d="M358 96 L448 14" stroke={`url(#${uid}-chrome)`} strokeWidth="6" strokeLinecap="round" />
            <circle cx="184" cy="17" r="8" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
            <circle cx="449" cy="13" r="8" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
            <rect x="248" y="82" width="136" height="18" rx="8" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          </g>

          {/* Main TV Outer Shell */}
          <g filter={`url(#${uid}-tv-shadow)`}>
            <rect
              x="14"
              y="92"
              width="632"
              height="434"
              rx="34"
              fill={`url(#${uid}-casing)`}
              stroke="#8B8880"
              strokeWidth="2.5"
            />
            <rect
              x="22"
              y="100"
              width="616"
              height="418"
              rx="28"
              fill="none"
              stroke="rgba(255,255,255,0.65)"
              strokeWidth="2"
            />
          </g>

          {/* Feet */}
          <rect x="70" y="524" width="68" height="12" rx="5" fill="#6B7280" />
          <rect x="520" y="524" width="68" height="12" rx="5" fill="#6B7280" />

          {/* Screen Bezel Surround */}
          <rect
            x="32"
            y="110"
            width="454"
            height="368"
            rx="28"
            fill={`url(#${uid}-bezel)`}
            stroke="#64748B"
            strokeWidth="2"
          />

          {/* Recessed Screen Cavity matching overlay media at (42, 120, 432, 346) */}
          <rect
            x="42"
            y="120"
            width="432"
            height="346"
            rx="24"
            fill="#111827"
            stroke="#334155"
            strokeWidth="3"
          />

          {/* Control Deck on Right */}
          <rect
            x="500"
            y="116"
            width="126"
            height="360"
            rx="18"
            fill="rgba(15, 23, 42, 0.06)"
            stroke="rgba(100, 116, 139, 0.35)"
            strokeWidth="1.5"
          />

          {/* Top Rotary Channel Dial */}
          <circle cx="563" cy="196" r="44" fill="#CBD5E1" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="563" cy="196" r="34" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
          <rect x="556" y="162" width="14" height="68" rx="5" fill="#94A3B8" transform="rotate(-24 563 196)" />
          <circle cx="563" cy="196" r="9" fill={accent} />

          {/* Bottom Rotary Tuning Dial */}
          <circle cx="563" cy="306" r="36" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          <circle cx="563" cy="306" r="26" fill="#475569" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="563" y1="283" x2="563" y2="298" stroke="#F8FAFC" strokeWidth="3.5" strokeLinecap="round" />

          {/* Speaker Louvers */}
          {[372, 386, 400, 414, 428, 442, 456].map((sy) => (
            <rect key={sy} x="518" y={sy} width="90" height="7" rx="3.5" fill="#475569" opacity="0.72" />
          ))}

          {/* Bottom Control Strip */}
          <rect x="44" y="488" width="140" height="22" rx="6" fill="#1E293B" />
          <text
            x="114"
            y="503"
            textAnchor="middle"
            fill="#F8FAFC"
            fontSize="11"
            fontWeight="700"
            fontFamily="monospace"
            letterSpacing="1.6"
          >
            {brand.slice(0, 14)}
          </text>
          <circle cx="212" cy="499" r="5" fill={accent} />
          {[462, 492, 522, 552].map((bx) => (
            <rect key={bx} x={bx} y="490" width="22" height="16" rx="4" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
          ))}
        </svg>

        {/* Recessed CRT Screen Cavity Overlay (Canva-style Image Frame Slot) */}
        <div
          className="absolute"
          style={{
            left: '6.363636%',
            top: '22.222222%',
            width: '65.454545%',
            height: '64.074074%',
          }}
        >
          {/* Ghosted uncropped overflow preview when editing crop inside TV screen */}
          {isCropping && mediaSrc && !imgError && layout && (
            <div className="absolute inset-0 overflow-visible pointer-events-none z-20">
              <img
                src={mediaSrc}
                alt=""
                aria-hidden="true"
                className="select-none pointer-events-none"
                style={{
                  ...imgElementStyle,
                  opacity: 0.34,
                }}
              />
            </div>
          )}

          {/* Clipped Screen Cavity */}
          <div
            onPointerDown={startScreenPan}
            className={`absolute inset-0 overflow-hidden z-20 ${
              isCropping && mediaSrc ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
            }`}
            style={{
              borderRadius: '5.5556% / 6.9364%',
              boxShadow: isDropTarget
                ? 'inset 0 0 0 4px #7D1935, 0 0 0 4px rgba(125,25,53,0.35)'
                : isCropping
                ? 'inset 0 0 0 2.5px #FFFFFF, 0 0 0 2px #7D1935'
                : undefined,
            }}
          >
            {mediaSrc && !imgError && (
              <img
                src={mediaSrc}
                alt={mediaAlt}
                referrerPolicy="no-referrer"
                onLoad={(e) => {
                  const t = e.currentTarget;
                  if (t.naturalWidth && t.naturalHeight) {
                    setNatSize({ w: t.naturalWidth, h: t.naturalHeight });
                  }
                }}
                onError={() => setImgError(true)}
                className="block select-none pointer-events-none"
                style={imgElementStyle}
              />
            )}

            {/* Empty Frame Prompt (interactive studio hint when TV screen has no slotted photo) */}
            {!mediaSrc && interactive && !isDropTarget && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400/75 pointer-events-none px-4 text-center">
                <ImagePlus className="w-7 h-7 opacity-75" />
                <span className="text-[11px] font-medium tracking-wide">Drop photo into TV screen</span>
              </div>
            )}

            {/* Subtle CRT Screen Glass Glare */}
            {mediaSrc && !isCropping && (
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 34%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.12) 100%)',
                }}
              />
            )}

            {/* Crop Mode Rule-of-Thirds Gridlines */}
            {isCropping && mediaSrc && (
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/55 shadow-xs" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-white/55 shadow-xs" />
                <div className="absolute inset-x-0 top-1/3 h-px bg-white/55 shadow-xs" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-white/55 shadow-xs" />
              </div>
            )}

            {/* Drop Target Highlight Overlay */}
            {isDropTarget && (
              <div className="absolute inset-0 bg-[#7D1935]/30 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1.5 text-white pointer-events-none z-30">
                <div className="px-3 py-1.5 rounded-full bg-[#7D1935] text-white text-xs font-semibold shadow-lg">
                  Drop into TV Screen
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (componentKey === 'birthday-flip-calendar') {
    const month = String(props.month || 'JAN').toUpperCase();
    const day = String(props.day || '05');
    const yearNote = String(props.yearNote || 'BIRTHDAY');
    const headerColor = String(props.headerColor || '#3B6FD8');
    const paperColor = String(props.paperColor || '#FFFFFF');
    const accent = String(props.accentColor || '#2957B8');

    return (
      <div className="w-full h-full relative select-none" style={{ filter: 'drop-shadow(0 12px 20px rgba(15, 23, 42, 0.24))' }}>
        {/* Spiral wire rings */}
        <div className="absolute -top-2.5 left-0 right-0 flex justify-around px-6 z-20 pointer-events-none">
          {[0, 1, 2, 3].map((r) => (
            <div
              key={r}
              className="w-3 h-7 rounded-full border-2 border-slate-500 bg-gradient-to-b from-white via-slate-200 to-slate-400 shadow-xs"
            />
          ))}
        </div>

        {/* Calendar Card Body */}
        <div
          className="w-full h-full rounded-2xl overflow-hidden flex flex-col border-2 border-slate-300/90"
          style={{ backgroundColor: paperColor }}
        >
          <div
            className="h-[34%] flex items-end justify-center pb-2 text-white font-bold tracking-[0.18em] text-xl uppercase"
            style={{
              background: `linear-gradient(180deg, ${headerColor} 0%, #1D4ED8 100%)`,
            }}
          >
            {month}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative px-2">
            <div
              className="font-black leading-none tracking-tight tabular-nums"
              style={{
                fontSize: '64px',
                color: accent,
                fontFamily: 'Outfit, Plus Jakarta Sans, sans-serif',
              }}
            >
              {day}
            </div>
            <div
              className="text-[10px] font-bold tracking-[0.2em] uppercase mt-1 opacity-75"
              style={{ color: accent }}
            >
              {yearNote}
            </div>
            {/* Curled page bottom accent */}
            <div
              className="absolute bottom-0 right-0 w-7 h-7"
              style={{
                background: 'linear-gradient(135deg, #E2E8F0 45%, #94A3B8 100%)',
                clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (componentKey === 'y2k-collage-sticker') {
    const kind = String(props.stickerKind || 'vinyl-disc');
    const label = String(props.label || 'BDAY MIX');
    const tint = String(props.tintColor || '#254C9E');
    const accent = String(props.accentColor || '#78B7FF');

    if (kind === 'vinyl-disc') {
      return (
        <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible select-none">
          <defs>
            <radialGradient id={`${uid}-vinyl`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="68%" stopColor="#090D16" />
              <stop offset="92%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <linearGradient id={`${uid}-sheen`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
              <stop offset="35%" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="65%" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.34)" />
            </linearGradient>
          </defs>
          <circle cx="110" cy="110" r="102" fill={`url(#${uid}-vinyl)`} stroke="#475569" strokeWidth="2" />
          {[88, 76, 64, 52].map((r) => (
            <circle key={r} cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          ))}
          <circle cx="110" cy="110" r="98" fill={`url(#${uid}-sheen)`} />
          <circle cx="110" cy="110" r="36" fill={accent} stroke="#FFFFFF" strokeWidth="2" />
          <text x="110" y="99" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="800" letterSpacing="1">
            {label.slice(0, 12)}
          </text>
          <text x="110" y="130" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="700">
            33 RPM
          </text>
          <circle cx="110" cy="110" r="7" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );
    }

    if (kind === 'camcorder') {
      return (
        <svg viewBox="0 0 240 170" className="w-full h-full overflow-visible select-none">
          <defs>
            <linearGradient id={`${uid}-cam`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="55%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor={tint} />
            </linearGradient>
          </defs>
          {/* Flip screen */}
          <rect x="96" y="16" width="102" height="58" rx="9" fill="#1E293B" stroke="#CBD5E1" strokeWidth="3" transform="rotate(-8 147 45)" />
          <rect x="106" y="24" width="82" height="42" rx="4" fill={accent} opacity="0.85" transform="rotate(-8 147 45)" />
          {/* Body */}
          <rect x="46" y="54" width="166" height="92" rx="18" fill={`url(#${uid}-cam)`} stroke="#334155" strokeWidth="2.5" />
          <rect x="148" y="64" width="52" height="72" rx="12" fill={tint} opacity="0.9" />
          {/* Lens assembly */}
          <circle cx="64" cy="100" r="44" fill="#334155" stroke="#E2E8F0" strokeWidth="4" />
          <circle cx="64" cy="100" r="32" fill="#0F172A" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="64" cy="100" r="20" fill="#1E3A8A" />
          <circle cx="55" cy="90" r="7" fill="rgba(255,255,255,0.68)" />
          <circle cx="182" cy="78" r="5" fill="#EF4444" />
        </svg>
      );
    }

    if (kind === 'rotary-phone') {
      return (
        <svg viewBox="0 0 220 200" className="w-full h-full overflow-visible select-none">
          <defs>
            <linearGradient id={`${uid}-phone`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accent} />
              <stop offset="50%" stopColor={tint} />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          {/* Curly cord */}
          <path
            d="M28 164 C10 144 26 126 16 108 C6 90 26 78 24 60"
            fill="none"
            stroke="#1E293B"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Base body */}
          <path d="M40 74 L178 74 L204 166 C206 178 196 186 184 186 L34 186 C22 186 14 176 18 164 Z" fill={`url(#${uid}-phone)`} stroke="#E2E8F0" strokeWidth="2" />
          {/* Handset on cradle */}
          <path
            d="M20 50 C52 14 166 14 198 50 C208 62 198 78 182 76 L158 72 L154 56 C126 48 92 48 64 56 L60 72 L36 76 C20 78 10 62 20 50 Z"
            fill={tint}
            stroke="#CBD5E1"
            strokeWidth="2.5"
          />
          {/* Rotary dial */}
          <circle cx="110" cy="132" r="40" fill="#E2E8F0" stroke="#475569" strokeWidth="2.5" />
          <circle cx="110" cy="132" r="20" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const hx = 110 + Math.cos(rad) * 30;
            const hy = 132 + Math.sin(rad) * 30;
            return <circle key={deg} cx={hx} cy={hy} r="4.5" fill="#1E293B" />;
          })}
        </svg>
      );
    }

    if (kind === 'phone-handset') {
      return (
        <svg viewBox="0 0 180 220" className="w-full h-full overflow-visible select-none">
          <defs>
            <linearGradient id={`${uid}-handset`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="55%" stopColor={tint} />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>
          <path
            d="M120 180 C142 192 128 206 146 216"
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M44 26 C64 16 86 24 90 46 C92 60 80 68 74 74 C66 96 76 124 96 142 C104 140 116 138 128 148 C142 162 136 186 118 194 C94 204 54 176 34 128 C14 80 20 38 44 26 Z"
            fill={`url(#${uid}-handset)`}
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          <ellipse cx="64" cy="48" rx="14" ry="8" fill="rgba(255,255,255,0.45)" transform="rotate(-25 64 48)" />
        </svg>
      );
    }

    if (kind === 'denim-star') {
      return (
        <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible select-none">
          <defs>
            <linearGradient id={`${uid}-denim`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F79B8" />
              <stop offset="100%" stopColor={tint} />
            </linearGradient>
          </defs>
          <polygon
            points="70,8 88,48 132,52 98,82 108,126 70,102 32,126 42,82 8,52 52,48"
            fill={`url(#${uid}-denim)`}
            stroke="#1E3A8A"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon
            points="70,18 84,50 119,54 92,78 100,113 70,94 40,113 48,78 21,54 56,50"
            fill="none"
            stroke="#DBEAFE"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (kind === 'chrome-star') {
      return (
        <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible select-none">
          <defs>
            <linearGradient id={`${uid}-chrome-star`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#CBD5E1" />
              <stop offset="75%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>
          <polygon
            points="70,6 88,48 134,52 99,82 110,128 70,103 30,128 41,82 6,52 52,48"
            fill={`url(#${uid}-chrome-star)`}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon
            points="70,18 82,50 116,54 90,76 98,108 70,90 42,108 50,76 24,54 58,50"
            fill="rgba(255,255,255,0.36)"
          />
        </svg>
      );
    }

    if (kind === 'glass-heart') {
      return (
        <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible select-none">
          <defs>
            <radialGradient id={`${uid}-heart`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.88)" />
              <stop offset="55%" stopColor="rgba(147,197,253,0.45)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0.58)" />
            </radialGradient>
          </defs>
          <path
            d="M70 122 C70 122 14 88 14 48 C14 27 30 14 48 14 C60 14 67 21 70 28 C73 21 80 14 92 14 C110 14 126 27 126 48 C126 88 70 122 70 122 Z"
            fill={`url(#${uid}-heart)`}
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="2.5"
          />
          <ellipse cx="44" cy="40" rx="12" ry="7" fill="rgba(255,255,255,0.65)" transform="rotate(-30 44 40)" />
        </svg>
      );
    }

    if (kind === 'soap-bubble') {
      return (
        <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible select-none">
          <defs>
            <radialGradient id={`${uid}-bubble`} cx="34%" cy="30%" r="68%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="55%" stopColor="rgba(186,230,253,0.22)" />
              <stop offset="86%" stopColor="rgba(167,243,208,0.45)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.88)" />
            </radialGradient>
          </defs>
          <circle cx="70" cy="70" r="62" fill={`url(#${uid}-bubble)`} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
          <ellipse cx="46" cy="40" rx="18" ry="9" fill="rgba(255,255,255,0.75)" transform="rotate(-32 46 40)" />
          <circle cx="96" cy="98" r="7" fill="rgba(255,255,255,0.45)" />
        </svg>
      );
    }

    if (kind === 'sparkle-burst') {
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible select-none">
          <path
            d="M60 4 L72 48 L116 60 L72 72 L60 116 L48 72 L4 60 L48 48 Z"
            fill="#FFFFFF"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    // 'meadow-horizon'
    return (
      <svg viewBox="0 0 960 200" preserveAspectRatio="none" className="w-full h-full overflow-visible select-none">
        <defs>
          <linearGradient id={`${uid}-meadow`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8CE562" />
            <stop offset="48%" stopColor="#52B73C" />
            <stop offset="100%" stopColor="#267324" />
          </linearGradient>
        </defs>
        <path
          d="M0 90 Q240 15 500 72 T960 45 L960 200 L0 200 Z"
          fill={`url(#${uid}-meadow)`}
        />
        <path
          d="M0 122 Q300 68 620 118 T960 92 L960 200 L0 200 Z"
          fill="rgba(255,255,255,0.12)"
        />
      </svg>
    );
  }

  return null;
}
