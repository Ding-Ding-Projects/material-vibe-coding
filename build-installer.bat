@echo off
setlocal EnableDelayedExpansion

echo === Installing dependencies ===
call npm install || goto :error

echo === Building Squirrel installer (unsigned) ===
call npx electron-forge make --platform win32 --arch x64 || goto :error

echo.
echo Installer build complete.
echo Output: out\make\squirrel.windows\
echo Note: This installer is unsigned and may trigger a SmartScreen warning.
goto :eof

:error
echo.
echo Installer build failed with exit code %ERRORLEVEL%
exit /b %ERRORLEVEL%
