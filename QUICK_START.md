# Quick Start - 2 Steps to Get Running

## Step 1: Start the Server

```bash
npm run dev
```

Server starts on: http://localhost:3000

## Step 2: Sign In

1. Open http://localhost:3000
2. Click "**Sign In with Google**" or "**Sign Up with Email**"
3. Complete authentication via Neon Auth
4. You should land on the Dashboard

🎉 **You're all set!**

---

## What Is Neon Auth?

Vellum Studio uses **Neon's Managed Better Auth** - no Firebase needed!

- ✅ Google OAuth built-in
- ✅ Email/password sign-up and sign-in
- ✅ Automatic session management
- ✅ JWT tokens verified on backend
- ✅ Branches with your database

## What Was Fixed?

✅ **Migrated from Firebase to Neon Auth**  
✅ Favicon (no more 404)  
✅ Authentication required for all pages  
✅ Improved landing page  
✅ Removed insecure demo mode  

## Need Help?

- **Server issues**: See `STARTUP_GUIDE.md`  
- **Full details**: See `CHANGES_SUMMARY.md`

## Protected Pages

These now require sign-in:
- Dashboard (`/dashboard`)
- Editor (`/editor/:id`)
- Templates (`/templates`)
- Generator (`/create`)
- Profile (`/profile`)
- Admin (`/admin`)

## Still Not Working?

### Server won't start?
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Install dependencies if needed
npm install
```

### Can't sign in?
- Check `.env.local` has `NEON_AUTH_URL`
- Clear browser cache and localStorage
- Try incognito mode
- Verify server is running

### Need to check your auth URL?
Look in `.env.local` for:
```
NEON_AUTH_URL=https://...neonauth...
```

---

**That's it!** Two steps and you're running. 🚀

For detailed information, see:
- `STARTUP_GUIDE.md`
- `CHANGES_SUMMARY.md`  
- `ARCHITECTURE.md`

---

## What Was Fixed?

✅ Favicon (no more 404)  
✅ Authentication required for all pages  
✅ Improved landing page  
✅ Removed insecure demo mode  

## Need Help?

- **OAuth errors**: See `FIREBASE_OAUTH_SETUP.md`
- **Server issues**: See `STARTUP_GUIDE.md`  
- **Full details**: See `CHANGES_SUMMARY.md`

## Protected Pages

These now require sign-in:
- Dashboard (`/dashboard`)
- Editor (`/editor/:id`)
- Templates (`/templates`)
- Generator (`/create`)
- Profile (`/profile`)
- Admin (`/admin`)

## Still Not Working?

### Server won't start?
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Install dependencies if needed
npm install
```

### OAuth still failing?
- Clear browser cache
- Try incognito mode
- Wait 1-2 minutes after adding domain
- Verify you added `localhost` not `localhost:3000`

### Need the demo back?
Sorry, it was removed for security. Sign-in is required for all features.

---

**That's it!** Three steps and you're running. 🚀

For detailed information, see the comprehensive guides in:
- `STARTUP_GUIDE.md`
- `FIREBASE_OAUTH_SETUP.md`  
- `CHANGES_SUMMARY.md`
