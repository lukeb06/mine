document.querySelectorAll('.camera').forEach(camera => {
    const index = +camera.dataset.index;
    const port = 6027 - index;
    camera.src = `http://${window.location.hostname}:${port}`;
    try {
        fetch(camera.src, { mode: 'no-cors' }).then(r => {
            const wrapper = document.createElement('div');
            wrapper.className = 'camera-wrapper active';

            camera.before(wrapper);
            wrapper.appendChild(camera);
        });
    } catch (e) { }
});
