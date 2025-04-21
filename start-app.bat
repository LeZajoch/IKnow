@echo off
echo Starting the application...

REM Check if concurrently is installed
call npm list concurrently >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing concurrently...
    call npm install concurrently --save-dev
)

REM Start both frontend and backend
echo Starting frontend and backend servers...
start cmd /k "npm run dev"
cd server
start cmd /k "npm run dev"
cd ..

echo.
echo Application started! Check the opened command windows for details.
echo Press any key to close this window...
pause >nul
