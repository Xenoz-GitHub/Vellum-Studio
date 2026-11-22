import React, { useEffect, useState } from 'react';
import {
  Copy,
  Flame,
  FolderPlus,
  Heart,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { useAppStore } from '../state/useAppStore';
import { apiFetch } from '../lib/api';
import { SlideCanvas } from '../components/renderer/SlideCanvas';
import type { PresentationDocument } from '../core/schema';

interface PresentationRow {
  id: string;
  title: string;
  description: string;
  category: string;
  themeId: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  isDraft: boolean;
  isDemo: boolean;
  sourceType: string;
  version: number;
  updatedAt: string;
  document: PresentationDocument;
}

export function DashboardPage() {
  const { profile, isDemo, navigate, signInWithGoogle, enterDemoWorkspace } = useAppStore();
  const [decks, setDecks] = useState<PresentationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickPrompt, setQuickPrompt] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'favorites' | 'drafts' | 'imported'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'title'>('updated');
  const [importing, setImporting] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const loadDecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await apiFetch<PresentationRow[]>('/api/presentations');
      setDecks(rows);
    } catch (err: any) {
      setError(err.message || 'Could not load your workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile || isDemo) {
      loadDecks();
    } else {
      setLoading(false);
    }
  }, [profile?.uid, isDemo]);

  const handleCreateBlank = async () => {
    try {
      const created = await apiFetch<PresentationRow>('/api/presentations', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Untitled Presentation',
          category: 'Business',
          themeId: 'warm-atelier',
        }),
      });
      navigate({ page: 'editor', id: created.id });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleQuickPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPrompt.trim()) {
      try {
        sessionStorage.setItem('vellum_quick_prompt', quickPrompt.trim());
      } catch {
        // ignore
      }
    }
    navigate({ page: 'create' });
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportNotice(null);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiFetch<{
        asset: any;
        importedDocument?: PresentationDocument;
        importReport?: { totalSlides: number; preservedTextElements: number; preservedImages: number; warnings: string[] };
      }>('/api/uploads', { method: 'POST', body: form });

      if (res.importedDocument) {
        const created = await apiFetch<PresentationRow>('/api/presentations', {
          method: 'POST',
          body: JSON.stringify({
            title: res.importedDocument.title,
            category: 'Business',
            sourceType: 'import',
            document: res.importedDocument,
          }),
        });
        setImportNotice(
          `Imported "${created.title}" (${res.importReport?.totalSlides || 1} slides, ${res.importReport?.preservedTextElements || 0} text frames, ${res.importReport?.preservedImages || 0} images).`
        );
        await loadDecks();
      } else {
        try {
          sessionStorage.setItem('vellum_initial_asset_id', res.asset.id);
        } catch {
          // ignore
        }
        navigate({ page: 'create' });
      }
    } catch (err: any) {
      setError(err.message || 'Import failed.');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const toggleFavorite = async (deck: PresentationRow) => {
    try {
      const updated = await apiFetch<PresentationRow>(`/api/presentations/${deck.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isFavorite: !deck.isFavorite }),
      });
      setDecks((prev) => prev.map((d) => (d.id === deck.id ? { ...d, isFavorite: updated.isFavorite } : d)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDuplicate = async (deckId: string) => {
    try {
      await apiFetch(`/api/presentations/${deckId}/duplicate`, { method: 'POST' });
      await loadDecks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (deckId: string) => {
    try {
      await apiFetch(`/api/presentations/${deckId}`, { method: 'DELETE' });
      setDecks((prev) => prev.filter((d) => d.id !== deckId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!profile && !isDemo) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <h1 className="font-display text-3xl font-bold">Open Your Studio Workspace</h1>
        <p className="text-[var(--text-secondary)]">
          Sign in with Google to save private decks, custom assets, and streaks—or open the Demo Workspace to try the full editor immediately.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={signInWithGoogle}
            className="px-5 py-3 min-h-[44px] rounded-lg bg-[var(--text-primary)] text-[var(--bg-surface)] text-sm font-semibold"
          >
            Sign In with Google
          </button>
          <button
            type="button"
            onClick={enterDemoWorkspace}
            className="px-5 py-3 min-h-[44px] rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] text-sm font-semibold"
          >
            Enter Demo Workspace
          </button>
        </div>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(decks.map((d) => d.category)))];

  const filtered = decks
    .filter((d) => {
      if (filterTab === 'favorites' && !d.isFavorite) return false;
      if (filterTab === 'drafts' && !d.isDraft) return false;
      if (filterTab === 'imported' && d.sourceType !== 'import') return false;
      if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) =>
      sortBy === 'title'
        ? a.title.localeCompare(b.title)
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header + Quick Prompt */}
      <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[var(--text-secondary)] font-mono-tabular mb-1">
              {isDemo ? 'Demo Workspace (Sample Data)' : `${profile?.displayName}'s Studio`}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Presentations & Briefs
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            {profile?.gamificationEnabled && (
              <div className="flex items-center justify-between sm:justify-start gap-4 px-3.5 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs tabular-nums">
                <span className="flex items-center gap-1.5 font-medium">
                  <Flame className="w-4 h-4 text-[var(--accent)]" />
                  {profile.currentStreak}d streak
                </span>
                <span aria-hidden="true" className="text-[var(--border-strong)]">|</span>
                <span className="font-mono-tabular font-medium">{profile.xp} XP</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:flex items-center gap-2.5">
              <label className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-xs sm:text-sm font-medium cursor-pointer transition-colors whitespace-nowrap">
                <Upload className="w-4 h-4 shrink-0" />
                <span aria-hidden="true" className="truncate">{importing ? 'Importing...' : 'Import PPTX / PDF'}</span>
                <input
                  type="file"
                  aria-label="Import PPTX, PDF, or DOCX presentation file"
                  accept=".pptx,.pdf,.docx,.txt,.md"
                  onChange={handleImportFile}
                  disabled={importing}
                  className="sr-only"
                />
              </label>

              <button
                type="button"
                onClick={handleCreateBlank}
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                Blank Deck
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleQuickPromptSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Describe a presentation topic, audience, or paste brief notes to launch AI synthesis..."
              aria-label="Quick presentation prompt"
              className="w-full h-12 px-4 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-sm focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 h-12 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Create with AI
          </button>
        </form>
      </section>

      {error && (
        <div className="p-4 rounded-lg border border-red-300 bg-red-50 text-red-800 text-sm">{error}</div>
      )}
      {importNotice && (
        <div className="p-4 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-sm">
          {importNotice}
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="grid grid-cols-4 sm:inline-flex w-full sm:w-auto items-center gap-1 p-1 rounded-xl bg-[var(--bg-subtle)] shrink-0">
          {(
            [
              ['all', 'All Decks'],
              ['favorites', 'Favorites'],
              ['drafts', 'Drafts'],
              ['imported', 'Imported'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterTab(key)}
              className={`w-full sm:w-auto text-center px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap truncate ${
                filterTab === key
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 lg:flex-1 lg:justify-end">
          <div className="relative w-full sm:flex-1 lg:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search decks..."
              aria-label="Search presentations"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-sm focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center shrink-0">
            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto h-10 px-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-xs font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <select
              aria-label="Sort presentations"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'updated' | 'title')}
              className="w-full sm:w-auto h-10 px-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-xs font-medium"
            >
              <option value="updated">Recently Updated</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Decks Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-12 text-center space-y-4">
          <FolderPlus className="w-8 h-8 mx-auto text-[var(--text-muted)]" />
          <h2 className="font-display text-xl font-semibold">
            {decks.length === 0 ? 'Your workspace is ready for its first deck' : 'No presentations match this filter'}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            {decks.length === 0
              ? 'Generate slides from a prompt or PDF, start from an editorial template, or import an existing PowerPoint file.'
              : 'Try clearing your search term or switching category filters.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate({ page: 'create' })}
              className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[var(--accent)] text-white text-sm font-semibold"
            >
              Generate Presentation
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: 'templates' })}
              className="px-4 py-2.5 min-h-[44px] rounded-lg border border-[var(--border-hairline)] text-sm font-medium"
            >
              Browse Templates
            </button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((deck) => {
            const firstSlide = deck.document?.slides?.[0];
            return (
              <article
                key={deck.id}
                className="group rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden flex flex-col transition-colors hover:border-[var(--border-strong)]"
              >
                <button
                  type="button"
                  onClick={() => navigate({ page: 'editor', id: deck.id })}
                  className="w-full aspect-video bg-[var(--bg-subtle)] flex items-center justify-center overflow-hidden p-3 text-left"
                  aria-label={`Open ${deck.title} in editor`}
                >
                  {firstSlide && deck.document?.tokens ? (
                    <div className="pointer-events-none">
                      <SlideCanvas
                        slide={firstSlide}
                        tokens={deck.document.tokens}
                        width={deck.document.width || 1280}
                        height={deck.document.height || 720}
                        scale={Number(
                          Math.min(
                            340 / (deck.document.width || 1280),
                            192 / (deck.document.height || 720)
                          ).toFixed(3)
                        )}
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">Open Deck</span>
                  )}
                </button>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)] mb-1">
                      <span>
                        {deck.category} · {(deck.document?.slides || []).length} slides
                        {deck.isDemo ? ' · Demo' : ''}
                      </span>
                      <span className="font-mono-tabular">v{deck.version}</span>
                    </div>
                    <h2 className="font-semibold text-base truncate">{deck.title}</h2>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => navigate({ page: 'editor', id: deck.id })}
                      className="text-xs font-semibold text-[var(--accent)] hover:underline"
                    >
                      Open Editor
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleFavorite(deck)}
                        aria-label={deck.isFavorite ? `Unfavorite ${deck.title}` : `Favorite ${deck.title}`}
                        className={`w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-[var(--bg-subtle)] ${
                          deck.isFavorite ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        <Heart className="w-4 h-4" fill={deck.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(deck.id)}
                        aria-label={`Duplicate ${deck.title}`}
                        className="w-9 h-9 inline-flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(deck.id)}
                        aria-label={`Delete ${deck.title}`}
                        className="w-9 h-9 inline-flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-red-600 hover:bg-[var(--bg-subtle)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
