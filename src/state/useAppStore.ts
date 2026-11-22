import { create } from 'zustand';
import { onAuthStateChanged, signInWithPopup, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { apiFetch, setApiAuthToken, setDemoWorkspaceActive, isDemoWorkspaceActive } from '../lib/api';

export type AppRoute =
  | { page: 'landing' }
  | { page: 'dashboard' }
  | { page: 'templates' }
  | { page: 'create' }
  | { page: 'editor'; id: string }
  | { page: 'profile' }
  | { page: 'admin' }
  | { page: 'share'; token: string };

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  role: 'user' | 'admin';
  status: string;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  gamificationEnabled: boolean;
  preferences: Record<string, unknown>;
}

interface AppState {
  route: AppRoute;
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  isDemo: boolean;
  authReady: boolean;
  themeMode: 'light' | 'dark';
  authError: string | null;
  navigate: (route: AppRoute, replace?: boolean) => void;
  initAuth: () => void;
  signInWithGoogle: () => Promise<void>;
  enterDemoWorkspace: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  toggleThemeMode: () => void;
}

export function parsePathname(pathname: string, search = ''): AppRoute {
  const params = new URLSearchParams(search);
  if (pathname === '/' && params.get('autostart') === '1') {
    return { page: 'dashboard' };
  }
  if (pathname.startsWith('/editor/')) {
    return { page: 'editor', id: pathname.slice('/editor/'.length) };
  }
  if (pathname.startsWith('/share/')) {
    return { page: 'share', token: pathname.slice('/share/'.length) };
  }
  if (pathname === '/dashboard') return { page: 'dashboard' };
  if (pathname === '/templates') return { page: 'templates' };
  if (pathname === '/create') return { page: 'create' };
  if (pathname === '/profile') return { page: 'profile' };
  if (pathname === '/admin') return { page: 'admin' };
  return { page: 'landing' };
}

export function routeToPath(route: AppRoute): string {
  switch (route.page) {
    case 'dashboard':
      return '/dashboard';
    case 'templates':
      return '/templates';
    case 'create':
      return '/create';
    case 'editor':
      return `/editor/${route.id}`;
    case 'profile':
      return '/profile';
    case 'admin':
      return '/admin';
    case 'share':
      return `/share/${route.token}`;
    case 'landing':
    default:
      return '/';
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  route: parsePathname(window.location.pathname, window.location.search),
  firebaseUser: null,
  profile: null,
  isDemo: isDemoWorkspaceActive(),
  authReady: false,
  themeMode: (() => {
    try {
      return localStorage.getItem('vellum_theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  })(),
  authError: null,

  navigate: (route, replace = false) => {
    const target = routeToPath(route);
    if (window.location.pathname !== target) {
      if (replace) {
        window.history.replaceState(null, '', target);
      } else {
        window.history.pushState(null, '', target);
      }
    }
    set({ route });
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  },

  initAuth: () => {
    const mode = get().themeMode;
    document.documentElement.classList.toggle('dark', mode === 'dark');

    window.addEventListener('popstate', () => {
      set({ route: parsePathname(window.location.pathname, window.location.search) });
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setDemoWorkspaceActive(true);
      set({ isDemo: true });
    }

    onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          setApiAuthToken(token);
          setDemoWorkspaceActive(false);
          const me = await apiFetch<{ user: UserProfile; isDemo: boolean }>('/api/me');
          set({
            firebaseUser: fbUser,
            profile: me.user,
            isDemo: false,
            authReady: true,
            authError: null,
          });
        } catch (err: any) {
          set({
            firebaseUser: fbUser,
            authReady: true,
            authError: err.message || 'Could not verify session',
          });
        }
      } else if (isDemoWorkspaceActive()) {
        setApiAuthToken(null);
        try {
          const me = await apiFetch<{ user: UserProfile; isDemo: boolean }>('/api/me');
          set({
            firebaseUser: null,
            profile: me.user,
            isDemo: true,
            authReady: true,
          });
        } catch {
          set({ firebaseUser: null, profile: null, isDemo: true, authReady: true });
        }
      } else {
        setApiAuthToken(null);
        set({ firebaseUser: null, profile: null, isDemo: false, authReady: true });
      }
    });
  },

  signInWithGoogle: async () => {
    set({ authError: null });
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const token = await cred.user.getIdToken();
      setApiAuthToken(token);
      setDemoWorkspaceActive(false);
      const me = await apiFetch<{ user: UserProfile; isDemo: boolean }>('/api/me');
      set({
        firebaseUser: cred.user,
        profile: me.user,
        isDemo: false,
        authReady: true,
      });
      if (get().route.page === 'landing') {
        get().navigate({ page: 'dashboard' });
      }
    } catch (err: any) {
      set({ authError: err.message || 'Sign-in was cancelled or blocked.' });
    }
  },

  enterDemoWorkspace: async () => {
    setDemoWorkspaceActive(true);
    setApiAuthToken(null);
    try {
      const me = await apiFetch<{ user: UserProfile; isDemo: boolean }>('/api/me');
      set({
        profile: me.user,
        isDemo: true,
        authError: null,
      });
      get().navigate({ page: 'dashboard' });
    } catch (err: any) {
      set({ authError: err.message || 'Failed to open demo workspace.' });
    }
  },

  logout: async () => {
    setDemoWorkspaceActive(false);
    setApiAuthToken(null);
    await signOut(auth).catch(() => {});
    set({ firebaseUser: null, profile: null, isDemo: false });
    get().navigate({ page: 'landing' });
  },

  refreshProfile: async () => {
    try {
      if (get().firebaseUser) {
        const token = await get().firebaseUser!.getIdToken();
        setApiAuthToken(token);
      }
      const me = await apiFetch<{ user: UserProfile; isDemo: boolean }>('/api/me');
      set({ profile: me.user, isDemo: me.isDemo });
    } catch {
      // ignore if signed out
    }
  },

  toggleThemeMode: () => {
    const next = get().themeMode === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('vellum_theme', next);
    } catch {
      // ignore
    }
    set({ themeMode: next });
  },
}));
