const { fork } = require('child_process');
const readline = require('readline');

const JOIN_OFFSET = 7; // seconds
const CAM_COUNT = 3;


class Process {
    constructor(file) {
        this.file = file;
        this.proc = fork(file);
    }

    send(data) {
        this.proc.send(data);
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

        this.proc.on('message', data => {
            if (!data.event) return;

            switch (data.event) {
                case 'chat':
                    const ts = Math.floor(Date.now() / 2000);
                    const id = `${ts}-${data.username}-${data.message}`
                    if (MESSAGE_MAP.has(id)) break;

                    MESSAGE_MAP.set(id, data);
                    console.log(`CAM CHAT: ${data.username}: ${data.message}`);
                    break;
                case 'requestTPA':
                    if (!data.username) return this.send({ event: 'denyTPA' });

                    const ALLOWED_USERS = ['EZcNOm', 'fish'];

                    if (ALLOWED_USERS.includes(data.username)) this.send({ event: 'acceptTPA', username: data.username });
                    else this.send({ event: 'denyTPA', username: data.username });

                    break;
                default:
                    console.log('Unknown event:', data.event);
                    break;
            }
        });
    }

    startCam() {
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
            }, 2000);
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
    const serverProc = new ServerProcess();
    const camProcs = await createCams();

    while (true) {
        const answer = await prompt('> ');
        camProcs[0].send({ event: 'chat', message: answer });
    }
}

main();
