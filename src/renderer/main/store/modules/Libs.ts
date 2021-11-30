import { getLib, getLibs, removeLib, scanLib, saveLib } from "@/api/lib";
import { ElMessage } from 'element-plus'
export default {
    namespaced: false,
    state() {
        return {
            is_scroll_bottom_end: false,
            libs: []
        }
    },
    mutations: {
        setScrollBottomEnd(state: any, is_scroll_bottom_end: boolean) {
            state.is_scroll_bottom_end = is_scroll_bottom_end
        },
        setLibs(state: any, libs: any) {
            state.libs = libs
        },
        updateLib(state: { libs: any[]; }, lib: any) {
            const index = state.libs.findIndex((item: { lib_id: any; }) => item.lib_id === lib.lib_id);
            if (index > -1) {
                state.libs[index] = {
                    ...lib,
                    meta: {
                        ...state.libs[index].meta,
                        ...lib.meta
                    }
                };
            }
        },
        addLib(state: { libs: any[]; }, lib: any) {
            state.libs.push(lib)
        },
        removeLib(state: { libs: any[]; }, lib: { name: any; }) {
            const index = state.libs.findIndex((item: { name: any; }) => item.name === lib.name);
            if (index !== -1) {
                state.libs.splice(index, 1);
            }
        }
    },
    actions: {
        async addLib({ commit }: any, lib: any) {
            const res = await saveLib({
                ...lib,
                lib_path: lib.path.replace(/\\/g, '/')
            })
            if (res.data.code === 200) {
                lib = {
                    ...lib,
                    lib_id: res.data.data.pop(),
                }
                commit('addLib', lib)
                commit('libScanView/SET_LIB_SCAN_STATE', lib)
                commit('libMenuView/SET_LIB_MENU', lib)
            } else {
                ElMessage({
                    message: res.data.message,
                    type: 'error'
                })
            }
        },
        async getLib({ commit }: any, lib: any) {
            const res = await getLib(lib)
            if (res.data.data) {
                const lib = {
                    ...res.data.data,
                    lib_id: res.data.data.id,
                    lib_path: res.data.data.path.replace(/\\/g, '/')
                }
                commit('updateLib', lib);
                commit('libScanView/SET_LIB_SCAN_STATE', lib)
                commit('libMenuView/SET_LIB_MENU', lib)
            }
        },
        async loadLibs({ commit }: any) {
            const res = await getLibs();
            if (res.data.code === 200) {
                const libs = res.data.data.map((l: any) => ({
                    ...l,
                    lib_id: l.id,
                    lib_path: l.path.replace(/\\/g, '/')
                }));
                commit('setLibs', libs);
                commit('libMenuView/INIT_MENU_FOR_LIBS', libs);
                commit('libScanView/INIT_LIBS_STATE', libs);
            }
        },
        async removeLib({ commit }: any, lib: any) {
            const res = await removeLib({
                ...lib,
                id: lib.lib_id
            })
            if (res.data.code === 200) {
                commit('removeLib', lib)
                commit('libMenuView/REMOVE_LIB_MENU', lib)
            }
        },
        async startScanLib({ commit }: any, lib: any) {
            commit('libScanView/SET_LIB_SCAN_STATE', {
                ...lib,
                scan_loading: true,
            })
            await scanLib(lib).then((res: any) => {
                if (res.data.code !== 200) {
                    setTimeout(() => {
                        commit('libScanView/SET_LIB_SCAN_STATE', {
                            ...lib,
                            scan_loading: false,
                            is_complete: false,
                        })
                    }, 3000)
                }
            })
        }
    },
    getters: {
        libs: (state: { libs: any; }) => state.libs
    }
}

