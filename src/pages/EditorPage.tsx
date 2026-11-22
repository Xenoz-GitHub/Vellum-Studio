import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileDown,
  Grid,
  History,
  Image as ImageIcon,
  Layers,
  Lock,
  Maximize2,
  Minimize2,
  Palette,
  Play,
  Plus,
  Redo2,
  Save,
  Scissors,
  Share2,
  ShieldCheck,
  Sliders,
  Sparkles,
  Square,
  Table as TableIcon,
  Trash2,
  Type as TypeIcon,
  Undo2,
  Unlock,
  BarChart3,
  X,
} from 'lucide-react';
import { apiDownloadBlob, apiFetch } from '../lib/api';
import { useAppStore } from '../state/useAppStore';
import { useEditorStore } from '../state/useEditorStore';
import { SlideCanvas } from '../components/renderer/SlideCanvas';
import { FloatingElementToolbar } from '../components/editor/FloatingElementToolbar';
import { ImageCutoutModal } from '../components/editor/ImageCutoutModal';
import { StudioLeftDrawer, type StudioRailTab } from '../components/editor/StudioLeftDrawer';
import { BUILTIN_CUSTOM_COMPONENTS, type CustomComponentManifest } from '../core/component-registry';
import { DESIGN_TOKEN_PRESETS, DEFAULT_FONT_ASSETS } from '../core/seed-data';
import { evaluatePresentationQuality, type QualityReport } from '../core/quality-scorer';
import { ICON_CATALOG, SHAPE_CATALOG, type CutoutItemDef } from '../core/svg-cutout-renderer';
import type {
  DesignTokens,
  ElementAnimation,
  PresentationDocument,
  PresentationElement,
  ShapeElement,
} from '../core/schema';

type MobileSheet = null | 'slides' | 'insert' | 'edit' | 'layers' | 'more';

export function EditorPage({ presentationId }: { presentationId: string }) {
  const { navigate, profile, isDemo, enterDemoWorkspace } = useAppStore();
  const {
    document: doc,
    activeSlideId,
    selectedElementIds,
    past,
    future,
    zoom,
    snapToGrid,
    isDirty,
    isSaving,
    lastSavedAt,
    loadDocument,
    selectSlide,
    selectElements,
    setZoom,
    toggleSnapToGrid,
    commitChange,
    updateElementLive,
    commitSnapshot,
    addElement,
    deleteSelectedElements,
    duplicateSelectedElement,
    copySelectedElement,
    pasteElement,
    reorderLayer,
    toggleLockElement,
    addSlide,
    duplicateSlide,
    deleteSlide,
    moveSlide,
    updateSlideBackground,
    updateSlideBackgroundPatch,
    updateSpeakerNotes,
    applyDesignTokens,
    updateTitle,
    undo,
    redo,
    setSavingState,
  } = useEditorStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<StudioRailTab>('slides');
  const [rightTab, setRightTab] = useState<'inspector' | 'layers' | 'theme'>('inspector');
  const [mobileSheet, setMobileSheet] = useState<MobileSheet>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showInsertCompModal, setShowInsertCompModal] = useState(false);
  const [cutoutModalState, setCutoutModalState] = useState<{
    open: boolean;
    targetElementId?: string;
    initialSrc?: string;
    initialOriginalSrc?: string;
  }>({ open: false });
  const [presentMode, setPresentMode] = useState(false);
  const [showNotesInPresent, setShowNotesInPresent] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [componentsCatalog, setComponentsCatalog] = useState<CustomComponentManifest[]>(BUILTIN_CUSTOM_COMPONENTS);
  const [tokenCatalog, setTokenCatalog] = useState<DesignTokens[]>(DESIGN_TOKEN_PRESETS);
  const [fontCatalog, setFontCatalog] = useState<Array<{ family: string; displayName: string }>>(DEFAULT_FONT_ASSETS);

  const [versions, setVersions] = useState<any[]>([]);
  const [shareLinks, setShareLinks] = useState<any[]>([]);
  const [sharePerm, setSharePerm] = useState<'view' | 'edit'>('view');
  const [sharePassword, setSharePassword] = useState('');
  const [shareDays, setShareDays] = useState('7');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [exportingPptx, setExportingPptx] = useState(false);
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 800, height: 600 });

  // Measure center canvas container accurately after loading finishes
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const updateSize = () => {
      setViewportSize({
        width: el.clientWidth,
        height: el.clientHeight,
      });
    };
    updateSize();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateSize) : null;
    ro?.observe(el);
    window.addEventListener('resize', updateSize);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [loading, doc?.id]);

  // Load presentation + catalogs
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!profile && !isDemo) {
          await enterDemoWorkspace();
        }
        const [deckRes, compRes, tokRes, fontRes] = await Promise.all([
          apiFetch<{ presentation: any; versions: any[]; shareLinks: any[] }>(
            `/api/presentations/${presentationId}`
          ),
          apiFetch<any[]>('/api/catalog/components').catch(() => []),
          apiFetch<any[]>('/api/catalog/tokens').catch(() => []),
          apiFetch<any[]>('/api/catalog/fonts').catch(() => []),
        ]);
        if (!mounted) return;
        loadDocument(deckRes.presentation.document);
        setVersions(deckRes.versions || []);
        setShareLinks(deckRes.shareLinks || []);
        if (compRes.length > 0) {
          setComponentsCatalog(
            compRes.map((c) => ({
              componentKey: c.componentKey,
              name: c.name,
              description: c.description,
              category: c.category,
              version: c.version,
              minWidth: c.layoutConstraints?.minWidth || 240,
              minHeight: c.layoutConstraints?.minHeight || 140,
              defaultWidth: c.layoutConstraints?.defaultWidth || 440,
              defaultHeight: c.layoutConstraints?.defaultHeight || 220,
              propertySchema: c.propertySchema || [],
              defaultProps: c.defaultProps || {},
              availability: c.availability || { manual: true, template: true, ai: true, categories: [] },
              enabled: c.enabled,
            }))
          );
        }
        if (tokRes.length > 0) setTokenCatalog(tokRes.map((t) => t.tokens));
        if (fontRes.length > 0) {
          const seen = new Set(fontRes.map((f: any) => f.family));
          setFontCatalog([
            ...fontRes,
            ...DEFAULT_FONT_ASSETS.filter((f) => !seen.has(f.family)),
          ]);
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load presentation.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [presentationId]);

  // Quality evaluation on document change
  useEffect(() => {
    if (!doc) return;
    setQualityReport(evaluatePresentationQuality(doc));
  }, [doc]);

  const handleSave = async (snapshotLabel?: string) => {
    if (!doc) return;
    setSavingState(true);
    try {
      await apiFetch(`/api/presentations/${presentationId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: doc.title,
          document: doc,
          createSnapshotLabel: snapshotLabel,
        }),
      });
      setSavingState(false, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (snapshotLabel) {
        const refreshed = await apiFetch<{ versions: any[] }>(`/api/presentations/${presentationId}`);
        setVersions(refreshed.versions || []);
      }
    } catch (err: any) {
      setSavingState(false);
      setError(err.message || 'Save failed.');
    }
  };

  // Debounced autosave
  useEffect(() => {
    if (!isDirty || !doc) return;
    const timer = setTimeout(() => {
      handleSave();
    }, 1800);
    return () => clearTimeout(timer);
  }, [isDirty, doc]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      if (presentMode) {
        if (e.key === 'Escape') setPresentMode(false);
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          const idx = doc?.slides.findIndex((s) => s.id === activeSlideId) ?? 0;
          if (doc && idx < doc.slides.length - 1) selectSlide(doc.slides[idx + 1].id);
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const idx = doc?.slides.findIndex((s) => s.id === activeSlideId) ?? 0;
          if (doc && idx > 0) selectSlide(doc.slides[idx - 1].id);
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave('Manual save');
        return;
      }
      if (inInput) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c') {
        copySelectedElement();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'v') {
        pasteElement();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelectedElements();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [presentMode, doc, activeSlideId]);

  const activeSlide = useMemo(
    () => doc?.slides.find((s) => s.id === activeSlideId) || doc?.slides[0],
    [doc, activeSlideId]
  );

  const selectedElement = useMemo(
    () => activeSlide?.elements.find((e) => e.id === selectedElementIds[0]) || null,
    [activeSlide, selectedElementIds]
  );

  const responsiveScale = useMemo(() => {
    if (!doc) return 0.65;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    if (isMobile) {
      const availW = Math.max(260, (viewportSize.width || (typeof window !== 'undefined' ? window.innerWidth : 390)) - 28);
      return Number(Math.min(0.8, availW / doc.width).toFixed(3));
    }
    const maxW = Math.max(320, viewportSize.width - 56);
    const maxH = Math.max(240, viewportSize.height - 96);
    const fitScale = Math.min(maxW / doc.width, maxH / doc.height);
    return Number(Math.max(0.32, Math.min(zoom, fitScale)).toFixed(3));
  }, [doc, viewportSize, zoom]);

  const insertTextPresetElement = (preset?: {
    name: string;
    content: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    color: string;
    textShadow?: string;
    backgroundColor?: string;
    borderRadius?: number;
  }) => {
    if (!doc || !activeSlide) return;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: preset?.name || 'Text Block',
      type: 'text',
      x: Math.round(doc.width * 0.12),
      y: Math.round(doc.height * 0.22),
      width: Math.min(doc.width - 160, 560),
      height: preset && preset.fontSize >= 36 ? 120 : 100,
      rotation: 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      content: preset?.content || 'Double-click to edit this text block.',
      fontFamily: preset?.fontFamily || doc.tokens.typography.bodyFont,
      fontSize: preset?.fontSize || 22,
      fontWeight: preset?.fontWeight || 400,
      fontStyle: 'normal',
      lineHeight: 1.3,
      letterSpacing: 0,
      textAlign: preset?.backgroundColor || (preset && preset.fontSize >= 36) ? 'center' : 'left',
      color: preset?.color || doc.tokens.colors.ink,
      textShadow: preset?.textShadow,
      backgroundColor: preset?.backgroundColor,
      borderRadius: preset?.borderRadius ?? 0,
      padding: preset?.backgroundColor ? 10 : 4,
      semanticRole: preset && preset.fontSize >= 32 ? 'title' : 'body',
    });
    setMobileSheet(null);
  };

  const insertShapeElement = (
    kind: ShapeElement['shapeKind'],
    customW?: number,
    customH?: number
  ) => {
    if (!doc || !activeSlide) return;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: SHAPE_CATALOG.find((s) => s.kind === kind)?.label || 'Shape',
      type: 'shape',
      x: Math.round(doc.width / 2 - (customW || 200) / 2),
      y: Math.round(doc.height / 2 - (customH || 140) / 2),
      width: customW || (kind === 'arrow' ? 180 : 220),
      height: customH || (kind === 'arrow' ? 68 : 140),
      rotation: 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      shapeKind: kind,
      fill:
        kind === 'rect' || kind === 'rounded-rect'
          ? doc.tokens.colors.surface
          : doc.tokens.colors.accent,
      stroke: doc.tokens.colors.border,
      strokeWidth: kind === 'rect' || kind === 'rounded-rect' ? 1 : 0,
      borderRadius: kind === 'rounded-rect' ? 14 : kind === 'pill' ? 999 : 0,
    });
    setMobileSheet(null);
  };

  const insertCutoutElement = (def: CutoutItemDef) => {
    if (!doc || !activeSlide) return;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: def.name,
      type: 'custom',
      x: Math.round(doc.width / 2 - def.defaultWidth / 2),
      y: Math.round(doc.height / 2 - def.defaultHeight / 2),
      width: def.defaultWidth,
      height: def.defaultHeight,
      rotation: 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      componentKey: 'cutout-illustration',
      componentVersion: '1.0.0',
      props: { ...def.defaultProps },
      animation: 'pop',
    });
    setMobileSheet(null);
  };

  const insertIconElement = (iconId: string, label: string, color: string) => {
    if (!doc || !activeSlide) return;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: `${label} Icon`,
      type: 'icon',
      x: Math.round(doc.width / 2 - 44),
      y: Math.round(doc.height / 2 - 44),
      width: 88,
      height: 88,
      rotation: 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      iconName: iconId,
      color,
      strokeWidth: 1.9,
    });
    setMobileSheet(null);
  };

  const insertChartElement = () => {
    if (!doc || !activeSlide) return;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: 'Bar Chart',
      type: 'chart',
      x: 180,
      y: 180,
      width: 520,
      height: 320,
      rotation: 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      chartKind: 'bar',
      title: 'Quarterly Comparison',
      data: [
        { label: 'Q1', value: 42, color: doc.tokens.colors.chartPalette[0] },
        { label: 'Q2', value: 64, color: doc.tokens.colors.chartPalette[1] },
        { label: 'Q3', value: 78, color: doc.tokens.colors.chartPalette[2] },
        { label: 'Q4', value: 94, color: doc.tokens.colors.accent },
      ],
      showValues: true,
      showLegend: false,
      accentColor: doc.tokens.colors.accent,
      textColor: doc.tokens.colors.ink,
      surfaceColor: doc.tokens.colors.surface,
    });
    setMobileSheet(null);
  };

  const insertTableElement = () => {
    if (!doc || !activeSlide) return;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: 'Data Table',
      type: 'table',
      x: 120,
      y: 200,
      width: 640,
      height: 220,
      rotation: 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      headers: ['Metric', 'Baseline', 'Target'],
      rows: [
        ['Adoption Rate', '42%', '78%'],
        ['Cycle Time', '6.4 hrs', '1.2 hrs'],
        ['Contrast Compliance', '84%', '100%'],
      ],
      headerBg: doc.tokens.colors.ink,
      headerColor: doc.tokens.colors.surface,
      cellBg: doc.tokens.colors.surface,
      textColor: doc.tokens.colors.ink,
      borderColor: doc.tokens.colors.border,
    });
    setMobileSheet(null);
  };

  const handleInsertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlide) return;
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiFetch<{ publicUrl: string }>('/api/uploads', { method: 'POST', body: form });
      addElement(activeSlide.id, {
        id: `el-${Date.now()}`,
        name: file.name,
        type: 'image',
        x: 180,
        y: 160,
        width: 440,
        height: 300,
        rotation: 0,
        zIndex: activeSlide.elements.length + 1,
        opacity: 1,
        visible: true,
        locked: false,
        src: res.publicUrl,
        alt: file.name,
        objectFit: 'cover',
        borderRadius: 8,
      });
      setMobileSheet(null);
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      e.target.value = '';
    }
  };

  const insertCustomComponent = (manifest: CustomComponentManifest) => {
    if (!doc || !activeSlide) return;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: manifest.name,
      type: 'custom',
      x: 96,
      y: 180,
      width: Math.min(doc.width - 192, manifest.defaultWidth),
      height: manifest.defaultHeight,
      rotation: 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      componentKey: manifest.componentKey,
      componentVersion: manifest.version,
      props: { ...manifest.defaultProps, accentColor: doc.tokens.colors.accent },
    });
    apiFetch('/api/activity/track', {
      method: 'POST',
      body: JSON.stringify({ action: 'insert_component', meta: { componentKey: manifest.componentKey } }),
    }).catch(() => {});
    setShowInsertCompModal(false);
    setMobileSheet(null);
  };

  const handleExportPptx = async () => {
    if (!doc) return;
    setExportingPptx(true);
    setShowExportMenu(false);
    try {
      const blob = await apiDownloadBlob(`/api/presentations/${presentationId}/export/pptx`, {
        method: 'POST',
        body: JSON.stringify({ document: doc }),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.title.replace(/[^a-zA-Z0-9_-]+/g, '_') || 'presentation'}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'PPTX export failed.');
    } finally {
      setExportingPptx(false);
    }
  };

  const handleExportJson = () => {
    if (!doc) return;
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9_-]+/g, '_') || 'presentation'}.vellum.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleCreateShareLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apiFetch<any>(`/api/presentations/${presentationId}/share`, {
        method: 'POST',
        body: JSON.stringify({
          permission: sharePerm,
          password: sharePassword || undefined,
          expiresInDays: Number(shareDays) || 0,
        }),
      });
      setShareLinks((prev) => [created, ...prev]);
      setSharePassword('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRevokeShareLink = async (linkId: string) => {
    try {
      await apiFetch(`/api/share-links/${linkId}`, { method: 'DELETE' });
      setShareLinks((prev) =>
        prev.map((l) => (l.id === linkId ? { ...l, revokedAt: new Date().toISOString() } : l))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      const res = await apiFetch<any>(`/api/presentations/${presentationId}/restore/${versionId}`, {
        method: 'POST',
      });
      loadDocument(res.document);
      setShowHistoryModal(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAutoRepair = async () => {
    if (!doc) return;
    try {
      const res = await apiFetch<{ repairedDocument: PresentationDocument; report: QualityReport }>(
        `/api/presentations/${presentationId}/quality`,
        { method: 'POST', body: JSON.stringify({ document: doc, repair: true }) }
      );
      if (res.repairedDocument) {
        commitChange(() => res.repairedDocument);
      }
      setQualityReport(res.report);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const commitPatchOnSelected = (patch: Partial<PresentationElement>) => {
    if (!activeSlide || !selectedElement) return;
    commitChange((d) => ({
      ...d,
      slides: d.slides.map((sl) =>
        sl.id !== activeSlide.id
          ? sl
          : {
              ...sl,
              elements: sl.elements.map((el) =>
                el.id === selectedElement.id ? ({ ...el, ...patch } as PresentationElement) : el
              ),
            }
      ),
    }));
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--bg-canvas)] text-sm text-[var(--text-secondary)]">
        Loading studio canvas...
      </div>
    );
  }

  if (error && !doc) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold">Could not open presentation</h1>
        <p className="text-sm text-[var(--text-secondary)]">{error}</p>
        <button
          type="button"
          onClick={() => navigate({ page: 'dashboard' })}
          className="px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold"
        >
          Return to Workspace
        </button>
      </div>
    );
  }

  if (!doc || !activeSlide) return null;

  const activeSlideIndex = doc.slides.findIndex((s) => s.id === activeSlide.id);

  // Fullscreen Present Mode
  if (presentMode) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0D0F13] text-white flex flex-col justify-between p-4 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs font-mono-tabular text-neutral-400">
            {doc.title} · Slide {activeSlideIndex + 1} / {doc.slides.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNotesInPresent((v) => !v)}
              className="px-3 py-1.5 rounded-md border border-neutral-700 text-xs hover:bg-neutral-800"
            >
              {showNotesInPresent ? 'Hide Notes' : 'Speaker Notes'}
            </button>
            <button
              type="button"
              onClick={() => setPresentMode(false)}
              className="px-3 py-1.5 rounded-md bg-white text-neutral-900 text-xs font-semibold inline-flex items-center gap-1"
            >
              <Minimize2 className="w-3.5 h-3.5" /> Exit
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden my-4">
          <SlideCanvas
            slide={activeSlide}
            tokens={doc.tokens}
            width={doc.width}
            height={doc.height}
            scale={
              typeof window !== 'undefined'
                ? Math.min((window.innerWidth - 64) / doc.width, (window.innerHeight - 180) / doc.height)
                : 0.85
            }
            animated
            animationKey={activeSlideIndex}
          />
        </div>

        <div className="space-y-3">
          {showNotesInPresent && (
            <div className="max-w-3xl mx-auto p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
              {activeSlide.speakerNotes || 'No speaker notes on this slide.'}
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => activeSlideIndex > 0 && selectSlide(doc.slides[activeSlideIndex - 1].id)}
              disabled={activeSlideIndex === 0}
              className="px-4 py-2 min-h-[44px] rounded-lg border border-neutral-700 text-xs disabled:opacity-30 inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              type="button"
              onClick={() =>
                activeSlideIndex < doc.slides.length - 1 && selectSlide(doc.slides[activeSlideIndex + 1].id)
              }
              disabled={activeSlideIndex >= doc.slides.length - 1}
              className="px-4 py-2 min-h-[44px] rounded-lg border border-neutral-700 text-xs disabled:opacity-30 inline-flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderInspectorContent = () => (
    <div className="space-y-5 text-xs">
      {selectedElement ? (
        <>
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase text-[var(--accent)]">
                {selectedElement.type}
              </div>
              <div className="font-semibold text-sm">{selectedElement.name}</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={selectedElement.locked ? 'Unlock element' : 'Lock element'}
                onClick={() => toggleLockElement(selectedElement.id)}
                className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)]"
              >
                {selectedElement.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                aria-label="Duplicate element"
                onClick={duplicateSelectedElement}
                className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)]"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label="Delete element"
                onClick={deleteSelectedElements}
                className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-[var(--border-hairline)] text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Geometry */}
          <div className="grid grid-cols-2 gap-2.5">
            {(
              [
                ['X', 'x', selectedElement.x],
                ['Y', 'y', selectedElement.y],
                ['Width', 'width', selectedElement.width],
                ['Height', 'height', selectedElement.height],
                ['Rotation', 'rotation', selectedElement.rotation],
              ] as const
            ).map(([label, key, val]) => (
              <label key={key} className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">{label}</span>
                <input
                  type="number"
                  value={Math.round(val)}
                  onChange={(e) => commitPatchOnSelected({ [key]: Number(e.target.value) } as any)}
                  className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                />
              </label>
            ))}
            <label className="block">
              <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Opacity</span>
              <input
                type="number"
                step={0.1}
                min={0.1}
                max={1}
                value={selectedElement.opacity}
                onChange={(e) => commitPatchOnSelected({ opacity: Math.min(1, Math.max(0.1, Number(e.target.value))) })}
                className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
              />
            </label>
          </div>

          {/* Text Properties */}
          {selectedElement.type === 'text' && (
            <div className="space-y-3 pt-3 border-t border-[var(--border-hairline)]">
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Text Content</span>
                <textarea
                  rows={3}
                  value={selectedElement.content}
                  onChange={(e) => updateElementLive(activeSlide.id, selectedElement.id, { content: e.target.value })}
                  onBlur={(e) => commitPatchOnSelected({ content: e.target.value })}
                  className="w-full p-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                />
              </label>

              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Font Family</span>
                <select
                  value={selectedElement.fontFamily}
                  onChange={(e) => commitPatchOnSelected({ fontFamily: e.target.value })}
                  className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                >
                  {fontCatalog.map((f) => (
                    <option key={f.family} value={f.family}>
                      {f.displayName}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <label className="block">
                  <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Font Size (px)</span>
                  <input
                    type="number"
                    min={10}
                    max={140}
                    value={selectedElement.fontSize}
                    onChange={(e) => commitPatchOnSelected({ fontSize: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Weight</span>
                  <select
                    value={selectedElement.fontWeight}
                    onChange={(e) => commitPatchOnSelected({ fontWeight: Number(e.target.value) })}
                    className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                  >
                    <option value={400}>Regular 400</option>
                    <option value={500}>Medium 500</option>
                    <option value={600}>SemiBold 600</option>
                    <option value={700}>Bold 700</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Line Height</span>
                  <input
                    type="number"
                    step={0.05}
                    min={0.9}
                    max={2.4}
                    value={selectedElement.lineHeight}
                    onChange={(e) => commitPatchOnSelected({ lineHeight: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Alignment</span>
                  <select
                    value={selectedElement.textAlign}
                    onChange={(e) => commitPatchOnSelected({ textAlign: e.target.value as any })}
                    className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </label>
              </div>

              <label className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-secondary)]">Text Color</span>
                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) => commitPatchOnSelected({ color: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer border border-[var(--border-hairline)]"
                />
              </label>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-secondary)]">Gradient Text (CSS)</span>
                  <button
                    type="button"
                    onClick={() =>
                      commitPatchOnSelected({
                        gradientText: selectedElement.gradientText
                          ? undefined
                          : `linear-gradient(120deg, ${doc.tokens.colors.ink} 0%, ${doc.tokens.colors.accent} 100%)`,
                      } as any)
                    }
                    className="text-[11px] font-medium text-[var(--accent)] hover:underline"
                  >
                    {selectedElement.gradientText ? 'Clear' : 'Apply Gradient'}
                  </button>
                </div>
                <input
                  type="text"
                  value={selectedElement.gradientText || ''}
                  placeholder="Optional linear-gradient(...)"
                  onChange={(e) => commitPatchOnSelected({ gradientText: e.target.value || undefined } as any)}
                  className="w-full h-8 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[11px] font-mono-tabular"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-secondary)]">Text Outline / Shadow</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        commitPatchOnSelected({
                          textShadow:
                            '0 5px 0 #1D4ED8, 0 12px 24px rgba(15, 23, 42, 0.35), -2px -2px 0 #1D4ED8, 2px -2px 0 #1D4ED8, -2px 2px 0 #1D4ED8, 2px 2px 0 #1D4ED8',
                        } as any)
                      }
                      className="text-[11px] font-medium text-[var(--accent)] hover:underline"
                    >
                      Y2K Outline
                    </button>
                    {selectedElement.textShadow && (
                      <button
                        type="button"
                        onClick={() => commitPatchOnSelected({ textShadow: undefined } as any)}
                        className="text-[11px] text-[var(--text-secondary)] hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  value={selectedElement.textShadow || ''}
                  placeholder="Optional CSS text-shadow"
                  onChange={(e) => commitPatchOnSelected({ textShadow: e.target.value || undefined } as any)}
                  className="w-full h-8 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[11px] font-mono-tabular"
                />
              </div>
            </div>
          )}

          {/* Shape Properties */}
          {selectedElement.type === 'shape' && (
            <div className="space-y-3 pt-3 border-t border-[var(--border-hairline)]">
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Shape Geometry</span>
                <select
                  value={selectedElement.shapeKind}
                  onChange={(e) => commitPatchOnSelected({ shapeKind: e.target.value as any })}
                  className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                >
                  {SHAPE_CATALOG.map((sh) => (
                    <option key={sh.kind} value={sh.kind}>
                      {sh.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-secondary)]">Fill Color</span>
                <input
                  type="color"
                  value={selectedElement.fill}
                  onChange={(e) => commitPatchOnSelected({ fill: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer border border-[var(--border-hairline)]"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-secondary)]">Border Stroke</span>
                <input
                  type="color"
                  value={selectedElement.stroke}
                  onChange={(e) => commitPatchOnSelected({ stroke: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer border border-[var(--border-hairline)]"
                />
              </label>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-secondary)]">Gradient Fill (CSS)</span>
                  <button
                    type="button"
                    onClick={() =>
                      commitPatchOnSelected({
                        gradient: selectedElement.gradient
                          ? undefined
                          : `linear-gradient(135deg, ${doc.tokens.colors.accent} 0%, ${doc.tokens.colors.surface} 100%)`,
                      } as any)
                    }
                    className="text-[11px] font-medium text-[var(--accent)] hover:underline"
                  >
                    {selectedElement.gradient ? 'Clear' : 'Preset'}
                  </button>
                </div>
                <input
                  type="text"
                  value={selectedElement.gradient || ''}
                  placeholder="Optional linear/radial-gradient(...)"
                  onChange={(e) => commitPatchOnSelected({ gradient: e.target.value || undefined } as any)}
                  className="w-full h-8 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[11px] font-mono-tabular"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <label className="block">
                  <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Corner Radius</span>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={selectedElement.borderRadius}
                    onChange={(e) => commitPatchOnSelected({ borderRadius: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Glow Blur (px)</span>
                  <input
                    type="number"
                    min={0}
                    max={160}
                    step={4}
                    value={selectedElement.blur || 0}
                    onChange={(e) => commitPatchOnSelected({ blur: Math.max(0, Number(e.target.value)) } as any)}
                    className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Blend Mode</span>
                <select
                  value={selectedElement.blendMode || 'normal'}
                  onChange={(e) => commitPatchOnSelected({ blendMode: e.target.value as any } as any)}
                  className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                >
                  <option value="normal">Normal</option>
                  <option value="multiply">Multiply</option>
                  <option value="screen">Screen</option>
                  <option value="overlay">Overlay</option>
                </select>
              </label>
            </div>
          )}

          {/* Image Properties */}
          {selectedElement.type === 'image' && (
            <div className="space-y-3 pt-3 border-t border-[var(--border-hairline)]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Photo & Media
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="inline-flex w-full items-center justify-center gap-1.5 h-9 px-2.5 rounded-md border border-[var(--border-strong)] bg-[var(--bg-canvas)] text-[var(--text-primary)] font-medium cursor-pointer hover:border-[var(--accent)]">
                    Replace Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const form = new FormData();
                          form.append('file', file);
                          const res = await apiFetch<{ publicUrl: string }>('/api/uploads', {
                            method: 'POST',
                            body: form,
                          });
                          commitPatchOnSelected({
                            src: res.publicUrl,
                            originalSrc: res.publicUrl,
                            cutoutMode: 'none',
                            alt: file.name,
                          } as any);
                        } catch (err: any) {
                          setError(err.message || 'Could not upload replacement photo.');
                        } finally {
                          e.target.value = '';
                        }
                      }}
                    />
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setCutoutModalState({
                      open: true,
                      targetElementId: selectedElement.id,
                      initialSrc: selectedElement.src,
                      initialOriginalSrc: selectedElement.originalSrc || selectedElement.src,
                    })
                  }
                  className="inline-flex w-full items-center justify-center gap-1.5 h-9 px-2.5 rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold hover:opacity-90"
                >
                  <Scissors className="w-3.5 h-3.5" /> Cutout BG
                </button>
              </div>

              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Image URL</span>
                <input
                  type="text"
                  value={selectedElement.src}
                  onChange={(e) => commitPatchOnSelected({ src: e.target.value } as any)}
                  className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[11px] font-mono-tabular"
                />
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <label className="block">
                  <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Fit Mode</span>
                  <select
                    value={selectedElement.objectFit}
                    onChange={(e) => commitPatchOnSelected({ objectFit: e.target.value as 'cover' | 'contain' } as any)}
                    className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                  >
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Corner Radius</span>
                  <input
                    type="number"
                    min={0}
                    max={480}
                    value={selectedElement.borderRadius}
                    onChange={(e) => commitPatchOnSelected({ borderRadius: Math.max(0, Number(e.target.value)) } as any)}
                    className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Alt Description</span>
                <input
                  type="text"
                  value={selectedElement.alt}
                  onChange={(e) => commitPatchOnSelected({ alt: e.target.value } as any)}
                  className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                />
              </label>
            </div>
          )}

          {/* Icon Properties */}
          {selectedElement.type === 'icon' && (
            <div className="space-y-3 pt-3 border-t border-[var(--border-hairline)]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Icon Styling
              </div>
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Icon Symbol</span>
                <select
                  value={selectedElement.iconName}
                  onChange={(e) => commitPatchOnSelected({ iconName: e.target.value } as any)}
                  className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                >
                  {ICON_CATALOG.map((ic) => (
                    <option key={ic.id} value={ic.id}>
                      {ic.label} ({ic.category})
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-secondary)]">Icon Color</span>
                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) => commitPatchOnSelected({ color: e.target.value } as any)}
                  className="w-10 h-8 rounded cursor-pointer border border-[var(--border-hairline)]"
                />
              </label>
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Stroke Weight</span>
                <input
                  type="number"
                  step={0.25}
                  min={1}
                  max={3.5}
                  value={selectedElement.strokeWidth}
                  onChange={(e) => commitPatchOnSelected({ strokeWidth: Number(e.target.value) } as any)}
                  className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                />
              </label>
            </div>
          )}

          {/* Effects & Motion (All Elements) */}
          <div className="space-y-3 pt-3 border-t border-[var(--border-hairline)]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Effects & Motion
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Shadow</span>
                <select
                  value={selectedElement.shadow || 'none'}
                  onChange={(e) => commitPatchOnSelected({ shadow: e.target.value as any })}
                  className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                >
                  <option value="none">None</option>
                  <option value="soft">Soft</option>
                  <option value="elevated">Elevated</option>
                  <option value="glow">Accent Glow</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Backdrop Blur</span>
                <input
                  type="number"
                  min={0}
                  max={40}
                  step={2}
                  value={selectedElement.backdropBlur || 0}
                  onChange={(e) => commitPatchOnSelected({ backdropBlur: Math.max(0, Number(e.target.value)) })}
                  className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                />
              </label>
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Animation</span>
                <select
                  value={selectedElement.animation || 'none'}
                  onChange={(e) => {
                    commitPatchOnSelected({ animation: e.target.value as any });
                    setAnimationKey((k) => k + 1);
                  }}
                  className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                >
                  <option value="none">None</option>
                  <option value="fade-up">Fade Up</option>
                  <option value="fade-in">Fade In</option>
                  <option value="slide-left">Slide Left</option>
                  <option value="slide-right">Slide Right</option>
                  <option value="scale-in">Scale In</option>
                  <option value="pop">Sticker Pop</option>
                  <option value="float">Float Loop</option>
                  <option value="bounce">Bounce Loop</option>
                  <option value="pulse">Pulse Loop</option>
                  <option value="spin-slow">Spin Slow</option>
                  <option value="wiggle">Wiggle Loop</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Delay (ms)</span>
                <input
                  type="number"
                  min={0}
                  max={2500}
                  step={50}
                  value={selectedElement.animationDelay || 0}
                  onChange={(e) => commitPatchOnSelected({ animationDelay: Math.max(0, Number(e.target.value)) })}
                  className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                />
              </label>
            </div>
          </div>

          {/* Chart Properties */}
          {selectedElement.type === 'chart' && (
            <div className="space-y-3 pt-3 border-t border-[var(--border-hairline)]">
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Chart Type</span>
                <select
                  value={selectedElement.chartKind}
                  onChange={(e) => commitPatchOnSelected({ chartKind: e.target.value as any })}
                  className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Chart Title</span>
                <input
                  type="text"
                  value={selectedElement.title}
                  onChange={(e) => commitPatchOnSelected({ title: e.target.value })}
                  className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                />
              </label>
              <div className="space-y-1.5">
                <span className="text-[11px] text-[var(--text-secondary)] block">Data Series</span>
                {selectedElement.data.map((d, di) => (
                  <div key={di} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={d.label}
                      onChange={(e) => {
                        const next = selectedElement.data.map((x, idx) =>
                          idx === di ? { ...x, label: e.target.value } : x
                        );
                        commitPatchOnSelected({ data: next } as any);
                      }}
                      className="h-8 px-2 rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                    />
                    <input
                      type="number"
                      value={d.value}
                      onChange={(e) => {
                        const next = selectedElement.data.map((x, idx) =>
                          idx === di ? { ...x, value: Number(e.target.value) } : x
                        );
                        commitPatchOnSelected({ data: next } as any);
                      }}
                      className="h-8 px-2 rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Component Declarative Property Editor */}
          {selectedElement.type === 'custom' && (() => {
            const manifest = componentsCatalog.find((c) => c.componentKey === selectedElement.componentKey);
            const schema = manifest?.propertySchema || [];
            return (
              <div className="space-y-3 pt-3 border-t border-[var(--border-hairline)]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Component Properties
                </div>
                {schema.map((field) => {
                  const val = selectedElement.props[field.key];
                  if (field.type === 'list') {
                    const arr = Array.isArray(val) ? val.map(String) : [];
                    return (
                      <label key={field.key} className="block">
                        <span className="text-[11px] text-[var(--text-secondary)] block mb-1">{field.label}</span>
                        <textarea
                          rows={4}
                          value={arr.join('\n')}
                          onChange={(e) =>
                            commitPatchOnSelected({
                              props: {
                                ...selectedElement.props,
                                [field.key]: e.target.value.split('\n').filter(Boolean),
                              },
                            } as any)
                          }
                          className="w-full p-2 rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                        />
                      </label>
                    );
                  }
                  if (field.type === 'select' && field.options) {
                    return (
                      <label key={field.key} className="block">
                        <span className="text-[11px] text-[var(--text-secondary)] block mb-1">{field.label}</span>
                        <select
                          value={String(val || field.options[0] || '')}
                          onChange={(e) =>
                            commitPatchOnSelected({
                              props: { ...selectedElement.props, [field.key]: e.target.value },
                            } as any)
                          }
                          className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                        >
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                    );
                  }
                  if (field.type === 'textarea') {
                    return (
                      <label key={field.key} className="block">
                        <span className="text-[11px] text-[var(--text-secondary)] block mb-1">{field.label}</span>
                        <textarea
                          rows={3}
                          value={String(val || '')}
                          onChange={(e) =>
                            commitPatchOnSelected({
                              props: { ...selectedElement.props, [field.key]: e.target.value },
                            } as any)
                          }
                          className="w-full p-2 rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs"
                        />
                      </label>
                    );
                  }
                  if (field.type === 'number') {
                    return (
                      <label key={field.key} className="block">
                        <span className="text-[11px] text-[var(--text-secondary)] block mb-1">{field.label}</span>
                        <input
                          type="number"
                          value={Number(val ?? 0)}
                          onChange={(e) =>
                            commitPatchOnSelected({
                              props: { ...selectedElement.props, [field.key]: Number(e.target.value) },
                            } as any)
                          }
                          className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                        />
                      </label>
                    );
                  }
                  if (field.type === 'color') {
                    return (
                      <label key={field.key} className="flex items-center justify-between">
                        <span className="text-[11px] text-[var(--text-secondary)]">{field.label}</span>
                        <input
                          type="color"
                          value={String(val || doc.tokens.colors.accent)}
                          onChange={(e) =>
                            commitPatchOnSelected({
                              props: { ...selectedElement.props, [field.key]: e.target.value },
                            } as any)
                          }
                          className="w-10 h-8 rounded border border-[var(--border-hairline)]"
                        />
                      </label>
                    );
                  }
                  return (
                    <label key={field.key} className="block">
                      <span className="text-[11px] text-[var(--text-secondary)] block mb-1">{field.label}</span>
                      <input
                        type="text"
                        value={String(val || '')}
                        onChange={(e) =>
                          commitPatchOnSelected({
                            props: { ...selectedElement.props, [field.key]: e.target.value },
                          } as any)
                        }
                        className="w-full h-9 px-2.5 rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                      />
                    </label>
                  );
                })}
              </div>
            );
          })()}
        </>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-[var(--text-secondary)]">
            Select any element on the slide to inspect typography, geometry, or component properties. Double-click text boxes to edit inline.
          </div>
          <div className="pt-3 border-t border-[var(--border-hairline)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Slide Background & Pattern
            </div>

            <label className="block">
              <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Surface Mode</span>
              <select
                value={activeSlide.background.type}
                onChange={(e) => {
                  const nextType = e.target.value as 'solid' | 'gradient';
                  updateSlideBackgroundPatch(activeSlide.id, {
                    type: nextType,
                    gradient:
                      nextType === 'gradient' && !activeSlide.background.gradient
                        ? `linear-gradient(135deg, ${doc.tokens.colors.background} 0%, ${doc.tokens.colors.surface} 100%)`
                        : activeSlide.background.gradient,
                  });
                }}
                className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient Surface</option>
              </select>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-secondary)]">Base Color</span>
              <input
                type="color"
                value={activeSlide.background.color || doc.tokens.colors.background}
                onChange={(e) => updateSlideBackground(activeSlide.id, e.target.value)}
                className="w-10 h-8 rounded border border-[var(--border-hairline)] cursor-pointer"
              />
            </label>

            {activeSlide.background.type === 'gradient' && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-[var(--text-secondary)] block">Gradient CSS</span>
                <input
                  type="text"
                  value={activeSlide.background.gradient || ''}
                  onChange={(e) =>
                    updateSlideBackgroundPatch(activeSlide.id, { type: 'gradient', gradient: e.target.value })
                  }
                  className="w-full h-8 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[11px] font-mono-tabular"
                />
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    ['Nordic', 'linear-gradient(135deg, #06131A 0%, #0D2634 65%, #123648 100%)'],
                    ['Cobalt', 'radial-gradient(circle at 22% 18%, #1E284D 0%, #0A0C14 58%, #07080D 100%)'],
                    ['Ivory', 'linear-gradient(135deg, #FAF8F4 0%, #EFECE3 100%)'],
                  ].map(([label, css]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => updateSlideBackgroundPatch(activeSlide.id, { type: 'gradient', gradient: css })}
                      className="px-2 py-1 rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] text-[10px] font-medium"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">BG Pattern</span>
                <select
                  value={activeSlide.background.pattern || 'none'}
                  onChange={(e) =>
                    updateSlideBackgroundPatch(activeSlide.id, {
                      pattern: e.target.value as any,
                      patternColor: activeSlide.background.patternColor || doc.tokens.colors.ink,
                    })
                  }
                  className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                >
                  <option value="none">None</option>
                  <option value="dots">Dot Matrix</option>
                  <option value="grid">Swiss Grid</option>
                  <option value="editorial-lines">Editorial Lines</option>
                  <option value="diagonal">Diagonal Hatch</option>
                  <option value="noise-mesh">Radial Mesh</option>
                  <option value="checkerboard">Y2K Checkerboard</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Pattern Opacity</span>
                <input
                  type="number"
                  min={0}
                  max={0.6}
                  step={0.04}
                  value={activeSlide.background.patternOpacity ?? 0.16}
                  onChange={(e) =>
                    updateSlideBackgroundPatch(activeSlide.id, {
                      patternOpacity: Math.min(0.6, Math.max(0, Number(e.target.value))),
                    })
                  }
                  className="w-full h-9 px-2.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular"
                />
              </label>
            </div>

            <label className="block pt-2 border-t border-[var(--border-hairline)]">
              <span className="font-medium block mb-1.5">Speaker Notes</span>
              <textarea
                rows={4}
                value={activeSlide.speakerNotes}
                onChange={(e) => updateSpeakerNotes(activeSlide.id, e.target.value)}
                placeholder="Add presenter cue notes for this slide..."
                className="w-full p-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs leading-relaxed"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const renderLayersContent = () => (
    <div className="space-y-2 text-xs">
      <div className="text-[11px] text-[var(--text-secondary)] pb-2 border-b border-[var(--border-hairline)]">
        {activeSlide.elements.length} objects on slide {activeSlideIndex + 1}
      </div>
      {[...activeSlide.elements]
        .sort((a, b) => b.zIndex - a.zIndex)
        .map((el) => {
          const selected = selectedElementIds.includes(el.id);
          return (
            <div
              key={el.id}
              className={`p-2 rounded-lg border flex items-center justify-between gap-2 ${
                selected
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                  : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)]'
              }`}
            >
              <button
                type="button"
                onClick={() => selectElements([el.id])}
                className="flex-1 text-left truncate font-medium"
              >
                {el.name}
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  aria-label={`Bring ${el.name} forward`}
                  onClick={() => reorderLayer(el.id, 'up')}
                  className="p-1 hover:bg-[var(--bg-subtle)] rounded"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={`Send ${el.name} backward`}
                  onClick={() => reorderLayer(el.id, 'down')}
                  className="p-1 hover:bg-[var(--bg-subtle)] rounded"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={el.locked ? `Unlock ${el.name}` : `Lock ${el.name}`}
                  onClick={() => toggleLockElement(el.id)}
                  className="p-1 hover:bg-[var(--bg-subtle)] rounded"
                >
                  {el.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );

  const renderThemeAndQualityContent = () => (
    <div className="space-y-5 text-xs">
      <div className="space-y-2.5">
        <div className="font-semibold">Design Token Presets</div>
        {tokenCatalog.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => applyDesignTokens(t)}
            className={`w-full text-left p-2.5 rounded-lg border flex items-center justify-between ${
              doc.themeId === t.id
                ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                : 'border-[var(--border-hairline)] hover:bg-[var(--bg-canvas)]'
            }`}
          >
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-[11px] text-[var(--text-secondary)]">
                {t.typography.displayFont} / {t.typography.bodyFont}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-xs border border-black/10" style={{ backgroundColor: t.colors.background }} />
              <span className="w-4 h-4 rounded-xs border border-black/10" style={{ backgroundColor: t.colors.accent }} />
            </div>
          </button>
        ))}
      </div>

      {qualityReport && (
        <div className="pt-4 border-t border-[var(--border-hairline)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--accent)]" /> Quality Diagnostics
            </span>
            <span className="font-mono-tabular font-semibold">{qualityReport.diagnosticScore}/100</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-tabular">
            <div className="p-2 rounded bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
              Contrast: {qualityReport.metrics.contrastCompliance}%
            </div>
            <div className="p-2 rounded bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
              Layout Mix: {qualityReport.metrics.layoutDiversity}%
            </div>
          </div>
          {qualityReport.issues.length > 0 ? (
            <div className="space-y-1.5">
              {qualityReport.issues.slice(0, 4).map((iss, idx) => (
                <div key={idx} className="p-2 rounded bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[11px]">
                  <span className="font-semibold">{iss.code}:</span> {iss.message}
                </div>
              ))}
              {qualityReport.hardDefectCount > 0 && (
                <button
                  type="button"
                  onClick={handleAutoRepair}
                  className="w-full py-2 rounded-lg bg-[var(--accent)] text-white font-semibold"
                >
                  Auto-Repair Bounds & Contrast
                </button>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
              No contrast, overflow, or overlap defects detected.
            </div>
          )}
          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{qualityReport.disclaimer}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[var(--bg-canvas)] overflow-hidden">
      {/* Studio Top Toolbar */}
      <div className="h-14 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            aria-label="Back to workspace"
            onClick={() => navigate({ page: 'dashboard' })}
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-[var(--bg-subtle)] shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={doc.title}
            aria-label="Presentation title"
            onChange={(e) => updateTitle(e.target.value)}
            className="font-display font-bold text-sm sm:text-base bg-transparent truncate max-w-[140px] sm:max-w-[260px] focus:outline-none focus:border-b focus:border-[var(--accent)]"
          />

          <span className="hidden md:inline text-xs font-mono-tabular text-[var(--text-muted)] shrink-0">
            {isSaving ? 'Saving...' : isDirty ? 'Unsaved' : lastSavedAt ? `Saved ${lastSavedAt}` : 'Synced'}
          </span>
        </div>

        {/* Clean Quick Studio Context Pill */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <button
            type="button"
            onClick={() => setLeftTab('elements')}
            className={`px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors ${
              leftTab === 'elements'
                ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                : 'hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" /> Cutouts &amp; Shapes
          </button>
          <button
            type="button"
            onClick={() => setCutoutModalState({ open: true })}
            className="px-3 py-1.5 rounded-lg hover:bg-[var(--bg-subtle)] font-medium inline-flex items-center gap-1.5"
          >
            <Scissors className="w-3.5 h-3.5 text-[var(--accent)]" /> Photo Cutout Lab
          </button>
          <button
            type="button"
            onClick={() => setShowInsertCompModal(true)}
            className="px-3 py-1.5 rounded-lg hover:bg-[var(--bg-subtle)] font-medium inline-flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" /> Smart Blocks
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            aria-label="Undo"
            onClick={undo}
            disabled={past.length === 0}
            className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-[var(--bg-subtle)] disabled:opacity-35"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Redo"
            onClick={redo}
            disabled={future.length === 0}
            className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-[var(--bg-subtle)] disabled:opacity-35"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            aria-label="Toggle snap to grid"
            onClick={toggleSnapToGrid}
            className={`hidden sm:inline-flex w-9 h-9 items-center justify-center rounded-md ${
              snapToGrid ? 'bg-[var(--bg-subtle)] text-[var(--accent)]' : 'hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            type="button"
            aria-label="Version history"
            onClick={() => setShowHistoryModal(true)}
            className="hidden sm:inline-flex w-9 h-9 items-center justify-center rounded-md hover:bg-[var(--bg-subtle)]"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            type="button"
            aria-label="Save presentation"
            onClick={() => handleSave('Manual snapshot')}
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-[var(--border-hairline)] text-xs font-medium hover:bg-[var(--bg-subtle)]"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-[var(--border-hairline)] text-xs font-medium hover:bg-[var(--bg-subtle)]"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>

          <div className="relative">
            <button
              type="button"
              aria-label="Export presentation"
              onClick={() => setShowExportMenu((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-[var(--text-primary)] text-[var(--bg-surface)] text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] shadow-[var(--shadow-float)] p-1.5 z-50 text-xs">
                <button
                  type="button"
                  onClick={handleExportPptx}
                  disabled={exportingPptx}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[var(--bg-subtle)] flex items-center gap-2 font-medium"
                >
                  <FileDown className="w-4 h-4 text-[var(--accent)]" />
                  {exportingPptx ? 'Building .pptx...' : 'Editable PowerPoint (.pptx)'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    window.print();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[var(--bg-subtle)] flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Print / Save as PDF
                </button>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[var(--bg-subtle)] flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Canonical Document (.json)
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Present fullscreen"
            onClick={() => setPresentMode(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)]"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Present
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-800 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canva-Style Left Studio Rail & Contextual Drawer */}
        <StudioLeftDrawer
          activeTab={leftTab}
          onSelectTab={setLeftTab}
          doc={doc}
          activeSlide={activeSlide}
          selectedElement={selectedElement}
          fontCatalog={fontCatalog}
          onSelectSlide={selectSlide}
          onAddSlide={addSlide}
          onMoveSlide={moveSlide}
          onDuplicateSlide={duplicateSlide}
          onDeleteSlide={deleteSlide}
          onInsertCutout={insertCutoutElement}
          onInsertShape={insertShapeElement}
          onInsertIcon={insertIconElement}
          onInsertTextPreset={insertTextPresetElement}
          onInsertChart={insertChartElement}
          onInsertTable={insertTableElement}
          onUploadRawImage={handleInsertImageUpload}
          onOpenCutoutStudio={() => setCutoutModalState({ open: true })}
          onOpenComponentsModal={() => setShowInsertCompModal(true)}
          onApplyAnimation={(anim: ElementAnimation) => {
            if (!selectedElement) return;
            commitPatchOnSelected({ animation: anim });
            setAnimationKey((k) => k + 1);
          }}
          onReplayAnimations={() => setAnimationKey((k) => k + 1)}
        />

        {/* Center Canvas Viewport */}
        <main
          ref={viewportRef}
          className="flex-1 min-w-0 flex flex-col items-center justify-center p-3 sm:p-6 overflow-auto relative bg-[var(--bg-canvas)]"
        >
          <div className="relative flex items-center justify-center">
            {selectedElement && (
              <FloatingElementToolbar
                element={selectedElement}
                slideWidth={doc.width}
                slideHeight={doc.height}
                scale={responsiveScale}
                onPatch={commitPatchOnSelected}
                onDuplicate={duplicateSelectedElement}
                onDelete={deleteSelectedElements}
                onLayer={(dir) => reorderLayer(selectedElement.id, dir)}
                onToggleLock={() => toggleLockElement(selectedElement.id)}
                onOpenCutout={() => {
                  if (selectedElement.type === 'image') {
                    setCutoutModalState({
                      open: true,
                      targetElementId: selectedElement.id,
                      initialSrc: selectedElement.src,
                      initialOriginalSrc: selectedElement.originalSrc || selectedElement.src,
                    });
                  }
                }}
                onOpenAnimate={() => setLeftTab('motion')}
                onError={(msg) => setError(msg)}
              />
            )}

            <SlideCanvas
              slide={activeSlide}
              tokens={doc.tokens}
              width={doc.width}
              height={doc.height}
              scale={responsiveScale}
              animated
              animationKey={animationKey}
              interactive
              selectedIds={selectedElementIds}
              snapToGrid={snapToGrid}
              onSelectElements={selectElements}
              onUpdateElementLive={(elId, patch) => updateElementLive(activeSlide.id, elId, patch)}
              onCommitSnapshot={commitSnapshot}
              onCommitElementPatch={(elId, patch) =>
                commitChange((d) => ({
                  ...d,
                  slides: d.slides.map((s) =>
                    s.id !== activeSlide.id
                      ? s
                      : { ...s, elements: s.elements.map((e) => (e.id === elId ? ({ ...e, ...patch } as any) : e)) }
                  ),
                }))
              }
            />
          </div>

          {/* Bottom Floating Canvas Zoom & Replay Bar */}
          <div className="mt-3 px-3 py-1.5 rounded-full border border-[var(--border-hairline)] bg-[var(--bg-surface)]/90 backdrop-blur-sm shadow-xs flex items-center gap-2.5 text-xs font-mono-tabular text-[var(--text-secondary)] shrink-0">
            <span>
              Slide {activeSlideIndex + 1} / {doc.slides.length}
            </span>
            <span aria-hidden="true">·</span>
            <span>{Math.round(responsiveScale * 100)}%</span>
            <div className="hidden sm:flex items-center gap-1 ml-1">
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => setZoom(zoom - 0.1)}
                className="w-6 h-6 inline-flex items-center justify-center rounded-full border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)]"
              >
                -
              </button>
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => setZoom(zoom + 0.1)}
                className="w-6 h-6 inline-flex items-center justify-center rounded-full border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)]"
              >
                +
              </button>
              <button
                type="button"
                aria-label="Replay slide animations"
                onClick={() => setAnimationKey((k) => k + 1)}
                className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] text-[var(--text-primary)]"
              >
                <Play className="w-3 h-3 text-[var(--accent)]" /> Replay
              </button>
            </div>
          </div>
        </main>

        {/* Desktop Right Contextual Inspector */}
        <aside className="hidden lg:flex w-80 border-l border-[var(--border-hairline)] bg-[var(--bg-surface)] flex-col shrink-0">
          <div className="p-2 border-b border-[var(--border-hairline)] grid grid-cols-3 gap-1">
            {(
              [
                ['inspector', 'Design'],
                ['layers', 'Layers'],
                ['theme', 'Theme'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setRightTab(key)}
                className={`py-2 rounded-md text-xs font-medium transition-colors ${
                  rightTab === key
                    ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {rightTab === 'inspector' && renderInspectorContent()}
            {rightTab === 'layers' && renderLayersContent()}
            {rightTab === 'theme' && renderThemeAndQualityContent()}
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Contextual Toolbar */}
      <nav
        aria-label="Mobile editor tools"
        className="lg:hidden border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] grid grid-cols-5 h-16 shrink-0"
      >
        <button
          type="button"
          onClick={() => setMobileSheet(mobileSheet === 'slides' ? null : 'slides')}
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[44px]"
        >
          <Layers className="w-4 h-4" />
          <span>Slides</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileSheet(mobileSheet === 'insert' ? null : 'insert')}
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileSheet(mobileSheet === 'edit' ? null : 'edit')}
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[44px]"
        >
          <Sliders className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileSheet(mobileSheet === 'layers' ? null : 'layers')}
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[44px]"
        >
          <Palette className="w-4 h-4" />
          <span>Theme</span>
        </button>
        <button
          type="button"
          onClick={() => setPresentMode(true)}
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[var(--accent)] min-h-[44px]"
        >
          <Eye className="w-4 h-4" />
          <span>Present</span>
        </button>
      </nav>

      {/* Mobile Bottom Sheet */}
      {mobileSheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile tool panel"
          className="lg:hidden fixed inset-x-0 bottom-16 z-40 rounded-t-2xl border-t border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-[var(--shadow-float)] max-h-[62vh] flex flex-col"
        >
          <div className="px-4 py-3 border-b border-[var(--border-hairline)] flex items-center justify-between">
            <span className="font-semibold text-sm capitalize">{mobileSheet}</span>
            <button
              type="button"
              aria-label="Close panel"
              onClick={() => setMobileSheet(null)}
              className="w-10 h-10 inline-flex items-center justify-center rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            {mobileSheet === 'slides' && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={addSlide}
                  className="w-full min-h-[44px] rounded-lg bg-[var(--accent)] text-white text-sm font-semibold"
                >
                  + Add New Slide
                </button>
                <div className="grid grid-cols-2 gap-3">
                  {doc.slides.map((sl, idx) => (
                    <button
                      key={sl.id}
                      type="button"
                      onClick={() => {
                        selectSlide(sl.id);
                        setMobileSheet(null);
                      }}
                      className={`p-2 rounded-lg border text-left ${
                        sl.id === activeSlide.id ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border-hairline)]'
                      }`}
                    >
                      <div className="text-xs font-mono-tabular mb-1">Slide {idx + 1}</div>
                      <div className="text-xs font-medium truncate">{sl.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {mobileSheet === 'insert' && (
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => insertTextPresetElement()} className="min-h-[44px] p-3 rounded-lg border border-[var(--border-hairline)] text-xs font-medium">
                  Add Text Box
                </button>
                <button type="button" onClick={() => insertShapeElement('rounded-rect')} className="min-h-[44px] p-3 rounded-lg border border-[var(--border-hairline)] text-xs font-medium">
                  Add Shape
                </button>
                <button type="button" onClick={insertChartElement} className="min-h-[44px] p-3 rounded-lg border border-[var(--border-hairline)] text-xs font-medium">
                  Add Chart
                </button>
                <button type="button" onClick={insertTableElement} className="min-h-[44px] p-3 rounded-lg border border-[var(--border-hairline)] text-xs font-medium">
                  Add Table
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileSheet(null);
                    setCutoutModalState({ open: true });
                  }}
                  className="col-span-2 min-h-[44px] p-3 rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Scissors className="w-4 h-4" /> Photo Cutout Studio (Auto / Manual)
                </button>
                <label className="col-span-2 min-h-[44px] p-3 rounded-lg border border-[var(--border-hairline)] text-xs font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  <span aria-hidden="true">Upload &amp; Insert Raw Image</span>
                  <input
                    type="file"
                    aria-label="Upload and insert image"
                    accept=".png,.jpg,.jpeg,.webp,.svg"
                    onChange={handleInsertImageUpload}
                    className="sr-only"
                  />
                </label>
                <button type="button" onClick={() => setShowInsertCompModal(true)} className="col-span-2 min-h-[44px] p-3 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold">
                  Insert Custom Component
                </button>
              </div>
            )}
            {mobileSheet === 'edit' && renderInspectorContent()}
            {mobileSheet === 'layers' && renderThemeAndQualityContent()}
          </div>
        </div>
      )}

      {/* Custom Component Drawer Modal */}
      {showInsertCompModal && (
        <div role="dialog" aria-modal="true" aria-label="Insert custom component" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Insert Registered Component</h2>
              <button type="button" aria-label="Close component picker" onClick={() => setShowInsertCompModal(false)} className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-[var(--border-hairline)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {componentsCatalog
                .filter((c) => c.enabled && c.availability?.manual !== false)
                .map((comp) => (
                  <button
                    key={comp.componentKey}
                    type="button"
                    onClick={() => insertCustomComponent(comp)}
                    className="text-left p-4 rounded-xl border border-[var(--border-hairline)] hover:border-[var(--accent)] bg-[var(--bg-canvas)] space-y-1"
                  >
                    <div className="text-[11px] font-mono-tabular text-[var(--accent)]">
                      {comp.category} · v{comp.version}
                    </div>
                    <div className="font-semibold text-sm">{comp.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{comp.description}</div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div role="dialog" aria-modal="true" aria-label="Share presentation" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl max-w-lg w-full p-6 space-y-5 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Share & Permissions</h2>
              <button type="button" aria-label="Close share dialog" onClick={() => setShowShareModal(false)} className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[var(--border-hairline)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateShareLink} className="space-y-3 p-4 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-xs">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block mb-1 font-medium">Permission</span>
                  <select value={sharePerm} onChange={(e) => setSharePerm(e.target.value as any)} className="w-full h-9 px-2 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
                    <option value="view">Read-only view</option>
                    <option value="edit">Collaborative edit</option>
                  </select>
                </label>
                <label className="block">
                  <span className="block mb-1 font-medium">Expires (days)</span>
                  <input type="number" min={0} value={shareDays} onChange={(e) => setShareDays(e.target.value)} className="w-full h-9 px-2 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] font-mono-tabular" />
                </label>
              </div>
              <label className="block">
                <span className="block mb-1 font-medium">Optional Password</span>
                <input type="password" value={sharePassword} onChange={(e) => setSharePassword(e.target.value)} placeholder="Leave blank for open link" className="w-full h-9 px-2.5 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)]" />
              </label>
              <button type="submit" className="w-full h-10 rounded-lg bg-[var(--accent)] text-white font-semibold">
                Create Share Link
              </button>
            </form>

            <div className="space-y-2 text-xs">
              <div className="font-semibold">Active & Past Links</div>
              {shareLinks.length === 0 ? (
                <div className="text-[var(--text-secondary)]">No share links generated yet.</div>
              ) : (
                shareLinks.map((lnk) => {
                  const fullUrl = `${window.location.origin}/share/${lnk.token}`;
                  return (
                    <div key={lnk.id} className="p-3 rounded-lg border border-[var(--border-hairline)] flex items-center justify-between gap-2">
                      <div className="truncate">
                        <div className="font-medium">
                          {lnk.permission === 'edit' ? 'Editable Link' : 'Read-Only Link'}
                          {lnk.revokedAt ? ' · Revoked' : ''}
                        </div>
                        <div className="text-[11px] font-mono-tabular text-[var(--text-secondary)] truncate">{fullUrl}</div>
                      </div>
                      {!lnk.revokedAt && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(fullUrl);
                              setCopiedUrl(lnk.id);
                              setTimeout(() => setCopiedUrl(null), 1500);
                            }}
                            className="px-2.5 py-1.5 rounded border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)]"
                          >
                            {copiedUrl === lnk.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : 'Copy'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRevokeShareLink(lnk.id)}
                            className="px-2.5 py-1.5 rounded border border-[var(--border-hairline)] text-red-600 hover:bg-red-50"
                          >
                            Revoke
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showHistoryModal && (
        <div role="dialog" aria-modal="true" aria-label="Version history" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl max-w-md w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Version History</h2>
              <button type="button" aria-label="Close version history" onClick={() => setShowHistoryModal(false)} className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[var(--border-hairline)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {versions.map((ver) => (
                <div key={ver.id} className="p-3 rounded-lg border border-[var(--border-hairline)] flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold">
                      v{ver.versionNumber} · {ver.label}
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)]">
                      {new Date(ver.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRestoreVersion(ver.id)}
                    className="px-3 py-1.5 rounded border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)] font-medium"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload & Cutout Studio Modal */}
      <ImageCutoutModal
        isOpen={cutoutModalState.open}
        initialSrc={cutoutModalState.initialSrc}
        initialOriginalSrc={cutoutModalState.initialOriginalSrc}
        onClose={() => setCutoutModalState({ open: false })}
        onComplete={(publicUrl, meta) => {
          if (!activeSlide || !doc) return;
          if (cutoutModalState.targetElementId) {
            commitChange((d) => ({
              ...d,
              slides: d.slides.map((sl) =>
                sl.id !== activeSlide.id
                  ? sl
                  : {
                      ...sl,
                      elements: sl.elements.map((el) =>
                        el.id === cutoutModalState.targetElementId && el.type === 'image'
                          ? {
                              ...el,
                              src: publicUrl,
                              originalSrc: meta.originalSrc || el.originalSrc || el.src,
                              cutoutMode: meta.cutoutMode,
                              objectFit: 'contain',
                            }
                          : el
                      ),
                    }
              ),
            }));
          } else {
            addElement(activeSlide.id, {
              id: `el-${Date.now()}`,
              name: meta.alt || 'Cutout Photo',
              type: 'image',
              x: Math.round(doc.width / 2 - 180),
              y: Math.round(doc.height / 2 - 180),
              width: 360,
              height: 360,
              rotation: 0,
              zIndex: activeSlide.elements.length + 1,
              opacity: 1,
              visible: true,
              locked: false,
              src: publicUrl,
              originalSrc: meta.originalSrc,
              cutoutMode: meta.cutoutMode,
              alt: meta.alt || 'Cutout Photo',
              objectFit: 'contain',
              borderRadius: 0,
            });
          }
        }}
      />
    </div>
  );
}
