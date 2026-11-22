# Vellum Studio Server Startup Script

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Starting Vellum Studio Server                       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Set environment variables explicitly
$env:DATABASE_URL = "postgresql://neondb_owner:npg_XqcIN7fL3dxA@ep-solitary-butterfly-bdmhkkvn-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
$env:NEON_AUTH_URL = "https://ep-solitary-butterfly-bdmhkkvn.neonauth.c-8.us-east-2.aws.neon.tech/neondb/auth"
$env:NODE_ENV = "development"

Write-Host "✅ Environment variables set" -ForegroundColor Green
Write-Host "   DATABASE_URL: Configured" -ForegroundColor Gray
Write-Host "   NEON_AUTH_URL: Configured`n" -ForegroundColor Gray

Write-Host "🚀 Starting server on http://localhost:3000..." -ForegroundColor Yellow
Write-Host "   Press Ctrl+C to stop`n" -ForegroundColor Gray

# Start the server
npm run dev
