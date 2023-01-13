@ECHO OFF
@ECHO Attempting to disable DEP in the boot file.
@ECHO.
@ECHO This may fail if UEFI SecureBoot is enabled, so it is safe to ignore the
@ECHO error message. If it does fail, You'll have to set this manually using step
@ECHO 7.1 on the Win2016WorkStation.com website...
@ECHO.
%windir%\system32\bcdedit.exe /set {current} nx AlwaysOff
@ECHO.
@ECHO.