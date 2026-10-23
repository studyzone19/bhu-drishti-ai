# Quick push script for real-time deployment
param(
    [string]$msg = "Auto-update via Bhu-Drishti"
)

Write-Host "Syncing changes to GitHub..." -ForegroundColor Cyan
git add .
git commit -m "$msg"
git push origin main
Write-Host "Pushed to GitHub! Render is now deploying your changes live in real-time." -ForegroundColor Green
