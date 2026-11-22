import type { CustomComponentElement, DesignTokens } from '../../core/schema';
import { Y2KStickerRenderer } from './Y2KStickerRenderer';

interface Props {
  element: CustomComponentElement;
  tokens: DesignTokens;
}

export function CustomComponentView({ element, tokens }: Props) {
  const { componentKey, props } = element;

  if (
    componentKey === 'retro-tv-frame' ||
    componentKey === 'birthday-flip-calendar' ||
    componentKey === 'y2k-collage-sticker' ||
    componentKey === 'cutout-illustration'
  ) {
    return <Y2KStickerRenderer element={element} />;
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
