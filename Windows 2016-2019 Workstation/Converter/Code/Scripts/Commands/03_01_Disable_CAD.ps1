# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "" | Out-File -Filepath $logFile -Append
Write-Output "" | Out-File -Filepath $logFile -Append
Write-Output "$(Get-Date -Format G) - **********" | Out-File -Filepath $logFile -Append
Write-Output "$(Get-Date -Format G) - Currently disabling CAD does not work" | Out-File -Filepath $logFile -Append
Write-Output "$(Get-Date -Format G) - **********" | Out-File -Filepath $logFile -Append


Write-Host "Disabling the Ctrl+Alt+Del requirement at logon"
Write-Host "Adding Registry entries"
$regPath = "HKLM:\Software\Microsoft\Windows NT\CurrentVersion\Winlogon"
Write-Output "$(Get-Date -Format G) - Setting 'regPath to $regPath" | Out-File -Filepath $logFile -Append

Set-ItemProperty -Path $regPath -Name "DisableCAD" -Value 1 -Type DWORD
Write-Host "Disabled Ctrl+Alt+Delete requirement"
Write-Host ""

Write-Output "$(Get-Date -Format G) - **********" | Out-File -Filepath $logFile -Append
Write-Output "$(Get-Date -Format G) - Ending non functioning section" | Out-File -Filepath $logFile -Append
Write-Output "$(Get-Date -Format G) - **********" | Out-File -Filepath $logFile -Append
Write-Output "" | Out-File -Filepath $logFile -Append
Write-Output "" | Out-File -Filepath $logFile -Append