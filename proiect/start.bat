@echo off

start cmd /k "http-server" &

timeout /t 1

start cmd /k "node server.js" &

timeout /t 1

start cmd /k "node sensors.js" &
