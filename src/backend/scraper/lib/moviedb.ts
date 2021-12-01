'use strict'
import { MovieDb as MovieDbApi } from 'moviedb-promise'
import { imdb_apikey, imdb_apiurl, imdb_imgbase } from '../../config';
import { App } from '../../application'
import {
    MovieInfo, PersonInfo,
    ScraperMovieRequestPayload, ScraperCastRequestPayload,
    ScraperInitTask, ScraperResultTask
} from '../../types/index'
class MovieDb {
    apikey: string = imdb_apikey;
    apiurl: string = imdb_apiurl; // instead https://empty-thunder-5c2a.karoy.workers.dev/3/
    imgbase: string = imdb_imgbase;
    api: MovieDbApi;
    app: App
    scraper_id: string = 'moviedb';
    constructor(app: App) {
        this.app = app
        this.api = new MovieDbApi(this.apikey, this.apiurl);
        this.initialize();
    }
    async initialize() {
        console.log('moviedb scraper initialize');
        this.app.eventEmitter.on('scraper:' + this.scraper_id + ':fetch-movie', (task: ScraperInitTask) => {
            this.fetch_movie_info(task);
        })
        this.app.eventEmitter.on('scraper:' + this.scraper_id + ':fetch-cast', (task: ScraperInitTask) => {
            this.fetch_cast_info(task);
        })
    }
    /**
     * 抓取电影信息
     * @param task 
     */
    async fetch_movie_info(task: ScraperInitTask) {
        let orign_movie = task.payload as ScraperMovieRequestPayload;
        if (!orign_movie.name) {
            this.app.eventEmitter.emit('scraper-queue:submit-task', {
                task_uuid: task.task_uuid,
                task_state: 'fail',
                task_type: 'fetch_movie',
                task_msg: '搜索名称为空',
            } as ScraperResultTask)
            return;
        }
        console.log('scrape fetch_movie_info', task.task_uuid, orign_movie.movie_id, orign_movie.name, orign_movie.year || '');
        try {
            let data = await this.api.searchMovie({ query: orign_movie.name, language: 'zh' }, {
                proxy: false,
                httpsAgent: this.app.buildHttpsTunnelAgent()
            }).catch(err => {
                throw err;
            })
            let result = data.results || []
            // 默认取第一个
            let imdb_movie: any = result.length > 0 ? result[0] : {};
            if (orign_movie.year) { // 选择指定年份的
                let year_movie = result.find(item => {
                    return item.release_date && item.release_date.substr(0, 4) == orign_movie.year;
                })
                if (year_movie) {
                    imdb_movie = year_movie;
                }
            }
            if (imdb_movie && imdb_movie.title) {
                let imdb_movie_info = await this.api.movieInfo({ id: imdb_movie.id, language: "zh", append_to_response: 'casts' }, {
                    proxy: false,
                    httpsAgent: this.app.buildHttpsTunnelAgent()
                }).catch(err => {
                    throw err;
                })
                let movie_info: MovieInfo = {
                    movie_id: orign_movie.movie_id,
                    name: imdb_movie.title,
                    media_lib_id: orign_movie.media_lib_id,
                    path: orign_movie.path,
                    year: imdb_movie.release_date?.substr(0, 4),
                    summary: imdb_movie.overview?.trim(),
                    release_date: imdb_movie.release_date,
                    poster: this.imgbase + imdb_movie.poster_path,
                    duration: imdb_movie_info.runtime || 0,
                    genres: imdb_movie_info.genres?.map(item => item.name).join(',') || '',
                    country: imdb_movie_info.production_countries?.map(item => item.iso_3166_1).join(',') || '',
                    spoken_languages: imdb_movie_info.spoken_languages?.map(item => item.iso_639_1).join(',') || '',
                    backdrop: this.imgbase + imdb_movie.backdrop_path,
                    imdb_rating: imdb_movie.vote_average,
                    imdb_votes: imdb_movie.vote_count,
                    imdb_id: imdb_movie_info.imdb_id || '',
                    imdb_sid: imdb_movie_info.id || '' as any,
                    imdb_url: imdb_movie_info.homepage || '',
                    original_language: imdb_movie.original_language,
                    original_title: imdb_movie.original_title,
                    language: imdb_movie.original_language,
                    casts: (imdb_movie_info as any).casts.cast.map((item: { profile_path: string; }) => ({
                        ...item,
                        profile_path: item.profile_path ? this.imgbase + item.profile_path : item.profile_path,
                    })),
                    crews: (imdb_movie_info as any).casts.crew.map((item: { profile_path: string; }) => ({
                        ...item,
                        profile_path: item.profile_path ? this.imgbase + item.profile_path : item.profile_path,
                    })),
                }
                this.app.eventEmitter.emit('scraper-queue:submit-task', {
                    task_event: 'movie:save-info',
                    task_uuid: task.task_uuid,
                    task_state: 'success',
                    task_type: 'fetch_movie',
                    payload: movie_info,
                } as ScraperResultTask)
            } else {
                this.app.eventEmitter.emit('scraper-queue:submit-task', {
                    task_uuid: task.task_uuid,
                    task_state: 'fail',
                    task_type: 'fetch_movie',
                    task_msg: 'not found',
                } as ScraperResultTask)
            }
        } catch (e) {
            console.log(e)
            this.app.eventEmitter.emit('scraper-queue:submit-task', {
                task_uuid: task.task_uuid,
                task_type: 'fetch_movie',
                task_state: 'error',
            } as ScraperResultTask)
        }
    }
    /**
     * 抓取演职员信息
     * @param task 
     */
    async fetch_cast_info(task: ScraperInitTask) {
        let orign_cast = task.payload as ScraperCastRequestPayload;
        if (!orign_cast.name) {
            this.app.eventEmitter.emit('scraper-queue:submit-task', {
                task_uuid: task.task_uuid,
                task_state: 'fail',
                task_type: 'fetch_cast',
                task_msg: '搜索名称为空',
            } as ScraperResultTask)
            return;
        }
        console.log('scrape fetch_cast_info', task.task_uuid, orign_cast.imdb_sid, orign_cast.name, orign_cast.imdb_id || '');
        try {
            let data = await this.api.personInfo({ id: orign_cast.imdb_sid as any, language: "zh" }, {
                proxy: false,
                httpsAgent: this.app.buildHttpsTunnelAgent()
            }).catch(err => {
                throw err;
            })
            if (data) {
                let person_info: PersonInfo = {
                    actor_id: orign_cast.actor_id,
                    imdb_sid: data.id,
                    name: data.name || '',
                    gender: data.gender || 0,
                    imdb_id: data.imdb_id || '',
                    imdb_url: data.homepage || '',
                    avatar: data.profile_path ? this.imgbase + data.profile_path : data.profile_path || '',
                    birthday: data.birthday || '',
                    deathday: data.deathday || '',
                    place_of_birth: data.place_of_birth || '',
                    also_known_as: data.also_known_as?.join(',') || '',
                }
                this.app.eventEmitter.emit('scraper-queue:submit-task', {
                    task_event: 'cast:save-info',
                    task_uuid: task.task_uuid,
                    task_state: 'success',
                    task_type: 'fetch_cast',
                    payload: person_info,
                } as ScraperResultTask)
            } else {
                this.app.eventEmitter.emit('scraper-queue:submit-task', {
                    task_uuid: task.task_uuid,
                    task_state: 'fail',
                    task_type: 'fetch_cast',
                    task_msg: 'not found',
                } as ScraperResultTask)
            }
        } catch (e) {
            console.log(e)
            this.app.eventEmitter.emit('scraper-queue:submit-task', {
                task_uuid: task.task_uuid,
                task_type: 'fetch_cast',
                task_state: 'error',
            } as ScraperResultTask)
        }
    }
}
export default MovieDb