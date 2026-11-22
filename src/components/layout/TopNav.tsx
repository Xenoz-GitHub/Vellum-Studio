import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useAppStore } from '../../state/useAppStore';

export function TopNav() {
  const {
    route,
    profile,
    isDemo,
    themeMode,
    navigate,
    signInWithGoogle,
    enterDemoWorkspace,
    logout,
    toggleThemeMode,
  } = useAppStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isSignedInOrDemo = Boolean(profile || isDemo);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]/95 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate({ page: 'landing' });
          }}
          className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0"
        >
          Vellum Studio
        </a>

        {/* Zone 2: 4-5 Clean Single-Line Nav Links */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
          <a
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              if (isSignedInOrDemo) {
                navigate({ page: 'dashboard' });
              } else {
                signInWithGoogle();
              }
            }}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[var(--text-primary)] ${
              route.page === 'dashboard' ? 'text-[var(--text-primary)] underline underline-offset-8 decoration-2 decoration-[var(--accent)]' : ''
            }`}
          >
            Workspace
          </a>
          <a
            href="/create"
            onClick={(e) => {
              e.preventDefault();
              if (isSignedInOrDemo) {
                navigate({ page: 'create' });
              } else {
                signInWithGoogle();
              }
            }}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[var(--text-primary)] ${
              route.page === 'create' ? 'text-[var(--text-primary)] underline underline-offset-8 decoration-2 decoration-[var(--accent)]' : ''
            }`}
          >
            Generate
          </a>
          <a
            href="/templates"
            onClick={(e) => {
              e.preventDefault();
              navigate({ page: 'templates' });
            }}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[var(--text-primary)] ${
              route.page === 'templates' ? 'text-[var(--text-primary)] underline underline-offset-8 decoration-2 decoration-[var(--accent)]' : ''
            }`}
          >
            Templates
          </a>
          <a
            href="/profile"
            onClick={(e) => {
              e.preventDefault();
              if (isSignedInOrDemo) {
                navigate({ page: 'profile' });
              } else {
                signInWithGoogle();
              }
            }}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[var(--text-primary)] ${
              route.page === 'profile' ? 'text-[var(--text-primary)] underline underline-offset-8 decoration-2 decoration-[var(--accent)]' : ''
            }`}
          >
            Profile
          </a>
          {profile?.role === 'admin' && (
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                navigate({ page: 'admin' });
              }}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[var(--text-primary)] ${
                route.page === 'admin' ? 'text-[var(--text-primary)] underline underline-offset-8 decoration-2 decoration-[var(--accent)]' : ''
              }`}
            >
              Admin
            </a>
          )}
        </nav>

        {/* Zone 3: Single Primary Action + Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleThemeMode}
            aria-label={themeMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isSignedInOrDemo ? (
            <button
              type="button"
              onClick={() => navigate({ page: 'create' })}
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap shrink-0"
            >
              New Deck
            </button>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-[var(--text-primary)] text-[var(--bg-surface)] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[var(--border-hairline)] text-[var(--text-primary)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (isSignedInOrDemo) {
                navigate({ page: 'dashboard' });
              } else {
                signInWithGoogle();
              }
            }}
            className="w-full text-left px-3 min-h-[44px] rounded-lg text-sm font-medium hover:bg-[var(--bg-subtle)]"
          >
            Workspace
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (isSignedInOrDemo) {
                navigate({ page: 'create' });
              } else {
                signInWithGoogle();
              }
            }}
            className="w-full text-left px-3 min-h-[44px] rounded-lg text-sm font-medium hover:bg-[var(--bg-subtle)]"
          >
            Generate Presentation
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate({ page: 'templates' });
            }}
            className="w-full text-left px-3 min-h-[44px] rounded-lg text-sm font-medium hover:bg-[var(--bg-subtle)]"
          >
            Templates
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (isSignedInOrDemo) {
                navigate({ page: 'profile' });
              } else {
                signInWithGoogle();
              }
            }}
            className="w-full text-left px-3 min-h-[44px] rounded-lg text-sm font-medium hover:bg-[var(--bg-subtle)]"
          >
            Profile & Streaks
          </button>
          {profile?.role === 'admin' && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate({ page: 'admin' });
              }}
              className="w-full text-left px-3 min-h-[44px] rounded-lg text-sm font-medium hover:bg-[var(--bg-subtle)]"
            >
              Admin Console
            </button>
          )}
          <div className="pt-2 border-t border-[var(--border-hairline)] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={toggleThemeMode}
              className="px-3 min-h-[44px] rounded-lg border border-[var(--border-hairline)] text-sm font-medium flex items-center gap-2"
            >
              {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            {isSignedInOrDemo ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="px-4 min-h-[44px] rounded-lg border border-[var(--border-hairline)] text-sm font-medium"
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signInWithGoogle();
                }}
                className="px-4 min-h-[44px] rounded-lg bg-[var(--accent)] text-white text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
