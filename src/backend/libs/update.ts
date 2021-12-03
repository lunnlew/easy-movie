import { app, BrowserWindow } from "electron"
import { autoUpdater } from "electron-updater"
import log from 'electron-log'
import gh from "github-url-to-object"
import path from 'path'
import fs from 'fs'
import windowControl from "./window"
import invokeAction from "../eventEmitter/invokeAction";

log.transports.file.level = 'debug'
log.transports.console.level = false
log.transports.console.level = 'silly'

class UpdateControl {
    _globalWin: BrowserWindow | null
    needUpdateAlert = false
    constructor() {
        this._globalWin = windowControl.getMainWindow() as BrowserWindow
    }
    init() {
        const defaults = {
            host: 'https://update.electronjs.org'
        }
        const opts = Object.assign({}, defaults, {})
        app.isReady() ? this.initUpdater(opts) : app.on('ready', () => this.initUpdater(opts))
    }
    buildFeedUrl(opts: any) {
        const { host } = opts
        const pkgBuf = fs.readFileSync(path.join(app.getAppPath(), 'package.json'))
        const pkg = JSON.parse(pkgBuf.toString())
        const repoString = (pkg.repository && pkg.repository.url) || pkg.repository
        const repoObject = gh(repoString) as any
        let repo = `${repoObject.user}/${repoObject.repo}`
        return `${host}/${repo}/${process.platform}-${process.arch}/${app.getVersion()}`
    }
    initUpdater(opts: any) {
        autoUpdater.autoDownload = !1
        autoUpdater.logger = log
        autoUpdater.on('error', (error) => {
            log.error(error)
        });
        autoUpdater.on('checking-for-update', () => {
            if (this.needUpdateAlert) {
                invokeAction.invokeRenderAction({
                    action: 'needUpdateAlert'
                }, false)
            }
        });
        autoUpdater.on('update-available', async (info) => {
            console.log('update-available', info)
            if (this.needUpdateAlert) {
                const result = await invokeAction.invokeRenderAction({
                    action: 'updateAvailable',
                })
                if (result.ok) {
                    autoUpdater.downloadUpdate()
                }
            }
        });
        autoUpdater.on('update-not-available', (info) => {
            console.log('update-not-available', info)
            invokeAction.invokeRenderAction({
                action: 'updateNotAvailable'
            }, false)
        });
        autoUpdater.on('download-progress', (progress) => {
            log.info(progress)
            invokeAction.invokeRenderAction({
                action: 'progressUpdate',
                options: progress
            }, false)
        });
        autoUpdater.on('update-downloaded', async (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
            if (this.needUpdateAlert) {
                const result = await invokeAction.invokeRenderAction({
                    action: 'downloadedAvailable',
                })
                if (result.ok) {
                    autoUpdater.quitAndInstall()
                    app.exit()
                    this._globalWin?.destroy()
                }
            }
        });
        autoUpdater.checkForUpdates()
        setInterval(() => {
            this.needUpdateAlert = false
            autoUpdater.checkForUpdates()
        }, 10 * 60 * 1000)
    }
    checkForUpdates() {
        this.needUpdateAlert = true
        autoUpdater.checkForUpdates()
    }
    downloadUpdate() {
        autoUpdater.downloadUpdate()
    }
}

export default new UpdateControl