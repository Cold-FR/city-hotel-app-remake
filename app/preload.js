const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    clearCache: () => ipcRenderer.send('clearCache'),
    zoomIn: () => ipcRenderer.send('zoomIn'),
    zoomReset: () => ipcRenderer.send('zoomReset'),
    zoomOut: () => ipcRenderer.send('zoomOut'),
    fullScreen: () => ipcRenderer.send('fullscreen')
});

ipcRenderer.on('reloadPage', () => document.getElementById('iframe').src += '');