import { Menu, Tray, app } from 'electron';
import { getResourcesFolderPath } from './helpers';
import path from 'path';
import * as windowmanager from './window';
import * as ws from './ws';
import { APP_NAME } from '../constants';

export let instance: Tray;

export function create() {
    if (!instance) {
        instance = new Tray(path.join(getResourcesFolderPath(), getAppIconPath()));
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Сменить пользователя',
                click: () => {
                    ws.destroy();
                    windowmanager.create();
                }
            },
            {
                label: 'Выход',
                click() {
                    app.quit();
                },
            },
        ]);
        instance.setToolTip(APP_NAME);
        instance.setContextMenu(contextMenu);

        instance.on('click', () => {
            if (!ws.isConnected && !ws.isConnecting) {
                windowmanager.create();
            }
        });
    }
}

function getAppIconPath() {
    switch (process.platform) {
        case 'win32':
            return './static/icons/app_icon.ico';
        case 'darwin':
            return './static/icons/app_icon.icns';
        case 'linux':
            return './static/icons/app_icon.png';
    }
}
