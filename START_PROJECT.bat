@echo off
echo ========================================
echo ProxyMukt Attendance System
echo Starting Development Servers
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
timeout /t 2 /nobreak >nul

REM Start Backend Server
echo ========================================
echo Starting Backend Server...
echo ========================================
start "ProxyMukt Backend" cmd /k "cd server && npm run dev"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend Server
echo ========================================
echo Starting Frontend Server...
echo ========================================
start "ProxyMukt Frontend" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
