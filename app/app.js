const { app, BrowserWindow, BrowserView, globalShortcut, dialog} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('node:path');
const logger = require('electron-log');
const { autoUpdater } = require('electron-updater');
autoUpdater.autoDownload = false;

const DeltaUpdater = require('@electron-delta/updater');

let win = null;
let checkUpdate = null;

const createWindow = () => {
    win = new BrowserWindow({
        icon: path.join(__dirname, '/icon.png'),
        backgroundColor: "#9569f3",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            webSecurity: true
        }
    });

    win.setMenu(null);

   win.loadFile(path.join(__dirname, 'index.html')).then(() => {
        win.maximize();
        win.webContents.openDevTools({ mode: 'detach' });
    });
};

const clearCache = async () => {
    let session = win.webContents.session;
    await session.clearCache();
    app.relaunch();
    app.exit();
}

app.whenReady().then(async () => {
    const deltaUpdater = new DeltaUpdater({
        logger,
        autoUpdater
    });

    try {
        await deltaUpdater.boot({
            splashScreen: true,
        });
    } catch (error) {
        logger.error(error);
    }

    createWindow();
    //autoUpdater.checkForUpdatesAndNotify();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    ipc.handle('getVersion', () => app.getVersion());

    ipc.on('clearCache', () => {
        dialog.showMessageBox({
            type: 'question',
            title: 'Vider le cache',
            message: 'Tu es sûr de vouloir vider ton cache et relancer l\'application ?',
            buttons: ['Confirmer', 'Annuler']
        }).then((res) => {
            if (res.response === 0) clearCache();
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

autoUpdater.on('checking-for-update', () => {
    win.send('checkingUpdate', '');
});

autoUpdater.on('update-not-available', () => {
    win.send('noUpdate', '');
    checkUpdate = setInterval(() =>
        autoUpdater.checkForUpdatesAndNotify(), 3e5);
});

/*
autoUpdater.on('checking-for-update', () => {
    if (appStart === false) sendWindow('checking-for-update', '');
});
autoUpdater.on('update-available', () => {
    appStart === false ? sendWindow('update-available', '') : clearInterval(checkForUpdate);
});
autoUpdater.on('update-not-available', () => {
    if(appStart === false) {
        sendWindow('update-not-available', '');
        sendWindow('checkDiscordItem', '');
        appStart = true;
        checkForUpdate = setInterval(async () => await autoUpdater.checkForUpdatesAndNotify(), 3e5);
    }
});
autoUpdater.on('error', (err) => sendWindow('error', 'Error: ' + err));
autoUpdater.on('download-progress', (d) => {
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    mainWindow.setProgressBar(0);
    sendWindow('download-progress', {
        speed: formatBytes(d.bytesPerSecond),
        percent: d.percent,
        transferred: formatBytes(d.transferred),
        total: formatBytes(d.total),
        inBack: appStart
    });
    mainWindow.setProgressBar(d.percent / 100);
});
autoUpdater.on('update-downloaded', () => {
    if (appStart === false) {
        sendWindow('update-downloaded', 'Update downloaded');
        autoUpdater.quitAndInstall();
    } else if (appStart === true) {
        clearInterval(checkForUpdate);
        sendWindow('askForUpdate', '');
        ipcMain.on('responseForUpdate', (e, response) => {
            if (response === true) autoUpdater.quitAndInstall();
        });
    }
});
*/