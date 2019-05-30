#!/bin/bash

. ${HOME}/etc/shell.conf

for lg in $LG_FRAMES ; do
	echo
	echo $lg:
	if [ $lg == "lg1" ]; then
		echo "Master"
		pkill -f chromium-browser
	else
		echo "Slave"
		ssh -Xnf lg@$lg "pkill -f chromium-browser " || true
    fi
done 

pm2 stop pong