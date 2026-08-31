@echo off
REM ============================================================
REM  FAHAMI local server
REM  Serves this folder over http:// so the app can fetch live
REM  DOSM Open Data. Opening index.html directly (file://) blocks
REM  the live fetch, so use this instead.
REM
REM  Prefers Python if it's on your PATH; otherwise falls back to
REM  a built-in PowerShell server (serve.ps1) that needs nothing
REM  installed. Either way: open http://localhost:5273
REM ============================================================
cd /d "%~dp0"
set PORT=5273

set PY=
where py      >nul 2>nul && set PY=py -3
if not defined PY where python  >nul 2>nul && set PY=python
if not defined PY where python3 >nul 2>nul && set PY=python3

if defined PY (
  echo.
  echo   FAHAMI  is now running at:   http://localhost:%PORT%
  echo   Open that URL in your browser. Press Ctrl+C here to stop.
  echo.
  %PY% -m http.server %PORT%
  goto :eof
)

REM No Python: fall back to the dependency-free PowerShell server.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
if errorlevel 1 (
  echo.
  echo   [!] Could not start a local server automatically.
  echo       Install Python from https://www.python.org/downloads/
  echo       ^(tick "Add python.exe to PATH"^) and re-run this file.
  echo.
  pause
)
