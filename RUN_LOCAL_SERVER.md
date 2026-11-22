# 🚀 Run Vellum Studio Locally

## Quick Start

### 1. Open a Terminal in This Directory

### 2. Start the Development Server

```bash
npm run dev
```

The server will start on **http://localhost:3000**

You should see output like:
```
> react-example@0.0.0 dev
> tsx server.ts

Server listening on port 3000
Vite dev server running
```

### 3. Test the API Endpoints

Open another terminal and run these commands:

#### Test Health
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
```

#### Test Credits (Demo User)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/credits" -Method Get -Headers @{"X-Demo-Workspace"="1"}
```

#### Test Generation
```powershell
$body = @{
    prompt = "Revolutionary AI Product Launch"
    slideCount = 6
    category = "Tech"
    themeId = "gallery-alabaster"
    aspectRatio = "16:9"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/generate" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{"X-Demo-Workspace"="1"} `
    -Body $body
```

#### Test Daily Bonus
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/credits/daily" `
    -Method Post `
    -Headers @{"X-Demo-Workspace"="1"}
```

### 4. Open in Browser

Visit **http://localhost:3000** to see the application UI.

## Alternative: Use the Test Script

We've created a comprehensive test script. Once your server is running, run:

```powershell
npx tsx test-local-endpoints.js
```

This will test all endpoints and show you the results.

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
# Note the PID and run:
taskkill /PID <PID> /F
```

### Database Connection Error

Make sure `.env.local` exists with:
```env
DATABASE_URL=postgresql://neondb_owner:npg_XqcIN7fL3dxA@ep-solitary-butterfly-bdmhkkvn-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Module Not Found

Reinstall dependencies:
```bash
npm install --legacy-peer-deps
```

## What to Expect

### Successful Server Start
You should see:
- ✅ Database connected
- ✅ Vite dev server running
- ✅ Server listening on port 3000

### First API Call Results
- **Health Check**: `{"ok": true, "service": "vellum-studio"}`
- **Credits**: Demo user starts with 100 credits
- **Generation**: Creates a presentation, deducts credits (~40-61 credits for 6 slides)
- **Daily Bonus**: +10 credits (once per day)

## Quick Test Checklist

Once server is running, verify:

- [ ] Health endpoint responds
- [ ] Credits show 100 (or less if you've generated)
- [ ] Generation creates a presentation
- [ ] Credits are deducted correctly
- [ ] Presentation appears in list
- [ ] Frontend loads at http://localhost:3000

## Next Steps

After confirming everything works locally:

1. Update frontend to use new features (stroke, vignette, mask)
2. Integrate Neon Auth properly
3. Add credits display in UI
4. Deploy to production

---

**Status**: ✅ Ready for local testing
**Port**: 3000
**Database**: Neon PostgreSQL (connected)
**Auth**: Demo mode (use X-Demo-Workspace: 1 header)
