import axios from '../utils/axios';
export async function getFilters(media_lib_id: any, type: any, list: any[]) {
    return axios({
        url: '/filters/list',
        method: 'post',
        data: {
            media_lib_id,
            type,
            list
        }
    })
}