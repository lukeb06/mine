start cam0.bat
start cam1.bat
start cam2.bat
:loop
node server.js
TIMEOUT /t 10
goto loop
