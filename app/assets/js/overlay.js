const closeBtn = document.getElementById('close');
if(closeBtn) {
    closeBtn.addEventListener('click', () => {
        document.getElementById('buttons').classList.toggle('opened');
        window.electronAPI.sendClose(document.getElementById('buttons').classList.contains('opened'));
    });
}

const cacheBtn = document.getElementById('cache');
if(cacheBtn) {
    cacheBtn.addEventListener('click', () => {
        window.electronAPI.sendClearCache();
    });
}

const fullscreenBtn = document.getElementById('fullscreen');
if(fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
        window.electronAPI.sendFullscreen();
    });
}

const zoomInBtn = document.getElementById('zoomIn');
if(zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
        window.electronAPI.sendZoomIn();
    });
}

const zoomOutBtn = document.getElementById('zoomOut');
if(zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
        window.electronAPI.sendZoomOut();
    });
}

const zoomResetBtn = document.getElementById('zoomReset');
if(zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
        window.electronAPI.sendZoomReset();
    });
}

const reloadBtn = document.getElementById('reload');
if(reloadBtn) {
    reloadBtn.addEventListener('click', () => {
        window.electronAPI.sendReloadView();
    });
}

const discordBtn = document.getElementById('discord');
if(discordBtn) {
    discordBtn.addEventListener('click', () => {
        window.electronAPI.sendDiscord();
    });
}