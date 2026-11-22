import { create } from 'zustand';
import type {
  DesignTokens,
  PresentationDocument,
  PresentationElement,
  Slide,
} from '../core/schema';
import { contrastRatio } from '../core/quality-scorer';

interface EditorState {
  document: PresentationDocument | null;
  activeSlideId: string;
  selectedElementIds: string[];
  clipboard: PresentationElement[];
  past: PresentationDocument[];
  future: PresentationDocument[];
  zoom: number;
  snapToGrid: boolean;
  gridSize: number;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;

  loadDocument: (doc: PresentationDocument) => void;
  selectSlide: (slideId: string) => void;
  selectElements: (ids: string[]) => void;
  selectAllOnActiveSlide: () => void;
  setZoom: (zoom: number) => void;
  toggleSnapToGrid: () => void;

  commitChange: (updater: (doc: PresentationDocument) => PresentationDocument) => void;
  updateElementLive: (slideId: string, elementId: string, patch: Partial<PresentationElement>) => void;
  updateElementsLiveBatch: (slideId: string, patches: Record<string, Partial<PresentationElement>>) => void;
  commitSnapshot: () => void;

  addElement: (slideId: string, element: PresentationElement) => void;
  deleteSelectedElements: () => void;
  duplicateSelectedElement: () => void;
  copySelectedElement: () => void;
  pasteElement: () => void;
  groupSelectedElements: () => void;
  ungroupSelectedElements: () => void;
  reorderLayer: (elementId: string, dir: 'up' | 'down') => void;
  toggleLockElement: (elementId: string) => void;

  addSlide: () => void;
  duplicateSlide: (slideId: string) => void;
  deleteSlide: (slideId: string) => void;
  moveSlide: (slideId: string, dir: -1 | 1) => void;
  updateSlideBackground: (slideId: string, color: string) => void;
  updateSlideBackgroundPatch: (slideId: string, patch: Partial<Slide['background']>) => void;
  updateSpeakerNotes: (slideId: string, notes: string) => void;
  applyDesignTokens: (tokens: DesignTokens) => void;
  updateTitle: (title: string) => void;
  resizeDocument: (
    width: number,
    height: number,
    aspectRatio: PresentationDocument['aspectRatio'],
    scaleElements?: boolean
  ) => void;
  updatePageMargin: (pageMargin: number, showMargins?: boolean) => void;

  undo: () => void;
  redo: () => void;
  setSavingState: (saving: boolean, savedAt?: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  document: null,
  activeSlideId: '',
  selectedElementIds: [],
  clipboard: [],
  past: [],
  future: [],
  zoom: 0.78,
  snapToGrid: true,
  gridSize: 16,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,

  loadDocument: (doc) =>
    set({
      document: structuredClone(doc),
      activeSlideId: doc.slides[0]?.id || '',
      selectedElementIds: [],
      past: [],
      future: [],
      isDirty: false,
    }),

  selectSlide: (slideId) => set({ activeSlideId: slideId, selectedElementIds: [] }),
  selectElements: (ids) => set({ selectedElementIds: ids }),
  selectAllOnActiveSlide: () => {
    const { document, activeSlideId } = get();
    if (!document) return;
    const slide = document.slides.find((s) => s.id === activeSlideId);
    if (!slide) return;
    set({ selectedElementIds: slide.elements.filter((e) => e.visible).map((e) => e.id) });
  },
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(2, zoom)) }),
  toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),

  commitChange: (updater) => {
    const curr = get().document;
    if (!curr) return;
    const next = updater(structuredClone(curr));
    set((s) => ({
      past: [...s.past.slice(-39), curr],
      document: next,
      future: [],
      isDirty: true,
    }));
  },

  updateElementLive: (slideId, elementId, patch) => {
    const curr = get().document;
    if (!curr) return;
    const nextSlides = curr.slides.map((sl) =>
      sl.id !== slideId
        ? sl
        : {
            ...sl,
            elements: sl.elements.map((el) =>
              el.id === elementId ? ({ ...el, ...patch } as PresentationElement) : el
            ),
          }
    );
    set({
      document: { ...curr, slides: nextSlides },
      isDirty: true,
    });
  },

  updateElementsLiveBatch: (slideId, patches) => {
    const curr = get().document;
    if (!curr) return;
    const nextSlides = curr.slides.map((sl) =>
      sl.id !== slideId
        ? sl
        : {
            ...sl,
            elements: sl.elements.map((el) => {
              const p = patches[el.id];
              return p ? ({ ...el, ...p } as PresentationElement) : el;
            }),
          }
    );
    set({
      document: { ...curr, slides: nextSlides },
      isDirty: true,
    });
  },

  commitSnapshot: () => {
    const curr = get().document;
    if (!curr) return;
    set((s) => ({
      past: [...s.past.slice(-39), structuredClone(curr)],
      future: [],
    }));
  },

  addElement: (slideId, element) => {
    get().commitChange((doc) => ({
      ...doc,
      slides: doc.slides.map((sl) =>
        sl.id === slideId ? { ...sl, elements: [...sl.elements, element] } : sl
      ),
    }));
    set({ selectedElementIds: [element.id] });
  },

  deleteSelectedElements: () => {
    const { activeSlideId, selectedElementIds } = get();
    if (selectedElementIds.length === 0) return;
    const delSet = new Set(selectedElementIds);
    get().commitChange((doc) => ({
      ...doc,
      slides: doc.slides.map((sl) =>
        sl.id === activeSlideId
          ? { ...sl, elements: sl.elements.filter((el) => !delSet.has(el.id) || el.locked) }
          : sl
      ),
    }));
    set({ selectedElementIds: [] });
  },

  duplicateSelectedElement: () => {
    const { document, activeSlideId, selectedElementIds } = get();
    if (!document || selectedElementIds.length === 0) return;
    const slide = document.slides.find((s) => s.id === activeSlideId);
    if (!slide) return;
    const selSet = new Set(selectedElementIds);
    const targets = slide.elements.filter((e) => selSet.has(e.id));
    if (targets.length === 0) return;

    const groupRemap = new Map<string, string>();
    const baseZ = (slide.elements.length || 1) + 1;
    const copies: PresentationElement[] = targets.map((target, idx) => {
      let nextGroupId = target.groupId;
      if (target.groupId) {
        if (!groupRemap.has(target.groupId)) {
          groupRemap.set(target.groupId, `grp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
        }
        nextGroupId = groupRemap.get(target.groupId);
      }
      return {
        ...structuredClone(target),
        id: `el-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        name: targets.length === 1 ? `${target.name} Copy` : target.name,
        groupId: nextGroupId,
        x: Math.min(document.width - target.width - 16, target.x + 24),
        y: Math.min(document.height - target.height - 16, target.y + 24),
        zIndex: baseZ + idx,
      };
    });

    get().commitChange((doc) => ({
      ...doc,
      slides: doc.slides.map((sl) =>
        sl.id === activeSlideId ? { ...sl, elements: [...sl.elements, ...copies] } : sl
      ),
    }));
    set({ selectedElementIds: copies.map((c) => c.id) });
  },

  copySelectedElement: () => {
    const { document, activeSlideId, selectedElementIds } = get();
    if (!document || selectedElementIds.length === 0) return;
    const slide = document.slides.find((s) => s.id === activeSlideId);
    if (!slide) return;
    const selSet = new Set(selectedElementIds);
    const targets = slide.elements.filter((e) => selSet.has(e.id));
    if (targets.length > 0) set({ clipboard: structuredClone(targets) });
  },

  pasteElement: () => {
    const { clipboard, activeSlideId, document } = get();
    if (!clipboard || clipboard.length === 0 || !document) return;
    const slide = document.slides.find((s) => s.id === activeSlideId);
    const baseZ = (slide?.elements.length || 1) + 1;
    const groupRemap = new Map<string, string>();
    const copies: PresentationElement[] = clipboard.map((item, idx) => {
      let nextGroupId = item.groupId;
      if (item.groupId) {
        if (!groupRemap.has(item.groupId)) {
          groupRemap.set(item.groupId, `grp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
        }
        nextGroupId = groupRemap.get(item.groupId);
      }
      return {
        ...structuredClone(item),
        id: `el-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        groupId: nextGroupId,
        x: Math.min(document.width - item.width - 16, item.x + 24),
        y: Math.min(document.height - item.height - 16, item.y + 24),
        zIndex: baseZ + idx,
      };
    });
    get().commitChange((doc) => ({
      ...doc,
      slides: doc.slides.map((sl) =>
        sl.id === activeSlideId ? { ...sl, elements: [...sl.elements, ...copies] } : sl
      ),
    }));
    set({ selectedElementIds: copies.map((c) => c.id) });
  },

  groupSelectedElements: () => {
    const { activeSlideId, selectedElementIds } = get();
    if (selectedElementIds.length < 2) return;
    const selSet = new Set(selectedElementIds);
    const newGroupId = `grp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    get().commitChange((doc) => ({
      ...doc,
      slides: doc.slides.map((sl) =>
        sl.id !== activeSlideId
          ? sl
          : {
              ...sl,
              elements: sl.elements.map((el) =>
                selSet.has(el.id) ? { ...el, groupId: newGroupId } : el
              ),
            }
      ),
    }));
  },

  ungroupSelectedElements: () => {
    const { document, activeSlideId, selectedElementIds } = get();
    if (!document || selectedElementIds.length === 0) return;
    const slide = document.slides.find((s) => s.id === activeSlideId);
    if (!slide) return;
    const selSet = new Set(selectedElementIds);
    const groupIds = new Set(
      slide.elements
        .filter((el) => selSet.has(el.id) && el.groupId)
        .map((el) => el.groupId as string)
    );
    if (groupIds.size === 0) return;
    get().commitChange((doc) => ({
      ...doc,
      slides: doc.slides.map((sl) =>
        sl.id !== activeSlideId
          ? sl
          : {
              ...sl,
              elements: sl.elements.map((el) =>
                selSet.has(el.id) || (el.groupId && groupIds.has(el.groupId))
                  ? { ...el, groupId: undefined }
                  : el
              ),
            }
      ),
    }));
  },

  reorderLayer: (elementId, dir) => {
    const { activeSlideId } = get();
    get().commitChange((doc) => ({
      ...doc,
      slides: doc.slides.map((sl) => {
        if (sl.id !== activeSlideId) return sl;
        const elements = sl.elements.map((el) =>
          el.id === elementId
            ? { ...el, zIndex: Math.max(0, el.zIndex + (dir === 'up' ? 1 : -1)) }
            : el
        );
        return { ...sl, elements };
      }),
    }));
  },

  toggleLockElement: (elementId) => {
    const { activeSlideId } = get();
    get().commitChange((doc) => ({
      ...doc,
      slides: doc.slides.map((sl) =>
        sl.id === activeSlideId
          ? {
              ...sl,
              elements: sl.elements.map((el) =>
                el.id === elementId ? { ...el, locked: !el.locked } : el
              ),
            }
          : sl
      ),
    }));
  },

  addSlide: () => {
    const doc = get().document;
    if (!doc) return;
    const newId = `slide-${Date.now()}`;
    const blankInk =
      contrastRatio(doc.tokens.colors.ink, '#FFFFFF') >= 4.5 ? doc.tokens.colors.ink : '#191B1F';
    const newSlide: Slide = {
      id: newId,
      order: doc.slides.length,
      layoutPattern: 'freeform',
      title: `Slide ${doc.slides.length + 1}`,
      background: { type: 'solid', color: '#FFFFFF' },
      speakerNotes: '',
      transition: 'fade',
      elements: [
        {
          id: `${newId}-title`,
          name: 'Slide Heading',
          type: 'text',
          x: doc.tokens.spacing.slidePadding,
          y: doc.tokens.spacing.slidePadding,
          width: doc.width - doc.tokens.spacing.slidePadding * 2,
          height: 68,
          rotation: 0,
          zIndex: 2,
          opacity: 1,
          visible: true,
          locked: false,
          content: `Slide ${doc.slides.length + 1} Headline`,
          fontFamily: doc.tokens.typography.displayFont,
          fontSize: 36,
          fontWeight: 700,
          fontStyle: 'normal',
          lineHeight: 1.2,
          letterSpacing: -0.01,
          textAlign: 'left',
          color: blankInk,
          borderRadius: 0,
          padding: 4,
          semanticRole: 'title',
        },
      ],
    };
    get().commitChange((d) => ({ ...d, slides: [...d.slides, newSlide] }));
    set({ activeSlideId: newId, selectedElementIds: [] });
  },

  duplicateSlide: (slideId) => {
    const doc = get().document;
    if (!doc) return;
    const idx = doc.slides.findIndex((s) => s.id === slideId);
    if (idx === -1) return;
    const source = doc.slides[idx];
    const newId = `slide-${Date.now()}`;
    const cloned: Slide = {
      ...structuredClone(source),
      id: newId,
      title: `${source.title} (Copy)`,
      elements: source.elements.map((el, i) => ({
        ...structuredClone(el),
        id: `${newId}-el-${i}`,
      })),
    };
    get().commitChange((d) => {
      const next = [...d.slides];
      next.splice(idx + 1, 0, cloned);
      return { ...d, slides: next.map((s, o) => ({ ...s, order: o })) };
    });
    set({ activeSlideId: newId, selectedElementIds: [] });
  },

  deleteSlide: (slideId) => {
    const doc = get().document;
    if (!doc || doc.slides.length <= 1) return;
    const idx = doc.slides.findIndex((s) => s.id === slideId);
    get().commitChange((d) => {
      const filtered = d.slides.filter((s) => s.id !== slideId).map((s, o) => ({ ...s, order: o }));
      return { ...d, slides: filtered };
    });
    const remaining = get().document?.slides || [];
    const fallback = remaining[Math.max(0, idx - 1)] || remaining[0];
    set({ activeSlideId: fallback?.id || '', selectedElementIds: [] });
  },

  moveSlide: (slideId, dir) => {
    get().commitChange((d) => {
      const idx = d.slides.findIndex((s) => s.id === slideId);
      const target = idx + dir;
      if (idx === -1 || target < 0 || target >= d.slides.length) return d;
      const next = [...d.slides];
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      return { ...d, slides: next.map((s, o) => ({ ...s, order: o })) };
    });
  },

  updateSlideBackground: (slideId, color) => {
    get().commitChange((d) => ({
      ...d,
      slides: d.slides.map((s) =>
        s.id === slideId ? { ...s, background: { ...s.background, type: 'solid', color } } : s
      ),
    }));
  },

  updateSlideBackgroundPatch: (slideId, patch) => {
    get().commitChange((d) => ({
      ...d,
      slides: d.slides.map((s) =>
        s.id === slideId ? { ...s, background: { ...s.background, ...patch } } : s
      ),
    }));
  },

  updateSpeakerNotes: (slideId, notes) => {
    get().commitChange((d) => ({
      ...d,
      slides: d.slides.map((s) => (s.id === slideId ? { ...s, speakerNotes: notes } : s)),
    }));
  },

  applyDesignTokens: (tokens) => {
    get().commitChange((d) => ({
      ...d,
      themeId: tokens.id,
      tokens,
      slides: d.slides.map((s) => ({
        ...s,
        background: {
          ...s.background,
          type: 'solid',
          color: tokens.colors.background,
          patternColor: tokens.colors.ink,
        },
        elements: s.elements.map((el) => {
          if (el.type === 'text') {
            return {
              ...el,
              fontFamily:
                el.semanticRole === 'title'
                  ? tokens.typography.displayFont
                  : el.semanticRole === 'kicker'
                  ? tokens.typography.monoFont
                  : tokens.typography.bodyFont,
              color:
                el.semanticRole === 'kicker'
                  ? tokens.colors.accent
                  : el.semanticRole === 'subtitle'
                  ? tokens.colors.muted
                  : tokens.colors.ink,
            };
          }
          if (el.type === 'shape') {
            if ((el.blur && el.blur > 0) || el.opacity <= 0.45) {
              return {
                ...el,
                fill: el.height <= 8 ? tokens.colors.accent : el.fill,
              };
            }
            return {
              ...el,
              fill: el.height <= 8 ? tokens.colors.accent : tokens.colors.surface,
              stroke: tokens.colors.border,
            };
          }
          if (el.type === 'chart') {
            return {
              ...el,
              accentColor: tokens.colors.accent,
              textColor: tokens.colors.ink,
              surfaceColor: tokens.colors.surface,
            };
          }
          return el;
        }),
      })),
    }));
  },

  updateTitle: (title) => {
    get().commitChange((d) => ({ ...d, title }));
  },

  resizeDocument: (width, height, aspectRatio, scaleElements = true) => {
    const nextW = Math.max(240, Math.min(3200, Math.round(width)));
    const nextH = Math.max(240, Math.min(3200, Math.round(height)));
    get().commitChange((d) => {
      const oldW = Math.max(1, d.width);
      const oldH = Math.max(1, d.height);
      const sx = nextW / oldW;
      const sy = nextH / oldH;
      const fontScale = Math.min(sx, sy);

      return {
        ...d,
        aspectRatio,
        width: nextW,
        height: nextH,
        slides: d.slides.map((s) => ({
          ...s,
          elements: s.elements.map((el) => {
            if (scaleElements) {
              const scaledW = Math.max(20, Math.round(el.width * sx));
              const scaledH = Math.max(12, Math.round(el.height * sy));
              const scaledX = Math.round(el.x * sx);
              const scaledY = Math.round(el.y * sy);
              if (el.type === 'text') {
                return {
                  ...el,
                  x: scaledX,
                  y: scaledY,
                  width: scaledW,
                  height: scaledH,
                  fontSize: Math.max(10, Math.min(160, Math.round(el.fontSize * fontScale))),
                };
              }
              return {
                ...el,
                x: scaledX,
                y: scaledY,
                width: scaledW,
                height: scaledH,
              };
            }
            const clampedW = Math.min(el.width, nextW - 16);
            const clampedH = Math.min(el.height, nextH - 16);
            return {
              ...el,
              x: Math.max(0, Math.min(nextW - clampedW, el.x)),
              y: Math.max(0, Math.min(nextH - clampedH, el.y)),
            };
          }),
        })),
      };
    });
  },

  updatePageMargin: (pageMargin, showMargins) => {
    const margin = Math.max(0, Math.min(200, Math.round(pageMargin)));
    get().commitChange((d) => ({
      ...d,
      pageMargin: margin,
      showMargins: showMargins ?? d.showMargins ?? true,
      tokens: {
        ...d.tokens,
        spacing: {
          ...d.tokens.spacing,
          slidePadding: margin,
        },
      },
    }));
  },

  undo: () => {
    const { past, document, future } = get();
    if (past.length === 0 || !document) return;
    const prev = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      document: prev,
      future: [document, ...future],
      isDirty: true,
    });
  },

  redo: () => {
    const { past, document, future } = get();
    if (future.length === 0 || !document) return;
    const next = future[0];
    set({
      past: [...past, document],
      document: next,
      future: future.slice(1),
      isDirty: true,
    });
  },

  setSavingState: (saving, savedAt) =>
    set((s) => ({
      isSaving: saving,
      isDirty: saving ? s.isDirty : false,
      lastSavedAt: savedAt ?? s.lastSavedAt,
    })),
}));
