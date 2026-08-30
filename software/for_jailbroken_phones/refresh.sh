#!/bin/sh
PAGE_NAME=$(scutil --get ComputerName | sed 's/[A-Z]/\L&/g; s/ /_/g')
# iCab Browser
/usr/bin/uiopen "icabmobile://192.168.1.131:5001/${PAGE_NAME}"
# Safari
# /usr/bin/uiopen "http://192.168.1.131:5001/${PAGE_NAME}"

