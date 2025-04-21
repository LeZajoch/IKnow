@echo off
echo Installing dependencies...
call npm run install:all

echo.
echo Starting the application...
call npm run start:dev

pause
