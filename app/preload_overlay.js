const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendClearCache: () => ipcRenderer.send('clearCache'),
    sendFullscreen: () => ipcRenderer.send('fullscreen'),
    sendZoomIn: () => ipcRenderer.send('zoomIn'),
    sendZoomOut: () => ipcRenderer.send('zoomOut'),
    sendZoomReset: () => ipcRenderer.send('zoomReset'),
    sendReloadView: () => ipcRenderer.send('reloadView'),
    sendDiscord: () => ipcRenderer.send('discord'),
    sendToggle: (opened) => ipcRenderer.send('toggleOverlay', opened),
});

ipcRenderer.on('overlayOpened', (event, opened) => {
    const buttons = document.getElementById('buttons');

    if (buttons) buttons.classList.toggle('opened', opened);
});