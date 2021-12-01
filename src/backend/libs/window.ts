import { BrowserWindow } from "electron"
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import path from 'path'
declare const __static: string
/**
 * 窗口参数
 */
const windowParams = {
    /**
     * 窗口id
     */
    id: '',
    /**
     * 窗口名称
     */
    title: "Window",
    /**
     * 窗口宽度
     */
    width: 800,
    /**
     * 窗口高度
     */
    height: 600,
    /**
     * 是否支持调整大小
     */
    resizable: true,
    /**
     * 是否支持最大化
     */
    maximizable: true,
    /**
     * 是否支持最小化
     */
    minimizable: true,
    /**
     * 窗口图标
     */
    icon: path.join(__static, 'icon.png'),
    /**
     * 是否模态窗口
     */
    modal: false,
    /**
     * 窗口是否显示
     */
    show: false,
    /**
     * 是否有边框
     */
    frame: false,
    /**
     * 窗口背景色
     */
    backgroundColor: "#ffffff",
    /**
     * 隐藏菜单栏
     */
    autoHideMenuBar: true,
    /**
     * 隐藏标题栏
     */
    titleBarStyle: "hidden",
    /**
     * 任务栏显示
     */
    skipTaskbar: false,
    /**
     * 窗口能力
     */
    webPreferences: {
        contextIsolation: false,
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        devTools: false,
        webSecurity: false,
        enableRemoteModule: false,
    }
}

class WindowControl {
    windowList: Array<{
        id: number,
        isMain: boolean,
        parentId: number,
        route: string,
    }> = []
    constructor() { }
    dispatch(event: any, params: any, handler: any = null) {
        switch (params.command) {
            case 'create':
                this.createBrowserWindow(event, params, handler)
                break;
            case 'close':
                this.closeBrowserWindow(event, params, handler)
                break;
            case 'closeAll':
                this.closeAllBrowserWindow(event, params, handler)
                break;
            case 'show':
                this.showBrowserWindow(event, params, handler)
                break;
            case 'hide':
                this.hideBrowserWindow(event, params, handler)
                break;
            case 'mini':
                this.miniBrowserWindow(event, params, handler)
                break;
            case 'max':
                this.maxBrowserWindow(event, params, handler)
                break;
            case 'toggleSize':
                this.toggleSizeBrowserWindow(event, params, handler)
                break;
            case 'restore':
                this.restoreBrowserWindow(event, params, handler)
                break;
            case 'reload':
                this.reloadBrowserWindow(event, params, handler)
                break;
            case 'setTitle':
                this.setTitleBrowserWindow(event, params, handler)
                break;
        }
    }
    /**
     * 预创建的窗口
     */
    preCreateWindow() {
        let mainWin = this.windowList.find(w => w.isMain)
        this.createBrowserWindow(null, {
            options: {
                parentId: mainWin?.id,
                multi: false,
                backgroundColor: "#545454",
                skipTaskbar: false,
                width: 800,
                height: 600,
                show: false,
                readyShow: false,
                title: '偏好设置',
                route: 'setting.html'
            }
        })
    }
    /**
     * 创建窗口
     * @param event 
     * @param params 
     * @param handler 
     */
    createBrowserWindow(event: any, params: any, handler: any = null): BrowserWindow {

        let options = Object.assign({}, windowParams, params.options)

        // 不允许重复创建时
        if (!options.multi) {
            for (let w of this.windowList) {
                if (w.route === (options.route || '')) {
                    let win = BrowserWindow.fromId(w.id) as BrowserWindow
                    if (win.isVisible()) {
                        win.focus()
                    } else {
                        win.show()
                    }
                    return win
                }
            }
        }

        let win = new BrowserWindow(options)

        // 设置父窗口
        if (!options.isMain) {
            let fromWin = this.getFromWindow(event, options.parentId)
            win.setParentWindow(fromWin)
        }

        // 存放窗口ID
        this.windowList.push({
            id: win.id,
            isMain: options.isMain,
            parentId: options.parentId,
            route: (options.route || "")
        })

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            console.log(process.env.WEBPACK_DEV_SERVER_URL + (options.route || "index.html"))
            // Load the url of the dev server if in development mode
            win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + (options.route || "index.html"))
        } else {
            createProtocol("app");
            // Load the index.html when not in development
            console.log("app://./" + (options.route || "index.html"))
            win.loadURL("app://./" + (options.route || "index.html"))
        }

        win.on('close', () => {
            console.log('close', win.id)
            let index = this.windowList.findIndex(w => w.id === win.id)
            if (index > -1 && !this.windowList[index].isMain) {
                this.windowList.splice(index, 1)
            }
        })

        win.on('closed', () => {
            console.log('closed')
            win = null as any
        })

        win.once('ready-to-show', () => {
            if (options.readyShow || options.isMain) {
                win.show()
            }
            if (options.isMain) {
                this.preCreateWindow()
                options.enableDevTools && win.webContents.openDevTools()
            }
        })

        handler && handler(win.id)

        return win
    }
    getFromWindow(event: any, wid: number): BrowserWindow | null {
        return wid
            ? BrowserWindow.fromId(wid) as BrowserWindow
            : (event ? BrowserWindow.fromWebContents(event.sender) as BrowserWindow : null)
    }
    /**
     * 关闭窗口
     * @param event 
     * @param params 
     * @param handler 
     */
    async closeBrowserWindow(event: any, params: any, handler: any = null) {
        this.getFromWindow(event, params.options.wid)?.close()
        handler && handler()
    }
    /**
     * 关闭所有窗口
     * @param event 
     * @param params 
     * @param handler 
     */
    async closeAllBrowserWindow(event: any, params: any, handler: any = null) {
        for (let w of this.windowList) {
            let win = BrowserWindow.fromId(w.id) as BrowserWindow
            win.close()
        }
        handler && handler()
    }
    /**
     * 显示窗口
     * @param event 
     * @param params 
     * @param handler 
     */
    async showBrowserWindow(event: any, params: any, handler: any = null) {
        this.getFromWindow(event, params.options.wid)?.show()
        handler && handler()
    }
    /**
     * 隐藏窗口
     * @param event 
     * @param params 
     * @param handler 
     */
    async hideBrowserWindow(event: any, params: any, handler: any = null) {
        this.getFromWindow(event, params.options.wid)?.hide()
        handler && handler()
    }
    /**
     * 最小化窗口
     */
    async miniBrowserWindow(event: any, params: any, handler: any = null) {
        this.getFromWindow(event, params.options.wid)?.minimize()
        handler && handler()
    }
    /**
     * 最大化窗口
     */
    async maxBrowserWindow(event: any, params: any, handler: any = null) {
        this.getFromWindow(event, params.options.wid)?.maximize()
        handler && handler()
    }
    /**
     * 切换窗口大小
     */
    async toggleSizeBrowserWindow(event: any, params: any, handler: any = null) {
        let win = this.getFromWindow(event, params.options.wid)
        win?.isMaximized() ? win?.unmaximize() : win?.maximize()
        handler && handler()
    }
    /**
     * 恢复窗口
     */
    async restoreBrowserWindow(event: any, params: any, handler: any = null) {
        this.getFromWindow(event, params.options.wid)?.restore()
        handler && handler()
    }
    /**
     * 重新加载窗口
     */
    async reloadBrowserWindow(event: any, params: any, handler: any = null) {
        this.getFromWindow(event, params.options.wid)?.reload()
        handler && handler()
    }
    /**
     * 设置窗口标题
     */
    async setTitleBrowserWindow(event: any, params: any, handler: any = null) {
        this.getFromWindow(event, params.options.wid)?.setTitle(params.options.title)
        handler && handler()
    }
}

const windowControl = new WindowControl()

export default windowControl