import { invokeRenderActionParams } from "@/types/all"
import { changeShowUpdateTip, needUpdateAlert, progressUpdate } from "@/lib/update"
import { changeEnableFromSetting } from "@/lib/movieFilter"
const ipcRenderer = (window as any).ipcRenderer
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
         * 渲染进程间通信
         * @param param0 
         * @param params 
         */
        async invokeViewAction({ commit, state, dispatch }: any, params: { name: string, action: string; command: string; timeout: any; options: any; await_complete: boolean }) {
            return dispatch("invokeMainAction", {
                action: "invokeViewAction",
                options: params,
                await_complete: params.await_complete,
            });
        },
        /**
         *  渲染进程向主线程通信模块
         */
        async invokeMainAction({ commit, state }: any, params: { action: string; command: string; timeout: any; options: any; await_complete: boolean }) {
            if (typeof params.await_complete == 'undefined') {
                params.await_complete = true
            }
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
                if (params.await_complete) {
                    awaitComplete(uuid).then(resolve)
                } else {
                    clear(uuid)
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
                    case "setFilterSetting": {
                        changeEnableFromSetting(params.options)
                        break
                    }
                    default: {
                        commit(params.action, params.options)
                        replyMessage(params.uuid, {})
                    }

                }
            })
            // 主线程向渲染进程设置返回结果
            ipcRenderer.on('setMainReplyResult', (event: { senderId: any }, data: { uuid: string; result: any }) => {
                console.log('setMainReplyResult from main', event.senderId)
                if (data.uuid in state.complete) {
                    console.log('setMainReplyResult', data)
                    state.complete[data.uuid] = data.result
                    setTimeout(() => {
                        state.resolveIdle[data.uuid] && state.resolveIdle[data.uuid]()
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

