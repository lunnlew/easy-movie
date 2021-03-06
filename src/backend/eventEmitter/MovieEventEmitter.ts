
import fs from 'fs'
import path from 'path'
import { ApplicationType } from '@/types/Application'
import { MovieFields } from '@/types/Movie'
import { MovieCastsPayload, MovieEventEmitterType } from '@/types/MovieEventEmitterType'
import { CastFields } from '@/types/Cast'
import Downloader from '../utils/downloader'
import gennfo from '../utils/gennfo'

/**
 * 演员相关消息事件
 */
export default class MovieEventEmitter implements MovieEventEmitterType {
    app: ApplicationType
    constructor(app: ApplicationType) {
        console.log('MovieEventEmitter')
        this.app = app
        this.initialize()
    }
    async initialize() {
        /**
         * 保存影视信息
         */
        this.app.event.on('movie:save-info', async (payload) => {
            var afterUpdate = (movie_id: number) => {
                if (payload.poster) {
                    this.app.event.emit('movie:download-poster', {
                        id: movie_id,
                        media_lib_id: payload.media_lib_id || '',
                        path: payload.path || '',
                        poster: payload.poster || '',
                        resource_type: payload.resource_type,
                    })
                }
                if (payload.backdrop) {
                    this.app.event.emit('movie:download-backdrop', {
                        id: movie_id,
                        media_lib_id: payload.media_lib_id || '',
                        path: payload.path || '',
                        backdrop: payload.backdrop || '',
                        resource_type: payload.resource_type,
                    })
                }
                if (payload.casts) {
                    this.app.event.emit('movie:update-casts', {
                        id: movie_id,
                        media_lib_id: payload.media_lib_id,
                        path: payload.path || '',
                        casts: payload.casts,
                        resource_type: payload.resource_type,
                    })
                }
                if (payload.crews) {
                    this.app.event.emit('movie:update-crews', {
                        id: movie_id,
                        media_lib_id: payload.media_lib_id,
                        path: payload.path || '',
                        crews: payload.crews,
                        resource_type: payload.resource_type,
                    })
                }
                this.app.event.emit('render:list-view:update', {
                    lib_id: payload.media_lib_id,
                    movie: {
                        ...new_movie,
                        id: movie_id,
                        movie_id: movie_id,
                    }
                })
            }
            let movie_id = payload.id
            let old_movie = await this.app.knex('movies').where({
                id: movie_id
            }).first().catch(err => {
                console.log('入库时未查询到信息', movie_id, payload.name_cn, err);
            })
            let new_movie: MovieFields = {
                is_scraped: true,
                is_scraped_at: Date.now(),
                name_cn: payload.name_cn,
                name_en: payload.name_en,
                year: payload.year,
                duration: payload.duration,
                poster: payload.poster,
                backdrop: payload.backdrop,
                genres: payload.genres,
                summary: payload.summary,
                release_date: payload.release_date,
                language: payload.language,
                spoken_language: payload.spoken_language,
                original_language: payload.original_language,
                country: payload.country,
                original_title: payload.original_title,
                imdb_id: payload.imdb_id,
                imdb_sid: payload.imdb_sid,
                imdb_url: payload.imdb_url,
                imdb_rating: payload.imdb_rating,
                imdb_votes: payload.imdb_votes
            }
            if (old_movie) {
                await this.app.knex('movies').where({
                    id: movie_id
                }).update({
                    ...new_movie,
                    updated_at: Date.now()
                }).then((res) => {
                    afterUpdate(movie_id)
                }).catch(err => {
                    console.log('更新失败', movie_id, payload.name_cn, err);
                })
            } else {
                await this.app.knex('movies').insert({
                    ...new_movie,
                    created_at: Date.now(),
                    updated_at: Date.now()
                }).then((res) => {
                    movie_id = res[0]
                    afterUpdate(movie_id)
                }).catch(err => {
                    console.log('新增失败', payload.name_cn, err);
                })
            }
        })
        /**
         * 下载海报并保存海报信息
         */
        this.app.event.on('movie:download-poster', async (payload) => {
            console.log('movie:download-poster', payload)
            let { id, media_lib_id, path: file_path, poster, resource_type } = payload
            let poster_path = file_path.replace(/\\/ig, '/')
            if (resource_type === 'origin-disk') {
                poster_path = poster_path + '/' + path.basename(poster_path) + '.poster.jpg'
            } else {
                poster_path = poster_path + '.poster.jpg'
            }
            if (poster) {

                if (!fs.existsSync(poster_path)) {
                    new Downloader().download(poster, poster_path).then(() => {
                        this.app.event.emit('render:list-view:update', {
                            lib_id: media_lib_id,
                            movie: {
                                poster: 'movie/poster/' + id + '?v=' + Date.now(),
                                id: id
                            } as any
                        })
                    }).catch(err => {
                        console.log('下载海报失败', err)
                    })
                }

                this.app.knex('movies').update({
                    poster: path.basename(poster_path),
                    poster_url: poster,
                    updated_at: Date.now()
                }).where({
                    id: id
                }).catch(err => {
                    console.log('更新海报失败', err)
                })
            }
        })
        /**
         * 下载海报并保存海报信息
         */
        this.app.event.on('movie:download-backdrop', async (payload) => {
            console.log('movie:download-backdrop', payload)
            let { id, media_lib_id, path: file_path, backdrop, resource_type } = payload

            let backdrop_path = file_path.replace(/\\/ig, '/')
            if (resource_type === 'origin-disk') {
                backdrop_path = backdrop_path + '/' + path.basename(backdrop_path) + '.backdrop.jpg'
            } else {
                backdrop_path = backdrop_path + '.backdrop.jpg'
            }

            if (backdrop) {
                if (!fs.existsSync(backdrop_path)) {
                    new Downloader().download(backdrop, backdrop_path).catch(err => {
                        console.log('下载幕布失败', err)
                    })
                }

                this.app.knex('movies').update({
                    backdrop: path.basename(backdrop_path),
                    backdrop_url: backdrop,
                    updated_at: Date.now()
                }).where({
                    id: id
                }).catch(err => {
                    console.log('更新幕布失败', err)
                })
            }
        })
        /**
         * 更新电影演员信息
         */
        this.app.event.on('movie:update-casts', async (payload) => {
            for (let cast of payload.casts) {
                this.update_movie_actor(payload, {
                    ...cast,
                    job: "Actor"
                } as any)
            }
        })
        /**
         * 更新电影职员信息
         */
        this.app.event.on('movie:update-crews', async (payload) => {
            for (let crew of payload.crews) {
                this.update_movie_actor(payload as any, {
                    ...crew,
                    character: ''
                } as any)
            }
        })
        /**
         * 生成NFO信息
         */
        this.app.event.on('movie:generate-nfo', (payload) => new gennfo().generate(payload))
    }
    /**
     * 更新电影演职员信息
     */
    async update_movie_actor(payload: MovieCastsPayload, actorInfo: CastFields) {
        console.log('update-actors', actorInfo.id, actorInfo.name_cn || actorInfo.name_en, actorInfo.character, actorInfo.department, actorInfo.job)
        // 查询是否已经存在
        let actor = await this.app.knex('actors').where({
            imdb_sid: actorInfo.id
        }).first().catch(err => console.log('查询演职员错误', err))
        let actor_id = 0
        if (actor) {
            actor_id = actor.id
            await this.app.knex('actors').where({
                id: actor_id,
                imdb_sid: actorInfo.id
            }).update({
                name_cn: actorInfo.name_cn,
                name_en: actorInfo.name_en,
                gender: actorInfo.gender,
                avatar: actorInfo.avatar,
                updated_at: Date.now()
            }).catch(err => console.log('更新演职员错误', err))
        } else {
            let ids = await this.app.knex('actors').insert({
                imdb_sid: actorInfo.id,
                name_cn: actorInfo.name_cn,
                name_en: actorInfo.name_en,
                gender: actorInfo.gender,
                avatar: actorInfo.avatar,
                created_at: Date.now(),
                updated_at: Date.now()
            }).catch(err => console.log('新增演职员错误', err))
            if (ids) {
                actor_id = ids[0] as number
            }
        }
        // 只对演员做处理
        if (actor_id && ['Actor', 'Director', 'Writer', 'Editor'].indexOf(actorInfo.job) > -1) {
            if (!(actor || {}).is_scraped) {
                // 去刮削演职员信息
                this.app.event.emit('scraper-queue:add-task', {
                    task_event: 'scraper:start:fetch-cast',
                    task_priority: 5,
                    payload: {
                        name: actorInfo.name_en || actorInfo.name_cn,
                        actor_id: actor_id,
                        path: payload.path,
                        resource_type: payload.resource_type,
                        imdb_sid: actorInfo.id
                    }
                });
            }
            // 查询是否已经存在对应关系
            let actor_movie = await this.app.knex('actor_movie').where({
                actor_id,
                movie_id: payload.id,
                job: actorInfo.job
            }).first().catch(err => console.log('查询影视-演职员关系错误', err))
            if (!actor_movie) {
                await this.app.knex('actor_movie').insert({
                    actor_id,
                    movie_id: payload.id,
                    department: actorInfo.department,
                    character: actorInfo.character,
                    job: actorInfo.job,
                    created_at: Date.now(),
                    updated_at: Date.now()
                }).catch(err => console.log('新增影视-演职员关系错误', err))
            }
        }
    }
}