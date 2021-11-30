import { app, BrowserWindow, dialog } from "electron"
import { autoUpdater } from "electron-updater"
import log from 'electron-log'
import gh from "github-url-to-object"
import path from 'path'
import fs from 'fs'

log.transports.file.level = 'debug'
log.transports.console.level = false
log.transports.console.level = 'silly'

class UpdateControl {
    _globalWin: BrowserWindow | null
    constructor(_globalWin: BrowserWindow | null) {
        this._globalWin = _globalWin
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
        let feedUrl = this.buildFeedUrl(opts)
        console.log('feedUrl', feedUrl)

        autoUpdater.autoDownload = !1
        autoUpdater.logger = log
        autoUpdater.setFeedURL(feedUrl);
        autoUpdater.on('error', (error) => {
            log.error(error)
        });
        autoUpdater.on('checking-for-update', () => { });
        autoUpdater.on('update-available', (info) => {
            log.info(info)
        });
        autoUpdater.on('update-not-available', (info) => {
            log.info(info)
        });
        autoUpdater.on('download-progress', (progress) => {
            log.info(progress)
        });
        autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
            const dialogOpts = {
                type: 'info',
                buttons: ['Restart', 'Later'],
                title: 'Application Update',
                message: process.platform === 'win32' ? releaseNotes : releaseName,
                detail: 'A new version has been downloaded. Restart the application to apply the updates.'
            }
            dialog.showMessageBox(dialogOpts).then((returnValue) => {
                if (returnValue.response === 0) autoUpdater.quitAndInstall()
            })
        });


        autoUpdater.checkForUpdates()
        setInterval(() => { autoUpdater.checkForUpdates() }, 10 * 60 * 1000)
    }
}

export default UpdateControl