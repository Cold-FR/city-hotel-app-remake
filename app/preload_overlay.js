const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendClearCache: () => ipcRenderer.send('clearCache'),
    sendFullscreen: () => ipcRenderer.send('fullscreen'),
    sendZoomIn: () => ipcRenderer.send('zoomIn'),
    sendZoomOut: () => ipcRenderer.send('zoomOut'),
    sendZoomReset: () => ipcRenderer.send('zoomReset'),
    sendReloadView: () => ipcRenderer.send('reloadView'),
    sendDiscord: () => ipcRenderer.send('discord'),
    sendClose: (opened) => ipcRenderer.send('closeOverlay', opened),
});