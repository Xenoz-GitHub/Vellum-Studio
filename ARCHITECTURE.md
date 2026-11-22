# Vellum Studio - Authentication Architecture

## Overview

Vellum Studio now has a secure authentication system that requires Google OAuth sign-in for all protected pages.

## Route Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Routes                      │
└─────────────────────────────────────────────────────────────┘

PUBLIC ROUTES (No Auth Required)
┌──────────────────┐     ┌──────────────────┐
│  Landing Page    │     │  Share View      │
│  /               │     │  /share/:token   │
└──────────────────┘     └──────────────────┘
        │                         │
        └─────────┬───────────────┘
                  │
         No Authentication
              Required

PROTECTED ROUTES (Auth Required)
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Dashboard       │     │  Editor          │     │  Generator       │
│  /dashboard      │     │  /editor/:id     │     │  /create         │
└──────────────────┘     └──────────────────┘     └──────────────────┘
        │                         │                         │
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Templates       │     │  Profile         │     │  Admin           │
│  /templates      │     │  /profile        │     │  /admin          │
└──────────────────┘     └──────────────────┘     └──────────────────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
                            AuthGuard
                                  │
                      ┌───────────┴────────────┐
                      │                        │
                 Authenticated          Not Authenticated
                      │                        │
                 Allow Access          Show Sign-in Prompt
```

## Authentication Flow

### New User Sign-Up/Sign-In

```
┌─────────────┐
│ User visits │
│   Landing   │
└──────┬──────┘
       │
       ▼
┌────────────────────────┐
│ Clicks "Get Started"   │
│ or "Sign In"           │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Firebase OAuth Popup   │
│ (Google Sign-In)       │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ User authorizes access │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Firebase returns token │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Token stored in state  │
│ API calls use token    │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Backend verifies token │
│ Creates/loads user DB  │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ User redirected to     │
│ Dashboard              │
└────────────────────────┘
```

### Protected Page Access

```
User requests /dashboard
       │
       ▼
┌─────────────────┐
│   AuthGuard     │
│  Component      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
Signed In  Not Signed In
    │         │
    ▼         ▼
Allow    Show Auth
Access   Required
│        Screen
│            │
│            ▼
│        ┌───────────┐
│        │ Sign In   │
│        │ Button    │
│        └─────┬─────┘
│              │
│              ▼
│        OAuth Flow
│              │
└──────────────┘
         │
         ▼
    Dashboard
```

## Component Architecture

```
src/
├── App.tsx
│   ├── Route handling
│   └── AuthGuard integration
│
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx ◄─── New! Route protection
│   │       ├── Checks authentication state
│   │       ├── Shows loading spinner
│   │       ├── Blocks unauthorized access
│   │       └── Shows sign-in prompt
│   │
│   └── layout/
│       └── TopNav.tsx
│           ├── Shows sign-in button if not authenticated
│           └── Triggers sign-in on protected route clicks
│
├── pages/
│   ├── LandingPage.tsx (Public)
│   ├── ShareViewPage.tsx (Public)
│   │
│   ├── DashboardPage.tsx (Protected)
│   ├── EditorPage.tsx (Protected)
│   ├── TemplatesPage.tsx (Protected)
│   ├── GeneratorStudioPage.tsx (Protected)
│   ├── ProfilePage.tsx (Protected)
│   └── AdminPage.tsx (Protected)
│
└── state/
    └── useAppStore.ts
        ├── Firebase auth state
        ├── User profile
        └── Sign-in methods
```

## State Management

### Auth State Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      useAppStore (Zustand)                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  State:                                                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ firebaseUser: FirebaseUser | null                    │    │
│  │ profile: UserProfile | null                          │    │
│  │ isDemo: boolean (always false now)                   │    │
│  │ authReady: boolean                                   │    │
│  │ authError: string | null                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Actions:                                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ initAuth()           - Initialize Firebase listener  │    │
│  │ signInWithGoogle()   - OAuth sign-in popup          │    │
│  │ logout()             - Sign out and clear state      │    │
│  │ refreshProfile()     - Reload user data from API     │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

## API Authentication

### Request Flow

```
Frontend Request
       │
       ▼
┌─────────────────────┐
│ Add Authorization   │
│ Header with token   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Backend receives    │
│ request             │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ requireAuthOrDemo   │
│ middleware          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Verify Firebase     │
│ ID token            │
└──────┬──────────────┘
       │
   ┌───┴────┐
   │        │
Valid   Invalid
   │        │
   ▼        ▼
Allow    Reject
Access   (401)
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Frontend Route Protection (AuthGuard)              │
│  └─► Prevents UI access, shows sign-in prompt               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: API Request Headers                                 │
│  └─► Authorization: Bearer <firebase-token>                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Backend Token Verification                          │
│  └─► Firebase Admin SDK verifies token signature            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Database User Record                                │
│  └─► User exists, not suspended, correct role                │
└─────────────────────────────────────────────────────────────┘
```

## Removed: Demo Workspace

### Before (Insecure)
```
Landing Page
    │
    ├── Sign In with Google ─► Authenticated
    │
    └── Try Demo Workspace ─► Bypass Auth ❌
            │
            └─► Access all features without account
```

### After (Secure)
```
Landing Page
    │
    └── Get Started Now ─► Sign In with Google
            │
            └─► Authenticated ✓
                    │
                    └─► Access all features
```

## Data Flow

### User Authentication Data

```
Firebase Auth
    │
    ├─► UID (unique identifier)
    ├─► Email
    ├─► Display Name
    ├─► Photo URL
    └─► ID Token (JWT)
         │
         ▼
Backend API
    │
    └─► Verify token
         │
         ▼
    PostgreSQL Database
         │
         ├─► users table
         │   ├── uid (primary key)
         │   ├── email
         │   ├── displayName
         │   ├── role (user/admin)
         │   └── status (active/suspended)
         │
         ├─► presentations (owned by uid)
         ├─► uploadedAssets (owned by uid)
         └─► userActivities (tracks user uid)
```

## Error Handling

### Authentication Errors

```
┌──────────────────────────────┐
│ User attempts sign-in        │
└──────────┬───────────────────┘
           │
    ┌──────┴──────┐
    │             │
Success      Error
    │             │
    │      ┌──────┴───────────────────────────┐
    │      │                                   │
    │  Network Error              OAuth Denied
    │      │                           │
    │      ▼                           ▼
    │  Show retry            Show "Sign-in 
    │  message               cancelled" message
    │      │                           │
    │      └───────────┬───────────────┘
    │                  │
    ▼                  ▼
Dashboard      Stay on Landing
```

## Future Enhancements

### Potential Additions

1. **Onboarding Flow** (Component ready: `OnboardingPage.tsx`)
   ```
   First Sign-In
       │
       ▼
   Onboarding Wizard
       │
       ├─► Step 1: Welcome
       ├─► Step 2: Features Tour
       ├─► Step 3: Customization
       └─► Step 4: Get Started
           │
           ▼
       Dashboard
   ```

2. **Email/Password Auth** (optional)
   - Add Firebase email/password provider
   - Password reset flow
   - Email verification

3. **Multi-Factor Authentication**
   - SMS verification
   - Authenticator app
   - Backup codes

4. **Session Management**
   - Remember device
   - Active sessions view
   - Sign out all devices

## Files Reference

### Core Auth Files
- `src/components/auth/AuthGuard.tsx` - Route protection
- `src/lib/firebase.ts` - Firebase client config
- `src/state/useAppStore.ts` - Auth state management
- `src/middleware/auth.ts` - Backend auth middleware

### Configuration
- `firebase-applet-config.json` - Firebase project config
- `.env.local` - Environment variables
- `.env.example` - Template for environment variables

### Documentation
- `QUICK_START.md` - 3-step getting started
- `FIREBASE_OAUTH_SETUP.md` - OAuth configuration
- `STARTUP_GUIDE.md` - Complete development guide
- `CHANGES_SUMMARY.md` - All changes made
- `ARCHITECTURE.md` - This file
