const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-neoviewer').mineflayer
//const { standalone } = require('prismarine-viewer');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class Camera {
    constructor(index) {
        this.bot = mineflayer.createBot({
            host: 'fishcraft.live',
            username: `mrcamera${index}`,
            auth: 'offline',
            version: '1.21.1',
        });
        this.index = +index;
    }

    init() {
        this.bot.once('spawn', async () => {
            this.bot.physics.gravity = 0;
            mineflayerViewer(this.bot, { port: 6027 - this.index, firstPerson: false, viewDistance: 3 });
            //standalone(this.bot, { port: 3007 + this.index });
            await sleep(200);
            this.bot.chat('/register luke0215 luke0215');
            await sleep(200);
            this.bot.chat('/login luke0215');
            await sleep(1000);
            this.bot.chat('/gmsp');
        });

        this.bot.on('message', message => {
            if (!message) return;
            const str = message.toString();
            if (!str) return;

            process.send({ event: 'message', message: message.toAnsi() });

            const usernameRegex = /(.*?) has requested/g
            let username = '';

            try {
                username = usernameRegex.exec(str)[1];
            } catch (e) { }

            const isTPAHere = str.includes('teleport to them');
            const isTPA = str.includes('teleport to you');

            if (isTPA) this.bot.chat('/tpaccept');
            if (isTPAHere) process.send({ event: 'requestTPA', username });
        });

        process.on('message', data => {
            if (!data.event) return;

            switch (data.event) {
                case 'acceptTPA':
                    this.bot.chat('/tpaccept');
                    break;
                case 'denyTPA':
                    if (data.username)
                        this.bot.chat(`/msg ${data.username} You are not allowed to do that!`)
                    this.bot.chat('/tpdeny');
                case 'chat':
                    this.bot.chat(data.message);
                    break;
                default:
                    break;
            }
        });

        this.bot.on('chat', (username, message) => {
            process.send({ event: 'chat', username, message });
        });

        this.bot.on('kicked', (d) => {
            process.send({ event: 'crash', reason: 'kicked' });
            process.exit(1);
        });
        this.bot.on('error', () => {
            process.send({ event: 'crash', reason: 'error' });
            process.exit(1);
        });
    }
}


async function main(index) {
    const cam = new Camera(index);
    cam.init();
}

//main(process.argv.at(-1));

process.on('message', data => {
    if (data.event && data.event === 'startCam') main(data.index);
});
