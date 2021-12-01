import tunnel from 'tunnel'
import globalEventEmitter, { GlobalEventType } from './eventEmitter/GlobalEventEmitter'
export class App {
    proxy;
    eventEmitter: GlobalEventType;
    constructor() {
        this.proxy = {
            host: '127.0.0.1',
            port: 1081,
            protocol: 'http:',
            proxyAuth: ''
        }
        this.eventEmitter = globalEventEmitter
    }
    buildHttpsTunnelAgent(options?: {
        proxy?: any
    }) {
        let proxy = this.proxy
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
        let proxy = this.proxy
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