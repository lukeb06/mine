const ONLINE_CAMS = [];

function registerCamera(camera) {
    return new Promise(async (resolve, reject) => {
        const index = +camera.dataset.index;

        const wrapper = document.createElement('div');
        wrapper.className = 'camera-wrapper';

        camera.before(wrapper);
        wrapper.appendChild(camera);

        const viewBtn = document.createElement('a');
        viewBtn.className = 'view-btn';
        viewBtn.href = `${window.location.protocol}://${window.location.hostname}/cam${index}`;
        viewBtn.textContent = 'Control Cam';
        wrapper.appendChild(viewBtn);

        camera.src = `${window.location.protocol}://${window.location.hostname}/cam${index}`;

        const { ok } = await fetch(camera.src, { mode: 'no-cors' })
        if (!ok) return resolve();
        camera.classList.add('active');
        wrapper.classList.add('active');
        ONLINE_CAMS.push(index);
        resolve();
    });
}

function genCamCommand(cmd) {
    if (ONLINE_CAMS.length === 0) throw new Error('No online cams');
    const index = ONLINE_CAMS[0];
    return `/msg mrcamera${index} ${cmd}`;
}

async function main() {
    const cameras = Array.from(document.querySelectorAll('.camera'));
    await Promise.all(cameras.map(registerCamera));
    document.querySelector('#loadOverlay').classList.add('hidden');
    console.log('Cameras registered');
}

main();
