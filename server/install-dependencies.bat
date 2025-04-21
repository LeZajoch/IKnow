@echo off
echo Installing server dependencies...
call npm install

echo.
echo Installing uuid package...
call npm install uuid

echo.
echo Dependencies installed successfully!
pause
