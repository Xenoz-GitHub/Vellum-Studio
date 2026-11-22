# 🧪 Test Advanced Features

## Run Server First
```bash
npm run dev
```

## Test 1: Advanced Generation (Philippine History)

**Your Original Prompt:**
```powershell
$body = @{
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

Invoke-RestMethod -Uri "http://localhost:3000/api/generate" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{"X-Demo-Workspace"="1"} `
    -Body $body
```

**Expected Result:**
- ✅ 10 slides created
- ✅ Borders on all slides
- ✅ Gradient backgrounds with patterns
- ✅ Decorative elements (shapes)
- ✅ Classic fonts applied
- ✅ Vibrant color scheme
- ✅ Credits deducted: ~139 credits

## Test 2: Free Credits (Every 12 Hours)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/credits/free" `
    -Method Post `
    -Headers @{"X-Demo-Workspace"="1"}
```

**Expected Result:**
```json
{
  "claimed": true,
  "creditsEarned": 50,
  "newBalance": {
    "available": 150,
    "total": 150,
    "used": 0
  },
  "message": "Successfully claimed 50 free credits!"
}
```

**Second Attempt (within 12 hours):**
```json
{
  "claimed": false,
  "message": "Free credits already claimed. Next claim available in less than 12 hours.",
  "nextAvailableIn": "< 12 hours"
}
```

## Test 3: Payment Plans

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/payment/plans" -Method Get
```

**Expected Result:**
```json
{
  "plans": [
    {
      "id": "STARTER",
      "name": "Starter",
      "credits": 500,
      "pricePhp": 99,
      "priceUsd": 1.99,
      "popular": false,
      "features": ["500 credits", "~12 presentations", ...]
    },
    {
      "id": "PRO",
      "name": "Pro",
      "credits": 1500,
      "pricePhp": 249,
      "priceUsd": 4.99,
      "popular": true,
      "features": [...]
    },
    ...
  ],
  "currency": {
    "php": "₱",
    "usd": "$"
  }
}
```

## Test 4: GCash Payment (Mock)

```powershell
$body = @{
    plan = "PRO"
    email = "user@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/payment/gcash" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{"X-Demo-Workspace"="1"} `
    -Body $body
```

**Expected Result:**
```json
{
  "success": true,
  "transactionId": "gcash-...",
  "creditsAdded": 0,
  "paymentUrl": "https://payment.gcash.com/checkout?...",
  "qrCode": "data:image/png;base64,...",
  "message": "GCash payment initiated. Amount: ₱249. Complete payment to receive 1500 credits."
}
```

## Test 5: PayPal Payment (Mock)

```powershell
$body = @{
    plan = "PRO"
    email = "user@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/payment/paypal" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{"X-Demo-Workspace"="1"} `
    -Body $body
```

**Expected Result:**
```json
{
  "success": true,
  "transactionId": "paypal-...",
  "creditsAdded": 0,
  "paymentUrl": "https://www.paypal.com/checkoutnow?...",
  "message": "PayPal payment initiated. Amount: $4.99. Complete payment to receive 1500 credits."
}
```

## Test 6: Credits Info

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/credits" `
    -Method Get `
    -Headers @{"X-Demo-Workspace"="1"}
```

**Expected Result:**
```json
{
  "credits": {
    "available": 100,
    "total": 100,
    "used": 0
  },
  "rates": {
    "SIGN_UP_BONUS": 100,
    "FREE_DAILY_12H": 50,
    ...
  },
  "costs": {
    "GENERATE_PRESENTATION_BASE": 10,
    ...
  }
}
```

## Test 7: Verify Generated Presentation Has All Features

After generation, check the presentation document for:

### Borders:
```json
{
  "type": "shape",
  "name": "Border Frame",
  "stroke": "color",
  "strokeWidth": 4,
  "strokeDashArray": "20 10",
  "opacity": 0.3
}
```

### Backgrounds:
```json
{
  "background": {
    "type": "gradient",
    "gradient": "linear-gradient(...)",
    "pattern": "dots",
    "patternOpacity": 0.08,
    "vignette": 20
  }
}
```

### Elements:
```json
{
  "type": "shape",
  "name": "Decorative Shape",
  "shapeKind": "hexagon",
  "opacity": 0.12,
  "rotation": 15
}
```

## Complete Test Script

Save this as `test-all-features.ps1`:

```powershell
Write-Host "`n🧪 Testing All Advanced Features`n" -ForegroundColor Cyan

# Test 1: Generation
Write-Host "1️⃣  Testing Advanced Generation..." -ForegroundColor Yellow
$body = @{
    prompt = "Philippine history presentation with cool borders and designs"
    slideCount = 10
    category = "Education"
    designPreferences = @{
        useBorders = $true
        useBackgrounds = $true
        useElements = $true
    }
} | ConvertTo-Json -Depth 4

try {
    $gen = Invoke-RestMethod -Uri "http://localhost:3000/api/generate" `
        -Method Post -ContentType "application/json" `
        -Headers @{"X-Demo-Workspace"="1"} -Body $body
    Write-Host "   ✅ Generated: $($gen.presentation.title)" -ForegroundColor Green
    Write-Host "   📊 Credits Used: $($gen.tokenUsage.creditsDeducted)" -ForegroundColor Green
    Write-Host "   💰 Remaining: $($gen.creditsRemaining)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}

# Test 2: Free Credits
Write-Host "`n2️⃣  Testing Free Credits (12H)..." -ForegroundColor Yellow
try {
    $free = Invoke-RestMethod -Uri "http://localhost:3000/api/credits/free" `
        -Method Post -Headers @{"X-Demo-Workspace"="1"}
    if ($free.claimed) {
        Write-Host "   ✅ Claimed: +$($free.creditsEarned) credits" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  $($free.message)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}

# Test 3: Payment Plans
Write-Host "`n3️⃣  Testing Payment Plans..." -ForegroundColor Yellow
try {
    $plans = Invoke-RestMethod -Uri "http://localhost:3000/api/payment/plans" -Method Get
    Write-Host "   ✅ Available Plans: $($plans.plans.Count)" -ForegroundColor Green
    foreach ($plan in $plans.plans) {
        $popular = if ($plan.popular) { " ⭐" } else { "" }
        Write-Host "   📦 $($plan.name): $($plan.credits) credits - ₱$($plan.pricePhp) / `$$($plan.priceUsd)$popular" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}

# Test 4: GCash Payment
Write-Host "`n4️⃣  Testing GCash Payment..." -ForegroundColor Yellow
$gcashBody = @{ plan = "PRO"; email = "test@example.com" } | ConvertTo-Json
try {
    $gcash = Invoke-RestMethod -Uri "http://localhost:3000/api/payment/gcash" `
        -Method Post -ContentType "application/json" `
        -Headers @{"X-Demo-Workspace"="1"} -Body $gcashBody
    Write-Host "   ✅ $($gcash.message)" -ForegroundColor Green
    Write-Host "   🔗 URL: $($gcash.paymentUrl)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}

# Test 5: PayPal Payment
Write-Host "`n5️⃣  Testing PayPal Payment..." -ForegroundColor Yellow
$paypalBody = @{ plan = "PRO"; email = "test@example.com" } | ConvertTo-Json
try {
    $paypal = Invoke-RestMethod -Uri "http://localhost:3000/api/payment/paypal" `
        -Method Post -ContentType "application/json" `
        -Headers @{"X-Demo-Workspace"="1"} -Body $paypalBody
    Write-Host "   ✅ $($paypal.message)" -ForegroundColor Green
    Write-Host "   🔗 URL: $($paypal.paymentUrl)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}

Write-Host "`n🎉 All tests complete!`n" -ForegroundColor Green
```

Run with:
```powershell
.\test-all-features.ps1
```

---

**Expected Overall Result**: All 5 tests pass ✅
