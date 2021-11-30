import { Lib } from '@/types/all'
/**
 * 资料库扫描交互
 */
interface LibScanState {
    /**
     * 扫描状态是否完成
     */
    is_complete: boolean;
    /**
     * 扫描状态是否进行中
     */
    scan_loading: boolean;
    /**
     * 媒体库ID
     */
    lib_id: number;
    /**
     * 媒体库名称
     */
    lib_name: string;
}
interface ScanState {
    /**
     * 媒体库状态列表
     */
    libs: LibScanState[];
}
const state: ScanState = {
    libs: []
}
const mutations = {
    /**
     * 初始化扫描状态
     * @param state 
     * @param libs 
     */
    INIT_LIBS_STATE(state: ScanState, libs: Lib[]) {
        state.libs = libs.map(lib => {
            return {
                lib_id: lib.lib_id,
                lib_name: lib.name,
                is_complete: !!lib.is_scaned,
                scan_loading: false
            } as LibScanState
        }) as LibScanState[];
    },
    /**
     * 更新扫描状态
     * @param state 
     * @param payload 
     */
    SET_LIB_SCAN_STATE(state: ScanState, payload: Lib) {
        const lib = state.libs.find(lib => lib.lib_id === payload.lib_id);
        if (lib) {
            lib.is_complete = !!payload.is_complete;
            lib.scan_loading = !!payload.scan_loading;
        } else {
            state.libs.push({
                lib_id: payload.lib_id,
                lib_name: payload.name,
                is_complete: !!payload.is_complete,
                scan_loading: !!payload.scan_loading
            });
        }
    },
    MOVIE_LISTVIEW_UPDATE(state: { libs: any[]; }, payload: { lib_id: any; movie: any; }) {
        let index = state.libs.findIndex((item: { lib_id: any; }) => item.lib_id === parseInt(payload.lib_id));
        if (index > -1) {
            state.libs[index] = {
                ...state.libs[index],
                update_ver: (state.libs[index].update_ver || 0) + 1,
                movie: payload.movie
            };
        }
        index = state.libs.findIndex((item: { lib_name: any; }) => item.lib_name === 'all');
        if (index > -1) {
            state.libs[index] = {
                ...state.libs[index],
                update_ver: (state.libs[index].update_ver || 0) + 1,
                movie: payload.movie
            };
        }
    }
}
const actions = {}
const getters = {
    lib_scan_state: (state: ScanState) => state.libs
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}