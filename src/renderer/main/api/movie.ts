import axios from '../utils/axios';
export async function getMovies(data: any) {
    return axios({
        url: '/movie/list',
        method: 'post',
        data: data
    })
}

export async function getMovie(movieId: any) {
    return axios({
        url: '/movie/detail',
        method: 'post',
        data: {
            movieId
        }
    })
}

export async function update_movie(data: any) {
    return axios({
        url: '/movie/update',
        method: 'post',
        data: data
    })
}

export async function getMovieActors(params: any) {
    return axios({
        url: '/movie/actors',
        method: 'post',
        data: params
    })
}