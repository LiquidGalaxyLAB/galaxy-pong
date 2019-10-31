
. ${HOME}/etc/shell.conf

for lg in $LG_FRAMES ; do
	echo
	echo $lg:
	if [ $lg == "lg1" ]; then
		echo "Master"
		pkill -f chromium-browser
		pm2 stop PONG_PORT:8112
	else
		echo "Slave"
		ssh -Xnf lg@$lg "pkill -f chromium-browse" || true
    fi
done 

