#!/bin/sh
sleep 5
activator send switch-off.com.a3tweaks.switch.rotation-lock
PAGE_NAME=$(scutil --get ComputerName | sed 's/[A-Z]/\L&/g; s/ /_/g')
/usr/bin/uiopen "icabmobile://192.168.1.131:5001/${PAGE_NAME}"
sleep 20
activator send switch-on.com.a3tweaks.switch.rotation-lock

