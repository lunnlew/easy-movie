
import { app, BrowserWindow, MenuItem, Menu, Tray } from 'electron'
import path from 'path'
const isDevelopment = process.env.NODE_ENV !== "production";
declare const __static: string

class TrayControl {
    tray
    isQuit = false
    constructor(win: BrowserWindow | null) {
        this.tray = new Tray(path.resolve(__static, 'icon.png')) // 设置托盘图标
        const menus = []
        if (isDevelopment) {
            menus.push({
                label: 'Toggle DevTools',
                click: function () {
                    win?.show();
                    win?.webContents.toggleDevTools();
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