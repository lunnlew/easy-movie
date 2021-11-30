import { app, Menu, MenuItem, BrowserWindow } from "electron";
import path from 'path'
import dataM from '../database/DataM'
import windowControl from "./window";
declare const __static: string

export function createContextMenu(event: any, params: any) {
    const menu = new Menu()
    menu.append(new MenuItem({
        label: '偏好设置...', click: () => {
            windowControl.createBrowserWindow(event, {
                options: {
                    width: 800,
                    height: 600,
                    title: '偏好设置',
                    route: 'setting.html'
                }
            })
        }
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: '检查更新' }))
    menu.append(new MenuItem({ label: '关于' }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: '退出', click: () => { app.exit() } }))
    // menu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))
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
    let fields = await dataM.knexInstance('config').where('type', '=', 'search_field')
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
                    enable: field.state == 0 ? true : false
                })
            }
        }
        if (field.state == 1) {
            option.icon = path.join(__static, 'check.png')
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