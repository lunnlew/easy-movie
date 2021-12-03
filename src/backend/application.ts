import tunnel from 'tunnel'
import path from "path";
import fs from "fs";
import { app } from "electron";
import globalEventEmitter, { GlobalEventType } from './eventEmitter/GlobalEventEmitter'
/**
 * 手动设置请求的相关代理
 */
// axios({
//     url: 'http://www.baidu.com',
//     proxy: false,
//     httpsAgent: application.buildHttpsTunnelAgent(),
//     httpAgent: application.buildHttpTunnelAgent()
// })

// 建议使用以下方式，由chrome自动管理代理
// axios({
//     adapter: RequestAdapter as any,
// })

export class App {
    proxy;
    eventEmitter: GlobalEventType;
    constructor() {
        let userProfilePath = path.join(
            app.getPath("userData"),
            "user-profile.json"
        );
        this.proxy = {}
        let userProfile = {} as any
        console.log("load profile", userProfilePath);
        if (fs.existsSync(userProfilePath)) {
            userProfile = JSON.parse(fs.readFileSync(userProfilePath, "utf-8"));
        }
        if (userProfile.proxy !== 'none' && userProfile.proxy !== 'system') {
            let url = new URL(userProfile.proxy);
            this.proxy = {
                host: url.hostname,
                port: url.port,
                protocol: url.protocol,
                proxyAuth: url.username + ':' + url.password
            }
        }
        this.eventEmitter = globalEventEmitter
    }
    buildHttpsTunnelAgent(options?: {
        proxy?: any
    }) {
        let proxy = Object.assign({}, this.proxy, options?.proxy)
        let tunnelOptions = {
            ...options,
            proxy: {
                host: proxy.host,
                port: proxy.port,
                proxyAuth: proxy.proxyAuth,
                ...options?.proxy
            }
        }
        if (proxy.protocol === 'http:') {
            return tunnel.httpsOverHttp(tunnelOptions)
        } else if (proxy.protocol === 'https:') {
            return tunnel.httpsOverHttps(tunnelOptions)
        } else {
            throw new Error('unsupported proxy protocol ' + proxy.protocol)
        }
    }
    buildHttpTunnelAgent(options?: {
        proxy?: any
    }) {
        let proxy = Object.assign({}, this.proxy, options?.proxy)
        let tunnelOptions = {
            ...options,
            proxy: {
                host: proxy.host,
                port: proxy.port,
                proxyAuth: proxy.proxyAuth,
                ...options?.proxy
            }
        }
        if (proxy.protocol === 'http:') {
            return tunnel.httpOverHttp(tunnelOptions)
        } else if (proxy.protocol === 'https:') {
            return tunnel.httpOverHttps(tunnelOptions)
        } else {
            throw new Error('unsupported proxy protocol ' + proxy.protocol)
        }
    }
}
export default new App();