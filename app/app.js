const {app, BrowserWindow, dialog, clipboard} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('node:path');

const logger = require('electron-log');
const contextMenu = require('electron-context-menu');

const DeltaUpdater = require('@electron-delta/updater');
const deltaUpdater = new DeltaUpdater({
    logger
});
const debug = require('electron-debug');
debug({isEnabled: true, showDevTools: false});

let win = null;
let appStarted = false;

app.commandLine.appendSwitch('enable-hardware-overlays');

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

        win.webContents.setWindowOpenHandler(({url}) => {
            const urlFormat = new URL(url);
            console.log(urlFormat.href);

            if (!urlFormat.hostname.includes('habbocity.me') && !urlFormat.hostname.includes('funados-radio.fr') && urlFormat.href !== 'about:blank') {
                require('electron').shell.openExternal(urlFormat.href);
            } else if (urlFormat.pathname === '/discord') {
                require('electron').shell.openExternal('https://discord.gg/EDtGr4Cr7V');
            } else {
                return {
                    action: 'allow',
                    overrideBrowserWindowOptions: {
                        autoHideMenuBar: true,
                        backgroundColor: "#9569f3",
                        parent: win,
                        icon: path.join(__dirname, '/icon.png')
                    }
                }
            }

            return {action: 'deny'};
        })
    });
};

const clearCache = async () => {
    let session = win.webContents.session;
    await session.clearCache();
    app.relaunch();
    app.exit();
}

const toggleFullScreen = () => win.isFullScreen() ? win.setFullScreen(false) : win.setFullScreen(true);

app.whenReady().then(async () => {
    try {
        await deltaUpdater.boot({
            splashScreen: true
        });
    } catch (error) {
        logger.error(error);
    }

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    /// IPC
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

    ipc.on('fullscreen', () => toggleFullScreen());

    ipc.on('zoomIn', () => {
        let factor = win.webContents.getZoomFactor();
        if (factor < 3) win.webContents.setZoomFactor(factor + 0.01);
    });
    ipc.on('zoomReset', () => win.webContents.setZoomFactor(1));
    ipc.on('zoomOut', () => {
        let factor = win.webContents.getZoomFactor();
        if (factor > 0.3) win.webContents.setZoomFactor(factor - 0.01);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

contextMenu({
    prepend: (defaultActions, parameters, browserWindow) => [
        {
            label: 'Version - ' + app.getVersion(),
            visible: true,
        },
        {
            label: 'Recharger la page',
            visible: true,
            icon: path.join(__dirname, `/assets/images/buttons/reload.png`),
            click: () => win.send('reloadPage', '')
        },
        {
            label: 'Rejoindre CityCom',
            visible: true,
            icon: path.join(__dirname, `/assets/images/buttons/discord.png`),
            click: () => require('electron').shell.openExternal('https://discord.gg/EDtGr4Cr7V')
        },
        {
            label: 'Plein écran',
            visible: true,
            icon: path.join(__dirname, `/assets/images/buttons/screen.png`),
            click: () => toggleFullScreen()
        },
        {
            type: 'separator',
            visible: parameters.mediaType === 'image',
        },
        {
            label: 'Ouvrir l\'image dans un nouvel onglet (Navigateur par défaut)',
            visible: parameters.mediaType === 'image',
            click: () => require('electron').shell.openExternal(`${parameters.srcURL}`)
        }
    ],
    labels: {
        copy: 'Copier',
        paste: 'Coller',
        cut: 'Couper',
        searchWithGoogle: 'Rechercher "{selection}" avec Google',
        learnSpelling: 'Enregistrer "{selection}" dans le dictionnaire',
        saveImageAs: 'Enregistrer l\'image sous',
        copyImage: 'Copier l\'image',
        copyImageAddress: 'Copier l\'adresse de l\'image',
        copyLink: 'Copier l\'adresse du lien',
        selectAll: 'Sélectionner tout'
    },
    showCopyImageAddress: true,
    showSaveImageAs: true
});