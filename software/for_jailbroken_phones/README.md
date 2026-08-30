# Jailbroken Phone Utilities

## Setup
```
./provision_phone.sh 192.168.1.X
```

## For Removing
```
rm -rf /Applications/iCabMobile.app
rm -rf /Applications/.*iCab*
rm -rf /var/mobile/Library/Preferences/com.alienforce.icabmobile.plist
find /var/mobile/Library -iname '*icab*' -exec rm -rf {} +
uicache
killall SpringBoard
```