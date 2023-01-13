# Windows Server 2016 Automatic Configuration Script
#
# © Paul Rowland 2017
# v1.2
#
# You are free to modify this utility in any way or form, however the WindowsWorkstation.com project
# will not be held liable for any damage sustained to your computer as a result.
#
# You are free to distribute this utility as you wish without charge, however you must not remove
# the WindowsWorkstation.com and Win2016Workstation.com branding.

Clear-Host

# Set root of script and create log file
Set-Location $PSScriptRoot
$logFile = "..\Log\Install_" + (Get-Date -Format yyyy_MM_dd) + ".log"

Write-Output "" | Out-File -Filepath $logFile -Append
Write-Output "********************" | Out-File -Filepath $logFile -Append
Write-Output "$(Get-Date -Format G) - Start Win2016Workstation.com Automatic Conversion Utility" | Out-File -Filepath $logFile -Append
Write-Output "********************" | Out-File -Filepath $logFile -Append
Write-Output "" | Out-File -Filepath $logFile -Append

Write-Host ""
Write-Host "Convert your Windows Server 2016 into a Desktop Now!"
Write-Host ""
Write-Host "This script will automatically configure the majority of settings outlined in the guide."
Write-Host "You will be given the choice at each stage whether you wish to proceed or skip the particular step"
Write-Host ""
Write-Host "Windows2016Workstation.com - © 2017"
Write-Host ""
Write-Host ""

Write-Output "$(Get-Date -Format G) - Setting relative location" | Out-File -Filepath $logFile -Append
# Set root of script to allow relative .ps1 calls
Set-Location $PSScriptRoot\Commands
$logFile = "..\..\Log\Install_" + (Get-Date -Format yyyy_MM_dd) + ".log"

Write-Output "$(Get-Date -Format G) - Calling WScript Shell to create dialogues" | Out-File -Filepath $logFile -Append
# Call WScript Shell
$a = new-object -comobject wscript.shell

Write-Output "$(Get-Date -Format G) - Displaying welcome dialogue" | Out-File -Filepath $logFile -Append
# Assemble text for initial dialogue box
$mainBoxString = `
"Welcome to the Win2016Workstation.com Configuration Utility.`
`
This wizard will configure the majority of the options available`
on the Win2016Workstation.com website.`
`
To make the install simpler, you can click 'YES' to run the`
automatic install, or 'No' to choose each option manually"

# Display popup box with WScript Shell
$intAutoInstall = $a.popup($mainBoxString, 0,"Win2016Workstation.com Configuration Utility",4)

# If the user selects the automatic install, launch all scripts one by one:
If ($intAutoInstall -eq 6) { 

    Write-Output "$(Get-Date -Format G) - User chosen automatic setup option" | Out-File -Filepath $logFile -Append

    Clear-Host
    Write-host ""

    .\01_04_Computer_Name.ps1
    .\01_05_Owner_Info.ps1
    .\02_01_Enable_Wireless_Networking.ps1
    .\02_02_Enable_Audio_Service.ps1
    .\03_01_Disable_CAD.ps1
    .\03_03_Disable_Shutdown_Event_Tracker.ps1
    .\04_01_Disable_IE_ESC.ps1
    .\04_02_Install_Flash.ps1
    .\05_01_Performance_For_Applications.ps1
    .\05_02_Enable_Memory_Compression.ps1
    .\06_01_Enabling_Visual_Styles.ps1
    .\06_03_Prevent_Taskbar_Grouping.ps1
    .\07_01_Disable_DEP.cmd
    .\99_01_Change_Admin_Account_Name.ps1

}

# If the user chooses the manual install, confirm before every script:
else {

    Write-Output "$(Get-Date -Format G) - User chosen manual setup option" | Out-File -Filepath $logFile -Append

    Clear-Host
    Write-host ""

    $intAnswer0104 = $a.popup("Do you wish to rename your computer?", 0,"1.4 - Rename Computer",4) 
    If ($intAnswer0104 -eq 6) { 
        .\01_04_Computer_Name.ps1
    }

    $intAnswer0105 = $a.popup("Do you wish to set the owner information on your PC?", 0,"1.5 - Owner Information",4) 
    If ($intAnswer0105 -eq 6) { 
        .\01_05_Owner_Info.ps1   
    }

    $intAnswer0201 = $a.popup("Do you wish to enable wireless networking?", 0,"2.1 - Wireless Networking",4) 
    If ($intAnswer0201 -eq 6) { 
        .\02_01_Enable_Wireless_Networking.ps1        
    }

    $intAnswer0202 = $a.popup("Do you wish to enable audio?", 0,"2.2 - Enabling Audio",4) 
    If ($intAnswer0202 -eq 6) { 
        .\02_02_Enable_Audio_Service.ps1       
    }

    $intAnswer0301 = $a.popup("Do you wish to disable the Ctrl+Alt+Del requirement at logon?", 0,"3.1 - Disable Ctrl+Alt+Del",4) 
    If ($intAnswer0301 -eq 6) { 
        .\03_01_Disable_CAD.ps1
    }

    $intAnswer0303 = $a.popup("Do you wish to disable the Shutdown Event Tracker?", 0,"3.3 - Disable the Shutdown Event Tracker",4) 
    If ($intAnswer0303 -eq 6) { 
        .\03_03_Disable_Shutdown_Event_Tracker.ps1
    }

    $intAnswer0401 = $a.popup("Do you wish to disable Internet Explorer Enhanced Security Configuration?", 0,"4.1 - Disable Internet Explorer Enhanced Security Configuration",4) 
    If ($intAnswer0401 -eq 6) { 
        .\04_01_Disable_IE_ESC.ps1
    }

    $intAnswer0402 = $a.popup("Do you wish to install Adobe Flash Player for Internet Explorer?", 0,"4.2 - Install Adobe Flash Player for Internet Explorer",4) 
    If ($intAnswer0402 -eq 6) { 
        .\04_02_Install_Flash.ps1
    }

    $intAnswer0501 = $a.popup("Do you wish to enable better performance for applications?", 0,"5.1",4) 
    If ($intAnswer0501 -eq 6) { 
        .\05_01_Performance_For_Applications.ps1
    }

    $intAnswer0502 = $a.popup("Do you wish to enable Memory Compression?", 0,"5.2 - Enable Memory Compression",4) 
    If ($intAnswer0502 -eq 6) { 
        .\05_02_Enable_Memory_Compression.ps1
    }

    $intAnswer0601 = $a.popup("Do you wish to enable visual styles?", 0,"6.1 - Enabling Visual Styles",4) 
    If ($intAnswer0601 -eq 6) { 
        .\06_01_Enabling_Visual_Styles.ps1
    }

    $intAnswer0603 = $a.popup("Do you wish to disable Taskbar Grouping?", 0,"6.3 - Taskbar Grouping",4) 
    If ($intAnswer0603 -eq 6) { 
        .\06_03_Prevent_Taskbar_Grouping.ps1
    }

    $intAnswer0701 = $a.popup("Do you wish to disable DEP?", 0,"7.1 - Disabling DEP",4) 
    If ($intAnswer0701 -eq 6) { 
        Start-Process .\07_01_Disable_DEP.cmd
    }

    $intAnswer9901 = $a.popup("Do you wish to change the Administrator Username?", 0,"1.5 - Change Admin Account Username",4) 
    If ($intAnswer9901 -eq 6) { 
        .\99_01_Change_Admin_Account_Name.ps1
    }

}

# Complete

Write-Output "$(Get-Date -Format G) - Script complete, notify user" | Out-File -Filepath $logFile -Append

# Notify complete and ask whether to reboot PC:    
$strComplete ="The installation is now finished.`
`
To complete the conversion of your workstation, you will need to restart your server.`
`
Do you wish to do this now?"

$intComplete = $a.popup($strComplete, 0,"Complete",4) 

If ($intComplete -eq 6) { 

    Write-Output "$(Get-Date -Format G) - User chosen to restart machine" | Out-File -Filepath $logFile -Append

    Write-Output "" | Out-File -Filepath $logFile -Append
    Write-Output "********************" | Out-File -Filepath $logFile -Append
    Write-Output "$(Get-Date -Format G) - End Win2016Workstation.com Automatic Conversion Utility - Rebooting PC" | Out-File -Filepath $logFile -Append
    Write-Output "********************" | Out-File -Filepath $logFile -Append
    Write-Output "" | Out-File -Filepath $logFile -Append

    # Restart PC without prompt:
    Restart-Computer -Force

}

else {

    Write-Output "$(Get-Date -Format G) - User chosen to manually restart machine" | Out-File -Filepath $logFile -Append

    Write-Output "" | Out-File -Filepath $logFile -Append
    Write-Output "********************" | Out-File -Filepath $logFile -Append
    Write-Output "$(Get-Date -Format G) - End Win2016Workstation.com Automatic Conversion Utility" | Out-File -Filepath $logFile -Append
    Write-Output "********************" | Out-File -Filepath $logFile -Append
    Write-Output "" | Out-File -Filepath $logFile -Append

    Exit

}