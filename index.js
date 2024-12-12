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
            console.log(message.toAnsi());
            let tpB = message.toString().includes('EZcNOm') && message.toString().includes('teleport')
            if (message && message.toString() && tpB) {
                this.bot.chat('/tpaccept');
            }
        });

        this.bot.on('kicked', (d) => {
            console.log(d);
            console.log('Kicked');
            console.log(d.value.extra);
        });
        this.bot.on('error', console.log);
    }
}


async function main(index) {
    console.log(`Starting camera ${index}...`);
    const cam = new Camera(index);
    cam.init();
}

main(process.argv.at(-1));
