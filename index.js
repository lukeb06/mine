const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer
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
        });
        this.index = +index;
    }

    init() {
        this.bot.once('spawn', async () => {
            mineflayerViewer(this.bot, { port: 3007 - this.index, firstPerson: true, viewDistance: 2 });
            //standalone(this.bot, { port: 3007 + this.index });
            await sleep(200);
            this.bot.chat('/register luke0215 luke0215');
            await sleep(200);
            this.bot.chat('/login luke0215');
            await sleep(1000);
            this.bot.physics.gravity = 0;
            this.bot.chat('/gmsp');
        });

        this.bot.on('message', message => {
            console.log(message.toAnsi());
            let tpB = message.toString().includes('EZcNOm') && message.toString().includes('teleport')
            if (message && message.toString() && tpB) {
                this.bot.chat('/tpaccept');
            }
        });

        this.bot.on('kicked', console.log);
        this.bot.on('error', console.log);
    }
}


async function main(index) {
    console.log(`Starting camera ${index}...`);
    const cam = new Camera(index);
    cam.init();
}

main(process.argv.at(-1));
