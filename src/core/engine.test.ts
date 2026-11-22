import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PresentationDocumentSchema,
  pxToInches,
  inchesToPx,
  dimensionsForAspectRatio,
} from './schema';
import { extractSemanticBlocks, tokenizeText } from './tokenizer';
import { composePresentationFromOutline } from './layout-engine';
import { contrastRatio, evaluatePresentationQuality, autoRepairDocument } from './quality-scorer';
import { DESIGN_TOKEN_PRESETS, getSeedTemplates } from './seed-data';
import { exportPresentationToPptxBuffer, importPptxBufferToDocument } from './pptx-adapter';
import { CRAYON_DOODLE_CATALOG, renderCrayonDoodleSvg } from './crayon-doodle-catalog';
import { renderStyledTextSvgString } from './text-effects';
import {
  PAGE_SIZE_PRESETS,
  PAGE_MARGIN_PRESETS,
  CHART_PRESETS,
  TABLE_PRESETS,
  buildChartElementFromPreset,
  buildTableElementFromPreset,
} from './data-presets';
import { useEditorStore } from '../state/useEditorStore';
import { TECH_HUD_CATALOG } from './tech-hud-catalog';
import { HERITAGE_VINTAGE_CATALOG } from './heritage-vintage-catalog';

test('coordinate conversions between internal px and PowerPoint inches are deterministic', () => {
  assert.equal(pxToInches(1280), 13.3333);
  assert.equal(pxToInches(720), 7.5);
  assert.equal(inchesToPx(7.5), 720);
  assert.deepEqual(dimensionsForAspectRatio('16:9'), { width: 1280, height: 720 });
  assert.deepEqual(dimensionsForAspectRatio('4:3'), { width: 1024, height: 768 });
  assert.deepEqual(dimensionsForAspectRatio('1:1'), { width: 960, height: 960 });
});

test('application tokenizer normalizes domain aliases and classifies semantic blocks', () => {
  const tokens = tokenizeText('Q3 ARR grew 42% vs baseline');
  assert.equal(tokens[0].label, 'TEMPORAL');
  assert.equal(tokens[1].normalized, 'annual recurring revenue');
  assert.equal(tokens[4].label, 'COMPARISON');

  const blocks = extractSemanticBlocks(
    'Executive Summary\n\nQ4 ARR reached $4.2M with 38% growth.\n\nStep 1: Audit sources. Step 2: Compose layout.'
  );
  assert.equal(blocks[0].role, 'title');
  assert.equal(blocks[1].role, 'statistic');
  assert.equal(blocks[2].role, 'process');
});

test('layout engine composes valid schema document without consecutive duplicate patterns', () => {
  const doc = composePresentationFromOutline('test-doc-1', {
    title: 'Quarterly Strategy',
    description: 'Unit test deck',
    category: 'Business',
    tokens: DESIGN_TOKEN_PRESETS[0],
    outline: [
      { id: 's1', order: 0, title: 'Opening Thesis', purpose: 'Context', layoutPattern: 'title-hero', keyPoints: ['Clear direction'], semanticType: 'title' },
      { id: 's2', order: 1, title: 'Market Growth', purpose: 'Numbers', layoutPattern: 'split-media', keyPoints: ['+45% YoY'], semanticType: 'data' },
      { id: 's3', order: 2, title: 'Repeated Pattern Check', purpose: 'Verify rhythm', layoutPattern: 'split-media', keyPoints: ['Point A', 'Point B'], semanticType: 'argument' },
    ],
  });

  const parsed = PresentationDocumentSchema.safeParse(doc);
  assert.equal(parsed.success, true);
  assert.notEqual(doc.slides[1].layoutPattern, doc.slides[2].layoutPattern);
});

test('quality scorer detects low contrast and overflow, and autoRepair fixes bounds & contrast', () => {
  assert.ok(contrastRatio('#191B1F', '#FFFFFF') > 15);
  assert.ok(contrastRatio('#CCCCCC', '#FFFFFF') < 2);

  const doc = composePresentationFromOutline('test-doc-2', {
    title: 'Quality Check',
    description: 'Check bounds',
    category: 'Reports',
    tokens: DESIGN_TOKEN_PRESETS[0],
    outline: [
      { id: 's1', order: 0, title: 'Slide One', purpose: 'Intro', layoutPattern: 'title-hero', keyPoints: ['Summary'], semanticType: 'title' },
    ],
  });

  // Inject deliberate defects
  doc.slides[0].elements.push({
    id: 'bad-el',
    name: 'Overflow Low Contrast',
    type: 'text',
    x: 1200,
    y: 680,
    width: 300,
    height: 100,
    rotation: 0,
    zIndex: 10,
    opacity: 1,
    visible: true,
    locked: false,
    content: 'Unreadable text',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: 400,
    fontStyle: 'normal',
    lineHeight: 1.3,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#F5F5F0',
    borderRadius: 0,
    padding: 4,
  });

  const preReport = evaluatePresentationQuality(doc);
  assert.ok(preReport.hardDefectCount >= 2);

  const repaired = autoRepairDocument(doc);
  const postReport = evaluatePresentationQuality(repaired);
  assert.equal(postReport.hardDefectCount, 0);
});

test('PPTX export creates valid archive and PPTX import reconstructs editable slides', async () => {
  const doc = composePresentationFromOutline('test-pptx-doc', {
    title: 'Export Roundtrip Deck',
    description: 'Verify editable PPTX output',
    category: 'Business',
    tokens: DESIGN_TOKEN_PRESETS[0],
    outline: [
      { id: 's1', order: 0, title: 'Roundtrip Cover', purpose: 'Notes for presenter', layoutPattern: 'title-hero', keyPoints: ['Editable text survives export'], semanticType: 'title' },
      { id: 's2', order: 1, title: 'Telemetry Chart', purpose: 'Second slide', layoutPattern: 'data-chart-split', keyPoints: ['Q1 through Q4 progression'], semanticType: 'data' },
    ],
  });

  const buffer = await exportPresentationToPptxBuffer(doc);
  assert.ok(buffer.byteLength > 2000);

  const imported = await importPptxBufferToDocument(buffer, 'roundtrip.pptx');
  assert.equal(imported.report.totalSlides, 2);
  assert.ok(imported.report.preservedTextElements >= 2);
  assert.ok(imported.document.slides[0].elements.some((el) => el.type === 'text' && el.content.includes('Roundtrip Cover')));
});

import JSZip from 'jszip';
import {
  CUTOUT_CATALOG,
  ICON_CATALOG,
  SHAPE_CATALOG,
  renderCutoutIllustrationSvg,
  renderIconSvgString,
  renderRetroOsDialogSvgString,
  renderShapeSvgString,
} from './svg-cutout-renderer';

test('all v3 seed templates pass schema validation, zero hard quality defects, and gradient PPTX export', async () => {
  const templates = getSeedTemplates();
  assert.equal(templates.length, 7);
  assert.deepEqual(
    templates.map((t) => t.category),
    ['Reports', 'Reports', 'Portfolio', 'PubMat', 'PubMat', 'Pitch decks', 'Business']
  );

  for (const tpl of templates) {
    const parsed = PresentationDocumentSchema.safeParse(tpl.document);
    assert.equal(parsed.success, true, `Schema failed for ${tpl.id}`);
    const quality = evaluatePresentationQuality(tpl.document);
    assert.equal(
      quality.hardDefectCount,
      0,
      `Hard defects in ${tpl.id}: ${JSON.stringify(quality.issues.filter((i) => i.severity === 'hard'))}`
    );

    const hasEffects = tpl.document.slides.some(
      (s) =>
        s.background.type === 'gradient' ||
        (s.background.pattern && s.background.pattern !== 'none') ||
        s.elements.some((e) => (e.animation && e.animation !== 'none') || (e.backdropBlur ?? 0) > 0)
    );
    assert.equal(hasEffects, true, `Expected visual effects in ${tpl.id}`);
  }

  // Verify PubMat 1:1 Birthday & Campaign decks plus both Report decks export cleanly
  const birthdayPubmat = templates.find((t) => t.id === 'tpl-pubmat-birthday')!;
  assert.equal(birthdayPubmat.document.width, 960);
  assert.equal(birthdayPubmat.document.height, 960);
  const coverEls = birthdayPubmat.document.slides[0].elements;
  assert.ok(coverEls.some((e) => e.type === 'image' && e.id === 'bday-s1-portrait'));
  assert.ok(coverEls.some((e) => e.type === 'custom' && e.componentKey === 'retro-tv-frame'));
  assert.ok(coverEls.some((e) => e.type === 'custom' && e.componentKey === 'birthday-flip-calendar'));
  assert.ok(coverEls.some((e) => e.type === 'text' && e.content === 'HAPPY'));
  assert.ok(coverEls.some((e) => e.type === 'text' && e.content === 'BIRTHDAY'));
  const birthdayPptx = await exportPresentationToPptxBuffer(birthdayPubmat.document);
  assert.ok(birthdayPptx.byteLength > 2000);
  const bdayZip = await JSZip.loadAsync(birthdayPptx);
  const bdayMedia = Object.keys(bdayZip.files).filter((k) => k.startsWith('ppt/media/'));
  assert.ok(bdayMedia.length >= 3, 'Expected embedded PNG media for birthday Y2K stickers/TV/calendar');

  const pubmat = templates.find((t) => t.id === 'tpl-pubmat-campaign')!;
  assert.equal(pubmat.document.width, 960);
  assert.equal(pubmat.document.height, 960);
  const pubmatPptx = await exportPresentationToPptxBuffer(pubmat.document);
  assert.ok(pubmatPptx.byteLength > 2000);

  const meridianReport = templates.find((t) => t.id === 'tpl-climate-report')!;
  assert.equal(meridianReport.document.slides.length, 5);
  const meridianPptx = await exportPresentationToPptxBuffer(meridianReport.document);
  assert.ok(meridianPptx.byteLength > 2000);

  const techReport = templates.find((t) => t.id === 'tpl-tech-report')!;
  assert.equal(techReport.document.slides.length, 4);
  const techPptx = await exportPresentationToPptxBuffer(techReport.document);
  assert.ok(techPptx.byteLength > 2000);
});

test('cutout, icon (50+), and extended shape catalogs render SVG and export to MS PowerPoint PPTX', async () => {
  assert.ok(CUTOUT_CATALOG.length >= 25, `Expected >=25 cutouts, got ${CUTOUT_CATALOG.length}`);
  assert.ok(ICON_CATALOG.length >= 50, `Expected >=50 icons, got ${ICON_CATALOG.length}`);
  assert.ok(SHAPE_CATALOG.length >= 14, `Expected >=14 shapes, got ${SHAPE_CATALOG.length}`);

  for (const item of CUTOUT_CATALOG) {
    const rendered = renderCutoutIllustrationSvg(item.kind, item.defaultProps, `test-${item.kind}`);
    assert.ok(rendered.svg.includes('<svg'), `Missing <svg for cutout ${item.kind}`);
  }

  for (const ic of ICON_CATALOG) {
    const iconSvg = renderIconSvgString(ic.id, '#7D1935');
    assert.ok(iconSvg.includes('<svg'), `Missing <svg for icon ${ic.id}`);
  }

  // 1x1 transparent PNG data URI for cutout image element verification
  const samplePngDataUri =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const doc = PresentationDocumentSchema.parse({
    id: 'test-cutout-pptx',
    title: 'Cutout & Vector PPTX Export',
    description: 'Verifies cutouts, icons, extended shapes, and cutout PNGs export into PPTX',
    category: 'PubMat' as const,
    aspectRatio: '1:1' as const,
    width: 960,
    height: 960,
    themeId: DESIGN_TOKEN_PRESETS[0].id,
    tokens: DESIGN_TOKEN_PRESETS[0],
    sourceRefs: [],
    version: 1,
    slides: [
      {
        id: 's1',
        order: 0,
        title: 'Cutout Showcase',
        layoutPattern: 'poster-collage' as const,
        background: {
          type: 'gradient' as const,
          color: '#EFF6FF',
          gradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          pattern: 'checkerboard' as const,
          patternColor: '#3B82F6',
          patternOpacity: 0.1,
        },
        elements: [
          {
            id: 'el-fish',
            name: 'Golden Koi',
            type: 'custom' as const,
            componentKey: 'cutout-illustration',
            props: CUTOUT_CATALOG.find((c) => c.kind === 'golden-fish')!.defaultProps,
            x: 80,
            y: 80,
            width: 240,
            height: 165,
            rotation: -6,
            zIndex: 2,
            opacity: 1,
            visible: true,
            locked: false,
            animation: 'float' as const,
          },
          {
            id: 'el-balloon',
            name: 'Balloon',
            type: 'custom' as const,
            componentKey: 'cutout-illustration',
            props: CUTOUT_CATALOG.find((c) => c.kind === 'balloon')!.defaultProps,
            x: 380,
            y: 60,
            width: 150,
            height: 220,
            rotation: 4,
            zIndex: 3,
            opacity: 1,
            visible: true,
            locked: false,
            animation: 'bounce' as const,
          },
          {
            id: 'el-trumpet',
            name: 'Trumpet',
            type: 'custom' as const,
            componentKey: 'cutout-illustration',
            props: CUTOUT_CATALOG.find((c) => c.kind === 'brass-trumpet')!.defaultProps,
            x: 560,
            y: 90,
            width: 240,
            height: 130,
            rotation: 0,
            zIndex: 4,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'el-like',
            name: 'Like Zone',
            type: 'custom' as const,
            componentKey: 'cutout-illustration',
            props: CUTOUT_CATALOG.find((c) => c.kind === 'like-zone-badge')!.defaultProps,
            x: 80,
            y: 320,
            width: 230,
            height: 110,
            rotation: -3,
            zIndex: 5,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'el-ig',
            name: 'Instagram',
            type: 'icon' as const,
            iconName: 'social-instagram',
            color: '#7D1935',
            strokeWidth: 2,
            x: 360,
            y: 340,
            width: 72,
            height: 72,
            rotation: 0,
            zIndex: 6,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'el-star',
            name: 'Star Shape',
            type: 'shape' as const,
            shapeKind: 'star' as const,
            fill: '#F59E0B',
            stroke: '#78350F',
            strokeWidth: 2,
            borderRadius: 0,
            x: 470,
            y: 340,
            width: 140,
            height: 140,
            rotation: 0,
            zIndex: 7,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'el-heart',
            name: 'Heart Shape',
            type: 'shape' as const,
            shapeKind: 'heart' as const,
            fill: '#EC4899',
            stroke: '#831843',
            strokeWidth: 2,
            borderRadius: 0,
            x: 640,
            y: 340,
            width: 140,
            height: 130,
            rotation: 0,
            zIndex: 8,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'el-bubble',
            name: 'Speech Bubble',
            type: 'shape' as const,
            shapeKind: 'speech-bubble' as const,
            fill: '#FFFFFF',
            stroke: '#1E293B',
            strokeWidth: 2,
            borderRadius: 12,
            x: 80,
            y: 500,
            width: 220,
            height: 140,
            rotation: 0,
            zIndex: 9,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'el-cutout-photo',
            name: 'Cutout Portrait',
            type: 'image' as const,
            src: samplePngDataUri,
            originalSrc: samplePngDataUri,
            cutoutMode: 'auto' as const,
            alt: 'Cutout sticker',
            fit: 'contain' as const,
            borderRadius: 12,
            x: 340,
            y: 520,
            width: 200,
            height: 200,
            rotation: 0,
            zIndex: 10,
            opacity: 1,
            visible: true,
            locked: false,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const parsed = PresentationDocumentSchema.safeParse(doc);
  assert.equal(parsed.success, true, 'Extended document schema validation failed');

  const shapeSvg = renderShapeSvgString(
    doc.slides[0].elements[5] as Parameters<typeof renderShapeSvgString>[0],
    'unit-star'
  );
  assert.ok(shapeSvg.includes('<polygon'));

  const buffer = await exportPresentationToPptxBuffer(doc);
  assert.ok(buffer.byteLength > 4000);

  const zip = await JSZip.loadAsync(buffer);
  const mediaFiles = Object.keys(zip.files).filter((k) => k.startsWith('ppt/media/'));
  // 1 background + 4 cutouts + 1 icon + 1 cutout image = 7 PNG assets (plus native shapes)
  assert.ok(mediaFiles.length >= 6, `Expected >=6 embedded ppt/media assets, got ${mediaFiles.length}`);
  const slideXml = await zip.file('ppt/slides/slide1.xml')?.async('string');
  assert.ok(slideXml && slideXml.length > 500, 'Expected populated slide1.xml in exported PPTX');
});

import {
  buildImageFilterCss,
  computeCropBoxLayout,
  DEFAULT_IMAGE_ADJUSTMENTS,
  extractFrameMediaAdjustments,
  IMAGE_FILTER_PRESETS,
  isPointInElement,
} from './crop-utils';

test('image crop layout, rotated TV frame hit testing, and slotted TV photo PPTX export work end to end', async () => {
  const layout = computeCropBoxLayout(400, 300, 1000, 500, 'cover', 25, 50, 1.5);
  assert.equal(layout.scaledH, 450);
  assert.equal(layout.scaledW, 900);
  assert.equal(layout.left, -125);
  assert.equal(layout.top, -75);

  assert.equal(isPointInElement(250, 250, { x: 100, y: 100, width: 300, height: 300, rotation: 45 }), true);
  assert.equal(isPointInElement(10, 10, { x: 100, y: 100, width: 300, height: 300, rotation: 0 }), false);

  const samplePngDataUri =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const doc = PresentationDocumentSchema.parse({
    id: 'test-tv-slot',
    title: 'Retro TV Slot Test',
    description: 'Verifies slotted TV screen media and image crop fields',
    category: 'PubMat' as const,
    aspectRatio: '1:1' as const,
    width: 960,
    height: 960,
    themeId: DESIGN_TOKEN_PRESETS[0].id,
    tokens: DESIGN_TOKEN_PRESETS[0],
    sourceRefs: [],
    version: 1,
    slides: [
      {
        id: 's1',
        order: 0,
        title: 'TV Slide',
        layoutPattern: 'poster-collage' as const,
        background: { type: 'solid' as const, color: '#F7F6F2' },
        elements: [
          {
            id: 'tv-1',
            name: 'Retro TV',
            type: 'custom' as const,
            componentKey: 'retro-tv-frame',
            props: {
              brandLabel: 'VELLUM-TV',
              mediaSrc: samplePngDataUri,
              mediaCropX: 40,
              mediaCropY: 60,
              mediaZoom: 1.4,
            },
            x: 120,
            y: 120,
            width: 520,
            height: 420,
            rotation: -8,
            zIndex: 2,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'img-1',
            name: 'Cropped Photo',
            type: 'image' as const,
            src: samplePngDataUri,
            alt: 'Cropped',
            objectFit: 'cover' as const,
            borderRadius: 12,
            cropX: 30,
            cropY: 70,
            cropZoom: 1.6,
            x: 680,
            y: 140,
            width: 200,
            height: 200,
            rotation: 12,
            zIndex: 3,
            opacity: 1,
            visible: true,
            locked: false,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const buffer = await exportPresentationToPptxBuffer(doc);
  const zip = await JSZip.loadAsync(buffer);
  const mediaFiles = Object.keys(zip.files).filter((k) => k.startsWith('ppt/media/'));
  assert.ok(mediaFiles.length >= 3, `Expected TV casing + TV screen photo + cropped photo (>=3 media), got ${mediaFiles.length}`);
});

import {
  buildFreedrawPathFromPoints,
  PHOTO_FRAME_CATALOG,
  renderPhotoFrameSvgString,
} from './frame-catalog';

test('30+ photo and empty shape frames render SVG placeholders and export to PPTX', async () => {
  assert.ok(PHOTO_FRAME_CATALOG.length >= 30, `Expected >=30 photo frames, got ${PHOTO_FRAME_CATALOG.length}`);

  for (const pf of PHOTO_FRAME_CATALOG) {
    const svg = renderPhotoFrameSvgString({ frameKind: pf.kind }, `test-pf-${pf.kind}`);
    assert.ok(svg.includes('<svg'), `Missing <svg for frame ${pf.kind}`);
    assert.ok(svg.includes('<clipPath'), `Missing <clipPath for frame ${pf.kind}`);
  }

  const samplePngDataUri =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const doc = PresentationDocumentSchema.parse({
    id: 'test-photo-frames',
    title: 'Photo Frames Export Test',
    description: 'Verifies empty and filled photo frames export into PPTX',
    category: 'PubMat' as const,
    aspectRatio: '1:1' as const,
    width: 960,
    height: 960,
    themeId: DESIGN_TOKEN_PRESETS[0].id,
    tokens: DESIGN_TOKEN_PRESETS[0],
    sourceRefs: [],
    version: 1,
    slides: [
      {
        id: 's1',
        order: 0,
        title: 'Frames Slide',
        layoutPattern: 'poster-collage' as const,
        background: { type: 'solid' as const, color: '#FFFFFF' },
        elements: [
          {
            id: 'pf-empty-arch',
            name: 'Archway Dome',
            type: 'custom' as const,
            componentKey: 'photo-frame',
            props: { frameKind: 'arch-dome' },
            x: 80,
            y: 120,
            width: 270,
            height: 330,
            rotation: 0,
            zIndex: 1,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'pf-filled-polaroid',
            name: 'Polaroid Print',
            type: 'custom' as const,
            componentKey: 'photo-frame',
            props: {
              frameKind: 'polaroid-classic',
              mediaSrc: samplePngDataUri,
            },
            x: 420,
            y: 120,
            width: 300,
            height: 345,
            rotation: -5,
            zIndex: 2,
            opacity: 1,
            visible: true,
            locked: false,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const buffer = await exportPresentationToPptxBuffer(doc);
  const zip = await JSZip.loadAsync(buffer);
  const mediaFiles = Object.keys(zip.files).filter((k) => k.startsWith('ppt/media/'));
  assert.ok(mediaFiles.length >= 2, `Expected >=2 rasterized frame assets in PPTX, got ${mediaFiles.length}`);
});

test('freedraw frames, XP camera/clouds/bubbles frames, and customizable retro OS dialogs render & export to PPTX', async () => {
  // Tiny stroke should be rejected
  assert.equal(
    buildFreedrawPathFromPoints([
      { x: 10, y: 10 },
      { x: 15, y: 12 },
      { x: 18, y: 18 },
    ]),
    null
  );

  const freedraw = buildFreedrawPathFromPoints([
    { x: 120, y: 100 },
    { x: 260, y: 90 },
    { x: 340, y: 170 },
    { x: 310, y: 290 },
    { x: 180, y: 310 },
    { x: 100, y: 220 },
  ]);
  assert.ok(freedraw, 'Expected valid freedraw frame geometry');
  assert.ok(freedraw!.clipPathD.startsWith('M ') && freedraw!.clipPathD.endsWith('Z'));
  assert.ok(freedraw!.width >= 200 && freedraw!.height >= 200);

  const freedrawSvg = renderPhotoFrameSvgString(
    {
      frameKind: 'custom-freedraw',
      customClipPathD: freedraw!.clipPathD,
      customViewBoxW: freedraw!.viewBoxW,
      customViewBoxH: freedraw!.viewBoxH,
    },
    'unit-freedraw'
  );
  assert.ok(freedrawSvg.includes('<clipPath') && freedrawSvg.includes(freedraw!.clipPathD));

  const requiredKinds = [
    'xp-webcam-frame',
    'old-digicam-frame',
    'cloud-cumulus',
    'cloud-thought',
    'bubble-speech',
    'bubble-soap-gloss',
    'bubble-cluster',
    'paint-splatter',
    'torn-paper',
    'brush-stroke',
    'crescent-moon',
  ];
  for (const kind of requiredKinds) {
    assert.ok(
      PHOTO_FRAME_CATALOG.some((f) => f.kind === kind),
      `Expected frame kind ${kind} in PHOTO_FRAME_CATALOG`
    );
  }

  const dialogSvg = renderRetroOsDialogSvgString(
    {
      osStyle: 'winxp-luna',
      dialogVariant: 'warning',
      title: 'CUSTOM XP ALERT',
      message: 'Low disk space on C:\\',
      primaryButton: 'Ignore',
      secondaryButton: 'Retry',
    },
    'unit-dlg',
    420,
    220
  );
  assert.ok(dialogSvg.includes('CUSTOM XP ALERT'));
  assert.ok(dialogSvg.includes('Ignore'));
  assert.ok(dialogSvg.includes('Retry'));

  const doc = PresentationDocumentSchema.parse({
    id: 'test-freedraw-retro-dialog',
    title: 'Freedraw & Retro UI Export',
    description: 'Verifies freedraw frame, XP webcam frame, cloud frame, and retro OS dialog export',
    category: 'PubMat' as const,
    aspectRatio: '1:1' as const,
    width: 960,
    height: 960,
    themeId: DESIGN_TOKEN_PRESETS[0].id,
    tokens: DESIGN_TOKEN_PRESETS[0],
    sourceRefs: [],
    version: 1,
    slides: [
      {
        id: 's1',
        order: 0,
        title: 'Retro Collage',
        layoutPattern: 'poster-collage' as const,
        background: { type: 'solid' as const, color: '#FFFFFF' },
        elements: [
          {
            id: 'el-freedraw',
            name: 'Freedraw Frame',
            type: 'custom' as const,
            componentKey: 'photo-frame',
            props: {
              frameKind: 'custom-freedraw',
              customClipPathD: freedraw!.clipPathD,
              customViewBoxW: freedraw!.viewBoxW,
              customViewBoxH: freedraw!.viewBoxH,
            },
            x: 80,
            y: 80,
            width: freedraw!.width,
            height: freedraw!.height,
            rotation: 0,
            zIndex: 1,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'el-xp-cam',
            name: 'Windows XP Camera',
            type: 'custom' as const,
            componentKey: 'photo-frame',
            props: { frameKind: 'xp-webcam-frame' },
            x: 420,
            y: 80,
            width: 360,
            height: 300,
            rotation: 0,
            zIndex: 2,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'el-cloud',
            name: 'Cumulus Cloud',
            type: 'custom' as const,
            componentKey: 'photo-frame',
            props: { frameKind: 'cloud-cumulus' },
            x: 80,
            y: 440,
            width: 320,
            height: 230,
            rotation: 0,
            zIndex: 3,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'el-dialog',
            name: 'System Error Modal',
            type: 'custom' as const,
            componentKey: 'retro-os-dialog',
            props: {
              osStyle: 'win98-classic',
              dialogVariant: 'error',
              title: 'SYSTEM ERROR',
              message: 'ERROR_NOT_ENOUGH_MEMORY',
              primaryButton: 'Fix',
              secondaryButton: 'Cancel',
            },
            x: 450,
            y: 450,
            width: 420,
            height: 220,
            rotation: 0,
            zIndex: 4,
            opacity: 1,
            visible: true,
            locked: false,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const buffer = await exportPresentationToPptxBuffer(doc);
  const zip = await JSZip.loadAsync(buffer);
  const mediaFiles = Object.keys(zip.files).filter((k) => k.startsWith('ppt/media/'));
  assert.ok(mediaFiles.length >= 4, `Expected >=4 rasterized assets in PPTX, got ${mediaFiles.length}`);
});

test('education cutouts (22) and education icons (10) customize labels/colors and export to PPTX', async () => {
  const eduCutoutKinds = [
    'edu-book',
    'edu-book-stack',
    'edu-open-book',
    'edu-medal',
    'edu-trophy-cup',
    'edu-coffee-cup',
    'edu-quill-ink',
    'edu-feather-pen',
    'edu-headphones',
    'edu-pen',
    'edu-pencil',
    'edu-ruler',
    'edu-calculator',
    'edu-grad-cap',
    'edu-diploma',
    'edu-globe',
    'edu-microscope',
    'edu-backpack',
    'edu-chalkboard',
    'edu-lightbulb',
    'edu-protractor',
    'edu-notebook',
  ];

  const eduCutouts = CUTOUT_CATALOG.filter((c) => c.category === 'Education');
  assert.equal(eduCutouts.length, 22);
  for (const kind of eduCutoutKinds) {
    const item = eduCutouts.find((c) => c.kind === kind);
    assert.ok(item, `Missing Education cutout ${kind}`);
    const rendered = renderCutoutIllustrationSvg(
      item!.kind,
      {
        ...item!.defaultProps,
        label: 'HONORS',
        primaryColor: '#1E3A8A',
      },
      `edu-test-${kind}`
    );
    assert.ok(rendered.svg.includes('<svg'), `Missing <svg for ${kind}`);
  }

  const eduBookSvg = renderCutoutIllustrationSvg(
    'edu-book',
    { ...CUTOUT_CATALOG.find((c) => c.kind === 'edu-book')!.defaultProps, label: 'BIOLOGY' },
    'edu-book-custom'
  );
  assert.ok(eduBookSvg.svg.includes('BIOLOGY'));

  const eduMedalSvg = renderCutoutIllustrationSvg(
    'edu-medal',
    { ...CUTOUT_CATALOG.find((c) => c.kind === 'edu-medal')!.defaultProps, label: 'GOLD' },
    'edu-medal-custom'
  );
  assert.ok(eduMedalSvg.svg.includes('GOLD'));

  const eduIcons = ICON_CATALOG.filter((ic) => ic.category === 'Education');
  assert.equal(eduIcons.length, 10);
  for (const ic of eduIcons) {
    assert.ok(ic.id.startsWith('edu-') && ic.id.endsWith('-icon'));
    const brandSvg = renderIconSvgString(ic.id, '#1D4ED8', 1.9, 'brand', `brand-${ic.id}`);
    assert.ok(brandSvg.includes('<svg'));
    const monoSvg = renderIconSvgString(ic.id, '#1D4ED8', 1.9, 'mono', `mono-${ic.id}`);
    assert.ok(monoSvg.includes('<svg') && monoSvg.includes('#1D4ED8'));
  }

  const exportKinds = [
    'edu-book',
    'edu-medal',
    'edu-quill-ink',
    'edu-feather-pen',
    'edu-coffee-cup',
    'edu-headphones',
    'edu-pen',
    'edu-ruler',
    'edu-calculator',
  ];

  const doc = PresentationDocumentSchema.parse({
    id: 'test-education-pptx',
    title: 'Education Elements Deck',
    description: 'Verifies Education cutouts and icons export into PPTX',
    category: 'Reports' as const,
    aspectRatio: '16:9' as const,
    width: 1280,
    height: 720,
    themeId: DESIGN_TOKEN_PRESETS[0].id,
    tokens: DESIGN_TOKEN_PRESETS[0],
    sourceRefs: [],
    version: 1,
    slides: [
      {
        id: 's1',
        order: 0,
        title: 'Study Kit',
        layoutPattern: 'poster-collage' as const,
        background: { type: 'solid' as const, color: '#FFFFFF' },
        elements: [
          ...exportKinds.map((kind, idx) => {
            const item = CUTOUT_CATALOG.find((c) => c.kind === kind)!;
            return {
              id: `el-${kind}`,
              name: item.name,
              type: 'custom' as const,
              componentKey: 'cutout-illustration',
              props: item.defaultProps,
              x: 40 + (idx % 5) * 240,
              y: idx < 5 ? 60 : 340,
              width: 180,
              height: 180,
              rotation: 0,
              zIndex: idx + 1,
              opacity: 1,
              visible: true,
              locked: false,
            };
          }),
          {
            id: 'el-edu-icon',
            name: 'Grad Cap Icon',
            type: 'icon' as const,
            iconName: 'edu-grad-cap-icon',
            color: '#7D1935',
            strokeWidth: 2,
            x: 1050,
            y: 520,
            width: 80,
            height: 80,
            rotation: 0,
            zIndex: 20,
            opacity: 1,
            visible: true,
            locked: false,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const buffer = await exportPresentationToPptxBuffer(doc);
  const zip = await JSZip.loadAsync(buffer);
  const mediaFiles = Object.keys(zip.files).filter((k) => k.startsWith('ppt/media/'));
  assert.ok(mediaFiles.length >= 10, `Expected >=10 rasterized education media files in PPTX, got ${mediaFiles.length}`);
});

test('stickman and cartoon character pose stickers (>20) and character icons customize and export to PPTX', async () => {
  const charCutouts = CUTOUT_CATALOG.filter((c) => c.category === 'Characters');
  assert.ok(charCutouts.length > 20, `Expected >20 character stickers, got ${charCutouts.length}`);
  assert.equal(charCutouts.length, 26);

  const stickmen = charCutouts.filter((c) => c.kind.startsWith('char-stick-'));
  const cartoons = charCutouts.filter((c) => c.kind.startsWith('char-toon-'));
  assert.equal(stickmen.length, 12);
  assert.equal(cartoons.length, 14);

  for (const item of charCutouts) {
    const rendered = renderCutoutIllustrationSvg(
      item.kind,
      {
        ...item.defaultProps,
        label: 'GO!',
        primaryColor: '#7D1935',
      },
      `char-test-${item.kind}`
    );
    assert.ok(rendered.svg.includes('<svg'), `Missing <svg for ${item.kind}`);
  }

  const signSticker = renderCutoutIllustrationSvg(
    'char-stick-sign',
    { ...CUTOUT_CATALOG.find((c) => c.kind === 'char-stick-sign')!.defaultProps, label: 'Q4 GOALS' },
    'char-sign-custom'
  );
  assert.ok(signSticker.svg.includes('Q4 GOALS'));

  const speechSticker = renderCutoutIllustrationSvg(
    'char-toon-speech',
    { ...CUTOUT_CATALOG.find((c) => c.kind === 'char-toon-speech')!.defaultProps, label: 'PRO TIP' },
    'char-speech-custom'
  );
  assert.ok(speechSticker.svg.includes('PRO TIP'));

  const charIcons = ICON_CATALOG.filter((ic) => ic.category === 'Characters');
  assert.equal(charIcons.length, 8);
  for (const ic of charIcons) {
    const brandSvg = renderIconSvgString(ic.id, '#2563EB', 1.9, 'brand', `brand-${ic.id}`);
    assert.ok(brandSvg.includes('<svg'));
    const monoSvg = renderIconSvgString(ic.id, '#2563EB', 1.9, 'mono', `mono-${ic.id}`);
    assert.ok(monoSvg.includes('<svg') && monoSvg.includes('#2563EB'));
  }

  const sampleStickers = [
    'char-stick-presenter',
    'char-stick-idea',
    'char-stick-thinking',
    'char-stick-cheering',
    'char-stick-team',
    'char-toon-wave',
    'char-toon-thumbsup',
    'char-toon-presenter',
    'char-toon-rocket',
    'char-toon-teamwork',
  ];

  const doc = PresentationDocumentSchema.parse({
    id: 'test-characters-pptx',
    title: 'Character Stickers Presentation',
    description: 'Verifies stickman & cartoon character pose stickers export to PPTX',
    category: 'Pitch decks' as const,
    aspectRatio: '16:9' as const,
    width: 1280,
    height: 720,
    themeId: DESIGN_TOKEN_PRESETS[0].id,
    tokens: DESIGN_TOKEN_PRESETS[0],
    sourceRefs: [],
    version: 1,
    slides: [
      {
        id: 's1',
        order: 0,
        title: 'Character Poses',
        layoutPattern: 'poster-collage' as const,
        background: { type: 'solid' as const, color: '#FFFFFF' },
        elements: [
          ...sampleStickers.map((kind, idx) => {
            const item = charCutouts.find((c) => c.kind === kind)!;
            return {
              id: `el-${kind}`,
              name: item.name,
              type: 'custom' as const,
              componentKey: 'cutout-illustration',
              props: item.defaultProps,
              x: 36 + (idx % 5) * 240,
              y: idx < 5 ? 48 : 360,
              width: 190,
              height: 190,
              rotation: 0,
              zIndex: idx + 1,
              opacity: 1,
              visible: true,
              locked: false,
            };
          }),
          {
            id: 'el-char-icon',
            name: 'Team Icon',
            type: 'icon' as const,
            iconName: 'char-team-icon',
            color: '#1E293B',
            strokeWidth: 2,
            x: 1140,
            y: 600,
            width: 72,
            height: 72,
            rotation: 0,
            zIndex: 20,
            opacity: 1,
            visible: true,
            locked: false,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const buffer = await exportPresentationToPptxBuffer(doc);
  const zip = await JSZip.loadAsync(buffer);
  const mediaFiles = Object.keys(zip.files).filter((k) => k.startsWith('ppt/media/'));
  assert.ok(mediaFiles.length >= 11, `Expected >=11 rasterized character assets in PPTX, got ${mediaFiles.length}`);
});

test('Icons & Social catalog uses authentic brand colors in brand mode and custom tint in mono mode', async () => {
  const socialIcons = ICON_CATALOG.filter((ic) => ic.category === 'Social Platforms');
  assert.equal(socialIcons.length, 20);
  assert.ok(ICON_CATALOG.length >= 76, `Expected >=76 total icons, got ${ICON_CATALOG.length}`);

  const brandHexChecks: Record<string, string> = {
    'social-instagram': '#FD5949',
    'social-tiktok': '#25F4EE',
    'social-youtube': '#FF0000',
    'social-discord': '#5865F2',
    'social-spotify': '#1DB954',
    'social-google': '#4285F4',
    'social-figma': '#F24E1E',
  };

  for (const [id, expectedHex] of Object.entries(brandHexChecks)) {
    const brandSvg = renderIconSvgString(id, '#000000', 1.9, 'brand', `test-${id}`);
    assert.ok(
      brandSvg.includes(expectedHex),
      `Expected brand hex ${expectedHex} in ${id} SVG`
    );
    const monoSvg = renderIconSvgString(id, '#7D1935', 1.9, 'mono', `mono-${id}`);
    assert.ok(monoSvg.includes('#7D1935'), `Expected custom tint #7D1935 in mono mode for ${id}`);
  }

  const doc = PresentationDocumentSchema.parse({
    id: 'test-brand-icons-pptx',
    title: 'Brand Social Icons Deck',
    description: 'Verifies brand-color icons validate and export cleanly',
    category: 'PubMat' as const,
    aspectRatio: '1:1' as const,
    width: 960,
    height: 960,
    themeId: DESIGN_TOKEN_PRESETS[0].id,
    tokens: DESIGN_TOKEN_PRESETS[0],
    sourceRefs: [],
    version: 1,
    slides: [
      {
        id: 's1',
        order: 0,
        title: 'Social Links',
        layoutPattern: 'poster-collage' as const,
        background: { type: 'solid' as const, color: '#FFFFFF' },
        elements: [
          {
            id: 'ic-ig',
            name: 'Instagram',
            type: 'icon' as const,
            iconName: 'social-instagram',
            color: '#E1306C',
            colorMode: 'brand' as const,
            strokeWidth: 1.9,
            x: 100,
            y: 120,
            width: 88,
            height: 88,
            rotation: 0,
            zIndex: 1,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'ic-yt',
            name: 'YouTube',
            type: 'icon' as const,
            iconName: 'social-youtube',
            color: '#7D1935',
            colorMode: 'mono' as const,
            strokeWidth: 1.9,
            x: 240,
            y: 120,
            width: 88,
            height: 88,
            rotation: 0,
            zIndex: 2,
            opacity: 1,
            visible: true,
            locked: false,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const buffer = await exportPresentationToPptxBuffer(doc);
  const zip = await JSZip.loadAsync(buffer);
  const mediaFiles = Object.keys(zip.files).filter((k) => k.startsWith('ppt/media/'));
  assert.ok(mediaFiles.length >= 2);
});

test('Headers & Lines, Borders & Edges, Backgrounds, and Christmas & New Year cutouts and frames render and export to PPTX', async () => {
  const headers = CUTOUT_CATALOG.filter((c) => c.category === 'Headers & Lines');
  const borders = CUTOUT_CATALOG.filter((c) => c.category === 'Borders & Edges');
  const backgrounds = CUTOUT_CATALOG.filter((c) => c.category === 'Backgrounds');
  const holiday = CUTOUT_CATALOG.filter((c) => c.category === 'Christmas & New Year');
  const holidayFrames = PHOTO_FRAME_CATALOG.filter((f) => f.category === 'Christmas & New Year');

  assert.equal(headers.length, 12);
  assert.equal(borders.length, 12);
  assert.ok(backgrounds.length >= 10, `Expected >=10 backgrounds, got ${backgrounds.length}`);
  assert.equal(holiday.length, 20);
  assert.equal(holidayFrames.length, 8);

  for (const item of [...headers, ...borders, ...backgrounds, ...holiday]) {
    const rendered = renderCutoutIllustrationSvg(item.kind, item.defaultProps, `ext-${item.kind}`);
    assert.ok(rendered.svg.includes('<svg'), `Missing <svg for ${item.kind}`);
  }

  for (const pf of holidayFrames) {
    const svg = renderPhotoFrameSvgString({ frameKind: pf.kind }, `hol-pf-${pf.kind}`);
    assert.ok(svg.includes('<svg') && svg.includes('<clipPath'), `Invalid holiday frame ${pf.kind}`);
  }

  const samplePngDataUri =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const doc = PresentationDocumentSchema.parse({
    id: 'test-holiday-design-pptx',
    title: 'Christmas & New Year Deck',
    description: 'Verifies Headers, Borders, Backgrounds, Holiday elements & frames export to PPTX',
    category: 'PubMat' as const,
    aspectRatio: '1:1' as const,
    width: 960,
    height: 960,
    themeId: DESIGN_TOKEN_PRESETS[0].id,
    tokens: DESIGN_TOKEN_PRESETS[0],
    sourceRefs: [],
    version: 1,
    slides: [
      {
        id: 's1',
        order: 0,
        title: 'Holiday Poster',
        layoutPattern: 'poster-collage' as const,
        background: { type: 'solid' as const, color: '#FFFFFF' },
        elements: [
          {
            id: 'bg-winter',
            name: backgrounds[7].name,
            type: 'custom' as const,
            componentKey: 'cutout-illustration',
            props: backgrounds[7].defaultProps,
            x: 0,
            y: 0,
            width: 960,
            height: 960,
            rotation: 0,
            zIndex: 0,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'border-holly',
            name: borders[10].name,
            type: 'custom' as const,
            componentKey: 'cutout-illustration',
            props: borders[10].defaultProps,
            x: 20,
            y: 20,
            width: 920,
            height: 920,
            rotation: 0,
            zIndex: 1,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'hdr-ribbon',
            name: headers[2].name,
            type: 'custom' as const,
            componentKey: 'cutout-illustration',
            props: { ...headers[2].defaultProps, label: 'MERRY & BRIGHT' },
            x: 240,
            y: 60,
            width: 480,
            height: 105,
            rotation: 0,
            zIndex: 2,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'xmas-tree',
            name: holiday[0].name,
            type: 'custom' as const,
            componentKey: 'cutout-illustration',
            props: holiday[0].defaultProps,
            x: 80,
            y: 420,
            width: 240,
            height: 290,
            rotation: 0,
            zIndex: 3,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: 'xmas-globe-frame',
            name: holidayFrames[0].name,
            type: 'custom' as const,
            componentKey: 'photo-frame',
            props: {
              frameKind: holidayFrames[0].kind,
              tintColor: '#B91C1C',
              accentColor: '#F59E0B',
              mediaSrc: samplePngDataUri,
            },
            x: 420,
            y: 360,
            width: 340,
            height: 360,
            rotation: 0,
            zIndex: 4,
            opacity: 1,
            visible: true,
            locked: false,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const buffer = await exportPresentationToPptxBuffer(doc);
  const zip = await JSZip.loadAsync(buffer);
  const mediaFiles = Object.keys(zip.files).filter((k) => k.startsWith('ppt/media/'));
  assert.ok(mediaFiles.length >= 5, `Expected >=5 holiday/design media files in PPTX, got ${mediaFiles.length}`);
});

test('Image color & tone adjustments validate in schema and build CSS filter strings', () => {
  assert.equal(buildImageFilterCss(DEFAULT_IMAGE_ADJUSTMENTS), undefined);
  assert.equal(buildImageFilterCss(undefined), undefined);

  const vivid = IMAGE_FILTER_PRESETS.find((p) => p.id === 'vivid')!;
  const css = buildImageFilterCss(vivid.values);
  assert.ok(css && css.includes('brightness(106%)') && css.includes('contrast(118%)') && css.includes('saturate(148%)'));

  const frameAdj = extractFrameMediaAdjustments({
    mediaBrightness: 120,
    mediaContrast: 110,
    mediaSaturation: 135,
    mediaHueRotate: 24,
    mediaBlur: 2,
    mediaGrayscale: 10,
    mediaSepia: 15,
  });
  const frameCss = buildImageFilterCss(frameAdj);
  assert.ok(
    frameCss &&
      frameCss.includes('brightness(120%)') &&
      frameCss.includes('hue-rotate(24deg)') &&
      frameCss.includes('blur(2px)')
  );

  const doc = PresentationDocumentSchema.parse({
    id: 'test-image-adj',
    title: 'Image Adjustments Doc',
    description: 'Validates optional image adjustment schema fields',
    category: 'Portfolio' as const,
    aspectRatio: '16:9' as const,
    width: 1280,
    height: 720,
    themeId: DESIGN_TOKEN_PRESETS[0].id,
    tokens: DESIGN_TOKEN_PRESETS[0],
    sourceRefs: [],
    version: 1,
    slides: [
      {
        id: 's1',
        order: 0,
        title: 'Filtered Image',
        layoutPattern: 'freeform' as const,
        background: { type: 'solid' as const, color: '#FFFFFF' },
        elements: [
          {
            id: 'img-1',
            name: 'Photo',
            type: 'image' as const,
            x: 100,
            y: 100,
            width: 400,
            height: 300,
            rotation: 0,
            zIndex: 1,
            opacity: 1,
            visible: true,
            locked: false,
            src: '/assets/sample.png',
            alt: 'Sample',
            objectFit: 'cover' as const,
            borderRadius: 12,
            brightness: 115,
            contrast: 125,
            saturation: 140,
            hueRotate: -12,
            blur: 1.5,
            grayscale: 0,
            sepia: 20,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const el = doc.slides[0].elements[0];
  assert.equal(el.type, 'image');
  if (el.type === 'image') {
    assert.equal(el.brightness, 115);
    assert.equal(el.contrast, 125);
    assert.equal(el.saturation, 140);
    assert.equal(el.hueRotate, -12);
    assert.equal(el.blur, 1.5);
    assert.equal(el.sepia, 20);
  }
});

test('crayon and ink doodle catalog exposes 10 assets that render valid SVG and export to PPTX', async () => {
  assert.equal(CRAYON_DOODLE_CATALOG.length, 10);
  for (const item of CRAYON_DOODLE_CATALOG) {
    assert.equal(item.category, 'Doodles & Crayon');
    const rendered = renderCrayonDoodleSvg(
      item.kind,
      item.defaultProps.primaryColor,
      item.defaultProps.secondaryColor,
      item.defaultProps.accentColor,
      item.defaultProps.outlineColor,
      `test-${item.kind}`
    );
    assert.ok(rendered && rendered.svg.includes('<svg') && rendered.viewBox.length > 0);
  }

  const doc = PresentationDocumentSchema.parse({
    id: 'test-crayon-pptx',
    title: 'Doodles & Crayon Export',
    description: 'Verifies crayon and ink doodles in PPTX',
    category: 'Creative',
    aspectRatio: '16:9',
    width: 1280,
    height: 720,
    tokens: DESIGN_TOKEN_PRESETS[0],
    slides: [
      {
        id: 's1',
        order: 0,
        layoutPattern: 'freeform',
        background: { type: 'solid', color: '#FFFFFF' },
        notes: '',
        transition: 'none',
        elements: CRAYON_DOODLE_CATALOG.slice(0, 3).map((item, idx) => ({
          id: `el-cr-${idx}`,
          name: item.name,
          type: 'custom' as const,
          componentKey: 'vector-cutout',
          x: 60 + idx * 300,
          y: 120,
          width: item.defaultWidth,
          height: item.defaultHeight,
          rotation: 0,
          zIndex: idx + 1,
          opacity: 1,
          visible: true,
          locked: false,
          props: { ...item.defaultProps },
        })),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const buf = await exportPresentationToPptxBuffer(doc);
  assert.ok(buf.byteLength > 2000);
});

test('sticker-outline and ransom-cutout text effects validate, render SVG, and export cleanly', async () => {
  const doc = PresentationDocumentSchema.parse({
    id: 'test-text-effects',
    title: 'Typography FX Deck',
    description: 'Sticker outline and ransom note styles',
    category: 'Creative',
    aspectRatio: '16:9',
    width: 1280,
    height: 720,
    tokens: DESIGN_TOKEN_PRESETS[0],
    slides: [
      {
        id: 's1',
        order: 0,
        layoutPattern: 'freeform',
        background: { type: 'solid', color: '#FFFFFF' },
        notes: '',
        transition: 'none',
        elements: [
          {
            id: 'txt-sticker',
            name: 'Executive Mayor',
            type: 'text',
            x: 80,
            y: 80,
            width: 560,
            height: 220,
            rotation: -6,
            zIndex: 1,
            opacity: 1,
            visible: true,
            locked: false,
            content: 'EXECUTIVE\nMAYOR',
            fontFamily: 'Anton',
            fontSize: 64,
            fontWeight: 900,
            fontStyle: 'normal',
            lineHeight: 0.96,
            letterSpacing: -0.02,
            textAlign: 'center',
            color: '#FFFFFF',
            textEffect: 'sticker-outline',
            outlineColor: '#1B365D',
            outlineWidth: 14,
            borderRadius: 0,
            padding: 8,
          },
          {
            id: 'txt-ransom',
            name: 'Jfinex Cutout',
            type: 'text',
            x: 120,
            y: 360,
            width: 480,
            height: 140,
            rotation: -4,
            zIndex: 2,
            opacity: 1,
            visible: true,
            locked: false,
            content: 'Jfinex',
            fontFamily: 'Fraunces',
            fontSize: 56,
            fontWeight: 900,
            fontStyle: 'normal',
            lineHeight: 1.1,
            letterSpacing: 0.04,
            textAlign: 'center',
            color: '#191B1F',
            textEffect: 'ransom-cutout',
            borderRadius: 0,
            padding: 8,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const stickerEl = doc.slides[0].elements[0];
  const ransomEl = doc.slides[0].elements[1];
  assert.equal(stickerEl.type, 'text');
  assert.equal(ransomEl.type, 'text');
  if (stickerEl.type === 'text' && ransomEl.type === 'text') {
    const stickerSvg = renderStyledTextSvgString(stickerEl);
    const ransomSvg = renderStyledTextSvgString(ransomEl);
    assert.ok(stickerSvg.includes('<svg') && stickerSvg.includes('EXECUTIVE'));
    assert.ok(ransomSvg.includes('<svg') && ransomSvg.includes('<polygon'));
    const emptyRansomSvg = renderStyledTextSvgString({ ...ransomEl, content: '' });
    assert.ok(!emptyRansomSvg.includes('<polygon'), 'Empty ransom text must not fall back to RANSOM tiles');
  }

  const buf = await exportPresentationToPptxBuffer(doc);
  assert.ok(buf.byteLength > 2000);
});

test('extended page aspect ratios, margins, 7 chart presets, and 5 table presets validate and export', async () => {
  assert.deepEqual(dimensionsForAspectRatio('9:16'), { width: 720, height: 1280 });
  assert.deepEqual(dimensionsForAspectRatio('a4'), { width: 794, height: 1123 });
  assert.deepEqual(dimensionsForAspectRatio('letter'), { width: 816, height: 1056 });
  assert.deepEqual(dimensionsForAspectRatio('a5'), { width: 559, height: 794 });
  assert.deepEqual(dimensionsForAspectRatio('book'), { width: 720, height: 1020 });
  assert.deepEqual(dimensionsForAspectRatio('custom'), { width: 1280, height: 720 });
  assert.equal(PAGE_SIZE_PRESETS.length, 8);
  assert.equal(PAGE_MARGIN_PRESETS.length, 4);
  assert.equal(CHART_PRESETS.length, 7);
  assert.equal(TABLE_PRESETS.length, 5);

  const tokens = DESIGN_TOKEN_PRESETS[0];
  const chartEls = CHART_PRESETS.map((p, idx) => buildChartElementFromPreset(p, 720, 1020, idx + 1, tokens));
  const tableEls = TABLE_PRESETS.map((p, idx) => buildTableElementFromPreset(p, 720, 1020, idx + 10, tokens));

  const doc = PresentationDocumentSchema.parse({
    id: 'test-book-data-presets',
    title: 'Book Flip & Data Presets',
    description: 'Tests book ratio, margins, 7 charts and 5 tables',
    category: 'Creative',
    aspectRatio: 'book',
    width: 720,
    height: 1020,
    pageMargin: 48,
    showMargins: true,
    tokens,
    slides: [
      {
        id: 's1',
        order: 0,
        layoutPattern: 'freeform',
        background: { type: 'solid', color: '#FFFFFF' },
        notes: '',
        transition: 'none',
        elements: [...chartEls, ...tableEls],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  assert.equal(doc.aspectRatio, 'book');
  assert.equal(doc.pageMargin, 48);
  assert.equal(doc.showMargins, true);

  const buf = await exportPresentationToPptxBuffer(doc);
  assert.ok(buf.byteLength > 4000);
});

test('useEditorStore supports selectAll, grouping, multi-duplicate, live batch, resize scaling, and page margins', () => {
  const baseDoc = composePresentationFromOutline('test-store-ops', {
    title: 'Store Operations',
    description: 'Multi-select and resize checks',
    category: 'Business',
    tokens: DESIGN_TOKEN_PRESETS[0],
    outline: [
      { id: 's1', order: 0, title: 'Cover', purpose: 'Test', layoutPattern: 'title-hero', keyPoints: ['Alpha', 'Beta'], semanticType: 'title' },
    ],
  });

  const store = useEditorStore.getState();
  store.loadDocument(baseDoc);

  // Select All
  useEditorStore.getState().selectAllOnActiveSlide();
  const initialSelected = useEditorStore.getState().selectedElementIds;
  assert.ok(initialSelected.length >= 2);

  // Group and auto-select siblings
  useEditorStore.getState().groupSelectedElements();
  const groupedSlide = useEditorStore.getState().document!.slides[0];
  const groupIds = new Set(groupedSlide.elements.filter((e) => initialSelected.includes(e.id)).map((e) => e.groupId));
  assert.equal(groupIds.size, 1);
  const assignedGroupId = Array.from(groupIds)[0];
  assert.ok(assignedGroupId && assignedGroupId.startsWith('grp-'));

  // Live batch update moves elements cleanly
  const beforeX = groupedSlide.elements[0].x;
  useEditorStore.getState().updateElementsLiveBatch(groupedSlide.id, {
    [initialSelected[0]]: { x: beforeX + 25 },
  });
  assert.equal(useEditorStore.getState().document!.slides[0].elements[0].x, beforeX + 25);

  // Multi-duplicate preserves group relationship on new group
  const preCount = useEditorStore.getState().document!.slides[0].elements.length;
  useEditorStore.getState().duplicateSelectedElement();
  const postDupSlide = useEditorStore.getState().document!.slides[0];
  assert.equal(postDupSlide.elements.length, preCount + initialSelected.length);

  // Selecting one member of a group and calling ungroup clears groupId across the whole group
  useEditorStore.getState().selectElements([initialSelected[0]]);
  useEditorStore.getState().ungroupSelectedElements();
  const afterUngroupIds = useEditorStore
    .getState()
    .document!.slides[0].elements.filter((e) => initialSelected.includes(e.id))
    .map((e) => e.groupId);
  assert.ok(afterUngroupIds.every((gid) => gid === undefined));

  // Page margin & proportional resize
  useEditorStore.getState().updatePageMargin(72, true);
  assert.equal(useEditorStore.getState().document!.pageMargin, 72);
  assert.equal(useEditorStore.getState().document!.showMargins, true);

  const firstElBeforeResize = useEditorStore.getState().document!.slides[0].elements[0];
  useEditorStore.getState().resizeDocument(640, 360, 'custom', true);
  const resizedDoc = useEditorStore.getState().document!;
  assert.equal(resizedDoc.width, 640);
  assert.equal(resizedDoc.height, 360);
  assert.equal(resizedDoc.aspectRatio, 'custom');
  assert.equal(resizedDoc.slides[0].elements[0].width, Math.max(20, Math.round(firstElBeforeResize.width * 0.5)));
});

test('TECH_HUD_CATALOG (32 assets), HERITAGE_VINTAGE_CATALOG (42 assets), and 8 new photo frames render SVGs and export to PPTX', async () => {
  const techHudElements = TECH_HUD_CATALOG.filter((d) => d.category === 'Tech & HUD');
  const techBgs = TECH_HUD_CATALOG.filter((d) => d.category === 'Backgrounds');
  assert.ok(techHudElements.length >= 20, `Expected >=20 Tech & HUD elements, got ${techHudElements.length}`);
  assert.ok(techBgs.length >= 10, `Expected >=10 Tech backgrounds, got ${techBgs.length}`);

  const vintageElements = HERITAGE_VINTAGE_CATALOG.filter((d) => d.category === 'Vintage & Flourishes');
  const historyElements = HERITAGE_VINTAGE_CATALOG.filter((d) => d.category === 'History & Culture');
  const heritageBgs = HERITAGE_VINTAGE_CATALOG.filter((d) => d.category === 'Backgrounds');
  assert.ok(vintageElements.length >= 15, `Expected >=15 Vintage & Flourishes elements, got ${vintageElements.length}`);
  assert.ok(historyElements.length >= 15, `Expected >=15 History & Culture elements, got ${historyElements.length}`);
  assert.ok(heritageBgs.length >= 8, `Expected >=8 Heritage/Map/Geometric backgrounds, got ${heritageBgs.length}`);

  for (const item of [...TECH_HUD_CATALOG, ...HERITAGE_VINTAGE_CATALOG]) {
    assert.ok(
      CUTOUT_CATALOG.some((c) => c.kind === item.kind),
      `Expected ${item.kind} to be registered in CUTOUT_CATALOG`
    );
    const rendered = renderCutoutIllustrationSvg(item.kind, item.defaultProps, `uid-${item.kind}`);
    assert.ok(rendered.svg.includes('<svg') && rendered.viewBox.length > 0, `Invalid SVG output for ${item.kind}`);
  }

  const newFrameKinds = [
    'hud-visor-frame',
    'hud-radar-scope-frame',
    'hud-hex-core-frame',
    'hud-holo-card-frame',
    'vintage-ornate-oval',
    'vintage-wax-stamp',
    'classical-arch-pillar',
    'islamic-mihrab-arch',
  ];
  for (const fk of newFrameKinds) {
    assert.ok(
      PHOTO_FRAME_CATALOG.some((f) => f.kind === fk),
      `Missing new photo frame ${fk}`
    );
    const frameSvg = renderPhotoFrameSvgString({ frameKind: fk }, `uid-${fk}`);
    assert.ok(frameSvg.includes('<svg') && frameSvg.includes('<clipPath'), `Invalid frame SVG for ${fk}`);
  }

  const tokens = DESIGN_TOKEN_PRESETS[0];
  const sampleItems = [
    TECH_HUD_CATALOG[0],
    techBgs[0],
    vintageElements[0],
    historyElements[0],
    heritageBgs[2],
  ];

  const doc = PresentationDocumentSchema.parse({
    id: 'test-tech-and-heritage',
    title: 'Tech & Heritage Export Check',
    description: 'Verifies Tech HUD, Vintage Flourishes, History, and Arabesque assets in PPTX export',
    category: 'Creative',
    aspectRatio: '16:9',
    width: 1280,
    height: 720,
    themeId: tokens.id,
    tokens,
    slides: [
      {
        id: 's1',
        order: 0,
        layoutPattern: 'freeform',
        background: { type: 'solid', color: '#040C1D' },
        notes: '',
        transition: 'none',
        elements: sampleItems.map((def, idx) => ({
          id: `el-${idx}`,
          name: def.name,
          type: 'custom' as const,
          componentKey: 'cutout-illustration',
          props: { ...def.defaultProps },
          x: 40 + idx * 140,
          y: 60 + idx * 30,
          width: Math.min(360, def.defaultWidth),
          height: Math.min(240, def.defaultHeight),
          rotation: 0,
          zIndex: idx + 1,
          opacity: 1,
          visible: true,
          locked: false,
        })),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const buffer = await exportPresentationToPptxBuffer(doc);
  const zip = await JSZip.loadAsync(buffer);
  const mediaFiles = Object.keys(zip.files).filter((k) => k.startsWith('ppt/media/'));
  assert.ok(mediaFiles.length >= sampleItems.length, `Expected >=${sampleItems.length} rasterized assets in PPTX, got ${mediaFiles.length}`);
});




