document.querySelectorAll('.camera').forEach(camera => {
    const index = +camera.dataset.index;
    const port = 6027 - index;

    const wrapper = document.createElement('div');
    wrapper.className = 'camera-wrapper';

    camera.before(wrapper);
    wrapper.appendChild(camera);

    camera.src = `http://${window.location.hostname}:${port}`;

    try {
        fetch(camera.src, { mode: 'no-cors' }).then(r => {
            camera.classList.add('active');
        });
    } catch (e) { }
});
