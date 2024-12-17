const { fork } = require('child_process');

const JOIN_OFFSET = 5; // seconds
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

class CamProcess extends Process {
    constructor(index) {
        super(`index.js`);
        this.index = index;
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
