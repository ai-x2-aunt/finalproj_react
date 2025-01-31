@echo off
cd /d %~dp0
echo [INFO] Activating Conda Environment...

:: Conda 환경 활성화 (call을 사용해야 CMD가 종료되지 않음)
call conda activate dev_test

:: FastAPI 서버 실행 (새로운 터미널 창)
start cmd /k "cd ai && uvicorn main:app --reload"

:: React 서버 실행 (새로운 터미널 창)
start cmd /k "cd client && npm start"

exit
