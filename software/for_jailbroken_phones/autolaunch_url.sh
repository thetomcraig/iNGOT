#!/bin/sh

killall MobileSafari

uiopen "http://192.168.1.131:5001/office_1136x640"

until uiopen "calshow:" 2>/dev/null; do
    sleep 2
done

sleep 5

uiopen "http://192.168.1.131:5001/office_1136x640"
