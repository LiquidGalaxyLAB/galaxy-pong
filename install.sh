#!/bin/bash

echo "Installing Galaxy Pong" >$HOME/pong.txt

# Initialize sudo access

sudo -v

# Open port 8080

LINE=`cat /etc/iptables.conf | grep "tcp" | grep " 81," | awk -F " -j" '{print $1}'`

RESULT=$LINE",8112"

DATA=`cat /etc/iptables.conf | grep "tcp" | grep " 81," | grep "8112"`

if [ "$DATA" == "" ]; then
    echo "Port already open"
else
    sed -i "s/$LINE/$RESULT/g" /etc/iptables.conf 2>>$HOME/pong.txt
fi

# Server

pm2 start index.js --name PONG_PORT:8112 2>>$HOME/pong.txt

pm2 save 2>>$HOME/pong.txt

echo "Installation complete" >>$HOME/pong.txt
