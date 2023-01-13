# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "$(Get-Date -Format G) - Disabling Shutdown Event Tracker..." | Out-File -Filepath $logFile -Append
Write-Host "Disabling the Shutdown Event Tracker"
$regPath = "HKLM:\Software\Policies\Microsoft\Windows NT\Reliability"
Write-Host "Adding entries to Registry"
New-Item -Path $regPath -Force *>&1 | Out-File -Filepath $logFile -Append | Format-Table
New-ItemProperty -Path $regPath -Name "ShutdownReasonOn" -Value 0 -PropertyType DWORD *>&1 | Out-File -Filepath $logFile -Append | Format-Table
Write-Host "Shutdown Event Tracker is now disabled"
Write-Host ""