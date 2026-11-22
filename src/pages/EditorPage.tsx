import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  Check,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Copy,
  Crop,
  Download,
  Eye,
  FileDown,
  Grid,
  Group,
  History,
  Image as ImageIcon,
  ImagePlus,
  Keyboard,
  Layers,
  Lock,
  Maximize,
  Maximize2,
  Minimize2,
  Palette,
  PenTool,
  Play,
  Plus,
  Redo2,
  RotateCcw,
  Ruler,
  Save,
  Scissors,
  Shapes,
  Share2,
  ShieldCheck,
  Sliders,
  Sparkles,
  Square,
  Table as TableIcon,
  Trash2,
  Type as TypeIcon,
  Undo2,
  Ungroup,
  Unlink,
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
import {
  StudioLeftDrawer,
  type StudioRailTab,
  type TextPresetInput,
  type UploadedAssetItem,
} from '../components/editor/StudioLeftDrawer';
import {
  MobileElementsBrowser,
  MobileInsertHub,
  type MobileBrowseTab,
} from '../components/editor/MobileStudioSheet';
import { PageSetupModal } from '../components/editor/PageSetupModal';
import { BookFlipViewer } from '../components/editor/BookFlipViewer';
import { BUILTIN_CUSTOM_COMPONENTS, type CustomComponentManifest } from '../core/component-registry';
import { DESIGN_TOKEN_PRESETS, DEFAULT_FONT_ASSETS } from '../core/seed-data';
import { evaluatePresentationQuality, type QualityReport } from '../core/quality-scorer';
import {
  buildFreedrawPathFromPoints,
  getPhotoFrameDef,
  PHOTO_FRAME_CATALOG,
  type PhotoFrameDef,
} from '../core/frame-catalog';
import {
  CHART_PRESETS,
  TABLE_PRESETS,
  buildChartElementFromPreset,
  buildTableElementFromPreset,
  type ChartPresetDef,
  type TablePresetDef,
} from '../core/data-presets';
import { ICON_CATALOG, SHAPE_CATALOG, type CutoutItemDef } from '../core/svg-cutout-renderer';
import {
  DEFAULT_IMAGE_ADJUSTMENTS,
  IMAGE_FILTER_PRESETS,
  extractFrameMediaAdjustments,
  type ImageAdjustments,
} from '../core/crop-utils';
import type {
  DesignTokens,
  ElementAnimation,
  PresentationDocument,
  PresentationElement,
  ShapeElement,
} from '../core/schema';

type MobileSheet = null | 'elements' | 'insert' | 'edit' | 'layers' | 'more';

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
    selectAllOnActiveSlide,
    setZoom,
    toggleSnapToGrid,
    commitChange,
    updateElementLive,
    updateElementsLiveBatch,
    commitSnapshot,
    addElement,
    deleteSelectedElements,
    duplicateSelectedElement,
    copySelectedElement,
    pasteElement,
    groupSelectedElements,
    ungroupSelectedElements,
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
    resizeDocument,
    updatePageMargin,
    undo,
    redo,
    setSavingState,
  } = useEditorStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<StudioRailTab>('slides');
  const [rightTab, setRightTab] = useState<'inspector' | 'layers' | 'theme'>('inspector');
  const [mobileSheet, setMobileSheet] = useState<MobileSheet>(null);
  const [mobileBrowseTab, setMobileBrowseTab] = useState<MobileBrowseTab>('elements');
  const [mobileElemCat, setMobileElemCat] = useState<string>('All');
  const [zoomMode, setZoomMode] = useState<'fit' | 'manual'>('fit');
  const [uploads, setUploads] = useState<UploadedAssetItem[]>([]);
  const [uploadingAssets, setUploadingAssets] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showInsertCompModal, setShowInsertCompModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showResizeModal, setShowResizeModal] = useState(false);
  const [cutoutModalState, setCutoutModalState] = useState<{
    open: boolean;
    targetElementId?: string;
    initialSrc?: string;
    initialOriginalSrc?: string;
  }>({ open: false });
  const [presentMode, setPresentMode] = useState(false);
  const [presentViewMode, setPresentViewMode] = useState<'slide' | 'book'>('slide');
  const [showNotesInPresent, setShowNotesInPresent] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [croppingElementId, setCroppingElementId] = useState<string | null>(null);
  const [isDrawingFrame, setIsDrawingFrame] = useState(false);

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

  const canvasRegionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const zoomAnchorRef = useRef<{ rx: number; ry: number } | null>(null);
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
        const [deckRes, compRes, tokRes, fontRes, uploadRes] = await Promise.all([
          apiFetch<{ presentation: any; versions: any[]; shareLinks: any[] }>(
            `/api/presentations/${presentationId}`
          ),
          apiFetch<any[]>('/api/catalog/components').catch(() => []),
          apiFetch<any[]>('/api/catalog/tokens').catch(() => []),
          apiFetch<any[]>('/api/catalog/fonts').catch(() => []),
          apiFetch<UploadedAssetItem[]>('/api/uploads').catch(() => []),
        ]);
        if (!mounted) return;
        loadDocument(deckRes.presentation.document);
        setVersions(deckRes.versions || []);
        setShareLinks(deckRes.shareLinks || []);
        setUploads(Array.isArray(uploadRes) ? uploadRes : []);
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
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          setShowNotesInPresent((v) => !v);
        }
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

      if (isDrawingFrame && e.key === 'Escape') {
        e.preventDefault();
        setIsDrawingFrame(false);
        return;
      }

      if (croppingElementId && (e.key === 'Escape' || e.key === 'Enter')) {
        e.preventDefault();
        setCroppingElementId(null);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.metaKey || e.ctrlKey) &&
        (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))
      ) {
        e.preventDefault();
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectAllOnActiveSlide();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'g' && !e.shiftKey) {
        e.preventDefault();
        groupSelectedElements();
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        ungroupSelectedElements();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelectedElement();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c') {
        copySelectedElement();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'v') {
        pasteElement();
      } else if (e.key === '[' || e.key === ']') {
        const curSel = useEditorStore.getState().selectedElementIds[0];
        if (curSel) {
          e.preventDefault();
          reorderLayer(curSel, e.key === ']' ? 'up' : 'down');
        }
      } else if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        handleStepZoom(0.1);
      } else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        handleStepZoom(-0.1);
      } else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        handleResetZoomFit();
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcutsModal((v) => !v);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && !croppingElementId) {
        deleteSelectedElements();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [presentMode, doc, activeSlideId, croppingElementId, isDrawingFrame]);

  useEffect(() => {
    setCroppingElementId(null);
    setIsDrawingFrame(false);
  }, [activeSlideId]);

  useEffect(() => {
    if (croppingElementId && !selectedElementIds.includes(croppingElementId)) {
      setCroppingElementId(null);
    }
  }, [selectedElementIds, croppingElementId]);

  const activeSlide = useMemo(
    () => doc?.slides.find((s) => s.id === activeSlideId) || doc?.slides[0],
    [doc, activeSlideId]
  );

  const selectedElements = useMemo(() => {
    if (!activeSlide || selectedElementIds.length === 0) return [];
    const set = new Set(selectedElementIds);
    return activeSlide.elements.filter((e) => set.has(e.id));
  }, [activeSlide, selectedElementIds]);

  const selectedElement = selectedElements[0] || null;
  const canGroup = selectedElements.length >= 2;
  const canUngroup = selectedElements.some((e) => Boolean(e.groupId));

  const croppingElement = useMemo(
    () => activeSlide?.elements.find((e) => e.id === croppingElementId) || null,
    [activeSlide, croppingElementId]
  );

  const fitScale = useMemo(() => {
    if (!doc) return 0.65;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    if (isMobile) {
      const availW = Math.max(
        240,
        (viewportSize.width || (typeof window !== 'undefined' ? window.innerWidth : 390)) - 28
      );
      const availH = Math.max(200, (viewportSize.height || 460) - 64);
      return Number(Math.max(0.22, Math.min(0.85, availW / doc.width, availH / doc.height)).toFixed(3));
    }
    const maxW = Math.max(320, viewportSize.width - 64);
    const maxH = Math.max(240, viewportSize.height - 96);
    return Number(Math.max(0.25, Math.min(maxW / doc.width, maxH / doc.height)).toFixed(3));
  }, [doc, viewportSize]);

  const responsiveScale = useMemo(() => {
    if (!doc) return 0.65;
    return Number((zoomMode === 'fit' ? fitScale : zoom).toFixed(3));
  }, [doc, zoomMode, fitScale, zoom]);

  const handleSetZoomDirect = (nextScale: number) => {
    const vp = viewportRef.current;
    if (vp) {
      const rx = vp.scrollWidth > vp.clientWidth + 2 ? (vp.scrollLeft + vp.clientWidth / 2) / vp.scrollWidth : 0.5;
      const ry = vp.scrollHeight > vp.clientHeight + 2 ? (vp.scrollTop + vp.clientHeight / 2) / vp.scrollHeight : 0.5;
      zoomAnchorRef.current = { rx, ry };
    } else {
      zoomAnchorRef.current = { rx: 0.5, ry: 0.5 };
    }
    const clamped = Math.max(0.25, Math.min(2, Number(nextScale.toFixed(3))));
    setZoom(clamped);
    setZoomMode('manual');
  };

  const handleStepZoom = (delta: number) => {
    handleSetZoomDirect(Number((responsiveScale + delta).toFixed(3)));
  };

  const handleResetZoomFit = () => {
    zoomAnchorRef.current = { rx: 0.5, ry: 0.5 };
    setZoomMode('fit');
    setZoom(fitScale);
  };

  useLayoutEffect(() => {
    const vp = viewportRef.current;
    const anchor = zoomAnchorRef.current;
    if (!vp || !anchor) return;
    if (vp.scrollWidth > vp.clientWidth) {
      vp.scrollLeft = Math.max(0, Math.round(anchor.rx * vp.scrollWidth - vp.clientWidth / 2));
    } else {
      vp.scrollLeft = 0;
    }
    if (vp.scrollHeight > vp.clientHeight) {
      vp.scrollTop = Math.max(0, Math.round(anchor.ry * vp.scrollHeight - vp.clientHeight / 2));
    } else {
      vp.scrollTop = 0;
    }
    zoomAnchorRef.current = null;
  }, [responsiveScale]);

  const handleStepZoomRef = useRef(handleStepZoom);
  handleStepZoomRef.current = handleStepZoom;

  useEffect(() => {
    const host = canvasRegionRef.current;
    if (!host) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const step = e.deltaY < 0 ? 0.08 : -0.08;
      handleStepZoomRef.current(step);
    };
    host.addEventListener('wheel', onWheel, { passive: false });
    return () => host.removeEventListener('wheel', onWheel);
  }, [loading, doc?.id]);

  const openPresentMode = (preferred?: 'slide' | 'book') => {
    setPresentViewMode(preferred ?? (doc?.aspectRatio === 'book' ? 'book' : 'slide'));
    setPresentMode(true);
  };

  const handleUploadAssets = async (files: FileList | File[]) => {
    const list = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || /\.(png|jpe?g|webp|svg|gif)$/i.test(f.name)
    );
    if (list.length === 0) {
      setError('Please select PNG, JPG, WebP, GIF, or SVG images.');
      return;
    }
    setUploadingAssets(true);
    try {
      const uploaded: UploadedAssetItem[] = [];
      for (const file of list) {
        const form = new FormData();
        form.append('file', file);
        const res = await apiFetch<UploadedAssetItem>('/api/uploads', {
          method: 'POST',
          body: form,
        });
        uploaded.push(res);
      }
      setUploads((prev) => [...uploaded, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploadingAssets(false);
    }
  };

  const handleDeleteUpload = async (id: string) => {
    try {
      await apiFetch(`/api/uploads/${id}`, { method: 'DELETE' });
      setUploads((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message || 'Could not remove uploaded image.');
    }
  };

  const insertTextPresetElement = (preset?: TextPresetInput) => {
    if (!doc || !activeSlide) return;
    const isSticker = preset?.textEffect === 'sticker-outline';
    const isRansom = preset?.textEffect === 'ransom-cutout';
    const w = isSticker
      ? Math.min(doc.width - 80, 460)
      : isRansom
      ? Math.min(doc.width - 80, 420)
      : Math.min(doc.width - 80, 560);
    const h = isSticker ? 175 : preset && preset.fontSize >= 36 ? 120 : 100;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: preset?.name || 'Text Block',
      type: 'text',
      x: Math.max(24, Math.round(doc.width / 2 - w / 2)),
      y: Math.max(24, Math.round(doc.height * 0.24)),
      width: w,
      height: h,
      rotation: preset?.rotation ?? 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      content: preset?.content ?? 'TEXT HERE',
      fontFamily: preset?.fontFamily || doc.tokens.typography.bodyFont,
      fontSize: preset?.fontSize || 22,
      fontWeight: preset?.fontWeight || 400,
      fontStyle: 'normal',
      lineHeight: preset?.lineHeight ?? 1.3,
      letterSpacing: 0,
      textAlign:
        preset?.backgroundColor || isSticker || isRansom || (preset && preset.fontSize >= 36)
          ? 'center'
          : 'left',
      color: preset?.color || doc.tokens.colors.ink,
      textShadow: preset?.textShadow,
      textEffect: preset?.textEffect ?? 'none',
      outlineColor: preset?.outlineColor,
      outlineWidth: preset?.outlineWidth,
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
    const isBg = def.category === 'Backgrounds';
    const isStructural = isBg || def.category === 'Headers & Lines' || def.category === 'Borders & Edges';
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: def.name,
      type: 'custom',
      x: isBg ? 0 : Math.round(doc.width / 2 - def.defaultWidth / 2),
      y: isBg ? 0 : Math.round(doc.height / 2 - def.defaultHeight / 2),
      width: isBg ? doc.width : def.defaultWidth,
      height: isBg ? doc.height : def.defaultHeight,
      rotation: 0,
      zIndex: isBg ? 0 : activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      componentKey: 'cutout-illustration',
      componentVersion: '1.0.0',
      props: { ...def.defaultProps },
      animation: isStructural ? 'none' : 'pop',
    });
    setMobileSheet(null);
  };

  const insertIconElement = (
    iconId: string,
    label: string,
    color: string,
    colorMode: 'brand' | 'mono' = 'brand'
  ) => {
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
      colorMode,
      strokeWidth: 1.9,
    });
    setMobileSheet(null);
  };

  const insertChartElement = (preset?: ChartPresetDef) => {
    if (!doc || !activeSlide) return;
    addElement(
      activeSlide.id,
      buildChartElementFromPreset(
        preset || CHART_PRESETS[0],
        doc.width,
        doc.height,
        activeSlide.elements.length + 1,
        doc.tokens
      )
    );
    setMobileSheet(null);
  };

  const insertTableElement = (preset?: TablePresetDef) => {
    if (!doc || !activeSlide) return;
    addElement(
      activeSlide.id,
      buildTableElementFromPreset(
        preset || TABLE_PRESETS[0],
        doc.width,
        doc.height,
        activeSlide.elements.length + 1,
        doc.tokens
      )
    );
    setMobileSheet(null);
  };

  const handleInsertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlide) return;
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiFetch<UploadedAssetItem>('/api/uploads', { method: 'POST', body: form });
      setUploads((prev) => [res, ...prev]);
      addElement(activeSlide.id, {
        id: `el-${Date.now()}`,
        name: file.name,
        type: 'image',
        x: Math.max(24, Math.round((doc?.width || 960) / 2 - 220)),
        y: Math.max(24, Math.round((doc?.height || 720) / 2 - 150)),
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

  const handleSlotImageIntoFrame = (imageElId: string, frameElId: string) => {
    if (!doc || !activeSlide) return;
    const imgEl = activeSlide.elements.find((e) => e.id === imageElId && e.type === 'image');
    const frameEl = activeSlide.elements.find((e) => e.id === frameElId && e.type === 'custom');
    if (!imgEl || imgEl.type !== 'image' || !frameEl || frameEl.type !== 'custom') return;

    useEditorStore.setState((state) => {
      if (!state.document) return state;
      return {
        document: {
          ...state.document,
          slides: state.document.slides.map((sl) =>
            sl.id !== activeSlide.id
              ? sl
              : {
                  ...sl,
                  elements: sl.elements
                    .filter((el) => el.id !== imageElId)
                    .map((el) =>
                      el.id === frameElId && el.type === 'custom'
                        ? {
                            ...el,
                            props: {
                              ...el.props,
                              mediaSrc: imgEl.src,
                              mediaOriginalSrc: imgEl.originalSrc || imgEl.src,
                              mediaAlt: imgEl.alt || el.name,
                              mediaFit: 'cover',
                              mediaCropX: imgEl.cropX ?? 50,
                              mediaCropY: imgEl.cropY ?? 50,
                              mediaZoom: imgEl.cropZoom ?? 1,
                              mediaBrightness: imgEl.brightness ?? 100,
                              mediaContrast: imgEl.contrast ?? 100,
                              mediaSaturation: imgEl.saturation ?? 100,
                              mediaHueRotate: imgEl.hueRotate ?? 0,
                              mediaBlur: imgEl.blur ?? 0,
                              mediaGrayscale: imgEl.grayscale ?? 0,
                              mediaSepia: imgEl.sepia ?? 0,
                            },
                          }
                        : el
                    ),
                }
          ),
        },
        selectedElementIds: [frameElId],
        isDirty: true,
      };
    });
  };

  const handleDetachFrameMedia = (frameElId: string) => {
    if (!doc || !activeSlide) return;
    const frameEl = activeSlide.elements.find((e) => e.id === frameElId && e.type === 'custom');
    if (!frameEl || frameEl.type !== 'custom' || typeof frameEl.props.mediaSrc !== 'string' || !frameEl.props.mediaSrc) {
      return;
    }

    const cavRatio =
      frameEl.componentKey === 'retro-tv-frame'
        ? { x: 42 / 660, y: 120 / 540, w: 432 / 660, h: 346 / 540 }
        : (() => {
            const def = getPhotoFrameDef(frameEl.props.frameKind, frameEl.props);
            return {
              x: def.cavity.x / def.viewBoxW,
              y: def.cavity.y / def.viewBoxH,
              w: def.cavity.width / def.viewBoxW,
              h: def.cavity.height / def.viewBoxH,
            };
          })();

    const screenW = Math.max(120, Math.round(frameEl.width * cavRatio.w));
    const screenH = Math.max(100, Math.round(frameEl.height * cavRatio.h));
    const detachedId = `el-${Date.now()}`;
    const nextMediaSrc = String(frameEl.props.mediaSrc);
    const nextOriginalSrc =
      typeof frameEl.props.mediaOriginalSrc === 'string' ? frameEl.props.mediaOriginalSrc : nextMediaSrc;
    const nextAlt = typeof frameEl.props.mediaAlt === 'string' ? frameEl.props.mediaAlt : 'Frame Photo';
    const nextFit = frameEl.props.mediaFit === 'contain' ? 'contain' : 'cover';
    const nextCropX = typeof frameEl.props.mediaCropX === 'number' ? frameEl.props.mediaCropX : 50;
    const nextCropY = typeof frameEl.props.mediaCropY === 'number' ? frameEl.props.mediaCropY : 50;
    const nextZoom = typeof frameEl.props.mediaZoom === 'number' ? frameEl.props.mediaZoom : 1;
    const nextAdj = extractFrameMediaAdjustments(frameEl.props);

    setCroppingElementId(null);
    commitChange((d) => ({
      ...d,
      slides: d.slides.map((sl) => {
        if (sl.id !== activeSlide.id) return sl;
        const cleaned = sl.elements.map((el) => {
          if (el.id !== frameElId || el.type !== 'custom') return el;
          const nextProps = { ...el.props };
          delete nextProps.mediaSrc;
          delete nextProps.mediaOriginalSrc;
          delete nextProps.mediaAlt;
          delete nextProps.mediaFit;
          delete nextProps.mediaCropX;
          delete nextProps.mediaCropY;
          delete nextProps.mediaZoom;
          delete nextProps.mediaBrightness;
          delete nextProps.mediaContrast;
          delete nextProps.mediaSaturation;
          delete nextProps.mediaHueRotate;
          delete nextProps.mediaBlur;
          delete nextProps.mediaGrayscale;
          delete nextProps.mediaSepia;
          return { ...el, props: nextProps };
        });
        const detachedEl: PresentationElement = {
          id: detachedId,
          name: nextAlt,
          type: 'image',
          x: Math.min(d.width - screenW - 16, Math.round(frameEl.x + frameEl.width * cavRatio.x + 28)),
          y: Math.min(d.height - screenH - 16, Math.round(frameEl.y + frameEl.height * cavRatio.y + 28)),
          width: screenW,
          height: screenH,
          rotation: 0,
          zIndex: frameEl.zIndex + 1,
          opacity: 1,
          visible: true,
          locked: false,
          src: nextMediaSrc,
          originalSrc: nextOriginalSrc,
          alt: nextAlt,
          objectFit: nextFit,
          borderRadius: 12,
          cropX: nextCropX,
          cropY: nextCropY,
          cropZoom: nextZoom,
          brightness: nextAdj.brightness,
          contrast: nextAdj.contrast,
          saturation: nextAdj.saturation,
          hueRotate: nextAdj.hueRotate,
          blur: nextAdj.blur,
          grayscale: nextAdj.grayscale,
          sepia: nextAdj.sepia,
        };
        return { ...sl, elements: [...cleaned, detachedEl] };
      }),
    }));
    selectElements([detachedId]);
  };

  const handleClearFrameMedia = (frameElId: string) => {
    if (!activeSlide) return;
    setCroppingElementId(null);
    commitChange((d) => ({
      ...d,
      slides: d.slides.map((sl) =>
        sl.id !== activeSlide.id
          ? sl
          : {
              ...sl,
              elements: sl.elements.map((el) => {
                if (el.id !== frameElId || el.type !== 'custom') return el;
                const nextProps = { ...el.props };
                delete nextProps.mediaSrc;
                delete nextProps.mediaOriginalSrc;
                delete nextProps.mediaAlt;
                delete nextProps.mediaFit;
                delete nextProps.mediaCropX;
                delete nextProps.mediaCropY;
                delete nextProps.mediaZoom;
                delete nextProps.mediaBrightness;
                delete nextProps.mediaContrast;
                delete nextProps.mediaSaturation;
                delete nextProps.mediaHueRotate;
                delete nextProps.mediaBlur;
                delete nextProps.mediaGrayscale;
                delete nextProps.mediaSepia;
                return { ...el, props: nextProps };
              }),
            }
      ),
    }));
  };

  const insertOrSlotImageUrl = (
    publicUrl: string,
    altName: string,
    canvasX: number,
    canvasY: number,
    targetFrameId?: string
  ) => {
    if (!doc || !activeSlide) return;
    if (targetFrameId) {
      commitChange((d) => ({
        ...d,
        slides: d.slides.map((sl) =>
          sl.id !== activeSlide.id
            ? sl
            : {
                ...sl,
                elements: sl.elements.map((el) =>
                  el.id === targetFrameId && el.type === 'custom'
                    ? {
                        ...el,
                        props: {
                          ...el.props,
                          mediaSrc: publicUrl,
                          mediaOriginalSrc: publicUrl,
                          mediaAlt: altName,
                          mediaFit: 'cover',
                          mediaCropX: 50,
                          mediaCropY: 50,
                          mediaZoom: 1,
                        },
                      }
                    : el
                ),
              }
        ),
      }));
      selectElements([targetFrameId]);
      return;
    }

    const w = 420;
    const h = 290;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: altName,
      type: 'image',
      x: Math.max(0, Math.min(doc.width - w, Math.round(canvasX - w / 2))),
      y: Math.max(0, Math.min(doc.height - h, Math.round(canvasY - h / 2))),
      width: w,
      height: h,
      rotation: 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      src: publicUrl,
      originalSrc: publicUrl,
      alt: altName,
      objectFit: 'cover',
      borderRadius: 8,
    });
  };

  const handleDropImageFile = async (
    file: File,
    canvasX: number,
    canvasY: number,
    targetFrameId?: string
  ) => {
    if (!file.type.startsWith('image/') && !/\.(png|jpe?g|webp|svg|gif)$/i.test(file.name)) {
      setError('Please drop a PNG, JPG, WebP, or SVG image file.');
      return;
    }
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiFetch<UploadedAssetItem>('/api/uploads', { method: 'POST', body: form });
      setUploads((prev) => [res, ...prev]);
      insertOrSlotImageUrl(res.publicUrl, file.name, canvasX, canvasY, targetFrameId);
    } catch (err: any) {
      setError(err.message || 'Could not upload dropped image.');
    }
  };

  const handleInsertRetroTvFrame = () => {
    const manifest =
      componentsCatalog.find((c) => c.componentKey === 'retro-tv-frame') ||
      BUILTIN_CUSTOM_COMPONENTS.find((c) => c.componentKey === 'retro-tv-frame');
    if (!manifest || !doc || !activeSlide) return;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: manifest.name,
      type: 'custom',
      x: Math.round(doc.width / 2 - 220),
      y: Math.round(doc.height / 2 - 180),
      width: 440,
      height: 360,
      rotation: 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      componentKey: manifest.componentKey,
      componentVersion: manifest.version,
      props: { ...manifest.defaultProps, accentColor: doc.tokens.colors.accent },
    });
    setMobileSheet(null);
  };

  const handleInsertPhotoFrame = (def: PhotoFrameDef) => {
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
      componentKey: 'photo-frame',
      componentVersion: '1.0.0',
      props: {
        frameKind: def.kind,
        tintColor: '#CBD5E1',
        accentColor: doc.tokens.colors.accent,
      },
    });
    setMobileSheet(null);
  };

  const handleCompleteFreedrawFrame = (points: Array<{ x: number; y: number }>) => {
    setIsDrawingFrame(false);
    if (!doc || !activeSlide) return;
    const res = buildFreedrawPathFromPoints(points);
    if (!res) return;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: 'Freedraw Frame',
      type: 'custom',
      x: res.x,
      y: res.y,
      width: res.width,
      height: res.height,
      rotation: 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      componentKey: 'photo-frame',
      componentVersion: '1.0.0',
      props: {
        frameKind: 'custom-freedraw',
        customClipPathD: res.clipPathD,
        customViewBoxW: res.viewBoxW,
        customViewBoxH: res.viewBoxH,
        customFrameName: 'Freedraw Frame',
        tintColor: '#CBD5E1',
        accentColor: doc.tokens.colors.accent,
      },
    });
  };

  const handleInsertRetroDialog = (preset: Record<string, unknown> & { name: string }) => {
    if (!doc || !activeSlide) return;
    const { name, id: _presetId, ...dialogProps } = preset;
    const w = Math.min(doc.width - 80, 420);
    const h = 220;
    addElement(activeSlide.id, {
      id: `el-${Date.now()}`,
      name: name || 'Retro Error Modal',
      type: 'custom',
      x: Math.round(doc.width / 2 - w / 2),
      y: Math.round(doc.height / 2 - h / 2),
      width: w,
      height: h,
      rotation: 0,
      zIndex: activeSlide.elements.length + 1,
      opacity: 1,
      visible: true,
      locked: false,
      componentKey: 'retro-os-dialog',
      componentVersion: '1.0.0',
      props: {
        progressPercent: 55,
        ...dialogProps,
      },
    });
    setMobileSheet(null);
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

  // Fullscreen Present & Animated Book Flip Mode
  if (presentMode) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0D0F13] text-white flex flex-col justify-between p-3 sm:p-6">
        <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
          <div className="min-w-0 flex-1 flex items-center gap-1.5 text-xs font-mono-tabular text-neutral-400">
            <span className="truncate">{doc.title}</span>
            <span className="shrink-0">·</span>
            <span className="shrink-0 whitespace-nowrap">
              {presentViewMode === 'book' ? 'Book Flip' : 'Slide'} {activeSlideIndex + 1} /{' '}
              {doc.slides.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="inline-flex rounded-lg border border-neutral-700 bg-neutral-900 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setPresentViewMode('slide')}
                className={`px-2 sm:px-2.5 py-1 rounded-md font-medium ${
                  presentViewMode === 'slide' ? 'bg-white text-neutral-900' : 'text-neutral-300'
                }`}
              >
                Slides
              </button>
              <button
                type="button"
                onClick={() => setPresentViewMode('book')}
                className={`px-2 sm:px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1 ${
                  presentViewMode === 'book' ? 'bg-[var(--accent)] text-white' : 'text-neutral-300'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Book Flip</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowNotesInPresent((v) => !v)}
              title="Toggle speaker notes (N)"
              className={`px-2.5 sm:px-3 py-1.5 rounded-md border text-xs transition-colors ${
                showNotesInPresent
                  ? 'border-[var(--accent)] bg-[var(--accent)]/20 text-white'
                  : 'border-neutral-700 text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              {showNotesInPresent ? 'Hide Notes' : 'Notes'}
            </button>
            <button
              type="button"
              onClick={() => setPresentMode(false)}
              className="px-2.5 sm:px-3 py-1.5 rounded-md bg-white text-neutral-900 text-xs font-semibold inline-flex items-center gap-1"
            >
              <Minimize2 className="w-3.5 h-3.5" /> Exit
            </button>
          </div>
        </div>

        {presentViewMode === 'book' ? (
          <div className="flex-1 min-h-0 flex flex-col justify-between gap-2">
            <BookFlipViewer
              doc={doc}
              initialSlideIndex={activeSlideIndex}
              onSlideChange={selectSlide}
            />
            {showNotesInPresent && (
              <div className="max-w-3xl w-full mx-auto p-3 rounded-xl bg-neutral-900/95 border border-neutral-800 text-xs sm:text-sm text-neutral-200 leading-relaxed">
                <div className="text-[10px] font-mono-tabular uppercase tracking-wider text-neutral-400 mb-1">
                  Speaker Cues · Page {activeSlideIndex + 1}
                </div>
                {activeSlide.speakerNotes || 'No speaker notes for this slide yet.'}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex-1 flex items-center justify-center overflow-hidden my-3 sm:my-4">
              <SlideCanvas
                slide={activeSlide}
                tokens={doc.tokens}
                width={doc.width}
                height={doc.height}
                scale={
                  typeof window !== 'undefined'
                    ? Math.min((window.innerWidth - 48) / doc.width, (window.innerHeight - (showNotesInPresent ? 250 : 180)) / doc.height)
                    : 0.85
                }
                animated
                animationKey={activeSlideIndex}
              />
            </div>

            <div className="space-y-3">
              {showNotesInPresent && (
                <div className="max-w-3xl mx-auto p-3.5 rounded-xl bg-neutral-900/95 border border-neutral-800 text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  <div className="text-[10px] font-mono-tabular uppercase tracking-wider text-neutral-400 mb-1">
                    Speaker Cues · Slide {activeSlideIndex + 1}
                  </div>
                  {activeSlide.speakerNotes || 'No speaker notes for this slide yet.'}
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
          </>
        )}
      </div>
    );
  }

  const renderInspectorContent = () => (
    <div className="space-y-5 text-xs">
      {selectedElements.length > 1 ? (
        <div className="p-3.5 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-soft)]/35 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase text-[var(--accent)]">
                Multi-Selection
              </div>
              <div className="font-semibold text-sm">{selectedElements.length} objects selected</div>
            </div>
            <button
              type="button"
              onClick={selectAllOnActiveSlide}
              className="px-2 py-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[11px] font-medium"
            >
              Select All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {canGroup && (
              <button
                type="button"
                onClick={groupSelectedElements}
                className="h-9 px-3 rounded-lg bg-[var(--accent)] text-white font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <Group className="w-3.5 h-3.5" /> Group
              </button>
            )}
            {canUngroup && (
              <button
                type="button"
                onClick={ungroupSelectedElements}
                className="h-9 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <Ungroup className="w-3.5 h-3.5" /> Ungroup
              </button>
            )}
            <button
              type="button"
              onClick={duplicateSelectedElement}
              className="h-9 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] font-medium inline-flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> Duplicate
            </button>
            <button
              type="button"
              onClick={deleteSelectedElements}
              className="h-9 px-3 rounded-lg border border-red-200 bg-red-50 text-red-700 font-medium inline-flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      ) : selectedElement ? (
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

              <div className="p-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] space-y-2.5">
                <label className="block">
                  <span className="text-[11px] text-[var(--text-secondary)] block mb-1">
                    Text Style Effect
                  </span>
                  <select
                    value={selectedElement.textEffect || 'none'}
                    onChange={(e) => {
                      const eff = e.target.value as 'none' | 'sticker-outline' | 'ransom-cutout';
                      commitPatchOnSelected({
                        textEffect: eff,
                        outlineColor: selectedElement.outlineColor || '#1B365D',
                        outlineWidth: selectedElement.outlineWidth ?? 12,
                      } as any);
                    }}
                    className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)]"
                  >
                    <option value="none">Standard Typography</option>
                    <option value="sticker-outline">Sticker Bold Contour</option>
                    <option value="ransom-cutout">Ransom Cutout Tiles (Magazine)</option>
                  </select>
                </label>

                {selectedElement.textEffect === 'sticker-outline' && (
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center justify-between">
                      <span className="text-[11px] text-[var(--text-secondary)]">Outline Color</span>
                      <input
                        type="color"
                        value={selectedElement.outlineColor || '#1B365D'}
                        onChange={(e) => commitPatchOnSelected({ outlineColor: e.target.value } as any)}
                        className="w-10 h-8 rounded border border-[var(--border-hairline)] cursor-pointer"
                      />
                    </label>
                    <label className="block">
                      <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-0.5">
                        <span>Outline Thickness</span>
                        <span className="font-mono-tabular">{selectedElement.outlineWidth ?? 12}px</span>
                      </div>
                      <input
                        type="range"
                        min={2}
                        max={24}
                        step={1}
                        value={selectedElement.outlineWidth ?? 12}
                        onChange={(e) =>
                          updateElementLive(activeSlide.id, selectedElement.id, {
                            outlineWidth: Number(e.target.value),
                          } as any)
                        }
                        onMouseUp={(e) =>
                          commitPatchOnSelected({
                            outlineWidth: Number((e.target as HTMLInputElement).value),
                          } as any)
                        }
                        className="w-full accent-[var(--accent)]"
                      />
                    </label>
                  </div>
                )}

                {selectedElement.textEffect === 'ransom-cutout' && (
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    Each character gets a unique magazine cutout paper badge. Double-click text on canvas to edit.
                  </p>
                )}
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

              {/* Crop & Frame Controls */}
              <div className="p-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold">Crop &amp; Frame Position</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCroppingElementId((cur) => (cur === selectedElement.id ? null : selectedElement.id))
                      }
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold inline-flex items-center gap-1 ${
                        croppingElementId === selectedElement.id
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--accent-soft)] text-[var(--accent)]'
                      }`}
                    >
                      <Crop className="w-3 h-3" />
                      {croppingElementId === selectedElement.id ? 'Done' : 'Edit Crop'}
                    </button>
                    <button
                      type="button"
                      title="Reset crop"
                      onClick={() =>
                        commitPatchOnSelected({ cropX: 50, cropY: 50, cropZoom: 1 } as any)
                      }
                      className="p-1 rounded border border-[var(--border-hairline)] hover:bg-[var(--bg-subtle)]"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <label className="block">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
                    <span>Zoom</span>
                    <span className="font-mono-tabular">{(selectedElement.cropZoom ?? 1).toFixed(2)}×</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={3.5}
                    step={0.05}
                    value={selectedElement.cropZoom ?? 1}
                    onChange={(e) =>
                      updateElementLive(activeSlide.id, selectedElement.id, {
                        cropZoom: Number(e.target.value),
                      } as any)
                    }
                    onMouseUp={(e) =>
                      commitPatchOnSelected({ cropZoom: Number((e.target as HTMLInputElement).value) } as any)
                    }
                    className="w-full accent-[var(--accent)]"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
                      <span>Pan X</span>
                      <span className="font-mono-tabular">{Math.round(selectedElement.cropX ?? 50)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selectedElement.cropX ?? 50}
                      onChange={(e) =>
                        updateElementLive(activeSlide.id, selectedElement.id, {
                          cropX: Number(e.target.value),
                        } as any)
                      }
                      onMouseUp={(e) =>
                        commitPatchOnSelected({ cropX: Number((e.target as HTMLInputElement).value) } as any)
                      }
                      className="w-full accent-[var(--accent)]"
                    />
                  </label>
                  <label className="block">
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
                      <span>Pan Y</span>
                      <span className="font-mono-tabular">{Math.round(selectedElement.cropY ?? 50)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selectedElement.cropY ?? 50}
                      onChange={(e) =>
                        updateElementLive(activeSlide.id, selectedElement.id, {
                          cropY: Number(e.target.value),
                        } as any)
                      }
                      onMouseUp={(e) =>
                        commitPatchOnSelected({ cropY: Number((e.target as HTMLInputElement).value) } as any)
                      }
                      className="w-full accent-[var(--accent)]"
                    />
                  </label>
                </div>
              </div>

              {/* Color & Tone Adjustments */}
              <div className="p-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold">Color &amp; Tone Adjustments</span>
                  <button
                    type="button"
                    title="Reset color adjustments"
                    onClick={() => commitPatchOnSelected({ ...DEFAULT_IMAGE_ADJUSTMENTS } as any)}
                    className="px-2 py-0.5 rounded border border-[var(--border-hairline)] text-[10px] font-medium hover:bg-[var(--bg-subtle)] inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> Reset
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {IMAGE_FILTER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => commitPatchOnSelected({ ...preset.values } as any)}
                      className="px-1.5 py-1 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--accent)] text-[10px] font-medium truncate"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {(
                  [
                    { key: 'brightness', label: 'Brightness', min: 20, max: 200, step: 1, def: 100, unit: '%' },
                    { key: 'contrast', label: 'Contrast', min: 20, max: 200, step: 1, def: 100, unit: '%' },
                    { key: 'saturation', label: 'Saturation', min: 0, max: 250, step: 1, def: 100, unit: '%' },
                    { key: 'hueRotate', label: 'Hue / Tint', min: -180, max: 180, step: 2, def: 0, unit: '°' },
                    { key: 'blur', label: 'Blur', min: 0, max: 20, step: 0.5, def: 0, unit: 'px' },
                    { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, step: 1, def: 0, unit: '%' },
                    { key: 'sepia', label: 'Sepia', min: 0, max: 100, step: 1, def: 0, unit: '%' },
                  ] as Array<{
                    key: keyof ImageAdjustments;
                    label: string;
                    min: number;
                    max: number;
                    step: number;
                    def: number;
                    unit: string;
                  }>
                ).map((ctrl) => {
                  const val = (selectedElement[ctrl.key] as number | undefined) ?? ctrl.def;
                  return (
                    <label key={ctrl.key} className="block">
                      <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-0.5">
                        <span>{ctrl.label}</span>
                        <span className="font-mono-tabular">
                          {val}
                          {ctrl.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={ctrl.min}
                        max={ctrl.max}
                        step={ctrl.step}
                        value={val}
                        onChange={(e) =>
                          updateElementLive(activeSlide.id, selectedElement.id, {
                            [ctrl.key]: Number(e.target.value),
                          } as any)
                        }
                        onMouseUp={(e) =>
                          commitPatchOnSelected({
                            [ctrl.key]: Number((e.target as HTMLInputElement).value),
                          } as any)
                        }
                        onTouchEnd={(e) =>
                          commitPatchOnSelected({
                            [ctrl.key]: Number((e.target as HTMLInputElement).value),
                          } as any)
                        }
                        className="w-full accent-[var(--accent)]"
                      />
                    </label>
                  );
                })}
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
                  onChange={(e) => {
                    const nextId = e.target.value;
                    const found = ICON_CATALOG.find((ic) => ic.id === nextId);
                    commitPatchOnSelected({
                      iconName: nextId,
                      ...((selectedElement.colorMode ?? 'brand') === 'brand' && found
                        ? { color: found.defaultColor }
                        : {}),
                    } as any);
                  }}
                  className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                >
                  {ICON_CATALOG.map((ic) => (
                    <option key={ic.id} value={ic.id}>
                      {ic.label} ({ic.category})
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Color Style</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const found = ICON_CATALOG.find((ic) => ic.id === selectedElement.iconName);
                      commitPatchOnSelected({
                        colorMode: 'brand',
                        ...(found ? { color: found.defaultColor } : {}),
                      } as any);
                    }}
                    className={`h-8 rounded-md border text-[11px] font-semibold ${
                      (selectedElement.colorMode ?? 'brand') === 'brand'
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Original Brand
                  </button>
                  <button
                    type="button"
                    onClick={() => commitPatchOnSelected({ colorMode: 'mono' } as any)}
                    className={`h-8 rounded-md border text-[11px] font-semibold ${
                      selectedElement.colorMode === 'mono'
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Custom Tint
                  </button>
                </div>
              </div>

              <label className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Custom Tint Color
                </span>
                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) =>
                    commitPatchOnSelected({ color: e.target.value, colorMode: 'mono' } as any)
                  }
                  className="w-10 h-8 rounded cursor-pointer border border-[var(--border-hairline)]"
                />
              </label>

              {selectedElement.colorMode === 'mono' && (
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
              )}
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
                  <option value="bar">Vertical Bar Chart</option>
                  <option value="horizontal-bar">Horizontal Bar Chart</option>
                  <option value="line">Line Trend Chart</option>
                  <option value="area">Area Spark Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="donut">Donut Ring Chart</option>
                  <option value="metric-bars">KPI Metric Bars</option>
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
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedElement.showValues}
                    onChange={(e) => commitPatchOnSelected({ showValues: e.target.checked } as any)}
                    className="accent-[var(--accent)]"
                  />
                  <span>Show Values</span>
                </label>
                <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedElement.showLegend}
                    onChange={(e) => commitPatchOnSelected({ showLegend: e.target.checked } as any)}
                    className="accent-[var(--accent)]"
                  />
                  <span>Show Legend</span>
                </label>
              </div>
              <label className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-secondary)]">Chart Accent</span>
                <input
                  type="color"
                  value={selectedElement.accentColor}
                  onChange={(e) => commitPatchOnSelected({ accentColor: e.target.value } as any)}
                  className="w-10 h-8 rounded cursor-pointer border border-[var(--border-hairline)]"
                />
              </label>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-secondary)]">Data Series</span>
                  <button
                    type="button"
                    onClick={() =>
                      commitPatchOnSelected({
                        data: [
                          ...selectedElement.data,
                          {
                            label: `Item ${selectedElement.data.length + 1}`,
                            value: 50,
                            color: selectedElement.accentColor,
                          },
                        ],
                      } as any)
                    }
                    className="text-[11px] font-semibold text-[var(--accent)] hover:underline"
                  >
                    + Add Row
                  </button>
                </div>
                {selectedElement.data.map((d, di) => (
                  <div key={di} className="grid grid-cols-[1fr_72px_28px] gap-1.5 items-center">
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
                    <button
                      type="button"
                      disabled={selectedElement.data.length <= 1}
                      onClick={() =>
                        commitPatchOnSelected({
                          data: selectedElement.data.filter((_, idx) => idx !== di),
                        } as any)
                      }
                      className="h-8 rounded border border-[var(--border-hairline)] text-red-600 disabled:opacity-30 inline-flex items-center justify-center"
                      aria-label="Remove chart datum"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table Properties */}
          {selectedElement.type === 'table' && (
            <div className="space-y-3 pt-3 border-t border-[var(--border-hairline)]">
              <label className="block">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Table Style</span>
                <select
                  value={selectedElement.tableStyle || 'classic'}
                  onChange={(e) => commitPatchOnSelected({ tableStyle: e.target.value as any } as any)}
                  className="w-full h-9 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
                >
                  <option value="classic">Classic Header</option>
                  <option value="striped">Striped Rows</option>
                  <option value="comparison">Comparison Matrix</option>
                  <option value="minimal">Editorial Minimal</option>
                  <option value="dark">Dark Spec</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    commitPatchOnSelected({
                      rows: [...selectedElement.rows, selectedElement.headers.map(() => '—')],
                    } as any)
                  }
                  className="h-8 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] text-[11px] font-medium"
                >
                  + Add Row
                </button>
                <button
                  type="button"
                  onClick={() =>
                    commitPatchOnSelected({
                      headers: [...selectedElement.headers, `Col ${selectedElement.headers.length + 1}`],
                      rows: selectedElement.rows.map((r) => [...r, '—']),
                    } as any)
                  }
                  className="h-8 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] text-[11px] font-medium"
                >
                  + Add Column
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <label className="block">
                  <span className="text-[10px] text-[var(--text-secondary)] block mb-1">Header</span>
                  <input
                    type="color"
                    value={selectedElement.headerBg}
                    onChange={(e) => commitPatchOnSelected({ headerBg: e.target.value } as any)}
                    className="w-full h-7 rounded cursor-pointer border border-[var(--border-hairline)]"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-[var(--text-secondary)] block mb-1">Cells</span>
                  <input
                    type="color"
                    value={selectedElement.cellBg}
                    onChange={(e) => commitPatchOnSelected({ cellBg: e.target.value } as any)}
                    className="w-full h-7 rounded cursor-pointer border border-[var(--border-hairline)]"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-[var(--text-secondary)] block mb-1">Text</span>
                  <input
                    type="color"
                    value={selectedElement.textColor}
                    onChange={(e) => commitPatchOnSelected({ textColor: e.target.value } as any)}
                    className="w-full h-7 rounded cursor-pointer border border-[var(--border-hairline)]"
                  />
                </label>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] text-[var(--text-secondary)] block">Headers &amp; Cells</span>
                <div className="overflow-x-auto space-y-1 pb-1">
                  <div className="flex gap-1">
                    {selectedElement.headers.map((h, hi) => (
                      <input
                        key={hi}
                        type="text"
                        value={h}
                        onChange={(e) => {
                          const next = [...selectedElement.headers];
                          next[hi] = e.target.value;
                          commitPatchOnSelected({ headers: next } as any);
                        }}
                        className="min-w-[64px] flex-1 h-7 px-1.5 rounded border border-[var(--border-strong)] bg-[var(--bg-canvas)] text-[11px] font-semibold"
                      />
                    ))}
                  </div>
                  {selectedElement.rows.map((row, ri) => (
                    <div key={ri} className="flex gap-1 items-center">
                      {row.map((cell, ci) => (
                        <input
                          key={ci}
                          type="text"
                          value={cell}
                          onChange={(e) => {
                            const nextRows = selectedElement.rows.map((r, rIdx) =>
                              rIdx === ri ? r.map((c, cIdx) => (cIdx === ci ? e.target.value : c)) : r
                            );
                            commitPatchOnSelected({ rows: nextRows } as any);
                          }}
                          className="min-w-[64px] flex-1 h-7 px-1.5 rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[11px]"
                        />
                      ))}
                      {selectedElement.rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            commitPatchOnSelected({
                              rows: selectedElement.rows.filter((_, idx) => idx !== ri),
                            } as any)
                          }
                          className="w-6 h-7 rounded border border-[var(--border-hairline)] text-red-600 text-xs shrink-0"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Custom Component Declarative Property Editor */}
          {selectedElement.type === 'custom' && (() => {
            const manifest = componentsCatalog.find((c) => c.componentKey === selectedElement.componentKey);
            const schema = manifest?.propertySchema || [];
            const isRetroTv = selectedElement.componentKey === 'retro-tv-frame';
            const isPhotoFrame = selectedElement.componentKey === 'photo-frame';
            const isMediaFrame = isRetroTv || isPhotoFrame;
            const tvMediaSrc = typeof selectedElement.props.mediaSrc === 'string' ? selectedElement.props.mediaSrc : '';
            const tvCropX = typeof selectedElement.props.mediaCropX === 'number' ? selectedElement.props.mediaCropX : 50;
            const tvCropY = typeof selectedElement.props.mediaCropY === 'number' ? selectedElement.props.mediaCropY : 50;
            const tvZoom = typeof selectedElement.props.mediaZoom === 'number' ? selectedElement.props.mediaZoom : 1;
            const tvFit = selectedElement.props.mediaFit === 'contain' ? 'contain' : 'cover';

            return (
              <div className="space-y-3 pt-3 border-t border-[var(--border-hairline)]">
                {isMediaFrame && (
                  <div className="p-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                        {isRetroTv ? 'CRT Screen Photo' : 'Frame Photo'}
                      </span>
                      <label className="px-2.5 py-1 rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer hover:border-[var(--accent)]">
                        <ImagePlus className="w-3 h-3 text-[var(--accent)]" />
                        <span>{tvMediaSrc ? 'Replace' : 'Upload'}</span>
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
                                props: {
                                  ...selectedElement.props,
                                  mediaSrc: res.publicUrl,
                                  mediaOriginalSrc: res.publicUrl,
                                  mediaAlt: file.name,
                                  mediaFit: 'cover',
                                  mediaCropX: 50,
                                  mediaCropY: 50,
                                  mediaZoom: 1,
                                },
                              } as any);
                            } catch (err: any) {
                              setError(err.message || 'TV screen upload failed.');
                            } finally {
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>

                    {tvMediaSrc ? (
                      <>
                        <div className="flex items-center gap-2">
                          <img
                            src={tvMediaSrc}
                            alt="CRT screen preview"
                            className="w-12 h-10 object-cover rounded border border-[var(--border-hairline)] shrink-0"
                          />
                          <div className="flex-1 flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setCroppingElementId((cur) =>
                                  cur === selectedElement.id ? null : selectedElement.id
                                )
                              }
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold inline-flex items-center gap-1 ${
                                croppingElementId === selectedElement.id
                                  ? 'bg-[var(--accent)] text-white'
                                  : 'bg-[var(--accent-soft)] text-[var(--accent)]'
                              }`}
                            >
                              <Crop className="w-3 h-3" />
                              {croppingElementId === selectedElement.id ? 'Done' : 'Edit Screen Crop'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDetachFrameMedia(selectedElement.id)}
                              className="px-2 py-1 rounded-md border border-[var(--border-hairline)] text-[11px] inline-flex items-center gap-1 hover:bg-[var(--bg-subtle)]"
                              title="Pop image out onto canvas"
                            >
                              <Unlink className="w-3 h-3" /> Detach
                            </button>
                            <button
                              type="button"
                              onClick={() => handleClearFrameMedia(selectedElement.id)}
                              className="px-2 py-1 rounded-md border border-[var(--border-hairline)] text-[11px] text-red-600 hover:bg-red-50"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <label className="block">
                            <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Fit Mode</span>
                            <select
                              value={tvFit}
                              onChange={(e) =>
                                commitPatchOnSelected({
                                  props: { ...selectedElement.props, mediaFit: e.target.value },
                                } as any)
                              }
                              className="w-full h-8 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-xs"
                            >
                              <option value="cover">Cover</option>
                              <option value="contain">Contain</option>
                            </select>
                          </label>
                          <label className="block">
                            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
                              <span>Zoom</span>
                              <span className="font-mono-tabular">{tvZoom.toFixed(2)}×</span>
                            </div>
                            <input
                              type="range"
                              min={1}
                              max={3.5}
                              step={0.05}
                              value={tvZoom}
                              onChange={(e) =>
                                updateElementLive(activeSlide.id, selectedElement.id, {
                                  props: { ...selectedElement.props, mediaZoom: Number(e.target.value) },
                                } as any)
                              }
                              onMouseUp={(e) =>
                                commitPatchOnSelected({
                                  props: {
                                    ...selectedElement.props,
                                    mediaZoom: Number((e.target as HTMLInputElement).value),
                                  },
                                } as any)
                              }
                              className="w-full accent-[var(--accent)]"
                            />
                          </label>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <label className="block">
                            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
                              <span>Pan X</span>
                              <span className="font-mono-tabular">{Math.round(tvCropX)}%</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={tvCropX}
                              onChange={(e) =>
                                updateElementLive(activeSlide.id, selectedElement.id, {
                                  props: { ...selectedElement.props, mediaCropX: Number(e.target.value) },
                                } as any)
                              }
                              onMouseUp={(e) =>
                                commitPatchOnSelected({
                                  props: {
                                    ...selectedElement.props,
                                    mediaCropX: Number((e.target as HTMLInputElement).value),
                                  },
                                } as any)
                              }
                              className="w-full accent-[var(--accent)]"
                            />
                          </label>
                          <label className="block">
                            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
                              <span>Pan Y</span>
                              <span className="font-mono-tabular">{Math.round(tvCropY)}%</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={tvCropY}
                              onChange={(e) =>
                                updateElementLive(activeSlide.id, selectedElement.id, {
                                  props: { ...selectedElement.props, mediaCropY: Number(e.target.value) },
                                } as any)
                              }
                              onMouseUp={(e) =>
                                commitPatchOnSelected({
                                  props: {
                                    ...selectedElement.props,
                                    mediaCropY: Number((e.target as HTMLInputElement).value),
                                  },
                                } as any)
                              }
                              className="w-full accent-[var(--accent)]"
                            />
                          </label>
                        </div>

                        {/* Frame Photo Color & Filters */}
                        {(() => {
                          const frameAdj = extractFrameMediaAdjustments(selectedElement.props);
                          const toFrameProps = (adj: Partial<ImageAdjustments>) => {
                            const out: Record<string, unknown> = { ...selectedElement.props };
                            if (adj.brightness !== undefined) out.mediaBrightness = adj.brightness;
                            if (adj.contrast !== undefined) out.mediaContrast = adj.contrast;
                            if (adj.saturation !== undefined) out.mediaSaturation = adj.saturation;
                            if (adj.hueRotate !== undefined) out.mediaHueRotate = adj.hueRotate;
                            if (adj.blur !== undefined) out.mediaBlur = adj.blur;
                            if (adj.grayscale !== undefined) out.mediaGrayscale = adj.grayscale;
                            if (adj.sepia !== undefined) out.mediaSepia = adj.sepia;
                            return out;
                          };
                          return (
                            <div className="pt-2.5 border-t border-[var(--border-hairline)] space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold">Photo Color &amp; Filters</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    commitPatchOnSelected({
                                      props: toFrameProps(DEFAULT_IMAGE_ADJUSTMENTS),
                                    } as any)
                                  }
                                  className="px-2 py-0.5 rounded border border-[var(--border-hairline)] text-[10px] hover:bg-[var(--bg-subtle)] inline-flex items-center gap-1"
                                >
                                  <RotateCcw className="w-2.5 h-2.5" /> Reset
                                </button>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                {IMAGE_FILTER_PRESETS.map((preset) => (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() =>
                                      commitPatchOnSelected({ props: toFrameProps(preset.values) } as any)
                                    }
                                    className="px-1.5 py-1 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--accent)] text-[10px] font-medium truncate"
                                  >
                                    {preset.label}
                                  </button>
                                ))}
                              </div>
                              {(
                                [
                                  { key: 'brightness', label: 'Brightness', min: 20, max: 200, step: 1, def: 100, unit: '%' },
                                  { key: 'contrast', label: 'Contrast', min: 20, max: 200, step: 1, def: 100, unit: '%' },
                                  { key: 'saturation', label: 'Saturation', min: 0, max: 250, step: 1, def: 100, unit: '%' },
                                  { key: 'hueRotate', label: 'Hue', min: -180, max: 180, step: 2, def: 0, unit: '°' },
                                  { key: 'blur', label: 'Blur', min: 0, max: 20, step: 0.5, def: 0, unit: 'px' },
                                  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, step: 1, def: 0, unit: '%' },
                                  { key: 'sepia', label: 'Sepia', min: 0, max: 100, step: 1, def: 0, unit: '%' },
                                ] as Array<{
                                  key: keyof ImageAdjustments;
                                  label: string;
                                  min: number;
                                  max: number;
                                  step: number;
                                  def: number;
                                  unit: string;
                                }>
                              ).map((ctrl) => {
                                const val = frameAdj[ctrl.key] ?? ctrl.def;
                                return (
                                  <label key={ctrl.key} className="block">
                                    <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-0.5">
                                      <span>{ctrl.label}</span>
                                      <span className="font-mono-tabular">
                                        {val}
                                        {ctrl.unit}
                                      </span>
                                    </div>
                                    <input
                                      type="range"
                                      min={ctrl.min}
                                      max={ctrl.max}
                                      step={ctrl.step}
                                      value={val}
                                      onChange={(e) =>
                                        updateElementLive(activeSlide.id, selectedElement.id, {
                                          props: toFrameProps({ [ctrl.key]: Number(e.target.value) }),
                                        } as any)
                                      }
                                      onMouseUp={(e) =>
                                        commitPatchOnSelected({
                                          props: toFrameProps({
                                            [ctrl.key]: Number((e.target as HTMLInputElement).value),
                                          }),
                                        } as any)
                                      }
                                      onTouchEnd={(e) =>
                                        commitPatchOnSelected({
                                          props: toFrameProps({
                                            [ctrl.key]: Number((e.target as HTMLInputElement).value),
                                          }),
                                        } as any)
                                      }
                                      className="w-full accent-[var(--accent)]"
                                    />
                                  </label>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </>
                    ) : (
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        Drag any photo on the canvas or drop an image file onto this frame to snap it cleanly inside.
                      </p>
                    )}

                    {isPhotoFrame && (
                      <label className="block pt-2 border-t border-[var(--border-hairline)]">
                        <span className="text-[11px] text-[var(--text-secondary)] block mb-1">Frame Shape</span>
                          <select
                          value={String(selectedElement.props.frameKind || 'circle')}
                          onChange={(e) =>
                            commitPatchOnSelected({
                              props: { ...selectedElement.props, frameKind: e.target.value },
                            } as any)
                          }
                          className="w-full h-8 px-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-xs"
                        >
                          {selectedElement.props.frameKind === 'custom-freedraw' && (
                            <option value="custom-freedraw">Custom Freedraw Shape</option>
                          )}
                          {PHOTO_FRAME_CATALOG.map((pf) => (
                            <option key={pf.kind} value={pf.kind}>
                              {pf.name} ({pf.category})
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>
                )}

                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Component Properties
                </div>
                {schema
                  .filter((field) => !(isPhotoFrame && field.key === 'frameKind'))
                  .map((field) => {
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

            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-secondary)]">Page Color</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono-tabular text-[var(--text-muted)] uppercase">
                    {activeSlide.background.color || '#FFFFFF'}
                  </span>
                  <input
                    type="color"
                    aria-label="Slide background color"
                    value={activeSlide.background.color || '#FFFFFF'}
                    onChange={(e) => updateSlideBackground(activeSlide.id, e.target.value)}
                    className="w-10 h-8 rounded border border-[var(--border-hairline)] cursor-pointer"
                  />
                </div>
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  ['White', '#FFFFFF'],
                  ['Paper', '#F7F6F2'],
                  ['Sky', '#EFF6FF'],
                  ['Cream', '#FEF3C7'],
                  ['Blush', '#FCE7F3'],
                  ['Slate', '#1E293B'],
                  ['Dark', '#0D0F13'],
                ].map(([label, hex]) => {
                  const active =
                    activeSlide.background.type === 'solid' &&
                    (activeSlide.background.color || '#FFFFFF').toLowerCase() === hex.toLowerCase();
                  return (
                    <button
                      key={hex}
                      type="button"
                      title={`${label} (${hex})`}
                      aria-label={`Set slide color to ${label}`}
                      onClick={() => updateSlideBackground(activeSlide.id, hex)}
                      className={`w-6 h-6 rounded-md border transition-transform hover:scale-105 ${
                        active ? 'ring-2 ring-[var(--accent)] ring-offset-1 border-white' : 'border-black/20'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  );
                })}
              </div>
            </div>

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

            <div className="p-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Page Size &amp; Margins
                </span>
                <span className="text-[11px] font-mono-tabular text-[var(--accent)] font-semibold">
                  {doc.width}×{doc.height}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowResizeModal(true)}
                  className="h-9 px-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] hover:border-[var(--accent)] font-semibold inline-flex items-center justify-center gap-1.5"
                >
                  <Maximize className="w-3.5 h-3.5 text-[var(--accent)]" /> Resize ({doc.aspectRatio.toUpperCase()})
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updatePageMargin(doc.pageMargin ?? 48, !doc.showMargins)
                  }
                  className={`h-9 px-2.5 rounded-lg border font-medium inline-flex items-center justify-center gap-1.5 ${
                    doc.showMargins
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface)]'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" /> {doc.showMargins ? 'Margins On' : 'Margins Off'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => openPresentMode('book')}
                className="w-full h-9 px-3 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] font-semibold inline-flex items-center justify-center gap-1.5 hover:opacity-90"
              >
                <BookOpen className="w-3.5 h-3.5" /> Preview Animated Book Flip
              </button>
            </div>

            <label className="block pt-2 border-t border-[var(--border-hairline)]">
              <span className="font-medium block mb-1">Speaker Notes (Presenter Cues)</span>
              <span className="block text-[11px] text-[var(--text-muted)] mb-1.5">
                Private talking points &amp; cues visible to the speaker (toggle Notes in Present mode).
              </span>
              <textarea
                rows={4}
                value={activeSlide.speakerNotes}
                onChange={(e) => updateSpeakerNotes(activeSlide.id, e.target.value)}
                placeholder="Write talking points, cues, and timing notes for the speaker..."
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
      <div className="h-14 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2 sm:px-4 flex items-center justify-between gap-2 shrink-0">
        <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 overflow-hidden">
          <button
            type="button"
            aria-label="Back to workspace"
            onClick={() => navigate({ page: 'dashboard' })}
            className="w-8 h-8 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-lg hover:bg-[var(--bg-subtle)] shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={doc.title}
            aria-label="Presentation title"
            onChange={(e) => updateTitle(e.target.value)}
            className="w-full min-w-0 font-display font-bold text-xs sm:text-base bg-transparent truncate sm:max-w-[260px] focus:outline-none focus:border-b focus:border-[var(--accent)]"
          />

          <span className="hidden md:inline text-xs font-mono-tabular text-[var(--text-muted)] shrink-0">
            {isSaving ? 'Saving...' : isDirty ? 'Unsaved' : lastSavedAt ? `Saved ${lastSavedAt}` : 'Synced'}
          </span>
        </div>

        {/* Clean Quick Studio Context Pill */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[var(--text-secondary)] shrink-0">
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
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            title="Page Size, Aspect Ratio & Margins"
            onClick={() => setShowResizeModal(true)}
            className="inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 h-8 sm:h-9 rounded-lg border border-[var(--border-hairline)] text-xs font-medium hover:bg-[var(--bg-subtle)] shrink-0"
          >
            <Maximize className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden sm:inline">{doc.aspectRatio.toUpperCase()}</span>
          </button>

          <button
            type="button"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
            onClick={undo}
            disabled={past.length === 0}
            className="w-8 h-8 sm:w-9 sm:h-9 inline-flex items-center justify-center rounded-md hover:bg-[var(--bg-subtle)] disabled:opacity-35 shrink-0"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
            onClick={redo}
            disabled={future.length === 0}
            className="w-8 h-8 sm:w-9 sm:h-9 inline-flex items-center justify-center rounded-md hover:bg-[var(--bg-subtle)] disabled:opacity-35 shrink-0"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            aria-label="Toggle snap to grid"
            title="Toggle snap to grid"
            onClick={toggleSnapToGrid}
            className={`hidden sm:inline-flex w-9 h-9 items-center justify-center rounded-md shrink-0 ${
              snapToGrid ? 'bg-[var(--bg-subtle)] text-[var(--accent)]' : 'hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            type="button"
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts (?)"
            onClick={() => setShowShortcutsModal(true)}
            className="hidden md:inline-flex w-9 h-9 items-center justify-center rounded-md hover:bg-[var(--bg-subtle)] shrink-0"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            type="button"
            aria-label="Version history"
            onClick={() => setShowHistoryModal(true)}
            className="hidden sm:inline-flex w-9 h-9 items-center justify-center rounded-md hover:bg-[var(--bg-subtle)] shrink-0"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            type="button"
            aria-label="Save presentation"
            title="Save (Ctrl+S)"
            onClick={() => handleSave('Manual snapshot')}
            className="inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 h-8 sm:h-9 rounded-lg border border-[var(--border-hairline)] text-xs font-medium hover:bg-[var(--bg-subtle)] shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-[var(--border-hairline)] text-xs font-medium hover:bg-[var(--bg-subtle)] shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>

          <div className="relative shrink-0">
            <button
              type="button"
              aria-label="Export presentation"
              onClick={() => setShowExportMenu((v) => !v)}
              className="inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 h-8 sm:h-9 rounded-lg bg-[var(--text-primary)] text-[var(--bg-surface)] text-xs font-semibold"
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
            onClick={() => openPresentMode()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)]"
          >
            {doc.aspectRatio === 'book' ? (
              <>
                <BookOpen className="w-3.5 h-3.5" /> Flip Book
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" /> Present
              </>
            )}
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
          uploads={uploads}
          uploadingAssets={uploadingAssets}
          onUploadAssets={handleUploadAssets}
          onDeleteUpload={handleDeleteUpload}
          onInsertUploadedImage={(url, name) =>
            insertOrSlotImageUrl(url, name, doc.width / 2, doc.height / 2)
          }
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
          onInsertRetroTv={handleInsertRetroTvFrame}
          onInsertPhotoFrame={handleInsertPhotoFrame}
          isDrawingFrame={isDrawingFrame}
          onStartFreedrawFrame={() => {
            setCroppingElementId(null);
            selectElements([]);
            setIsDrawingFrame((v) => !v);
          }}
          onInsertRetroDialog={handleInsertRetroDialog}
          onApplyAnimation={(anim: ElementAnimation) => {
            if (!selectedElement) return;
            commitPatchOnSelected({ animation: anim });
            setAnimationKey((k) => k + 1);
          }}
          onReplayAnimations={() => setAnimationKey((k) => k + 1)}
        />

        {/* Center Canvas Viewport Wrapper (keeps bottom zoom bar fixed/sticky when zooming) */}
        <div
          ref={canvasRegionRef}
          className="flex-1 min-w-0 relative flex flex-col overflow-hidden bg-[var(--bg-canvas)]"
        >
        <main
          ref={viewportRef}
          className="flex-1 min-w-0 min-h-0 flex overflow-auto relative p-10 sm:p-16 pb-24 sm:pb-24"
        >
          <div className="m-auto flex flex-col items-center justify-center shrink-0">
          {isDrawingFrame && (
            <div
              role="region"
              aria-label="Freedraw frame mode"
              className="mb-3 px-4 py-2 rounded-full border border-[var(--accent)] bg-[var(--bg-surface)]/95 backdrop-blur-md shadow-[var(--shadow-float)] flex flex-wrap items-center gap-3 text-xs z-40 shrink-0"
            >
              <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--accent)]">
                <PenTool className="w-3.5 h-3.5" />
                Draw any closed shape on the slide · Release to turn into a photo frame
              </span>
              <button
                type="button"
                onClick={() => setIsDrawingFrame(false)}
                className="px-2.5 py-1 rounded-full border border-[var(--border-hairline)] hover:border-[var(--accent)] font-medium"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Dedicated Floating Crop Action Bar when inline crop editing is active */}
          {croppingElement &&
            (croppingElement.type === 'image' ||
              (croppingElement.type === 'custom' &&
                (croppingElement.componentKey === 'retro-tv-frame' ||
                  croppingElement.componentKey === 'photo-frame') &&
                Boolean(croppingElement.props.mediaSrc))) && (() => {
              const isImg = croppingElement.type === 'image';
              const curZoom = isImg
                ? croppingElement.cropZoom ?? 1
                : typeof croppingElement.props.mediaZoom === 'number'
                ? croppingElement.props.mediaZoom
                : 1;
              const curFit = isImg
                ? croppingElement.objectFit
                : croppingElement.props.mediaFit === 'contain'
                ? 'contain'
                : 'cover';

              const setZoomVal = (val: number, commit: boolean) => {
                const clamped = Number(Math.max(1, Math.min(3.5, val)).toFixed(2));
                if (isImg) {
                  if (commit) commitPatchOnSelected({ cropZoom: clamped } as any);
                  else updateElementLive(activeSlide.id, croppingElement.id, { cropZoom: clamped } as any);
                } else {
                  const nextProps = { ...croppingElement.props, mediaZoom: clamped };
                  if (commit) commitPatchOnSelected({ props: nextProps } as any);
                  else updateElementLive(activeSlide.id, croppingElement.id, { props: nextProps } as any);
                }
              };

              const toggleFit = () => {
                const nextFit = curFit === 'cover' ? 'contain' : 'cover';
                if (isImg) {
                  commitPatchOnSelected({ objectFit: nextFit } as any);
                } else {
                  commitPatchOnSelected({
                    props: { ...croppingElement.props, mediaFit: nextFit },
                  } as any);
                }
              };

              const resetCrop = () => {
                if (isImg) {
                  commitPatchOnSelected({ cropX: 50, cropY: 50, cropZoom: 1 } as any);
                } else {
                  commitPatchOnSelected({
                    props: {
                      ...croppingElement.props,
                      mediaCropX: 50,
                      mediaCropY: 50,
                      mediaZoom: 1,
                      mediaFit: 'cover',
                    },
                  } as any);
                }
              };

              return (
                <div
                  role="region"
                  aria-label="Crop frame controls"
                  className="mb-3 px-3.5 py-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)]/95 backdrop-blur-md shadow-[var(--shadow-float)] flex flex-wrap items-center gap-3 text-xs z-40 shrink-0"
                >
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--accent)]">
                    <Crop className="w-3.5 h-3.5" />
                    {isImg ? 'Drag image to pan · Drag bars to crop' : 'Drag TV screen photo to pan'}
                  </span>
                  <span className="w-px h-4 bg-[var(--border-hairline)]" />
                  <label className="inline-flex items-center gap-2">
                    <span className="text-[var(--text-secondary)]">Zoom</span>
                    <input
                      type="range"
                      min={1}
                      max={3.5}
                      step={0.05}
                      value={curZoom}
                      onChange={(e) => setZoomVal(Number(e.target.value), false)}
                      onMouseUp={(e) => setZoomVal(Number((e.target as HTMLInputElement).value), true)}
                      className="w-24 accent-[var(--accent)]"
                    />
                    <span className="font-mono-tabular w-10">{curZoom.toFixed(2)}×</span>
                  </label>
                  <button
                    type="button"
                    onClick={toggleFit}
                    className="px-2.5 py-1 rounded-full border border-[var(--border-hairline)] hover:border-[var(--accent)] font-medium"
                  >
                    {curFit === 'cover' ? 'Cover' : 'Contain'}
                  </button>
                  <button
                    type="button"
                    onClick={resetCrop}
                    className="px-2.5 py-1 rounded-full border border-[var(--border-hairline)] hover:border-[var(--accent)] inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setCroppingElementId(null)}
                    className="px-3 py-1 rounded-full bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] inline-flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Done
                  </button>
                </div>
              );
            })()}

          <div className="relative flex items-center justify-center">
            {selectedElement && croppingElementId !== selectedElement.id && (
              <FloatingElementToolbar
                element={selectedElement}
                selectedElements={selectedElements}
                slideWidth={doc.width}
                slideHeight={doc.height}
                scale={responsiveScale}
                isCropping={croppingElementId === selectedElement.id}
                canGroup={canGroup}
                canUngroup={canUngroup}
                onPatch={commitPatchOnSelected}
                onLivePatch={(patch) => updateElementLive(activeSlide.id, selectedElement.id, patch)}
                onCommitSnapshot={commitSnapshot}
                onToggleCrop={() =>
                  setCroppingElementId((cur) => (cur === selectedElement.id ? null : selectedElement.id))
                }
                onDetachFrameMedia={
                  selectedElement.type === 'custom' &&
                  (selectedElement.componentKey === 'retro-tv-frame' ||
                    selectedElement.componentKey === 'photo-frame')
                    ? () => handleDetachFrameMedia(selectedElement.id)
                    : undefined
                }
                onDuplicate={duplicateSelectedElement}
                onDelete={deleteSelectedElements}
                onLayer={(dir) => reorderLayer(selectedElement.id, dir)}
                onToggleLock={() => toggleLockElement(selectedElement.id)}
                onGroup={groupSelectedElements}
                onUngroup={ungroupSelectedElements}
                onSelectAll={selectAllOnActiveSlide}
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
              croppingElementId={croppingElementId}
              pageMargin={doc.pageMargin ?? doc.tokens.spacing.slidePadding ?? 0}
              showMargins={Boolean(doc.showMargins)}
              backdropRef={viewportRef}
              onSelectElements={selectElements}
              onUpdateElementLive={(elId, patch) => updateElementLive(activeSlide.id, elId, patch)}
              onUpdateElementsLiveBatch={(patches) => updateElementsLiveBatch(activeSlide.id, patches)}
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
              onEnterCropMode={(elId) => setCroppingElementId(elId)}
              onExitCropMode={() => setCroppingElementId(null)}
              onSlotImageIntoFrame={handleSlotImageIntoFrame}
              onDropImageFile={handleDropImageFile}
              onDropGalleryImage={(payload, cx, cy, targetFrameId) =>
                insertOrSlotImageUrl(payload.src, payload.alt || 'Dropped Image', cx, cy, targetFrameId)
              }
              isDrawingFrame={isDrawingFrame}
              onCompleteFreedrawFrame={handleCompleteFreedrawFrame}
            />
          </div>

          </div>
        </main>

          {/* Fixed Sticky Bottom Canvas Navigation, Horizontal Swipe Zoom & Replay Bar */}
          {(() => {
            const zoomPct = Math.max(0, Math.min(100, ((responsiveScale - 0.25) / 1.75) * 100));
            const startSwipeZoom = (e: React.PointerEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
              const targetEl = e.currentTarget;
              const rect = targetEl.getBoundingClientRect();
              const startX = e.clientX;
              const startScale = responsiveScale;
              const trackW = Math.max(72, rect.width - 8);
              let moved = false;
              let rafId = 0;
              let pendingScale: number | null = null;

              const flushScale = () => {
                rafId = 0;
                if (pendingScale !== null) {
                  handleSetZoomDirect(pendingScale);
                  pendingScale = null;
                }
              };

              const onMove = (ev: PointerEvent) => {
                const dx = ev.clientX - startX;
                if (Math.abs(dx) > 2) moved = true;
                const next = Math.max(0.25, Math.min(2, startScale + (dx / trackW) * 1.45));
                pendingScale = next;
                if (!rafId) {
                  rafId = window.requestAnimationFrame(flushScale);
                }
              };

              const onUp = (ev: PointerEvent) => {
                if (rafId) {
                  window.cancelAnimationFrame(rafId);
                  rafId = 0;
                }
                if (pendingScale !== null) {
                  handleSetZoomDirect(pendingScale);
                  pendingScale = null;
                } else if (!moved) {
                  const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left - 4) / trackW));
                  handleSetZoomDirect(0.25 + ratio * 1.75);
                }
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                window.removeEventListener('pointercancel', onUp);
              };

              window.addEventListener('pointermove', onMove);
              window.addEventListener('pointerup', onUp);
              window.addEventListener('pointercancel', onUp);
            };

            return (
              <div
                aria-label="Canvas navigation and horizontal swipe zoom controls"
                className="pointer-events-auto absolute bottom-3 left-1/2 -translate-x-1/2 z-30 max-w-[calc(100%-1rem)] px-2.5 py-1.5 rounded-full border border-[var(--border-hairline)] bg-[var(--bg-surface)]/95 backdrop-blur-md shadow-[var(--shadow-float)] flex items-center gap-1.5 sm:gap-2 text-xs font-mono-tabular text-[var(--text-secondary)]"
              >
                <button
                  type="button"
                  aria-label="Previous slide"
                  disabled={activeSlideIndex === 0}
                  onClick={() => activeSlideIndex > 0 && selectSlide(doc.slides[activeSlideIndex - 1].id)}
                  className="w-6 h-6 inline-flex items-center justify-center rounded-full hover:bg-[var(--bg-subtle)] disabled:opacity-30 shrink-0"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="whitespace-nowrap text-[11px] sm:text-xs">
                  <span className="hidden sm:inline">Slide </span>
                  {activeSlideIndex + 1} / {doc.slides.length}
                </span>
                <button
                  type="button"
                  aria-label="Next slide"
                  disabled={activeSlideIndex >= doc.slides.length - 1}
                  onClick={() =>
                    activeSlideIndex < doc.slides.length - 1 &&
                    selectSlide(doc.slides[activeSlideIndex + 1].id)
                  }
                  className="w-6 h-6 inline-flex items-center justify-center rounded-full hover:bg-[var(--bg-subtle)] disabled:opacity-30 shrink-0"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <span aria-hidden="true" className="opacity-50">·</span>

                <button
                  type="button"
                  onClick={handleResetZoomFit}
                  title="Tap to reset zoom to Fit (Ctrl+0)"
                  className={`px-1.5 py-0.5 rounded-md font-semibold transition-colors shrink-0 ${
                    zoomMode === 'fit'
                      ? 'text-[var(--accent)] bg-[var(--accent-soft)]'
                      : 'hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {Math.round(responsiveScale * 100)}%
                </button>

                {/* Smooth Horizontal Swipe Zoom Track */}
                <div
                  role="slider"
                  tabIndex={0}
                  aria-label="Swipe horizontally to zoom"
                  aria-valuemin={25}
                  aria-valuemax={200}
                  aria-valuenow={Math.round(responsiveScale * 100)}
                  title="Swipe or drag horizontally to zoom smoothly"
                  onPointerDown={startSwipeZoom}
                  onWheel={(e) => {
                    e.preventDefault();
                    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : -e.deltaY;
                    handleSetZoomDirect(responsiveScale + delta * 0.0018);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      handleStepZoom(0.05);
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                      e.preventDefault();
                      handleStepZoom(-0.05);
                    }
                  }}
                  className="w-20 sm:w-28 h-7 px-1 flex items-center cursor-ew-resize select-none touch-none relative shrink-0"
                >
                  <div className="w-full h-1.5 rounded-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] relative">
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: `${zoomPct}%` }}
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full bg-[var(--accent)] border-2 border-white shadow-xs absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                      style={{ left: `${zoomPct}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Replay slide animations"
                  onClick={() => setAnimationKey((k) => k + 1)}
                  className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] text-[var(--text-primary)] shrink-0"
                >
                  <Play className="w-3 h-3 text-[var(--accent)]" />
                  <span className="hidden sm:inline">Replay</span>
                </button>
                {doc.aspectRatio === 'book' && (
                  <button
                    type="button"
                    onClick={() => openPresentMode('book')}
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-[var(--accent)] text-white font-semibold shrink-0"
                    title="Preview 3D Book Flip"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span className="hidden sm:inline">Flip</span>
                  </button>
                )}
              </div>
            );
          })()}
        </div>

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

      {/* Canva-Style Compact Mobile Slides Filmstrip (below editor area, previews neighbor pages) */}
      <div
        aria-label="Pages filmstrip"
        className="lg:hidden border-t border-[var(--border-hairline)] bg-[var(--bg-surface)]/95 px-2.5 py-1.5 shrink-0"
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 snap-x">
          {doc.slides.map((sl, idx) => {
            const active = sl.id === activeSlide.id;
            const thumbScale = Number(Math.min(70 / doc.width, 40 / doc.height).toFixed(3));
            return (
              <div
                key={sl.id}
                className={`relative shrink-0 snap-center rounded-lg p-1 border transition-all ${
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]/40'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] opacity-85'
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectSlide(sl.id)}
                  aria-label={`Select page ${idx + 1}: ${sl.title}`}
                  className="block pointer-events-auto"
                >
                  <div className="pointer-events-none overflow-hidden rounded-xs shadow-xs">
                    <SlideCanvas
                      slide={sl}
                      tokens={doc.tokens}
                      width={doc.width}
                      height={doc.height}
                      scale={thumbScale}
                      animated={false}
                    />
                  </div>
                </button>
                <span
                  className={`absolute bottom-1 left-1 px-1 rounded text-[9px] font-mono-tabular font-bold leading-tight pointer-events-none ${
                    active ? 'bg-[var(--accent)] text-white' : 'bg-black/60 text-white'
                  }`}
                >
                  {idx + 1}
                </span>
                {active && (
                  <div className="absolute top-0.5 right-0.5 flex items-center gap-0.5">
                    <button
                      type="button"
                      aria-label={`Duplicate page ${idx + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSlide(sl.id);
                      }}
                      className="w-4 h-4 rounded bg-white/95 text-neutral-800 shadow-xs flex items-center justify-center"
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                    {doc.slides.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Delete page ${idx + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSlide(sl.id);
                        }}
                        className="w-4 h-4 rounded bg-white/95 text-red-600 shadow-xs flex items-center justify-center"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={addSlide}
            aria-label="Add new page"
            className="shrink-0 w-12 h-[48px] rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg-canvas)] hover:border-[var(--accent)] text-[var(--accent)] flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Contextual Toolbar (Elements replaces Slides cleanly) */}
      <nav
        aria-label="Mobile editor tools"
        className="lg:hidden border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] grid grid-cols-5 h-15 shrink-0"
      >
        <button
          type="button"
          onClick={() => {
            setMobileBrowseTab('elements');
            setMobileElemCat('All');
            setMobileSheet(mobileSheet === 'elements' ? null : 'elements');
          }}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[44px] ${
            mobileSheet === 'elements' ? 'text-[var(--accent)] font-semibold' : ''
          }`}
        >
          <Shapes className="w-4 h-4" />
          <span>Elements</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileSheet(mobileSheet === 'insert' ? null : 'insert')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[44px] ${
            mobileSheet === 'insert' ? 'text-[var(--accent)] font-semibold' : ''
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileSheet(mobileSheet === 'edit' ? null : 'edit')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[44px] ${
            mobileSheet === 'edit' ? 'text-[var(--accent)] font-semibold' : ''
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileSheet(mobileSheet === 'layers' ? null : 'layers')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[44px] ${
            mobileSheet === 'layers' ? 'text-[var(--accent)] font-semibold' : ''
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Theme</span>
        </button>
        <button
          type="button"
          onClick={() => openPresentMode()}
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[var(--accent)] min-h-[44px]"
        >
          {doc.aspectRatio === 'book' ? <BookOpen className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{doc.aspectRatio === 'book' ? 'Flip' : 'Present'}</span>
        </button>
      </nav>

      {/* Mobile Bottom Sheet */}
      {mobileSheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile tool panel"
          className="lg:hidden fixed inset-x-0 bottom-15 z-40 rounded-t-2xl border-t border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-[var(--shadow-float)] max-h-[70vh] flex flex-col"
        >
          <div className="px-4 py-3 border-b border-[var(--border-hairline)] flex items-center justify-between gap-2">
            <span className="font-semibold text-sm capitalize">
              {mobileSheet === 'layers'
                ? 'Theme & Page'
                : mobileSheet === 'elements'
                ? 'Elements Studio'
                : mobileSheet === 'insert'
                ? 'Add to Page'
                : mobileSheet}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Select all elements"
                onClick={selectAllOnActiveSlide}
                className="px-2 py-1 rounded-lg border border-[var(--border-hairline)] text-[11px] font-medium inline-flex items-center gap-1"
              >
                <CheckSquare className="w-3.5 h-3.5" /> All
              </button>
              <button
                type="button"
                aria-label="Close panel"
                onClick={() => setMobileSheet(null)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            {mobileSheet === 'elements' && (
              <MobileElementsBrowser
                key={`${mobileBrowseTab}-${mobileElemCat}`}
                doc={doc}
                fontCatalog={fontCatalog}
                initialTab={mobileBrowseTab}
                initialElemCat={mobileElemCat}
                uploads={uploads}
                uploadingAssets={uploadingAssets}
                isDrawingFrame={isDrawingFrame}
                onUploadAssets={handleUploadAssets}
                onDeleteUpload={handleDeleteUpload}
                onInsertUploadedImage={(url, name) => {
                  insertOrSlotImageUrl(url, name, doc.width / 2, doc.height / 2);
                  setMobileSheet(null);
                }}
                onInsertCutout={insertCutoutElement}
                onInsertShape={insertShapeElement}
                onInsertIcon={insertIconElement}
                onInsertTextPreset={insertTextPresetElement}
                onInsertRetroTv={handleInsertRetroTvFrame}
                onInsertPhotoFrame={handleInsertPhotoFrame}
                onStartFreedrawFrame={() => {
                  setMobileSheet(null);
                  setCroppingElementId(null);
                  selectElements([]);
                  setIsDrawingFrame(true);
                }}
                onInsertRetroDialog={handleInsertRetroDialog}
              />
            )}
            {mobileSheet === 'insert' && (
              <MobileInsertHub
                canGroup={canGroup}
                canUngroup={canUngroup}
                onInsertTextBox={() => insertTextPresetElement()}
                onOpenShapesBrowser={() => {
                  setMobileBrowseTab('elements');
                  setMobileElemCat('Shapes');
                  setMobileSheet('elements');
                }}
                onOpenElementsBrowser={() => {
                  setMobileBrowseTab('elements');
                  setMobileElemCat('All');
                  setMobileSheet('elements');
                }}
                onInsertChart={(preset) => insertChartElement(preset)}
                onInsertTable={(preset) => insertTableElement(preset)}
                onOpenCutoutStudio={() => {
                  setMobileSheet(null);
                  setCutoutModalState({ open: true });
                }}
                onUploadRawImage={handleInsertImageUpload}
                onStartFreedrawFrame={() => {
                  setMobileSheet(null);
                  setCroppingElementId(null);
                  selectElements([]);
                  setIsDrawingFrame(true);
                }}
                onOpenComponentsModal={() => {
                  setMobileSheet(null);
                  setShowInsertCompModal(true);
                }}
                onOpenPageSetup={() => {
                  setMobileSheet(null);
                  setShowResizeModal(true);
                }}
                onSelectAll={() => {
                  selectAllOnActiveSlide();
                  setMobileSheet(null);
                }}
                onGroup={() => {
                  groupSelectedElements();
                  setMobileSheet(null);
                }}
                onUngroup={() => {
                  ungroupSelectedElements();
                  setMobileSheet(null);
                }}
              />
            )}
            {mobileSheet === 'edit' && renderInspectorContent()}
            {mobileSheet === 'layers' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold">Page Size &amp; Margins</div>
                    <div className="text-[11px] text-[var(--text-secondary)]">
                      {doc.aspectRatio.toUpperCase()} · {doc.width}×{doc.height}px
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileSheet(null);
                      setShowResizeModal(true);
                    }}
                    className="px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold"
                  >
                    Resize
                  </button>
                </div>
                {renderThemeAndQualityContent()}
              </div>
            )}
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

      {/* Page Resize & Margin Modal */}
      <PageSetupModal
        isOpen={showResizeModal}
        doc={doc}
        onClose={() => setShowResizeModal(false)}
        onApplyResize={(w, h, ratio, scaleEls) => resizeDocument(w, h, ratio, scaleEls)}
        onUpdateMargin={(margin, showM) => updatePageMargin(margin, showM)}
        onOpenBookPreview={() => openPresentMode('book')}
      />

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-[var(--shadow-float)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-[var(--accent)]" />
                <h2 className="font-display text-lg font-bold">Shortcuts &amp; Gestures</h2>
              </div>
              <button
                type="button"
                aria-label="Close shortcuts"
                onClick={() => setShowShortcutsModal(false)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[var(--border-hairline)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                ['Select All Elements', 'Ctrl + A'],
                ['Group Selected Elements', 'Ctrl + G'],
                ['Ungroup Elements', 'Ctrl + Shift + G'],
                ['Duplicate Selection', 'Ctrl + D'],
                ['Copy / Paste Selection', 'Ctrl + C / Ctrl + V'],
                ['Undo / Redo', 'Ctrl + Z / Ctrl + Y'],
                ['Bring Forward / Send Backward', '] / ['],
                ['Zoom In / Zoom Out / Reset Fit', 'Ctrl + = / - / 0'],
                ['Zoom Smoothly (Mouse Wheel)', 'Ctrl + Scroll'],
                ['Delete Selected', 'Delete / Backspace'],
                ['Save Snapshot', 'Ctrl + S'],
                ['Mobile Multi-Select', 'Long-press + Drag'],
              ].map(([label, keys]) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                >
                  <span className="font-medium">{label}</span>
                  <kbd className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-strong)] font-mono-tabular text-[11px] font-semibold">
                    {keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
