import type { Request, Response, NextFunction } from 'express';
import { getOrCreateDbUser, getDbUserByUid } from '../db/repository.ts';

/**
 * Neon Auth Middleware
 * Replaces Firebase authentication with Neon Auth
 */

export interface AuthContextUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  isDemo: boolean;
}

export interface AuthRequest extends Request {
  authUser?: AuthContextUser;
}

export const DEMO_USER_UID = 'demo-workspace-user';

// Simple JWT verification for Neon Auth tokens
// In production, this should verify against Neon Auth's public key
function verifyNeonAuthToken(token: string): { uid: string; email: string; name?: string } | null {
  try {
    // For now, using basic JWT decode
    // TODO: Integrate with Neon Auth's verification endpoint
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    if (!payload.sub || !payload.email) return null;
    
    return {
      uid: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export const requireAuthOrDemo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const demoHeader = req.headers['x-demo-workspace'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    
    const decoded = verifyNeonAuthToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized: Invalid authentication token.' });
    }
    
    try {
      const dbUser = await getOrCreateDbUser({
        uid: decoded.uid,
        email: decoded.email || 'user@vellum.studio',
        displayName: decoded.name || decoded.email?.split('@')[0] || 'Creator',
        avatarUrl: '',
      });
      
      if (dbUser.status === 'suspended') {
        return res.status(403).json({ error: 'Account is suspended. Contact an administrator.' });
      }
      
      req.authUser = {
        uid: dbUser.uid,
        email: dbUser.email,
        displayName: dbUser.displayName,
        role: dbUser.role === 'admin' ? 'admin' : 'user',
        status: 'active',
        isDemo: false,
      };
      return next();
    } catch (error) {
      console.error('Neon Auth verification error:', error);
      return res.status(401).json({ error: 'Unauthorized: Authentication failed.' });
    }
  }

  if (demoHeader === '1') {
    const demoUser = await getOrCreateDbUser({
      uid: DEMO_USER_UID,
      email: 'studio-demo@vellum.local',
      displayName: 'Studio Demo',
      avatarUrl: '/src/assets/images/avatar_creative_director_1795323621597.jpg',
      forceRole: 'user',
    });
    req.authUser = {
      uid: demoUser.uid,
      email: demoUser.email,
      displayName: demoUser.displayName,
      role: 'user',
      status: 'active',
      isDemo: true,
    };
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Sign in or open the Demo Workspace to continue.' });
};

export const requireAuthenticatedUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
  }
  return requireAuthOrDemo(req, res, next);
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.authUser || req.authUser.isDemo) {
    return res.status(403).json({ error: 'Forbidden: Administrator role required.' });
  }
  const latest = await getDbUserByUid(req.authUser.uid);
  if (!latest || latest.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Administrator privileges are required for this action.' });
  }
  return next();
};
