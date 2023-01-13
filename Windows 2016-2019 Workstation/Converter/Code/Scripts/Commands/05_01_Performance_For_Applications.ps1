# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "$(Get-Date -Format G) - Enabling Performance for Applications..." | Out-File -Filepath $logFile -Append
Write-Host "Prioritising CPU performance for applications"

$regPathPriority = "HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl"
Write-Output "$(Get-Date -Format G) - Setting Reg path to $regPathPriority" | Out-File -Filepath $logFile -Append

Set-ItemProperty -Path $regPathPriority -Name "Win32PrioritySeparation" -Value 38 -Type DWORD *>&1 | Out-File -Filepath $logFile -Append | Format-Table
Write-Host "Priority is now set for Applications"
Write-Host ""



