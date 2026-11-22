import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  FileText,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useAppStore } from '../state/useAppStore';
import type { DesignTokens, SlideOutlineItem } from '../core/schema';
import { DESIGN_TOKEN_PRESETS } from '../core/seed-data';

interface UploadedAssetItem {
  id: string;
  filename: string;
  mimeType: string;
  kind: string;
  publicUrl: string;
  extractedText: string;
}

interface OutlinePlan {
  title: string;
  description: string;
  audience: string;
  tone: string;
  suggestedThemeId: string;
  referenceObservations?: {
    visualDirection: string;
    extractedColors: string[];
    layoutRhythm: string;
  };
  outline: SlideOutlineItem[];
  sourceRefs: { sourceId: string; filename: string; excerpt: string }[];
}

export function GeneratorStudioPage() {
  const { profile, isDemo, navigate, enterDemoWorkspace } = useAppStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [prompt, setPrompt] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vellum_quick_prompt') || '';
      if (saved) sessionStorage.removeItem('vellum_quick_prompt');
      return saved;
    } catch {
      return '';
    }
  });
  const [category, setCategory] = useState('Business');
  const [slideCount, setSlideCount] = useState(6);
  const [referenceMode, setReferenceMode] = useState('inspiration');
  const [referenceNotes, setReferenceNotes] = useState('');

  const [sourceAssets, setSourceAssets] = useState<UploadedAssetItem[]>([]);
  const [referenceAssets, setReferenceAssets] = useState<UploadedAssetItem[]>([]);
  const [uploadingSource, setUploadingSource] = useState(false);
  const [uploadingRef, setUploadingRef] = useState(false);

  const [generatingOutline, setGeneratingOutline] = useState(false);
  const [composingDeck, setComposingDeck] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [jobId, setJobId] = useState<string | undefined>();
  const [plan, setPlan] = useState<OutlinePlan | null>(null);
  const [tokenSets, setTokenSets] = useState<Array<{ id: string; name: string; tokens: DesignTokens }>>([]);
  const [selectedThemeId, setSelectedThemeId] = useState('warm-atelier');
  const [allowCustomComponents, setAllowCustomComponents] = useState(true);

  useEffect(() => {
    apiFetch<Array<{ id: string; name: string; tokens: DesignTokens }>>('/api/catalog/tokens')
      .then((rows) => setTokenSets(rows))
      .catch(() => {
        setTokenSets(DESIGN_TOKEN_PRESETS.map((t) => ({ id: t.id, name: t.name, tokens: t })));
      });
  }, []);

  const ensureWorkspaceSession = async () => {
    if (!profile && !isDemo) {
      await enterDemoWorkspace();
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'source' | 'reference') => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError(null);
    if (target === 'source') setUploadingSource(true);
    else setUploadingRef(true);

    try {
      await ensureWorkspaceSession();
      for (const file of files) {
        const form = new FormData();
        form.append('file', file);
        const res = await apiFetch<{ asset: any; publicUrl: string }>('/api/uploads', {
          method: 'POST',
          body: form,
        });
        const item: UploadedAssetItem = {
          id: res.asset.id,
          filename: res.asset.filename,
          mimeType: res.asset.mimeType,
          kind: res.asset.kind,
          publicUrl: res.publicUrl,
          extractedText: res.asset.extractedText || '',
        };
        if (target === 'source') setSourceAssets((prev) => [...prev, item]);
        else setReferenceAssets((prev) => [...prev, item]);
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploadingSource(false);
      setUploadingRef(false);
      e.target.value = '';
    }
  };

  const handleGenerateOutline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim().length < 3) {
      setError('Please describe your presentation topic before generating.');
      return;
    }
    setError(null);
    setGeneratingOutline(true);
    try {
      await ensureWorkspaceSession();
      const res = await apiFetch<{ jobId: string; plan: OutlinePlan }>('/api/ai/outline', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          slideCount,
          category,
          referenceMode,
          referenceNotes,
          sourceAssetIds: sourceAssets.map((a) => a.id),
          referenceAssetIds: referenceAssets.map((a) => a.id),
        }),
      });
      setJobId(res.jobId);
      setPlan(res.plan);
      setSelectedThemeId(res.plan.suggestedThemeId || 'warm-atelier');
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'AI outline generation failed.');
    } finally {
      setGeneratingOutline(false);
    }
  };

  const handleStartManualOutline = () => {
    const title = prompt.trim() || 'Structured Presentation Brief';
    setPlan({
      title: title.slice(0, 80),
      description: prompt.trim() || 'Composed from structured outline',
      audience: 'Executive stakeholders',
      tone: 'Analytical and editorial',
      suggestedThemeId: selectedThemeId,
      outline: [
        {
          id: 'slide-1',
          order: 0,
          title: title.slice(0, 64),
          purpose: 'Opening thesis and context',
          layoutPattern: 'title-hero',
          semanticType: 'title',
          keyPoints: ['Core narrative framing', 'Key objective and scope'],
        },
        {
          id: 'slide-2',
          order: 1,
          title: 'Current Landscape & Evidence',
          purpose: 'Baseline facts and findings',
          layoutPattern: 'editorial-columns',
          semanticType: 'context',
          keyPoints: ['Primary baseline observation', 'Key operational constraint', 'Opportunity vector'],
        },
        {
          id: 'slide-3',
          order: 2,
          title: 'Quantitative Trajectory',
          purpose: 'Data breakdown',
          layoutPattern: 'data-chart-split',
          semanticType: 'data',
          keyPoints: ['Quarter-over-quarter progression', 'Measurable efficiency delta'],
        },
        {
          id: 'slide-4',
          order: 3,
          title: 'Delivery Roadmap',
          purpose: 'Phased execution plan',
          layoutPattern: 'timeline-horizontal',
          semanticType: 'timeline',
          keyPoints: ['Phase 1: Discovery', 'Phase 2: Implementation', 'Phase 3: Rollout'],
        },
      ],
      sourceRefs: sourceAssets.map((s) => ({
        sourceId: s.id,
        filename: s.filename,
        excerpt: s.extractedText.slice(0, 160),
      })),
    });
    setError(null);
    setStep(2);
  };

  const updateOutlineSlide = (idx: number, patch: Partial<SlideOutlineItem>) => {
    if (!plan) return;
    const next = plan.outline.map((item, i) => (i === idx ? { ...item, ...patch } : item));
    setPlan({ ...plan, outline: next });
  };

  const moveOutlineSlide = (idx: number, dir: -1 | 1) => {
    if (!plan) return;
    const target = idx + dir;
    if (target < 0 || target >= plan.outline.length) return;
    const next = [...plan.outline];
    const [item] = next.splice(idx, 1);
    next.splice(target, 0, item);
    setPlan({ ...plan, outline: next.map((s, o) => ({ ...s, order: o })) });
  };

  const handleComposePresentation = async () => {
    if (!plan) return;
    setComposingDeck(true);
    setError(null);
    try {
      await ensureWorkspaceSession();
      const imageAssets = [
        ...sourceAssets.filter((a) => a.kind === 'image').map((a) => a.publicUrl),
        ...referenceAssets.filter((a) => a.kind === 'image').map((a) => a.publicUrl),
      ];
      const res = await apiFetch<{ presentation: { id: string } }>('/api/ai/compose', {
        method: 'POST',
        body: JSON.stringify({
          jobId,
          title: plan.title,
          description: plan.description,
          category,
          themeId: selectedThemeId,
          outline: plan.outline,
          imageAssets,
          sourceRefs: plan.sourceRefs,
          allowCustomComponents,
        }),
      });
      navigate({ page: 'editor', id: res.presentation.id });
    } catch (err: any) {
      setError(err.message || 'Failed to compose presentation.');
    } finally {
      setComposingDeck(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate({ page: 'dashboard' })}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Presentation Synthesis Studio
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-tabular">
          {[
            [1, '01. Inputs & Sources'],
            [2, '02. Review Outline'],
            [3, '03. Design Tokens'],
          ].map(([num, label]) => (
            <span
              key={num}
              className={`px-2.5 py-1.5 rounded-md border ${
                step === num
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text-primary)] font-semibold'
                  : 'border-[var(--border-hairline)] text-[var(--text-secondary)]'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-300 bg-red-50 text-red-900 text-sm space-y-2">
          <div className="font-semibold">Synthesis Notice</div>
          <div>{error}</div>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleGenerateOutline} className="space-y-6">
          <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5">
            <div>
              <label htmlFor="deck-prompt" className="block text-sm font-semibold mb-2">
                Presentation Brief or Prompt
              </label>
              <textarea
                id="deck-prompt"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your topic, audience, key claims, data points, or narrative goals..."
                className="w-full p-3.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-sm leading-relaxed focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="deck-category" className="block text-xs font-semibold mb-1.5">
                  Category
                </label>
                <select
                  id="deck-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-sm"
                >
                  {['Business', 'Pitch decks', 'Reports', 'Research', 'Education', 'Editorial', 'Marketing', 'Portfolio'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="slide-count" className="block text-xs font-semibold mb-1.5">
                  Target Slide Count ({slideCount})
                </label>
                <input
                  id="slide-count"
                  type="range"
                  min={3}
                  max={12}
                  value={slideCount}
                  onChange={(e) => setSlideCount(Number(e.target.value))}
                  className="w-full h-11 accent-[var(--accent)]"
                />
              </div>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Source Materials */}
            <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-base">Source Materials</h2>
                  <p className="text-xs text-[var(--text-secondary)]">PDF, DOCX, PPTX, TXT, CSV, or Images</p>
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)] text-xs font-medium cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span aria-hidden="true">{uploadingSource ? 'Uploading...' : 'Add File'}</span>
                  <input
                    type="file"
                    aria-label="Upload source files"
                    multiple
                    accept=".pdf,.docx,.pptx,.txt,.md,.csv,.png,.jpg,.jpeg,.webp,.svg"
                    onChange={(e) => handleUpload(e, 'source')}
                    className="sr-only"
                  />
                </label>
              </div>

              {sourceAssets.length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed border-[var(--border-hairline)] text-center text-xs text-[var(--text-muted)]">
                  Optional: attach research PDFs, Word briefs, or images to ground slides with traceable facts.
                </div>
              ) : (
                <ul className="space-y-2">
                  {sourceAssets.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-[var(--accent)] shrink-0" />
                        <span className="truncate font-medium">{a.filename}</span>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${a.filename}`}
                        onClick={() => setSourceAssets((p) => p.filter((x) => x.id !== a.id))}
                        className="text-[var(--text-muted)] hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Visual References */}
            <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-base">Visual References</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Screenshots, moodboards, or brand assets</p>
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)] text-xs font-medium cursor-pointer">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span aria-hidden="true">{uploadingRef ? 'Uploading...' : 'Add Reference'}</span>
                  <input
                    type="file"
                    aria-label="Upload visual reference images"
                    multiple
                    accept=".png,.jpg,.jpeg,.webp"
                    onChange={(e) => handleUpload(e, 'reference')}
                    className="sr-only"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  aria-label="Reference application mode"
                  value={referenceMode}
                  onChange={(e) => setReferenceMode(e.target.value)}
                  className="col-span-2 h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                >
                  <option value="inspiration">Use references as visual inspiration</option>
                  <option value="match_direction">Match general visual direction</option>
                  <option value="extract_palette">Extract brand palette principles</option>
                  <option value="recreate_structure">Recreate composition rhythm with original content</option>
                </select>
                <input
                  type="text"
                  value={referenceNotes}
                  onChange={(e) => setReferenceNotes(e.target.value)}
                  placeholder="Describe desired visual direction (e.g., high whitespace, Swiss editorial)..."
                  aria-label="Visual direction notes"
                  className="col-span-2 h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                />
              </div>

              {referenceAssets.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {referenceAssets.map((ref) => (
                    <div key={ref.id} className="relative w-16 h-16 rounded-md overflow-hidden border border-[var(--border-hairline)]">
                      <img src={ref.publicUrl} alt={ref.filename} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleStartManualOutline}
              className="px-4 py-3 min-h-[44px] rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] text-sm font-medium hover:bg-[var(--bg-subtle)]"
            >
              Build Outline Manually
            </button>
            <button
              type="submit"
              disabled={generatingOutline}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {generatingOutline ? 'Synthesizing Structured Outline...' : 'Analyze & Generate Outline'}
            </button>
          </div>
        </form>
      )}

      {step === 2 && plan && (
        <section className="space-y-6">
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <label htmlFor="plan-title" className="block text-xs font-mono-tabular text-[var(--text-secondary)] mb-1">
                  DECK TITLE
                </label>
                <input
                  id="plan-title"
                  type="text"
                  value={plan.title}
                  onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                  className="w-full text-xl font-display font-bold bg-transparent border-b border-[var(--border-hairline)] pb-1 focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div className="text-xs text-[var(--text-secondary)] font-mono-tabular">
                {plan.outline.length} slides · Tone: {plan.tone}
              </div>
            </div>

            {plan.referenceObservations && (
              <div className="p-3.5 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-xs space-y-1">
                <div className="font-semibold">Reference Direction Extracted</div>
                <div className="text-[var(--text-secondary)]">
                  {plan.referenceObservations.visualDirection} · Rhythm: {plan.referenceObservations.layoutRhythm}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {plan.outline.map((sl, idx) => (
              <div
                key={sl.id}
                className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 sm:p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-[220px]">
                    <span className="text-xs font-mono-tabular font-semibold text-[var(--accent)]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <input
                      type="text"
                      value={sl.title}
                      aria-label={`Slide ${idx + 1} title`}
                      onChange={(e) => updateOutlineSlide(idx, { title: e.target.value })}
                      className="flex-1 font-semibold text-base bg-transparent border-b border-transparent focus:border-[var(--border-strong)] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      aria-label={`Slide ${idx + 1} layout pattern`}
                      value={sl.layoutPattern}
                      onChange={(e) => updateOutlineSlide(idx, { layoutPattern: e.target.value })}
                      className="h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                    >
                      <option value="title-hero">Title Hero</option>
                      <option value="split-media">Split Media</option>
                      <option value="editorial-columns">Editorial Columns</option>
                      <option value="data-chart-split">Data Chart Split</option>
                      <option value="kpi-trio">KPI Trio</option>
                      <option value="comparison-two-col">Two-Col Comparison</option>
                      <option value="timeline-horizontal">Timeline Roadmap</option>
                      <option value="editorial-quote">Editorial Quote</option>
                    </select>

                    <button
                      type="button"
                      aria-label={`Move slide ${idx + 1} up`}
                      onClick={() => moveOutlineSlide(idx, -1)}
                      disabled={idx === 0}
                      className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-[var(--border-hairline)] disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move slide ${idx + 1} down`}
                      onClick={() => moveOutlineSlide(idx, 1)}
                      disabled={idx === plan.outline.length - 1}
                      className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-[var(--border-hairline)] disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove slide ${idx + 1}`}
                      onClick={() => {
                        if (plan.outline.length <= 1) return;
                        setPlan({
                          ...plan,
                          outline: plan.outline.filter((_, i) => i !== idx).map((s, o) => ({ ...s, order: o })),
                        });
                      }}
                      className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={2}
                  aria-label={`Slide ${idx + 1} key points`}
                  value={sl.keyPoints.join('\n')}
                  onChange={(e) =>
                    updateOutlineSlide(idx, {
                      keyPoints: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  placeholder="One key point per line..."
                  className="w-full p-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 min-h-[44px] rounded-lg border border-[var(--border-hairline)] text-sm font-medium"
              >
                Back to Inputs
              </button>
              <button
                type="button"
                onClick={() =>
                  setPlan({
                    ...plan,
                    outline: [
                      ...plan.outline,
                      {
                        id: `slide-${Date.now()}`,
                        order: plan.outline.length,
                        title: `New Slide ${plan.outline.length + 1}`,
                        purpose: 'Supporting point',
                        layoutPattern: 'editorial-columns',
                        semanticType: 'argument',
                        keyPoints: ['Primary insight'],
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-lg border border-[var(--border-hairline)] text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add Slide
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)]"
            >
              Choose Design Tokens <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {step === 3 && plan && (
        <section className="space-y-6">
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="font-display text-xl font-bold mb-1">Select Design Token System</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                The layout engine composes your outline strictly inside the selected palette, typography roles, and spacing rules.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {(tokenSets.length > 0
                ? tokenSets
                : DESIGN_TOKEN_PRESETS.map((t) => ({ id: t.id, name: t.name, tokens: t }))
              ).map((ts) => {
                const active = selectedThemeId === ts.id;
                const colors = ts.tokens.colors;
                return (
                  <button
                    key={ts.id}
                    type="button"
                    onClick={() => setSelectedThemeId(ts.id)}
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      active
                        ? 'border-[var(--accent)] ring-1 ring-[var(--accent)] bg-[var(--bg-canvas)]'
                        : 'border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-sm">{ts.name}</span>
                      {active && <Check className="w-4 h-4 text-[var(--accent)]" />}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {[colors.background, colors.surface, colors.ink, colors.accent].map((hex, i) => (
                        <span
                          key={i}
                          className="w-7 h-7 rounded-md border border-black/10"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] font-mono-tabular">
                      {ts.tokens.typography.displayFont} / {ts.tokens.typography.bodyFont}
                    </div>
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-3 pt-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={allowCustomComponents}
                onChange={(e) => setAllowCustomComponents(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent)]"
              />
              <span>Map timelines, KPIs, quotes, and comparisons to registered Custom Components</span>
            </label>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 min-h-[44px] rounded-lg border border-[var(--border-hairline)] text-sm font-medium"
            >
              Back to Outline
            </button>
            <button
              type="button"
              onClick={handleComposePresentation}
              disabled={composingDeck}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-50"
            >
              {composingDeck ? 'Composing & Scoring Deck...' : 'Compose Editable Presentation'}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
