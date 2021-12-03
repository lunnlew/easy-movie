
import { app, BrowserWindow, MenuItem, Menu, Tray } from 'electron'
import path from 'path'
import windowControl from './window';
import { __app_path } from "../config";
const isDevelopment = process.env.NODE_ENV == "development";

class TrayControl {
    tray
    isQuit = false
    constructor() {
        let win = windowControl.getMainWindow() as BrowserWindow
        this.tray = new Tray(path.resolve(__app_path, 'dist/icon.png')) // 设置托盘图标
        const menus = [] as any[]
        if (isDevelopment) {
            menus.push({
                label: '开发工具',
                click: function () {
                    if (!win?.isVisible()) {
                        win?.show();
                    }
                    win?.webContents.toggleDevTools();
                }
            })
            menus.push({
                label: '强制重载',
                click: function () {
                    if (!win?.isVisible()) {
                        win?.show();
                    }
                    win?.webContents.reloadIgnoringCache();
                }
            })
        }
        menus.push(new MenuItem({
            label: '退出程序',
            click: () => {
                this.isQuit = true
                app.exit()
            }
        }))
        const contextMenu = Menu.buildFromTemplate(menus)
        this.tray.setToolTip('影视管理');
        this.tray.setContextMenu(contextMenu) // 设置右键菜单
        this.tray.on('click', () => { // 托盘点击事件    
            if (win?.isVisible()) {
                win?.focus()
            } else {
                win?.show()
            }
        })
    }
    destroy() {
        this.tray.destroy()
        this.tray = null as any
    }
}

export default TrayControl