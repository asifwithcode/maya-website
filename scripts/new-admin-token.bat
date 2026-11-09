@echo off
rem Makes a new random WEB_ADMIN_TOKEN (48 random bytes, URL-safe) and copies it to the clipboard.
rem Nothing is saved anywhere. Then:
rem   1. Vercel -> project -> Settings -> Environment Variables -> WEB_ADMIN_TOKEN (Production) -> paste -> Save
rem   2. Redeploy the latest production deployment (env changes need a new deployment)
rem   3. Maya Studio -> Sales -> Connection -> paste the same token
rem The old token stops working as soon as the new deployment is live.

powershell -NoProfile -Command ^
  "$b = New-Object byte[] 48; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b);" ^
  "$t = [Convert]::ToBase64String($b).TrimEnd('=').Replace('+','-').Replace('/','_');" ^
  "Set-Clipboard -Value $t;" ^
  "Write-Host ''; Write-Host 'New WEB_ADMIN_TOKEN (already copied to the clipboard):'; Write-Host ''; Write-Host $t -ForegroundColor Green; Write-Host '';" ^
  "Write-Host 'Next: paste it into Vercel (WEB_ADMIN_TOKEN, Production), redeploy, then paste it in Maya Studio.'"

echo.
pause
