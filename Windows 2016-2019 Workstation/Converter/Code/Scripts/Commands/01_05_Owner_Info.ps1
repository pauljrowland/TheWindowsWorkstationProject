# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "$(Get-Date -Format G) - Setting owner info..." | Out-File -Filepath $logFile -Append

Write-Host "Setting Owner Info."
Function Show-Inputbox {
    Param([string]$message=$(Throw "You must enter a prompt message"),
        [string]$title="Input",
        [string]$default
        )
        [reflection.assembly]::loadwithpartialname("microsoft.visualbasic") | Out-Null
        [microsoft.visualbasic.interaction]::InputBox($message,$title,$default)

        Write-Output "$(Get-Date -Format G) - Assembling input box for Owner info" | Out-File -Filepath $logFile -Append

    }

Write-Output "$(Get-Date -Format G) - Requesting owner name" | Out-File -Filepath $logFile -Append
Write-Host "Requesting owner name"
$ownerMessageBoxText = "Enter your name into the box below and click 'OK'.
`
`If you click 'Cancel' or leave the box blank, nothing will be changed"
$newOwnerName = Show-Inputbox -message $ownerMessageBoxText -title "Change Owner Name"
Write-Output "$(Get-Date -Format G) - Setting 'newOwnerName' to $newOwnerName" | Out-File -Filepath $logFile -Append

Write-Output "$(Get-Date -Format G) - Requesting organization name" | Out-File -Filepath $logFile -Append
Write-host "Requesting organization name"
$orgMessageBoxText = "Enter your Organization name and click 'OK'.
`
`If you click 'Cancel' or leave the box blank, nothing will be changed"
$newOrgName = Show-Inputbox -message $orgMessageBoxText -title "Change Organization Name"
Write-Output "$(Get-Date -Format G) - Setting 'newOrgName' to $newOrgName" | Out-File -Filepath $logFile -Append

$regPath = "HKLM:\Software\Microsoft\Windows NT\CurrentVersion"
if (![String]::IsNullOrEmpty($newOwnerName)){

    Write-Output "$(Get-Date -Format G) - Insert owner information into Registry" | Out-File -Filepath $logFile -Append
    Write-Host "Adding new owner name to Registry"
    Set-ItemProperty -Path $regPath -Name "RegisteredOwner" -Value $newOwnerName -Type String *>&1 | Out-File -Filepath $logFile -Append | Format-Table
    write-host "New onwner name is: "$newOwnerName

    }

else {

    Write-Output "$(Get-Date -Format G) - No owner information supplied" | Out-File -Filepath $logFile -Append

}

if (![String]::IsNullOrEmpty($newOrgName)){

    Write-Output "$(Get-Date -Format G) - Insert organization information into Registry" | Out-File -Filepath $logFile -Append
    Write-Host "Adding Organization name to Registry"
    Set-ItemProperty -Path $regPath -Name "RegisteredOrganization" -Value $newOrgName -Type String *>&1 | Out-File -Filepath $logFile -Append | Format-Table
    write-host "New Organisation name is: "$newOrgName

    }

else {

    Write-Output "$(Get-Date -Format G) - No organization information supplied" | Out-File -Filepath $logFile -Append

}

Write-Output "$(Get-Date -Format G) - Starting Winver.exe" | Out-File -Filepath $logFile -Append
Start-Process "c:\windows\system32\winver.exe" *>&1 | Out-File -Filepath $logFile -Append | Format-Table

Write-Host ""