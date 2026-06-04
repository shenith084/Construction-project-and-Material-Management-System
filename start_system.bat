@echo off
echo Starting Construction Management System...
echo.

echo [1/3] Starting Backend (API) on port 3002...
start "Backend" cmd /k "cd backend && npm run dev"

echo [2/3] Starting Admin Panel on port 3001...
start "Admin" cmd /k "cd admin && npm run dev"

echo [3/3] Starting Website on port 3000...
start "Website" cmd /k "cd website && npm run dev"

echo.
echo All services are starting up!
echo - Website: http://localhost:3000
echo - Admin Panel: http://localhost:3001
echo - Backend API: http://localhost:3002
echo.
echo Press any key to exit this script...
pause > nul
