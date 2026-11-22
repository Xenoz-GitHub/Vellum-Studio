import 'dotenv/config';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { desc, eq, and } from 'drizzle-orm';

import { db } from './src/db/index.ts';
import {
  users,
  presentations,
  presentationVersions,
  shareLinks,
  templates,
  customComponents,
  designTokenSets,
  fontAssets,
  uploadedAssets,
  generationJobs,
  userAchievements,
  userActivities,
  adminAuditLogs,
  aiConfigs,
  featureFlags,
} from './src/db/schema.ts';
import {
  ensureSeeded,
  listPresentationsForUser,
  getPresentationById,
  createPresentationRecord,
  savePresentationDocument,
  deletePresentationById,
  recordUserActivity,
  logAdminAudit,
  hashSharePassword,
} from './src/db/repository.ts';
import {
  requireAuthOrDemo,
  requireAdmin,
  type AuthRequest,
} from './src/middleware/auth.ts';
import {
  ALLOWED_MIME_TYPES,
  storeAndProcessUploadedFile,
} from './src/services/file-processor.ts';
import {
  generatePresentationOutlineWithAi,
  renderDocumentFromApprovedOutline,
} from './src/services/ai-service.ts';
import {
  PresentationDocumentSchema,
  SlideOutlineItemSchema,
  dimensionsForAspectRatio,
} from './src/core/schema.ts';
import { evaluatePresentationQuality, autoRepairDocument, contrastRatio } from './src/core/quality-scorer.ts';
import { exportPresentationToPptxBuffer } from './src/core/pptx-adapter.ts';
import { DESIGN_TOKEN_PRESETS } from './src/core/seed-data.ts';
import { z } from 'zod';

const PORT = 3000;
const app = express();
app.use(express.json({ limit: '15mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file MIME type: ${file.mimetype}`));
    }
  },
});

async function resolveLocalImageAsset(src: string): Promise<{ base64: string; mime: string } | null> {
  try {
    if (src.startsWith('/src/assets/')) {
      const target = path.resolve(process.cwd(), src.slice(1));
      const buf = await fs.readFile(target);
      const ext = path.extname(target).toLowerCase();
      return { base64: buf.toString('base64'), mime: ext === '.png' ? 'image/png' : 'image/jpeg' };
    }
    if (src.startsWith('/api/assets/file/')) {
      const safeName = path.basename(src);
      const target = path.resolve(process.cwd(), 'uploads', safeName);
      const buf = await fs.readFile(target);
      const ext = path.extname(target).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      return { base64: buf.toString('base64'), mime };
    }
  } catch {
    return null;
  }
  return null;
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'vellum-studio' });
});

// Public catalog endpoints
app.get('/api/catalog/templates', async (_req, res) => {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(templates)
      .where(eq(templates.status, 'published'))
      .orderBy(desc(templates.updatedAt));
    res.json(rows);
  } catch (error) {
    console.error('GET /api/catalog/templates error:', error);
    res.status(500).json({ error: 'Failed to load templates.' });
  }
});

app.get('/api/catalog/components', async (_req, res) => {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(customComponents)
      .where(eq(customComponents.enabled, true));
    res.json(rows);
  } catch (error) {
    console.error('GET /api/catalog/components error:', error);
    res.status(500).json({ error: 'Failed to load custom components.' });
  }
});

app.get('/api/catalog/tokens', async (_req, res) => {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(designTokenSets)
      .where(eq(designTokenSets.isPublished, true));
    res.json(rows);
  } catch (error) {
    console.error('GET /api/catalog/tokens error:', error);
    res.status(500).json({ error: 'Failed to load design tokens.' });
  }
});

app.get('/api/catalog/fonts', async (_req, res) => {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(fontAssets)
      .where(eq(fontAssets.enabled, true));
    res.json(rows);
  } catch (error) {
    console.error('GET /api/catalog/fonts error:', error);
    res.status(500).json({ error: 'Failed to load fonts.' });
  }
});

app.get('/api/assets/file/:filename', async (req, res) => {
  try {
    const safeName = path.basename(req.params.filename);
    const fullPath = path.resolve(process.cwd(), 'uploads', safeName);
    const data = await fs.readFile(fullPath);
    const ext = path.extname(safeName).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.otf': 'font/otf',
    };
    res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(data);
  } catch {
    res.status(404).json({ error: 'Asset not found.' });
  }
});

// Public Share Link routes
app.get('/api/share/:token', async (req, res) => {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(shareLinks)
      .where(eq(shareLinks.token, req.params.token))
      .limit(1);
    const link = rows[0];
    if (!link || link.revokedAt) {
      return res.status(404).json({ error: 'Share link not found or revoked.' });
    }
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'This share link has expired.' });
    }
    if (link.passwordHash) {
      return res.json({
        requiresPassword: true,
        permission: link.permission,
        token: link.token,
      });
    }

    const deck = await getPresentationById(link.presentationId);
    if (!deck) {
      return res.status(404).json({ error: 'Shared presentation not found.' });
    }

    await db
      .update(shareLinks)
      .set({ accessCount: link.accessCount + 1 })
      .where(eq(shareLinks.id, link.id));

    return res.json({
      requiresPassword: false,
      permission: link.permission,
      presentation: deck,
    });
  } catch (error) {
    console.error('GET /api/share/:token error:', error);
    res.status(500).json({ error: 'Failed to load shared presentation.' });
  }
});

app.post('/api/share/:token/verify', async (req, res) => {
  try {
    const password = String(req.body?.password || '');
    const rows = await db
      .select()
      .from(shareLinks)
      .where(eq(shareLinks.token, req.params.token))
      .limit(1);
    const link = rows[0];
    if (!link || link.revokedAt) {
      return res.status(404).json({ error: 'Share link unavailable.' });
    }
    if (link.passwordHash && hashSharePassword(password) !== link.passwordHash) {
      return res.status(403).json({ error: 'Incorrect password.' });
    }
    const deck = await getPresentationById(link.presentationId);
    if (!deck) {
      return res.status(404).json({ error: 'Presentation not found.' });
    }
    await db
      .update(shareLinks)
      .set({ accessCount: link.accessCount + 1 })
      .where(eq(shareLinks.id, link.id));
    return res.json({ permission: link.permission, presentation: deck });
  } catch (error) {
    console.error('POST /api/share/:token/verify error:', error);
    res.status(500).json({ error: 'Failed to verify share link.' });
  }
});

app.put('/api/share/:token/document', async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(shareLinks)
      .where(eq(shareLinks.token, req.params.token))
      .limit(1);
    const link = rows[0];
    if (!link || link.revokedAt || link.permission !== 'edit') {
      return res.status(403).json({ error: 'This share link does not grant edit permissions.' });
    }
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'Share link expired.' });
    }
    const parsedDoc = PresentationDocumentSchema.safeParse(req.body?.document);
    if (!parsedDoc.success) {
      return res.status(400).json({ error: 'Invalid presentation document format.' });
    }
    const updated = await savePresentationDocument({
      id: link.presentationId,
      actorUid: `shared:${link.token}`,
      document: parsedDoc.data,
      title: parsedDoc.data.title,
    });
    res.json(updated);
  } catch (error) {
    console.error('PUT /api/share/:token/document error:', error);
    res.status(500).json({ error: 'Failed to save shared edit.' });
  }
});

// User profile & gamification
app.get('/api/me', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const userRows = await db.select().from(users).where(eq(users.uid, req.authUser!.uid)).limit(1);
    const user = userRows[0];
    const achievements = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userUid, req.authUser!.uid))
      .orderBy(desc(userAchievements.earnedAt));
    const activities = await db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userUid, req.authUser!.uid))
      .orderBy(desc(userActivities.createdAt))
      .limit(20);
    const decks = await listPresentationsForUser(req.authUser!.uid);

    res.json({
      user,
      isDemo: req.authUser!.isDemo,
      achievements,
      activities,
      stats: {
        totalDecks: decks.length,
        favorites: decks.filter((d) => d.isFavorite).length,
        drafts: decks.filter((d) => d.isDraft).length,
      },
    });
  } catch (error) {
    console.error('GET /api/me error:', error);
    res.status(500).json({ error: 'Failed to load profile.' });
  }
});

app.patch('/api/me', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const { displayName, username, preferences, gamificationEnabled } = req.body || {};
    const updated = await db
      .update(users)
      .set({
        ...(displayName ? { displayName: String(displayName).slice(0, 60) } : {}),
        ...(username ? { username: String(username).replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 30) } : {}),
        ...(preferences && typeof preferences === 'object' ? { preferences } : {}),
        ...(typeof gamificationEnabled === 'boolean' ? { gamificationEnabled } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.uid, req.authUser!.uid))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    console.error('PATCH /api/me error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Presentations CRUD
app.get('/api/presentations', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const rows = await listPresentationsForUser(req.authUser!.uid);
    res.json(rows);
  } catch (error) {
    console.error('GET /api/presentations error:', error);
    res.status(500).json({ error: 'Failed to fetch presentations.' });
  }
});

app.post('/api/presentations', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const { title, description, category, templateId, themeId, document: customDoc, sourceType } = req.body || {};

    let docToUse;
    let thumb = '';

    if (templateId) {
      const tplRows = await db.select().from(templates).where(eq(templates.id, String(templateId))).limit(1);
      if (!tplRows[0]) {
        return res.status(404).json({ error: 'Template not found.' });
      }
      docToUse = structuredClone(tplRows[0].document) as any;
      docToUse.title = title || tplRows[0].name;
      thumb = tplRows[0].thumbnailUrl || '';
    } else if (customDoc) {
      const parsed = PresentationDocumentSchema.safeParse(customDoc);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid presentation document payload.' });
      }
      docToUse = parsed.data;
    } else {
      const tokens = DESIGN_TOKEN_PRESETS.find((t) => t.id === themeId) || DESIGN_TOKEN_PRESETS[0];
      const { width, height } = dimensionsForAspectRatio('16:9');
      const blankBg = '#FFFFFF';
      const blankInk = contrastRatio(tokens.colors.ink, blankBg) >= 4.5 ? tokens.colors.ink : '#191B1F';
      const blankMuted = contrastRatio(tokens.colors.muted, blankBg) >= 3.5 ? tokens.colors.muted : '#686D76';
      docToUse = {
        id: 'pending',
        title: title || 'Untitled Presentation',
        description: description || '',
        category: category || 'Business',
        aspectRatio: '16:9' as const,
        width,
        height,
        themeId: tokens.id,
        tokens,
        slides: [
          {
            id: 'slide-1',
            order: 0,
            layoutPattern: 'title-hero',
            title: title || 'Untitled Presentation',
            background: { type: 'solid' as const, color: blankBg },
            speakerNotes: '',
            transition: 'fade' as const,
            elements: [
              {
                id: 'el-kicker-1',
                name: 'Deck Index',
                type: 'text' as const,
                x: 56,
                y: 88,
                width: 420,
                height: 36,
                rotation: 0,
                zIndex: 1,
                opacity: 1,
                visible: true,
                locked: false,
                content: '01 · PRESENTATION BRIEF',
                fontFamily: tokens.typography.monoFont,
                fontSize: 13,
                fontWeight: 500,
                fontStyle: 'normal' as const,
                lineHeight: 1.3,
                letterSpacing: 0.08,
                textAlign: 'left' as const,
                color: tokens.colors.accent,
                borderRadius: 0,
                padding: 4,
                semanticRole: 'kicker' as const,
              },
              {
                id: 'el-title-1',
                name: 'Title',
                type: 'text' as const,
                x: 56,
                y: 138,
                width: 820,
                height: 150,
                rotation: 0,
                zIndex: 2,
                opacity: 1,
                visible: true,
                locked: false,
                content: title || 'Untitled Presentation',
                fontFamily: tokens.typography.displayFont,
                fontSize: 54,
                fontWeight: 700,
                fontStyle: 'normal' as const,
                lineHeight: 1.12,
                letterSpacing: -0.02,
                textAlign: 'left' as const,
                color: blankInk,
                borderRadius: 0,
                padding: 4,
                semanticRole: 'title' as const,
              },
              {
                id: 'el-sub-1',
                name: 'Subtitle',
                type: 'text' as const,
                x: 56,
                y: 300,
                width: 720,
                height: 80,
                rotation: 0,
                zIndex: 2,
                opacity: 1,
                visible: true,
                locked: false,
                content: description || 'Double-click any element to edit typography, geometry, or insert custom components.',
                fontFamily: tokens.typography.bodyFont,
                fontSize: 20,
                fontWeight: 400,
                fontStyle: 'normal' as const,
                lineHeight: 1.45,
                letterSpacing: 0,
                textAlign: 'left' as const,
                color: blankMuted,
                borderRadius: 0,
                padding: 4,
                semanticRole: 'subtitle' as const,
              },
            ],
          },
        ],
        sourceRefs: [],
        version: 1,
        updatedAt: new Date().toISOString(),
      };
    }

    const created = await createPresentationRecord({
      ownerUid: req.authUser!.uid,
      title: docToUse.title || title || 'Untitled Presentation',
      description: docToUse.description || description || '',
      category: docToUse.category || category || 'Business',
      themeId: docToUse.themeId,
      thumbnailUrl: thumb,
      sourceType: sourceType || (templateId ? 'template' : 'manual'),
      document: docToUse,
    });

    await recordUserActivity(
      req.authUser!.uid,
      'create_presentation',
      40,
      { presentationId: created.id },
      req.headers['x-client-date'] as string
    );

    res.status(201).json(created);
  } catch (error) {
    console.error('POST /api/presentations error:', error);
    res.status(500).json({ error: 'Failed to create presentation.' });
  }
});

app.get('/api/presentations/:id', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const deck = await getPresentationById(req.params.id);
    if (!deck || deck.ownerUid !== req.authUser!.uid) {
      return res.status(404).json({ error: 'Presentation not found.' });
    }
    const versions = await db
      .select()
      .from(presentationVersions)
      .where(eq(presentationVersions.presentationId, deck.id))
      .orderBy(desc(presentationVersions.versionNumber))
      .limit(20);
    const links = await db
      .select()
      .from(shareLinks)
      .where(eq(shareLinks.presentationId, deck.id))
      .orderBy(desc(shareLinks.createdAt));

    res.json({ presentation: deck, versions, shareLinks: links });
  } catch (error) {
    console.error('GET /api/presentations/:id error:', error);
    res.status(500).json({ error: 'Failed to load presentation.' });
  }
});

app.put('/api/presentations/:id', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const deck = await getPresentationById(req.params.id);
    if (!deck || deck.ownerUid !== req.authUser!.uid) {
      return res.status(404).json({ error: 'Presentation not found.' });
    }
    const { title, description, category, isFavorite, isDraft, document, createSnapshotLabel } = req.body || {};

    let validatedDoc;
    if (document) {
      const parsed = PresentationDocumentSchema.safeParse(document);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Document validation failed.', issues: parsed.error.issues });
      }
      validatedDoc = parsed.data;
    }

    const updated = await savePresentationDocument({
      id: deck.id,
      actorUid: req.authUser!.uid,
      title,
      description,
      category,
      isFavorite,
      isDraft,
      document: validatedDoc,
      createSnapshotLabel,
    });
    res.json(updated);
  } catch (error) {
    console.error('PUT /api/presentations/:id error:', error);
    res.status(500).json({ error: 'Failed to save presentation.' });
  }
});

app.post('/api/presentations/:id/restore/:versionId', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const deck = await getPresentationById(req.params.id);
    if (!deck || deck.ownerUid !== req.authUser!.uid) {
      return res.status(404).json({ error: 'Presentation not found.' });
    }
    const verRows = await db
      .select()
      .from(presentationVersions)
      .where(
        and(
          eq(presentationVersions.id, req.params.versionId),
          eq(presentationVersions.presentationId, deck.id)
        )
      )
      .limit(1);
    if (!verRows[0]) {
      return res.status(404).json({ error: 'Version snapshot not found.' });
    }
    const updated = await savePresentationDocument({
      id: deck.id,
      actorUid: req.authUser!.uid,
      document: verRows[0].document as any,
      createSnapshotLabel: `Restored v${verRows[0].versionNumber}`,
    });
    res.json(updated);
  } catch (error) {
    console.error('Restore version error:', error);
    res.status(500).json({ error: 'Failed to restore version.' });
  }
});

app.post('/api/presentations/:id/duplicate', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const deck = await getPresentationById(req.params.id);
    if (!deck || deck.ownerUid !== req.authUser!.uid) {
      return res.status(404).json({ error: 'Presentation not found.' });
    }
    const copyDoc = structuredClone(deck.document) as any;
    copyDoc.title = `${deck.title} (Copy)`;
    const created = await createPresentationRecord({
      ownerUid: req.authUser!.uid,
      title: copyDoc.title,
      description: deck.description,
      category: deck.category,
      themeId: deck.themeId,
      thumbnailUrl: deck.thumbnailUrl || '',
      sourceType: deck.sourceType,
      document: copyDoc,
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Duplicate error:', error);
    res.status(500).json({ error: 'Failed to duplicate presentation.' });
  }
});

app.delete('/api/presentations/:id', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    await deletePresentationById(req.params.id, req.authUser!.uid);
    res.json({ deleted: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete presentation.' });
  }
});

// Share links management
app.post('/api/presentations/:id/share', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const deck = await getPresentationById(req.params.id);
    if (!deck || deck.ownerUid !== req.authUser!.uid) {
      return res.status(404).json({ error: 'Presentation not found.' });
    }
    const permission = req.body?.permission === 'edit' ? 'edit' : 'view';
    const password = req.body?.password ? String(req.body.password) : '';
    const expiresInDays = Number(req.body?.expiresInDays || 0);

    const token = crypto.randomBytes(12).toString('base64url');
    const expiresAt = expiresInDays > 0 ? new Date(Date.now() + expiresInDays * 86400000) : null;

    const inserted = await db
      .insert(shareLinks)
      .values({
        id: `shr-${crypto.randomUUID().slice(0, 10)}`,
        token,
        presentationId: deck.id,
        createdByUid: req.authUser!.uid,
        permission,
        passwordHash: password ? hashSharePassword(password) : null,
        expiresAt,
      })
      .returning();

    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error('Share create error:', error);
    res.status(500).json({ error: 'Failed to create share link.' });
  }
});

app.delete('/api/share-links/:id', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    await db
      .update(shareLinks)
      .set({ revokedAt: new Date() })
      .where(and(eq(shareLinks.id, req.params.id), eq(shareLinks.createdByUid, req.authUser!.uid)));
    res.json({ revoked: true });
  } catch (error) {
    console.error('Share revoke error:', error);
    res.status(500).json({ error: 'Failed to revoke share link.' });
  }
});

// Export to real editable PPTX
app.post('/api/presentations/:id/export/pptx', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const deck = await getPresentationById(req.params.id);
    if (!deck || deck.ownerUid !== req.authUser!.uid) {
      return res.status(404).json({ error: 'Presentation not found.' });
    }
    const parsed = PresentationDocumentSchema.parse(req.body?.document || deck.document);
    const buffer = await exportPresentationToPptxBuffer(parsed, resolveLocalImageAsset);

    await recordUserActivity(
      req.authUser!.uid,
      'export_pptx',
      35,
      { presentationId: deck.id },
      req.headers['x-client-date'] as string
    );

    const safeTitle = parsed.title.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 48) || 'presentation';
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pptx"`);
    res.send(buffer);
  } catch (error) {
    console.error('PPTX export error:', error);
    res.status(500).json({ error: 'Failed to export PPTX file.' });
  }
});

// Quality evaluation & auto-repair
app.post('/api/presentations/:id/quality', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const parsed = PresentationDocumentSchema.safeParse(req.body?.document);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid document payload.' });
    }
    const repair = Boolean(req.body?.repair);
    const doc = repair ? autoRepairDocument(parsed.data) : parsed.data;
    const report = evaluatePresentationQuality(doc);
    res.json({ report, repairedDocument: repair ? doc : undefined });
  } catch (error) {
    console.error('Quality check error:', error);
    res.status(500).json({ error: 'Failed to evaluate presentation quality.' });
  }
});

// File upload & extraction (PDF, PPTX, DOCX, PNG/JPG/WebP/SVG, Fonts)
app.post('/api/uploads', requireAuthOrDemo, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided.' });
    }
    const processed = await storeAndProcessUploadedFile({
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer,
    });

    const inserted = await db
      .insert(uploadedAssets)
      .values({
        id: processed.id,
        ownerUid: req.authUser!.uid,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        storagePath: processed.storagePath,
        extractedText: processed.extractedText,
        analysisSummary: processed.importReport ? (processed.importReport as any) : {},
        kind: processed.kind,
      })
      .returning();

    res.status(201).json({
      asset: inserted[0],
      publicUrl: processed.publicUrl,
      importedDocument: processed.importedDocument,
      importReport: processed.importReport,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(400).json({ error: error.message || 'File upload failed.' });
  }
});

app.get('/api/uploads', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const rows = await db
      .select()
      .from(uploadedAssets)
      .where(eq(uploadedAssets.ownerUid, req.authUser!.uid))
      .orderBy(desc(uploadedAssets.createdAt))
      .limit(40);
    res.json(
      rows.map((r) => ({
        ...r,
        publicUrl: `/api/assets/file/${path.basename(r.storagePath)}`,
      }))
    );
  } catch (error) {
    console.error('GET /api/uploads error:', error);
    res.status(500).json({ error: 'Failed to fetch uploaded assets.' });
  }
});

app.delete('/api/uploads/:id', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const assetId = String(req.params.id);
    const rows = await db
      .select()
      .from(uploadedAssets)
      .where(and(eq(uploadedAssets.id, assetId), eq(uploadedAssets.ownerUid, req.authUser!.uid)))
      .limit(1);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Upload not found.' });
    }

    await db
      .delete(uploadedAssets)
      .where(and(eq(uploadedAssets.id, assetId), eq(uploadedAssets.ownerUid, req.authUser!.uid)));

    if (rows[0].storagePath) {
      await fs.unlink(rows[0].storagePath).catch(() => {});
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/uploads/:id error:', error);
    res.status(500).json({ error: 'Failed to delete uploaded asset.' });
  }
});

// Multi-stage AI Pipeline: Stage 1-4 Outline Synthesis
app.post('/api/ai/outline', requireAuthOrDemo, async (req: AuthRequest, res) => {
  const start = Date.now();
  const {
    prompt,
    slideCount = 6,
    category = 'Business',
    referenceMode = 'inspiration',
    referenceNotes = '',
    sourceAssetIds = [],
    referenceAssetIds = [],
  } = req.body || {};

  if (!prompt || String(prompt).trim().length < 3) {
    return res.status(400).json({ error: 'Please provide a presentation prompt or topic.' });
  }

  const jobId = `job-${crypto.randomUUID().slice(0, 12)}`;
  try {
    const allIds = [...new Set([...sourceAssetIds, ...referenceAssetIds].map(String))];
    const assetRows =
      allIds.length > 0
        ? await db
            .select()
            .from(uploadedAssets)
            .where(eq(uploadedAssets.ownerUid, req.authUser!.uid))
        : [];
    const byId = new Map(assetRows.map((a) => [a.id, a]));

    const sources = sourceAssetIds
      .map((id: string) => byId.get(id))
      .filter(Boolean)
      .map((a: any) => ({
        id: a.id,
        filename: a.filename,
        mimeType: a.mimeType,
        storagePath: a.storagePath,
        publicUrl: `/api/assets/file/${path.basename(a.storagePath)}`,
        kind: a.kind,
        extractedText: a.extractedText || '',
      }));

    const referenceImages = referenceAssetIds
      .map((id: string) => byId.get(id))
      .filter(Boolean)
      .map((a: any) => ({
        id: a.id,
        filename: a.filename,
        mimeType: a.mimeType,
        storagePath: a.storagePath,
        publicUrl: `/api/assets/file/${path.basename(a.storagePath)}`,
        kind: a.kind,
        extractedText: a.extractedText || '',
      }));

    const configRows = await db.select().from(aiConfigs).limit(1);
    const activeModel = configRows[0]?.modelName || 'gemini-4-hydrogen';

    const plan = await generatePresentationOutlineWithAi({
      prompt: String(prompt),
      slideCount: Math.min(14, Math.max(3, Number(slideCount) || 6)),
      category: String(category),
      referenceMode: String(referenceMode),
      referenceNotes: String(referenceNotes),
      sources,
      referenceImages,
      modelName: activeModel,
    });

    await db.insert(generationJobs).values({
      id: jobId,
      ownerUid: req.authUser!.uid,
      status: 'outlined',
      prompt: String(prompt),
      modelUsed: plan.modelUsed,
      promptVersion: configRows[0]?.promptVersion || 'v1.2',
      outline: plan as any,
      durationMs: Date.now() - start,
    });

    res.json({ jobId, plan });
  } catch (error: any) {
    console.error('AI outline error:', error);
    await db
      .insert(generationJobs)
      .values({
        id: jobId,
        ownerUid: req.authUser!.uid,
        status: 'failed',
        prompt: String(prompt),
        errorMessage: error.message || 'AI outline generation failed',
        durationMs: Date.now() - start,
      })
      .catch(() => {});

    res.status(502).json({
      error: error.message || 'AI outline generation failed. Verify GEMINI_API_KEY configuration.',
    });
  }
});

// Multi-stage AI Pipeline: Stage 5-8 Compose & Persist Editable Deck
app.post('/api/ai/compose', requireAuthOrDemo, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      jobId: z.string().optional(),
      title: z.string().min(1),
      description: z.string().default(''),
      category: z.string().default('Business'),
      themeId: z.string().default('warm-atelier'),
      outline: z.array(SlideOutlineItemSchema).min(1),
      imageAssets: z.array(z.string()).default([]),
      sourceRefs: z
        .array(z.object({ sourceId: z.string(), filename: z.string(), excerpt: z.string() }))
        .default([]),
      allowCustomComponents: z.boolean().default(true),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid outline composition payload.' });
    }

    const tokenRows = await db
      .select()
      .from(designTokenSets)
      .where(eq(designTokenSets.id, parsed.data.themeId))
      .limit(1);
    const tokens =
      (tokenRows[0]?.tokens as any) ||
      DESIGN_TOKEN_PRESETS.find((t) => t.id === parsed.data.themeId) ||
      DESIGN_TOKEN_PRESETS[0];

    const deckId = `deck-${crypto.randomUUID().slice(0, 12)}`;
    const { document, qualityReport } = await renderDocumentFromApprovedOutline({
      id: deckId,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      outline: parsed.data.outline,
      tokens,
      imageAssets: parsed.data.imageAssets,
      sourceRefs: parsed.data.sourceRefs,
      allowCustomComponents: parsed.data.allowCustomComponents,
    });

    const created = await createPresentationRecord({
      id: deckId,
      ownerUid: req.authUser!.uid,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      themeId: tokens.id,
      thumbnailUrl: parsed.data.imageAssets[0] || '',
      sourceType: 'ai',
      document,
    });

    if (parsed.data.jobId) {
      await db
        .update(generationJobs)
        .set({
          presentationId: created.id,
          status: 'completed',
          qualityReport: qualityReport as any,
        })
        .where(eq(generationJobs.id, parsed.data.jobId));
    }

    await recordUserActivity(
      req.authUser!.uid,
      'ai_generate',
      75,
      { presentationId: created.id, slideCount: document.slides.length },
      req.headers['x-client-date'] as string
    );

    res.status(201).json({ presentation: created, qualityReport });
  } catch (error) {
    console.error('AI compose error:', error);
    res.status(500).json({ error: 'Failed to compose presentation.' });
  }
});

app.post('/api/activity/track', requireAuthOrDemo, async (req: AuthRequest, res) => {
  const action = String(req.body?.action || 'edit_slide');
  const result = await recordUserActivity(
    req.authUser!.uid,
    action,
    15,
    req.body?.meta || {},
    req.headers['x-client-date'] as string
  );
  res.json({ ok: true, progress: result });
});

// =========================================================================
// RESTRICTED ADMIN PANEL ENDPOINTS (Server-side RBAC enforced)
// =========================================================================

app.get('/api/admin/overview', requireAuthOrDemo, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const [
      allTemplates,
      allComponents,
      allTokens,
      allFonts,
      allConfigs,
      allFlags,
      allUsers,
      recentJobs,
      auditLogs,
    ] = await Promise.all([
      db.select().from(templates).orderBy(desc(templates.updatedAt)),
      db.select().from(customComponents).orderBy(desc(customComponents.updatedAt)),
      db.select().from(designTokenSets).orderBy(desc(designTokenSets.updatedAt)),
      db.select().from(fontAssets),
      db.select().from(aiConfigs),
      db.select().from(featureFlags),
      db.select().from(users).orderBy(desc(users.createdAt)).limit(50),
      db.select().from(generationJobs).orderBy(desc(generationJobs.createdAt)).limit(30),
      db.select().from(adminAuditLogs).orderBy(desc(adminAuditLogs.createdAt)).limit(40),
    ]);

    res.json({
      templates: allTemplates,
      components: allComponents,
      tokens: allTokens,
      fonts: allFonts,
      aiConfigs: allConfigs,
      featureFlags: allFlags,
      users: allUsers,
      generationJobs: recentJobs,
      auditLogs,
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ error: 'Failed to load admin console.' });
  }
});

app.patch('/api/admin/templates/:id', requireAuthOrDemo, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, name, description, category, version } = req.body || {};
    const updated = await db
      .update(templates)
      .set({
        ...(status ? { status } : {}),
        ...(name ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(category ? { category } : {}),
        ...(version ? { version } : {}),
        updatedAt: new Date(),
      })
      .where(eq(templates.id, req.params.id))
      .returning();

    await logAdminAudit({
      actorUid: req.authUser!.uid,
      actorEmail: req.authUser!.email,
      action: 'update_template',
      targetType: 'template',
      targetId: req.params.id,
      details: { status, version },
    });

    res.json(updated[0]);
  } catch (error) {
    console.error('Admin template update error:', error);
    res.status(500).json({ error: 'Failed to update template.' });
  }
});

app.post('/api/admin/templates/from-presentation', requireAuthOrDemo, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { presentationId, category, name, description } = req.body || {};
    const deck = await getPresentationById(String(presentationId));
    if (!deck) {
      return res.status(404).json({ error: 'Source presentation not found.' });
    }
    const id = `tpl-${crypto.randomUUID().slice(0, 10)}`;
    const slug = `${(name || deck.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id.slice(-4)}`;
    const inserted = await db
      .insert(templates)
      .values({
        id,
        slug,
        name: name || deck.title,
        description: description || deck.description,
        category: category || deck.category,
        aspectRatio: deck.aspectRatio,
        themeId: deck.themeId,
        slideCount: ((deck.document as any)?.slides || []).length || 1,
        thumbnailUrl: deck.thumbnailUrl || '',
        authorName: req.authUser!.displayName,
        version: '1.0.0',
        status: 'published',
        document: deck.document,
      })
      .returning();

    await logAdminAudit({
      actorUid: req.authUser!.uid,
      actorEmail: req.authUser!.email,
      action: 'publish_template_from_deck',
      targetType: 'template',
      targetId: id,
      details: { sourcePresentationId: presentationId },
    });

    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Failed to publish template.' });
  }
});

app.post('/api/admin/components', requireAuthOrDemo, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { componentKey, name, description, category, version, propertySchema, defaultProps, availability } =
      req.body || {};
    if (!componentKey || !name) {
      return res.status(400).json({ error: 'componentKey and name are required.' });
    }
    const inserted = await db
      .insert(customComponents)
      .values({
        id: String(componentKey),
        componentKey: String(componentKey),
        name: String(name),
        description: String(description || ''),
        category: String(category || 'Custom'),
        version: String(version || '1.0.0'),
        propertySchema: Array.isArray(propertySchema) ? propertySchema : [],
        defaultProps: defaultProps || {},
        layoutConstraints: { minWidth: 260, minHeight: 140, defaultWidth: 420, defaultHeight: 220 },
        availability: availability || { manual: true, template: true, ai: true, categories: [] },
        enabled: true,
      })
      .returning();

    await logAdminAudit({
      actorUid: req.authUser!.uid,
      actorEmail: req.authUser!.email,
      action: 'register_component',
      targetType: 'custom_component',
      targetId: inserted[0].id,
      details: { version: inserted[0].version },
    });

    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error('Register component error:', error);
    res.status(500).json({ error: 'Failed to register custom component.' });
  }
});

app.patch('/api/admin/components/:id', requireAuthOrDemo, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { enabled, version, availability, defaultProps, name, description } = req.body || {};
    const updated = await db
      .update(customComponents)
      .set({
        ...(typeof enabled === 'boolean' ? { enabled } : {}),
        ...(version ? { version } : {}),
        ...(availability ? { availability } : {}),
        ...(defaultProps ? { defaultProps } : {}),
        ...(name ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        updatedAt: new Date(),
      })
      .where(eq(customComponents.id, req.params.id))
      .returning();

    await logAdminAudit({
      actorUid: req.authUser!.uid,
      actorEmail: req.authUser!.email,
      action: 'update_component',
      targetType: 'custom_component',
      targetId: req.params.id,
      details: { enabled, version },
    });

    res.json(updated[0]);
  } catch (error) {
    console.error('Update component error:', error);
    res.status(500).json({ error: 'Failed to update component.' });
  }
});

app.post('/api/admin/tokens', requireAuthOrDemo, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id, name, description, category, tokens } = req.body || {};
    if (!id || !name || !tokens) {
      return res.status(400).json({ error: 'id, name, and tokens are required.' });
    }
    const inserted = await db
      .insert(designTokenSets)
      .values({
        id: String(id),
        slug: String(id),
        name: String(name),
        description: String(description || ''),
        category: String(category || 'Custom'),
        version: '1.0.0',
        tokens,
        isPublished: true,
      })
      .onConflictDoUpdate({
        target: designTokenSets.id,
        set: { name: String(name), tokens, updatedAt: new Date() },
      })
      .returning();

    await logAdminAudit({
      actorUid: req.authUser!.uid,
      actorEmail: req.authUser!.email,
      action: 'upsert_design_tokens',
      targetType: 'design_token_set',
      targetId: String(id),
    });

    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error('Token upsert error:', error);
    res.status(500).json({ error: 'Failed to save design token set.' });
  }
});

app.post('/api/admin/fonts', requireAuthOrDemo, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { family, displayName, role, licenseNote, fileUrl } = req.body || {};
    if (!family || !displayName) {
      return res.status(400).json({ error: 'family and displayName are required.' });
    }
    const id = `font-${family.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const inserted = await db
      .insert(fontAssets)
      .values({
        id,
        family: String(family),
        displayName: String(displayName),
        role: String(role || 'display'),
        sourceType: fileUrl ? 'uploaded' : 'google',
        fileUrl: String(fileUrl || ''),
        licenseNote: String(licenseNote || 'Licensed upload'),
        enabled: true,
      })
      .returning();

    await logAdminAudit({
      actorUid: req.authUser!.uid,
      actorEmail: req.authUser!.email,
      action: 'register_font',
      targetType: 'font_asset',
      targetId: id,
    });

    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error('Font register error:', error);
    res.status(500).json({ error: 'Failed to register font.' });
  }
});

app.patch('/api/admin/ai-config', requireAuthOrDemo, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { modelName, promptVersion, systemPrompt, settings } = req.body || {};
    const updated = await db
      .update(aiConfigs)
      .set({
        ...(modelName ? { modelName } : {}),
        ...(promptVersion ? { promptVersion } : {}),
        ...(systemPrompt ? { systemPrompt } : {}),
        ...(settings ? { settings } : {}),
        updatedAt: new Date(),
      })
      .where(eq(aiConfigs.configKey, 'default-generation'))
      .returning();

    await logAdminAudit({
      actorUid: req.authUser!.uid,
      actorEmail: req.authUser!.email,
      action: 'update_ai_config',
      targetType: 'ai_config',
      targetId: 'default-generation',
      details: { modelName, promptVersion },
    });

    res.json(updated[0]);
  } catch (error) {
    console.error('AI config update error:', error);
    res.status(500).json({ error: 'Failed to update AI configuration.' });
  }
});

app.patch('/api/admin/feature-flags/:key', requireAuthOrDemo, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const enabled = Boolean(req.body?.enabled);
    const updated = await db
      .update(featureFlags)
      .set({ enabled, updatedAt: new Date() })
      .where(eq(featureFlags.flagKey, req.params.key))
      .returning();

    await logAdminAudit({
      actorUid: req.authUser!.uid,
      actorEmail: req.authUser!.email,
      action: 'toggle_feature_flag',
      targetType: 'feature_flag',
      targetId: req.params.key,
      details: { enabled },
    });

    res.json(updated[0]);
  } catch (error) {
    console.error('Feature flag error:', error);
    res.status(500).json({ error: 'Failed to update feature flag.' });
  }
});

app.patch('/api/admin/users/:uid', requireAuthOrDemo, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { role, status } = req.body || {};
    const updated = await db
      .update(users)
      .set({
        ...(role === 'admin' || role === 'user' ? { role } : {}),
        ...(status === 'active' || status === 'suspended' ? { status } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.uid, req.params.uid))
      .returning();

    await logAdminAudit({
      actorUid: req.authUser!.uid,
      actorEmail: req.authUser!.email,
      action: 'update_user_access',
      targetType: 'user',
      targetId: req.params.uid,
      details: { role, status },
    });

    res.json(updated[0]);
  } catch (error) {
    console.error('User role update error:', error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// Mount Vite in dev or serve dist/ in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vellum Studio server listening on http://localhost:${PORT}`);
  });
}

startServer();
