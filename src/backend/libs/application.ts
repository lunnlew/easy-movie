import path from "path";
import fs from "fs";
import tunnel from 'tunnel'
import { app } from "electron";
import globalEventEmitter, { GlobalEventType } from '../eventEmitter/GlobalEventEmitter'

/**
 * 支持的用户配置
 */
type UserProfile = {
    proxy: string;
};

export type App = {
    userProfile: UserProfile;
    eventEmitter: GlobalEventType
}

class Application {
    userProfile: UserProfile;
    eventEmitter: GlobalEventType
    isDevelopment = process.env.NODE_ENV == "development"
    constructor() {
        this.eventEmitter = globalEventEmitter
    }
    /**
     * 加载用户配置
     */
    loadUserProfile() {
        let userProfilePath = process.env.PROFILE_PATH || path.join(
            app.getPath("userData"),
            "user-profile.json"
        );
        console.log("load profile", userProfilePath);
        if (fs.existsSync(userProfilePath)) {
            this.userProfile = JSON.parse(fs.readFileSync(userProfilePath, "utf-8"));
        } else {
            this.userProfile = {} as UserProfile;
            fs.writeFileSync(userProfilePath, JSON.stringify(this.userProfile));
        }
    }
    /**
     * 保存用户配置
     */
    saveUserProfile() {
        let userProfilePath = process.env.PROFILE_PATH || path.join(
            app.getPath("userData"),
            "user-profile.json"
        );
        console.log("save profile", userProfilePath);
        fs.writeFileSync(userProfilePath, JSON.stringify(this.userProfile || {}));
    }
    /**
     * 获取代理设置
     */
    getProxy() {
        let proxy = process.env.PROXY || this.userProfile.proxy || ''
        if (proxy === 'none' || proxy === 'system' || proxy.startsWith('http') || proxy.startsWith('socks')) {
            return proxy
        }
        return ''
    }
    /**
     * 构建代理参数
     * @param options 
     * @returns 
     */
    buildProxyOption(options) {
        let proxy = this.getProxy()
        if (proxy && (proxy.startsWith('http') || proxy.startsWith('socks'))) {
            let url = new URL(proxy)
            proxy = {
                host: url.hostname,
                port: url.port,
                protocol: url.protocol,
                proxyAuth: url.username + ':' + url.password
            } as any
        }
        return Object.assign({}, proxy, options?.proxy)
    }
    /**
     * 构建https代理
     * @param options 
     * @returns 
     */
    buildHttpsTunnelAgent(options?: {
        proxy?: any
    }) {
        let proxy = this.buildProxyOption(options)
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
    /**
     * 构建http代理
     * @param options 
     * @returns 
     */
    buildHttpTunnelAgent(options?: {
        proxy?: any
    }) {
        let proxy = this.buildProxyOption(options)
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
export default new Application()