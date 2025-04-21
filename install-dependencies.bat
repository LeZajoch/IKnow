@echo off
echo Installing frontend dependencies...
call npm install

echo.
echo Installing server dependencies...
cd server
call npm install
call npm install uuid

echo.
echo All dependencies installed successfully!
cd ..
pause
