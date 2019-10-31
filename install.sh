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

# Initialize sudo access

sudo -v

# Server

sudo npm install pm2@latest -g 2>>$HOME/pong.txt

pm2 start index.js --name PONG_PORT:8112 2>>$HOME/pong.txt

pm2 save 2>>$HOME/pong.txt

echo "Installation complete" >>$HOME/pong.txt