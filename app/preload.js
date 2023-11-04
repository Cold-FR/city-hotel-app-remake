const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getVersion: () => ipcRenderer.invoke('getVersion'),
    clearCache: () => ipcRenderer.send('clearCache')
});

ipcRenderer.on('noUpdate', () => {
    document.getElementById('connexion').innerText = 'Aucune mise à jour';
    document.getElementById('updater').style.display = 'none';
});

ipcRenderer.on('checkingUpdate', () => {
    document.getElementById('connexion').innerText = 'Recherche de mise à jour...';
});

ipcRenderer.on('downloadProgress', (data) => {
    document.getElementById('connexion').innerText = 'Téléchargement en cours...';
    document.getElementById('progression').innerHTML =
        `${Math.round(data['percent'])}%<br/><span class="proportion">[<b>${data['transferred']}</b> / <b>${data['total']}</b>]</span><span class="speed">${data['speed']}/s</span>`;
    /*if (data['inBack'] === true && updateCount === 0) {
        iframe.notify(
            'Une mise à jour de l\'application est en cours de téléchargement en arrière-plan...');
        updateCount = 1;
    }*/
});