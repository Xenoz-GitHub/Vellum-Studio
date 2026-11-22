# Vellum Studio - Presentation Design Platform

> A professional presentation design platform with AI-powered generation, editorial design system, and **Neon Auth** authentication.

## 🚀 Quick Start

### Step 1: Install & Configure

```bash
# Install dependencies
npm install
```

Make sure `.env.local` has your Neon credentials:
```env
DATABASE_URL=postgresql://...
NEON_AUTH_URL=https://...neonauth...
```

### Step 2: Run

```bash
# Start development server
npm run dev
```

Server runs on: **http://localhost:3000**

### Step 3: Sign In

1. Open http://localhost:3000
2. Click "**Sign In with Google**" or sign up with email
3. Authenticate via Neon Auth
4. Access the Dashboard

🎉 **You're ready to create presentations!**

## 📚 Documentation

### Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - 2-step setup guide
- **[STARTUP_GUIDE.md](./STARTUP_GUIDE.md)** - Complete development guide

### Reference
- **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** - What was fixed and improved
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture & auth flow
- **[README_NEON.md](./README_NEON.md)** - Neon database documentation

## ✨ What's New

### Recent Updates
✅ **Migrated to Neon Auth** - Uses Neon's Managed Better Auth instead of Firebase  
✅ **Authentication Required** - All pages now require sign-in  
✅ **Removed Demo Mode** - Secure authentication for all features  
✅ **Fixed Favicon** - No more 404 errors  
✅ **Improved Landing Page** - Better CTAs and user flow

## 🎯 Features

### Core Capabilities
- 🎨 **Visual Editor** - Drag-and-drop presentation builder
- 🤖 **AI Generation** - Create presentations from prompts
- 📑 **Template Library** - Professional pre-designed templates
- 🎭 **Design Tokens** - Consistent design system
- 📤 **PPTX Export** - Export to editable PowerPoint
- 🔗 **Share Links** - Collaborative sharing with permissions
- 👥 **User Profiles** - Track progress and achievements

### Authentication & Security
- 🔐 Neon Auth (Managed Better Auth)
- 🌐 Google OAuth + Email/Password sign-in
- 🛡️ Protected routes with AuthGuard
- 🔑 JWT token verification
- 👤 User role management (user/admin)
- 🔄 Automatic session refresh

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx          # Route protection
│   ├── editor/                    # Visual editor components
│   ├── layout/
│   │   └── TopNav.tsx            # Navigation bar
│   └── renderer/                  # Slide rendering
│
├── pages/
│   ├── LandingPage.tsx           # Public landing page
│   ├── DashboardPage.tsx         # Protected - user workspace
│   ├── EditorPage.tsx            # Protected - editor
│   ├── TemplatesPage.tsx         # Protected - templates
│   ├── GeneratorStudioPage.tsx   # Protected - AI generation
│   ├── ProfilePage.tsx           # Protected - user profile
│   └── AdminPage.tsx             # Protected - admin panel
│
├── state/
│   └── useAppStore.ts            # Global state & auth
│
└── lib/
    ├── neon-auth.ts              # Neon Auth client
    └── api.ts                    # API client
```

## 🔒 Protected Routes

The following pages require authentication:

- `/dashboard` - User workspace
- `/editor/:id` - Presentation editor
- `/templates` - Template browser
- `/create` - AI generation studio
- `/profile` - User profile
- `/admin` - Admin console (requires admin role)

Public pages (no auth required):
- `/` - Landing page
- `/share/:token` - Shared presentations

## 🛠️ Development

### Commands

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build            # Production build
npm run preview          # Preview build

# Type Checking
npm run lint             # TypeScript check
```

### Environment Variables

Required in `.env.local`:

```env
# Database
DATABASE_URL=postgresql://...

# Auth (optional)
NEON_AUTH_URL=https://...

# AI Features (optional)
GEMINI_API_KEY=

# Admin Access (optional)
ADMIN_EMAILS=admin@example.com
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **Can't sign in** | Check NEON_AUTH_URL in `.env.local` |
| **ERR_CONNECTION_REFUSED** | Start server with `npm run dev` |
| **Can't access dashboard** | Sign in required (working as intended) |
| **Port 3000 in use** | Kill process: `netstat -ano \| findstr :3000` |
| **Favicon 404** | Fixed ✅ |
| **Auth token invalid** | Sign out and sign back in, clear localStorage |

### Still Having Issues?

1. Check [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) for detailed troubleshooting
2. Verify Firebase OAuth is configured correctly
3. Ensure `.env.local` exists with DATABASE_URL
4. Try clearing browser cache

## 📦 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **Lucide Icons** - Icon library

### Backend
- **Express** - API server
- **Neon PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Neon Auth** - Managed Better Auth
- **PptxGenJS** - PowerPoint export

### Authentication
- **Neon Auth** - OAuth & email/password provider
- **Google Sign-In** - Primary OAuth method
- **Better Auth** - Underlying auth framework (managed by Neon)

## 🎓 Learning Resources

### For Users
- Landing page has interactive demo
- FAQ section explains features
- Templates show best practices

### For Developers
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) - Recent changes
- Code comments throughout project

## 🔐 Security

- ✅ Neon Auth with JWT tokens
- ✅ Google OAuth + Email/Password
- ✅ Protected API endpoints
- ✅ User role validation
- ✅ XSS protection with React
- ✅ HTTPS required in production
- ✅ Automatic session refresh
- ❌ Demo mode removed (security improvement)

## 🚢 Deployment

### Before Deploying

1. ✅ Verify Neon Auth URL is configured
2. ✅ Set environment variables on hosting platform
3. ✅ Run production build: `npm run build`
4. ✅ Test authentication flow
5. ✅ Verify database connection

### Environment Variables for Production

Set these on your hosting platform:
- `DATABASE_URL` - Neon Postgres connection string
- `NEON_AUTH_URL` - Your Neon Auth endpoint
- `VITE_NEON_AUTH_URL` - Same as NEON_AUTH_URL (for frontend)
- `GEMINI_API_KEY` - Optional, for AI features
- `ADMIN_EMAILS` - Optional, comma-separated

## 📝 License

Private project - All rights reserved

## 🤝 Support

For issues or questions:
1. Check the troubleshooting guides
2. Review documentation in this repo
3. Verify Firebase OAuth configuration

## 🎯 Next Steps

1. **Immediate**: Start the server with `npm run dev`
2. **Test**: Sign in and create a presentation
3. **Explore**: Try templates and AI generation
4. **Customize**: Adjust design tokens and themes
5. **Deploy**: Follow deployment guide above

---

**Quick Links:**
- [Quick Start](./QUICK_START.md)
- [Startup Guide](./STARTUP_GUIDE.md)
- [Architecture](./ARCHITECTURE.md)
- [Changes Log](./CHANGES_SUMMARY.md)

**Built with Neon Auth & Lakebase Postgres** 🚀
