document.querySelectorAll('.camera').forEach(camera => {
    const index = +camera.dataset.index;
    const port = 6027 - index;
    camera.src = `http://${window.location.hostname}:${port}`;
    fetch(camera.src, { mode: 'no-cors' }).then(r => {
        if (r.ok) {
            camera.classList.add('active');
        }
    });
});
