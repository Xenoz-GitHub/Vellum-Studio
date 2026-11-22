import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PresentationDocument, Slide } from '../../core/schema';
import { SlideCanvas } from '../renderer/SlideCanvas';

interface BookFlipViewerProps {
  doc: PresentationDocument;
  initialSlideIndex?: number;
  onSlideChange?: (slideId: string) => void;
}

export function BookFlipViewer({
  doc,
  initialSlideIndex = 0,
  onSlideChange,
}: BookFlipViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxSize, setBoxSize] = useState({ width: 960, height: 640 });
  const [pageIdx, setPageIdx] = useState(
    Math.max(0, Math.min(doc.slides.length - 1, initialSlideIndex))
  );
  const [flipState, setFlipState] = useState<{
    dir: 'next' | 'prev';
    fromSpread: number;
    toSpread: number;
    flipped: boolean;
  } | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setBoxSize({ width: el.clientWidth, height: el.clientHeight });
    };
    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const isSpread = boxSize.width >= 760 && doc.slides.length > 1;
  const totalSpreads = isSpread ? Math.ceil(doc.slides.length / 2) : doc.slides.length;
  const currentSpread = isSpread ? Math.floor(pageIdx / 2) : pageIdx;

  const pageScale = (() => {
    const availW = isSpread ? (boxSize.width - 110) / 2 : boxSize.width - 48;
    const availH = boxSize.height - 56;
    return Number(
      Math.max(0.18, Math.min(availW / doc.width, availH / doc.height, 0.95)).toFixed(3)
    );
  })();

  const pageW = Math.round(doc.width * pageScale);
  const pageH = Math.round(doc.height * pageScale);

  const triggerFlip = (dir: 'next' | 'prev') => {
    if (flipState) return;
    const targetSpread = dir === 'next' ? currentSpread + 1 : currentSpread - 1;
    if (targetSpread < 0 || targetSpread >= totalSpreads) return;

    setFlipState({
      dir,
      fromSpread: currentSpread,
      toSpread: targetSpread,
      flipped: false,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlipState((prev) => (prev ? { ...prev, flipped: true } : null));
      });
    });

    setTimeout(() => {
      const nextPage = isSpread ? targetSpread * 2 : targetSpread;
      setPageIdx(nextPage);
      setFlipState(null);
      if (doc.slides[nextPage]) {
        onSlideChange?.(doc.slides[nextPage].id);
      }
    }, 560);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        triggerFlip('next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerFlip('prev');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const renderPageFace = (slide: Slide | undefined, pageNum: number, side: 'left' | 'right') => {
    if (!slide) {
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center bg-[#1D2129] text-neutral-400 select-none"
          style={{
            boxShadow:
              side === 'left'
                ? 'inset -18px 0 28px -14px rgba(0,0,0,0.45)'
                : 'inset 18px 0 28px -14px rgba(0,0,0,0.45)',
          }}
        >
          <BookOpen className="w-8 h-8 opacity-35 mb-2" />
          <span className="text-[11px] font-mono-tabular opacity-50">End of Book</span>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full overflow-hidden bg-white">
        <SlideCanvas
          slide={slide}
          tokens={doc.tokens}
          width={doc.width}
          height={doc.height}
          scale={pageScale}
          animated={false}
        />
        {/* Spine fold shading */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              side === 'left'
                ? 'linear-gradient(to left, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.06) 8%, transparent 22%)'
                : 'linear-gradient(to right, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.06) 8%, transparent 22%)',
          }}
        />
        <span
          className={`absolute bottom-2 ${
            side === 'left' ? 'left-3' : 'right-3'
          } px-1.5 py-0.5 rounded bg-black/45 text-white text-[10px] font-mono-tabular pointer-events-none`}
        >
          {pageNum}
        </span>
      </div>
    );
  };

  // Compute visible spreads & animated leaf
  const displayedSpread = flipState ? flipState.fromSpread : currentSpread;

  return (
    <div className="flex-1 flex flex-col items-center justify-between min-h-0 w-full select-none">
      <div
        ref={containerRef}
        className="flex-1 w-full flex items-center justify-center overflow-hidden px-3"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
          const delta = endX - touchStartX.current;
          touchStartX.current = null;
          if (delta < -40) triggerFlip('next');
          else if (delta > 40) triggerFlip('prev');
        }}
      >
        {isSpread ? (
          /* Desktop / Tablet 2-Page 3D Perspective Book Spread */
          <div
            className="relative flex items-center justify-center rounded-xl p-2 sm:p-3 bg-[#1E222B] shadow-[0_28px_70px_-12px_rgba(0,0,0,0.75)] border border-white/10"
            style={{ perspective: '2200px' }}
          >
            <div className="relative flex" style={{ width: `${pageW * 2}px`, height: `${pageH}px` }}>
              {/* Underlying Left Page */}
              <button
                type="button"
                aria-label="Previous book spread"
                onClick={() => triggerFlip('prev')}
                disabled={currentSpread === 0 || Boolean(flipState)}
                className="relative shrink-0 overflow-hidden rounded-l-md text-left focus:outline-none disabled:cursor-default cursor-pointer"
                style={{ width: `${pageW}px`, height: `${pageH}px` }}
              >
                {renderPageFace(
                  flipState?.dir === 'prev'
                    ? doc.slides[flipState.toSpread * 2]
                    : doc.slides[displayedSpread * 2],
                  (flipState?.dir === 'prev' ? flipState.toSpread : displayedSpread) * 2 + 1,
                  'left'
                )}
              </button>

              {/* Center Book Spine Highlight */}
              <div
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-2 z-20 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.35), rgba(255,255,255,0.12), rgba(0,0,0,0.38))',
                }}
              />

              {/* Underlying Right Page */}
              <button
                type="button"
                aria-label="Next book spread"
                onClick={() => triggerFlip('next')}
                disabled={currentSpread >= totalSpreads - 1 || Boolean(flipState)}
                className="relative shrink-0 overflow-hidden rounded-r-md text-left focus:outline-none disabled:cursor-default cursor-pointer"
                style={{ width: `${pageW}px`, height: `${pageH}px` }}
              >
                {renderPageFace(
                  flipState?.dir === 'next'
                    ? doc.slides[flipState.toSpread * 2 + 1]
                    : doc.slides[displayedSpread * 2 + 1],
                  (flipState?.dir === 'next' ? flipState.toSpread : displayedSpread) * 2 + 2,
                  'right'
                )}
              </button>

              {/* Animated 3D Turning Page Leaf */}
              {flipState && (
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 z-30 pointer-events-none"
                  style={{
                    width: `${pageW}px`,
                    height: `${pageH}px`,
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 540ms cubic-bezier(0.32, 0.08, 0.24, 1)',
                    transform:
                      flipState.dir === 'next'
                        ? flipState.flipped
                          ? 'rotateY(-180deg)'
                          : 'rotateY(0deg)'
                        : flipState.flipped
                        ? 'rotateY(0deg)'
                        : 'rotateY(-180deg)',
                  }}
                >
                  {/* Front of leaf (right side) */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-r-md shadow-2xl"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {flipState.dir === 'next'
                      ? renderPageFace(
                          doc.slides[flipState.fromSpread * 2 + 1],
                          flipState.fromSpread * 2 + 2,
                          'right'
                        )
                      : renderPageFace(
                          doc.slides[flipState.toSpread * 2 + 1],
                          flipState.toSpread * 2 + 2,
                          'right'
                        )}
                  </div>
                  {/* Back of leaf (left side when turned) */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-l-md shadow-2xl"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {flipState.dir === 'next'
                      ? renderPageFace(
                          doc.slides[flipState.toSpread * 2],
                          flipState.toSpread * 2 + 1,
                          'left'
                        )
                      : renderPageFace(
                          doc.slides[flipState.fromSpread * 2],
                          flipState.fromSpread * 2 + 1,
                          'left'
                        )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Mobile Single-Page 3D Flip Book */
          <div
            className="relative flex items-center justify-center rounded-xl p-1.5 bg-[#1E222B] shadow-[0_24px_60px_-10px_rgba(0,0,0,0.75)] border border-white/10"
            style={{ perspective: '1600px' }}
          >
            <div className="relative" style={{ width: `${pageW}px`, height: `${pageH}px` }}>
              {/* Destination page beneath */}
              <div className="absolute inset-0 overflow-hidden rounded-md">
                {flipState
                  ? renderPageFace(doc.slides[flipState.toSpread], flipState.toSpread + 1, 'right')
                  : renderPageFace(doc.slides[currentSpread], currentSpread + 1, 'right')}
              </div>

              {/* Flipping top page */}
              {flipState && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 overflow-hidden rounded-md shadow-2xl pointer-events-none"
                  style={{
                    transformOrigin: 'left center',
                    transition: 'transform 520ms cubic-bezier(0.32, 0.08, 0.24, 1), opacity 520ms ease',
                    transform:
                      flipState.dir === 'next'
                        ? flipState.flipped
                          ? 'rotateY(-108deg)'
                          : 'rotateY(0deg)'
                        : flipState.flipped
                        ? 'rotateY(0deg)'
                        : 'rotateY(-108deg)',
                    opacity: flipState.dir === 'next' ? (flipState.flipped ? 0.15 : 1) : flipState.flipped ? 1 : 0.15,
                  }}
                >
                  {renderPageFace(
                    doc.slides[flipState.dir === 'next' ? flipState.fromSpread : flipState.toSpread],
                    (flipState.dir === 'next' ? flipState.fromSpread : flipState.toSpread) + 1,
                    'right'
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Book Navigation Controls */}
      <div className="flex items-center justify-center gap-3 pt-3 pb-1">
        <button
          type="button"
          onClick={() => triggerFlip('prev')}
          disabled={currentSpread === 0 || Boolean(flipState)}
          className="px-4 py-2 min-h-[44px] rounded-lg border border-neutral-700 text-xs disabled:opacity-30 inline-flex items-center gap-1 hover:bg-neutral-800"
        >
          <ChevronLeft className="w-4 h-4" /> Flip Back
        </button>
        <div className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono-tabular text-neutral-300">
          {isSpread
            ? `Pages ${currentSpread * 2 + 1}–${Math.min(doc.slides.length, currentSpread * 2 + 2)} / ${doc.slides.length}`
            : `Page ${currentSpread + 1} / ${doc.slides.length}`}
        </div>
        <button
          type="button"
          onClick={() => triggerFlip('next')}
          disabled={currentSpread >= totalSpreads - 1 || Boolean(flipState)}
          className="px-4 py-2 min-h-[44px] rounded-lg border border-neutral-700 text-xs disabled:opacity-30 inline-flex items-center gap-1 hover:bg-neutral-800"
        >
          Flip Page <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
