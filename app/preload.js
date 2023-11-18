const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    /*clearCache: () => ipcRenderer.send('clearCache'),
    zoomIn: () => ipcRenderer.send('zoomIn'),
    zoomReset: () => ipcRenderer.send('zoomReset'),
    zoomOut: () => ipcRenderer.send('zoomOut'),
    reloadView: () => ipcRenderer.send('reloadView')*/
});

window.addEventListener('keydown', (e) => {
    if(e.key === 'F11') ipcRenderer.send('fullscreen');
});