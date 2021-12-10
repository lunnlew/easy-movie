
import { install_as_service, service_status, uninstall_as_service } from "@/api/system";
const state = {}
const mutations = {}
const actions = {
    /**
     * 作为服务安装
     * @param param0 
     * @param payload 
     */
    async installAsService({ commit }: any, payload: any) {
        return await install_as_service(payload);
    },
    /**
     * 作为服务卸载
     * @param param0
     *  @param payload
     */
    async uninstallAsService({ commit }: any, payload: any) {
        return await uninstall_as_service(payload);
    },
    /**
     * 服务状态
     * @param param0 
     * @param payload 
     * @returns 
     */
    async serviceStatus({ commit }: any, payload: any) {
        return await service_status(payload);
    }
}
const getters = {}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}