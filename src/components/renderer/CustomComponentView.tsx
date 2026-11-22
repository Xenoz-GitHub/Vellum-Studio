import React, { useState } from 'react';
import type { CustomComponentElement, DesignTokens } from '../../core/schema';
import { Y2KStickerRenderer } from './Y2KStickerRenderer';

interface Props {
  element: CustomComponentElement;
  tokens: DesignTokens;
  scale?: number;
  interactive?: boolean;
  isDropTarget?: boolean;
  isCropping?: boolean;
  onCommitSnapshot?: () => void;
  onUpdateMediaCropLive?: (cropX: number, cropY: number) => void;
  onCommitPropsPatch?: (propsPatch: Record<string, unknown>) => void;
}

export function CustomComponentView({
  element,
  tokens,
  scale,
  interactive,
  isDropTarget,
  isCropping,
  onCommitSnapshot,
  onUpdateMediaCropLive,
  onCommitPropsPatch,
}: Props) {
  const { componentKey, props } = element;
  const [editingDialog, setEditingDialog] = useState(false);

  if (
    componentKey === 'retro-tv-frame' ||
    componentKey === 'photo-frame' ||
    componentKey === 'birthday-flip-calendar' ||
    componentKey === 'y2k-collage-sticker' ||
    componentKey === 'cutout-illustration'
  ) {
    return (
      <Y2KStickerRenderer
        element={element}
        scale={scale}
        interactive={interactive}
        isDropTarget={isDropTarget}
        isCropping={isCropping}
        onCommitSnapshot={onCommitSnapshot}
        onUpdateMediaCropLive={onUpdateMediaCropLive}
      />
    );
  }

  if (componentKey === 'retro-os-dialog') {
    const osStyle = String(props.osStyle || 'win98-classic');
    const isXp = osStyle === 'winxp-luna';
    const variant = String(props.dialogVariant || 'error');
    const title = String(props.title ?? 'SYSTEM ERROR');
    const message = String(props.message ?? 'ERROR_NOT_ENOUGH_MEMORY');
    const primaryBtn = String(props.primaryButton ?? 'OK');
    const secondaryBtn = String(props.secondaryButton ?? '').trim();
    const progress = Math.max(0, Math.min(100, Number(props.progressPercent ?? 55)));
    const titleBarColor = String(props.titleBarColor || (isXp ? '#0054E3' : '#000080'));
    const bodyBg = String(props.bodyBgColor || (isXp ? '#ECE9D8' : '#C0C0C0'));
    const textColor = String(props.textColor || '#111827');

    const bevelStyle: React.CSSProperties = isXp
      ? {
          backgroundColor: bodyBg,
          border: '2px solid #003C9D',
          borderRadius: '8px',
          boxShadow: '0 10px 26px rgba(15, 23, 42, 0.28)',
        }
      : {
          backgroundColor: bodyBg,
          borderTop: '2px solid #FFFFFF',
          borderLeft: '2px solid #FFFFFF',
          borderRight: '2px solid #404040',
          borderBottom: '2px solid #404040',
          boxShadow: 'inset 1px 1px 0 #DFDFDF, inset -1px -1px 0 #808080, 4px 6px 18px rgba(0,0,0,0.22)',
        };

    const btnBevelStyle: React.CSSProperties = isXp
      ? {
          background: 'linear-gradient(180deg, #FFFFFF 0%, #E5E3D8 100%)',
          border: '1px solid #003C74',
          borderRadius: '4px',
          color: textColor,
        }
      : {
          backgroundColor: bodyBg,
          borderTop: '2px solid #FFFFFF',
          borderLeft: '2px solid #FFFFFF',
          borderRight: '2px solid #404040',
          borderBottom: '2px solid #404040',
          color: textColor,
        };

    const renderVariantIcon = () => {
      if (variant === 'warning') {
        return (
          <svg viewBox="0 0 48 48" className="w-11 h-11 shrink-0">
            <polygon points="24,4 45,42 3,42" fill="#FACC15" stroke="#111827" strokeWidth="2.2" strokeLinejoin="round" />
            <rect x="22" y="16" width="4" height="14" rx="1" fill="#111827" />
            <circle cx="24" cy="35" r="2.4" fill="#111827" />
          </svg>
        );
      }
      if (variant === 'success') {
        return (
          <svg viewBox="0 0 48 48" className="w-11 h-11 shrink-0">
            <circle cx="24" cy="24" r="20" fill="#16A34A" stroke="#14532D" strokeWidth="1.5" />
            <path d="M14 24 L21 31 L34 17" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      }
      if (variant === 'info') {
        return (
          <svg viewBox="0 0 48 48" className="w-11 h-11 shrink-0">
            <circle cx="24" cy="24" r="20" fill="#2563EB" stroke="#1E3A8A" strokeWidth="1.5" />
            <circle cx="24" cy="15" r="2.6" fill="#FFFFFF" />
            <rect x="21.5" y="21" width="5" height="14" rx="2" fill="#FFFFFF" />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 48 48" className="w-11 h-11 shrink-0">
          <circle cx="24" cy="24" r="20" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5" />
          <path d="M15 15 L33 33 M33 15 L15 33" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );
    };

    return (
      <div
        onDoubleClick={(e) => {
          if (!interactive || element.locked) return;
          e.stopPropagation();
          setEditingDialog(true);
        }}
        className="w-full h-full flex flex-col overflow-hidden select-none"
        style={bevelStyle}
      >
        {/* OS Title Bar */}
        <div
          className="h-8 px-2.5 flex items-center justify-between gap-2 shrink-0"
          style={{
            background: `linear-gradient(90deg, ${titleBarColor} 0%, ${isXp ? '#3B8CF7' : '#1084D0'} 100%)`,
          }}
        >
          {editingDialog ? (
            <input
              type="text"
              value={title}
              autoFocus
              onPointerDown={(e) => e.stopPropagation()}
              onChange={(e) => onCommitPropsPatch?.({ title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Escape' || e.key === 'Enter') setEditingDialog(false);
              }}
              aria-label="Edit error dialog title"
              className="flex-1 min-w-0 bg-white/95 text-neutral-900 text-xs font-bold px-1.5 py-0.5 rounded-xs outline-none"
            />
          ) : (
            <span className="text-white font-bold text-xs tracking-wide truncate">{title}</span>
          )}
          <div className="flex items-center gap-1 shrink-0">
            <span
              className="w-4 h-4 flex items-center justify-center text-[10px] font-bold leading-none"
              style={
                isXp
                  ? { backgroundColor: '#2563EB', color: '#FFFFFF', border: '1px solid #FFFFFF', borderRadius: '2px' }
                  : { ...btnBevelStyle, borderWidth: '1px' }
              }
            >
              _
            </span>
            <span
              className="w-4 h-4 flex items-center justify-center text-[10px] font-bold leading-none"
              style={
                isXp
                  ? { backgroundColor: '#DC2626', color: '#FFFFFF', border: '1px solid #FFFFFF', borderRadius: '2px' }
                  : { ...btnBevelStyle, borderWidth: '1px' }
              }
            >
              ×
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 flex flex-col justify-between p-4 gap-3 min-h-0">
          {variant === 'progress' ? (
            <div className="flex-1 flex flex-col justify-center gap-2.5">
              {editingDialog ? (
                <textarea
                  rows={2}
                  value={message}
                  onPointerDown={(e) => e.stopPropagation()}
                  onChange={(e) => onCommitPropsPatch?.({ message: e.target.value })}
                  aria-label="Edit error dialog message"
                  className="w-full bg-white text-neutral-900 text-xs p-1.5 border border-slate-400 outline-none resize-none"
                />
              ) : (
                <div className="text-xs font-medium whitespace-pre-wrap break-words" style={{ color: textColor }}>
                  {message}
                </div>
              )}
              <div className="w-full h-5 bg-white border border-neutral-500 p-0.5">
                <div className="h-full" style={{ width: `${progress}%`, backgroundColor: titleBarColor }} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-4 min-h-0">
              {renderVariantIcon()}
              {editingDialog ? (
                <textarea
                  rows={3}
                  value={message}
                  onPointerDown={(e) => e.stopPropagation()}
                  onChange={(e) => onCommitPropsPatch?.({ message: e.target.value })}
                  aria-label="Edit error dialog message"
                  className="flex-1 bg-white text-neutral-900 text-xs p-1.5 border border-slate-400 outline-none resize-none"
                />
              ) : (
                <div
                  className="flex-1 text-sm leading-snug font-medium whitespace-pre-wrap break-words"
                  style={{ color: textColor }}
                >
                  {message}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 shrink-0">
            {editingDialog ? (
              <>
                <input
                  type="text"
                  value={primaryBtn}
                  onPointerDown={(e) => e.stopPropagation()}
                  onChange={(e) => onCommitPropsPatch?.({ primaryButton: e.target.value })}
                  aria-label="Primary button text"
                  className="w-24 h-7 px-2 text-center text-xs font-semibold bg-white border border-slate-500"
                />
                <input
                  type="text"
                  value={secondaryBtn}
                  placeholder="Optional 2nd"
                  onPointerDown={(e) => e.stopPropagation()}
                  onChange={(e) => onCommitPropsPatch?.({ secondaryButton: e.target.value })}
                  aria-label="Secondary button text"
                  className="w-24 h-7 px-2 text-center text-xs font-semibold bg-white border border-slate-500"
                />
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => setEditingDialog(false)}
                  className="px-2.5 h-7 rounded bg-[#7D1935] text-white text-[11px] font-semibold"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <div
                  className="min-w-[88px] px-4 py-1.5 text-center text-xs font-semibold"
                  style={btnBevelStyle}
                >
                  {primaryBtn || 'OK'}
                </div>
                {secondaryBtn && (
                  <div
                    className="min-w-[88px] px-4 py-1.5 text-center text-xs font-semibold"
                    style={btnBevelStyle}
                  >
                    {secondaryBtn}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const accent = String(props.accentColor || tokens.colors.accent);
  const surface = tokens.colors.surface;
  const ink = tokens.colors.ink;
  const muted = tokens.colors.muted;
  const border = tokens.colors.border;

  if (componentKey === 'editorial-kpi-card') {
    return (
      <div
        className="w-full h-full flex flex-col justify-between p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(155deg, ${surface} 0%, ${tokens.colors.accentSoft} 100%)`,
          border: `1px solid ${border}`,
          borderTop: `3px solid ${accent}`,
          borderRadius: `${tokens.radius.card}px`,
          color: ink,
        }}
      >
        <div
          className="text-xs font-medium tracking-wider uppercase"
          style={{ color: muted, fontFamily: tokens.typography.monoFont }}
        >
          {String(props.label || 'Metric')}
        </div>
        <div
          className="text-5xl font-bold tracking-tight tabular-nums my-2"
          style={{ color: accent, fontFamily: tokens.typography.displayFont }}
        >
          {String(props.value || '0')}
        </div>
        <div>
          <div className="text-sm font-medium leading-snug" style={{ color: ink }}>
            {String(props.delta || '')}
          </div>
          {props.footnote ? (
            <div
              className="text-xs mt-2 pt-2"
              style={{ color: muted, borderTop: `1px solid ${border}`, fontFamily: tokens.typography.monoFont }}
            >
              {String(props.footnote)}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (componentKey === 'milestone-timeline') {
    const rawStages = Array.isArray(props.stages) ? props.stages.map(String) : [];
    const stages = rawStages.map((line) => {
      const [phase = 'Phase', date = '', summary = ''] = line.split('|').map((s) => s.trim());
      return { phase, date, summary };
    });

    return (
      <div
        className="w-full h-full flex flex-col justify-between p-6"
        style={{
          backgroundColor: surface,
          border: `1px solid ${border}`,
          borderRadius: `${tokens.radius.card}px`,
          color: ink,
        }}
      >
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${border}` }}>
          <span className="text-base font-semibold" style={{ fontFamily: tokens.typography.displayFont }}>
            {String(props.heading || 'Milestone Roadmap')}
          </span>
          <span className="text-xs tabular-nums" style={{ color: muted, fontFamily: tokens.typography.monoFont }}>
            {stages.length} Phases
          </span>
        </div>
        <div
          className="grid gap-5 pt-4 flex-1"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, stages.length)}, minmax(0, 1fr))` }}
        >
          {stages.map((st, idx) => (
            <div key={idx} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: accent }}
                  />
                  <span className="text-xs font-semibold tabular-nums" style={{ color: accent, fontFamily: tokens.typography.monoFont }}>
                    {st.date || `Stage ${idx + 1}`}
                  </span>
                </div>
                <div className="text-sm font-semibold mb-1.5">{st.phase}</div>
                <div className="text-xs leading-relaxed" style={{ color: muted }}>
                  {st.summary}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (componentKey === 'comparison-matrix') {
    const leftItems = Array.isArray(props.leftItems) ? props.leftItems.map(String) : [];
    const rightItems = Array.isArray(props.rightItems) ? props.rightItems.map(String) : [];
    return (
      <div className="w-full h-full grid grid-cols-2 gap-6">
        <div
          className="p-6 flex flex-col"
          style={{
            backgroundColor: surface,
            border: `1px solid ${border}`,
            borderRadius: `${tokens.radius.card}px`,
            color: ink,
          }}
        >
          <div
            className="text-xs font-semibold uppercase tracking-wider pb-3 mb-4"
            style={{ color: muted, borderBottom: `1px solid ${border}`, fontFamily: tokens.typography.monoFont }}
          >
            {String(props.leftTitle || 'Option A')}
          </div>
          <ul className="space-y-3 text-sm leading-relaxed">
            {leftItems.map((it, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-xs mt-1 tabular-nums" style={{ color: muted, fontFamily: tokens.typography.monoFont }}>
                  0{i + 1}
                </span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="p-6 flex flex-col"
          style={{
            backgroundColor: surface,
            border: `1.5px solid ${accent}`,
            borderRadius: `${tokens.radius.card}px`,
            color: ink,
          }}
        >
          <div
            className="text-xs font-semibold uppercase tracking-wider pb-3 mb-4"
            style={{ color: accent, borderBottom: `1px solid ${border}`, fontFamily: tokens.typography.monoFont }}
          >
            {String(props.rightTitle || 'Option B')}
          </div>
          <ul className="space-y-3 text-sm leading-relaxed">
            {rightItems.map((it, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-xs mt-1 font-semibold tabular-nums" style={{ color: accent, fontFamily: tokens.typography.monoFont }}>
                  0{i + 1}
                </span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (componentKey === 'quote-pullout') {
    const compact = element.height < 260;
    return (
      <div
        className={`w-full h-full flex flex-col justify-between overflow-hidden ${compact ? 'p-5' : 'p-8'}`}
        style={{
          backgroundColor: surface,
          border: `1px solid ${border}`,
          borderRadius: `${tokens.radius.card}px`,
          color: ink,
        }}
      >
        <div
          className={`${compact ? 'text-3xl' : 'text-4xl'} leading-none font-serif shrink-0`}
          style={{ color: accent }}
        >
          &ldquo;
        </div>
        <blockquote
          className={`${compact ? 'text-lg my-1.5' : 'text-2xl my-3'} leading-snug font-medium`}
          style={{ fontFamily: tokens.typography.displayFont }}
        >
          {String(props.quote || '')}
        </blockquote>
        <div
          className={`flex items-center gap-2.5 shrink-0 ${compact ? 'pt-2.5' : 'pt-4'}`}
          style={{ borderTop: `1px solid ${border}` }}
        >
          <span className="text-sm font-semibold truncate">{String(props.author || '')}</span>
          {props.role ? (
            <>
              <span aria-hidden="true" style={{ color: muted }}>·</span>
              <span className="text-xs truncate" style={{ color: muted }}>{String(props.role)}</span>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  if (componentKey === 'process-chevron-flow') {
    const rawSteps = Array.isArray(props.steps) ? props.steps.map(String) : [];
    const steps = rawSteps.map((s) => {
      const [title = 'Step', outcome = ''] = s.split('|').map((p) => p.trim());
      return { title, outcome };
    });
    return (
      <div
        className="w-full h-full grid gap-5"
        style={{ gridTemplateColumns: `repeat(${Math.max(1, steps.length)}, minmax(0, 1fr))` }}
      >
        {steps.map((st, idx) => (
          <div
            key={idx}
            className="p-5 flex flex-col justify-between"
            style={{
              backgroundColor: surface,
              border: `1px solid ${border}`,
              borderRadius: `${tokens.radius.card}px`,
              color: ink,
            }}
          >
            <div className="text-xs font-semibold tabular-nums mb-2" style={{ color: accent, fontFamily: tokens.typography.monoFont }}>
              STEP 0{idx + 1}
            </div>
            <div className="text-base font-semibold mb-2" style={{ fontFamily: tokens.typography.displayFont }}>
              {st.title}
            </div>
            <div className="text-xs leading-relaxed" style={{ color: muted }}>
              {st.outcome}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (componentKey === 'source-citation-bar') {
    return (
      <div
        className="w-full h-full px-4 flex items-center justify-between text-xs"
        style={{
          backgroundColor: surface,
          border: `1px solid ${border}`,
          borderRadius: `${tokens.radius.control}px`,
          color: muted,
          fontFamily: tokens.typography.monoFont,
        }}
      >
        <div className="flex items-center gap-2 truncate">
          <span style={{ color: ink, fontWeight: 600 }}>Source:</span>
          <span className="truncate">{String(props.sourceName || 'Document')}</span>
          <span aria-hidden="true">/</span>
          <span className="truncate">{String(props.section || '')}</span>
        </div>
        <span className="shrink-0 ml-3">{String(props.verifiedDate || '')}</span>
      </div>
    );
  }

  // Generic declarative fallback for admin-registered custom components
  return (
    <div
      className="w-full h-full p-5 flex flex-col justify-between overflow-hidden"
      style={{
        backgroundColor: surface,
        border: `1px solid ${border}`,
        borderRadius: `${tokens.radius.card}px`,
        color: ink,
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent, fontFamily: tokens.typography.monoFont }}>
        {element.name || componentKey}
      </div>
      <div className="space-y-1.5 text-xs mt-2 overflow-hidden">
        {Object.entries(props)
          .filter(([k]) => k !== 'accentColor')
          .slice(0, 4)
          .map(([k, v]) => (
            <div key={k} className="truncate">
              <span className="font-medium">{k}: </span>
              <span style={{ color: muted }}>{Array.isArray(v) ? v.join(', ') : String(v)}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
