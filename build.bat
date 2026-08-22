@echo off
setlocal EnableDelayedExpansion

echo === Installing dependencies ===
call npm install || goto :error

echo === Building application package ===
call npx electron-forge package || goto :error

echo.
echo Build complete.
echo Output: out\
goto :eof

:error
echo.
echo Build failed with exit code %ERRORLEVEL%
exit /b %ERRORLEVEL%
