const ipc = window.electronAPI;

window.addEventListener('load', async () => {
    const version = await ipc.getVersion();
    if (document.getElementById('version')) document.getElementById('version').innerText = version;
});

if(document.getElementById('buttons')) {
    document.getElementById('close').addEventListener('click', () => {
        document.getElementById('buttons').classList.toggle('opened');
    });
}

///ipc.clearCache();

