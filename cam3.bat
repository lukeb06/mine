TIMEOUT /t 15
:loop
node index.js 3
TIMEOUT /t 10
goto loop
