const { app, BrowserWindow, BrowserView, globalShortcut, dialog} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('node:path');
const logger = require('electron-log');

const DeltaUpdater = require('@electron-delta/updater');
const deltaUpdater = new DeltaUpdater({
    logger
});

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
        win.webContents.openDevTools();
    });
};

const clearCache = async () => {
    let session = win.webContents.session;
    await session.clearCache();
    app.relaunch();
    app.exit();
}

app.whenReady().then(async () => {
    try {
        await deltaUpdater.boot({
            splashScreen: false,
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

deltaUpdater.on('checking-for-update', () => {
    win.send('checkingUpdate', '');
});

deltaUpdater.on('update-not-available', () => {
    win.send('noUpdate', '');
    checkUpdate = setInterval(() =>
        deltaUpdater.checkForUpdates(), 3e5);
});

deltaUpdater.on('error', (err) =>logger.error(err));

deltaUpdater.on('update-available', () => {
    win.send('updateAvailable', '');
    //clearInterval(checkForUpdate);
});

deltaUpdater.on('download-progress', (d) => {
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    win.setProgressBar(0);
    win.send('downloadProgress', {
        speed: formatBytes(d.bytesPerSecond),
        percent: d.percent,
        transferred: formatBytes(d.transferred),
        total: formatBytes(d.total)
        //inBack: appStart
    });
    win.setProgressBar(d.percent / 100);
});

deltaUpdater.on('update-downloaded', () => {
    deltaUpdater.ensureSafeQuitAndInstall();
/*if (appStart === true) {
        clearInterval(checkForUpdate);
        sendWindow('askForUpdate', '');
        ipcMain.on('responseForUpdate', (e, response) => {
            if (response === true) autoUpdater.quitAndInstall();
        });
    }*/
});