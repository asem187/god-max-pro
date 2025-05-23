@echo off
REM God Max Pro - Complete System Launch Script
REM Starts all services in correct order with health checks

echo ==========================================
echo God Max Pro - Omnipresent AI Automation
echo ==========================================
echo.

REM Check Docker status
echo [1/6] Checking Docker Desktop...
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Desktop is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo Docker Desktop is running.
echo.

REM Start PostgreSQL if not running
echo [2/6] Starting PostgreSQL database...
docker start mcp-server-docker-postgres-1 >nul 2>&1
timeout /t 3 >nul
echo PostgreSQL is ready.
echo.

REM Start n8n automation platform
echo [3/6] Starting n8n automation platform...
docker start mcp-n8n >nul 2>&1
echo Waiting for n8n to initialize...
timeout /t 5 >nul
echo n8n is running on http://localhost:5678
echo.

REM Start Open WebUI
echo [4/6] Starting Open WebUI voice interface...
docker start open-webui >nul 2>&1
timeout /t 3 >nul
echo Open WebUI is running on http://localhost:3000
echo.

REM Start Memory Relay Server
echo [5/6] Starting Memory Relay Server...
cd /d "%USERPROFILE%\Desktop\god-max-pro-app"
start /min node memory-relay-server.js
echo Memory system activated on port 8899
echo.

REM Launch Electron App
echo [6/6] Launching God Max Pro Desktop App...
cd /d "%USERPROFILE%\Desktop\god-max-pro-app"
start npm start
echo.

echo ==========================================
echo All systems operational!
echo ==========================================
echo.
echo n8n Automation: http://localhost:5678
echo Open WebUI: http://localhost:3000
echo Memory API: http://localhost:8899
echo.
echo Voice Commands: Press Ctrl+Shift+V
echo Command Palette: Press Ctrl+Shift+C
echo.
echo To stop all services, run STOP-ALL-SERVICES.bat
echo.
pause