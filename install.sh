#!/bin/bash

echo "Installing Galaxy Pong" >$HOME/pong.txt

# Initialize sudo access

sudo -v

# Open port 8112

LINE=`cat /etc/iptables.conf | grep "tcp" | grep " 8100" | awk -F " -j" '{print $1}'`

RESULT=$LINE",8112"

DATA=`cat /etc/iptables.conf | grep "tcp" | grep " 8100" | grep "8112"`

if [ "$DATA" == "" ]; then
    sed -i "s/$LINE/$RESULT/g" /etc/iptables.conf 2>>$HOME/pong.txt
else
    echo "Port already open"
fi

# Install all dependencies

npm install

# Server

pm2 start index.js --name PONG_PORT:8112 2>>$HOME/pong.txt

pm2 save 2>>$HOME/pong.txt

echo "Installation complete" >>$HOME/pong.txt
