document.querySelectorAll('.camera').forEach(camera => {
    const index = +camera.dataset.index;
    const port = 3007 - index;
    camera.src = `http://${window.location.hostname}:${port}`;
});
