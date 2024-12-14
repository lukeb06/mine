TIMEOUT /t 5
:loop
node index.js 1
TIMEOUT /t 10
goto loop
