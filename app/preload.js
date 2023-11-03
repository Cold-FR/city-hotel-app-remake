const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getVersion: () => ipcRenderer.invoke('getVersion'),
    clearCache: () => ipcRenderer.send('clearCache')
});

ipcRenderer.on('noUpdate', () => {
    document.getElementById('connexion').innerText = 'Aucune mise à jour';
});

ipcRenderer.on('checkingUpdate', () => {
    document.getElementById('connexion').innerText = 'Recherche de mise à jour...';
});