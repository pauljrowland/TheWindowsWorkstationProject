# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "$(Get-Date -Format G) - Changing Administrator account name..." | Out-File -Filepath $logFile -Append

Write-Host "Please choose your User Name, click 'Cancel' or leave the text unchanged."
Function Show-Inputbox {
    Param([string]$message=$(Throw "You must enter a prompt message"),
        [string]$title="Input",
        [string]$default
        )
        [reflection.assembly]::loadwithpartialname("microsoft.visualbasic") | Out-Null
        [microsoft.visualbasic.interaction]::InputBox($message,$title,$default)
        Write-Output "$(Get-Date -Format G) - Assemble and show input box" | Out-File -Filepath $logFile -Append
    }
$messageBoxText = "If you would like to change your user name, please do so now and click 'OK'.
`
`If you wish to keep the current name, you can either leave the text as is or click 'Cancel'"


$currentName = $env:UserName
$newName = Show-Inputbox -message $messageBoxText -title "User Name" -default $currentName

Write-Output "$(Get-Date -Format G) - Current username is $currentName" | Out-File -Filepath $logFile -Append
Write-Output "$(Get-Date -Format G) - New username will be $newName" | Out-File -Filepath $logFile -Append


if (([String]::IsNullOrEmpty($newName)) -or ($newName -eq $currentName)){

    Write-Output "$(Get-Date -Format G) - No user name supplied, remaining the same" | Out-File -Filepath $logFile -Append

    Write-Host "The name will remain unchanged"

    }

else {

    Write-Output "$(Get-Date -Format G) - Attempting to change $currentName to $newName" | Out-File -Filepath $logFile -Append
    Rename-LocalUser -Name $currentName -NewName $newName | Out-Null  *>&1 | Out-File -Filepath $logFile -Append | Format-Table
    Write-Host "Your user name has been changed to "$newName"."
    }

Write-Host ""