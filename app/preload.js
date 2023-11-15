const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getVersion: () => ipcRenderer.invoke('getVersion'),
    clearCache: () => ipcRenderer.send('clearCache'),
    zoomIn: () => ipcRenderer.send('zoomIn'),
    zoomReset: () => ipcRenderer.send('zoomReset'),
    zoomOut: () => ipcRenderer.send('zoomOut'),
    fullScreen: () => ipcRenderer.send('fullscreen'),
    showDevConsole: () => ipcRenderer.send('openDev')
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

ipcRenderer.on('getLinkAdress', () => ipcRenderer.send('sendLinkAdress', `${document.getElementById('iframe').contentWindow.location.href}`));

ipcRenderer.on('reloadPage', () => document.getElementById('iframe').contentWindow.location.reload());