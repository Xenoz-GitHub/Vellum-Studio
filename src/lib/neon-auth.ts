/**
 * Neon Auth Client
 * Authentication using Neon's Managed Better Auth
 */

const NEON_AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || 
  'https://ep-solitary-butterfly-bdmhkkvn.neonauth.c-8.us-east-2.aws.neon.tech/neondb/auth';

export interface NeonAuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NeonAuthSession {
  token: string;
  user: NeonAuthUser;
  expiresAt: Date;
}

class NeonAuthClient {
  private baseUrl: string;
  private session: NeonAuthSession | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadSession();
  }

  private loadSession() {
    try {
      const stored = localStorage.getItem('neon_auth_session');
      if (stored) {
        const session = JSON.parse(stored);
        // Check if expired
        if (new Date(session.expiresAt) > new Date()) {
          this.session = {
            ...session,
            expiresAt: new Date(session.expiresAt),
            user: {
              ...session.user,
              createdAt: new Date(session.user.createdAt),
              updatedAt: new Date(session.user.updatedAt),
            },
          };
        } else {
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      this.clearSession();
    }
  }

  private saveSession(session: NeonAuthSession) {
    this.session = session;
    localStorage.setItem('neon_auth_session', JSON.stringify(session));
  }

  private clearSession() {
    this.session = null;
    localStorage.removeItem('neon_auth_session');
  }

  getSession(): NeonAuthSession | null {
    return this.session;
  }

  getToken(): string | null {
    return this.session?.token || null;
  }

  getCurrentUser(): NeonAuthUser | null {
    return this.session?.user || null;
  }

  async signInWithEmail(email: string, password: string): Promise<NeonAuthSession> {
    const response = await fetch(`${this.baseUrl}/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Sign in failed' }));
      throw new Error(error.error || 'Sign in failed');
    }

    const data = await response.json();
    const session: NeonAuthSession = {
      token: data.token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || data.user.email.split('@')[0],
        image: data.user.image,
        emailVerified: data.user.emailVerified || false,
        createdAt: new Date(data.user.createdAt),
        updatedAt: new Date(data.user.updatedAt),
      },
      expiresAt: new Date(data.expiresAt),
    };

    this.saveSession(session);
    return session;
  }

  async signUpWithEmail(email: string, password: string, name?: string): Promise<NeonAuthSession> {
    const response = await fetch(`${this.baseUrl}/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Sign up failed' }));
      throw new Error(error.error || 'Sign up failed');
    }

    const data = await response.json();
    const session: NeonAuthSession = {
      token: data.token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || name || data.user.email.split('@')[0],
        image: data.user.image,
        emailVerified: data.user.emailVerified || false,
        createdAt: new Date(data.user.createdAt),
        updatedAt: new Date(data.user.updatedAt),
      },
      expiresAt: new Date(data.expiresAt),
    };

    this.saveSession(session);
    return session;
  }

  async signInWithGoogle(): Promise<NeonAuthSession> {
    // Open OAuth popup
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      `${this.baseUrl}/oauth/google`,
      'neon-auth-google',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Wait for OAuth callback
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        try {
          if (popup?.closed) {
            clearInterval(checkInterval);
            reject(new Error('Sign in cancelled'));
          }
        } catch (error) {
          // Cross-origin access errors are expected
        }
      }, 500);

      // Listen for OAuth callback message
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'neon-auth-success') {
          clearInterval(checkInterval);
          window.removeEventListener('message', handleMessage);
          popup?.close();

          const session: NeonAuthSession = {
            token: event.data.token,
            user: {
              id: event.data.user.id,
              email: event.data.user.email,
              name: event.data.user.name || event.data.user.email.split('@')[0],
              image: event.data.user.image,
              emailVerified: event.data.user.emailVerified || false,
              createdAt: new Date(event.data.user.createdAt),
              updatedAt: new Date(event.data.user.updatedAt),
            },
            expiresAt: new Date(event.data.expiresAt),
          };

          this.saveSession(session);
          resolve(session);
        } else if (event.data.type === 'neon-auth-error') {
          clearInterval(checkInterval);
          window.removeEventListener('message', handleMessage);
          popup?.close();
          reject(new Error(event.data.error || 'Sign in failed'));
        }
      };

      window.addEventListener('message', handleMessage);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        window.removeEventListener('message', handleMessage);
        popup?.close();
        reject(new Error('Sign in timeout'));
      }, 5 * 60 * 1000);
    });
  }

  async signOut(): Promise<void> {
    if (this.session) {
      try {
        await fetch(`${this.baseUrl}/sign-out`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.session.token}`,
          },
        });
      } catch (error) {
        console.error('Sign out request failed:', error);
      }
    }
    this.clearSession();
  }

  async refreshSession(): Promise<NeonAuthSession | null> {
    if (!this.session) return null;

    try {
      const response = await fetch(`${this.baseUrl}/session/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.session.token}`,
        },
      });

      if (!response.ok) {
        this.clearSession();
        return null;
      }

      const data = await response.json();
      const session: NeonAuthSession = {
        token: data.token,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          image: data.user.image,
          emailVerified: data.user.emailVerified,
          createdAt: new Date(data.user.createdAt),
          updatedAt: new Date(data.user.updatedAt),
        },
        expiresAt: new Date(data.expiresAt),
      };

      this.saveSession(session);
      return session;
    } catch (error) {
      console.error('Session refresh failed:', error);
      this.clearSession();
      return null;
    }
  }
}

// Export singleton instance
export const neonAuth = new NeonAuthClient(NEON_AUTH_URL);

// OAuth callback handler (for popup window)
if (typeof window !== 'undefined' && window.opener) {
  // Check if this is an OAuth callback page
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const error = params.get('error');

  if (token) {
    // Parse user data from URL or fetch it
    const userDataParam = params.get('user');
    if (userDataParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        window.opener.postMessage({
          type: 'neon-auth-success',
          token,
          user: userData.user,
          expiresAt: userData.expiresAt,
        }, window.location.origin);
      } catch (e) {
        window.opener.postMessage({
          type: 'neon-auth-error',
          error: 'Invalid OAuth response',
        }, window.location.origin);
      }
    }
  } else if (error) {
    window.opener.postMessage({
      type: 'neon-auth-error',
      error: decodeURIComponent(error),
    }, window.location.origin);
  }
}
