# Complete System Test Script for Vellum Studio

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Vellum Studio - Complete System Test               ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"
$passed = 0
$failed = 0

# Helper function for tests
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "Testing: $Name..." -ForegroundColor Yellow -NoNewline
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        Write-Host " ✅ PASS" -ForegroundColor Green
        $script:passed++
        return $response
    }
    catch {
        Write-Host " ❌ FAIL" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
        $script:failed++
        return $null
    }
}

# Wait for server to be ready
Write-Host "⏳ Waiting for server to be ready..." -ForegroundColor Yellow
$ready = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $health = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get -TimeoutSec 2
        if ($health.ok) {
            $ready = $true
            Write-Host "✅ Server is ready!`n" -ForegroundColor Green
            break
        }
    }
    catch {
        Write-Host "   Attempt $i/10..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if (-not $ready) {
    Write-Host "`n❌ Server is not responding. Please start the server first:" -ForegroundColor Red
    Write-Host "   .\start-server.ps1`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Test 1: Health Check
$health = Test-Endpoint -Name "Health Check" -Method "Get" -Url "$baseUrl/api/health"

# Test 2: Credits Info
$credits = Test-Endpoint -Name "Credits Info" -Method "Get" -Url "$baseUrl/api/credits" -Headers @{"X-Demo-Workspace"="1"}
if ($credits) {
    Write-Host "   💰 Available Credits: $($credits.credits.available)" -ForegroundColor Cyan
}

# Test 3: Free Credits (12H)
$freeCredits = Test-Endpoint -Name "Free Credits (12H)" -Method "Post" -Url "$baseUrl/api/credits/free" -Headers @{"X-Demo-Workspace"="1"}
if ($freeCredits -and $freeCredits.claimed) {
    Write-Host "   🎁 Claimed: +$($freeCredits.creditsEarned) credits" -ForegroundColor Cyan
}

# Test 4: Payment Plans
$plans = Test-Endpoint -Name "Payment Plans" -Method "Get" -Url "$baseUrl/api/payment/plans"
if ($plans) {
    Write-Host "   📦 Plans Available: $($plans.plans.Count)" -ForegroundColor Cyan
}

# Test 5: Advanced Generation with Philippine History
Write-Host "`n🎨 Testing Advanced Generation (Philippine History)..." -ForegroundColor Yellow
$genBody = @{
    prompt = "generate a presentation about Philippine history, make sure the design is cool, and more design such as borders, elements and backgrounds and fonts"
    slideCount = 10
    category = "Education"
    themeId = "gallery-alabaster"
    aspectRatio = "16:9"
    designPreferences = @{
        useBorders = $true
        useBackgrounds = $true
        useElements = $true
        fontStyle = "classic"
        colorScheme = "vibrant"
    }
} | ConvertTo-Json -Depth 4

$generation = Test-Endpoint -Name "Advanced Generation" -Method "Post" -Url "$baseUrl/api/generate" -Headers @{"X-Demo-Workspace"="1"} -Body $genBody

if ($generation) {
    Write-Host "`n   📊 Generation Results:" -ForegroundColor Cyan
    Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "   📝 Title: $($generation.presentation.title)" -ForegroundColor White
    Write-Host "   📄 Slides: $($generation.presentation.document.slides.Count)" -ForegroundColor White
    Write-Host "   🪙 Tokens Used: $($generation.tokenUsage.tokensUsed)" -ForegroundColor White
    Write-Host "   💳 Credits Deducted: $($generation.tokenUsage.creditsDeducted)" -ForegroundColor White
    Write-Host "   💰 Credits Remaining: $($generation.creditsRemaining)" -ForegroundColor White
    Write-Host "   ⚡ Duration: $($generation.durationMs)ms" -ForegroundColor White
    Write-Host "   🎨 Design Applied:" -ForegroundColor White
    Write-Host "      - Borders: $($generation.designApplied.useBorders)" -ForegroundColor Gray
    Write-Host "      - Backgrounds: $($generation.designApplied.useBackgrounds)" -ForegroundColor Gray
    Write-Host "      - Elements: $($generation.designApplied.useElements)" -ForegroundColor Gray
    Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray
    
    # Verify slides have design features
    $firstSlide = $generation.presentation.document.slides[0]
    $hasBorder = $firstSlide.elements | Where-Object { $_.name -eq "Border Frame" }
    $hasBackground = $firstSlide.background.type -eq "gradient"
    $hasElements = $firstSlide.elements | Where-Object { $_.name -eq "Decorative Shape" }
    
    Write-Host "   ✨ Design Verification:" -ForegroundColor Cyan
    if ($hasBorder) { 
        Write-Host "      ✅ Border Frame Present" -ForegroundColor Green 
    } else { 
        Write-Host "      ⚠️  Border Frame Missing" -ForegroundColor Yellow 
    }
    if ($hasBackground) { 
        Write-Host "      ✅ Gradient Background Applied" -ForegroundColor Green 
    } else { 
        Write-Host "      ⚠️  Solid Background Only" -ForegroundColor Yellow 
    }
    if ($hasElements) { 
        Write-Host "      ✅ Decorative Elements Added" -ForegroundColor Green 
    } else { 
        Write-Host "      ⚠️  No Decorative Elements" -ForegroundColor Yellow 
    }
}

# Test 6: GCash Payment
$gcashBody = @{
    plan = "PRO"
    email = "test@example.com"
} | ConvertTo-Json

$gcash = Test-Endpoint -Name "GCash Payment" -Method "Post" -Url "$baseUrl/api/payment/gcash" -Headers @{"X-Demo-Workspace"="1"} -Body $gcashBody
if ($gcash) {
    Write-Host "   💳 Transaction ID: $($gcash.transactionId)" -ForegroundColor Cyan
}

# Test 7: PayPal Payment
$paypalBody = @{
    plan = "PRO"
    email = "test@example.com"
} | ConvertTo-Json

$paypal = Test-Endpoint -Name "PayPal Payment" -Method "Post" -Url "$baseUrl/api/payment/paypal" -Headers @{"X-Demo-Workspace"="1"} -Body $paypalBody
if ($paypal) {
    Write-Host "   💳 Transaction ID: $($paypal.transactionId)" -ForegroundColor Cyan
}

# Test 8: Presentations List
$presentations = Test-Endpoint -Name "Presentations List" -Method "Get" -Url "$baseUrl/api/presentations" -Headers @{"X-Demo-Workspace"="1"}
if ($presentations) {
    Write-Host "   📚 Total Presentations: $($presentations.Count)" -ForegroundColor Cyan
}

# Summary
Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Test Results Summary                                 ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "✅ Passed: $passed tests" -ForegroundColor Green
Write-Host "❌ Failed: $failed tests" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED! Your system is fully operational.`n" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Check the errors above.`n" -ForegroundColor Yellow
}

Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Instructions
Write-Host "📚 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. View generated presentation in browser: http://localhost:3000" -ForegroundColor White
Write-Host "   2. Check COMPLETE_SETUP_GUIDE.md for full documentation" -ForegroundColor White
Write-Host "   3. Integrate real payment gateways (see guide)" -ForegroundColor White
Write-Host "   4. Deploy to production`n" -ForegroundColor White
