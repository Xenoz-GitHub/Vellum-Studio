import type { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { getOrCreateDbUser, getDbUserByUid } from '../db/repository.ts';

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

export const requireAuthOrDemo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const demoHeader = req.headers['x-demo-workspace'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      const dbUser = await getOrCreateDbUser({
        uid: decoded.uid,
        email: decoded.email || 'user@vellum.studio',
        displayName: decoded.name || decoded.email?.split('@')[0] || 'Creator',
        avatarUrl: decoded.picture || '',
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
      console.error('Firebase token verification error:', error);
      return res.status(401).json({ error: 'Unauthorized: Invalid authentication token.' });
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
