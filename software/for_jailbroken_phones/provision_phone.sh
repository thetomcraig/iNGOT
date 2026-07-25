#!/bin/zsh

ip=${1}
exec "scp -o  HostkeyAlgorithms=+ssh-rsa,ssh-dss autolaunch.sh root@${ip}:/usr/local/bin/"
exec "scp -o  HostkeyAlgorithms=+ssh-rsa,ssh-dss com.ingot.autolaunch.plist root@${ip}:/Library/LaunchDaemons/"
exec "scp -O -r -o HostKeyAlgorithms=+ssh-rsa Mercury3.app root@:${ip}/Applications/"

# ON THE IPHONE
chown -R root:wheel /Applications/Mercury3.app
chmod -R 755 /Applications/Mercury3.app
killall SpringBoard
