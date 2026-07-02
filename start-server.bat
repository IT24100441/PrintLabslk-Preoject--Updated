@echo off
title PrintLabs LK Backend Server
cd /d "%~dp0"
echo ────────────────────────────────────────────────────────────
echo PrintLabs LK — Installing Backend Dependencies...
echo ────────────────────────────────────────────────────────────
cd server
call npm install
echo.
echo ────────────────────────────────────────────────────────────
echo Starting Backend Server on http://localhost:5000 ...
echo Database Target: mongodb://127.0.0.1:27017/Printlabs
echo ────────────────────────────────────────────────────────────
call npm start
pause
