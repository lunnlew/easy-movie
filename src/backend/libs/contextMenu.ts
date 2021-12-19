import { app, Menu, MenuItem, BrowserWindow, shell } from "electron";
import path from 'path'
import fs from 'fs'
import windowControl from "./window";
import updateControl from "./update";
import { __app_path } from "../preference";
import application from "./application";
import libs from "../database/libs";
import tvScan from '../scan/TvScan'
import movieScan from '../scan/MovieScan'
import invokeAction from "../eventEmitter/invokeAction";
import movie from "../database/movie";

/**
 * 左上角上下文菜单
 * @param event 
 * @param params 
 */
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
    if (application.isDevelopment) {
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
    menu.on('menu-will-close', () => { })
}

/**
 * 头部搜索框上下文菜单
 * @param event 
 * @param params 
 * @param handler 
 * @returns 
 */
export async function createSearchAreaMenu(event: any, params: any, handler: any) {
    const menu = new Menu()
    menu.append(new MenuItem({ label: '搜索范围：', enabled: false }))
    let fields = await application.knex('config').where('type', '=', 'search_field')
    for (let field of fields) {
        let option: any = {
            label: field.name,
            click: () => {
                application.knex('config').where({ id: field.id }).update({
                    state: field.state == 0 ? 1 : 0,
                    updated_at: Date.now()
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
    menu.on('menu-will-close', () => {
        handler({
            action: 'close',
            state: 'success',
        })
    })
}

/**
 * 影视列表上下文菜单
 * @param event 
 * @param params 
 * @param handler 
 */
export async function createMovieItemMenu(event: any, params: any, handler: any) {
    const menu = new Menu()
    let point = params.options?.point || { x: 0, y: 0 }
    let item = params.options?.item || {}
    menu.append(new MenuItem({ label: item.name_cn.length > 10 ? item.name_cn.substr(0, 10) + '...' : item.name_cn, enabled: false }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
        label: '编辑', click: () => {
            handler({
                action: 'edit',
                state: 'success',
            })
        }
    }))
    menu.append(new MenuItem({
        label: '重新刮削', click: () => {
            handler({
                action: 'scraper',
                state: 'success',
            })
        }
    }))
    menu.append(new MenuItem({
        label: '打开电影位置', click: () => {
            movie.getById(item.id).then((res) => {
                if (fs.existsSync(res.path)) {
                    fs.statSync(res.path).isDirectory() ?
                        shell.openPath(res.path).catch(err => console.log(err)) :
                        shell.openPath(path.dirname(res.path)).catch(err => console.log(err))
                }
                handler({
                    action: 'opendir',
                    state: 'success',
                })
            }).catch(err => {
                console.log(err)
                handler({
                    action: 'opendir',
                    state: 'error',
                })
            })
        }
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
        label: '从媒体库移除', click: () => {
            application.knex('movie_files').where({ id: item.fid }).delete().then((res) => {
                console.log(res)
                handler({
                    action: 'remove',
                    state: 'success',
                })
            }).catch(err => {
                console.log(err)
                handler({
                    action: 'remove',
                    state: 'error',
                })
            })
        }
    }))
    const win = BrowserWindow.fromWebContents(event.sender) as BrowserWindow
    menu.popup({
        window: win,
        x: point.x || 0,
        y: point.y || 0
    })
    menu.on('menu-will-close', () => {
        handler({
            action: 'close',
            state: 'success',
        })
    })
}

/**
 * 库列表上下文菜单
 * @param event 
 * @param params 
 * @param handler 
 */
export async function createLibMenu(event: any, params: any, handler: any) {
    let point = params.options?.point || { x: 0, y: 0 }
    let item = params.options?.item || {}
    if (item.name !== 'all') {
        const menu = new Menu()
        menu.append(new MenuItem({
            label: '编辑', click: () => {
                handler({
                    action: 'edit',
                    state: 'success',
                })
            }
        }))
        menu.append(new MenuItem({
            label: '扫描', click: async () => {
                console.log('扫描', item.name)
                let data = await libs.getByName(item.name).catch(err => { throw err })
                libs.updateById(data.id, {
                    scan_loading: true
                })
                if (data.type === 'tv') {
                    tvScan.scan(data.path, data.id || '', true)
                } else if (data.type === 'movie') {
                    movieScan.scan(data.path, data.id || '', true)
                }
                invokeAction.invokeRenderAction('mainView', {
                    action: 'libScanView/SET_LIB_SCAN_STATE',
                    options: {
                        lib_id: data.id,
                        scan_loading: true,
                    }
                }, false)
                invokeAction.invokeRenderAction('mainView', {
                    action: 'libMenuView/SET_LIB_MENU',
                    options: {
                        lib_id: data.id,
                        scan_loading: true,
                    }
                }, false)
                handler({
                    action: 'scan',
                    state: 'success',
                })
            }
        }))
        menu.append(new MenuItem({
            label: '生成NFO信息', click: async () => {
                let lib = await libs.getByName(item.name).catch(err => { throw err })
                let movies = await movie.listByLibId(lib.id)
                for (let movie of movies) {
                    // 去生成影视nfo信息
                    application.event.emit('movie:generate-nfo', {
                        movie_id: movie.id,
                        file_path: movie.path.replace(/\\/g, '/'),
                    });
                }
                handler({
                    action: 'gennfo',
                    state: 'success',
                })
            }
        }))
        menu.append(new MenuItem({
            label: '打开库位置', click: async () => {
                let res = await libs.getByName(item.name).catch(err => { throw err })
                if (fs.existsSync(res.path)) {
                    fs.statSync(res.path).isDirectory() ?
                        shell.openPath(res.path).catch(err => console.log(err)) :
                        shell.openPath(path.dirname(res.path)).catch(err => console.log(err))
                }
                handler({
                    action: 'openlibdir',
                    state: 'success',
                })
            }
        }))
        menu.append(new MenuItem({ type: 'separator' }))
        menu.append(new MenuItem({
            label: '移除', click: () => {
                handler({
                    action: 'remove',
                    state: 'success',
                })
            }
        }))
        const win = BrowserWindow.fromWebContents(event.sender) as BrowserWindow
        menu.popup({
            window: win,
            x: point.x || 0,
            y: point.y || 0
        })
        menu.on('menu-will-close', () => {
            handler({
                action: 'close',
                state: 'success',
            })
        })
    } else {
        handler({
            action: 'skip',
            state: 'success',
        })
    }
}

/**
 * 排序区上下文菜单
 * @param event 
 * @param params 
 * @param handler 
 */
export async function showSortAreaMenu(event: any, params: any, handler: any) {
    let point = params.options?.point || { x: 0, y: 0 }
    const menu = new Menu()
    menu.append(new MenuItem({ label: '排序字段', enabled: false }))

    let fields = await application.knex('config').where('type', '=', 'sort_field')
    for (let field of fields) {
        let option: any = {
            label: field.name,
            click: () => {
                if (field.state == 0) {
                    application.knex('config').where({ type: 'sort_field' }).update({
                        state: field.state,
                        updated_at: Date.now()
                    }).on('query', (query: any) => {
                        console.log(query.sql)
                    }).catch(err => {
                        console.log(err)
                    })
                }
                application.knex('config').where({ id: field.id }).update({
                    state: field.state == 0 ? 1 : 0,
                    updated_at: Date.now()
                }).on('query', (query: any) => {
                    console.log(query.sql)
                }).catch(err => {
                    console.log(err)
                })
                handler({
                    action: 'sort_field',
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

    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: '排序方式', enabled: false }))

    fields = await application.knex('config').where('type', '=', 'sort_type')
    for (let field of fields) {
        let option: any = {
            label: field.name,
            // type: 'radio',
            click: () => {
                application.knex('config').where({ type: 'sort_type' }).update({
                    state: field.state,
                    updated_at: Date.now()
                }).on('query', (query: any) => {
                    console.log(query.sql)
                }).catch(err => {
                    console.log(err)
                })
                application.knex('config').where({ id: field.id }).update({
                    state: field.state == 0 ? 1 : 0,
                    updated_at: Date.now()
                }).on('query', (query: any) => {
                    console.log(query.sql)
                }).catch(err => {
                    console.log(err)
                })
                handler({
                    action: 'sort_type',
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

    const win = BrowserWindow.fromWebContents(event.sender) as BrowserWindow
    menu.popup({
        window: win,
        x: point.x || 0,
        y: point.y || 0
    })
    menu.on('menu-will-close', () => {
        handler({
            action: 'close',
            state: 'success',
        })
    })
}
