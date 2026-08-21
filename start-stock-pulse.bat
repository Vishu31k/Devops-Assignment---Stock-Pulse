@echo off
title Stock Pulse — Startup Script
echo ===================================================
echo      Starting Stock Pulse Platform
echo ===================================================
echo.

:: Add MinGit and Node.js to PATH if present
set "PATH=C:\Users\admin\nodejs;C:\Users\admin\MinGit\cmd;%PATH%"

echo 1. Checking Node.js and dependencies...
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend && call npm install && cd ..
)
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend && call npm install && cd ..
)

echo.
echo 2. Starting Backend Server on port 5000...
start "Stock Pulse Backend (Port 5000)" cmd /k "cd /d %~dp0backend && npm run start"

echo.
echo 3. Starting Frontend App on port 3000...
start "Stock Pulse Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ===================================================
echo   Stock Pulse is starting up!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ===================================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 >nul
start http://localhost:3000
