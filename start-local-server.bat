@echo off
echo.
echo ========================================
echo   健康計算ポータル - ローカルサーバー
echo ========================================
echo.
echo ローカルサーバーを起動しています...
echo.
echo ブラウザで以下のURLを開いてください:
echo   http://localhost:8000
echo.
echo サーバーを停止するには Ctrl+C を押してください
echo.
echo ========================================
echo.

python -m http.server 8000

pause 