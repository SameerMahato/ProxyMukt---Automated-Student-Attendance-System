@echo off
echo ========================================
echo Update Author Information
echo ========================================
echo.
echo This script will help you update author information in all documentation files.
echo.
echo IMPORTANT: Before running this script, you need to:
echo 1. Open this file in a text editor
echo 2. Update the variables below with YOUR information
echo 3. Save and run the script
echo.
echo ========================================
echo.

REM ============================================
REM UPDATE THESE VARIABLES WITH YOUR INFO
REM ============================================
set "YOUR_NAME=Your Name Here"
set "YOUR_EMAIL=your-email@example.com"
set "YOUR_GITHUB=YourGitHubUsername"
set "YOUR_REPO=YourRepoName"
REM ============================================

echo Current Settings:
echo Name: %YOUR_NAME%
echo Email: %YOUR_EMAIL%
echo GitHub: %YOUR_GITHUB%
echo Repository: %YOUR_REPO%
echo.
echo ========================================
echo.

set /p CONFIRM="Have you updated the variables in this script? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo.
    echo Please edit this script file and update the variables first!
    echo Then run it again.
    pause
    exit /b 1
)

echo.
echo Updating files...
echo.

REM Note: This is a template. For actual replacement, you would need to use
REM PowerShell or a text editor's find & replace feature.

echo ========================================
echo MANUAL STEPS REQUIRED:
echo ========================================
echo.
echo Please use your code editor's Find & Replace feature to update:
echo.
echo 1. Find: "sumantyadav3086@gmail.com"
echo    Replace with: "%YOUR_EMAIL%"
echo.
echo 2. Find: "Sumant3086"
echo    Replace with: "%YOUR_GITHUB%"
echo.
echo 3. Find: "Sumant Kumar"
echo    Replace with: "%YOUR_NAME%"
echo.
echo 4. Find: "ProxyMukt-Attendance-System-"
echo    Replace with: "%YOUR_REPO%"
echo.
echo Files to update:
echo - README.md
echo - CHANGELOG.md
echo - DEPLOYMENT_GUIDE.md
echo - FEATURES_COMPARISON.md
echo - INSTALLATION_GUIDE.md
echo - PROJECT_COMPLETE.md
echo - QUICK_REFERENCE.md
echo - UPDATES_SUMMARY.md
echo.
echo ========================================
echo.

echo After updating, you can push to GitHub using:
echo.
echo   git add .
echo   git commit -m "docs: Update author information"
echo   git push origin main
echo.
echo See PUSH_TO_GITHUB.md for detailed instructions.
echo.
pause
