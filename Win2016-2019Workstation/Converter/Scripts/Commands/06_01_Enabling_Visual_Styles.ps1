# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "$(Get-Date -Format G) - Enabling Visual Styles..." | Out-File -Filepath $logFile -Append
Write-Host "Enabling Visual Styles on windows and buttons"

$regPath1 = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects"
Write-Output "$(Get-Date -Format G) - Setting 'regPath1' to $regPath1" | Out-File -Filepath $logFile -Append
Set-ItemProperty -Path $regPath1 -Name "VisualFXSetting" -Value 1 -Type DWORD  *>&1 | Out-File -Filepath $logFile -Append | Format-Table

Start-Sleep -s 1

$regPath2 = "HKCU:\Control Panel\Desktop"
Write-Output "$(Get-Date -Format G) - Setting 'regPath2' to $regPath2" | Out-File -Filepath $logFile -Append
Set-ItemProperty -Path $regPath2 -Name "UserPreferencesMask" -Value ([byte[]](0x9E,0x3E,0x07,0x80,0x12,0x00,0x00,0x00)) -Type BINARY  *>&1 | Out-File -Filepath $logFile -Append | Format-Table

Start-Sleep -s 1

$regPath3 = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
Write-Output "$(Get-Date -Format G) - Setting 'regPath3' to $regPath3" | Out-File -Filepath $logFile -Append
Set-ItemProperty -Path $regPath3 -Name "IconsOnly" -Value 0 -Type DWORD  *>&1 | Out-File -Filepath $logFile -Append | Format-Table
Set-ItemProperty -Path $regPath3 -Name "TaskbarAnimations" -Value 1 -Type DWORD  *>&1 | Out-File -Filepath $logFile -Append | Format-Table

Start-Sleep -s 1

Write-Host "Enabled Visual Styles on windows and buttons"

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