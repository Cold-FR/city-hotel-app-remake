const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    clearCache: () => ipcRenderer.send('clearCache')
});

const buttonsStyle = document.createElement('style');
buttonsStyle.innerHTML = '.buttons {\n' +
    '    z-index: 9999999;\n' +
    '    margin-top: 20px;\n' +
    '    position: fixed;\n' +
    '    background: rgba(58, 56, 50, 0.9);\n' +
    '    right: 0;\n' +
    '    bottom: 100px;\n' +
    '    width: 50px;\n' +
    '    max-width: 50px;\n' +
    '    transition: .1s;\n' +
    '}\n' +
    '\n' +
    '#close {\n' +
    '    position: absolute;\n' +
    '    height: 100%;\n' +
    '    border-radius: 8px 0 0 8px;\n' +
    '    width: 14px;\n' +
    '    background: #3a3832;\n' +
    '    display: flex;\n' +
    '    justify-content: center;\n' +
    '    align-items: center;\n' +
    '    left: -14px;\n' +
    '    cursor: pointer;\n' +
    '}\n' +
    '\n' +
    '#close #close-button {\n' +
    '    position: absolute;\n' +
    '    height: 10px;\n' +
    '    width: 7px;\n' +
    '    background: url(\'../images/close.png\') -18px 0;\n' +
    '}\n' +
    '\n' +
    '.buttons .button {\n' +
    '    position: relative;\n' +
    '    z-index: 9999;\n' +
    '    height: 36px;\n' +
    '    left: 8px;\n' +
    '    margin-top: 6px;\n' +
    '    display: flex;\n' +
    '    justify-content: center;\n' +
    '    align-items: center;\n' +
    '    margin-right: 4px;\n' +
    '    width: 36px;\n' +
    '    cursor: pointer;\n' +
    '    border-radius: 100%;\n' +
    '}\n' +
    '\n' +
    '.buttons .button:last-child {\n' +
    '    margin-bottom: 6px;\n' +
    '}\n' +
    '\n' +
    '.buttons .button:hover .tooltip {\n' +
    '    display: block;\n' +
    '}\n' +
    '\n' +
    '.buttons .button .tooltip {\n' +
    '    position: absolute;\n' +
    '    background: white;\n' +
    '    display: none;\n' +
    '    padding: 8px 10px;\n' +
    '    text-align: center;\n' +
    '    right: 60px;\n' +
    '    width: 100px;\n' +
    '    box-shadow: 0 0 6px #0000006e;\n' +
    '    border-radius: 10px;\n' +
    '}\n' +
    '\n' +
    '.buttons .button .tooltip .arrow {\n' +
    '    width: 0;\n' +
    '    right: -6px;\n' +
    '    top: 12px;\n' +
    '    height: 0;\n' +
    '    position: absolute;\n' +
    '    border-style: solid;\n' +
    '    border-width: 5px 0 5px 6px;\n' +
    '    border-color: transparent transparent transparent #ffffff;\n' +
    '}\n' +
    '\n' +
    '.buttons .button .icon {\n' +
    '    height: 25px;\n' +
    '    width: 25px;\n' +
    '}\n' +
    '\n' +
    '.buttons .button .out {\n' +
    '    background: url(\'../images/out.png\');\n' +
    '}\n' +
    '\n' +
    '.buttons .button .screen {\n' +
    '    background: url(\'../images/screen.png\');\n' +
    '}\n' +
    '\n' +
    '.buttons .button .reload {\n' +
    '    background: url(\'../images/reload.png\');\n' +
    '}\n' +
    '\n' +
    '.buttons .button .cache {\n' +
    '    background: url(\'../images/cache.png\');\n' +
    '}\n' +
    '\n' +
    '.buttons .button .in {\n' +
    '    background: url(\'../images/in.png\');\n' +
    '}\n' +
    '\n' +
    '.buttons .button .reset {\n' +
    '    background: url(\'../images/reset.png\');\n' +
    '}\n' +
    '\n' +
    '.buttons .button .all {\n' +
    '    background: url(\'../images/all.png\');\n' +
    '}\n' +
    '\n' +
    '.buttons .button .mentions {\n' +
    '    background: url(\'../images/mentions.png\');\n' +
    '}\n' +
    '\n' +
    '.buttons .button .alerts {\n' +
    '    background: url(\'../images/alerts.png\');\n' +
    '}\n' +
    '\n' +
    '.buttons .button .nothing {\n' +
    '    background: url(\'../images/nothing.png\');\n' +
    '}\n' +
    '\n' +
    '.buttons .button:hover {\n' +
    '    background: #00000073;\n' +
    '}';
const buttons = document.createElement('div');
buttons.classList.add('buttons');
buttons.innerHTML = '<div id="close">\n' +
    '        <div id="close-button" style="transform: scaleX(-1);"></div>\n' +
    '    </div>\n' +
    '    <!--\n' +
    '<div id="screen" class="button">\n' +
    '    <div class="icon screen"></div>\n' +
    '    <div class="tooltip">\n' +
    '        <div class="arrow"></div>\n' +
    '        Plein écran\n' +
    '    </div>\n' +
    '</div>\n' +
    '-->\n' +
    '    <div id="cache" class="button">\n' +
    '        <div class="icon cache"></div>\n' +
    '        <div class="tooltip">\n' +
    '            <div class="arrow"></div>\n' +
    '            Vider le cache\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div id="zoomOut" class="button">\n' +
    '        <div class="icon out"></div>\n' +
    '        <div class="tooltip">\n' +
    '            <div class="arrow"></div>\n' +
    '            Zoom -1%\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div id="zoomReset" class="button">\n' +
    '        <div class="icon reset"></div>\n' +
    '        <div class="tooltip">\n' +
    '            <div class="arrow"></div>\n' +
    '            Réinitialiser le Zoom\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div id="zoomIn" class="button">\n' +
    '        <div class="icon in"></div>\n' +
    '        <div class="tooltip">\n' +
    '            <div class="arrow"></div>\n' +
    '            Zoom +1%\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div id="reload" class="button">\n' +
    '        <div class="icon reload"></div>\n' +
    '        <div class="tooltip">\n' +
    '            Recharger la page\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div id="notif" class="button">\n' +
    '        <div id="notif-btn" class="icon all"></div>\n' +
    '        <div id="notif-txt" class="tooltip">\n' +
    '            Toutes les notifications\n' +
    '        </div>\n' +
    '    </div>';

window.addEventListener('load', () => {
    document.head.appendChild(buttonsStyle);
    document.querySelector('body').appendChild(buttons);
});