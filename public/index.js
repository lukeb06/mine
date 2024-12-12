document.querySelectorAll('.camera').forEach(camera => {
    const index = +camera.dataset.index;
    const port = 6027 - index;
    camera.src = `http://${window.location.hostname}:${port}`;
});
