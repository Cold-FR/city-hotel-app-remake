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
    if((e.metaKey || e.ctrlKey) && e.key === '+') ipcRenderer.send('zoomIn');
    if((e.metaKey || e.ctrlKey) && e.key === '-') ipcRenderer.send('zoomOut');
    if((e.metaKey || e.ctrlKey) && e.key === '=') ipcRenderer.send('zoomReset');
    if(e.key === 'F5' || ((e.metaKey || e.ctrlKey) && (e.key === 'R' || e.key === 'r'))) ipcRenderer.send('reloadView');
});

window.addEventListener('wheel', (e) => {
   if(e.ctrlKey || e.metaKey) {
       if (e.deltaY < 0) {
           ipcRenderer.send('zoomIn');
       } else {
           ipcRenderer.send('zoomOut');
       }
   }
});