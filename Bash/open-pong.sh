#!/bin/bash

. ${HOME}/etc/shell.conf

ACTUALSCREEN=0

pm2 start pong

sleep 3

for lg in $LG_FRAMES ; do
	ACTUALSCREEN=$(echo "$lg" | cut -c3)
	if [ $ACTUALSCREEN == 1 ]; then
		export DISPLAY=:0
        nohup chromium-browser http://lg1:8112/ --start-maximized </dev/null >/dev/null 2>&1 &
		sleep 3
        xdotool key F11
		sleep 1
        xdotool key F5
	else
        ssh -Xnf lg@$lg " export DISPLAY=:0 ; chromium-browser http://lg1:8112/ --start-maximized </dev/null >/dev/null 2>&1 &" || true
        sleep 3
        ssh -Xnf lg@$lg "export DISPLAY=:0 ; nohup xdotool key F11; sleep 1; xdotool key F5" || true

	fi
done