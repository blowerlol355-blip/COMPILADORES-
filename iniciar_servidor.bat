@echo off
title OpenCompilers Server
echo ===================================================
echo   Iniciando servidor local en http://localhost:8080/
echo   Abriendo en navegador Brave...
echo ===================================================

set "BRAVE_PATH=%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe"
if exist "%BRAVE_PATH%" (
    start "" "%BRAVE_PATH%" "http://localhost:8080/"
) else (
    start "" "http://localhost:8080/"
)

powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080
pause
