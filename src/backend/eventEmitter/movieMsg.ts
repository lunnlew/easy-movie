import axios from 'axios'
import dataM from '../database/DataM'
import application from '../libs/application'
import fs from 'fs'
import path from 'path'
import { MovieInfo, ScraperCastRequestPayload, ScraperInitTask } from '../types/index'
import { GlobalEventType } from './GlobalEventEmitter'
import RequestAdapter from '../libs/RequestAdapter'
class movieMsg {
    eventEmitter
    knex
    constructor(eventEmitter: GlobalEventType) {
        this.eventEmitter = eventEmitter
        this.knex = dataM.knexInstance
        this.initialize()
    }
    async initialize() {
        /**
         * 保存影视信息
         */
        this.eventEmitter.on('movie:save-info', async (payload) => {
            var afterUpdate = (movie_id: number) => {
                if (payload.poster) {
                    this.eventEmitter.emit('movie:download-poster', {
                        movie_id: movie_id,
                        lib_id: payload.media_lib_id || '',
                        path: payload.path || '',
                        poster: payload.poster || '',
                    })
                }
                if (payload.backdrop) {
                    this.eventEmitter.emit('movie:download-backdrop', {
                        movie_id: movie_id,
                        lib_id: payload.media_lib_id || '',
                        path: payload.path || '',
                        backdrop: payload.backdrop || '',
                    })
                }
                if (payload.casts) {
                    this.eventEmitter.emit('movie:update-casts', {
                        movie_id: movie_id,
                        lib_id: payload.media_lib_id,
                        casts: payload.casts
                    })
                }
                if (payload.crews) {
                    this.eventEmitter.emit('movie:update-crews', {
                        movie_id: movie_id,
                        lib_id: payload.media_lib_id,
                        crews: payload.crews
                    })
                }
                this.eventEmitter.emit('render:list-view:update', {
                    lib_id: payload.media_lib_id,
                    movie: {
                        ...new_movie,
                        id: movie_id
                    }
                })
            }
            let movie_id = payload.movie_id
            let old_movie = await this.knex('movies').where({
                id: movie_id
            }).first().catch(err => {
                console.log('入库时未查询到信息', movie_id, payload.name, err);
            })
            let new_movie: MovieInfo = {
                is_scraped: true,
                is_scraped_at: new Date(),
                name: payload.name,
                year: payload.year,
                duration: payload.duration,
                poster: payload.poster,
                backdrop: payload.backdrop,
                genres: payload.genres,
                summary: payload.summary,
                release_date: payload.release_date,
                language: payload.language,
                spoken_languages: payload.spoken_languages,
                country: payload.country,
                original_title: payload.original_title,
                imdb_id: payload.imdb_id,
                imdb_sid: payload.imdb_sid,
                imdb_url: payload.imdb_url,
                imdb_rating: payload.imdb_rating,
                imdb_votes: payload.imdb_votes
            }
            if (old_movie) {
                await this.knex('movies').where({
                    id: movie_id
                }).update(new_movie).then((res) => {
                    afterUpdate(movie_id)
                }).catch(err => {
                    console.log('更新失败', movie_id, payload.name, err);
                })
            } else {
                await this.knex('movies').insert(new_movie).then((res) => {
                    movie_id = res[0]
                    afterUpdate(movie_id)
                }).catch(err => {
                    console.log('新增失败', payload.name, err);
                })
            }
        })
        /**
         * 下载海报并保存海报信息
         */
        this.eventEmitter.on('movie:download-poster', async (payload) => {
            console.log('movie:download-poster', payload)
            let { movie_id, lib_id, path: file_path, poster } = payload
            const poster_path = file_path.replace(/\\/ig, '/') + '.poster.jpg'
            if (poster) {

                if (!fs.existsSync(poster_path)) {
                    axios.get(poster, {
                        responseType: 'stream',
                        adapter: RequestAdapter as any,
                        // proxy: false,
                        // httpsAgent: application.buildHttpsTunnelAgent()
                    }).then((response) => {
                        const rs = response.data
                        const ws = fs.createWriteStream(poster_path)
                        rs.pipe(ws)
                        this.eventEmitter.emit('render:list-view:update', {
                            lib_id,
                            movie: {
                                poster: 'http://127.0.0.1:6877/api/movie/poster/' + movie_id + '?v=' + Date.now(),
                                id: movie_id
                            }
                        })
                    }).catch(err => {
                        console.log('下载海报失败', err)
                    });
                }

                this.knex('movies').update({
                    poster: path.basename(poster_path),
                    poster_url: poster
                }).where({
                    id: movie_id
                }).catch(err => {
                    console.log('更新海报失败', err)
                })
            }
        })
        /**
         * 下载海报并保存海报信息
         */
        this.eventEmitter.on('movie:download-backdrop', async (payload) => {
            console.log('movie:download-backdrop', payload)
            let { movie_id, lib_id, path: file_path, backdrop } = payload
            const backdrop_path = file_path.replace(/\\/ig, '/') + '.backdrop.jpg'

            if (backdrop) {
                if (!fs.existsSync(backdrop_path)) {
                    axios.get(backdrop, {
                        responseType: 'stream',
                        adapter: RequestAdapter as any,
                        // proxy: false,
                        // httpsAgent: application.buildHttpsTunnelAgent()
                    }).then((response) => {
                        const rs = response.data
                        const ws = fs.createWriteStream(backdrop_path)
                        rs.pipe(ws)
                    }).catch(err => {
                        console.log('下载背景图失败', err)
                    });
                }

                this.knex('movies').update({
                    backdrop: path.basename(backdrop_path),
                    backdrop_url: backdrop
                }).where({
                    id: movie_id
                }).catch(err => {
                    console.log('更新背景图失败', err)
                })
            }
        })
        /**
         * 更新电影演职员信息
         */
        this.eventEmitter.on('movie:update-casts', async (payload: any) => {
            for (let cast of payload.casts) {
                this.update_movie_actor(payload, {
                    ...cast,
                    job: "Actor"
                })
            }
        })
        /**
         * 更新电影演职员信息
         */
        this.eventEmitter.on('movie:update-crews', async (payload: any) => {
            for (let crew of payload.crews) {
                this.update_movie_actor(payload, {
                    ...crew,
                    character: ''
                })
            }
        })
    }
    /**
     * 更新电影演职员信息
     */
    async update_movie_actor(payload: any, actorInfo: any) {
        console.log('update-actors', actorInfo.id, actorInfo.name, actorInfo.character, actorInfo.department, actorInfo.job)
        // 查询是否已经存在
        let actor = await this.knex('actors').where({
            imdb_sid: actorInfo.id
        }).first().catch(err => console.log('查询演职员错误', err))
        let actor_id = 0
        if (actor) {
            actor_id = actor.id
            await this.knex('actors').where({
                id: actor_id,
                imdb_sid: actorInfo.id
            }).update({
                name: actorInfo.name,
                gender: actorInfo.gender,
                avatar: actorInfo.profile_path
            }).catch(err => console.log('更新演职员错误', err))
        } else {
            let ids = await this.knex('actors').insert({
                imdb_sid: actorInfo.id,
                name: actorInfo.name,
                gender: actorInfo.gender,
                avatar: actorInfo.profile_path
            }).catch(err => console.log('新增演职员错误', err))
            if (ids) {
                actor_id = ids[0] as number
            }
        }
        // 只对演员做处理
        if (actor_id && ['Actor', 'Director', 'Writer', 'Editor'].indexOf(actorInfo.job) > -1) {
            if (!(actor || {}).is_scraped) {
                // 去刮削演职员信息
                this.eventEmitter.emit('scraper-queue:add-task', {
                    task_event: 'scraper:start:fetch-cast',
                    task_priority: 5,
                    payload: {
                        name: actorInfo.name,
                        actor_id: actor_id,
                        imdb_sid: actorInfo.id,
                        imdb_id: ''
                    } as ScraperCastRequestPayload
                } as ScraperInitTask);
            }
            // 查询是否已经存在对应关系
            let actor_movie = await this.knex('actor_movie').where({
                actor_id,
                movie_id: payload.movie_id,
                job: actorInfo.job
            }).first().catch(err => console.log('查询影视-演职员关系错误', err))
            if (!actor_movie) {
                await this.knex('actor_movie').insert({
                    actor_id,
                    movie_id: payload.movie_id,
                    department: actorInfo.department,
                    character: actorInfo.character,
                    job: actorInfo.job
                }).catch(err => console.log('新增影视-演职员关系错误', err))
            }
        }
    }
}
export default movieMsg