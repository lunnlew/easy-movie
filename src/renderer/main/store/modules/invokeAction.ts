import { invokeRenderActionParams } from "@/types/all"
import { ipcRenderer } from "electron"
import { changeShowUpdateTip, needUpdateAlert, progressUpdate, showUpdateCancel } from "@/lib/update"

// eslint-disable-next-line
const empty = () => { }
export default {
    namespaced: false,
    state() {
        return {
            complete: {},
            resolveIdle: {},
        }
    },
    mutations: {
        SET_RESOLVE_IDLE: (state: { resolveIdle: { [x: string]: any } }, { uuid, fn }: any) => {
            console.log('SET_RESOLVE_IDLE', uuid)
            state.resolveIdle[uuid] = fn
        }
    },
    actions: {
        /**
         *  渲染进程向主线程通信模块
         */
        async invokeMainAction({ commit, state }: any, params: { action: string; command: string; timeout: any; options: any }, await_complete = true) {
            function clear(uuid: string | number) {
                console.log('clear uuid', uuid)
                delete state.resolveIdle[uuid]
                delete state.complete[uuid]
            }
            function awaitComplete(uuid: number) {
                if (state.complete[uuid]) {
                    return state.complete[uuid]
                }
                const timeout = setTimeout(() => {
                    console.log('invokeMainAction', params.action, '获取超时')
                    state.resolveIdle[uuid]()
                    clear(uuid)
                    commit('SET_RESOLVE_IDLE', {
                        uuid: uuid, fn: empty
                    });
                }, (params.timeout || 60) * 1000)
                return new Promise(resolve => {
                    const existingResolve = state.resolveIdle[uuid];
                    commit('SET_RESOLVE_IDLE', {
                        uuid, fn: () => {
                            existingResolve();
                            clearTimeout(timeout)
                            const result = state.complete[uuid]
                            setTimeout(() => clear(uuid), 30)
                            resolve(result);
                        }
                    });
                })
            }
            return new Promise((resolve) => {
                const uuid = Date.now()
                commit('SET_RESOLVE_IDLE', {
                    uuid: uuid, fn: empty
                });
                state.complete[uuid] = false
                ipcRenderer.send('invokeMainAction', {
                    uuid,
                    action: params.action,
                    command: params.command,
                    options: params.options
                })
                if (await_complete) {
                    awaitComplete(uuid).then(resolve)
                } else {
                    resolve({})
                }
            })
        },
        /**
         * 初始化双向交互通道
         * @param param0 
         */
        initActionEvent({ commit, state }: any) {
            // 主线程向渲染进程通信
            ipcRenderer.on('invokeRenderAction', (event, params: invokeRenderActionParams) => {
                console.log('invokeRenderAction from main', event.senderId, params)
                const replyMessage = function (uuid: any, result: any) {
                    event.sender.send("setRenderReplyResult", {
                        uuid: uuid,
                        result
                    })
                }
                switch (params.action) {
                    case 'updateAvailable': {
                        changeShowUpdateTip(1, (data: any) => {
                            replyMessage(params.uuid, data)
                        })
                        break
                    }
                    case 'needUpdateAlert': {
                        needUpdateAlert.value = true
                        break
                    }
                    case 'updateNotAvailable': {
                        changeShowUpdateTip(4)
                        break
                    }
                    case 'progressUpdate': {
                        progressUpdate(parseFloat(parseFloat(params.options.percent).toFixed(2)))
                        break
                    }
                    case 'downloadedAvailable': {
                        progressUpdate(100)
                        changeShowUpdateTip(3, (data: any) => {
                            replyMessage(params.uuid, data)
                        })
                        break
                    }
                    default: replyMessage(params.uuid, {})
                }
            })
            // 主线程向渲染进程设置返回结果
            ipcRenderer.on('setMainReplyResult', (event: { senderId: any }, data: { uuid: string; result: any }) => {
                console.log('setMainReplyResult from main', event.senderId)
                if (data.uuid in state.complete) {
                    console.log('setMainReplyResult', data)
                    state.complete[data.uuid] = data.result
                    setTimeout(() => {
                        state.resolveIdle[data.uuid]()
                        commit('SET_RESOLVE_IDLE', {
                            uuid: data.uuid, fn: empty
                        });
                    }, 10)
                } else {
                    console.log('skip setMainReplyResult for timeout 60s')
                }
            })
        }
    },
    getters: {}
}

