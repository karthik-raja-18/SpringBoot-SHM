@echo off
echo Cleaning up database roles table...
echo.

REM Connect to MySQL and run the cleanup script
mysql -u root -pkarthikraja2502 secondhand_marketplace < src\main\resources\cleanup-roles.sql

echo.
echo Database cleanup completed!
echo The roles table now contains only ROLE_BUYER and ROLE_SELLER
echo.
pause 