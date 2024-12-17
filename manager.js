const { fork } = require('child_process');

const JOIN_OFFSET = 7; // seconds
const CAM_COUNT = 3;


class Process {
    constructor(file) {
        this.file = file;
        this.proc = fork(file);
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
                    const id = Math.floor(Date.now() / 2000);
                    if (MESSAGE_MAP.has(id)) break;

                    MESSAGE_MAP.set(id, data);
                    console.log(`CAM CHAT: ${data.username}: ${data.message}`);
                    break;
                case 'requestTPA':
                    if (!data.username) return this.proc.send({ event: 'denyTPA' });

                    const ALLOWED_USERS = ['EZcNOm', 'fish'];

                    if (ALLOWED_USERS.includes(data.username)) this.proc.send({ event: 'acceptTPA', username: data.username });
                    else this.proc.send({ event: 'denyTPA', username: data.username });

                    break;
                default:
                    console.log('Unknown event:', data.event);
                    break;
            }
        });
    }

    startCam() {
        this.proc.send({ event: 'startCam', index: this.index });
    }
}

function createCam(index) {
    return new Promise(resolve => {
        const cam = new CamProcess(index);
        setTimeout(() => {
            cam.startCam();
            resolve();
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

async function main() {
    const serverProc = new ServerProcess();
    const camProcs = await createCams();


}

main();
