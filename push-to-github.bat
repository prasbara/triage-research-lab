@echo off
echo ========================================================
echo  TRIAGE Research Lab - Push to GitHub
echo ========================================================
echo Repository: https://github.com/prasbara/triage-research-lab
echo Branch: main
echo.
cd /d "%~dp0"
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Kode berhasil di-push ke GitHub!
    echo Silakan lanjutkan deploy di Vercel: https://vercel.com/new
) else (
    echo [PERHATIAN] Jika diminta autentikasi, silakan login ke GitHub melalui browser atau masukkan Personal Access Token (PAT).
)
pause
