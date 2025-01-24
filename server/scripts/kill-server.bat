@echo off
echo Killing server process on port 4000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":4000" ^| find "LISTENING"') do taskkill /f /pid %%a
echo Server process terminated. 