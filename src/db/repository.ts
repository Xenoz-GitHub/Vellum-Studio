import crypto from 'node:crypto';
import { desc, eq, and, sql } from 'drizzle-orm';
import { db } from './index.ts';
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
} from './schema.ts';
import {
  ACHIEVEMENT_CATALOG,
  DEFAULT_FONT_ASSETS,
  DESIGN_TOKEN_PRESETS,
  getSeedDemoPresentations,
  getSeedTemplates,
} from '../core/seed-data.ts';
import { BUILTIN_CUSTOM_COMPONENTS } from '../core/component-registry.ts';
import type { PresentationDocument } from '../core/schema.ts';

let seedPromise: Promise<void> | null = null;

export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runIdempotentSeed().catch((err) => {
      seedPromise = null;
      console.error('Seed error:', err);
    });
  }
  return seedPromise;
}

async function runIdempotentSeed(): Promise<void> {
  for (const tokenSet of DESIGN_TOKEN_PRESETS) {
    await db
      .insert(designTokenSets)
      .values({
        id: tokenSet.id,
        slug: tokenSet.id,
        name: tokenSet.name,
        description: `${tokenSet.name} editorial token collection`,
        category: 'Editorial',
        version: '2.0.0',
        tokens: tokenSet as unknown as Record<string, unknown>,
        isDefault: tokenSet.id === 'warm-atelier',
        isPublished: true,
      })
      .onConflictDoUpdate({
        target: designTokenSets.id,
        set: {
          name: tokenSet.name,
          description: `${tokenSet.name} editorial token collection`,
          version: '2.0.0',
          tokens: tokenSet as unknown as Record<string, unknown>,
          isPublished: true,
          updatedAt: new Date(),
        },
      });
  }

  for (const font of DEFAULT_FONT_ASSETS) {
    await db
      .insert(fontAssets)
      .values({
        id: font.id,
        family: font.family,
        displayName: font.displayName,
        role: font.role,
        sourceType: font.sourceType,
        weights: font.weights,
        licenseNote: font.licenseNote,
        enabled: true,
      })
      .onConflictDoUpdate({
        target: fontAssets.id,
        set: {
          family: font.family,
          displayName: font.displayName,
          role: font.role,
          weights: font.weights,
          enabled: true,
        },
      });
  }

  for (const comp of BUILTIN_CUSTOM_COMPONENTS) {
    await db
      .insert(customComponents)
      .values({
        id: comp.componentKey,
        componentKey: comp.componentKey,
        name: comp.name,
        description: comp.description,
        category: comp.category,
        version: comp.version,
        propertySchema: comp.propertySchema as unknown as Record<string, unknown>[],
        defaultProps: comp.defaultProps,
        layoutConstraints: {
          minWidth: comp.minWidth,
          minHeight: comp.minHeight,
          defaultWidth: comp.defaultWidth,
          defaultHeight: comp.defaultHeight,
        },
        availability: comp.availability,
        enabled: comp.enabled,
      })
      .onConflictDoUpdate({
        target: customComponents.id,
        set: {
          name: comp.name,
          description: comp.description,
          category: comp.category,
          version: comp.version,
          propertySchema: comp.propertySchema as unknown as Record<string, unknown>[],
          defaultProps: comp.defaultProps,
          layoutConstraints: {
            minWidth: comp.minWidth,
            minHeight: comp.minHeight,
            defaultWidth: comp.defaultWidth,
            defaultHeight: comp.defaultHeight,
          },
          updatedAt: new Date(),
        },
      });
  }

  for (const tpl of getSeedTemplates()) {
    await db
      .insert(templates)
      .values({
        id: tpl.id,
        slug: tpl.slug,
        name: tpl.name,
        description: tpl.description,
        category: tpl.category,
        aspectRatio: tpl.aspectRatio,
        themeId: tpl.themeId,
        slideCount: tpl.document.slides.length,
        thumbnailUrl: tpl.thumbnailUrl,
        authorName: tpl.authorName,
        version: tpl.version,
        status: 'published',
        document: tpl.document as unknown as Record<string, unknown>,
      })
      .onConflictDoUpdate({
        target: templates.id,
        set: {
          slug: tpl.slug,
          name: tpl.name,
          description: tpl.description,
          category: tpl.category,
          aspectRatio: tpl.aspectRatio,
          themeId: tpl.themeId,
          slideCount: tpl.document.slides.length,
          thumbnailUrl: tpl.thumbnailUrl,
          authorName: tpl.authorName,
          version: tpl.version,
          status: 'published',
          document: tpl.document as unknown as Record<string, unknown>,
          updatedAt: new Date(),
        },
      });
  }

  await db
    .insert(aiConfigs)
    .values({
      configKey: 'default-generation',
      modelName: 'gemini-4-hydrogen',
      promptVersion: 'v1.2',
      systemPrompt:
        'Act as an editorial presentation art director. Structure source material into crisp, non-repetitive slides with traceable evidence and never fabricate statistics.',
      settings: {
        allowReferenceExtraction: true,
        autoQualityRepair: true,
        maxSlidesPerDeck: 16,
      },
    })
    .onConflictDoNothing();

  const defaultFlags = [
    { flagKey: 'ai_generation', enabled: true, description: 'Enable multimodal AI presentation synthesis' },
    { flagKey: 'pptx_export', enabled: true, description: 'Enable editable PowerPoint (.pptx) export' },
    { flagKey: 'custom_components', enabled: true, description: 'Allow registered custom components in editor & AI' },
    { flagKey: 'gamification', enabled: true, description: 'Enable optional streaks, XP, and achievements' },
  ];
  for (const flag of defaultFlags) {
    await db.insert(featureFlags).values(flag).onConflictDoNothing();
  }

  // Ensure demo user + demo decks exist
  const demoUid = 'demo-workspace-user';
  await db
    .insert(users)
    .values({
      uid: demoUid,
      email: 'studio-demo@vellum.local',
      displayName: 'Studio Demo',
      username: 'studio_demo',
      avatarUrl: '/src/assets/images/avatar_creative_director_1795323621597.jpg',
      role: 'user',
      status: 'active',
      xp: 240,
      currentStreak: 3,
      longestStreak: 5,
      lastActiveDate: new Date().toISOString().slice(0, 10),
    })
    .onConflictDoNothing();

  for (const demoDeck of getSeedDemoPresentations(demoUid)) {
    await db
      .insert(presentations)
      .values({
        id: demoDeck.id,
        ownerUid: demoDeck.ownerUid,
        title: demoDeck.title,
        description: demoDeck.description,
        category: demoDeck.category,
        aspectRatio: demoDeck.document.aspectRatio,
        width: demoDeck.document.width,
        height: demoDeck.document.height,
        themeId: demoDeck.themeId,
        document: demoDeck.document as unknown as Record<string, unknown>,
        thumbnailUrl: demoDeck.thumbnailUrl,
        isFavorite: demoDeck.isFavorite,
        isDraft: demoDeck.isDraft,
        isDemo: true,
        sourceType: demoDeck.sourceType,
        version: 2,
      })
      .onConflictDoUpdate({
        target: presentations.id,
        set: {
          title: demoDeck.title,
          description: demoDeck.description,
          category: demoDeck.category,
          aspectRatio: demoDeck.document.aspectRatio,
          width: demoDeck.document.width,
          height: demoDeck.document.height,
          themeId: demoDeck.themeId,
          document: demoDeck.document as unknown as Record<string, unknown>,
          thumbnailUrl: demoDeck.thumbnailUrl,
          updatedAt: new Date(),
        },
      });
  }
}

export async function getDbUserByUid(uid: string) {
  try {
    const rows = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error('getDbUserByUid failed:', error);
    throw new Error('Failed to load user profile.', { cause: error });
  }
}

export async function getOrCreateDbUser(params: {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  forceRole?: 'user' | 'admin';
}) {
  try {
    await ensureSeeded();
    const existing = await getDbUserByUid(params.uid);
    if (existing) {
      return existing;
    }

    let role: 'user' | 'admin' = params.forceRole || 'user';
    if (!params.forceRole && params.uid !== 'demo-workspace-user') {
      const adminList = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      if (adminList.includes(params.email.toLowerCase())) {
        role = 'admin';
      } else {
        const [{ count }] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(users)
          .where(eq(users.role, 'admin'));
        if (count === 0) {
          role = 'admin';
        }
      }
    }

    const baseUsername = params.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20) || 'creator';
    const inserted = await db
      .insert(users)
      .values({
        uid: params.uid,
        email: params.email,
        displayName: params.displayName,
        username: baseUsername,
        avatarUrl: params.avatarUrl || '/src/assets/images/avatar_creative_director_1795323621597.jpg',
        role,
        status: 'active',
        preferences: { themeMode: 'light', defaultTokenSet: 'warm-atelier' },
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: { email: params.email, updatedAt: new Date() },
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('getOrCreateDbUser failed:', error);
    throw new Error('Failed to synchronize user record.', { cause: error });
  }
}

export async function recordUserActivity(
  userUid: string,
  action: string,
  xpEarned: number,
  meta: Record<string, unknown> = {},
  clientDateStr?: string
) {
  try {
    const user = await getDbUserByUid(userUid);
    if (!user || !user.gamificationEnabled) return null;

    const today = clientDateStr && /^\d{4}-\d{2}-\d{2}$/.test(clientDateStr)
      ? clientDateStr
      : new Date().toISOString().slice(0, 10);

    let newStreak = user.currentStreak;
    if (!user.lastActiveDate) {
      newStreak = 1;
    } else if (user.lastActiveDate !== today) {
      const prev = new Date(`${user.lastActiveDate}T00:00:00Z`).getTime();
      const curr = new Date(`${today}T00:00:00Z`).getTime();
      const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      newStreak = diffDays === 1 ? user.currentStreak + 1 : 1;
    }

    const longestStreak = Math.max(user.longestStreak, newStreak);
    const newXp = user.xp + xpEarned;

    await db.insert(userActivities).values({
      userUid,
      action,
      xpEarned,
      meta,
    });

    await db
      .update(users)
      .set({
        xp: newXp,
        currentStreak: newStreak,
        longestStreak,
        lastActiveDate: today,
        updatedAt: new Date(),
      })
      .where(eq(users.uid, userUid));

    const earnedKeys = new Set(
      (await db.select().from(userAchievements).where(eq(userAchievements.userUid, userUid))).map(
        (a) => a.achievementKey
      )
    );

    const unlockIfEligible = async (key: string) => {
      if (earnedKeys.has(key)) return;
      const def = ACHIEVEMENT_CATALOG.find((a) => a.key === key);
      if (!def) return;
      await db.insert(userAchievements).values({
        userUid,
        achievementKey: def.key,
        title: def.title,
        description: def.description,
        xpReward: def.xpReward,
      });
    };

    if (action === 'create_presentation') await unlockIfEligible('first_deck');
    if (action === 'ai_generate') await unlockIfEligible('ai_director');
    if (action === 'export_pptx') await unlockIfEligible('pptx_publisher');
    if (action === 'insert_component') await unlockIfEligible('component_craft');
    if (newStreak >= 3) await unlockIfEligible('three_day_streak');

    return { xp: newXp, currentStreak: newStreak, longestStreak };
  } catch (error) {
    console.error('recordUserActivity failed:', error);
    return null;
  }
}

export async function listPresentationsForUser(ownerUid: string) {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(presentations)
      .where(eq(presentations.ownerUid, ownerUid))
      .orderBy(desc(presentations.updatedAt));
  } catch (error) {
    console.error('listPresentationsForUser failed:', error);
    throw new Error('Failed to load presentations.', { cause: error });
  }
}

export async function getPresentationById(id: string) {
  try {
    await ensureSeeded();
    const rows = await db.select().from(presentations).where(eq(presentations.id, id)).limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error('getPresentationById failed:', error);
    throw new Error('Failed to load presentation.', { cause: error });
  }
}

export async function createPresentationRecord(params: {
  id?: string;
  ownerUid: string;
  title: string;
  description?: string;
  category?: string;
  themeId?: string;
  thumbnailUrl?: string;
  sourceType?: string;
  isDraft?: boolean;
  document: PresentationDocument;
}) {
  try {
    const id = params.id || `deck-${crypto.randomUUID().slice(0, 12)}`;
    const docToStore: PresentationDocument = {
      ...params.document,
      id,
      title: params.title,
      updatedAt: new Date().toISOString(),
    };

    const inserted = await db
      .insert(presentations)
      .values({
        id,
        ownerUid: params.ownerUid,
        title: params.title,
        description: params.description || docToStore.description || '',
        category: params.category || docToStore.category || 'Business',
        aspectRatio: docToStore.aspectRatio,
        width: docToStore.width,
        height: docToStore.height,
        themeId: params.themeId || docToStore.themeId,
        document: docToStore as unknown as Record<string, unknown>,
        thumbnailUrl: params.thumbnailUrl || '',
        isDraft: params.isDraft ?? false,
        isDemo: false,
        sourceType: params.sourceType || 'manual',
        version: 1,
      })
      .returning();

    await db.insert(presentationVersions).values({
      id: `ver-${crypto.randomUUID().slice(0, 12)}`,
      presentationId: id,
      versionNumber: 1,
      label: 'Initial version',
      document: docToStore as unknown as Record<string, unknown>,
      createdByUid: params.ownerUid,
    });

    return inserted[0];
  } catch (error) {
    console.error('createPresentationRecord failed:', error);
    throw new Error('Failed to create presentation.', { cause: error });
  }
}

export async function savePresentationDocument(params: {
  id: string;
  actorUid: string;
  title?: string;
  description?: string;
  category?: string;
  isFavorite?: boolean;
  isDraft?: boolean;
  document?: PresentationDocument;
  createSnapshotLabel?: string;
}) {
  try {
    const existing = await getPresentationById(params.id);
    if (!existing) return null;

    const nextVersion = existing.version + (params.document ? 1 : 0);
    const updatedDoc = params.document
      ? { ...params.document, version: nextVersion, updatedAt: new Date().toISOString() }
      : (existing.document as unknown as PresentationDocument);

    const updated = await db
      .update(presentations)
      .set({
        title: params.title ?? existing.title,
        description: params.description ?? existing.description,
        category: params.category ?? existing.category,
        isFavorite: params.isFavorite ?? existing.isFavorite,
        isDraft: params.isDraft ?? existing.isDraft,
        themeId: updatedDoc.themeId || existing.themeId,
        document: updatedDoc as unknown as Record<string, unknown>,
        version: nextVersion,
        updatedAt: new Date(),
      })
      .where(eq(presentations.id, params.id))
      .returning();

    if (params.document && params.createSnapshotLabel) {
      await db.insert(presentationVersions).values({
        id: `ver-${crypto.randomUUID().slice(0, 12)}`,
        presentationId: params.id,
        versionNumber: nextVersion,
        label: params.createSnapshotLabel,
        document: updatedDoc as unknown as Record<string, unknown>,
        createdByUid: params.actorUid,
      });
    }

    return updated[0];
  } catch (error) {
    console.error('savePresentationDocument failed:', error);
    throw new Error('Failed to save presentation.', { cause: error });
  }
}

export async function deletePresentationById(id: string, ownerUid: string) {
  try {
    await db
      .delete(presentations)
      .where(and(eq(presentations.id, id), eq(presentations.ownerUid, ownerUid)));
    return true;
  } catch (error) {
    console.error('deletePresentationById failed:', error);
    throw new Error('Failed to delete presentation.', { cause: error });
  }
}

export async function logAdminAudit(params: {
  actorUid: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, unknown>;
}) {
  try {
    await db.insert(adminAuditLogs).values({
      actorUid: params.actorUid,
      actorEmail: params.actorEmail,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      details: params.details || {},
    });
  } catch (error) {
    console.error('logAdminAudit failed:', error);
  }
}

export function hashSharePassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}
