import axios from '../utils/axios';
export async function install_as_service(params: any) {
    return axios({
        url: '/system/installAsService',
        method: 'get',
        data: params
    })
}
export async function uninstall_as_service(params: any) {
    return axios({
        url: '/system/uninstallService',
        method: 'get',
        data: params
    })
}

export async function service_status(params: any) {
    return axios({
        url: '/system/serviceStatus',
        method: 'get',
        data: params
    })
}