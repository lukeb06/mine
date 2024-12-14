TIMEOUT /t 10
:loop
node index.js 2
TIMEOUT /t 10
goto loop
