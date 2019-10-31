#!bin/bash

echo -e "

\e[34m _				 _				_
\e[31m| |				|_| 		   | |
\e[33m| |     						   | |
\e[32m|_|  							   |_|\e[39m

https://github.com/LiquidGalaxy/liquid-galaxy

https://github.com/LiquidGalaxyLAB/liquid-galaxy

-------------------------------------------------------------

"

# Pong Installer #

echo "Installing Pong" > $HOME/pong.txt

echo -ne '.......................   (0%)\r'

# Initialize sudo access

sudo -v

echo -ne '###########............   (50%)\r'

# Server

sudo npm install pm2@latest -g 2>>$HOME/pong.txt

echo -ne '##################.....   (75%)\r'

if [ pwd == "/home/lg/galaxy-pong" ] ; then

    pm2 start index.js --name PONG 2>>$HOME/pong.txt

elif [ pwd == "home/lg" ]; then

    pm2 start /galaxy-pong/index.js --name PONG 2>>$HOME/pong.txt

fi

echo -ne '####################...   (90%)\r'

pm2 save 2>>$HOME/pong.txt

echo -ne '######################.   (99%)\r'

echo "Installation complete" >>$HOME/pong.txt

echo -ne '\n'