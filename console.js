const CONTROL_C = '\u0003';
const ENTER = '\r';
const BACKSPACE = '\u0008';
const DELETE = '\u007f';

process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');

class Log {
    constructor(...args) {
        this.args = args;
        this.method = 'log';
    }

    render() {
        console[this.method](...this.args);
    }
}

class ErrorLog extends Log {
    constructor(...args) {
        super(...args);
        this.method = 'error';
    }
}

class WarningLog extends Log {
    constructor(...args) {
        super(...args);
        this.method = 'warn';
    }
}

class Console {
    constructor(prefix = '> ') {
        this.outputBuffer = [];
        this.inputBuffer = '';

        this.prefix = prefix;

        this.separator = '\n';

        this.inputCallback = null;

        process.stdin.on('data', key => {
            if (key === CONTROL_C) process.exit();
            if (key === ENTER) return this.handleInput(this.inputBuffer);

            if (key === BACKSPACE || key === DELETE) {
                if (this.inputBuffer.length > 0) {
                    this.inputBuffer = this.inputBuffer.slice(0, -1);
                    process.stdout.write('\b \b');
                }

                return;
            }

            this.inputBuffer += key;
            //process.stdout.write(key);
        });
    }

    renderOutput() {
        this.outputBuffer.forEach(log => {
            log.render();
        });
    }

    clearOutput() {
        console.log(new Array(process.stdout.rows).fill('\n').join(''));
    }

    render() {
        this.clearOutput();
        //process.stdout.write(this.outputBuffer);
        this.renderOutput();
        process.stdout.write(this.separator);

        process.stdout.write(this.prefix);
        process.stdout.write(this.inputBuffer);
    }

    onInput(callback) {
        this.inputCallback = callback;
    }

    handleInput(input) {
        if (this.inputCallback) this.inputCallback(input);
        this.inputBuffer = '';
        this.render();
    }

    log(...args) {
        this.outputBuffer.push(new Log(...args));
        this.render();
    }

    warn(...args) {
        this.outputBuffer.push(new WarningLog(...args));
        this.render();
    }

    error(...args) {
        this.outputBuffer.push(new ErrorLog(...args));
        this.render();
    }
}

module.exports = {
    Console,
};
