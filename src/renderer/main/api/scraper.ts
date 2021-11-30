import axios from '../utils/axios';
export async function scraper_search(params: any) {
    return axios({
        url: '/scraper/search',
        method: 'post',
        data: params
    })
}
export async function scraper_selected(params: any) {
    return axios({
        url: '/scraper/bind',
        method: 'post',
        data: params
    })
}