

. ${HOME}/etc/shell.conf

ACTUALSCREEN=0

pm2 start PONG_PORT:8112

sleep 0.5

for lg in $LG_FRAMES ; do
	ACTUALSCREEN=$(echo "$lg" | cut -c3)
	if [ $ACTUALSCREEN == 1 ]; then
		export DISPLAY=:0
        nohup chromium-browser https://lg1:8112/ --start-fullscreen </dev/null >/dev/null 2>&1 &

        echo 'DHCP_RUNNING_PROGRAM="pong"' > $HOME/running.txt
	else
        ssh -Xnf lg@$lg " export DISPLAY=:0 ; chromium-browser https://lg1:8112/ --start-fullscreen </dev/null >/dev/null 2>&1 &" || true
	fi
    sleep 0.5
done
