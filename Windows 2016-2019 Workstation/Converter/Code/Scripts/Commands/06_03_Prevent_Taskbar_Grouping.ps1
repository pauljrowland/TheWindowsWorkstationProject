# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "$(Get-Date -Format G) - Preventing TaskBar Grouping..." | Out-File -Filepath $logFile -Append
Write-Host "Preventing TaskBar grouping"
$regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer"
Write-Output "$(Get-Date -Format G) - Setting #regPath' to $regPath" | Out-File -Filepath $logFile -Append

New-Item -Path $regPath -Force   *>&1 | Out-File -Filepath $logFile -Append | Format-Table | out-null
Set-ItemProperty -Path $regPath -Name "NoTaskGrouping" -Value "1" -Type DWORD   *>&1 | Out-File -Filepath $logFile -Append | Format-Table | out-null

function restartExplorer()
{
    Write-Output "$(Get-Date -Format G) - Restarting Explorer.exe..." | Out-File -Filepath $logFile -Append
    Write-Host "Restarting Windows Explorer for the settings to take effect"
    Stop-Process -ProcessName explorer
}
Set-alias re restartExplorer
restartExplorer -Alias re -ErrorAction SilentlyContinue
Write-Host "Explorer restarted to load new settings..."
Write-Host ""
