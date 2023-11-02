const ipc = window.electronAPI;

window.addEventListener('load', async () => {
    const version = await ipc.getVersion();
    if (document.getElementById('version')) document.getElementById('version').innerText = version;
});

