# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "$(Get-Date -Format G) - Disabling IEESC..." | Out-File -Filepath $logFile -Append

Write-Host "Disabling Internet Explorer Enhanced Security Configuration (IE ESC)"

Write-Output "$(Get-Date -Format G) - Disabling IEESC for Admins" | Out-File -Filepath $logFile -Append
Write-Host "Disabling IE ESC for Admins"
$regPathAdmins = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A7-37EF-4b3f-8CFC-4F3A74704073}"
Set-ItemProperty -Path $regPathAdmins -Name "IsInstalled" -Value 0 -Type DWORD *>&1 | Out-File -Filepath $logFile -Append | Format-Table

Write-Output "$(Get-Date -Format G) - Disabling IEESC for Admins" | Out-File -Filepath $logFile -Append
Write-Host "Disabling IE ESC for Non-Admins"
$regPathUsers = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A8-37EF-4b3f-8CFC-4F3A74704073}"
Set-ItemProperty -Path $regPathUsers -Name "IsInstalled" -Value 0 -Type DWORD *>&1 | Out-File -Filepath $logFile -Append | Format-Table

Write-Host "IE ESC is now disabled"
Write-Host ""