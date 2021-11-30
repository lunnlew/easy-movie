import axios from '../utils/axios';
export async function getLibs(page = 1, size = 50) {
    return axios({
        url: '/libs/list',
        method: 'post',
        data: {
            page,
            size
        }
    })
}
export async function getLib(lib: any) {
    return axios({
        url: '/libs/detail',
        method: 'post',
        data: lib
    })
}
export async function scanLib(lib: any) {
    return axios({
        url: '/libs/scan',
        method: 'post',
        data: lib
    })
}
export async function saveLib(lib: any) {
    return axios({
        url: '/libs/save',
        method: 'post',
        data: lib
    })
}

export async function removeLib(lib: any) {
    return axios({
        url: '/libs/remove',
        method: 'post',
        data: lib
    })
}