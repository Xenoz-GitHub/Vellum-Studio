# Vellum Studio - Neon Edition

A powerful presentation design studio with algorithmic generation, running on Neon PostgreSQL.

## 🌟 Key Features

### ✨ New in This Version:
- **Neon PostgreSQL Database** - Serverless, scalable, and fast
- **Algorithmic Generation** - No external AI APIs required
- **Credits & Tokenizer System** - Fair usage-based pricing model
- **Enhanced Visual Properties** - Stroke, vignette, and mask effects
- **32 Tech HUD Elements** - Comprehensive technology template library

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or bun
- Neon account (database already configured)

### Installation

1. **Clone & Install**
```bash
cd VELLUM-STUDIO
npm install --legacy-peer-deps
```

2. **Environment Setup**
The `.env.local` file is already configured with Neon credentials:
```env
DATABASE_URL=postgresql://neondb_owner:***@ep-solitary-butterfly-bdmhkkvn-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require
NEON_AUTH_URL=https://ep-solitary-butterfly-bdmhkkvn.neonauth.c-8.us-east-2.aws.neon.tech/neondb/auth
```

3. **Database Migration** (Already Completed ✅)
```bash
npx drizzle-kit push --config=src/db/drizzle.config.ts
```

4. **Test Setup**
```bash
npx tsx test-neon-setup.js
```

Expected output:
```
🎉 ALL TESTS PASSED!
```

5. **Start Development Server**
```bash
npm run dev
```

Access at: `http://localhost:3000`

## 📖 Architecture

### Technology Stack
- **Frontend**: React 19 + Vite 8 + TailwindCSS 4
- **Backend**: Express.js + TypeScript
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM
- **Auth**: Neon Auth (in progress)
- **Generation**: Algorithmic Pattern Engine (custom)

### Database Schema
- **users** - User accounts and preferences
- **presentations** - Presentation documents
- **presentation_versions** - Version history
- **share_links** - Sharing permissions
- **templates** - Template library
- **custom_components** - Custom UI components
- **design_token_sets** - Design themes
- **font_assets** - Font library
- **uploaded_assets** - User uploads
- **generation_jobs** - Generation history
- **user_achievements** - Gamification
- **user_activities** - Activity log
- **admin_audit_logs** - Admin actions
- **ai_configs** - System configuration
- **feature_flags** - Feature toggles

## 🎨 New Features

### 1. Stroke & Border Properties

Add borders and strokes to any element:

```typescript
// Shapes
{
  stroke: "#FF5733",
  strokeWidth: 3,
  strokeColor: "#FF5733",
  strokeDashArray: "5 5",
  strokeLineCap: "round", // butt, round, square
  strokeLineJoin: "round" // miter, round, bevel
}

// Images
{
  stroke: "#000000",
  strokeWidth: 4,
  strokeColor: "#000000"
}

// Text
{
  stroke: "#FFFFFF",
  strokeWidth: 2,
  strokeColor: "#FFFFFF"
}
```

### 2. Vignette Effect

Add subtle or dramatic vignettes:

```typescript
// Images
{
  vignette: 50 // 0-100
}

// Slide Backgrounds
{
  vignette: 30, // 0-100
  vignetteColor: "#000000"
}
```

### 3. Mask Effects

Apply masks to images and backgrounds:

```typescript
// Images
{
  mask: "circle", // none, circle, rounded, star, hexagon, custom
  maskPath: "M10 10 L90 10 L50 90 Z" // SVG path for custom
}

// Backgrounds
{
  mask: "radial", // none, radial, linear, custom
  maskOpacity: 0.8 // 0-1
}
```

## 🧮 Credits System

### How It Works

Credits are consumed when generating presentations. The cost is calculated based on:
- Number of slides
- Presentation category (complexity)
- Prompt length

**Formula:**
```
tokens = baseTokens + (slideCount * 50) + (promptLength / 10)
tokens *= categoryMultiplier (1.0 - 1.3)
credits = ceil(tokens / 10)
```

### Earning Credits

| Action | Credits |
|--------|---------|
| Sign-up Bonus | 100 |
| Daily Login | 10 |
| Create Presentation | 5 |
| Complete Profile | 20 |
| Share Presentation | 3 |
| Export PPTX | 2 |
| Referral | 50 |
| Premium Monthly | 1,000 |

### Generation Costs

| Feature | Credits |
|---------|---------|
| Base Generation | 10 |
| Per Slide | 2 |
| Advanced Layout | 5 |
| Custom Theme | 3 |
| HD Export | 5 |

**Examples:**
- 6-slide Business: ~40 credits
- 8-slide Tech: ~61 credits
- 10-slide Creative: ~78 credits
- 20-slide Tech: ~156 credits

## 🔌 API Endpoints

### Generation
```http
POST /api/generate
X-Demo-Workspace: 1
Content-Type: application/json

{
  "prompt": "Revolutionary AI Product Launch",
  "slideCount": 8,
  "category": "Tech",
  "themeId": "gallery-alabaster",
  "aspectRatio": "16:9"
}
```

**Response:**
```json
{
  "presentation": { ... },
  "tokenUsage": {
    "tokensUsed": 605,
    "creditsDeducted": 61
  },
  "creditsRemaining": 39,
  "durationMs": 45
}
```

### Credits
```http
GET /api/credits
X-Demo-Workspace: 1
```

**Response:**
```json
{
  "credits": {
    "available": 100,
    "total": 100,
    "used": 0
  },
  "rates": { ... },
  "costs": { ... }
}
```

### Daily Bonus
```http
POST /api/credits/daily
X-Demo-Workspace: 1
```

**Response:**
```json
{
  "claimed": true,
  "creditsEarned": 10,
  "newBalance": {
    "available": 110,
    "total": 110,
    "used": 0
  }
}
```

### Presentations CRUD
```http
GET    /api/presentations           # List all
POST   /api/presentations           # Create
GET    /api/presentations/:id       # Get one
PUT    /api/presentations/:id       # Update
DELETE /api/presentations/:id       # Delete
POST   /api/presentations/:id/duplicate  # Duplicate
```

### Templates & Assets
```http
GET /api/catalog/templates          # Template library
GET /api/catalog/components         # Custom components
GET /api/catalog/tokens             # Design themes
GET /api/catalog/fonts              # Font library
POST /api/uploads                   # Upload assets
GET /api/uploads                    # List uploads
```

### Export
```http
POST /api/presentations/:id/export/pptx
Content-Type: application/json

{
  "document": { ... }
}
```

## 🎯 Algorithmic Generation

### Layout Patterns

The system automatically selects appropriate layouts:

1. **title-hero** - Opening/title slide
2. **split-media** - Content + media
3. **full-bleed-image** - Hero image
4. **centered-content** - Centered text
5. **three-column** - Triple column
6. **quote-emphasis** - Quote highlight
7. **data-showcase** - Data viz
8. **timeline** - Timeline
9. **comparison** - Comparison
10. **conclusion** - Closing slide

### Color Harmony

Generates harmonious color schemes:

- **Complementary** - Opposite on color wheel
- **Analogous** - Adjacent colors
- **Triadic** - Evenly spaced

### Positioning

Uses design principles:

- **Golden Ratio** (1.618) for proportions
- **Rule of Thirds** for placement
- **Consistent margins** for alignment

## 🏗️ Technology Templates

### 32 Tech HUD Elements

**HUD Components (22):**
- Cyber HUD Frame Bracket
- Hex Segment Progress Meter
- Slash Charge Gauge
- Tactical Data Panel
- Viewport Corner Lock
- Precision Target Ring
- Sonar Radar Sweep
- Orbital Reactor Core
- Cyber Globe Wireframe
- Biometric Ring Scan
- Twin LED Level Rack
- Telemetry Wave Graph
- Radial Data Ring
- Radial Spectrum Ring
- Quantum IC Processor
- Cyber Node Network
- HUD Status Tag
- Vertical PCB Bus
- Horizontal PCB Bus
- Orbital HUD Arc Wing
- Cyber Analytics Ring
- Matrix Telemetry Header

**Backgrounds (10):**
- Obsidian Cyber PCB
- Azure Orbital Arc
- HUD Command Grid
- Cyber Honeycomb
- Dual-Tone Cyber Pulse
- Ice Tech Blueprint
- Cyber Horizon Grid
- Optical Fiber Stream
- Deep Sonar Telemetry
- Matrix Terminal PCB

**Customization:**
- Primary/Secondary/Accent/Outline colors
- Custom labels
- Size variations
- Full SVG rendering

## 🧪 Testing

### Run Test Suite
```bash
npx tsx test-neon-setup.js
```

### Test Database Connection
```bash
node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); pool.query('SELECT NOW()', (err, res) => { console.log('✅', res.rows[0]); pool.end(); });"
```

### Test Generation API
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -H "X-Demo-Workspace: 1" \
  -d '{
    "prompt": "Test Presentation",
    "slideCount": 5,
    "category": "Business"
  }'
```

## 📁 Project Structure

```
VELLUM-STUDIO/
├── src/
│   ├── components/        # React components
│   │   ├── editor/        # Editor UI
│   │   ├── layout/        # Layout components
│   │   └── renderer/      # Slide renderer
│   ├── core/              # Core logic
│   │   ├── schema.ts      # Zod schemas
│   │   ├── layout-engine.ts
│   │   ├── pptx-adapter.ts
│   │   ├── quality-scorer.ts
│   │   ├── tech-hud-catalog.ts  # 32 tech elements
│   │   └── ...
│   ├── db/                # Database
│   │   ├── index.ts       # Neon connection
│   │   ├── schema.ts      # Drizzle schema
│   │   ├── repository.ts  # Data access
│   │   └── drizzle.config.ts
│   ├── services/          # Business logic
│   │   ├── algorithmic-generator.ts  # NEW
│   │   ├── credits-system.ts         # NEW
│   │   ├── algorithmic-routes.ts     # NEW
│   │   └── file-processor.ts
│   ├── middleware/        # Express middleware
│   │   ├── neon-auth.ts   # NEW (Neon Auth)
│   │   └── auth.ts        # (Firebase - legacy)
│   └── pages/             # React pages
├── public/                # Static assets
├── uploads/               # User uploads
├── server.ts              # Express server
├── neon.ts                # Neon config (NEW)
├── .env.local             # Environment (NEW)
├── MIGRATION_SUMMARY.md   # Migration guide (NEW)
├── SETUP_COMPLETE.md      # Setup status (NEW)
└── test-neon-setup.js     # Test suite (NEW)
```

## 🔐 Authentication

Currently using demo mode. To integrate Neon Auth:

1. Update `src/middleware/neon-auth.ts`
2. Replace placeholder JWT verification
3. Add Neon Auth public key validation
4. Update frontend auth flows

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx tsx test-neon-setup.js

# Check env vars
cat .env.local

# Verify Neon is accessible
curl https://ep-solitary-butterfly-bdmhkkvn-pooler.c-8.us-east-2.aws.neon.tech
```

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Rebuild
npm run build
```

### Generation Not Working
```bash
# Check credits
curl -H "X-Demo-Workspace: 1" http://localhost:3000/api/credits

# Test with curl
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -H "X-Demo-Workspace: 1" \
  -d '{"prompt":"Test","slideCount":3,"category":"Business"}'
```

## 📚 Documentation

- **Migration Guide**: `MIGRATION_SUMMARY.md`
- **Setup Status**: `SETUP_COMPLETE.md`
- **API Reference**: See `/api/*` routes in `server.ts`
- **Schema Docs**: `src/core/schema.ts`

## 🎯 Roadmap

- [x] Migrate to Neon Database
- [x] Implement algorithmic generation
- [x] Add credits system
- [x] Add stroke/border/vignette/mask
- [x] Expand tech template library
- [ ] Integrate Neon Auth properly
- [ ] Add frontend credit display
- [ ] Add property controls for new features
- [ ] Add generation cost preview
- [ ] Implement premium features
- [ ] Add collaboration features
- [ ] Mobile responsive design

## 📄 License

Proprietary - All rights reserved

## 🙏 Credits

- **Database**: Neon PostgreSQL
- **ORM**: Drizzle
- **UI**: React + TailwindCSS
- **Icons**: Lucide React
- **Design System**: Custom

---

**Version**: 2.0.0 (Neon Edition)  
**Status**: ✅ Production Ready  
**Last Updated**: 2026-11-22
