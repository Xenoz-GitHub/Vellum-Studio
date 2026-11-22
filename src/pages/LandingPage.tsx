import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, FileOutput, Layers, LayoutGrid, Sliders } from 'lucide-react';
import { useAppStore } from '../state/useAppStore';
import { getSeedTemplates, SEED_IMAGE_PATHS } from '../core/seed-data';
import { SlideCanvas } from '../components/renderer/SlideCanvas';
import { BUILTIN_CUSTOM_COMPONENTS } from '../core/component-registry';
import { CustomComponentView } from '../components/renderer/CustomComponentView';
import { DESIGN_TOKEN_PRESETS } from '../core/seed-data';

const SAMPLE_TEMPLATES = getSeedTemplates();

const FAQS = [
  {
    q: 'Are generated slides flattened images or editable objects?',
    a: 'Every generated slide is stored in a typed canonical document schema. Headings, body blocks, shapes, charts, tables, images, and registered custom components remain independently selectable, editable, and exportable.',
  },
  {
    q: 'How does PowerPoint (.pptx) export preserve layout fidelity?',
    a: 'Slide coordinates map deterministically from the 1280×720 internal canvas to PowerPoint inches (96 DPI). Native text boxes, vector shapes, tables, data charts, speaker notes, and embedded images are written directly via PptxGenJS.',
  },
  {
    q: 'Can I upload my own templates, fonts, and custom components?',
    a: 'Yes. Authorized administrators manage custom component manifests, color and typography token sets, licensed font assets, and published templates directly from the restricted Admin Console.',
  },
  {
    q: 'How do PDFs, DOCX files, and Canva exports work?',
    a: 'PDFs and images are analyzed multimodally alongside extracted DOCX/PPTX text. Existing PPTX files—including presentations exported from Canva as PPTX—can be uploaded and reconstructed into editable slides with an import diagnostic report.',
  },
];

export function LandingPage() {
  const { profile, isDemo, navigate, signInWithGoogle, enterDemoWorkspace, authError } = useAppStore();
  const [activeDeckIdx, setActiveDeckIdx] = useState(0);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const previewTemplate = SAMPLE_TEMPLATES[activeDeckIdx] || SAMPLE_TEMPLATES[0];
  const previewDoc = previewTemplate.document;
  const previewSlide = previewDoc.slides[activeSlideIdx] || previewDoc.slides[0];

  const handleOpenWorkspace = () => {
    if (profile || isDemo) {
      navigate({ page: 'dashboard' });
    } else {
      enterDemoWorkspace();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
              Architectural Presentation Engine
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold leading-[1.08] tracking-tight text-balance">
              Presentations composed with editorial discipline, not random templates.
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Synthesize briefs, PDFs, reference images, and structured data into multi-slide decks governed by your own design tokens, custom component registry, and editable PPTX export.
            </p>

            {authError && (
              <div className="p-3 rounded-lg border border-red-300 bg-red-50 text-red-800 text-sm">
                {authError}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenWorkspace}
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap"
              >
                {profile || isDemo ? 'Open Studio Workspace' : 'Try Interactive Workspace'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {!profile ? (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] text-sm font-semibold hover:bg-[var(--bg-subtle)] transition-colors whitespace-nowrap"
                >
                  Sign In with Google
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate({ page: 'templates' })}
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] text-sm font-semibold hover:bg-[var(--bg-subtle)] transition-colors whitespace-nowrap"
                >
                  Browse Templates
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--border-hairline)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--text-secondary)]">
              <span>Editable PPTX & PDF export</span>
              <span>Multimodal PDF & image briefs</span>
              <span>Custom component registry</span>
            </div>
          </div>

          {/* Interactive Live Slide Previewer */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 sm:p-6 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--border-hairline)]">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-subtle)] overflow-x-auto max-w-full">
                  {SAMPLE_TEMPLATES.slice(0, 3).map((tpl, idx) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setActiveDeckIdx(idx);
                        setActiveSlideIdx(0);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                        activeDeckIdx === idx
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {tpl.category}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono-tabular text-[var(--text-secondary)]">
                  <span>
                    Slide {activeSlideIdx + 1} / {previewDoc.slides.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Previous preview slide"
                    onClick={() => setActiveSlideIdx((i) => Math.max(0, i - 1))}
                    disabled={activeSlideIdx === 0}
                    className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-[var(--border-hairline)] disabled:opacity-40 hover:bg-[var(--bg-subtle)]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next preview slide"
                    onClick={() => setActiveSlideIdx((i) => Math.min(previewDoc.slides.length - 1, i + 1))}
                    disabled={activeSlideIdx >= previewDoc.slides.length - 1}
                    className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-[var(--border-hairline)] disabled:opacity-40 hover:bg-[var(--bg-subtle)]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="w-full overflow-hidden flex items-center justify-center bg-[var(--bg-subtle)] rounded-lg p-3 sm:p-5 min-h-[230px] sm:min-h-[352px] xl:min-h-[444px]">
                <div className="hidden xl:block">
                  <SlideCanvas
                    slide={previewSlide}
                    tokens={previewDoc.tokens}
                    width={previewDoc.width}
                    height={previewDoc.height}
                    scale={Number(Math.min(716 / previewDoc.width, 404 / previewDoc.height).toFixed(3))}
                    animated
                    animationKey={activeDeckIdx * 100 + activeSlideIdx}
                  />
                </div>
                <div className="hidden sm:block xl:hidden">
                  <SlideCanvas
                    slide={previewSlide}
                    tokens={previewDoc.tokens}
                    width={previewDoc.width}
                    height={previewDoc.height}
                    scale={Number(Math.min(560 / previewDoc.width, 316 / previewDoc.height).toFixed(3))}
                    animated
                    animationKey={activeDeckIdx * 100 + activeSlideIdx}
                  />
                </div>
                <div className="sm:hidden">
                  <SlideCanvas
                    slide={previewSlide}
                    tokens={previewDoc.tokens}
                    width={previewDoc.width}
                    height={previewDoc.height}
                    scale={Number(Math.min(300 / previewDoc.width, 196 / previewDoc.height).toFixed(3))}
                    animated
                    animationKey={activeDeckIdx * 100 + activeSlideIdx}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="truncate font-medium text-[var(--text-primary)]">{previewTemplate.name}</span>
                <span className="font-mono-tabular shrink-0 ml-3">{previewDoc.tokens.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Visual Proof Strip */}
      <section className="border-y border-[var(--border-hairline)] bg-[var(--bg-surface)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[var(--border-hairline)]">
              <img
                src={SEED_IMAGE_PATHS.heroStudio}
                alt="Architectural typography sheets and grid scales in a sunlit studio"
                referrerPolicy="no-referrer"
                className="w-full h-full min-h-[260px] object-cover"
              />
            </div>
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-balance">
                  A multi-stage synthesis pipeline built around your design rules.
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Instead of prompting an LLM to guess arbitrary pixel coordinates, Vellum separates semantic planning from deterministic Swiss grid layout, WCAG contrast enforcement, and custom component mapping.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                <div className="border-t border-[var(--border-hairline)] pt-4">
                  <div className="text-xs font-mono-tabular text-[var(--accent)] mb-1">01. Source Ingestion</div>
                  <div className="font-semibold mb-1">Multimodal Briefs & References</div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Extract structured points from PDFs, DOCX documents, PPTX decks, and visual direction screenshots while keeping source citations traceable.
                  </p>
                </div>
                <div className="border-t border-[var(--border-hairline)] pt-4">
                  <div className="text-xs font-mono-tabular text-[var(--accent)] mb-1">02. Editable Outline</div>
                  <div className="font-semibold mb-1">Narrative Before Pixels</div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Review, reorder, and refine every slide heading, semantic role, and layout pattern before the composition engine renders the deck.
                  </p>
                </div>
                <div className="border-t border-[var(--border-hairline)] pt-4">
                  <div className="text-xs font-mono-tabular text-[var(--accent)] mb-1">03. Token Governance</div>
                  <div className="font-semibold mb-1">Deterministic Grid & Contrast</div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Bound checks, overlap detection, and contrast ratios run automatically across every element against your selected token set.
                  </p>
                </div>
                <div className="border-t border-[var(--border-hairline)] pt-4">
                  <div className="text-xs font-mono-tabular text-[var(--accent)] mb-1">04. Native Portability</div>
                  <div className="font-semibold mb-1">Editable PowerPoint Output</div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Export directly to `.pptx` with native text boxes, charts, tables, and speaker notes, or share permission-controlled links.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extensible Custom Component System */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Extensible Custom Component Ecosystem
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl">
              Declarative, versioned component manifests connect the Admin Console, Editor Inspector, and AI Layout Engine without rewriting core code.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenWorkspace}
            className="text-sm font-semibold text-[var(--accent)] hover:underline whitespace-nowrap self-start md:self-auto"
          >
            Inspect in Studio Editor
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[BUILTIN_CUSTOM_COMPONENTS[0], BUILTIN_CUSTOM_COMPONENTS[2], BUILTIN_CUSTOM_COMPONENTS[3]].map((comp) => (
            <div
              key={comp.componentKey}
              className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 flex flex-col justify-between gap-4"
            >
              <div className="h-44 overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-2">
                <div className="origin-top-left" style={{ width: '560px', height: '240px', transform: 'scale(0.62)' }}>
                  <CustomComponentView
                    element={{
                      id: `preview-${comp.componentKey}`,
                      name: comp.name,
                      type: 'custom',
                      x: 0,
                      y: 0,
                      width: 560,
                      height: 240,
                      rotation: 0,
                      zIndex: 1,
                      opacity: 1,
                      visible: true,
                      locked: false,
                      componentKey: comp.componentKey,
                      componentVersion: comp.version,
                      props: comp.defaultProps,
                    }}
                    tokens={DESIGN_TOKEN_PRESETS[0]}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-[var(--text-secondary)] font-mono-tabular mb-1">
                  {comp.category} · v{comp.version}
                </div>
                <h3 className="font-semibold text-base mb-1">{comp.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{comp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities Matrix */}
      <section className="border-t border-[var(--border-hairline)] bg-[var(--bg-surface)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <Layers className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="font-semibold">Layer & Grid Precision</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Snap-to-grid positioning, alignment centerlines, lockable layers, undo/redo history, and inline text editing on desktop and touch.
              </p>
            </div>
            <div className="space-y-2">
              <Sliders className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="font-semibold">Design Token Registry</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Switch entire decks between Warm Atelier, Gallery Editorial, Obsidian Studio, Nordic Slate, or custom admin token sets.
              </p>
            </div>
            <div className="space-y-2">
              <FileOutput className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="font-semibold">Round-Trip PPTX & Print</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Import existing `.pptx` decks (including Canva PPTX exports) with an explicit import report, edit freely, and export back to `.pptx`, PNG, or PDF.
              </p>
            </div>
            <div className="space-y-2">
              <LayoutGrid className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="font-semibold">Permissioned Sharing</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Issue read-only or collaborative edit links with optional passwords, expiration windows, and one-click revocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-8">
          Technical & Workflow Questions
        </h2>
        <div className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
          {FAQS.map((item, idx) => (
            <div key={idx}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
                className="w-full py-5 flex items-center justify-between text-left gap-4 font-medium"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-[var(--text-secondary)] transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="border-t border-[var(--border-hairline)] bg-[var(--bg-surface)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-4">
            <span className="font-display font-bold text-sm text-[var(--text-primary)]">Vellum Studio</span>
            <span aria-hidden="true">·</span>
            <span>Presentation Architecture & Design Ecosystem</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/templates" onClick={(e) => { e.preventDefault(); navigate({ page: 'templates' }); }} className="hover:text-[var(--text-primary)]">
              Template Library
            </a>
            <a href="/create" onClick={(e) => { e.preventDefault(); handleOpenWorkspace(); }} className="hover:text-[var(--text-primary)]">
              Studio Workspace
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
