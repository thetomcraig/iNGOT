#!/bin/sh
PAGE_NAME=$(scutil --get ComputerName | sed 's/[A-Z]/\L&/g; s/ /_/g')


# iCab Browser
# killall iCabMobile 2>/dev/null || true
# /usr/bin/uiopen "icabmobile://192.168.1.131:5001/${PAGE_NAME}"

# Safari
killall MobileSafari
/usr/bin/uiopen "http://192.168.1.131:5001/${PAGE_NAME}"
# to make sfari chrome hide
# The most reliable way is to turn the phone to portriat mode,
# then back to landscape
# So, this programatically switches to portriat mode,
# then, because the device is always in landscape mode,
# it will rotate BACK to landscape mode.
# Effectively this makes sure the chrome bar in safari remains hidden at all times
sleep 10
activator send com.ichitaso.uirotation.up
