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

