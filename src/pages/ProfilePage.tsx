import React, { useEffect, useState } from 'react';
import { Award, Flame, Layers, Save, Shield, Trash2 } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useAppStore } from '../state/useAppStore';
import { ACHIEVEMENT_CATALOG, SEED_IMAGE_PATHS } from '../core/seed-data';

interface MeResponse {
  user: any;
  isDemo: boolean;
  achievements: Array<{
    achievementKey: string;
    title: string;
    description: string;
    xpReward: number;
    earnedAt: string;
  }>;
  activities: Array<{
    id: number;
    action: string;
    xpEarned: number;
    createdAt: string;
  }>;
  stats: {
    totalDecks: number;
    favorites: number;
    drafts: number;
  };
}

export function ProfilePage() {
  const { profile, isDemo, themeMode, toggleThemeMode, refreshProfile, signInWithGoogle, logout } =
    useAppStore();
  const [data, setData] = useState<MeResponse | null>(null);
  const [uploads, setUploads] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [gamificationEnabled, setGamificationEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!profile && !isDemo) return;
    apiFetch<MeResponse>('/api/me').then((res) => {
      setData(res);
      setDisplayName(res.user.displayName || '');
      setUsername(res.user.username || '');
      setGamificationEnabled(Boolean(res.user.gamificationEnabled));
    });
    apiFetch<any[]>('/api/uploads')
      .then((u) => setUploads(u))
      .catch(() => {});
  }, [profile?.uid, isDemo]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await apiFetch('/api/me', {
        method: 'PATCH',
        body: JSON.stringify({ displayName, username, gamificationEnabled }),
      });
      await refreshProfile();
      setNotice('Profile preferences saved.');
    } catch (err: any) {
      setNotice(err.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!profile && !isDemo) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold">Profile & Creative Progress</h1>
        <p className="text-sm text-[var(--text-secondary)]">Sign in to manage your account, uploaded assets, and creative streaks.</p>
        <button
          type="button"
          onClick={signInWithGoogle}
          className="px-5 py-3 min-h-[44px] rounded-lg bg-[var(--text-primary)] text-[var(--bg-surface)] text-sm font-semibold"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  const earnedSet = new Set((data?.achievements || []).map((a) => a.achievementKey));

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Identity Header */}
      <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={data?.user?.avatarUrl || SEED_IMAGE_PATHS.avatarDirector}
            alt={displayName || 'User avatar'}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border border-[var(--border-hairline)]"
          />
          <div>
            <div className="text-xs font-mono-tabular text-[var(--text-secondary)]">
              @{username || 'creator'} · {data?.user?.role === 'admin' ? 'Administrator' : isDemo ? 'Demo Account' : 'Creator'}
            </div>
            <h1 className="font-display text-2xl font-bold">{displayName || 'Creator'}</h1>
            <div className="text-xs text-[var(--text-secondary)]">{data?.user?.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isDemo && (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[var(--accent)] text-white text-xs font-semibold"
            >
              Upgrade to Google Account
            </button>
          )}
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2.5 min-h-[44px] rounded-lg border border-[var(--border-hairline)] text-xs font-medium hover:bg-[var(--bg-subtle)]"
          >
            Sign Out
          </button>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
          <div className="text-xs text-[var(--text-secondary)] mb-1">Presentations</div>
          <div className="text-2xl font-display font-bold tabular-nums">{data?.stats?.totalDecks ?? 0}</div>
        </div>
        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
          <div className="text-xs text-[var(--text-secondary)] mb-1">Favorites</div>
          <div className="text-2xl font-display font-bold tabular-nums">{data?.stats?.favorites ?? 0}</div>
        </div>
        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
          <div className="text-xs text-[var(--text-secondary)] mb-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[var(--accent)]" /> Creative Streak
          </div>
          <div className="text-2xl font-display font-bold tabular-nums">
            {data?.user?.currentStreak ?? 0}d <span className="text-xs font-normal text-[var(--text-muted)]">/ {data?.user?.longestStreak ?? 0}d best</span>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
          <div className="text-xs text-[var(--text-secondary)] mb-1">Progress XP</div>
          <div className="text-2xl font-display font-bold tabular-nums">{data?.user?.xp ?? 0}</div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <form
          onSubmit={handleSaveProfile}
          className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4"
        >
          <h2 className="font-display text-lg font-bold">Account & Studio Preferences</h2>
          {notice && (
            <div className="p-3 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-xs">
              {notice}
            </div>
          )}

          <div>
            <label htmlFor="prof-name" className="block text-xs font-semibold mb-1.5">
              Display Name
            </label>
            <input
              id="prof-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-sm"
            />
          </div>

          <div>
            <label htmlFor="prof-username" className="block text-xs font-semibold mb-1.5">
              Username
            </label>
            <input
              id="prof-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-sm"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm">Interface Theme</span>
            <button
              type="button"
              onClick={toggleThemeMode}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-hairline)] text-xs font-medium"
            >
              {themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>

          <label className="flex items-center justify-between pt-1 cursor-pointer">
            <span className="text-sm">Show streaks & achievement badges</span>
            <input
              type="checkbox"
              checked={gamificationEnabled}
              onChange={(e) => setGamificationEnabled(e.target.checked)}
              className="w-4 h-4 accent-[var(--accent)]"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)]"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>

        {/* Achievements */}
        <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--accent)]" /> Milestones & Badges
            </h2>
            <span className="text-xs font-mono-tabular text-[var(--text-secondary)]">
              {earnedSet.size} / {ACHIEVEMENT_CATALOG.length} unlocked
            </span>
          </div>

          {!gamificationEnabled ? (
            <p className="text-sm text-[var(--text-secondary)]">
              Gamification is paused in your preferences. Re-enable anytime to track streaks and XP.
            </p>
          ) : (
            <div className="space-y-2.5">
              {ACHIEVEMENT_CATALOG.map((ach) => {
                const earned = earnedSet.has(ach.key);
                return (
                  <div
                    key={ach.key}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                      earned
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] opacity-70'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{ach.title}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{ach.description}</div>
                    </div>
                    <span className="text-xs font-mono-tabular font-semibold shrink-0">
                      {earned ? 'Earned' : `+${ach.xpReward} XP`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Uploaded Assets Library */}
      <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--accent)]" /> Uploaded Assets & Sources
          </h2>
          <span className="text-xs font-mono-tabular text-[var(--text-secondary)]">{uploads.length} files</span>
        </div>

        {uploads.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">
            Files uploaded during AI generation or PPTX/PDF import appear here for reuse.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploads.map((u) => (
              <div key={u.id} className="p-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] flex items-center justify-between gap-3 text-xs">
                <div className="truncate">
                  <div className="font-semibold truncate">{u.filename}</div>
                  <div className="text-[var(--text-secondary)] font-mono-tabular">
                    {u.kind.toUpperCase()} · {Math.max(1, Math.round((u.sizeBytes || 0) / 1024))} KB
                  </div>
                </div>
                <Shield className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
