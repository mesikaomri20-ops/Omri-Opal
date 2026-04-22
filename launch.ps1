Write-Host "=========================================="
Write-Host "   INVESTMENT COMMAND CENTER INITIATION   "
Write-Host "=========================================="
Write-Host ""
Write-Host "Checking system requirements..."

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "[CRITICAL ERROR] The Brain requires Node.js to function." -ForegroundColor Red
    Write-Host "1. Download it here: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "2. Install it with default settings." -ForegroundColor Yellow
    Write-Host "3. Close this window and run launch.ps1 again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "[OK] Node.js detected." -ForegroundColor Green
Write-Host "Installing dependencies... (This may take a minute)"

npm install

Write-Host ""
Write-Host "Booting local server..."
Write-Host "The Command Center will be available at http://localhost:3000" -ForegroundColor Green
Write-Host ""

npm run dev
