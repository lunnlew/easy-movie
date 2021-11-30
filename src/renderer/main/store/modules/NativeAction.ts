import { ipcRenderer } from "electron"

// eslint-disable-next-line
const empty = () => { }
export default {
    namespaced: false,
    state() {
        return {
            addRouters: [],
            complete: {},
            resolveIdle: {},
        }
    },
    mutations: {
        SET_ROUTERS: (state: { addRouters: any }, routers: any) => {
            state.addRouters = routers
        },
        SET_RESOLVE_IDLE: (state: { resolveIdle: { [x: string]: any } }, { uuid, fn }: any) => {
            console.log('SET_RESOLVE_IDLE', uuid)
            state.resolveIdle[uuid] = fn
        }
    },
    actions: {
        async invokeNativeAction({ commit, state }: any, params: { action: any; timeout: any; options: any }) {
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
                    console.log('invokeNativeAction', params.action, '获取超时')
                    clear(uuid)
                    state.resolveIdle[uuid]()
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
                ipcRenderer.send('invokeNativeAction', {
                    uuid,
                    action: params.action,
                    options: params.options
                })
                awaitComplete(uuid).then(resolve)
            })
        },
        initElectronEvent({ commit, state }: any) {
            console.log('initElectronEvent')
            ipcRenderer.on('setActionResult', (event: { senderId: any }, data: { uuid: string; result: any }) => {
                console.log('event senderId', event.senderId)
                if (data.uuid in state.complete) {
                    console.log('setActionResult', data)
                    state.complete[data.uuid] = data.result
                    setTimeout(() => {
                        state.resolveIdle[data.uuid]()
                        commit('SET_RESOLVE_IDLE', {
                            uuid: data.uuid, fn: empty
                        });
                    }, 10)
                } else {
                    console.log('skip setActionResult for timeout 60s')
                }
            })
        }
    },
    getters: {
        getRouters: (state: { addRouters: any }) => state.addRouters
    }
}

