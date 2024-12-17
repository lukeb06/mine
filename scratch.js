procesc.stdin.setRawMode(true);

process.stdin.on('data', key => {
    console.log(key);
    if (key === '\u0003') {
        console.log('enter');
    }
});
