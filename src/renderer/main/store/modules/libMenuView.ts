/**
 * 媒体库菜单交互
 */

import { Lib } from '@/types/all'
import {
    Menu as IconMenu,
    Film
} from '@element-plus/icons'
import { shallowRef } from 'vue'

interface LibMenuItem {
    lib_id: number
    name: string,
    path: string,
    scan_loading?: boolean,
    meta: {
        [key: string]: any
    }
}

interface ShowResetLib {
    lib_id: string,
    name: string,
    path: string,
}

interface LibMenuViewState {
    /**
     * 菜单列表
     */
    menus: LibMenuItem[];
    /**
     * 是否显示重定位对话框
     */
    showResetDirView: boolean;
    /**
     * 重定位对话框库信息
     */
    showResetLib: ShowResetLib
}

/**
 * 根据媒体库类型取得菜单图标
 * @param type 
 * @returns 
 */
function getIcon(type: string) {
    if (type === 'movie') {
        return Film
    } else {
        return IconMenu
    }
}

const state: LibMenuViewState = {
    menus: [],
    showResetDirView: false,
    showResetLib: {} as ShowResetLib
}

const mutations = {
    /**
     * 从媒体库转换为菜单
     * @param state 
     * @param libs 
     */
    INIT_MENU_FOR_LIBS(state: LibMenuViewState, libs: Lib[]) {
        console.log('INIT_MENU_FOR_LIBS', libs)
        state.menus = libs.map(lib => {
            return {
                lib_id: lib.lib_id,
                name: lib.name,
                scan_loading: lib.scan_loading || false,
                path: `/lib/` + encodeURIComponent(lib.name),
                meta: {
                    title: lib.meta?.title || (lib.name === 'all' ? '全部' : lib.name),
                    sort: lib.sort || 1,
                    icon: shallowRef(getIcon(lib.type)),
                    keepAlive: true
                }
            }
        });
    },
    /**
     * 更新菜单
     * @param state 
     * @param payload 
     */
    SET_LIB_MENU(state: LibMenuViewState, lib: Lib) {
        const menu = state.menus.find(menu => menu.lib_id === lib.lib_id);
        if (menu) {
            menu.name = lib.name || menu.name;
            menu.path = `/lib/` + encodeURIComponent(menu.name);
            menu.scan_loading = lib.scan_loading || menu.scan_loading;
            menu.meta = {
                title: lib.meta?.title || menu.meta?.title || (menu.name === 'all' ? '全部' : menu.name),
                sort: lib.sort || menu.meta?.sort || 1,
                type: lib.type || menu.meta?.type,
                icon: shallowRef(getIcon(lib.type || menu.meta?.type)),
                keepAlive: true
            }
        } else {
            state.menus.push({
                lib_id: lib.lib_id,
                name: lib.name,
                scan_loading: lib.scan_loading || false,
                path: `/lib/` + encodeURIComponent(lib.name),
                meta: {
                    title: lib.meta?.title || (lib.name === 'all' ? '全部' : lib.name),
                    sort: lib.sort || 1,
                    type: lib.type || '',
                    icon: shallowRef(getIcon(lib.type)),
                    keepAlive: true
                }
            })
        }
    },
    REMOVE_LIB_MENU(state: LibMenuViewState, lib: Lib) {
        const index = state.menus.findIndex(menu => lib.lib_id === menu.lib_id);
        if (index > -1) {
            state.menus.splice(index, 1);
        }
    },
    /**
     * 显示重定位对话框
     * @param state 
     * @param payload 
     */
    SET_RESETDIR_VIEW(state: LibMenuViewState, lib: any) {
        state.showResetDirView = lib.show;
        state.showResetLib = lib;
    }
}
const actions = {}
const getters = {
    lib_menus: (state: LibMenuViewState) => state.menus,
    showResetLib: (state: LibMenuViewState) => state.showResetLib,
    showResetDirView: (state: LibMenuViewState) => state.showResetDirView,
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}