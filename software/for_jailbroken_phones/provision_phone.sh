#!/bin/zsh

ip=${1}
exec "scp -o  HostkeyAlgorithms=+ssh-rsa,ssh-dss autolaunch.sh root@${ip}:/usr/local/bin/"
exec "scp -o  HostkeyAlgorithms=+ssh-rsa,ssh-dss com.ingot.autolaunch.plist root@${ip}:/Library/LaunchDaemons/"
exec "scp -o  HostkeyAlgorithms=+ssh-rsa,ssh-dss com.ingot.icab_watchdog.plist root@${ip}:/Library/LaunchDaemons/com.ingot.icab_watchdog.plist"
echo
echo "Run on the iPhone:"
echo "launchctl load /Library/LaunchDaemons/com.ingot.icab_watchdog.plist"
