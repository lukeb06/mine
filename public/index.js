function registerCamera(camera) {
    return new Promise(async (resolve, reject) => {
        const index = +camera.dataset.index;
        const port = 6027 - index;

        const wrapper = document.createElement('div');
        wrapper.className = 'camera-wrapper';

        camera.before(wrapper);
        wrapper.appendChild(camera);

        const viewBtn = document.createElement('a');
        viewBtn.className = 'view-btn';
        viewBtn.href = `http://${window.location.hostname}:${port}`;
        viewBtn.textContent = 'Control Cam';
        wrapper.appendChild(viewBtn);

        camera.src = `http://${window.location.hostname}:${port}`;

        try {
            await fetch(camera.src, { mode: 'no-cors' })
            camera.classList.add('active');
            wrapper.classList.add('active');
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

async function main() {
    const cameras = Array.from(document.querySelectorAll('.camera'));
    await Promise.all(cameras.map(registerCamera));
    console.log('Cameras registered');
}

main();
