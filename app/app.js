const {app, BrowserWindow, WebContentsView, dialog, ipcMain, shell} = require('electron');
const path = require('node:path');

const isFirstRun = require('electron-first-run')();
const Store = require('electron-store');
const themeStore = new Store({name: 'theme'});
if(isFirstRun || themeStore.get('theme', 'none') === 'none') themeStore.set('theme', 'light');
const logger = require('electron-log');
const contextMenu = require('electron-context-menu');

const DeltaUpdater = require('@electron-delta/updater');
const deltaUpdater = new DeltaUpdater({
    logger
});

let win = null;
let view = null;

app.commandLine.appendSwitch('enable-hardware-overlays');

const createWindow = () => {
    win = new BrowserWindow({
        icon: path.join(__dirname, '/icon.png'),
        backgroundColor: "#9569f3",
        webPreferences: {
            nodeIntegration: false,
            webSecurity: true
        }
    });
    win.setMenu(null);

    win.loadFile(path.join(__dirname, 'index.html')).then(() => {
        win.maximize();

        win.webContents.setWindowOpenHandler(({url}) => {
            handleURL(url);
        });
    });
};

const createView = () => {
    view = new WebContentsView({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.contentView.addChildView(view);
    view.webContents.loadURL('https://www.habbocity.me').then(() => view.webContents.focus());
    view.webContents.on('did-finish-load', () => setContextMenu(view));

    win.on('maximize', () => resizeView());
    win.on('unmaximize', () => resizeView());
    win.on('will-resize', (e, newBounds) => {
        view.setBounds({
            x: 0,
            y: 0,
            width: newBounds.width - 16,
            height: newBounds.height - 39,
        });
    });
};

const reloadView = () => {
    view.webContents.reload();
    setContextMenu(view);
};

const resizeView = () => {
    const [width, height] = win.getSize();
    view.setBounds({
        x: 0,
        y: 0,
        width: width - 16,
        height: height - 39,
    });
};

const handleZoom = (type) => {
    let factor = view.webContents.getZoomFactor();
    switch (type) {
        case 'in':
            if (factor < 3) view.webContents.setZoomFactor(factor + 0.01);
            break;
        case 'out':
            if (factor > 0.3) view.webContents.setZoomFactor(factor - 0.01);
            break;
        case 'reset':
            view.webContents.setZoomFactor(1)
            break;
    }
};

const toggleDevTools = () => {
    if (view.webContents.isDevToolsOpened()) view.webContents.closeDevTools();
    else view.webContents.openDevTools();
};

const setContextMenu = (target = undefined) => {
    contextMenu({
        window: target,
        prepend: (defaultActions, parameters) => [
            {
                label: 'Version - ' + app.getVersion(),
                visible: true,
            },
            {
                label: 'Vider le cache',
                visible: true,
                icon: path.join(__dirname, '/assets/images/buttons/cache.png'),
                click: () => clearCache()
            },
            {
                label: 'Recharger la page (F5)',
                visible: true,
                icon: path.join(__dirname, `/assets/images/buttons/reload.png`),
                click: () => reloadView()
            },
            {
                label: 'Plein écran (F11)',
                visible: true,
                icon: path.join(__dirname, `/assets/images/buttons/screen.png`),
                click: () => toggleFullScreen()
            },
            {
                label: 'Rejoindre CityCom',
                visible: true,
                icon: path.join(__dirname, `/assets/images/buttons/discord.png`),
                click: () => shell.openExternal('https://discord.gg/EDtGr4Cr7V')
            },
            {
                label: 'Zoom',
                visible: true,
                submenu: [
                    {
                        label: 'Zoom avant (CTRL + Molette haut)',
                        visible: true,
                        icon: path.join(__dirname, '/assets/images/buttons/in.png'),
                        click: () => handleZoom('in')
                    },
                    {
                        label: 'Zoom par défaut (CTRL + =)',
                        visible: true,
                        icon: path.join(__dirname, '/assets/images/buttons/reset.png'),
                        click: () => handleZoom('reset')
                    },
                    {
                        label: 'Zoom arrière (CTRL + Molette bas)',
                        visible: true,
                        icon: path.join(__dirname, '/assets/images/buttons/out.png'),
                        click: () => handleZoom('out')
                    }
                ]
            },
            {
                label: 'Console de développement',
                visible: true,
                click: () => toggleDevTools()
            },
            {
                type: 'separator',
                visible: parameters.mediaType === 'image',
            },
            {
                label: 'Ouvrir l\'image dans un nouvel onglet (Navigateur par défaut)',
                visible: parameters.mediaType === 'image',
                click: () => shell.openExternal(`${parameters.srcURL}`)
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
};

const clearCache = async () => {
    dialog.showMessageBox({
        type: 'question',
        title: 'Vider le cache',
        message: 'Tu es sûr de vouloir vider ton cache et relancer l\'application ?',
        buttons: ['Confirmer', 'Annuler']
    }).then(async (res) => {
        if (res.response === 0) {
            let session = win.webContents.session;
            await session.clearCache();
            app.relaunch();
            app.exit();
        }
    });
};

const toggleFullScreen = () => {
    if(win.isFullScreen()) {
        win.setFullScreen(false);
        const [width, height] = win.getSize();
        view.setBounds({
            x:0,
            y:0,
            width: width - 16,
            height: height - 39,
        });
    } else {
        win.setFullScreen(true);
        const [width, height] = win.getSize();
        view.setBounds({
            x:0,
            y:0,
            width: width,
            height: height
        });
    }
};

const handleURL = (url) => {
    const urlFormat = new URL(url);

    if (!urlFormat.hostname.includes('habbocity.me') && !urlFormat.hostname.includes('funados-radio.fr') && urlFormat.href !== 'about:blank') {
        shell.openExternal(urlFormat.href);
    } else if (urlFormat.pathname === '/discord') {
        shell.openExternal('https://discord.gg/EDtGr4Cr7V');
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
};

const checkTheme = () => {
    view.webContents.executeJavaScript(`document.querySelector('html').classList.contains('black')`).then((res) => {
        if(res) themeStore.set('theme', 'dark');
        else themeStore.set('theme', 'light');
    });
};

app.whenReady().then(async () => {
    setContextMenu();

    try {
        await deltaUpdater.boot({
            splashScreen: true,
            darkMode: themeStore.get('theme', 'none') === 'dark',
        });
    } catch (error) {
        logger.error(error);
    }

    createWindow();

    createView();

    checkTheme();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    win.on('close', () => {
        checkTheme();
    });

    /// IPC
    ipcMain.on('fullscreen', () => toggleFullScreen());
    ipcMain.on('zoomIn', () => handleZoom('in'));
    ipcMain.on('zoomReset', () => handleZoom('reset'));
    ipcMain.on('zoomOut', () => handleZoom('out'));
    ipcMain.on('reloadView', () => reloadView());
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
