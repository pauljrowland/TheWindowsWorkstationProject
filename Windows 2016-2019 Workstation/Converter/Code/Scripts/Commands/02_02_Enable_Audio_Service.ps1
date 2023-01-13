# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "$(Get-Date -Format G) - Enabling Audio Service..." | Out-File -Filepath $logFile -Append
Write-Host "Enabling Audio Service"
Set-Service "Audiosrv" -StartupType Automatic  *>&1 | Out-File -Filepath $logFile -Append | Format-Table
Write-Host "Starting Audio Service"
Start-Service "Audiosrv"  *>&1 | Out-File -Filepath $logFile -Append | Format-Table
Write-Host "Started Audio Service"
Write-Host ""