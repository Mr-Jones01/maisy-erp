##############################################################
# update-seed.ps1
# Usage: .\scripts\update-seed.ps1 "C:\path\to\MaisyRailing_ERP_Backup_YYYY-MM-DD.json"
#
# What it does:
#   1. Validates the backup JSON
#   2. Copies it into backups\json\ with datestamp
#   3. Replaces public\seed-data.json (what the app loads on fresh browser)
#   4. Rebuilds the app
#   5. Commits everything to git
##############################################################

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

# ── 1. Validate ──────────────────────────────────────────────────────────────
if (!(Test-Path $BackupFile)) {
    Write-Error "File not found: $BackupFile"
    exit 1
}

$raw = Get-Content $BackupFile -Raw
try {
    $json = $raw | ConvertFrom-Json
} catch {
    Write-Error "Invalid JSON in backup file."
    exit 1
}

$data = if ($json.data) { $json.data } else { $json }
if (!$data) {
    Write-Error "Backup file has no data payload."
    exit 1
}

$sizekb = [math]::Round($raw.Length / 1KB, 1)
$exportedAt = if ($json._meta.exportedAt) { $json._meta.exportedAt } else { "unknown" }
Write-Host ""
Write-Host "✅ Backup validated: ${sizekb}KB | Exported: $exportedAt" -ForegroundColor Green

# ── 2. Archive backup ────────────────────────────────────────────────────────
$dateStamp = (Get-Date -Format "yyyy-MM-dd")
$destName  = "MaisyRailing_ERP_Backup_${dateStamp}.json"
$destPath  = Join-Path $root "backups\json\$destName"
Copy-Item $BackupFile $destPath -Force
Write-Host "📁 Archived to: backups\json\$destName" -ForegroundColor Cyan

# ── 3. Replace seed ──────────────────────────────────────────────────────────
$seedPath = Join-Path $root "public\seed-data.json"
Copy-Item $BackupFile $seedPath -Force
Write-Host "🌱 Seed updated: public\seed-data.json" -ForegroundColor Cyan

# ── 4. Build ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "🔨 Building..." -ForegroundColor Yellow
Set-Location $root
npm run build
Write-Host "✅ Build complete." -ForegroundColor Green

# ── 5. Git commit ────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "📦 Committing to git..." -ForegroundColor Yellow
git add public/seed-data.json "backups/json/$destName"
git commit -m "chore: update seed data from backup $dateStamp"
Write-Host "✅ Committed." -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Done. Deploy with: npx vercel --prod" -ForegroundColor Green
Write-Host ""
