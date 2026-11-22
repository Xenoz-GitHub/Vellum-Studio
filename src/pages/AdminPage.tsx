import React, { useEffect, useState } from 'react';
import { Lock, Plus, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useAppStore } from '../state/useAppStore';

export function AdminPage() {
  const { profile, signInWithGoogle } = useAppStore();
  const [tab, setTab] = useState<'templates' | 'components' | 'tokens' | 'ai' | 'users'>('templates');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // New Component form
  const [newCompKey, setNewCompKey] = useState('');
  const [newCompName, setNewCompName] = useState('');
  const [newCompCategory, setNewCompCategory] = useState('Editorial Layouts');
  const [newCompDesc, setNewCompDesc] = useState('');

  // New Font form
  const [fontFamily, setFontFamily] = useState('');
  const [fontDisplay, setFontDisplay] = useState('');
  const [fontRole, setFontRole] = useState('display');

  // AI Config edit
  const [aiModel, setAiModel] = useState('gemini-4-hydrogen');
  const [aiVersion, setAiVersion] = useState('v1.2');
  const [aiPrompt, setAiPrompt] = useState('');

  const loadOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/api/admin/overview');
      setData(res);
      if (res.aiConfigs?.[0]) {
        setAiModel(res.aiConfigs[0].modelName);
        setAiVersion(res.aiConfigs[0].promptVersion);
        setAiPrompt(res.aiConfigs[0].systemPrompt);
      }
    } catch (err: any) {
      setError(err.message || 'Access denied.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, [profile?.uid]);

  if (loading) {
    return <div className="p-12 text-center text-sm text-[var(--text-secondary)]">Verifying administrator permissions...</div>;
  }

  if (error || !data) {
    return (
      <main className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <Lock className="w-10 h-10 mx-auto text-[var(--accent)]" />
        <h1 className="font-display text-2xl font-bold">Restricted Administrator Console</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {error || 'Server-side role-based access control restricts this console to authorized administrator accounts.'}
        </p>
        {!profile && (
          <button
            type="button"
            onClick={signInWithGoogle}
            className="px-5 py-3 min-h-[44px] rounded-lg bg-[var(--text-primary)] text-[var(--bg-surface)] text-sm font-semibold"
          >
            Sign In with Administrator Account
          </button>
        )}
      </main>
    );
  }

  const handleTemplateStatus = async (id: string, status: string) => {
    await apiFetch(`/api/admin/templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setNotice(`Template updated to ${status}.`);
    loadOverview();
  };

  const handleToggleComponent = async (comp: any) => {
    await apiFetch(`/api/admin/components/${comp.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled: !comp.enabled }),
    });
    setNotice(`Component "${comp.name}" ${comp.enabled ? 'disabled' : 'enabled'}.`);
    loadOverview();
  };

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompKey.trim() || !newCompName.trim()) return;
    await apiFetch('/api/admin/components', {
      method: 'POST',
      body: JSON.stringify({
        componentKey: newCompKey.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
        name: newCompName.trim(),
        category: newCompCategory,
        description: newCompDesc.trim(),
        propertySchema: [
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'summary', label: 'Summary', type: 'textarea' },
          { key: 'accentColor', label: 'Accent Color', type: 'color' },
        ],
        defaultProps: {
          heading: newCompName.trim(),
          summary: 'Declarative custom block managed via Admin Registry.',
          accentColor: '#7D1935',
        },
      }),
    });
    setNewCompKey('');
    setNewCompName('');
    setNewCompDesc('');
    setNotice('Custom component registered.');
    loadOverview();
  };

  const handleRegisterFont = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fontFamily.trim() || !fontDisplay.trim()) return;
    await apiFetch('/api/admin/fonts', {
      method: 'POST',
      body: JSON.stringify({ family: fontFamily.trim(), displayName: fontDisplay.trim(), role: fontRole }),
    });
    setFontFamily('');
    setFontDisplay('');
    setNotice('Font registered in design catalog.');
    loadOverview();
  };

  const handleSaveAiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/admin/ai-config', {
      method: 'PATCH',
      body: JSON.stringify({ modelName: aiModel, promptVersion: aiVersion, systemPrompt: aiPrompt }),
    });
    setNotice('AI generation configuration updated.');
    loadOverview();
  };

  const handleUserUpdate = async (uid: string, patch: { role?: string; status?: string }) => {
    await apiFetch(`/api/admin/users/${uid}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    setNotice('User account updated.');
    loadOverview();
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono-tabular text-[var(--accent)] flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" /> Server-Verified RBAC Console
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Platform Administration
          </h1>
        </div>

        <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-[var(--bg-subtle)]">
          {(
            [
              ['templates', 'Templates'],
              ['components', 'Custom Components'],
              ['tokens', 'Tokens & Fonts'],
              ['ai', 'AI & Jobs'],
              ['users', 'Users & Audit'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                tab === key ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs' : 'text-[var(--text-secondary)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs">
          {notice}
        </div>
      )}

      {tab === 'templates' && (
        <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border-hairline)] font-semibold text-sm">
            Template Governance ({data.templates.length})
          </div>
          <div className="divide-y divide-[var(--border-hairline)] text-xs">
            {data.templates.map((tpl: any) => (
              <div key={tpl.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm">{tpl.name}</div>
                  <div className="text-[var(--text-secondary)] font-mono-tabular">
                    {tpl.category} · v{tpl.version} · Status: {tpl.status}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(['published', 'draft', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleTemplateStatus(tpl.id, st)}
                      className={`px-3 py-1.5 rounded-md border capitalize ${
                        tpl.status === st
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] font-semibold'
                          : 'border-[var(--border-hairline)]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'components' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] divide-y divide-[var(--border-hairline)]">
            <div className="p-4 font-semibold text-sm">
              Declarative Component Registry ({data.components.length})
            </div>
            {data.components.map((c: any) => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-semibold text-sm">{c.name}</div>
                  <div className="font-mono-tabular text-[var(--text-secondary)]">
                    {c.componentKey} · {c.category} · v{c.version}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleComponent(c)}
                  className={`px-3 py-1.5 rounded-md border font-medium ${
                    c.enabled ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-[var(--border-hairline)]'
                  }`}
                >
                  {c.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </section>

          <form onSubmit={handleCreateComponent} className="lg:col-span-5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3 text-xs h-fit">
            <h2 className="font-display text-base font-bold">Register Custom Component Manifest</h2>
            <input
              type="text"
              placeholder="Component Key (e.g. executive-callout)"
              value={newCompKey}
              onChange={(e) => setNewCompKey(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
            />
            <input
              type="text"
              placeholder="Display Name"
              value={newCompName}
              onChange={(e) => setNewCompName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
            />
            <input
              type="text"
              placeholder="Category"
              value={newCompCategory}
              onChange={(e) => setNewCompCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
            />
            <textarea
              rows={2}
              placeholder="Component description and layout purpose"
              value={newCompDesc}
              onChange={(e) => setNewCompDesc(e.target.value)}
              className="w-full p-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
            />
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold">
              <Plus className="w-3.5 h-3.5" /> Register Component
            </button>
          </form>
        </div>
      )}

      {tab === 'tokens' && (
        <div className="grid md:grid-cols-2 gap-6">
          <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3 text-xs">
            <h2 className="font-display text-base font-bold">Design Token Sets</h2>
            {data.tokens.map((ts: any) => (
              <div key={ts.id} className="p-3 rounded-lg border border-[var(--border-hairline)] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{ts.name}</div>
                  <div className="text-[var(--text-secondary)] font-mono-tabular">
                    {ts.tokens?.typography?.displayFont} / {ts.tokens?.typography?.bodyFont}
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="w-5 h-5 rounded border border-black/10" style={{ backgroundColor: ts.tokens?.colors?.background }} />
                  <span className="w-5 h-5 rounded border border-black/10" style={{ backgroundColor: ts.tokens?.colors?.accent }} />
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4 text-xs">
            <h2 className="font-display text-base font-bold">Font Management ({data.fonts.length})</h2>
            <div className="space-y-2">
              {data.fonts.map((f: any) => (
                <div key={f.id} className="p-2.5 rounded-lg border border-[var(--border-hairline)] flex justify-between">
                  <span className="font-medium">{f.displayName}</span>
                  <span className="font-mono-tabular text-[var(--text-secondary)]">{f.role} · {f.licenseNote}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleRegisterFont} className="pt-3 border-t border-[var(--border-hairline)] space-y-2.5">
              <div className="font-semibold">Register Approved Font</div>
              <input type="text" placeholder="CSS Font Family" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full h-9 px-3 rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)]" />
              <input type="text" placeholder="Display Name" value={fontDisplay} onChange={(e) => setFontDisplay(e.target.value)} className="w-full h-9 px-3 rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)]" />
              <select value={fontRole} onChange={(e) => setFontRole(e.target.value)} className="w-full h-9 px-3 rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
                <option value="display">Display</option>
                <option value="body">Body</option>
                <option value="mono">Monospace</option>
              </select>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-semibold">
                Add Font
              </button>
            </form>
          </section>
        </div>
      )}

      {tab === 'ai' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <form onSubmit={handleSaveAiConfig} className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3 text-xs">
            <h2 className="font-display text-base font-bold">AI Provider & Prompt Governance</h2>
            <label className="block">
              <span className="block mb-1 font-medium">Active Model</span>
              <select value={aiModel} onChange={(e) => setAiModel(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
                <option value="gemini-4-hydrogen">gemini-4-hydrogen</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
              </select>
            </label>
            <label className="block">
              <span className="block mb-1 font-medium">Prompt Version</span>
              <input type="text" value={aiVersion} onChange={(e) => setAiVersion(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tabular" />
            </label>
            <label className="block">
              <span className="block mb-1 font-medium">System Art Direction Prompt</span>
              <textarea rows={4} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="w-full p-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)]" />
            </label>
            <button type="submit" className="px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold">
              Update AI Config
            </button>
          </form>

          <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3 text-xs">
            <h2 className="font-display text-base font-bold">Recent Generation Jobs</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {data.generationJobs.map((j: any) => (
                <div key={j.id} className="p-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
                  <div className="flex justify-between font-mono-tabular mb-1">
                    <span className="font-semibold">{j.status.toUpperCase()}</span>
                    <span>{j.durationMs}ms · {j.modelUsed}</span>
                  </div>
                  <div className="truncate text-[var(--text-secondary)]">{j.prompt}</div>
                  {j.errorMessage && <div className="text-red-600 mt-1">{j.errorMessage}</div>}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === 'users' && (
        <div className="grid lg:grid-cols-2 gap-6 text-xs">
          <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3">
            <h2 className="font-display text-base font-bold">Accounts & Roles</h2>
            {data.users.map((u: any) => (
              <div key={u.uid} className="p-3 rounded-lg border border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm">{u.displayName}</div>
                  <div className="text-[var(--text-secondary)]">{u.email} · Role: {u.role} · {u.status}</div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleUserUpdate(u.uid, { role: u.role === 'admin' ? 'user' : 'admin' })}
                    className="px-2.5 py-1 rounded border border-[var(--border-hairline)]"
                  >
                    {u.role === 'admin' ? 'Set User' : 'Make Admin'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserUpdate(u.uid, { status: u.status === 'active' ? 'suspended' : 'active' })}
                    className="px-2.5 py-1 rounded border border-[var(--border-hairline)]"
                  >
                    {u.status === 'active' ? 'Suspend' : 'Restore'}
                  </button>
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3">
            <h2 className="font-display text-base font-bold">Immutable Audit Log</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.auditLogs.map((log: any) => (
                <div key={log.id} className="p-2.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
                  <div className="font-semibold">{log.action}</div>
                  <div className="font-mono-tabular text-[var(--text-secondary)]">
                    {log.actorEmail} → {log.targetType}:{log.targetId}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
