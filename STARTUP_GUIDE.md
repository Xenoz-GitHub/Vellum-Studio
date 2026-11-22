# Vellum Studio - Startup & Troubleshooting Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Make sure `.env.local` exists with your Neon credentials:
```env
DATABASE_URL=postgresql://...
NEON_AUTH_URL=https://...neonauth...
```

### 3. Start the Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Authentication with Neon Auth

Vellum Studio uses **Neon's Managed Better Auth** for authentication. No Firebase configuration needed!

### How Neon Auth Works
- OAuth with Google (popup-based)
- Email/password sign-in and sign-up
- JWT tokens stored in localStorage
- Automatic session refresh

### First-Time Setup
1. Your Neon Auth URL is already configured in `.env.local`
2. Start the server: `npm run dev`
3. Visit `http://localhost:3000`
4. Click "Sign In with Google" or create an account with email
5. Done! You're authenticated

## What's Fixed

### ✅ Migrated from Firebase to Neon Auth
- Removed all Firebase dependencies
- Implemented Neon Auth client (`src/lib/neon-auth.ts`)
- Updated backend middleware to use Neon Auth tokens
- OAuth with Google now uses Neon's Managed Better Auth

### ✅ Favicon Added
- Created `/public/favicon.svg`
- Added to `index.html`
- **404 error is now resolved**

### ✅ Authentication Required
- All restricted pages now require authentication
- Removed demo workspace option (for security)
- Added AuthGuard component for route protection
- Pages requiring authentication:
  - Dashboard (`/dashboard`)
  - Editor (`/editor/:id`)
  - Templates (`/templates`)
  - Generator Studio (`/create`)
  - Profile (`/profile`)
  - Admin (`/admin`)

### ✅ Landing Page Improvements
- Better CTA buttons
- Cleaner sign-in flow
- Improved visual hierarchy

## Current Architecture

### Authentication Flow
```
Landing Page (Public)
    ↓
Sign In with Google (Neon Auth) or Email
    ↓
JWT Token Stored
    ↓
Authentication Check (AuthGuard)
    ↓
Dashboard / Protected Pages
```

### Protected Routes
All routes except Landing and Share pages require authentication. If a user tries to access a protected route without being signed in, they'll see an authentication prompt.

## Troubleshooting

### Issue: "ERR_CONNECTION_REFUSED" on API calls

**Cause**: Backend server is not running

**Solution**:
```bash
# Make sure the server is running
npm run dev
```

The server runs on port 3000 and serves both the API and the Vite frontend.

### Issue: Can't access Dashboard/Editor/etc.

**Cause**: These pages now require authentication

**Solution**: 
1. Go to landing page
2. Click "Sign In with Google" or sign up with email
3. Complete authentication
4. You'll be redirected to the requested page

### Issue: Server won't start

**Possible causes and solutions**:

1. **Port 3000 is already in use**
   ```bash
   # Windows: Find and kill process on port 3000
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Missing dependencies**
   ```bash
   npm install
   ```

3. **Environment variables not loaded**
   - Check that `.env.local` exists
   - Verify DATABASE_URL and NEON_AUTH_URL are set

### Issue: Database connection errors

**Check**:
1. `.env.local` has valid DATABASE_URL
2. Neon database is accessible
3. Connection string includes `sslmode=require`

### Issue: "Auth token invalid"

**Solution**:
1. Sign out and sign back in
2. Clear browser localStorage
3. Check that NEON_AUTH_URL in `.env.local` is correct

## Environment Variables

Required in `.env.local`:
```bash
DATABASE_URL=postgresql://...       # Neon PostgreSQL connection
NEON_AUTH_URL=https://...           # Neon Auth endpoint
GEMINI_API_KEY=                     # For AI generation (optional)
ADMIN_EMAILS=                       # Comma-separated admin emails (optional)
```

Frontend environment (for Vite):
```bash
VITE_NEON_AUTH_URL=https://...     # Same as NEON_AUTH_URL
```

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx         # Route protection component
│   ├── editor/                   # Editor components
│   ├── layout/
│   │   └── TopNav.tsx           # Navigation bar
│   └── renderer/                 # Slide rendering
├── pages/
│   ├── LandingPage.tsx          # Public landing
│   ├── DashboardPage.tsx        # Protected - requires auth
│   ├── EditorPage.tsx           # Protected - requires auth
│   └── ...
├── state/
│   └── useAppStore.ts           # Global state & auth
├── lib/
│   ├── neon-auth.ts             # Neon Auth client
│   └── api.ts                   # API client
└── middleware/
    └── neon-auth.ts             # Backend auth verification
```

## Features Status

### ✅ Working
- Landing page with animations
- Neon Auth (Google OAuth + Email/Password)
- Protected routes with AuthGuard
- Navigation with auth checks
- Favicon loading
- Server API endpoints

### ⚠️ Requires Setup
- Optional: Gemini API key for AI generation
- Optional: Admin emails for admin access

## Development Commands

```bash
# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint
```

## Next Steps

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Test authentication flow**
   - Visit landing page
   - Click "Sign In with Google" or sign up with email
   - Verify redirect to dashboard works

3. **Optional: Add Gemini API key**
   - Get key from Google AI Studio
   - Add to `.env.local` as `GEMINI_API_KEY=your_key`
   - Enables AI presentation generation

## Security Notes

- Demo workspace removed for security
- All user data requires authentication
- Share links still work without authentication (view-only)
- Admin pages check for admin role in addition to authentication
- JWT tokens managed by Neon Auth
- Sessions automatically refresh when needed

## Support

For issues:
1. Check this guide first
2. Verify `.env.local` has correct Neon Auth URL
3. Check browser console for specific errors
4. Verify server is running and accessible

## Neon Auth Features

- **Google OAuth**: Popup-based, no redirect needed
- **Email/Password**: Built-in sign-up and sign-in
- **Session Management**: Automatic token refresh
- **Secure**: JWT tokens verified on backend
- **Branching**: Auth data branches with your database

## Differences from Firebase

| Feature | Firebase | Neon Auth |
|---------|----------|-----------|
| Provider | Google Firebase | Neon (Managed Better Auth) |
| Sign-in methods | OAuth, Email/Password | OAuth, Email/Password |
| Token type | Firebase ID Token | JWT |
| Storage | Firebase servers | Neon Postgres |
| Configuration | Firebase Console + SDK | .env.local only |
| Branches | No | Yes (branches with DB) |


## What's Fixed

### ✅ Favicon Added
- Created `/public/favicon.svg`
- Added to `index.html`
- **404 error is now resolved**

### ✅ Authentication Required
- All restricted pages now require Google sign-in
- Removed demo workspace option
- Added AuthGuard component for route protection
- Pages requiring authentication:
  - Dashboard (`/dashboard`)
  - Editor (`/editor/:id`)
  - Templates (`/templates`)
  - Generator Studio (`/create`)
  - Profile (`/profile`)
  - Admin (`/admin`)

### ✅ Landing Page Improvements
- Added animated background gradients
- Improved button designs with hover effects
- Added motion animations using Framer Motion
- Better visual hierarchy and spacing
- Gradient text for key phrases
- Enhanced CTA buttons with scale and shadow effects
- Feature icons with color coding

### ✅ Onboarding Flow
- Created new `OnboardingPage.tsx` (ready to integrate)
- Multi-step walkthrough with animations
- Progress indicator
- Google Sign-in integration

## Current Architecture

### Authentication Flow
```
Landing Page (Public)
    ↓
Sign In with Google
    ↓
Authentication Check (AuthGuard)
    ↓
Dashboard / Protected Pages
```

### Protected Routes
All routes except Landing and Share pages require authentication. If a user tries to access a protected route without being signed in, they'll see an authentication prompt with a Google sign-in button.

## Troubleshooting

### Issue: "ERR_CONNECTION_REFUSED" on API calls

**Cause**: Backend server is not running

**Solution**:
```bash
# Make sure the server is running
npm run dev
```

The server runs on port 3000 and serves both the API and the Vite frontend.

### Issue: "OAuth domain not authorized"

**Cause**: Firebase doesn't allow OAuth from localhost

**Solution**: Add `localhost` to Firebase authorized domains (see FIREBASE_OAUTH_SETUP.md)

### Issue: Can't access Dashboard/Editor/etc.

**Cause**: These pages now require authentication

**Solution**: 
1. Go to landing page
2. Click "Sign In with Google"
3. Complete OAuth flow
4. You'll be redirected to the requested page

### Issue: Server won't start

**Possible causes and solutions**:

1. **Port 3000 is already in use**
   ```bash
   # Windows: Find and kill process on port 3000
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Missing dependencies**
   ```bash
   npm install
   ```

3. **Environment variables not loaded**
   - Check that `.env.local` exists
   - Verify DATABASE_URL is set

### Issue: Database connection errors

**Check**:
1. `.env.local` has valid DATABASE_URL
2. Neon database is accessible
3. Connection string includes `sslmode=require`

## Environment Variables

Required in `.env.local`:
```bash
DATABASE_URL=postgresql://... # Neon PostgreSQL connection
NEON_AUTH_URL=https://...     # Neon Auth endpoint (optional)
GEMINI_API_KEY=               # For AI generation (optional)
ADMIN_EMAILS=                 # Comma-separated admin emails (optional)
```

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx         # Route protection component
│   ├── editor/                   # Editor components
│   ├── layout/
│   │   └── TopNav.tsx           # Navigation bar
│   └── renderer/                 # Slide rendering
├── pages/
│   ├── LandingPage.tsx          # Public landing (animated)
│   ├── DashboardPage.tsx        # Protected - requires auth
│   ├── EditorPage.tsx           # Protected - requires auth
│   ├── OnboardingPage.tsx       # New onboarding flow
│   └── ...
├── state/
│   └── useAppStore.ts           # Global state & auth
└── lib/
    ├── firebase.ts              # Firebase client config
    └── api.ts                   # API client
```

## Features Status

### ✅ Working
- Landing page with animations
- Google OAuth sign-in
- Protected routes with AuthGuard
- Navigation with auth checks
- Favicon loading
- Server API endpoints

### ⚠️ Requires Setup
- Firebase OAuth domain authorization (see FIREBASE_OAUTH_SETUP.md)
- Optional: Gemini API key for AI generation
- Optional: Admin emails for admin access

### 🚧 To Integrate (Files Ready)
- OnboardingPage.tsx - Multi-step welcome flow

## Development Commands

```bash
# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint
```

## Next Steps

1. **Complete Firebase OAuth setup** (CRITICAL)
   - Add `localhost` to authorized domains in Firebase Console
   
2. **Test authentication flow**
   - Visit landing page
   - Click "Sign In with Google"
   - Verify redirect to dashboard works

3. **Optional: Add Gemini API key**
   - Get key from Google AI Studio
   - Add to `.env.local` as `GEMINI_API_KEY=your_key`
   - Enables AI presentation generation

4. **Optional: Integrate onboarding**
   - Import OnboardingPage component
   - Show on first sign-in
   - Store completion in user preferences

## Support

For issues:
1. Check this guide first
2. Review `FIREBASE_OAUTH_SETUP.md` for OAuth issues
3. Check browser console for specific errors
4. Verify server is running and accessible

## Security Notes

- Demo workspace has been removed for security
- All user data requires authentication
- Share links still work without authentication (view-only)
- Admin pages check for admin role in addition to authentication
