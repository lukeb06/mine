const { fork } = require('child_process');
const readline = require('readline');

const { Console } = require('./console');

const JOIN_OFFSET = 7; // seconds
const CAM_COUNT = 3;

const CONSOLE = new Console();

class Process {
    constructor(file) {
        this.file = file;
        this.proc = fork(file);
        this.initProc();
    }

    send(data) {
        this.proc.send(data);
    }

    regenProc() {
        this.proc = fork(this.file);
        this.initProc();
    }

    initProc() {
        this.proc.on('message', data => {
            if (!data.event) return;

            switch (data.event) {
                default:
                    CONSOLE.log('Unknown event:', data.event);
                    break;
            }
        });
    }
}

class ServerProcess extends Process {
    constructor() {
        super('server.js');
    }
}

const MESSAGE_MAP = new Map();

class CamProcess extends Process {
    constructor(index) {
        super(`index.js`);
        this.index = index;
    }

    initProc() {
        this.proc.on('message', data => {
            if (!data.event) return;

            switch (data.event) {
                case 'chat':
                    const ts = Math.floor(Date.now() / 2000);
                    const id = `${ts}-${data.username}-${data.message}`
                    if (MESSAGE_MAP.has(id)) break;

                    MESSAGE_MAP.set(id, data);
                    break;
                case 'requestTPA':
                    if (!data.username) return this.send({ event: 'denyTPA' });

                    const ALLOWED_USERS = ['EZcNOm', 'fish'];

                    if (ALLOWED_USERS.includes(data.username)) this.send({ event: 'acceptTPA', username: data.username });
                    else this.send({ event: 'denyTPA', username: data.username });

                    break;
                case 'crash':
                    CONSOLE.log(`CAM ${this.index} CRASHED: ${data.reason}`);
                    this.regenProc();
                    break;
                case 'message':
                    const mts = Math.floor(Date.now() / 100);
                    const mid = `${mts}-${data.message}`
                    if (MESSAGE_MAP.has(mid)) break;

                    MESSAGE_MAP.set(mid, data);
                    CONSOLE.log(`CAM ${this.index} CHAT: ${data.message}`);

                    break;
                default:
                    CONSOLE.log('Unknown event:', data.event);
                    break;
            }
        });
    }

    startCam() {
        CONSOLE.log(`Starting camera ${this.index}...`);
        this.send({ event: 'startCam', index: this.index });
    }
}

function createCam(index) {
    return new Promise(resolve => {
        const cam = new CamProcess(index);
        setTimeout(() => {
            cam.startCam();
            setTimeout(() => {
                resolve(cam);
            }, 3000);
        }, index * JOIN_OFFSET * 1000);
    });
}

function createCams() {
    const cams = [];
    for (let i = 0; i < CAM_COUNT; i++) {
        const cam = createCam(i);
        cams.push(cam);
    }

    return Promise.all(cams);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function prompt(message) {
    return new Promise(resolve => {
        rl.question(message, answer => {
            resolve(answer);
        })
    });
}

async function main() {
    CONSOLE.log('Starting server...');
    const serverProc = new ServerProcess();
    const camProcs = await createCams();

    CONSOLE.onInput(input => {
        camProcs.forEach(cam => cam.send({ event: 'chat', message: input }));
    });
}

main();
