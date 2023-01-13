# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "$(Get-Date -Format G) - Installing Adobe Flash Player..." | Out-File -Filepath $logFile -Append
Write-Host "Installing Adobe Flash PLayer"
dism /online /add-package /packagepath:"C:\Windows\Servicing\Packages\Adobe-Flash-For-Windows-Package~31bf3856ad364e35~amd64~~10.0.14393.0.mum" /NoRestart *>&1 | Out-File -Filepath $logFile -Append | Format-Table
Write-Host "Installed Adobe Flash Player"
Write-Host ""