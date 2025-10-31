# Start the backend server in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm install; npm run dev"

# Start the frontend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm install; npm run dev"

Write-Host "Starting RaceFi application..." -ForegroundColor Green
Write-Host "- Backend: http://localhost:5000"
Write-Host "- Frontend: http://localhost:5173"
