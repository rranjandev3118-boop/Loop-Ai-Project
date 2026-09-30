# Setup script for LOOP AI project environment
# Run this script in PowerShell to create the .env file

$envContent = @"
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="loop-demo-secret-change-in-production-secure-random-string"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="YOUR_API_KEY_HERE"
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8
Write-Host ".env file created successfully!" -ForegroundColor Green
Write-Host "Now run: npm install && npx prisma migrate dev --name init && npm run seed" -ForegroundColor Yellow