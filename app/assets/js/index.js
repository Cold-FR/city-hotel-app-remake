const ipc = window.electronAPI;
const iframe = document.getElementById('iframe');

window.addEventListener('load', async () => {
    const version = await ipc.getVersion();
    if (document.getElementById('version')) document.getElementById('version').innerText = version;
});

if(document.getElementById('buttons')) {
    document.getElementById('close').addEventListener('click', () => {
        document.getElementById('buttons').classList.toggle('opened');
    });

    document.getElementById('cache').addEventListener('click', () => ipc.clearCache());

    document.getElementById('zoomIn').addEventListener('click', () => ipc.zoomIn());
    document.getElementById('zoomReset').addEventListener('click', () => ipc.zoomReset());
    document.getElementById('zoomOut').addEventListener('click', () => ipc.zoomOut());

    document.getElementById('reload').addEventListener('click', () => iframe.src += '');
}

window.addEventListener('keydown', (e) => {
    if(e.key === 'F11') ipc.fullScreen();
});