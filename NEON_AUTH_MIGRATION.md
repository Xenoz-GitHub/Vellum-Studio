# Neon Auth Migration Summary

## Overview

Vellum Studio has been migrated from Firebase Auth to **Neon's Managed Better Auth**. This provides a fully integrated authentication solution that branches with your database and requires zero external configuration.

## What Changed

### ❌ Removed (Firebase)
- `src/lib/firebase.ts` - Firebase client library
- `src/lib/firebase-admin.ts` - Firebase Admin SDK
- `firebase-applet-config.json` - Firebase project configuration
- `FIREBASE_OAUTH_SETUP.md` - Firebase setup documentation
- All `firebase` and `firebase-admin` npm dependencies

### ✅ Added (Neon Auth)
- `src/lib/neon-auth.ts` - Neon Auth client library
- Updated `src/middleware/neon-auth.ts` - Backend JWT verification
- Updated `src/state/useAppStore.ts` - Frontend state management
- `NEON_AUTH_MIGRATION.md` - This migration guide

### 🔄 Modified
- `server.ts` - Now uses Neon Auth middleware
- All documentation updated to reference Neon Auth
- Authentication flow simplified (no external OAuth configuration needed)

## Benefits of Neon Auth

### 1. **Zero External Configuration**
- No Firebase Console setup required
- No OAuth redirect domains to configure
- No API keys to manage separately
- Everything configured in `.env.local`

### 2. **Branches With Your Database**
- Auth data stored in your Neon Postgres database
- Create a branch → auth data branches too
- Perfect for development and staging environments

### 3. **Built on Better Auth**
- Modern, TypeScript-first auth library
- Flexible and extensible
- Well-documented and actively maintained

### 4. **Multiple Sign-In Methods**
- Google OAuth (popup-based, no redirects)
- Email/Password (sign-up and sign-in)
- Easy to add more providers in the future

### 5. **Secure by Default**
- JWT tokens with automatic refresh
- Backend token verification via Neon Auth middleware
- Sessions stored in localStorage with expiration

## How It Works

### Frontend Flow

```typescript
// 1. Initialize auth client
import { neonAuth } from '../lib/neon-auth';

// 2. Sign in with Google (opens popup)
const session = await neonAuth.signInWithGoogle();

// 3. Or sign in with email
const session = await neonAuth.signInWithEmail(email, password);

// 4. Token automatically stored in localStorage
// 5. API requests include Authorization header
```

### Backend Flow

```typescript
// 1. Request arrives with JWT token
Authorization: Bearer <jwt-token>

// 2. Neon Auth middleware verifies token
const decoded = verifyNeonAuthToken(token);

// 3. User loaded from database
const dbUser = await getOrCreateDbUser({ uid, email, displayName });

// 4. Request proceeds with user context
req.authUser = { uid, email, role, ... };
```

### OAuth Popup Flow

```
User clicks "Sign In with Google"
    ↓
Opens popup: neonauth.../oauth/google
    ↓
User authorizes in Google
    ↓
Popup redirects to callback URL
    ↓
postMessage sends token to parent window
    ↓
Token stored, popup closes
    ↓
User authenticated
```

## Configuration

### Environment Variables

**.env.local** (Backend):
```env
DATABASE_URL=postgresql://...
NEON_AUTH_URL=https://ep-solitary-butterfly-bdmhkkvn.neonauth.c-8.us-east-2.aws.neon.tech/neondb/auth
```

**Frontend** (Vite):
```env
VITE_NEON_AUTH_URL=https://ep-solitary-butterfly-bdmhkkvn.neonauth.c-8.us-east-2.aws.neon.tech/neondb/auth
```

That's it! No OAuth app registration, no redirect URLs to configure, no authorized domains to add.

## API Reference

### Neon Auth Client (`src/lib/neon-auth.ts`)

```typescript
// Get current session
const session = neonAuth.getSession();

// Get JWT token
const token = neonAuth.getToken();

// Get current user
const user = neonAuth.getCurrentUser();

// Sign in with Google (popup)
const session = await neonAuth.signInWithGoogle();

// Sign in with email
const session = await neonAuth.signInWithEmail(email, password);

// Sign up with email
const session = await neonAuth.signUpWithEmail(email, password, name);

// Sign out
await neonAuth.signOut();

// Refresh session
const newSession = await neonAuth.refreshSession();
```

### Session Object

```typescript
interface NeonAuthSession {
  token: string;              // JWT token
  user: NeonAuthUser;         // User data
  expiresAt: Date;            // Session expiration
}

interface NeonAuthUser {
  id: string;                 // User ID
  email: string;              // Email address
  name: string;               // Display name
  image?: string;             // Profile picture URL
  emailVerified: boolean;     // Email verification status
  createdAt: Date;            // Account creation date
  updatedAt: Date;            // Last update date
}
```

## Backend Middleware

### `requireAuthOrDemo`
- Verifies JWT token from Authorization header
- Loads or creates user in database
- Attaches user to `req.authUser`
- Supports demo mode for backward compatibility

### `requireAuthenticatedUser`
- Requires Bearer token (no demo mode)
- Rejects requests without proper auth

### `requireAdmin`
- Requires authentication
- Verifies user has admin role
- Prevents demo mode access

## Migration Checklist

If you're migrating an existing project:

- [ ] Install Neon Auth (already using Neon? Auth is built-in!)
- [ ] Remove Firebase dependencies
  ```bash
  npm uninstall firebase firebase-admin
  ```
- [ ] Delete Firebase files
  - `src/lib/firebase.ts`
  - `src/lib/firebase-admin.ts`
  - `firebase-applet-config.json`
- [ ] Update environment variables
  - Remove `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, etc.
  - Add `NEON_AUTH_URL` (get from Neon dashboard)
  - Add `VITE_NEON_AUTH_URL` for frontend
- [ ] Update imports
  - Replace `import { auth } from '../lib/firebase'`
  - With `import { neonAuth } from '../lib/neon-auth'`
- [ ] Update sign-in calls
  - Replace `signInWithPopup(auth, googleAuthProvider)`
  - With `neonAuth.signInWithGoogle()`
- [ ] Update middleware
  - Replace Firebase token verification
  - With Neon Auth JWT verification
- [ ] Test authentication flow
  - Sign in with Google
  - Sign in with email
  - Sign out
  - Protected routes
  - API authentication

## Troubleshooting

### "Auth token invalid"
**Solution**: Sign out and sign back in. Tokens from Firebase are not compatible with Neon Auth.

### "NEON_AUTH_URL is not defined"
**Solution**: Add `NEON_AUTH_URL` to `.env.local` and restart the server.

### Google OAuth popup blocked
**Solution**: Allow popups for localhost in your browser settings.

### "Cannot read property 'token' of null"
**Solution**: User is not signed in. Check `neonAuth.getSession()` before accessing token.

### Session expires quickly
**Solution**: Sessions auto-refresh when needed. If refresh fails, user is signed out automatically.

## Comparison: Firebase vs Neon Auth

| Feature | Firebase Auth | Neon Auth |
|---------|---------------|-----------|
| **Setup Complexity** | High (Console + SDK) | Low (just env var) |
| **OAuth Configuration** | Manual (authorized domains) | Automatic |
| **Data Storage** | Firebase servers | Your Neon Postgres |
| **Branching Support** | No | Yes ✅ |
| **Email/Password** | Yes | Yes |
| **Google OAuth** | Yes | Yes |
| **GitHub OAuth** | Yes | Easy to add |
| **Token Type** | Firebase ID Token | JWT |
| **Session Management** | Firebase SDK | localStorage + auto-refresh |
| **Backend Verification** | Firebase Admin SDK | Simple JWT decode |
| **Cost** | Free tier limits | Included with Neon |
| **Privacy** | Data on Google servers | Data in your database |

## Next Steps

1. ✅ **Migration Complete** - All Firebase code removed
2. ✅ **Documentation Updated** - All guides reference Neon Auth
3. 🔄 **Test Everything** - Sign in, sign out, protected routes
4. 🚀 **Deploy** - Push to production with new auth system

## Resources

- **Neon Auth Docs**: https://neon.com/docs/guides/auth
- **Better Auth Docs**: https://better-auth.com/docs
- **Neon Console**: https://console.neon.tech

## Support

For issues with Neon Auth:
1. Check `.env.local` has correct `NEON_AUTH_URL`
2. Verify server is running: `npm run dev`
3. Clear browser localStorage and try again
4. Check browser console for errors
5. Review `STARTUP_GUIDE.md` for common issues

---

**Migration completed successfully!** 🎉

No more Firebase configuration needed. Just set your `NEON_AUTH_URL` and you're ready to go.
