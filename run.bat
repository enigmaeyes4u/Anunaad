@echo off
title ANUNAAD Living Traditions Platform
echo ===================================================
echo   Starting ANUNAAD (अनुनाद) Platform
echo ===================================================
echo.
set "PATH=C:\Users\HP\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0"

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing node dependencies...
    call npm install
)

echo Starting backend and frontend servers...
echo Backend will be available at http://localhost:5000
echo Frontend will open at http://localhost:3000
echo.
call npm start
pause
