
import { ApplicationType } from '@/types/Application'
import { CastFields } from '@/types/Cast'
import path from 'path'
import fs from 'fs'
import { CastEventEmitterType } from '@/types/CastEventEmitterType'
import Downloader from '../utils/downloader'
import { home_dir } from '../preference'

/**
 * 演员相关消息事件
 */
export default class CastEventEmitter implements CastEventEmitterType {
    app: ApplicationType
    constructor(app: ApplicationType) {
        console.log('CastEventEmitter')
        this.app = app
        this.initialize()
    }
    initialize() {
        this.app.event.on('cast:save-info', async (payload) => {
            var afterUpdate = (actor: {
                actor_id: number,
                imdb_id: string,
                imdb_sid: number,
            }) => {
                if (payload.avatar) {
                    this.app.event.emit('cast:download-avator', {
                        imdb_id: actor.imdb_id,
                        imdb_sid: actor.imdb_sid,
                        id: actor.actor_id,
                        path: payload.path,
                        resource_type: payload.resource_type,
                        avatar: payload.avatar
                    })
                }
            }
            let actor_id = payload.id
            let old_actor = await this.app.knex('actors').where({
                id: actor_id
            }).first().catch(err => {
                console.log('入库时未查询到信息', actor_id, payload.name_cn, err);
            })
            let new_actor: CastFields = {
                is_scraped: true,
                is_scraped_at: Date.now(),
                name_cn: payload.name_cn,
                name_en: payload.name_en,
                imdb_sid: payload.imdb_sid,
                imdb_id: payload.imdb_id,
                imdb_url: payload.imdb_url,
                gender: payload.gender,
                avatar: payload.avatar,
                birthday: payload.birthday,
                deathday: payload.deathday,
                place_of_birth: payload.place_of_birth,
                also_known_as: payload.also_known_as,
            }
            if (old_actor) {
                await this.app.knex('actors').where({
                    id: actor_id
                }).update({
                    ...new_actor,
                    updated_at: Date.now()
                }).then((res) => {
                    afterUpdate({
                        actor_id,
                        imdb_id: payload.imdb_id,
                        imdb_sid: payload.imdb_sid
                    })
                }).catch(err => {
                    console.log('更新失败', actor_id, payload.name_cn, err);
                })
            } else {
                await this.app.knex('actors').insert({
                    ...new_actor,
                    created_at: Date.now(),
                    updated_at: Date.now()
                }).then((res) => {
                    actor_id = res[0]
                    afterUpdate({
                        actor_id,
                        imdb_id: payload.imdb_id,
                        imdb_sid: payload.imdb_sid
                    })
                }).catch(err => {
                    console.log('新增失败', payload.name_cn, err);
                })
            }
        }
        )
        this.app.event.on('cast:download-avator', async (payload) => {
            console.log('cast:download-avator', payload)
            let { id, imdb_id, imdb_sid, path: file_path, resource_type, avatar } = payload

            let avatar_dir = home_dir + `/.avatar/`
            if (!fs.existsSync(avatar_dir)) {
                fs.mkdirSync(avatar_dir)
            }
            let avatar_path = avatar_dir + `sid-${imdb_sid}-imdb-${imdb_id}.jpg`
            if (avatar) {
                if (!fs.existsSync(avatar_path)) {
                    new Downloader().download(avatar, avatar_path).catch(err => {
                        console.log('下载演员图片失败', err)
                    })
                }

                this.app.knex('actors').update({
                    avatar: path.basename(avatar_path),
                    avatar_url: avatar,
                    updated_at: Date.now()
                }).where({
                    id: id
                }).catch(err => {
                    console.log('更新演员图片失败', err)
                })
            }
        })
    }
}