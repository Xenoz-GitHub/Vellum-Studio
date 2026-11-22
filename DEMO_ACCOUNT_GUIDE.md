# 👀 Demo Account - User Guide

## What is the Demo Account?

The demo account allows users to try Vellum Studio **without signing up**! Perfect for:
- Quick product exploration
- Testing features before committing
- Showcasing the platform to others
- Getting started instantly

## How to Access Demo Account

### Method 1: Landing Page Button (New!)
1. Visit the landing page at `http://localhost:3000`
2. Click the **"👀 TRY DEMO"** button in the hero section
3. You'll be instantly taken to the dashboard with demo presentations

### Method 2: "START FOR FREE" Button
1. Click **"START FOR FREE"** button on landing page
2. If not signed in, it enters demo mode automatically
3. Dashboard loads with pre-populated content

### Method 3: URL Parameter
1. Add `?autostart=1` to any URL
2. Example: `http://localhost:3000/?autostart=1`
3. Demo workspace activates automatically

## What's Included in Demo Account?

### Pre-loaded Presentations:
1. **Climate Data Report** ⭐ (Favorited)
   - Professional data visualization template
   - Multiple slides with charts and graphs
   - Based on "Climate Report" template

2. **Atelier Architecture**
   - Architectural monograph style
   - Clean, editorial design
   - Based on "Arch Monograph" template

3. **Public Materials Campaign**
   - Marketing campaign deck
   - Vibrant, eye-catching design
   - Based on "Pubmat Campaign" template

### Features Available:
- ✅ View all presentations
- ✅ Edit presentations
- ✅ Create new presentations
- ✅ Use all templates
- ✅ Export to PowerPoint/PDF/PNG
- ✅ Access all design tools
- ✅ Try AI generation features
- ✅ Customize colors and layouts
- ✅ Add custom components

### Limitations:
- ❌ No cloud sync (data stored locally)
- ❌ Cannot invite team members
- ❌ Resets on page refresh
- ℹ️ Upgrade to real account to save work permanently

## Demo User Details

```javascript
{
  uid: 'demo-workspace-user',
  email: 'studio-demo@vellum.local',
  displayName: 'Studio Demo',
  role: 'user',
  status: 'active'
}
```

## Technical Implementation

### How It Works:
1. User clicks demo button
2. `enterDemoWorkspace()` is called in app store
3. Sets `X-Demo-Workspace: 1` header on API requests
4. Backend creates/retrieves demo user
5. Seeds 3 demo presentations
6. User enters dashboard

### Code Flow:
```typescript
// Frontend (useAppStore.ts)
enterDemoWorkspace: async () => {
  setDemoWorkspaceActive(true);
  setApiAuthToken(null);
  const me = await apiFetch('/api/me');
  set({ profile: me.user, isDemo: true });
  navigate({ page: 'dashboard' });
}

// Backend (neon-auth.ts middleware)
if (demoHeader === '1') {
  const demoUser = await getOrCreateDbUser({
    uid: DEMO_USER_UID,
    email: 'studio-demo@vellum.local',
    displayName: 'Studio Demo'
  });
  req.authUser = demoUser;
}
```

### Database Seeding:
```typescript
// Demo presentations are created in ensureSeeded()
// See: src/db/repository.ts
// See: src/core/seed-data.ts (getDemoDecks)
```

## Converting Demo to Real Account

To save demo work and convert to real account:

1. Click **"SIGN IN"** button in navigation
2. Sign in with Google (or email)
3. All future work will be saved to your account
4. Demo work is not transferred (limitation)

**Recommendation**: Let users know upfront that demo work is temporary!

## Testing the Demo Account

### Test Checklist:
- [ ] Click "TRY DEMO" button on landing page
- [ ] Verify dashboard loads with 3 presentations
- [ ] Open "Climate Data Report" presentation
- [ ] Edit a slide (change text, colors)
- [ ] Create a new blank presentation
- [ ] Use a template to create presentation
- [ ] Export a presentation to PowerPoint
- [ ] Check that "Studio Demo" appears in nav
- [ ] Verify no sign-up was required

### Expected Behavior:
1. **Instant access** - no forms, no waiting
2. **Fully functional** - all features work
3. **Pre-populated content** - 3 demo decks visible
4. **Demo indicator** - "Studio Demo" shows in UI
5. **No persistence** - refresh clears demo state

## Troubleshooting

### Demo won't load?
- Check that server is running
- Check browser console for errors
- Verify database is seeded (`npm run db:seed`)

### Demo presentations missing?
- Run database seed: `npm run db:seed`
- Check `ensureSeeded()` function ran
- Verify demo user exists in database

### Can't sign out of demo?
- Click user menu → "Sign Out"
- Or refresh the page
- Demo state clears on sign out

## Best Practices

### For Users:
1. **Try before you buy** - explore all features
2. **Don't rely on demo** - work is not saved permanently
3. **Sign up when ready** - to save your creations
4. **Use demo for demos** - great for showing others!

### For Developers:
1. **Seed regularly** - ensure demo content is fresh
2. **Monitor demo usage** - track how many use it
3. **Clear old demo data** - implement cleanup if needed
4. **Test frequently** - demo is first impression!

## Marketing Messages

**On Landing Page:**
> "👀 TRY DEMO - See it in action! No signup required."

**Demo Banner (optional):**
> "You're using Demo Mode. Sign up to save your work! 🚀"

**After Demo Session:**
> "Love what you created? Sign up to save it forever! ✨"

## Analytics to Track

Suggested metrics:
- Demo button clicks
- Demo → Signup conversion rate
- Time spent in demo mode
- Features used in demo
- Exit points from demo

## Future Enhancements

Ideas to improve demo experience:
1. **Save demo work** - allow export before signup
2. **Guided tour** - show key features
3. **Demo templates** - more variety
4. **Demo timer** - gentle nudge to signup after 10 min
5. **Social sharing** - share demo creations
6. **Demo projects** - let users name/save locally

---

**Demo account is ready! 🎉 Users can try Vellum Studio instantly!**
