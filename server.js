const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Request-Method', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }

    next();
})

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});


function sendSteveSkin(res) {
    const fileData = fs.readFileSync(path.join(__dirname, './public/assets/skins/steve.png'))
    const skinBuffer = Buffer.from(fileData, 'binary')
    res.set('Content-Type', 'image/png').send(skinBuffer)
}


app.get('/getSkin', async (req, res) => {
    if (!req.query.name || req.query.name === 'undefined') {
        sendSteveSkin(res)
        return
    }

    const name = req.query.name

    const file = `${__dirname}/public/assets/skins/${name}.png`;

    if (fs.existsSync(file)) {
        const skin = fs.readFileSync(file)
        res.set('Content-Type', 'image/png').send(skin)
        return
    }

    const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}?at=${Date.now()}`)
    if (uuid.status !== 200 || uuid.length === 0) {
        sendSteveSkin(res)
        return
    }
    const uuidJson = await uuid.json()

    const session = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuidJson.id}`)
    if (session.status !== 200 || session.length === 0) {
        sendSteveSkin(res)
        return
    }
    const sessionJson = await session.json()

    const skinData = JSON.parse(Buffer.from(sessionJson.properties[0].value, 'base64').toString('utf8'))
    const url = skinData.textures.SKIN.url

    const skin = await fetch(url).then(r => r.buffer())

    fs.writeFileSync(file, skin)

    res.set('Content-Type', 'image/png').send(skin)

});

app.get('/steve', (req, res) => {
    sendSteveSkin(res);
});

app.listen(3008);
