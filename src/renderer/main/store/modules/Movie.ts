import { getMovie, getMovieActors, update_movie } from "@/api/movie";
export default {
    namespaced: false,
    state() {
        return {}
    },
    mutations: {
    },
    actions: {
        movie_update({ state }: any, payload: any) {
            console.log(state)
            return new Promise((resolve, reject) => {
                update_movie(payload).then((res: { data: { data: any; }; }) => {
                    resolve(res.data)
                }).catch((err: any) => {
                    reject(err);
                })
            })
        },
        getMovieInfo({ state }: any, movieId: any) {
            console.log(state)
            return new Promise((resolve, reject) => {
                getMovie(movieId).then(res => {
                    resolve(res.data.data || {})
                }).catch(err => {
                    reject(err)
                })
            });
        },
        getMovieActorsInfo({ state }: any, params: any) {
            console.log(state)
            return new Promise((resolve, reject) => {
                getMovieActors(params).then(res => {
                    resolve((res.data.data || []))
                }).catch(err => {
                    reject(err)
                })
            });
        }
    },
    getters: {}
}

