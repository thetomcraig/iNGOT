#!/bin/sh
sleep 15
PAGE_NAME=$(scutil --get ComputerName | sed 's/[A-Z]/\L&/g; s/ /_/g')
/usr/bin/uiopen "icabmobile://192.168.1.131:5001/${PAGE_NAME}"
