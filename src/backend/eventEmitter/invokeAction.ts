
import { ipcMain, dialog, app } from "electron";
import { createContextMenu, createMovieItemMenu, createSearchAreaMenu } from "../libs/contextMenu"
import { loadConfig } from "../libs/config"
import { setFilterSetting, setFilterData, setProxySetting, loadProxySetting, loadServiceState } from "../libs/filter";
import { invokeMainActionParams } from "../types";
import windowControl from "../libs/window";
import proxyControl from "../libs/proxy";

// eslint-disable-next-line
const empty = () => { }

class InvokeAction {
    complete: any
    resolveIdle: any
    constructor() {
        this.complete = {}
        this.resolveIdle = {}
    }
    init() {
        this.initActionEvent()
    }
    /**
     *  主线程向渲染进程通信模块
     */
    invokeRenderAction(viewName: string, params: { action: string; command?: string; timeout?: any; options?: any }, await_complete = true): any {
        const viewWin = windowControl.getViewWindowByName(viewName)
        var clear = (uuid: string | number) => {
            console.log('clear uuid', uuid)
            delete this.resolveIdle[uuid]
            delete this.complete[uuid]
        }
        var awaitComplete = (uuid: number) => {
            if (this.complete[uuid]) {
                return this.complete[uuid]
            }
            const timeout = setTimeout(() => {
                console.log('invokeRenderAction', params.action, '获取超时')
                this.resolveIdle[uuid]()
                clear(uuid)
                this.resolveIdle[uuid] = empty
            }, (params.timeout || 60) * 1000)
            return new Promise(resolve => {
                const existingResolve = this.resolveIdle[uuid];
                this.resolveIdle[uuid] = () => {
                    existingResolve();
                    clearTimeout(timeout)
                    const result = this.complete[uuid]
                    setTimeout(() => clear(uuid), 30)
                    resolve(result);
                }
            })
        }
        return new Promise((resolve) => {
            const uuid = Date.now()
            this.resolveIdle[uuid] = empty
            this.complete[uuid] = false
            viewWin?.webContents.send("invokeRenderAction", {
                uuid,
                action: params.action,
                command: params.command,
                options: params.options
            })
            if (await_complete) {
                awaitComplete(uuid).then(resolve)
            } else {
                clear(uuid)
                resolve({})
            }
        })
    }
    /**
     * 初始化双向交互通道
     */
    initActionEvent() {
        // 渲染进程向主线程通信
        ipcMain.on("invokeMainAction", (event, params: invokeMainActionParams) => {
            console.log('invokeMainAction from Render', event.sender.id, params)
            var replyMessage = function (uuid: any, result: any) {
                event.sender.send("setMainReplyResult", {
                    uuid: uuid,
                    result
                })
            }
            switch (params.action) {
                case "invokeViewAction": {
                    console.log('invokeViewAction', params.options)
                    this.invokeRenderAction(params.options.name, {
                        action: params.options.action,
                        options: params.options.options
                    }, params.options.await_complete).then(result => {
                        if (params.options.await_complete) {
                            replyMessage(params.uuid, result)
                        }
                    })
                    break
                }
                case "loadConfig": {
                    loadConfig(event, params, (data: any) => {
                        replyMessage(params.uuid, data)
                    })
                    break
                }
                case "showOpenDialog": {
                    dialog.showOpenDialog(params.options).then(result => replyMessage(params.uuid, result))
                    break;
                }
                case "showContextMenu": {
                    createContextMenu(event, params)
                    break
                }
                case "setFilterData": {
                    setFilterData(event, params)
                    break
                }
                case "setFilterSetting": {
                    setFilterSetting(event, params)
                    break
                }
                case "setProxySetting": {
                    setProxySetting(event, params)
                    break
                }
                case "reluanch": {
                    app.relaunch({ args: process.argv.slice(1).concat([proxyControl.loadProxyArgs()]) })
                    app.exit(0)
                    break
                }
                case "loadProxySetting": {
                    loadProxySetting(event, params, (data: any) => {
                        replyMessage(params.uuid, data)
                    })
                    break
                }
                case "loadServiceState": {
                    loadServiceState(event, params, (data: any) => {
                        replyMessage(params.uuid, data)
                    })
                    break
                }
                case "showSearchAreaMenu": {
                    createSearchAreaMenu(event, params, (data: any) => {
                        replyMessage(params.uuid, data)
                    })
                    break
                }
                case "showMovieItemMenu": {
                    createMovieItemMenu(event, params, (data: any) => {
                        replyMessage(params.uuid, data)
                    })
                    break
                }
                case "windowControl": {
                    windowControl.dispatch(event, params, (data: any) => {
                        replyMessage(params.uuid, data)
                    })
                    break
                }
                default:
                    console.log('不支持的消息', params)
            }
        })
        // 渲染进程向主线程设置返回结果
        ipcMain.on("setRenderReplyResult", (event, data: { uuid: string; result: any }) => {
            console.log('setRenderReplyResult from Render', event.sender.id)
            if (data.uuid in this.complete) {
                console.log('setRenderReplyResult', data)
                this.complete[data.uuid] = data.result
                setTimeout(() => {
                    this.resolveIdle[data.uuid]()
                    this.resolveIdle[data.uuid] = empty
                }, 10)
            } else {
                console.log('skip setRenderReplyResult for timeout 60s')
            }
        })
    }
}

export default new InvokeAction()