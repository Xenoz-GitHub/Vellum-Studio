import PptxGenJS from 'pptxgenjs';
import JSZip from 'jszip';
import { Resvg } from '@resvg/resvg-js';
import {
  type PresentationDocument,
  type PresentationElement,
  type Slide,
  pxToInches,
  dimensionsForAspectRatio,
} from './schema';
import { DESIGN_TOKEN_PRESETS } from './seed-data';
import {
  renderCutoutIllustrationSvg,
  renderFlipCalendarSvgString,
  renderIconSvgString,
  renderRetroOsDialogSvgString,
  renderRetroTvSvgString,
  renderShapeSvgString,
  renderSlideBackgroundSvgString,
  renderY2kStickerSvgString,
} from './svg-cutout-renderer';
import { renderPhotoFrameSvgString } from './frame-catalog';
import { renderStyledTextSvgString } from './text-effects';

function stripHash(color?: string): string {
  if (!color) return '191B1F';
  const c = color.trim();
  const hexMatch = c.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      return hex
        .split('')
        .map((ch) => ch + ch)
        .join('')
        .toUpperCase();
    }
    return hex.toUpperCase();
  }
  return '191B1F';
}

function rasterizeSvgToPngDataUri(svg: string, targetPxWidth: number): string {
  const fitWidth = Math.max(64, Math.min(2400, Math.round(targetPxWidth)));
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: fitWidth },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  return `data:image/png;base64,${Buffer.from(pngBuffer).toString('base64')}`;
}

export async function exportPresentationToPptxBuffer(
  doc: PresentationDocument,
  resolveLocalAsset?: (src: string) => Promise<{ base64: string; mime: string } | null>
): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.title = doc.title;
  pptx.subject = doc.description || 'Created with Vellum Studio';
  pptx.author = 'Vellum Studio';

  const wInches = pxToInches(doc.width);
  const hInches = pxToInches(doc.height);
  pptx.defineLayout({ name: 'VELLUM_CUSTOM', width: wInches, height: hInches });
  pptx.layout = 'VELLUM_CUSTOM';

  for (const slide of doc.slides) {
    const pSlide = pptx.addSlide();
    const bgHex =
      slide.background.type === 'gradient' && slide.background.gradient
        ? stripHash(slide.background.color || slide.background.gradient)
        : stripHash(slide.background.color || doc.tokens.colors.background);
    pSlide.background = { color: bgHex };

    // Rasterize gradient/pattern background overlay when present so MS PowerPoint preserves gradients & patterns
    try {
      const bgSvg = renderSlideBackgroundSvgString(slide, doc.width, doc.height, doc.tokens.colors.background);
      if (bgSvg) {
        const bgDataUri = rasterizeSvgToPngDataUri(bgSvg, doc.width);
        pSlide.addImage({
          data: bgDataUri,
          x: 0,
          y: 0,
          w: wInches,
          h: hInches,
        });
      }
    } catch {
      // Fallback to solid pSlide.background
    }

    if (slide.speakerNotes) {
      pSlide.addNotes(slide.speakerNotes);
    }

    const sorted = [...slide.elements].filter((e) => e.visible).sort((a, b) => a.zIndex - b.zIndex);

    for (const el of sorted) {
      const x = pxToInches(el.x);
      const y = pxToInches(el.y);
      const w = Math.max(0.1, pxToInches(el.width));
      const h = Math.max(0.1, pxToInches(el.height));

      if (el.type === 'text') {
        if (el.textEffect === 'sticker-outline' || el.textEffect === 'ransom-cutout') {
          try {
            const svg = renderStyledTextSvgString(el);
            const dataUri = rasterizeSvgToPngDataUri(svg, Math.max(240, el.width * 2));
            pSlide.addImage({
              data: dataUri,
              x,
              y,
              w,
              h,
              rotate: el.rotation || 0,
            });
            continue;
          } catch {
            // Fall back to standard native PowerPoint text box
          }
        }
        pSlide.addText(el.content, {
          x,
          y,
          w,
          h,
          fontFace: el.fontFamily || doc.tokens.typography.bodyFont,
          fontSize: Math.max(8, Math.round(el.fontSize * 0.75)), // CSS px -> pt
          bold: el.fontWeight >= 600,
          italic: el.fontStyle === 'italic',
          color: stripHash(el.color),
          align: el.textAlign,
          valign: 'top',
          rotate: el.rotation || 0,
          fill: el.backgroundColor ? { color: stripHash(el.backgroundColor) } : undefined,
        });
      } else if (el.type === 'shape') {
        if (el.gradient && (el.blur || 0) === 0) {
          try {
            const svg = renderShapeSvgString(el, `sh-${el.id}`);
            const dataUri = rasterizeSvgToPngDataUri(svg, Math.max(120, el.width * 2));
            pSlide.addImage({
              data: dataUri,
              x,
              y,
              w,
              h,
              rotate: el.rotation || 0,
            });
            continue;
          } catch {
            // Fall through to native shape
          }
        }

        const shapeMap: Record<string, PptxGenJS.ShapeType> = {
          rect: pptx.ShapeType.rect,
          'rounded-rect': pptx.ShapeType.roundRect,
          pill: pptx.ShapeType.roundRect,
          ellipse: pptx.ShapeType.ellipse,
          arrow: pptx.ShapeType.rightArrow,
          triangle: pptx.ShapeType.triangle,
          diamond: pptx.ShapeType.diamond,
          star: pptx.ShapeType.star5,
          hexagon: pptx.ShapeType.hexagon,
          pentagon: pptx.ShapeType.pentagon,
          heart: pptx.ShapeType.heart,
          'badge-burst': pptx.ShapeType.star12,
          'speech-bubble': pptx.ShapeType.wedgeRoundRectCallout,
          'ribbon-banner': pptx.ShapeType.chevron,
          line: pptx.ShapeType.rect,
        };
        const shapeType = shapeMap[el.shapeKind] || pptx.ShapeType.rect;

        const fillHex = stripHash(el.gradient || el.fill);
        pSlide.addShape(shapeType, {
          x,
          y,
          w,
          h: el.shapeKind === 'line' ? Math.max(0.02, h) : h,
          fill: { color: fillHex, transparency: Math.round((1 - el.opacity) * 100) },
          line: el.strokeWidth > 0 ? { color: stripHash(el.stroke), pt: el.strokeWidth } : { color: fillHex, pt: 0 },
          rectRadius: el.shapeKind === 'rounded-rect' ? 0.08 : el.shapeKind === 'pill' ? 0.5 : undefined,
          rotate: el.rotation || 0,
        });
      } else if (el.type === 'icon') {
        try {
          const iconSvg = renderIconSvgString(
            el.iconName,
            el.color,
            el.strokeWidth,
            el.colorMode ?? 'brand',
            el.id
          );
          const dataUri = rasterizeSvgToPngDataUri(iconSvg, Math.max(96, el.width * 2));
          pSlide.addImage({
            data: dataUri,
            x,
            y,
            w,
            h,
            rotate: el.rotation || 0,
          });
        } catch {
          pSlide.addShape(pptx.ShapeType.ellipse, {
            x,
            y,
            w,
            h,
            fill: { color: stripHash(el.color) },
          });
        }
      } else if (el.type === 'image') {
        try {
          if (el.src.startsWith('data:image/')) {
            pSlide.addImage({ data: el.src, x, y, w, h, rotate: el.rotation || 0 });
          } else if (resolveLocalAsset) {
            const resolved = await resolveLocalAsset(el.src);
            if (resolved) {
              pSlide.addImage({
                data: `data:${resolved.mime};base64,${resolved.base64}`,
                x,
                y,
                w,
                h,
                rotate: el.rotation || 0,
              });
            }
          }
        } catch {
          pSlide.addShape(pptx.ShapeType.rect, {
            x,
            y,
            w,
            h,
            fill: { color: 'EFEDE7' },
            line: { color: 'D0CEC6', pt: 1 },
          });
        }
      } else if (el.type === 'table') {
        const rows = [
          el.headers.map((header) => ({
            text: header,
            options: { bold: true, fill: { color: stripHash(el.headerBg) }, color: stripHash(el.headerColor) },
          })),
          ...el.rows.map((row, ri) =>
            row.map((cell) => ({
              text: cell,
              options: {
                fill: {
                  color: stripHash(
                    (el.tableStyle === 'striped' || el.stripeBg) && ri % 2 === 1
                      ? el.stripeBg || 'F4F4F5'
                      : el.cellBg
                  ),
                },
                color: stripHash(el.textColor),
              },
            }))
          ),
        ];
        pSlide.addTable(rows, {
          x,
          y,
          w,
          border: { pt: el.tableStyle === 'minimal' ? 0.4 : 0.75, color: stripHash(el.borderColor) },
          fontSize: 11,
        });
      } else if (el.type === 'chart') {
        const chartType =
          el.chartKind === 'line'
            ? pptx.ChartType.line
            : el.chartKind === 'area'
            ? pptx.ChartType.area
            : el.chartKind === 'pie'
            ? pptx.ChartType.pie
            : el.chartKind === 'donut'
            ? pptx.ChartType.doughnut
            : pptx.ChartType.bar;
        pSlide.addChart(
          chartType,
          [
            {
              name: el.title,
              labels: el.data.map((d) => d.label),
              values: el.data.map((d) => d.value),
            },
          ],
          {
            x,
            y,
            w,
            h,
            barDir: el.chartKind === 'horizontal-bar' || el.chartKind === 'metric-bars' ? 'bar' : 'col',
            showTitle: true,
            title: el.title,
            showValue: el.showValues,
            showLegend: el.showLegend,
            chartColors: el.data.map((d) => stripHash(d.color || el.accentColor)),
          }
        );
      } else if (el.type === 'custom') {
        const key = el.componentKey;
        if (
          key === 'cutout-illustration' ||
          key === 'retro-tv-frame' ||
          key === 'photo-frame' ||
          key === 'retro-os-dialog' ||
          key === 'birthday-flip-calendar' ||
          key === 'y2k-collage-sticker'
        ) {
          try {
            let svg = '';
            if (key === 'cutout-illustration') {
              svg = renderCutoutIllustrationSvg(String(el.props.stickerKind || 'balloon'), el.props, el.id).svg;
            } else if (key === 'retro-tv-frame') {
              svg = renderRetroTvSvgString(el.props, el.id);
            } else if (key === 'retro-os-dialog') {
              svg = renderRetroOsDialogSvgString(el.props, el.id, el.width, el.height);
            } else if (key === 'photo-frame') {
              let embeddedDataUri: string | undefined;
              if (typeof el.props.mediaSrc === 'string' && el.props.mediaSrc) {
                if (el.props.mediaSrc.startsWith('data:image/')) {
                  embeddedDataUri = el.props.mediaSrc;
                } else if (resolveLocalAsset) {
                  const resolved = await resolveLocalAsset(el.props.mediaSrc);
                  if (resolved) {
                    embeddedDataUri = `data:${resolved.mime};base64,${resolved.base64}`;
                  }
                }
              }
              svg = renderPhotoFrameSvgString(el.props, el.id, embeddedDataUri);
            } else if (key === 'birthday-flip-calendar') {
              svg = renderFlipCalendarSvgString(el.props, el.id);
            } else {
              svg = renderY2kStickerSvgString(el.props, el.id);
            }
            const dataUri = rasterizeSvgToPngDataUri(svg, Math.max(160, el.width * 2));
            pSlide.addImage({
              data: dataUri,
              x,
              y,
              w,
              h,
              rotate: el.rotation || 0,
            });

            if (key === 'retro-tv-frame' && typeof el.props.mediaSrc === 'string' && el.props.mediaSrc) {
              try {
                let screenDataUri: string | null = null;
                if (el.props.mediaSrc.startsWith('data:image/')) {
                  screenDataUri = el.props.mediaSrc;
                } else if (resolveLocalAsset) {
                  const resolved = await resolveLocalAsset(el.props.mediaSrc);
                  if (resolved) {
                    screenDataUri = `data:${resolved.mime};base64,${resolved.base64}`;
                  }
                }
                if (screenDataUri) {
                  const sw = w * (432 / 660);
                  const sh = h * (346 / 540);
                  const unrotSx = x + w * (42 / 660);
                  const unrotSy = y + h * (120 / 540);
                  const tvCx = x + w / 2;
                  const tvCy = y + h / 2;
                  const dx = unrotSx + sw / 2 - tvCx;
                  const dy = unrotSy + sh / 2 - tvCy;
                  const rad = ((el.rotation || 0) * Math.PI) / 180;
                  const rotCx = tvCx + dx * Math.cos(rad) - dy * Math.sin(rad);
                  const rotCy = tvCy + dx * Math.sin(rad) + dy * Math.cos(rad);
                  pSlide.addImage({
                    data: screenDataUri,
                    x: rotCx - sw / 2,
                    y: rotCy - sh / 2,
                    w: sw,
                    h: sh,
                    rotate: el.rotation || 0,
                  });
                }
              } catch {
                // Skip screen photo if asset resolution fails
              }
            }
            continue;
          } catch {
            // Fall back to editable card below
          }
        }

        // Structured editorial custom components -> decomposed into native editable shapes + text
        const accentHex = stripHash(String(el.props.accentColor || doc.tokens.colors.accent));
        if (key === 'editorial-kpi-card') {
          pSlide.addShape(pptx.ShapeType.roundRect, {
            x,
            y,
            w,
            h,
            fill: { color: stripHash(doc.tokens.colors.surface) },
            line: { color: stripHash(doc.tokens.colors.border), pt: 1 },
            rectRadius: 0.08,
          });
          pSlide.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.04, fill: { color: accentHex } });
          pSlide.addText(String(el.props.label || 'Metric').toUpperCase(), {
            x: x + 0.16,
            y: y + 0.14,
            w: w - 0.32,
            h: 0.25,
            fontFace: doc.tokens.typography.monoFont,
            fontSize: 9,
            color: stripHash(doc.tokens.colors.muted),
          });
          pSlide.addText(String(el.props.value || '0'), {
            x: x + 0.16,
            y: y + 0.42,
            w: w - 0.32,
            h: 0.68,
            fontFace: doc.tokens.typography.displayFont,
            fontSize: 32,
            bold: true,
            color: accentHex,
          });
          pSlide.addText(String(el.props.delta || ''), {
            x: x + 0.16,
            y: y + 1.15,
            w: w - 0.32,
            h: Math.max(0.3, h - 1.3),
            fontFace: doc.tokens.typography.bodyFont,
            fontSize: 11,
            color: stripHash(doc.tokens.colors.ink),
          });
        } else if (key === 'quote-pullout') {
          pSlide.addShape(pptx.ShapeType.roundRect, {
            x,
            y,
            w,
            h,
            fill: { color: stripHash(doc.tokens.colors.surface) },
            line: { color: stripHash(doc.tokens.colors.border), pt: 1 },
            rectRadius: 0.08,
          });
          pSlide.addText(`“${String(el.props.quote || '')}”`, {
            x: x + 0.24,
            y: y + 0.22,
            w: w - 0.48,
            h: Math.max(0.5, h - 0.8),
            fontFace: doc.tokens.typography.displayFont,
            fontSize: 16,
            bold: true,
            color: stripHash(doc.tokens.colors.ink),
          });
          pSlide.addText(`${String(el.props.author || '')}${el.props.role ? ` · ${String(el.props.role)}` : ''}`, {
            x: x + 0.24,
            y: y + h - 0.45,
            w: w - 0.48,
            h: 0.32,
            fontFace: doc.tokens.typography.bodyFont,
            fontSize: 10,
            color: accentHex,
          });
        } else {
          pSlide.addShape(pptx.ShapeType.roundRect, {
            x,
            y,
            w,
            h,
            fill: { color: stripHash(doc.tokens.colors.surface) },
            line: { color: stripHash(doc.tokens.colors.border), pt: 1 },
            rectRadius: 0.08,
          });
          const summaryLines = Object.entries(el.props)
            .filter(([k]) => k !== 'accentColor')
            .map(([k, v]) => (Array.isArray(v) ? `${k}:\n${v.join('\n')}` : `${k}: ${String(v)}`))
            .join('\n\n');
          pSlide.addText(summaryLines || el.name, {
            x: x + 0.18,
            y: y + 0.16,
            w: Math.max(0.4, w - 0.36),
            h: Math.max(0.4, h - 0.32),
            fontFace: doc.tokens.typography.bodyFont,
            fontSize: 12,
            color: stripHash(doc.tokens.colors.ink),
            valign: 'top',
          });
        }
      }
    }
  }

  const out = await pptx.write({ outputType: 'nodebuffer' });
  return Buffer.isBuffer(out) ? out : Buffer.from(out as ArrayBuffer);
}

export interface PptxImportReport {
  totalSlides: number;
  preservedTextElements: number;
  preservedImages: number;
  warnings: string[];
}

export async function importPptxBufferToDocument(
  buffer: Buffer,
  title: string
): Promise<{ document: PresentationDocument; report: PptxImportReport }> {
  const zip = await JSZip.loadAsync(buffer);
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const nb = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return na - nb;
    });

  const tokens = DESIGN_TOKEN_PRESETS[0];
  const { width, height } = dimensionsForAspectRatio('16:9');
  const slides: Slide[] = [];
  let preservedTextElements = 0;
  let preservedImages = 0;
  const warnings: string[] = [];

  // Extract media map
  const mediaDataMap = new Map<string, string>();
  for (const fname of Object.keys(zip.files)) {
    if (fname.startsWith('ppt/media/') && !zip.files[fname].dir) {
      const ext = fname.split('.').pop()?.toLowerCase() || 'png';
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'svg' ? 'image/svg+xml' : 'image/png';
      const b64 = await zip.files[fname].async('base64');
      mediaDataMap.set(fname.replace('ppt/', ''), `data:${mime};base64,${b64}`);
    }
  }

  if (slideFiles.length === 0) {
    warnings.push('No slide XML entries found in archive; created a fallback blank slide.');
  }

  for (let i = 0; i < slideFiles.length; i++) {
    const slideXml = await zip.files[slideFiles[i]].async('text');
    const elements: PresentationElement[] = [];

    // Parse text paragraphs inside <p:sp> blocks
    const spMatches = slideXml.match(/<p:sp>[\s\S]*?<\/p:sp>/g) || [];
    let yCursor = 72;

    spMatches.forEach((spXml, idx) => {
      const textRuns = [...spXml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g)].map((m) => m[1]);
      const joined = textRuns.join(' ').replace(/\s+/g, ' ').trim();
      if (!joined) return;

      // Try to read EMU coordinates (<a:off x="..." y="..."/> <a:ext cx="..." cy="..."/>)
      const offMatch = spXml.match(/<a:off\s+x="(\d+)"\s+y="(\d+)"/);
      const extMatch = spXml.match(/<a:ext\s+cx="(\d+)"\s+cy="(\d+)"/);
      const emuToPx = (emu: number) => Math.round((emu / 914400) * 96);

      const x = offMatch ? Math.min(width - 120, Math.max(24, emuToPx(parseInt(offMatch[1], 10)))) : 64;
      const y = offMatch ? Math.min(height - 60, Math.max(24, emuToPx(parseInt(offMatch[2], 10)))) : yCursor;
      const w = extMatch ? Math.max(180, Math.min(width - 80, emuToPx(parseInt(extMatch[1], 10)))) : 1080;
      const h = extMatch ? Math.max(48, Math.min(height - 80, emuToPx(parseInt(extMatch[2], 10)))) : 84;

      const isTitle = idx === 0 || joined.length < 65;
      elements.push({
        id: `imp-s${i + 1}-t${idx + 1}`,
        name: isTitle ? 'Imported Heading' : 'Imported Text',
        type: 'text',
        x,
        y,
        width: w,
        height: h,
        rotation: 0,
        zIndex: idx + 2,
        opacity: 1,
        visible: true,
        locked: false,
        content: joined,
        fontFamily: isTitle ? tokens.typography.displayFont : tokens.typography.bodyFont,
        fontSize: isTitle ? 34 : 18,
        fontWeight: isTitle ? 700 : 400,
        fontStyle: 'normal',
        lineHeight: 1.35,
        letterSpacing: 0,
        textAlign: 'left',
        color: tokens.colors.ink,
        borderRadius: 0,
        padding: 4,
        semanticRole: isTitle ? 'title' : 'body',
      });
      preservedTextElements++;
      yCursor = Math.min(height - 120, yCursor + 96);
    });

    // Check slide rels for embedded images
    const relPath = slideFiles[i].replace('ppt/slides/', 'ppt/slides/_rels/') + '.rels';
    if (zip.files[relPath]) {
      const relXml = await zip.files[relPath].async('text');
      const targetMatches = [...relXml.matchAll(/Target="\.\.\/(media\/[^"]+)"/g)];
      targetMatches.forEach((m, imgIdx) => {
        const dataUri = mediaDataMap.get(m[1]);
        if (dataUri) {
          elements.push({
            id: `imp-s${i + 1}-img${imgIdx + 1}`,
            name: `Imported Image ${imgIdx + 1}`,
            type: 'image',
            x: 740,
            y: 120 + imgIdx * 40,
            width: 440,
            height: 300,
            rotation: 0,
            zIndex: 1,
            opacity: 1,
            visible: true,
            locked: false,
            src: dataUri,
            alt: `Slide ${i + 1} image`,
            objectFit: 'contain',
            borderRadius: 6,
          });
          preservedImages++;
        }
      });
    }

    // Speaker notes if present
    let speakerNotes = '';
    const notesPath = `ppt/notesSlides/notesSlide${i + 1}.xml`;
    if (zip.files[notesPath]) {
      const nXml = await zip.files[notesPath].async('text');
      speakerNotes = [...nXml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g)].map((m) => m[1]).join(' ').trim();
    }

    slides.push({
      id: `imp-slide-${i + 1}`,
      order: i,
      layoutPattern: 'freeform',
      title: `Slide ${i + 1}`,
      background: { type: 'solid', color: tokens.colors.background },
      speakerNotes,
      transition: 'fade',
      elements,
    });
  }

  if (slides.length === 0) {
    slides.push({
      id: 'imp-slide-1',
      order: 0,
      layoutPattern: 'freeform',
      title: 'Imported Slide 1',
      background: { type: 'solid', color: tokens.colors.background },
      speakerNotes: '',
      transition: 'fade',
      elements: [],
    });
  }

  if (slideFiles.some((f) => f)) {
    warnings.push('Complex PowerPoint SmartArt, animations, or custom vector masks are normalized to editable text/image frames.');
  }

  const document: PresentationDocument = {
    id: `imp-${Date.now()}`,
    title: title.replace(/\.pptx$/i, '') || 'Imported Presentation',
    description: `Imported from PPTX (${slides.length} slides)`,
    category: 'Business',
    aspectRatio: '16:9',
    width,
    height,
    themeId: tokens.id,
    tokens,
    slides,
    sourceRefs: [],
    version: 1,
    updatedAt: new Date().toISOString(),
  };

  return {
    document,
    report: {
      totalSlides: slides.length,
      preservedTextElements,
      preservedImages,
      warnings,
    },
  };
}
