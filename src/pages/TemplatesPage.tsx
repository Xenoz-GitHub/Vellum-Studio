import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Search, X } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useAppStore } from '../state/useAppStore';
import { SlideCanvas } from '../components/renderer/SlideCanvas';
import type { PresentationDocument } from '../core/schema';

interface TemplateRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  aspectRatio: string;
  themeId: string;
  slideCount: number;
  thumbnailUrl: string;
  authorName: string;
  version: string;
  document: PresentationDocument;
}

export function TemplatesPage() {
  const { profile, isDemo, navigate, enterDemoWorkspace } = useAppStore();
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [previewTpl, setPreviewTpl] = useState<TemplateRecord | null>(null);
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<TemplateRecord[]>('/api/catalog/templates')
      .then((rows) => setTemplates(rows))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleUseTemplate = async (tpl: TemplateRecord) => {
    setCreatingId(tpl.id);
    setError(null);
    try {
      if (!profile && !isDemo) {
        await enterDemoWorkspace();
      }
      const created = await apiFetch<{ id: string }>('/api/presentations', {
        method: 'POST',
        body: JSON.stringify({
          title: tpl.name,
          description: tpl.description,
          category: tpl.category,
          templateId: tpl.id,
        }),
      });
      navigate({ page: 'editor', id: created.id });
    } catch (err: any) {
      setError(err.message || 'Could not create copy from template.');
    } finally {
      setCreatingId(null);
    }
  };

  const categories = ['All', ...Array.from(new Set(templates.map((t) => t.category)))];
  const filtered = templates.filter((t) => {
    if (category !== 'All' && t.category !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Template & Design Library
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
            Curated multi-slide architectures governed by verified design tokens. Preview every slide and duplicate into an editable project.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            aria-label="Search templates"
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[var(--bg-subtle)] w-fit max-w-full overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-lg border border-red-300 bg-red-50 text-red-800 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tpl) => (
            <article
              key={tpl.id}
              className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-video bg-[var(--bg-subtle)] overflow-hidden flex items-center justify-center p-3">
                {tpl.document?.slides?.[0] ? (
                  <SlideCanvas
                    slide={tpl.document.slides[0]}
                    tokens={tpl.document.tokens}
                    width={tpl.document.width}
                    height={tpl.document.height}
                    scale={Number(
                      Math.min(358 / (tpl.document.width || 1280), 200 / (tpl.document.height || 720)).toFixed(3)
                    )}
                  />
                ) : (
                  <img
                    src={tpl.thumbnailUrl}
                    alt={tpl.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="text-xs text-[var(--text-secondary)] mb-1.5">
                    {tpl.category} · {tpl.aspectRatio} · {tpl.slideCount} slides · v{tpl.version}
                  </div>
                  <h2 className="font-semibold text-base mb-1.5">{tpl.name}</h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{tpl.description}</p>
                </div>

                <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewTpl(tpl);
                      setPreviewSlideIdx(0);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-[var(--border-hairline)] text-xs font-medium hover:bg-[var(--bg-subtle)]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUseTemplate(tpl)}
                    disabled={creatingId === tpl.id}
                    className="px-4 py-2 min-h-[40px] rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-50"
                  >
                    {creatingId === tpl.id ? 'Creating...' : 'Use Template'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {previewTpl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${previewTpl.name}`}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl max-w-4xl w-full p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-[var(--text-secondary)] font-mono-tabular mb-1">
                  {previewTpl.category} · {previewTpl.authorName} · v{previewTpl.version}
                </div>
                <h2 className="font-display text-xl font-bold">{previewTpl.name}</h2>
              </div>
              <button
                type="button"
                aria-label="Close template preview"
                onClick={() => setPreviewTpl(null)}
                className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[var(--bg-subtle)] rounded-lg p-4 flex justify-center overflow-x-auto">
              <SlideCanvas
                slide={previewTpl.document.slides[previewSlideIdx] || previewTpl.document.slides[0]}
                tokens={previewTpl.document.tokens}
                width={previewTpl.document.width}
                height={previewTpl.document.height}
                scale={Number(
                  Math.min(
                    (typeof window !== 'undefined' && window.innerWidth < 640 ? 300 : 720) /
                      (previewTpl.document.width || 1280),
                    (typeof window !== 'undefined' && window.innerWidth < 640 ? 220 : 430) /
                      (previewTpl.document.height || 720)
                  ).toFixed(3)
                )}
                animated
                animationKey={previewSlideIdx}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewSlideIdx((i) => Math.max(0, i - 1))}
                  disabled={previewSlideIdx === 0}
                  className="px-3 py-2 min-h-[40px] rounded-lg border border-[var(--border-hairline)] text-xs font-medium disabled:opacity-40 inline-flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="text-xs font-mono-tabular text-[var(--text-secondary)]">
                  Slide {previewSlideIdx + 1} of {previewTpl.document.slides.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPreviewSlideIdx((i) => Math.min(previewTpl.document.slides.length - 1, i + 1))
                  }
                  disabled={previewSlideIdx >= previewTpl.document.slides.length - 1}
                  className="px-3 py-2 min-h-[40px] rounded-lg border border-[var(--border-hairline)] text-xs font-medium disabled:opacity-40 inline-flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleUseTemplate(previewTpl)}
                disabled={creatingId === previewTpl.id}
                className="px-5 py-2.5 min-h-[44px] rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)]"
              >
                {creatingId === previewTpl.id ? 'Creating Copy...' : 'Create Editable Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
