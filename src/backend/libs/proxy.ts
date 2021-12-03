import { app } from "electron"
import windowControl from "./window"

class ProxyControl {
    constructor() { }
    /**
     * 设置渲染会话代理
     * @param proxy 
     */
    setAllSessionProxy(proxy: string) {
        const wins = windowControl.getAllBrowserWindow()
        for (let win of wins) {
            this.setSessionProxy(win.webContents.session, proxy)
        }
    }
    /**
     * 设置渲染会话代理
     * @param session 
     * @param mode 
     * @param proxy 
     */
    setSessionProxy(session, proxy: string) {
        proxy = proxy || ''
        console.log("set session proxy", proxy);
        switch (proxy) {
            case "":
            case "none": // 直连
                console.log("use direct")
                session.setProxy({ mode: 'direct' })
                break;
            case "system": // 系统设置-默认
                console.log("use system proxy")
                session.setProxy({ mode: 'system' })
                break
            default: // 自定义
                console.log("use custom proxy")
                session.setProxy({ proxyRules: proxy })
                break;
        }
    }
    /**
     * 设置系统代理
     */
    setAppProxy(proxy) {
        proxy = proxy || ''
        console.log("set app proxy", proxy);
        switch (proxy) {
            case "":
            case "none": // 直连
                console.log("use direct")
                app.commandLine.appendSwitch("no-proxy-server", "");
                break;
            case "system":// 系统设置-默认
                console.log("use system proxy")
                break
            default: // 自定义
                console.log("use custom proxy")
                app.commandLine.appendSwitch(
                    "proxy-server",
                    proxy
                );
                // app.commandLine.appendSwitch('proxy-bypass-list', '<local>;')
                break;
        }
    }
}
export default new ProxyControl