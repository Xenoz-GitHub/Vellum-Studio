import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Copy, Lock, Maximize2, Minimize2, Save } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useAppStore } from '../state/useAppStore';
import { SlideCanvas } from '../components/renderer/SlideCanvas';
import type { PresentationDocument } from '../core/schema';

export function ShareViewPage({ token }: { token: string }) {
  const { navigate, profile, isDemo, enterDemoWorkspace } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [doc, setDoc] = useState<PresentationDocument | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch<any>(`/api/share/${token}`)
      .then((res) => {
        if (res.requiresPassword) {
          setRequiresPassword(true);
          setPermission(res.permission);
        } else {
          setPermission(res.permission);
          setDoc(res.presentation.document);
        }
      })
      .catch((err) => setError(err.message || 'Share link unavailable.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiFetch<any>(`/api/share/${token}/verify`, {
        method: 'POST',
        body: JSON.stringify({ password: passwordInput }),
      });
      setRequiresPassword(false);
      setPermission(res.permission);
      setDoc(res.presentation.document);
    } catch (err: any) {
      setError(err.message || 'Invalid password.');
    }
  };

  const handleSaveSharedEdit = async () => {
    if (!doc) return;
    setSaving(true);
    setNotice(null);
    try {
      await apiFetch(`/api/share/${token}/document`, {
        method: 'PUT',
        body: JSON.stringify({ document: doc }),
      });
      setNotice('Collaborative changes saved.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateToWorkspace = async () => {
    if (!doc) return;
    try {
      if (!profile && !isDemo) await enterDemoWorkspace();
      const created = await apiFetch<{ id: string }>('/api/presentations', {
        method: 'POST',
        body: JSON.stringify({
          title: `${doc.title} (Copy)`,
          description: doc.description,
          category: doc.category,
          document: doc,
        }),
      });
      navigate({ page: 'editor', id: created.id });
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-[var(--text-secondary)]">Loading shared presentation...</div>;
  }

  if (requiresPassword) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <form onSubmit={handleUnlock} className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <Lock className="w-5 h-5 text-[var(--accent)]" /> Password Protected Deck
          </div>
          {error && <div className="text-xs text-red-600">{error}</div>}
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter link password"
            aria-label="Share link password"
            className="w-full h-11 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-sm"
          />
          <button type="submit" className="w-full h-11 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold">
            Unlock Presentation
          </button>
        </form>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-3">
        <h1 className="font-display text-2xl font-bold">Link Unavailable</h1>
        <p className="text-sm text-[var(--text-secondary)]">{error || 'This presentation link is invalid or expired.'}</p>
      </div>
    );
  }

  const currentSlide = doc.slides[slideIdx] || doc.slides[0];

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-neutral-950 text-white p-6 flex flex-col' : 'max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono-tabular opacity-70">
            Shared Link · {permission === 'edit' ? 'Collaborative Edit Enabled' : 'Read-Only View'}
          </div>
          <h1 className="font-display text-xl font-bold">{doc.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {permission === 'edit' && (
            <button
              type="button"
              onClick={handleSaveSharedEdit}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg bg-[var(--accent)] text-white text-xs font-semibold"
            >
              <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Shared Edits'}
            </button>
          )}
          <button
            type="button"
            onClick={handleDuplicateToWorkspace}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg border border-[var(--border-hairline)] text-xs font-medium"
          >
            <Copy className="w-3.5 h-3.5" /> Duplicate to Workspace
          </button>
          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg border border-[var(--border-hairline)] text-xs font-medium"
          >
            {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {fullscreen ? 'Exit' : 'Present'}
          </button>
        </div>
      </div>

      {notice && <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">{notice}</div>}

      <div className="flex-1 flex items-center justify-center bg-[var(--bg-subtle)] rounded-xl p-4 sm:p-8 overflow-auto">
        <SlideCanvas
          slide={currentSlide}
          tokens={doc.tokens}
          width={doc.width}
          height={doc.height}
          scale={Number(
            Math.min(
              (fullscreen ? (typeof window !== 'undefined' ? window.innerWidth - 96 : 1100) : typeof window !== 'undefined' && window.innerWidth < 640 ? 320 : 880) / doc.width,
              (fullscreen ? (typeof window !== 'undefined' ? window.innerHeight - 180 : 620) : typeof window !== 'undefined' && window.innerWidth < 640 ? 240 : 520) / doc.height
            ).toFixed(3)
          )}
          animated
          animationKey={slideIdx}
          interactive={permission === 'edit'}
          onUpdateElementLive={(elId, patch) => {
            if (permission !== 'edit') return;
            setDoc({
              ...doc,
              slides: doc.slides.map((s) =>
                s.id !== currentSlide.id
                  ? s
                  : { ...s, elements: s.elements.map((e) => (e.id === elId ? ({ ...e, ...patch } as any) : e)) }
              ),
            });
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
          disabled={slideIdx === 0}
          className="px-4 py-2 min-h-[44px] rounded-lg border border-[var(--border-hairline)] text-xs font-medium disabled:opacity-40 inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <span className="text-xs font-mono-tabular">
          Slide {slideIdx + 1} / {doc.slides.length}
        </span>
        <button
          type="button"
          onClick={() => setSlideIdx((i) => Math.min(doc.slides.length - 1, i + 1))}
          disabled={slideIdx >= doc.slides.length - 1}
          className="px-4 py-2 min-h-[44px] rounded-lg border border-[var(--border-hairline)] text-xs font-medium disabled:opacity-40 inline-flex items-center gap-1"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
