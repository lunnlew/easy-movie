import { app, Menu, MenuItem, BrowserWindow } from "electron";
import path from 'path'
import dataM from '../database/DataM'
import windowControl from "./window";
import updateControl from "./update";
import { __app_path } from "../config";
const isDevelopment = process.env.NODE_ENV == "development";

export function createContextMenu(event: any, params: any) {
    const menu = new Menu()
    menu.append(new MenuItem({
        label: '偏好设置...', click: () => {
            windowControl.createBrowserWindow(event, {
                options: {
                    multi: false,
                    backgroundColor: "#545454",
                    skipTaskbar: false,
                    width: 800,
                    height: 600,
                    frame: false,
                    show: false,
                    readyShow: true,
                    title: '偏好设置',
                    route: 'setting.html'
                }
            })
        }
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
        label: '检查更新', click: () => {
            updateControl.checkForUpdates()
        }
    }))
    menu.append(new MenuItem({ role: 'about', label: '关于' }))
    menu.append(new MenuItem({ type: 'separator' }))
    if (isDevelopment) {
        menu.append(new MenuItem({ role: 'toggleDevTools', label: '开发工具' }))
        menu.append(new MenuItem({ role: 'forceReload', label: '强制重载' }))
    }
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: '退出', click: () => { app.exit() } }))
    let point = params.options?.point || { x: 0, y: 0 }
    const win = BrowserWindow.fromWebContents(event.sender) as BrowserWindow
    menu.popup({
        window: win,
        x: point.x || 0,
        y: point.y || 0
    })
}


export async function createSearchAreaMenu(event: any, params: any, handler: any) {
    const menu = new Menu()
    menu.append(new MenuItem({ label: '搜索范围：' }))
    let fields = await dataM.knexInstance('config').where('type', '=', 'search_field')
    if (fields.length <= 0) {
        return handler({})
    }
    for (let field of fields) {
        let option: any = {
            label: field.name,
            click: () => {
                dataM.knexInstance('config').where({ id: field.id }).update({
                    state: field.state == 0 ? 1 : 0
                }).on('query', (query: any) => {
                    console.log(query.sql)
                }).catch(err => {
                    console.log(err)
                })
                handler({
                    field: field.val,
                    label: field.name,
                    enable: field.state == 0 ? true : false
                })
            }
        }
        if (field.state == 1) {
            option.icon = path.join(__app_path, 'dist/check.png')
        }
        menu.append(new MenuItem(option))
    }
    let point = params.options?.point || { x: 0, y: 0 }
    const win = BrowserWindow.fromWebContents(event.sender) as BrowserWindow
    menu.popup({
        window: win,
        x: point.x || 0,
        y: point.y || 0
    })
}