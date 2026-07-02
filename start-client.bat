@echo off
title PrintLabs LK Frontend Client
cd /d "%~dp0"
echo ────────────────────────────────────────────────────────────
echo PrintLabs LK — Installing Frontend Dependencies...
echo ────────────────────────────────────────────────────────────
call npm install
echo.
echo Copying logo files...
copy /Y "C:\Users\Dell\.gemini\antigravity\brain\9d50808d-bd57-476b-a98b-22e3ed68c4be\media__1781638256273.jpg" "public\images\logo.jpg"
copy /Y "C:\Users\Dell\.gemini\antigravity\brain\9d50808d-bd57-476b-a98b-22e3ed68c4be\media__1781638256274.jpg" "public\images\logo_text.jpg"
echo.
echo ────────────────────────────────────────────────────────────
echo Starting Vite Frontend Client...
echo URL: http://localhost:5173
echo ────────────────────────────────────────────────────────────
call npm run dev
pause
