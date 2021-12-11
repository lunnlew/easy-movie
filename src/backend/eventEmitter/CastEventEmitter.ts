
import { ApplicationType } from '@/types/Application'
import { CastFields } from '@/types/Cast'
import { CastEventEmitterType } from '@/types/CastEventEmitterType'

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
            var afterUpdate = (actor_id: number) => {
                if (payload.avatar) {
                    this.app.event.emit('cast:download-avator', {
                        id: actor_id,
                        avatar: payload.avatar
                    })
                }
            }
            let actor_id = payload.id
            let old_actor = await this.app.knex('actors').where({
                id: actor_id
            }).first().catch(err => {
                console.log('入库时未查询到信息', actor_id, payload.name, err);
            })
            let new_actor: CastFields = {
                is_scraped: true,
                is_scraped_at: new Date(),
                name: payload.name,
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
                }).update(new_actor).then((res) => {
                    afterUpdate(actor_id)
                }).catch(err => {
                    console.log('更新失败', actor_id, payload.name, err);
                })
            } else {
                await this.app.knex('actors').insert(new_actor).then((res) => {
                    actor_id = res[0]
                    afterUpdate(actor_id)
                }).catch(err => {
                    console.log('新增失败', payload.name, err);
                })
            }
        }
        )
        this.app.event.on('cast:download-avator', async (payload) => {
            console.log('cast:download-avator', payload)
        })
    }
}