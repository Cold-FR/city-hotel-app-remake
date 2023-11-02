const { app, BrowserWindow, BrowserView} = require('electron');
const path = require('node:path');
const ipc = require('electron').ipcMain;
const { autoUpdater } = require('electron-updater');

const createWindow = () => {
    const win = new BrowserWindow({
        icon: path.join(__dirname, '/icon.png'),
        backgroundColor: "#9569f3",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.setMenu(null);
    win.loadFile(path.join(__dirname, 'index.html')).then(() => {
        win.maximize();
        win.webContents.openDevTools();

        const [width, height] = win.getSize();
        const view = new BrowserView();
        view.setBounds({
            x: 0,
            y: 0,
            width: width,
            height: height,
        });
        win.setBrowserView(view);
        view.setAutoResize({
            width: true,
            height: true
        });
        view.webContents.loadURL('https://www.habbocity.me');
    });
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    ipc.handle('getVersion', () => app.getVersion());
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

