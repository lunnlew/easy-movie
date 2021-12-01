import dataM from '../database/DataM'
import { PersonInfo } from '../types/index'
import { GlobalEventType } from './GlobalEventEmitter'
class castMsg {
    eventEmitter
    knex
    constructor(eventEmitter: GlobalEventType) {
        this.eventEmitter = eventEmitter
        this.knex = dataM.knexInstance
        this.initialize()
    }
    async initialize() {
        this.eventEmitter.on('cast:save-info', async (payload) => {
            var afterUpdate = (actor_id: number) => {
                if (payload.avatar) {
                    this.eventEmitter.emit('cast:download-avator', {
                        actor_id: actor_id,
                        avatar: payload.avatar
                    })
                }
            }
            let actor_id = payload.actor_id
            let old_actor = await this.knex('actors').where({
                id: actor_id
            }).first().catch(err => {
                console.log('入库时未查询到信息', actor_id, payload.name, err);
            })
            let new_actor: PersonInfo = {
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
                await this.knex('actors').where({
                    id: actor_id
                }).update(new_actor).then((res) => {
                    afterUpdate(actor_id)
                }).catch(err => {
                    console.log('更新失败', actor_id, payload.name, err);
                })
            } else {
                await this.knex('actors').insert(new_actor).then((res) => {
                    actor_id = res[0]
                    afterUpdate(actor_id)
                }).catch(err => {
                    console.log('新增失败', payload.name, err);
                })
            }
        })
        this.eventEmitter.on('cast:download-avator', async (payload) => {
            console.log('cast:download-avator', payload)
        })
    }
}
export default castMsg