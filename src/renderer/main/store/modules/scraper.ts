import { scraper_search, scraper_selected } from "@/api/scraper";
export default {
    namespaced: false,
    state() {
        return {}
    },
    mutations: {
    },
    actions: {
        scraper_search({ state }: any, params: any) {
            console.log(state)
            return new Promise((resolve, reject) => {
                scraper_search(params).then(res => {
                    resolve(res.data.data || [])
                }).catch(err => {
                    reject(err)
                })
            });
        },
        scraper_selected({ state }: any, params: any) {
            console.log(state)
            return new Promise((resolve, reject) => {
                scraper_selected(params).then(res => {
                    resolve(res.data.data)
                }).catch(err => {
                    reject(err)
                })
            });
        },
    },
    getters: {}
}

