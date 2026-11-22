import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name').notNull().default('Creator'),
  username: text('username').notNull().default('creator'),
  avatarUrl: text('avatar_url').default(''),
  role: text('role').notNull().default('user'), // 'user' | 'admin'
  status: text('status').notNull().default('active'), // 'active' | 'suspended'
  preferences: jsonb('preferences').$type<Record<string, unknown>>().default({}),
  xp: integer('xp').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActiveDate: text('last_active_date'), // YYYY-MM-DD in user's timezone
  gamificationEnabled: boolean('gamification_enabled').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const presentations = pgTable('presentations', {
  id: text('id').primaryKey(),
  ownerUid: text('owner_uid').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  category: text('category').notNull().default('Business'),
  aspectRatio: text('aspect_ratio').notNull().default('16:9'),
  width: integer('width').notNull().default(1280),
  height: integer('height').notNull().default(720),
  themeId: text('theme_id').notNull().default('gallery-alabaster'),
  document: jsonb('document').$type<Record<string, unknown>>().notNull(),
  thumbnailUrl: text('thumbnail_url').default(''),
  isFavorite: boolean('is_favorite').notNull().default(false),
  isDraft: boolean('is_draft').notNull().default(false),
  isDemo: boolean('is_demo').notNull().default(false),
  sourceType: text('source_type').notNull().default('manual'), // 'manual' | 'ai' | 'template' | 'import'
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const presentationVersions = pgTable('presentation_versions', {
  id: text('id').primaryKey(),
  presentationId: text('presentation_id').notNull(),
  versionNumber: integer('version_number').notNull(),
  label: text('label').notNull().default('Autosave'),
  document: jsonb('document').$type<Record<string, unknown>>().notNull(),
  createdByUid: text('created_by_uid').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const shareLinks = pgTable('share_links', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),
  presentationId: text('presentation_id').notNull(),
  createdByUid: text('created_by_uid').notNull(),
  permission: text('permission').notNull().default('view'), // 'view' | 'edit'
  passwordHash: text('password_hash'),
  expiresAt: timestamp('expires_at'),
  revokedAt: timestamp('revoked_at'),
  accessCount: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  category: text('category').notNull().default('Business'),
  aspectRatio: text('aspect_ratio').notNull().default('16:9'),
  themeId: text('theme_id').notNull().default('gallery-alabaster'),
  slideCount: integer('slide_count').notNull().default(1),
  thumbnailUrl: text('thumbnail_url').default(''),
  authorName: text('author_name').notNull().default('Vellum Design Team'),
  version: text('version').notNull().default('1.0.0'),
  status: text('status').notNull().default('published'), // 'draft' | 'published' | 'archived'
  document: jsonb('document').$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const customComponents = pgTable('custom_components', {
  id: text('id').primaryKey(),
  componentKey: text('component_key').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  category: text('category').notNull().default('Data & Metrics'),
  version: text('version').notNull().default('1.0.0'),
  thumbnailUrl: text('thumbnail_url').default(''),
  propertySchema: jsonb('property_schema').$type<Record<string, unknown>[]>().notNull().default([]),
  defaultProps: jsonb('default_props').$type<Record<string, unknown>>().notNull().default({}),
  layoutConstraints: jsonb('layout_constraints').$type<Record<string, unknown>>().notNull().default({}),
  availability: jsonb('availability').$type<Record<string, unknown>>().notNull().default({}),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const designTokenSets = pgTable('design_token_sets', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  category: text('category').notNull().default('Editorial'),
  version: text('version').notNull().default('1.0.0'),
  tokens: jsonb('tokens').$type<Record<string, unknown>>().notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const fontAssets = pgTable('font_assets', {
  id: text('id').primaryKey(),
  family: text('family').notNull().unique(),
  displayName: text('display_name').notNull(),
  role: text('role').notNull().default('display'), // 'display' | 'body' | 'mono'
  sourceType: text('source_type').notNull().default('google'), // 'google' | 'uploaded'
  fileUrl: text('file_url').default(''),
  weights: jsonb('weights').$type<number[]>().notNull().default([400, 600, 700]),
  licenseNote: text('license_note').default('SIL Open Font License'),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const uploadedAssets = pgTable('uploaded_assets', {
  id: text('id').primaryKey(),
  ownerUid: text('owner_uid').notNull(),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull().default(0),
  storagePath: text('storage_path').notNull(),
  extractedText: text('extracted_text').default(''),
  analysisSummary: jsonb('analysis_summary').$type<Record<string, unknown>>().default({}),
  kind: text('kind').notNull().default('other'), // 'image' | 'pdf' | 'pptx' | 'docx' | 'font' | 'other'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const generationJobs = pgTable('generation_jobs', {
  id: text('id').primaryKey(),
  ownerUid: text('owner_uid').notNull(),
  presentationId: text('presentation_id'),
  status: text('status').notNull().default('queued'),
  prompt: text('prompt').notNull(),
  modelUsed: text('model_used').notNull().default('gemini-4-hydrogen'),
  promptVersion: text('prompt_version').notNull().default('v1.2'),
  outline: jsonb('outline').$type<Record<string, unknown>>().default({}),
  qualityReport: jsonb('quality_report').$type<Record<string, unknown>>().default({}),
  errorMessage: text('error_message'),
  durationMs: integer('duration_ms').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userAchievements = pgTable('user_achievements', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull(),
  achievementKey: text('achievement_key').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  xpReward: integer('xp_reward').notNull().default(50),
  earnedAt: timestamp('earned_at').defaultNow().notNull(),
});

export const userActivities = pgTable('user_activities', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull(),
  action: text('action').notNull(),
  xpEarned: integer('xp_earned').notNull().default(10),
  meta: jsonb('meta').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const adminAuditLogs = pgTable('admin_audit_logs', {
  id: serial('id').primaryKey(),
  actorUid: text('actor_uid').notNull(),
  actorEmail: text('actor_email').notNull(),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  details: jsonb('details').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiConfigs = pgTable('ai_configs', {
  id: serial('id').primaryKey(),
  configKey: text('config_key').notNull().unique(),
  modelName: text('model_name').notNull().default('gemini-4-hydrogen'),
  promptVersion: text('prompt_version').notNull().default('v1.2'),
  systemPrompt: text('system_prompt').notNull(),
  settings: jsonb('settings').$type<Record<string, unknown>>().notNull().default({}),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const featureFlags = pgTable('feature_flags', {
  id: serial('id').primaryKey(),
  flagKey: text('flag_key').notNull().unique(),
  enabled: boolean('enabled').notNull().default(true),
  description: text('description').notNull().default(''),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const presentationsRelations = relations(presentations, ({ many }) => ({
  versions: many(presentationVersions),
  shares: many(shareLinks),
}));
