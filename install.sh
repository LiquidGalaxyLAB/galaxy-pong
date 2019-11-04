#!bin/bash

echo -e "

\e[34m _                 _              _
\e[31m| |               |_|            | |
\e[33m| |                              | |
\e[32m|_|                              |_|\e[39m

https://github.com/LiquidGalaxy/liquid-galaxy

https://github.com/LiquidGalaxyLAB/liquid-galaxy

-------------------------------------------------------------

"

# Pong Installer #

echo "Installing Pong" > $HOME/pong.txt

# Open port

LINHA=cat /etc/iptables.conf | grep "tcp" | grep "81" | awk -F " -j" '{print $1}'
RESULT=$LINHA”,“8112
sed -i “s/$LINHA/$RESULT/g” /etc/iptables.conf

# Server

pm2 start index.js --name PONG_PORT:8112 2>>$HOME/pong.txt

pm2 save 2>>$HOME/pong.txt

echo "Installation complete" >>$HOME/pong.txt