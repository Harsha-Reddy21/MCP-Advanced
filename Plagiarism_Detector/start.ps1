# Plagiarism Detector Startup Script

Write-Host "Starting Plagiarism Detector application..." -ForegroundColor Green

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    return $exists
}

# Check for required dependencies
Write-Host "Checking dependencies..." -ForegroundColor Yellow

$pythonExists = Test-CommandExists "python"
$nodeExists = Test-CommandExists "node"
$npmExists = Test-CommandExists "npm"

if (-not $pythonExists) {
    Write-Host "Python is not installed. Please install Python 3.8+ and try again." -ForegroundColor Red
    exit 1
}

if (-not $nodeExists -or -not $npmExists) {
    Write-Host "Node.js or npm is not installed. Please install Node.js and try again." -ForegroundColor Red
    exit 1
}

# Start the backend server
Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\backend; python -m uvicorn main:app --reload"

# Wait a moment for the backend to initialize
Start-Sleep -Seconds 2

# Start the frontend server
Write-Host "Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\frontend; npm start"

Write-Host "Plagiarism Detector is starting up!" -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C in the respective terminal windows to stop the servers." -ForegroundColor Yellow 