# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "$(Get-Date -Format G) - Enabling Memory Compression..." | Out-File -Filepath $logFile -Append
Write-Host "Enabling Memory Compression"
Enable-MMAgent -MemoryCompression  *>&1 | Out-File -Filepath $logFile -Append | Format-Table
Write-Host "Enabled Memory Compression"
Write-Host ""