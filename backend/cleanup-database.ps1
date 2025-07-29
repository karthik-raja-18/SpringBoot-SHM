Write-Host "Cleaning up database roles table..." -ForegroundColor Green
Write-Host ""

# Connect to MySQL and run the cleanup script
mysql -u root -pkarthikraja2502 secondhand_marketplace < src\main\resources\cleanup-roles.sql

Write-Host ""
Write-Host "Database cleanup completed!" -ForegroundColor Green
Write-Host "The roles table now contains only ROLE_BUYER and ROLE_SELLER" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue" 