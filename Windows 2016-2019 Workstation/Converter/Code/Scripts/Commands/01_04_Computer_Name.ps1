# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Write-Output "$(Get-Date -Format G) - Requesting new computer name" | Out-File -Filepath $logFile -Append

Write-Host "Please choose a computer name which is no more than 15 characters, click 'Cancel' or leave the text unchanged."
Function Show-Inputbox {
    Param([string]$message,
        [string]$title,
        [string]$default
        )
        [reflection.assembly]::loadwithpartialname("microsoft.visualbasic") | Out-Null
        [microsoft.visualbasic.interaction]::InputBox($message,$title,$default)
    }
$messageBoxText = "If you would like to change your computer name, please do so now and click 'OK'.
`
`If you wish to keep the current name, you can either leave the text as is or click 'Cancel'"

function setMachineName {

    $currentName = $env:Computername
    $newName = Show-Inputbox -message $messageBoxText -title "Computer Name" -default $currentName

    Write-Output "$(Get-Date -Format G) - User chosen $newName over $currentName" | Out-File -Filepath $logFile -Append

    if (([String]::IsNullOrEmpty($newName)) -or ($newName -eq $currentName)){

        Write-Output "$(Get-Date -Format G) - Machine name to remain unchanged" | Out-File -Filepath $logFile -Append
        Write-Host "The name will remain unchanged"

    }

    else {

        if ($newName.Length -gt 15) {

            Write-Output "$(Get-Date -Format G) - $newName is too long, trying again" | Out-File -Filepath $logFile -Append
            $a.popup(“The name you have chosen for your PC is too long, please try something which is 15 characters or less“,0,“ERROR: Name Too Long”,0)
            Clear-Host
            setMachineName

        }

        else {

            Write-Output "$(Get-Date -Format G) - Machine name to be changed to $newName" | Out-File -Filepath $logFile -Append
            Rename-Computer -NewName $newName *>&1 | Out-File -Filepath $logFile -Append | Format-Table
            Write-Host "Your computer name has been changed to "$newName"."
           
        }

    }

}

setMachineName

Write-Host ""